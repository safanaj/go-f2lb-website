package txbuilder

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/safanaj/cardano-go"
	"github.com/safanaj/cardano-go/bech32"
	"github.com/safanaj/cardano-go/crypto"

	"github.com/safanaj/go-f2lb/pkg/caches/koiosutils"
	"github.com/safanaj/go-f2lb/pkg/ccli"
	"github.com/safanaj/go-f2lb/pkg/logging"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

type txDone struct {
	hash      string
	submitted bool
}

type DumpPayerData struct {
	Metadata2Utxo map[string][]cardano.UTxO `json:"metadata2utxo"`
	Utxos         []cardano.UTxO            `json:"utxos"`
	Processing    []cardano.UTxO            `json:"processing"`
	Pending       map[string][]cardano.UTxO `json:"pending"`
}

type delegReqData struct {
	saddr, poolid, member, utxoid string
	resCh                         chan string
}

type Payer struct {
	logging.Logger
	ctx context.Context
	pp  *cardano.ProtocolParams
	kc  *koiosutils.KoiosClient

	axsk crypto.XPrvKey
	addr cardano.Address

	refreshCh chan struct{}
	txDoneCh  chan txDone
	dumpCh    chan chan DumpPayerData

	delegReqCh      chan delegReqData
	utxos           map[string][]*cardano.UTxO
	tx2md           map[string]string
	processingUTxOs []*cardano.UTxO
	md2UTxOs        map[string][]**cardano.UTxO
	pendingTxs      map[string][]**cardano.UTxO
}

var (
	secretsFilePath, passphrase string

	payer *Payer
)

func GetPayer() *Payer { return payer }
func NewPayer(ctx context.Context, logger logging.Logger) (*Payer, error) {
	if secretsFilePath == "" {
		return nil, nil
	}

	if fi, err := os.Stat(secretsFilePath); err != nil {
		return nil, err
	} else if fi.IsDir() {
		return nil, SecretsFilePathIsDir
	} else if fi.Mode().Perm()&0400 == 0 {
		return nil, SecretsFilePathIsNotReadable
	}

	secretsData, err := loadSecrets()
	if err != nil {
		return nil, err
	}

	pp, err := getProtocolParameters(ctx)
	if err != nil {
		logger.Error(err, "getProtocolParameters failed")
		return nil, err
	}

	xprv, err := crypto.NewXPrvKey(secretsData["addr_xsk"])
	if err != nil {
		return nil, err
	}

	svkh, err := cardano.NewHash28(utils.Bech32ToHexOrDie(secretsData["stake_vkh"]))
	if err != nil {
		return nil, err
	}

	akc, err := cardano.NewKeyCredential(xprv.PubKey())
	if err != nil {
		return nil, err
	}

	skc, err := cardano.NewKeyCredentialFromHash(svkh)
	if err != nil {
		return nil, err
	}

	addr, err := cardano.NewBaseAddress(cardano.Mainnet, akc, skc)
	if err != nil {
		return nil, err
	}

	payer = &Payer{
		Logger:          logger,
		ctx:             ctx,
		pp:              pp,
		kc:              koiosutils.New(ctx),
		axsk:            xprv,
		addr:            addr,
		refreshCh:       make(chan struct{}),
		txDoneCh:        make(chan txDone),
		delegReqCh:      make(chan delegReqData),
		dumpCh:          make(chan chan DumpPayerData),
		utxos:           make(map[string][]*cardano.UTxO),
		processingUTxOs: make([]*cardano.UTxO, 0, 0),
		md2UTxOs:        make(map[string][]**cardano.UTxO),
		pendingTxs:      make(map[string][]**cardano.UTxO),
	}
	go payer.Run()
	return payer, nil
}

func (p *Payer) GetAddress() cardano.Address { return p.addr }

func (p *Payer) refreshFilteredUTxOs() error {
	utxos, err := getUTxOs(p.ctx, p.addr)
	if err != nil {
		p.Error(err, "getUTxOs failed")
		return err
	}

	txHashes := []string{}
	for _, utxo := range utxos {
		txHashes = append(txHashes, utxo.TxHash.String())
	}
	res, err := p.kc.GetTxsMetadata(txHashes)
	if err != nil {
		p.Error(err, "GetTxsMetadata failed")
		return err
	}

	_utxos := make(map[string][]*cardano.UTxO)
	_md2UTxOs := make(map[string][]**cardano.UTxO)
	_tx2md := make(map[string]string)

	for tx, msg := range res {
		if strings.HasPrefix(msg, "F2LB:") {
			k := "shared"
			parts := strings.Split(msg, ":")
			if len(parts) > 1 {
				for _, subpart := range strings.Split(parts[1], " ") {
					if subpart != "" {
						k = strings.ToLower(subpart)
						break
					}
				}
			}
			_tx2md[tx] = k
		}
	}

	p.V(5).Info("refreshing utxos", "tx2md", _tx2md)

	for _, utxo := range utxos {
		if k, ok := _tx2md[utxo.TxHash.String()]; ok {
			if a, ok := _utxos[utxo.TxHash.String()]; ok {
				a = append(a, utxo)
			} else {
				_utxos[utxo.TxHash.String()] = []*cardano.UTxO{utxo}
			}

			autxos := _utxos[utxo.TxHash.String()]
			putxo := &autxos[len(autxos)-1]

			if a, ok := _md2UTxOs[k]; ok {
				a = append(a, putxo)
			} else {
				_md2UTxOs[k] = []**cardano.UTxO{putxo}
			}
		}
	}

	p.V(5).Info("refreshing utxos", "utxos", _utxos, "md2utxos", _md2UTxOs)

	p.utxos = _utxos
	p.tx2md = _tx2md
	p.md2UTxOs = _md2UTxOs
	return nil
}

func (p *Payer) emptyRefreshChannel() {
	for {
		select {
		case <-p.refreshCh:
			continue
		default:
			return
		}
	}
}

func getUtxoHinted(hint_ string) (*cardano.UTxO, error) {
	parts := strings.Split(hint_, "|")
	in := parts[0]
	out := parts[1]
	inparts := strings.Split(in, "#")
	outparts := strings.Split(out, ":")
	txIdx_ := inparts[1]
	amount_ := outparts[1]
	addr_ := outparts[0]
	txHash_ := inparts[0]

	txHash, err := cardano.NewHash32(txHash_)
	if err != nil {
		return nil, err
	}

	txIdx, err := strconv.ParseUint(txIdx_, 10, 64)
	if err != nil {
		return nil, err
	}

	amount, err := strconv.ParseUint(amount_, 10, 64)
	if err != nil {
		return nil, err
	}

	addr, err := cardano.NewAddress(addr_)
	if err != nil {
		return nil, err
	}

	return &cardano.UTxO{
		TxHash:  txHash,
		Index:   txIdx,
		Spender: addr,
		Amount:  cardano.NewValue(cardano.Coin(amount)),
	}, nil
}

func (p *Payer) Run() error {
	if err := p.refreshFilteredUTxOs(); err != nil {
		return err
	}
	tick := time.NewTicker(30 * time.Minute)
	for {
		select {
		case <-p.ctx.Done():
			return nil
		case <-tick.C:
			if err := p.refreshFilteredUTxOs(); err != nil {
				return err
			}
			p.emptyRefreshChannel()

		case _, more := <-p.refreshCh:
			if !more {
				return nil
			}
			if err := p.refreshFilteredUTxOs(); err != nil {
				return err
			}
			p.emptyRefreshChannel()

		case done, more := <-p.txDoneCh:
			p.Info("TX Done", "done", done, "more", more)
			if !more {
				return nil
			}
			if utxops, ok := p.pendingTxs[done.hash]; ok {
				delete(p.pendingTxs, done.hash)

				if done.submitted {
					var utxopps []***cardano.UTxO
					for _, mdutxops := range p.md2UTxOs {
						for i := range mdutxops {
							utxopps = append(utxopps, &mdutxops[i])
						}
					}

					for _, utxop := range utxops {
						for _, utxopp := range utxopps {
							if **utxopp == *utxop {
								**utxopp = nil
							}
						}
					}
				} else {
					for _, utxop := range utxops {
						hash := (*utxop).TxHash.String()
						if _, ok := p.utxos[hash]; !ok {
							p.utxos[hash] = []*cardano.UTxO{}
						}
						p.utxos[hash] = append(p.utxos[hash], *utxop)

						if msg, ok := p.tx2md[hash]; ok {
							if _, ok := p.md2UTxOs[msg]; !ok {
								p.md2UTxOs[msg] = []**cardano.UTxO{}
							}
							found := false
							for _, mdutoxp := range p.md2UTxOs[msg] {
								if *mdutoxp == *utxop {
									found = true
								}
							}
							if !found {
								p.md2UTxOs[msg] = append(p.md2UTxOs[msg], utxop)
							}
						}
					}
				}
				p.cleanAllUTxOPtrs()
				if done.submitted {
					time.AfterFunc(20*time.Second, func() {
						p.Refresh()
					})
				}
			}
		case ch := <-p.dumpCh:
			dump := DumpPayerData{
				Metadata2Utxo: make(map[string][]cardano.UTxO),
				Utxos:         make([]cardano.UTxO, 0, len(p.utxos)),
				Processing:    make([]cardano.UTxO, 0, len(p.processingUTxOs)),
				Pending:       make(map[string][]cardano.UTxO),
			}
			for k, pps := range p.md2UTxOs {
				if _, ok := dump.Metadata2Utxo[k]; !ok {
					dump.Metadata2Utxo[k] = []cardano.UTxO{}
				}
				for _, pp := range pps {
					if pp != nil {
						if *pp != nil {
							dump.Metadata2Utxo[k] = append(dump.Metadata2Utxo[k], **pp)
						}
					}
				}
			}
			for _, ps := range p.utxos {
				for _, p := range ps {
					if p != nil {
						dump.Utxos = append(dump.Utxos, *p)
					}
				}
			}
			for txhash, pps := range p.pendingTxs {
				dump.Pending[txhash] = make([]cardano.UTxO, 0, len(pps))
				for _, pp := range pps {
					if pp != nil {
						if *pp != nil {
							dump.Pending[txhash] = append(dump.Pending[txhash], **pp)
						}
					}
				}
			}
			for _, _p := range p.processingUTxOs {
				if _p != nil {
					dump.Processing = append(dump.Processing, *_p)
				}

			}
			ch <- dump

		case delegReq, ok := <-p.delegReqCh:
			if !ok {
				return nil
			}
			var hint *cardano.UTxO
			if delegReq.utxoid != "" {
				p.Info("Hint received", "utxoid", delegReq.utxoid)
				hint_, err := getUtxoHinted(delegReq.utxoid)
				if err != nil {
					p.Error(err, "trying getting utxo hint")
				}
				hint = hint_
				p.Info("Hint composed", "hint", hint)
			}

			// find an uxto for member or fallback on a shared one
			utxo_, msg := p.findUTxO(delegReq.member)
			if utxo_ == nil {
				close(delegReq.resCh)
				continue
			}

			p.processingUTxOs = append(p.processingUTxOs, utxo_)
			tx, err := p.buildDelegationTx(delegReq.saddr, delegReq.poolid, msg, utxo_, hint)
			if err != nil {
				p.Error(err, "build delegation tx failed")
				close(delegReq.resCh)
				p.cleanProcessingUTxO(utxo_)
				continue
			}

			if newTxHash, err := tx.Hash(); err == nil {
				p.pendingTxs[newTxHash.String()] = []**cardano.UTxO{&utxo_}
			} else {
				p.Error(err, "Tx hash failed")
				close(delegReq.resCh)
				return err
			}

			p.cleanProcessingUTxO(utxo_)

			delegReq.resCh <- tx.Hex()
		}
	}
}

func (p *Payer) findUTxO(member string) (*cardano.UTxO, string) {
	msg := "shared"
	txHash := ""
	sharedTxHash := ""
	for tx, m := range p.tx2md {
		if m == strings.ToLower(member) {
			txHash = tx
			msg = strings.ToLower(member)
			break
		} else if m == msg && sharedTxHash == "" {
			sharedTxHash = tx
		}
	}
	if txHash == "" {
		txHash = sharedTxHash
	}
	if txHash == "" {
		return nil, ""
	}

	var utxo_ *cardano.UTxO
	if utxos, ok := p.utxos[txHash]; ok {
		for i, utxo := range utxos {
			utxo_ = utxo
			if i == 0 {
				p.utxos[txHash] = p.utxos[txHash][1:]
			} else {
				p.utxos[txHash] = p.utxos[txHash][i-1 : i+1]
			}
			break
		}
	}
	return utxo_, msg
}

func (p *Payer) buildDelegationTx(saddr, poolid, msg string, utxo, hint *cardano.UTxO) (*cardano.Tx, error) {
	p.V(2).Info("buildDelegationTx:", "saddr", saddr, "poolid", poolid, "msg", msg, "utxo", utxo, "hint", hint)
	stakeAddr, err := cardano.NewAddress(saddr)
	if err != nil {
		p.Error(err, "Invalid stake address", "address", saddr)
		return nil, err
	}

	stakeCred, err := cardano.NewKeyCredentialFromHash(stakeAddr.Stake.KeyHash)
	if err != nil {
		p.Error(err, "Stake credential failed")
		return nil, err
	}

	_, poolKeyHash, err := bech32.DecodeToBase256(poolid)
	if err != nil {
		p.Error(err, "Pool key hash failed")
		return nil, err
	}

	cert := cardano.Certificate{
		Type:            cardano.StakeDelegation,
		StakeCredential: stakeCred,
		PoolKeyHash:     poolKeyHash,
	}

	tb := cardano.NewTxBuilder(p.pp)
	tb.AddInputs(cardano.NewTxInput(utxo.TxHash, uint(utxo.Index), utxo.Amount))
	if hint != nil {
		tb.AddInputs(cardano.NewTxInput(hint.TxHash, uint(hint.Index), hint.Amount))
		tb.AddOutputs(cardano.NewTxOutput(hint.Spender, hint.Amount))
		p.V(2).Info("Hint added to TX", "hint", hint)
	}
	tb.AddChangeIfNeeded(p.addr)
	tb.AddCertificate(cert)
	tb.AddAuxiliaryData(&cardano.AuxiliaryData{
		Metadata: map[uint]interface{}{
			674: map[string][]string{
				"msg": {fmt.Sprintf("F2LB: %s", msg)},
			},
		},
	})

	ttlAsDuration := time.Minute * 10
	tip, err := ccli.GetNodeTip(p.ctx)
	p.Info("Setting TTL", "duration", ttlAsDuration, "ttl", uint64(ttlAsDuration/time.Second), "tip", tip, "err", err)
	// tb.SetTTL(uint64(tip.Slot + uint64(ttlAsDuration/time.Second)))
	tb.SetTTL(uint64(ttlAsDuration/time.Second) + tip.Slot)

	tb.Sign(p.axsk.PrvKey())
	// this still/will be a partially signed tx, so to compute correct fee we need to set the number of the additional witness,
	// in this case there will be an additional witness for the delegation certificate.
	additionalWitnesses := uint(1)
	if hint != nil {
		additionalWitnesses = 2
	}
	tb.SetAdditionalWitnesses(additionalWitnesses)

	tx, err := tb.Build()
	if err != nil {
		p.Error(err, "Tx build failed")
		return nil, err
	}
	if txhash, err := tx.Hash(); err != nil {
		p.Error(err, "Tx build failed to comupte hash")
		return nil, err
	} else {
		time.AfterFunc(ttlAsDuration+time.Second, func() {
			p.CanceledTx(txhash.String())
			time.Sleep(100 * time.Millisecond)
			p.Refresh()
		})
	}
	return tx, nil
}

func (p *Payer) BuildDelegationTx(saddr, poolid, member, utxoid string) string {
	if saddr == "" || poolid == "" {
		return ""
	}
	delegResCh := make(chan string)
	delegReq := delegReqData{
		resCh: delegResCh,
		saddr: saddr, poolid: poolid, member: member, utxoid: utxoid,
	}
	p.delegReqCh <- delegReq
	txHex, stillOpen := <-delegResCh
	if !stillOpen {
		p.Info("BuildDelegation error response channel closed", "req", delegReq, "stillOpen", stillOpen)
		return ""
	}
	close(delegResCh)
	return txHex
}

func (p *Payer) cleanAllUTxOPtrs() {
	cleanedMd2UTxOs := make(map[string][]**cardano.UTxO)
	cleanedPendingTxs := make(map[string][]**cardano.UTxO)
	for msg, utxops := range p.md2UTxOs {
		cleaned := []**cardano.UTxO{}
		for _, utxop := range utxops {
			if *utxop == nil {
				p.Info("Clean All UTxOs (md2UTxOs)", "skip ptr", utxop)
				continue
			} else {
				p.Info("Clean All UTxOs (md2UTxOs)", "keep ptr", utxop, "keep", fmt.Sprintf("%p", *utxop), "keep utxo", **utxop)
			}
			cleaned = append(cleaned, utxop)
		}
		cleanedMd2UTxOs[msg] = cleaned
	}
	p.md2UTxOs = cleanedMd2UTxOs

	for txhash, utxosp := range p.pendingTxs {
		cleaned := []**cardano.UTxO{}
		for _, utxop := range utxosp {
			if *utxop == nil {
				p.Info("Clean All UTxOs (pendingTx)", "skip ptr", utxop)
				continue
			} else {
				p.Info("Clean All UTxOs (pendingTx)", "keep ptr", utxop)
			}
			cleaned = append(cleaned, utxop)
		}
		cleanedPendingTxs[txhash] = cleaned
	}
	p.pendingTxs = cleanedPendingTxs
}

func (p *Payer) cleanProcessingUTxO(utxo_ *cardano.UTxO) {
	for i, utxo := range p.processingUTxOs {
		if utxo == utxo_ {
			p.processingUTxOs[i] = p.processingUTxOs[len(p.processingUTxOs)-1]
			p.processingUTxOs[len(p.processingUTxOs)-1] = nil
			p.processingUTxOs = p.processingUTxOs[:len(p.processingUTxOs)-1]
		}
	}
}

func (p *Payer) Refresh()                          { p.refreshCh <- struct{}{} }
func (p *Payer) SubmittedTx(hash string)           { p.txDoneCh <- txDone{hash: hash, submitted: true} }
func (p *Payer) CanceledTx(hash string)            { p.txDoneCh <- txDone{hash: hash, submitted: false} }
func (p *Payer) DumpInto(outCh chan DumpPayerData) { p.dumpCh <- outCh }
