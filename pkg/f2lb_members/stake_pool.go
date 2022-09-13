package f2lb_members

import (
	"sync"
	"time"

	"github.com/safanaj/go-f2lb/pkg/koiosutils/accountcache"
	"github.com/safanaj/go-f2lb/pkg/koiosutils/poolcache"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

const (
	stakeAddrPrefix = "stake1"
)

func keyIsMaybeTicker(key string) bool {
	if len(key) > len(stakeAddrPrefix) && key[:len(stakeAddrPrefix)] == stakeAddrPrefix {
		return false
	}
	return true
}

type (
	StakePoolSet interface {
		Get(string) StakePool
		Del(string) StakePool
		SetWithValuesFromMainQueue(vals FromMainQueueValues) StakePool
		// unordered stake pools
		StakePools() []StakePool

		SetWithValues(
			ticker string,
			discordName string,
			adaDeclared uint16,
			epochGranted uint16,
			mainCurrPos uint16,
			stakeKeys []string,
			stakeAddrs []string,
			qpp uint16,
			delegStatus string,
			addonQStatus string,
			missedEpochs string,
			addedToGoogleGroup string,
			discordID string,
			initialAdaDeclaration string,
			startingEpochOnMainQueue uint16,
			startingEpochOnAddonQueue uint16,
			epochGrantedOnAddonQueue uint16,
		) StakePool
	}
	StakePool interface {
		Ticker() string
		DiscordName() string
		AdaDeclared() uint16
		AdaDelegated() uint16
		EpochGranted() uint16
		// epochTraded  uint16
		MainQueueCurrentPosision() uint16

		EpochGrantedOnAddonQueue() uint16
		SetEpochGrantedOnAddonQueue(uint16)

		StakeKeys() []string
		StakeAddrs() []string

		// other columns
		QPP() uint16
		DelegStatus() string  // F
		AddonQStatus() string // H
		MissedEpochs() string // J
		// addedToGoogleGroup    string // K
		// discordID             string // M
		// initialAdaDeclaration string // N

		// computed and/or from delegation cycle sheet
		StartingEpochOnMainQueue() uint16
		StartingTimeOnMainQueue() time.Time
		StartingEpochOnAddonQueue() uint16
		StartingTimeOnAddonQueue() time.Time

		MainStakeAddress() string
		MainStakeKey() string
		DelegatedPool() string
		AdaAmount() uint64
		LastDelegationTime() time.Time

		PoolIdBech32() string
		PoolIdHex() string

		ActiveStake() uint32
		LiveStake() uint32
		LiveDelegators() uint32
	}

	stakePoolSet struct {
		sync.RWMutex

		tickersMap map[string]StakePool
		saddrsMap  map[string]StakePool

		ac accountcache.AccountCache
		pc poolcache.PoolCache
	}
	stakePool struct {
		// fields from the main queue sheets
		ticker       string
		discordName  string
		adaDeclared  uint16
		epochGranted uint16
		epochTraded  uint16
		mainCurrPos  uint16

		epochGrantedOnAddonQ uint16

		stakeKeys  []string
		stakeAddrs []string

		// other columns
		qpp                   uint16
		delegStatus           string // F
		addonQStatus          string // H
		missedEpochs          string // J
		addedToGoogleGroup    string // K
		discordID             string // M
		initialAdaDeclaration string // N

		// computed and/or from delegation cycle sheet
		startingEpochOnMainQueue uint16
		// startingTimeOnMainQueue   time.Time
		startingEpochOnAddonQueue uint16
		// startingTimeOnAddonQueue  time.Time

		ac accountcache.AccountCache
		pc poolcache.PoolCache
	}
)

var (
	_ StakePoolSet = (*stakePoolSet)(nil)
	_ StakePool    = (*stakePool)(nil)
)

func NewSet(ac accountcache.AccountCache, pc poolcache.PoolCache) StakePoolSet {
	return &stakePoolSet{
		ac:         ac,
		pc:         pc,
		tickersMap: make(map[string]StakePool),
		saddrsMap:  make(map[string]StakePool),
	}
}

func New(
	ticker string,
	discordName string,
	adaDeclared uint16,
	epochGranted uint16,
	mainCurrPos uint16,

	stakeKeys []string,
	stakeAddrs []string,

	qpp uint16,
	delegStatus string,
	addonQStatus string,
	missedEpochs string,
	addedToGoogleGroup string,
	discordID string,
	initialAdaDeclaration string,
	ac accountcache.AccountCache,
	pc poolcache.PoolCache,

) StakePool {
	return &stakePool{
		ticker:       ticker,
		discordName:  discordName,
		adaDeclared:  adaDeclared,
		epochGranted: epochGranted,
		mainCurrPos:  mainCurrPos,

		stakeKeys:  stakeKeys,
		stakeAddrs: stakeAddrs,

		// other columns
		qpp:                   qpp,
		delegStatus:           delegStatus,           // F
		addonQStatus:          addonQStatus,          // H
		missedEpochs:          missedEpochs,          // J
		addedToGoogleGroup:    addedToGoogleGroup,    // K
		discordID:             discordID,             // M
		initialAdaDeclaration: initialAdaDeclaration, // N

		ac: ac,
		pc: pc,
	}
}

func (s *stakePoolSet) getLocked(key string) (sp StakePool, ok bool) {
	if keyIsMaybeTicker(key) {
		sp, ok = s.tickersMap[key]
	} else {
		sp, ok = s.saddrsMap[key]
	}
	return
}

func (s *stakePoolSet) Get(key string) StakePool {
	s.RLock()
	defer s.RUnlock()
	sp, _ := s.getLocked(key)
	return sp
}

func (s *stakePoolSet) Del(key string) StakePool {
	s.Lock()
	defer s.Unlock()
	sp, ok := s.getLocked(key)
	if ok {
		delete(s.tickersMap, sp.Ticker())
		delete(s.tickersMap, sp.MainStakeAddress())
	}
	return sp
}

func (s *stakePoolSet) SetWithValuesFromMainQueue(vals FromMainQueueValues) StakePool {
	if vals.Ticker == "" {
		return nil
	}
	nsp := &stakePool{
		ticker:                    vals.Ticker,
		discordName:               vals.DiscordName,
		adaDeclared:               vals.AD,
		epochGranted:              vals.EG,
		mainCurrPos:               vals.MainQCurrPos,
		stakeKeys:                 vals.StakeKeys,
		stakeAddrs:                vals.StakeAddrs,
		qpp:                       vals.QPP,
		delegStatus:               vals.DelegStatus,
		addonQStatus:              vals.AddonQStatus,
		missedEpochs:              vals.MissedEpochs,
		addedToGoogleGroup:        vals.AddedToGoogleGroup,
		discordID:                 vals.DiscordID,
		initialAdaDeclaration:     vals.InitialAdaDeclaration,
		startingEpochOnMainQueue:  vals.StartingEpochOnMainQueue,
		startingEpochOnAddonQueue: vals.StartingEpochOnAddonQueue,
		epochGrantedOnAddonQ:      vals.EGAQ,

		ac: s.ac,
		pc: s.pc,
	}
	s.Lock()
	defer s.Unlock()
	spI, ok := s.getLocked(nsp.Ticker())
	if !ok {
		s.tickersMap[nsp.Ticker()] = nsp
		if nsp.MainStakeAddress() != "" {
			s.saddrsMap[nsp.MainStakeAddress()] = nsp
		}
		return nsp
	}
	sp := spI.(*stakePool)
	sp.ticker = nsp.ticker
	sp.discordName = nsp.discordName
	sp.adaDeclared = nsp.adaDeclared
	sp.epochGranted = nsp.epochGranted
	sp.mainCurrPos = nsp.mainCurrPos
	sp.stakeKeys = nsp.stakeKeys
	sp.stakeAddrs = nsp.stakeAddrs
	sp.qpp = nsp.qpp
	sp.delegStatus = nsp.delegStatus
	sp.addonQStatus = nsp.addonQStatus
	sp.missedEpochs = nsp.missedEpochs
	sp.addedToGoogleGroup = nsp.addedToGoogleGroup
	sp.discordID = nsp.discordID
	sp.initialAdaDeclaration = nsp.initialAdaDeclaration
	sp.startingEpochOnMainQueue = nsp.startingEpochOnMainQueue
	sp.startingEpochOnAddonQueue = nsp.startingEpochOnAddonQueue
	sp.epochGrantedOnAddonQ = nsp.epochGrantedOnAddonQ
	sp.ac = nsp.ac
	sp.pc = nsp.pc
	return sp
}

func (s *stakePoolSet) StakePools() []StakePool {
	s.RLock()
	defer s.RUnlock()
	pools := make([]StakePool, 0, len(s.tickersMap))
	for _, sp := range s.tickersMap {
		pools = append(pools, sp)
	}
	return pools
}

func (s *stakePoolSet) SetWithValues(
	ticker string,
	discordName string,
	adaDeclared uint16,
	epochGranted uint16,
	mainCurrPos uint16,
	stakeKeys []string,
	stakeAddrs []string,
	qpp uint16,
	delegStatus string,
	addonQStatus string,
	missedEpochs string,
	addedToGoogleGroup string,
	discordID string,
	initialAdaDeclaration string,
	startingEpochOnMainQueue uint16,
	startingEpochOnAddonQueue uint16,
	epochGrantedOnAddonQueue uint16,
) StakePool {
	return s.SetWithValuesFromMainQueue(FromMainQueueValues{
		Ticker:                    ticker,
		DiscordName:               discordName,
		AD:                        adaDeclared,
		EG:                        epochGranted,
		MainQCurrPos:              mainCurrPos,
		StakeKeys:                 stakeKeys,
		StakeAddrs:                stakeAddrs,
		QPP:                       qpp,
		DelegStatus:               delegStatus,
		AddonQStatus:              addonQStatus,
		MissedEpochs:              missedEpochs,
		AddedToGoogleGroup:        addedToGoogleGroup,
		DiscordID:                 discordID,
		InitialAdaDeclaration:     initialAdaDeclaration,
		StartingEpochOnMainQueue:  startingEpochOnMainQueue,
		StartingEpochOnAddonQueue: startingEpochOnAddonQueue,
		EGAQ:                      epochGrantedOnAddonQueue,
	})
}

func (sp *stakePool) Ticker() string      { return sp.ticker }
func (sp *stakePool) DiscordName() string { return sp.discordName }
func (sp *stakePool) AdaDeclared() uint16 { return sp.adaDeclared }
func (sp *stakePool) AdaDelegated() uint16 {
	if ai, ok := sp.ac.Get(sp.MainStakeAddress()); ok {
		return uint16(ai.AdaAmount())
	}
	return 0
}
func (sp *stakePool) EpochGranted() uint16 { return sp.epochGranted }

// epochTraded  uint16
func (sp *stakePool) MainQueueCurrentPosision() uint16 { return sp.mainCurrPos }

func (sp *stakePool) EpochGrantedOnAddonQueue() uint16      { return sp.epochGrantedOnAddonQ }
func (sp *stakePool) SetEpochGrantedOnAddonQueue(eg uint16) { sp.epochGrantedOnAddonQ = eg }

func (sp *stakePool) StakeKeys() []string  { return sp.stakeKeys }
func (sp *stakePool) StakeAddrs() []string { return sp.stakeAddrs }

// other columns
func (sp *stakePool) QPP() uint16          { return sp.qpp }
func (sp *stakePool) DelegStatus() string  { return sp.delegStatus }
func (sp *stakePool) AddonQStatus() string { return sp.addonQStatus }
func (sp *stakePool) MissedEpochs() string { return sp.missedEpochs }

// addedToGoogleGroup    string // K
// discordID             string // M
// initialAdaDeclaration string // N

// computed and/or from delegation cycle sheet
func (sp *stakePool) StartingEpochOnMainQueue() uint16 { return sp.startingEpochOnMainQueue }
func (sp *stakePool) StartingTimeOnMainQueue() time.Time {
	return utils.EpochStartTime(utils.Epoch(sp.startingEpochOnMainQueue))
}
func (sp *stakePool) StartingEpochOnAddonQueue() uint16 { return sp.startingEpochOnMainQueue }
func (sp *stakePool) StartingTimeOnAddonQueue() time.Time {
	return utils.EpochStartTime(utils.Epoch(sp.startingEpochOnAddonQueue))
}

func (sp *stakePool) MainStakeAddress() string {
	if len(sp.stakeAddrs) == 0 {
		return ""
	}
	return sp.stakeAddrs[0]
}

func (sp *stakePool) MainStakeKey() string {
	if len(sp.stakeKeys) == 0 {
		return ""
	}
	return sp.stakeKeys[0]
}

func (sp *stakePool) DelegatedPool() string {
	if ai, ok := sp.ac.Get(sp.MainStakeAddress()); ok {
		dp := ai.DelegatedPool()
		if pi, ok := sp.pc.Get(dp); ok {
			return pi.Ticker()
		}
		return dp
	}
	return ""
}
func (sp *stakePool) AdaAmount() uint64 {
	if ai, ok := sp.ac.Get(sp.MainStakeAddress()); ok {
		return ai.AdaAmount()
	}
	return 0
}
func (sp *stakePool) LastDelegationTime() time.Time {
	if ai, ok := sp.ac.Get(sp.MainStakeAddress()); ok {
		return ai.LastDelegationTime()
	}
	return time.Time{}
}

func (sp *stakePool) PoolIdBech32() string {
	if pi, ok := sp.pc.Get(sp.Ticker()); ok {
		return pi.IdBech32()
	}
	return ""
}
func (sp *stakePool) PoolIdHex() string {
	if pi, ok := sp.pc.Get(sp.Ticker()); ok {
		return pi.IdHex()
	}
	return ""
}

func (sp *stakePool) ActiveStake() uint32 {
	if pi, ok := sp.pc.Get(sp.Ticker()); ok {
		return pi.ActiveStake()
	}
	return 0
}
func (sp *stakePool) LiveStake() uint32 {
	if pi, ok := sp.pc.Get(sp.Ticker()); ok {
		return pi.LiveStake()
	}
	return 0
}
func (sp *stakePool) LiveDelegators() uint32 {
	if pi, ok := sp.pc.Get(sp.Ticker()); ok {
		return pi.LiveDelegators()
	}
	return 0
}
