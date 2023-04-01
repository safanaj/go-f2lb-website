package api

import (
	"encoding/hex"
	"encoding/json"
	"net/http"
	"time"

	"golang.org/x/crypto/blake2b"

	koios "github.com/cardano-community/koios-go-client/v3"
	"github.com/gin-gonic/gin"

	"github.com/safanaj/go-f2lb/pkg/ccli"
	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/txbuilder"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

const slotInEpochForNextNonce = 302400

func RegisterApiV0(rg *gin.RouterGroup, ctrl f2lb_gsheet.Controller) {
	// queues
	rg.GET("/main-queue.json", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK,
			getMemberByTickersForApi(ctrl.GetStakePoolSet(), ctrl.GetMainQueue().GetOrdered()))
	})

	rg.GET("/addon-queue.json", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK,
			getMemberByTickersForApi(ctrl.GetStakePoolSet(), ctrl.GetAddonQueue().GetOrdered()))
	})

	rg.GET("/main-queue.csv", func(c *gin.Context) {
		res, err := getMembersAsCSVRecordsForApi(
			getMemberByTickersForApi(ctrl.GetStakePoolSet(), ctrl.GetMainQueue().GetOrdered()))
		if err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		c.Data(http.StatusOK, "application/csv", []byte(res))
	})

	rg.GET("/addon-queue.csv", func(c *gin.Context) {
		res, err := getMembersAsCSVRecordsForApi(
			getMemberByTickersForApi(ctrl.GetStakePoolSet(), ctrl.GetAddonQueue().GetOrdered()))
		if err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		c.Data(http.StatusOK, "application/csv", []byte(res))
	})

	// nonce
	kc := ctrl.GetKoiosClient().GetKoiosClient()
	ctx := ctrl.GetKoiosClient().GetContext()

	getNonceFromKoiosHandlerForEpoch := func(delta int) func(c *gin.Context) {
		return func(c *gin.Context) {
			epoch := koios.EpochNo(int(utils.CurrentEpoch()) + delta)
			opts := kc.NewRequestOptions()
			opts.QuerySet("select", "nonce")
			r, err := kc.GetEpochParams(ctx, &epoch, opts)
			if err != nil {
				c.String(http.StatusServiceUnavailable, "Error getting info from koios: %v\n", err)
				return
			}
			c.String(http.StatusOK, "%s\n", r.Data[0].Nonce)
			return
		}
	}

	rg.GET("/nonce.prev", getNonceFromKoiosHandlerForEpoch(-1))
	rg.GET("/nonce.current", getNonceFromKoiosHandlerForEpoch(0))

	rg.GET("/nonce.next", func(c *gin.Context) {
		curSlotInEpoch := int(utils.CurrentSlotInEpoch())
		if curSlotInEpoch < slotInEpochForNextNonce {
			c.String(http.StatusNotFound, "New epoch nonce not yet computable, will be available in %v\n",
				time.Duration(time.Second*time.Duration(slotInEpochForNextNonce-curSlotInEpoch)))
			return
		}
		out, err := ccli.DoCommand(ctx, "query protocol-state --mainnet")
		if err != nil {
			c.String(http.StatusServiceUnavailable, "Error getting info from cardano-node: %v\n", err)
			return
		}
		res := map[string]any{}
		err = json.Unmarshal([]byte(out), &res)
		if err != nil {
			c.String(http.StatusServiceUnavailable, "Error decoding info from cardano-node: %v\n", err)
			return
		}
		cn := res["candidateNonce"].(map[string]any)["contents"].(string)
		lebn := res["lastEpochBlockNonce"].(map[string]any)["contents"].(string)
		eta0_, err := hex.DecodeString(cn + lebn)
		if err != nil {
			c.String(http.StatusServiceUnavailable, "Error decoding info from cardano-node: %v\n", err)
			return
		}
		hash, err := blake2b.New(32, nil)
		if err != nil {
			c.String(http.StatusInternalServerError, "Error computing next nonce: %v\n", err)
			return
		}
		_, err = hash.Write(eta0_)
		if err != nil {
			c.String(http.StatusInternalServerError, "Error computing next nonce: %v\n", err)
			return
		}
		c.String(http.StatusOK, "%s\n", hex.EncodeToString((hash.Sum(nil))))
		return
	})

	// payer data
	rg.GET("/dump.payer", func(c *gin.Context) {
		payer := txbuilder.GetPayer()
		if payer == nil {
			c.IndentedJSON(http.StatusOK, map[string]string{"error": "payer not available"})
			return
		}
		outCh := make(chan txbuilder.DumpPayerData)
		payer.DumpInto(outCh)
		dumpData := <-outCh
		close(outCh)
		c.IndentedJSON(http.StatusOK, dumpData)
	})

	// block height, check signature and store reported block height by members
	rg.POST("/report/tip", getReportTipHandler(ctrl))
}
