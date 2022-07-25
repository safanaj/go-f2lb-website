package webserver

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

type WebServer interface {
	Start(bool) error
	Stop(context.Context) error
	GetGrpcServer() *grpc.Server
	GetGinEngine() *gin.Engine
	SetPathsForPages(paths, pages []string)
}

type webServer struct {
	srv *http.Server
}

func New(addr string, engine *gin.Engine) WebServer {
	rootHandler := NewRootHandler(engine)
	rootHandler.ginHandler.Use(gzip.Gzip(gzip.DefaultCompression))
	return &webServer{srv: &http.Server{Addr: addr, Handler: rootHandler}}
}

func (ws *webServer) Start(setStaticFSForApp bool) error {
	if setStaticFSForApp {
		ws.GetGinEngine().StaticFS("/_app", http.FS(appFS))
	}
	return ws.srv.ListenAndServe()
}
func (ws *webServer) Stop(ctx context.Context) error {
	return ws.srv.Shutdown(ctx)
}
func (ws *webServer) getRootHandler() *rootHandler { return ws.srv.Handler.(*rootHandler) }
func (ws *webServer) GetGrpcServer() *grpc.Server  { return ws.getRootHandler().grpcServer }
func (ws *webServer) GetGinEngine() *gin.Engine    { return ws.getRootHandler().ginHandler }
func (ws *webServer) SetPathsForPages(paths, pages []string) {
	contentType := "text/html; charset=utf-8"
	gh := ws.getRootHandler().ginHandler
	// gh.StaticFileFS("/favicon.svg", "/favicon.svg", http.FS(webFS))
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
			c.DataFromReader(http.StatusOK, fi.Size(), contentType, f, nil)

		})

		gh.HEAD(p, func(c *gin.Context) {
			c.Header("Content-Type", contentType)
			c.Header("Content-Length", fmt.Sprintf("%d", size))
			c.Status(http.StatusOK)
		})
	}
}
