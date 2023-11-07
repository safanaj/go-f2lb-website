package webserver

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"strings"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
)

type WebServer interface {
	Start(bool) error
	Stop(context.Context) error
	StartGrpcServer() error
	GetGrpcServer() *grpc.Server
	GetGrpcGw() *gwruntime.ServeMux
	GetGinEngine() *gin.Engine
	SetPathsForPages(paths, pages []string)
	GetSessionManager() SessionManager
	ListGRPCResources() []string
}

type webServer struct {
	srv            *http.Server
	grpcAddr       string
	grpcSrvStarted bool
	smStop         context.CancelFunc
	rh             *rootHandler
}

func New(addr string, engine *gin.Engine, sessionsStoreDir string, useGinAsRootHandler bool, grpcAddr string) WebServer {
	sm := NewSessionManager(sessionsStoreDir)
	rootHandler := NewRootHandler(engine, sm)
	if useGinAsRootHandler {
		rootHandler.ginHandler.Use(
			SessionInHeaderAndCookieMiddleware(sm),
			rootHandler.AsMiddleware(),
			gzip.Gzip(gzip.DefaultCompression))

		return &webServer{srv: &http.Server{Addr: addr, Handler: rootHandler.ginHandler}, rh: rootHandler, grpcAddr: grpcAddr}
	} else {
		rootHandler.ginHandler.Use(gzip.Gzip(gzip.DefaultCompression))
		return &webServer{srv: &http.Server{Addr: addr, Handler: rootHandler}, rh: rootHandler, grpcAddr: grpcAddr}
	}
}

func (ws *webServer) ListGRPCResources() []string { return ws.rh.ListGRPCResources() }

func (ws *webServer) StartGrpcServer() error {
	if ws.grpcAddr == "" {
		return nil
	}
	lis, err := net.Listen("tcp", ws.grpcAddr)
	if err != nil {
		return err
	}
	go ws.GetGrpcServer().Serve(lis)
	ws.grpcSrvStarted = true
	return nil
}

func (ws *webServer) Start(setStaticFSForApp bool) error {
	if setStaticFSForApp {
		ws.GetGinEngine().StaticFS("/_app", http.FS(appFS))
	}
	if !ws.grpcSrvStarted && ws.grpcAddr != "" {
		if err := ws.StartGrpcServer(); err != nil {
			return err
		}
	}
	smCtx, smStop := context.WithCancel(context.Background())
	ws.smStop = smStop
	ws.GetSessionManager().Start(smCtx)
	return ws.srv.ListenAndServe()
}
func (ws *webServer) Stop(ctx context.Context) error {
	ws.smStop()
	<-ws.GetSessionManager().Done()
	if ws.grpcSrvStarted {
		ws.GetGrpcServer().Stop()
	}
	return ws.srv.Shutdown(ctx)
}
func (ws *webServer) getRootHandler() *rootHandler      { return ws.rh }
func (ws *webServer) GetGrpcServer() *grpc.Server       { return ws.getRootHandler().grpcServer }
func (ws *webServer) GetGrpcGw() *gwruntime.ServeMux    { return ws.getRootHandler().grpcGw }
func (ws *webServer) GetGinEngine() *gin.Engine         { return ws.getRootHandler().ginHandler }
func (ws *webServer) GetSessionManager() SessionManager { return ws.getRootHandler().sm }
func (ws *webServer) SetPathsForPages(paths, pages []string) {
	contentType := "text/html; charset=utf-8"
	gh := ws.GetGinEngine()
	gh.StaticFileFS("/favicon.png", "/favicon.png", http.FS(webFS))
	for i, p := range paths {
		var size int64
		f, err := http.FS(webFS).Open(pages[i])
		if err != nil {
			fmt.Printf("SetPathsForPages.Open(%s).Error: %v\n", pages[i], err)
			continue
		} else {
			fi, err := f.Stat()
			if err != nil {
				fmt.Printf("SetPathsForPages.Stat(%s).Error: %v\n", pages[i], err)
				continue
			} else {
				size = fi.Size()
			}
		}

		gh.GET(p, func(c *gin.Context) {
			f, _ := http.FS(webFS).Open(pages[i])
			fi, _ := f.Stat()
			ct := contentType
			if strings.HasSuffix(fi.Name(), ".wasm") {
				ct = "application/wasm"
			}
			c.DataFromReader(http.StatusOK, fi.Size(), ct, f, nil)

		})

		gh.HEAD(p, func(c *gin.Context) {
			ct := contentType
			if strings.HasSuffix(c.Request.URL.Path, ".wasm") {
				ct = "application/wasm"
			}
			c.Header("Content-Type", ct)
			c.Header("Content-Length", fmt.Sprintf("%d", size))
			c.Status(http.StatusOK)
		})
	}
}
