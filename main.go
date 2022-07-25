package main

import (
	"context"
	"embed"
	"fmt"
	flag "github.com/spf13/pflag"
	// "net/http"
	"os"

	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/pb"
	"github.com/safanaj/go-f2lb/pkg/utils"
	"github.com/safanaj/go-f2lb/pkg/webserver"
)

var progname, version string

//go:embed all:webui/build
var rootFS embed.FS

func main() {
	showVersion := flag.Bool("version", false, "show version and exit")
	f2lb_gsheet.AddFlags(flag.CommandLine)
	flag.Parse()
	if *showVersion {
		fmt.Printf("%s %s\n", progname, version)
		os.Exit(0)
	}

	mainCtx, mainCtxCancel := context.WithCancel(context.Background())

	f2lb := f2lb_gsheet.NewF2LB(mainCtx)
	mainQueue := f2lb_gsheet.NewMainQueueOrDie(f2lb)
	addonQueue := f2lb_gsheet.NewAddonQueueOrDie(f2lb)
	supporters := f2lb_gsheet.NewSupportersOrDie(f2lb)

	mainQueueServiceServer := pb.NewMainQueueServiceServer(mainQueue)
	addonQueueServiceServer := pb.NewAddonQueueServiceServer(addonQueue)
	supportersServiceServer := pb.NewSupporterServiceServer(supporters)

	webSrv := webserver.New(":8080", nil)
	webserver.SetRootFS(rootFS)

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

	webCtx := utils.SetupShutdownSignals(mainCtx)
	go func() {
		if err := webSrv.Start(true); err != nil {
			fmt.Printf("Error: %s\n", err)
			os.Exit(1)
		}
	}()

	go func() {
		<-webCtx.Done()
		webSrv.Stop(mainCtx)
		fmt.Printf("Server shutdown done, going to close ...")
		mainCtxCancel()
	}()

	<-mainCtx.Done()
}
