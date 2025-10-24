package webserver

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/quic-go/quic-go/http3"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

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
	quicSrv        *http3.Server
	grpcAddr       string
	grpcSrvStarted bool
	smStop         context.CancelFunc
	rh             *rootHandler
}

type Options struct {
	Addr                string
	GinEngine           *gin.Engine
	SessionsStoreDir    string
	UseGinAsRootHandler bool
	GrpcAddr            string
	CACertPath          string
	CertPath            string
	KeyPath             string
}

func New(opts Options) WebServer {
	sm := NewSessionManager(opts.SessionsStoreDir)
	rootHandler := NewRootHandler(opts.GinEngine, sm)
	httpSrv := &http.Server{Addr: opts.Addr}
	quicSrv := &http3.Server{Addr: opts.Addr}

	gzipOpts := gzip.WithExcludedPathsRegexs(
		[]string{"^/v2\\..*/.*$", "^/api/v2/.*$"})

	if opts.CertPath == "" || opts.KeyPath == "" {
		rootHandler.ginHandler.UseH2C = true
	} else {
		loadCertOrDie := func() *tls.Certificate {
			tlsCert, err := tls.LoadX509KeyPair(opts.CertPath, opts.KeyPath)
			if err != nil {
				panic(err)
			}
			if tlsCert.Leaf, err = x509.ParseCertificate(tlsCert.Certificate[0]); err != nil {
				panic(err)
			}
			return &tlsCert
		}
		tlsCert := loadCertOrDie()
		httpSrv.TLSConfig = &tls.Config{
			MinVersion: tls.VersionTLS13,
			GetCertificate: func(*tls.ClientHelloInfo) (*tls.Certificate, error) {
				if tlsCert.Leaf.NotAfter.After(time.Now()) {
					tlsCert = loadCertOrDie()
				}
				return tlsCert, nil
			},
		}
		quicSrv.TLSConfig = httpSrv.TLSConfig

		// https server configuration is done on Start
		//http2.ConfigureServer(httpSrv, &http2.Server{})
		println("should have cert")
	}

	if opts.UseGinAsRootHandler {
		rootHandler.ginHandler.Use(
			SessionInHeaderAndCookieMiddleware(sm),
			rootHandler.AsMiddleware(),
			gzip.Gzip(gzip.DefaultCompression, gzipOpts))
		if quicSrv.TLSConfig != nil {
			httpSrv.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				// quicSrv.SetQUICHeaders(w.Header())
				rootHandler.ginHandler.ServeHTTP(w, r)
			})
			quicSrv.Handler = rootHandler.ginHandler
		} else {
			httpSrv.Handler = rootHandler.ginHandler
		}
		return &webServer{srv: httpSrv, quicSrv: quicSrv, rh: rootHandler, grpcAddr: opts.GrpcAddr}
	} else {
		rootHandler.ginHandler.Use(gzip.Gzip(gzip.DefaultCompression, gzipOpts))
		if quicSrv.TLSConfig != nil {
			httpSrv.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				// quicSrv.SetQUICHeaders(w.Header())
				rootHandler.ServeHTTP(w, r)
			})
			quicSrv.Handler = rootHandler
		} else {
			httpSrv.Handler = rootHandler
		}
		if rootHandler.ginHandler.UseH2C {
			// we are not running with TLS
			httpSrv.Handler = h2c.NewHandler(rootHandler, &http2.Server{})
		}
		return &webServer{srv: httpSrv, quicSrv: quicSrv, rh: rootHandler, grpcAddr: opts.GrpcAddr}
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
	if !ws.rh.ginHandler.UseH2C {
		http2.ConfigureServer(ws.srv, nil)
	}
	if ws.srv.TLSConfig == nil || ws.srv.TLSConfig.GetCertificate == nil {
		return ws.srv.ListenAndServe()
	}

	if ws.quicSrv.TLSConfig == nil {
		return ws.srv.ListenAndServeTLS("", "")
	}

	udpAddr, err := net.ResolveUDPAddr("udp", ws.quicSrv.Addr)
	if err != nil {
		return err
	}
	udpConn, err := net.ListenUDP("udp", udpAddr)
	if err != nil {
		return err
	}
	defer udpConn.Close()

	// see quic http3 ListenAndServeTLS
	hErr := make(chan error, 1)
	qErr := make(chan error, 1)
	go func() {
		hErr <- ws.srv.ListenAndServeTLS("", "")
	}()
	go func() {
		qErr <- ws.quicSrv.Serve(udpConn)
	}()

	select {
	case err := <-hErr:
		ws.quicSrv.Close()
		return err
	case err := <-qErr:
		// Cannot close the HTTP server or wait for requests to complete properly :/
		return err
	}
}

func (ws *webServer) Stop(ctx context.Context) error {
	ws.smStop()
	<-ws.GetSessionManager().Done()
	if ws.grpcSrvStarted {
		ws.GetGrpcServer().Stop()
	}
	if ws.quicSrv.TLSConfig != nil {
		defer ws.quicSrv.Shutdown(ctx)
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
