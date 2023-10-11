package webserver

import (
	"context"

	// "log"
	"net/http"

	"github.com/gin-gonic/gin"
	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"

	"github.com/safanaj/go-f2lb/pkg/logging"
)

type rootHandler struct {
	ginHandler     *gin.Engine
	grpcwebHandler *grpcweb.WrappedGrpcServer
	grpcServer     *grpc.Server
	grpcGw         *gwruntime.ServeMux
	sm             SessionManager
}

type ctxKey struct{ name string }

const IdKey = "ruuid"

var IdCtxKey = &ctxKey{name: "id"}
var log logging.Logger

func sessionInHeaderAndCookieMiddleware(sm SessionManager) func(c *gin.Context) {
	return func(c *gin.Context) {
		var (
			sid string
			sd  SessionData
		)
		req := c.Request
		w := c.Writer
		ruuid := c.GetHeader("x-session-ruuid")
		idCookie, err := req.Cookie(IdKey)
		if ruuid != "" {
			if sdata, ok := sm.Get(ruuid); ok {
				sid = ruuid
				sd = sdata
			}
		}
		if sid == "" {
			if err == http.ErrNoCookie {
				sid, sd = sm.Session()
			} else if sdata, ok := sm.Get(idCookie.Value); ok {
				sid = idCookie.Value
				sd = sdata
				idCookie.Expires = sd.Expires
			} else {
				// the cookie is there but is not a valid session, clear it on the client
				idCookie.MaxAge = -1
			}
		}

		if sid != "" {
			idCookie = &http.Cookie{Name: IdKey, Value: sid, Expires: sd.Expires}
			c.Header("x-session-ruuid", sid)
		}
		// reset Cookie Path to avoid waste storage for duplicated cookie
		idCookie.Path = "/"
		idCookie.Secure = true
		http.SetCookie(w, idCookie)

		c.Request = req.WithContext(context.WithValue(req.Context(), IdCtxKey, idCookie.Value))
		c.Next()
	}
}

func NewRootHandler(engine *gin.Engine, sm SessionManager) *rootHandler {
	log = logging.GetLogger()
	grpcServer := grpc.NewServer()
	grpcGw := gwruntime.NewServeMux()
	wrappedServer := grpcweb.WrapServer(grpcServer, grpcweb.WithWebsockets(true))
	if engine == nil {
		engine = gin.Default()
	}
	engine.Use(sessionInHeaderAndCookieMiddleware(sm))

	return &rootHandler{
		ginHandler:     engine,
		grpcwebHandler: wrappedServer,
		grpcServer:     grpcServer,
		grpcGw:         grpcGw,
		sm:             sm,
	}
}

func (h *rootHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	contentType := req.Header.Get("Content-Type")
	if h.grpcwebHandler.IsGrpcWebRequest(req) ||
		h.grpcwebHandler.IsAcceptableGrpcCorsRequest(req) ||
		h.grpcwebHandler.IsGrpcWebSocketRequest(req) ||
		contentType == "application/grpc-web+proto" {
		log.Info("A content for GRPC-Web", "proto", req.Proto, "method", req.Method, "path", req.URL.Path)
		h.grpcwebHandler.ServeHTTP(w, req)
		return
	}
	// log.Info("A content for Gin", "proto", req.Proto, "method", req.Method, "urlpath", req.URL.Path, "ct", contentType)
	h.ginHandler.ServeHTTP(w, req)
}
