package main

import (
	"context"
	"embed"
	"encoding/base64"
	"fmt"
	"html/template"
	"net/http"
	"net/http/pprof"
	"os"
	"strings"
	"time"

	flag "github.com/spf13/pflag"

	"github.com/gin-gonic/gin"

	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/swag"

	"github.com/safanaj/go-f2lb/pkg/api"
	api_v1 "github.com/safanaj/go-f2lb/pkg/api/v1"
	api_v2 "github.com/safanaj/go-f2lb/pkg/api/v2"
	"github.com/safanaj/go-f2lb/pkg/caches/blockfrostutils"
	"github.com/safanaj/go-f2lb/pkg/ccli"
	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
	"github.com/safanaj/go-f2lb/pkg/logging"

	"github.com/safanaj/go-f2lb/pkg/pinger"
	"github.com/safanaj/go-f2lb/pkg/txbuilder"
	"github.com/safanaj/go-f2lb/pkg/utils"
	"github.com/safanaj/go-f2lb/pkg/webserver"
)

var (
	progname, version   string
	listenAddr          string = ":8080"
	listenGrpcAddr      string = ":8082"
	adminPoolsStr       string = "BRNS,STPZ1"
	useGinAsRootHandler bool   = true
	certPath, keyPath   string
)

//go:embed all:webui/build
var rootFS embed.FS

type swaggerSpecBytes []byte

func (ssb swaggerSpecBytes) ReadDoc() string { return string(ssb) }

//go:embed api/v1/openapiv2/apidocs.swagger.json
var swaggerSpec swaggerSpecBytes

//go:embed api/v2/oav3/apidocs.swagger.json
var swaggerSpecV2 swaggerSpecBytes

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
	flag.StringVar(&certPath, "tls-cert", "", "")
	flag.StringVar(&keyPath, "tls-key", "", "")
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

	webSrvOpts := webserver.Options{
		Addr:                listenAddr,
		SessionsStoreDir:    f2lbCtrl.GetCachesStoreDirPath(),
		UseGinAsRootHandler: useGinAsRootHandler,
		GrpcAddr:            listenGrpcAddr,
		CertPath:            certPath,
		KeyPath:             keyPath,
	}
	webSrv := webserver.New(webSrvOpts)

	startControllerAt := time.Now()
	log.V(1).Info("Starting controller", "at", startControllerAt.Format(time.RFC850))
	if err := f2lbCtrl.Start(); err != nil {
		utils.CheckErr(err)
	}
	log.V(1).Info("Controller started", "in", time.Since(startControllerAt).String())

	api.RegisterApiV0(webSrv.GetGinEngine().Group("/api/v0"), f2lbCtrl)

	apiV1Opts := api.ApiV1Options{
		ControlMsgServiceServer: api_v1.NewControlServiceServer(f2lbCtrl, strings.Split(adminPoolsStr, ","), payer, webSrv.GetSessionManager()),
		MainQueueServiceServer:  api_v1.NewMainQueueServiceServer(f2lbCtrl.GetMainQueue(), f2lbCtrl.GetStakePoolSet()),
		AddonQueueServiceServer: api_v1.NewAddonQueueServiceServer(f2lbCtrl.GetAddonQueue(), f2lbCtrl.GetStakePoolSet()),
		SupporterServiceServer:  api_v1.NewSupporterServiceServer(f2lbCtrl.GetSupporters()),
		MemberServiceServer:     api_v1.NewMemberServiceServer(f2lbCtrl.GetDelegationCycle(), f2lbCtrl.GetStakePoolSet()),
	}

	apiV1Opts.ControlMsgServiceServer.(api_v1.ControlServiceRefresher).SetRefresherChannel(make(chan string))
	f2lbCtrl.SetRefresherChannel(apiV1Opts.ControlMsgServiceServer.(api_v1.ControlServiceRefresher).GetRefresherChannel())
	apiV1Opts.ControlMsgServiceServer.(api_v1.ControlServiceRefresher).StartRefresher(webCtx)

	api.RegisterApiV1(webCtx, webSrv.GetGinEngine().Group("/api/v1/*gw"), webSrv.GetGrpcServer(), webSrv.GetGrpcGw(), apiV1Opts)

	apiV2Opts := api.ApiV2Options{
		ControlMsgServiceHandler: api_v2.NewControlServiceHandler(webCtx, f2lbCtrl, strings.Split(adminPoolsStr, ","), payer, webSrv.GetSessionManager()),
		MainQueueServiceHandler:  api_v2.NewMainQueueServiceServer(f2lbCtrl.GetMainQueue(), f2lbCtrl.GetStakePoolSet()),
		AddonQueueServiceHandler: api_v2.NewAddonQueueServiceServer(f2lbCtrl.GetAddonQueue(), f2lbCtrl.GetStakePoolSet()),
		SupporterServiceHandler:  api_v2.NewSupporterServiceServer(f2lbCtrl.GetSupporters()),
		MemberServiceHandler:     api_v2.NewMemberServiceServer(f2lbCtrl.GetDelegationCycle(), f2lbCtrl.GetStakePoolSet()),
		KoiosHandler:             api_v2.NewKoiosService(f2lbCtrl.GetKoiosClient(), webSrv.GetSessionManager()),
		AccountCacheHandler:      api_v2.NewAccountCacheService(f2lbCtrl.GetAccountCache(), webSrv.GetSessionManager()),
		PoolCacheHandler:         api_v2.NewPoolCacheService(f2lbCtrl.GetPoolCache(), webSrv.GetSessionManager()),
	}

	apiV2Opts.ControlMsgServiceHandler.(api_v2.ControlServiceRefresher).SetRefresherChannel(make(chan string))
	f2lbCtrl.SetRefresherChannelV2(apiV2Opts.ControlMsgServiceHandler.(api_v2.ControlServiceRefresher).GetRefresherChannel())
	apiV2Opts.ControlMsgServiceHandler.(api_v2.ControlServiceRefresher).StartRefresher(webCtx)

	api.RegisterApiV2(webCtx, webSrv.GetGinEngine(), webSrv.GetGinEngine().Group("/api/v2/*connect"), apiV2Opts)

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

	// old v1 with swagger
	swagName := "f2lbApi"
	swag.Register(swagName, swaggerSpec)
	ginSwaggerHandler := ginSwagger.WrapHandler(swaggerfiles.Handler, ginSwagger.InstanceName(swagName))
	webSrv.GetGinEngine().GET("/swagger/*any", ginSwaggerHandler)

	swaggerSpecV2Base64 := base64.StdEncoding.EncodeToString(swaggerSpecV2)
	webSrv.GetGinEngine().GET("/openapi/explorer", gin.WrapH(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := tmplExplorer.Execute(w, struct{ DocumentBase64 string }{
			DocumentBase64: swaggerSpecV2Base64,
		}); err != nil {
			log.Error(err, "rendering_template", "error", err)
		}
	})))
	webSrv.GetGinEngine().GET("/openapi/rapidoc", gin.WrapH(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := tmplRapidoc.Execute(w, struct{ DocumentBase64 string }{
			DocumentBase64: swaggerSpecV2Base64,
		}); err != nil {
			log.Error(err, "rendering_template", "error", err)
		}
	})))

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

var tmplElements = template.Must(template.New("openapi-ui").Parse(`<!doctype html>
<html lang="en">
	<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>OpenAPI Documentation</title>
	<script src="https://unpkg.com/@stoplight/elements@9.0.7/web-components.min.js"></script>
	<link rel="stylesheet" href="https://unpkg.com/@stoplight/elements@9.0.7/styles.min.css">
	</head>
	<body>

	<elements-api
		id="doc"
		router="hash"
		layout="sidebar"
	/>
	<script>
	(async () => {
		const doc = document.getElementById('docs');
		doc.apiDescriptionDocument = atob("{{ .DocumentBase64 }}");
	})();
	</script>

	</body>
</html>`))

var tmplExplorer = template.Must(template.New("openapi-explorer").Parse(`<!doctype html>
<html>
  <head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>OpenAPI Explorer Documentation</title>
    <script type="module" src="https://unpkg.com/openapi-explorer@0/dist/browser/openapi-explorer.min.js"></script>
    <!-- Or use a local deployed copy -->
    <!-- <script type="module" src="node_modules/openapi-explorer/dist/openapi-explorer.min.js"></script> -->
  </head>
  <body>
    <openapi-explorer
      id="doc"
      hide-authentication
      hide-server-selection
      use-path-in-nav-bar
    > </openapi-explorer>

	<script>
        document.addEventListener("DOMContentLoaded", (e) => {
 		    document.getElementById("doc").loadSpec(JSON.parse(atob("{{ .DocumentBase64 }}")));
        });
		document.getElementById("doc").addEventListener('before-try', (e) => {
          e.detail.request.headers.append("x-please-avoid-compression", "true")
		  console.log(e)
		});
	</script>

  </body>
</html>`))

var tmplRapidoc = template.Must(template.New("openapi-rapidoc").Parse(`<!doctype html> <!-- Important: must specify -->
<html>
<head>
  <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
  <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
</head>
<body>
  <rapi-doc
    id="doc"
    render-style="reader"
    allow-authentication="false"
    theme="dark"
    show-components="true"
    allow-spec-url-load="false"
    allow-spec-file-load="false"
    allow-spec-file-download="true"
    allow-server-selection="false"
    show-curl-before-try="true"
    show-method-in-nav-bar="as-colored-block"
    schema-style="table"
  > </rapi-doc>

	<script>
        document.addEventListener("DOMContentLoaded", (e) => {
 		    document.getElementById("doc").loadSpec(JSON.parse(atob("{{ .DocumentBase64 }}")));
        });
		document.getElementById("doc").addEventListener('before-try', (e) => {
          e.detail.request.headers.append("x-please-avoid-compression", "true")
		  console.log(e)
		});
	</script>

</body>
</html>`))
