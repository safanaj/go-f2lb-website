package main

import (
	"context"
	"embed"
	"fmt"

	flag "github.com/spf13/pflag"

	"net/http"
	"net/http/pprof"

	"github.com/gin-gonic/gin"

	// "net/http"
	"os"
	"strings"
	"time"

	"github.com/safanaj/go-f2lb/pkg/api"
	"github.com/safanaj/go-f2lb/pkg/caches/blockfrostutils"
	"github.com/safanaj/go-f2lb/pkg/ccli"
	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/logging"
	"github.com/safanaj/go-f2lb/pkg/pb"
	"github.com/safanaj/go-f2lb/pkg/pinger"
	"github.com/safanaj/go-f2lb/pkg/txbuilder"
	"github.com/safanaj/go-f2lb/pkg/utils"
	"github.com/safanaj/go-f2lb/pkg/webserver"
)

var progname, version string
var listenAddr string = ":8080"
var adminPoolsStr string = "BRNS,STPZ1"

//go:embed all:webui/build
var rootFS embed.FS

func addFlags() {
	f2lb_gsheet.AddFlags(flag.CommandLine)
	logging.AddFlags(flag.CommandLine)
	ccli.AddFlags(flag.CommandLine)
	blockfrostutils.AddFlags(flag.CommandLine)
	txbuilder.AddFlags(flag.CommandLine)
	pinger.AddFlags(flag.CommandLine)
}

func main() {
	showVersion := flag.Bool("version", false, "show version and exit")
	pingerDisabled := flag.Bool("disable-pinger", false, "")
	flag.StringVar(&adminPoolsStr, "admin-pools", adminPoolsStr, "Comma separated pools with admin permission")
	flag.StringVar(&listenAddr, "listen", listenAddr, "IP:PORT or :PORT to listen on all interfaces")
	addFlags()
	flag.Parse()
	if *showVersion {
		fmt.Printf("%s %s\n", progname, version)
		os.Exit(0)
	}

	log := logging.GetLogger().WithName(progname)
	mainCtx, mainCtxCancel := context.WithCancel(context.Background())
	childCtx, childCtxCancel := context.WithCancel(mainCtx)
	webCtx := utils.SetupShutdownSignals(childCtx)
	f2lbCtrl := f2lb_gsheet.NewController(childCtx, log.WithName("f2lbController"))
	payer, err := txbuilder.NewPayer(childCtx, log.WithName("payer"))
	utils.CheckErr(err)
	if !*pingerDisabled {
		pinger.NewPinger(log.WithName("pinger")).SetController(f2lbCtrl)
	}

	controlServiceServer := pb.NewControlServiceServer(f2lbCtrl, strings.Split(adminPoolsStr, ","), payer)
	mainQueueServiceServer := pb.NewMainQueueServiceServer(f2lbCtrl.GetMainQueue(), f2lbCtrl.GetStakePoolSet())
	addonQueueServiceServer := pb.NewAddonQueueServiceServer(f2lbCtrl.GetAddonQueue(), f2lbCtrl.GetStakePoolSet())
	supportersServiceServer := pb.NewSupporterServiceServer(f2lbCtrl.GetSupporters())
	memberServiceServer := pb.NewMemberServiceServer(f2lbCtrl.GetDelegationCycle(), f2lbCtrl.GetStakePoolSet())

	controlServiceServer.(pb.ControlServiceRefresher).SetRefresherChannel(make(chan string))
	f2lbCtrl.SetRefresherChannel(controlServiceServer.(pb.ControlServiceRefresher).GetRefresherChannel())
	controlServiceServer.(pb.ControlServiceRefresher).StartRefresher(webCtx)

	startControllerAt := time.Now()
	log.V(1).Info("Starting controller", "at", startControllerAt.Format(time.RFC850))
	if err := f2lbCtrl.Start(); err != nil {
		utils.CheckErr(err)
	}
	log.V(1).Info("Controller started", "in", time.Since(startControllerAt).String())

	webSrv := webserver.New(listenAddr, nil)
	webserver.SetRootFS(rootFS)

	pb.RegisterControlMsgServiceServer(webSrv.GetGrpcServer(), controlServiceServer)
	pb.RegisterAddonQueueServiceServer(webSrv.GetGrpcServer(), addonQueueServiceServer)
	pb.RegisterMainQueueServiceServer(webSrv.GetGrpcServer(), mainQueueServiceServer)
	pb.RegisterSupporterServiceServer(webSrv.GetGrpcServer(), supportersServiceServer)
	pb.RegisterMemberServiceServer(webSrv.GetGrpcServer(), memberServiceServer)

	api.RegisterApiV0(webSrv.GetGinEngine().Group("/api/v0"), f2lbCtrl)

	pages, paths := webserver.GetPagesAndPaths()
	for i := range pages {
		if paths[i] == "/index" {
			paths[i] = "/"
		}
	}
	//webSrv.SetPathsForPages(append(paths, "/favicon.svg"), append(pages, "favicon.svg"))
	webSrv.SetPathsForPages(paths, pages)

	{
		drg := webSrv.GetGinEngine().Group("/debug")
		drg.Use(func(c *gin.Context) {
			if c.Request.Header.Get("SSL-Client-Verify") != "SUCCESS" {
				c.Status(http.StatusForbidden)
				return
			}
			c.Next()
		})
		drg.GET("/", gin.WrapF(pprof.Index))
		drg.GET("/cmdline", gin.WrapF(pprof.Cmdline))
		drg.GET("/profile", gin.WrapF(pprof.Profile))
		drg.POST("/symbol", gin.WrapF(pprof.Symbol))
		drg.GET("/symbol", gin.WrapF(pprof.Symbol))
		drg.GET("/trace", gin.WrapF(pprof.Trace))
		drg.GET("/allocs", gin.WrapH(pprof.Handler("allocs")))
		drg.GET("/block", gin.WrapH(pprof.Handler("block")))
		drg.GET("/goroutine", gin.WrapH(pprof.Handler("goroutine")))
		drg.GET("/heap", gin.WrapH(pprof.Handler("heap")))
		drg.GET("/mutex", gin.WrapH(pprof.Handler("mutex")))
		drg.GET("/threadcreate", gin.WrapH(pprof.Handler("threadcreate")))
	}

	log.Info("Starting Web Server", "in", time.Since(startControllerAt).String())
	go func() {
		if err := webSrv.Start(true); err != nil && err != http.ErrServerClosed {
			log.Error(err, "webserver")
			// os.Exit(1)
		}
	}()

	go func() {
		<-webCtx.Done()
		f2lbCtrl.Stop()
		stopWebCtx, stopWebCtxDone := context.WithTimeout(childCtx, 5*time.Second)
		defer stopWebCtxDone()
		go func() {
			webSrv.Stop(stopWebCtx)
			stopWebCtxDone()
		}()
		<-stopWebCtx.Done()
		log.V(2).Info("Server shutdown done, going to close ...")
		childCtxCancel()
		time.Sleep(1 * time.Second)
		<-childCtx.Done()
		mainCtxCancel()
	}()

	<-mainCtx.Done()
}
