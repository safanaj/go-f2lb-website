package main

import (
	"context"
	"embed"
	"fmt"

	flag "github.com/spf13/pflag"

	"net/http"
	"net/http/pprof"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/swag"

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
var listenGrpcAddr string = ":8082"
var adminPoolsStr string = "BRNS,STPZ1"
var useGinAsRootHandler bool = true

//go:embed all:webui/build
var rootFS embed.FS

type swaggerSpecBytes []byte

func (ssb swaggerSpecBytes) ReadDoc() string { return string(ssb) }

//go:embed proto/openapiv2/apidocs.swagger.json
var swaggerSpec swaggerSpecBytes

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
	exposeGrpc := flag.Bool("expose-grpc", false, "")
	flag.StringVar(&listenGrpcAddr, "listen-grpc", listenGrpcAddr, "IP:PORT or :PORT to listen on all interfaces")
	flag.BoolVar(&useGinAsRootHandler, "use-gin-as-root-handler", useGinAsRootHandler, "")
	addFlags()
	flag.Parse()
	if *showVersion {
		fmt.Printf("%s %s\n", progname, version)
		os.Exit(0)
	}

	if !(*exposeGrpc) {
		listenGrpcAddr = ""
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

	webSrv := webserver.New(listenAddr, nil, f2lbCtrl.GetCachesStoreDirPath(), useGinAsRootHandler, listenGrpcAddr)

	controlServiceServer := pb.NewControlServiceServer(f2lbCtrl, strings.Split(adminPoolsStr, ","), payer, webSrv.GetSessionManager())
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

	pb.RegisterControlMsgServiceServer(webSrv.GetGrpcServer(), controlServiceServer)
	pb.RegisterAddonQueueServiceServer(webSrv.GetGrpcServer(), addonQueueServiceServer)
	pb.RegisterMainQueueServiceServer(webSrv.GetGrpcServer(), mainQueueServiceServer)
	pb.RegisterSupporterServiceServer(webSrv.GetGrpcServer(), supportersServiceServer)
	pb.RegisterMemberServiceServer(webSrv.GetGrpcServer(), memberServiceServer)

	if useGinAsRootHandler {
		// this is an ugly solution to use Gin as root handler, and just middlweare to manage GrpcWeb stuff,
		// if we reach this handler means that the middleware did not aborted the the handlers chain,
		// so it means something is wrong with the request
		ginNoOpHandler := func(c *gin.Context) {
			c.AbortWithError(http.StatusBadRequest, fmt.Errorf("Wrong method or proto or content-type"))
		}
		for _, path := range webSrv.ListGRPCResources() {
			webSrv.GetGinEngine().POST(path, ginNoOpHandler)
		}
	}

	api.RegisterApiV0(webSrv.GetGinEngine().Group("/api/v0"), f2lbCtrl)

	pb.RegisterMainQueueServiceHandlerServer(webCtx, webSrv.GetGrpcGw(), mainQueueServiceServer)
	pb.RegisterControlMsgServiceHandlerServer(webCtx, webSrv.GetGrpcGw(), controlServiceServer)
	pb.RegisterAddonQueueServiceHandlerServer(webCtx, webSrv.GetGrpcGw(), addonQueueServiceServer)
	pb.RegisterSupporterServiceHandlerServer(webCtx, webSrv.GetGrpcGw(), supportersServiceServer)
	pb.RegisterMemberServiceHandlerServer(webCtx, webSrv.GetGrpcGw(), memberServiceServer)
	webSrv.GetGinEngine().Group("/api/v1/*grpcgw").Match([]string{"GET", "POST"}, "", gin.WrapH(webSrv.GetGrpcGw()))

	swagName := "f2lbApi"
	swag.Register(swagName, swaggerSpec)
	ginSwaggerHandler := ginSwagger.WrapHandler(swaggerfiles.Handler, ginSwagger.InstanceName(swagName))
	webSrv.GetGinEngine().GET("/swagger/*any", ginSwaggerHandler)

	webserver.SetRootFS(rootFS)
	pages, paths := webserver.GetPagesAndPaths()
	for i := range pages {
		if paths[i] == "/index" {
			paths[i] = "/"
		}
	}
	webSrv.SetPathsForPages(paths, pages)

	{
		drg := webSrv.GetGinEngine().Group("/debug")
		drg.Use(func(c *gin.Context) {
			if c.Request.Header.Get("SSL-Client-Verify") != "SUCCESS" {
				c.AbortWithStatus(http.StatusForbidden)
				return
			}
			c.Next()
		})
		drg.GET("/", gin.WrapF(pprof.Index))
		drg.GET("/cmdline", gin.WrapF(pprof.Cmdline))
		drg.GET("/profile", gin.WrapF(pprof.Profile))
		drg.Match([]string{"GET", "POST"}, "/symbol", gin.WrapF(pprof.Symbol))
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
