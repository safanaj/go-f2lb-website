package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
)

func RegisterApiV0(rg *gin.RouterGroup, ctrl f2lb_gsheet.Controller) {
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
}
