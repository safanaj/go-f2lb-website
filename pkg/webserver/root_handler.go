package webserver

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

type rootHandler struct {
	ginHandler     *gin.Engine
	grpcwebHandler *grpcweb.WrappedGrpcServer
	grpcServer     *grpc.Server
}

func NewRootHandler(engine *gin.Engine) *rootHandler {
	grpcServer := grpc.NewServer()
	wrappedServer := grpcweb.WrapServer(grpcServer)
	if engine == nil {
		engine = gin.Default()
	}
	return &rootHandler{
		ginHandler:     engine,
		grpcwebHandler: wrappedServer,
		grpcServer:     grpcServer,
	}
}

func (h *rootHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	contentType := req.Header.Get("Content-Type")
	if h.grpcwebHandler.IsGrpcWebRequest(req) ||
		h.grpcwebHandler.IsAcceptableGrpcCorsRequest(req) ||
		contentType == "application/grpc-web+proto" {
		log.Printf("A content for GRPC-Web: %s %s %s", req.Proto, req.Method, req.URL.Path)
		h.grpcwebHandler.ServeHTTP(w, req)
		return
	}
	// log.Printf("A content for Gin: %s %s %s", req.Proto, req.Method, req.URL.Path)
	h.ginHandler.ServeHTTP(w, req)
}

func (h *rootHandler) GetGrpcServer() *grpc.Server { return h.grpcServer }
