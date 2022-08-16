package main

import (
	"context"
	"embed"
	"fmt"
	flag "github.com/spf13/pflag"
	// "net/http"
	"os"
	"time"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/logging"
	"github.com/safanaj/go-f2lb/pkg/pb"
	"github.com/safanaj/go-f2lb/pkg/utils"
	"github.com/safanaj/go-f2lb/pkg/webserver"
)

var progname, version string
var listenAddr string = ":8080"

//go:embed all:webui/build
var rootFS embed.FS

func main() {
	showVersion := flag.Bool("version", false, "show version and exit")
	f2lb_gsheet.AddFlags(flag.CommandLine)
	logging.AddFlags(flag.CommandLine)
	flag.StringVar(&listenAddr, "listen", listenAddr, "IP:PORT or :PORT to listen on all interfaces")
	flag.Parse()
	if *showVersion {
		fmt.Printf("%s %s\n", progname, version)
		os.Exit(0)
	}

	log := logging.GetLogger().WithName(progname)
	mainCtx, mainCtxCancel := context.WithCancel(context.Background())
	webCtx := utils.SetupShutdownSignals(mainCtx)
	f2lbCtrl := f2lb_gsheet.NewController(mainCtx, log.WithName("f2lbController"))

	controlServiceServer := pb.NewControlServiceServer(f2lbCtrl)
	mainQueueServiceServer := pb.NewMainQueueServiceServer(f2lbCtrl.GetMainQueue(), f2lbCtrl.GetStakePoolSet())
	addonQueueServiceServer := pb.NewAddonQueueServiceServer(f2lbCtrl.GetAddonQueue(), f2lbCtrl.GetStakePoolSet())
	supportersServiceServer := pb.NewSupporterServiceServer(f2lbCtrl.GetSupporters())

	controlServiceServer.(pb.ControlServiceRefresher).SetRefresherChannel(make(chan string))
	f2lbCtrl.SetRefresherChannel(controlServiceServer.(pb.ControlServiceRefresher).GetRefresherChannel())
	controlServiceServer.(pb.ControlServiceRefresher).StartRefresher(webCtx)

	// go func() {
	startControllerAt := time.Now()
	log.V(1).Info("Starting controller", "at", startControllerAt.Format(time.RFC850))
	if err := f2lbCtrl.Start(); err != nil {
		utils.CheckErr(err)
	}
	log.V(1).Info("Controller started", "in", time.Since(startControllerAt).String())
	// }()

	webSrv := webserver.New(listenAddr, nil)
	webserver.SetRootFS(rootFS)

	pb.RegisterControlMsgServiceServer(webSrv.GetGrpcServer(), controlServiceServer)
	pb.RegisterAddonQueueServiceServer(webSrv.GetGrpcServer(), addonQueueServiceServer)
	pb.RegisterMainQueueServiceServer(webSrv.GetGrpcServer(), mainQueueServiceServer)
	pb.RegisterSupporterServiceServer(webSrv.GetGrpcServer(), supportersServiceServer)

	pages, paths := webserver.GetPagesAndPaths()
	for i, _ := range pages {
		if paths[i] == "/index" {
			paths[i] = "/"
		}
	}
	//webSrv.SetPathsForPages(append(paths, "/favicon.svg"), append(pages, "favicon.svg"))
	webSrv.SetPathsForPages(paths, pages)

	go func() {
		if err := webSrv.Start(true); err != nil {
			log.Error(err, "webserver")
			os.Exit(1)
		}
	}()

	go func() {
		<-webCtx.Done()
		f2lbCtrl.Stop()
		webSrv.Stop(mainCtx)
		log.V(2).Info("Server shutdown done, going to close ...")
		mainCtxCancel()
	}()

	<-mainCtx.Done()
}
