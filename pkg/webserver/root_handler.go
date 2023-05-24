package webserver

import (
	"context"

	// "log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"

	"github.com/safanaj/go-f2lb/pkg/logging"
)

type rootHandler struct {
	ginHandler     *gin.Engine
	grpcwebHandler *grpcweb.WrappedGrpcServer
	grpcServer     *grpc.Server
	sm             SessionManager
}

type ctxKey struct{ name string }

const IdKey = "ruuid"

var IdCtxKey = &ctxKey{name: "id"}
var log logging.Logger

func NewRootHandler(engine *gin.Engine, sm SessionManager) *rootHandler {
	log = logging.GetLogger()
	grpcServer := grpc.NewServer()
	wrappedServer := grpcweb.WrapServer(grpcServer, grpcweb.WithWebsockets(true))
	if engine == nil {
		engine = gin.Default()
	}
	return &rootHandler{
		ginHandler:     engine,
		grpcwebHandler: wrappedServer,
		grpcServer:     grpcServer,
		sm:             sm,
	}
}

func (h *rootHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	contentType := req.Header.Get("Content-Type")
	upgrade := req.Header.Get("Upgrade")
	wsProtocol := req.Header.Get("Sec-Websocket-Protocol")
	idCookie, err := req.Cookie(IdKey)
	if err == http.ErrNoCookie {
		sid, sd := h.sm.Session()
		idCookie = &http.Cookie{Name: IdKey, Value: sid, Expires: sd.Expires}
	} else if sd, ok := h.sm.Get(idCookie.Value); ok {
		idCookie.Expires = sd.Expires
	} else {
		// the cookie is there but is not a valid session, clear it on the client
		idCookie.MaxAge = -1
	}
	// reset Cookie Path to avoid waste storage for duplicated cookie
	idCookie.Path = "/"
	idCookie.Secure = true
	http.SetCookie(w, idCookie)
	rctx := context.WithValue(req.Context(), IdCtxKey, idCookie.Value)
	if h.grpcwebHandler.IsGrpcWebRequest(req) ||
		h.grpcwebHandler.IsAcceptableGrpcCorsRequest(req) ||
		contentType == "application/grpc-web+proto" ||
		(upgrade == "websocket" && wsProtocol == "grpc-websockets") {
		log.Info("A content for GRPC-Web", "proto", req.Proto, "method", req.Method, "path", req.URL.Path)
		h.grpcwebHandler.ServeHTTP(w, req.WithContext(rctx))
		return
	}
	// log.Printf("A content for Gin: %s %s %s", req.Proto, req.Method, req.URL.Path)
	h.ginHandler.ServeHTTP(w, req.WithContext(rctx))
}

func (h *rootHandler) GetGrpcServer() *grpc.Server { return h.grpcServer }
