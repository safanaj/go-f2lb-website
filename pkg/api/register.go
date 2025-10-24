package api

import (
	"context"
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"

	"connectrpc.com/connect"
	"connectrpc.com/grpchealth"
	"connectrpc.com/grpcreflect"
	"connectrpc.com/vanguard"

	gwruntime "github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"

	v0 "github.com/safanaj/go-f2lb/pkg/api/v0"
	v1 "github.com/safanaj/go-f2lb/pkg/api/v1"
	v2 "github.com/safanaj/go-f2lb/pkg/api/v2"
	"github.com/safanaj/go-f2lb/pkg/f2lb_gsheet"
)

func RegisterApiV0(rg *gin.RouterGroup, ctrl f2lb_gsheet.Controller) {
	v0.RegisterApiV0(rg, ctrl)
}

type ApiV1Options struct {
	v1.ControlMsgServiceServer
	v1.MainQueueServiceServer
	v1.AddonQueueServiceServer
	v1.SupporterServiceServer
	v1.MemberServiceServer
}

func RegisterApiV1(ctx context.Context, rg *gin.RouterGroup, grpcSrv *grpc.Server, grpcGw *gwruntime.ServeMux, opts ApiV1Options) {
	v1.RegisterControlMsgServiceServer(grpcSrv, opts.ControlMsgServiceServer)
	v1.RegisterAddonQueueServiceServer(grpcSrv, opts.AddonQueueServiceServer)
	v1.RegisterMainQueueServiceServer(grpcSrv, opts.MainQueueServiceServer)
	v1.RegisterSupporterServiceServer(grpcSrv, opts.SupporterServiceServer)
	v1.RegisterMemberServiceServer(grpcSrv, opts.MemberServiceServer)

	v1.RegisterMainQueueServiceHandlerServer(ctx, grpcGw, opts.MainQueueServiceServer)
	v1.RegisterControlMsgServiceHandlerServer(ctx, grpcGw, opts.ControlMsgServiceServer)
	v1.RegisterAddonQueueServiceHandlerServer(ctx, grpcGw, opts.AddonQueueServiceServer)
	v1.RegisterSupporterServiceHandlerServer(ctx, grpcGw, opts.SupporterServiceServer)
	v1.RegisterMemberServiceHandlerServer(ctx, grpcGw, opts.MemberServiceServer)
	rg.Match([]string{"GET", "POST"}, "", gin.WrapH(grpcGw))
}

type ApiV2Options struct {
	v2.ControlMsgServiceHandler
	v2.MainQueueServiceHandler
	v2.AddonQueueServiceHandler
	v2.SupporterServiceHandler
	v2.MemberServiceHandler
	v2.KoiosHandler
	v2.AccountCacheHandler
	v2.PoolCacheHandler
}

type regWrapper struct {
	*gin.Engine
	method string
}

func (rw regWrapper) wrapV2(svcPath string, h http.Handler) {
	if rw.method == "" {
		rw.Any(svcPath+"*any", gin.WrapH(h))
	} else {
		rw.Handle(rw.method, svcPath+"*any", gin.WrapH(h))
	}
}

type v2HandlerDetail struct {
	name, path string
	handler    http.Handler
}

func v2HandlerDetailFor(name string, opts ApiV2Options, copts []connect.HandlerOption) v2HandlerDetail {
	switch name {
	case v2.ControlMsgServiceName:
		controlPath, controlHandler := v2.NewControlMsgServiceHandler(opts.ControlMsgServiceHandler, copts...)
		return v2HandlerDetail{v2.ControlMsgServiceName, controlPath, controlHandler}
	case v2.MainQueueServiceName:
		mainQueuePath, mainQueueHandler := v2.NewMainQueueServiceHandler(opts.MainQueueServiceHandler, copts...)
		return v2HandlerDetail{v2.MainQueueServiceName, mainQueuePath, mainQueueHandler}
	case v2.AddonQueueServiceName:
		addonQueuePatch, addonQueueHandler := v2.NewAddonQueueServiceHandler(opts.AddonQueueServiceHandler, copts...)
		return v2HandlerDetail{v2.AddonQueueServiceName, addonQueuePatch, addonQueueHandler}
	case v2.SupporterServiceName:
		supporterPath, supporterHandler := v2.NewSupporterServiceHandler(opts.SupporterServiceHandler, copts...)
		return v2HandlerDetail{v2.SupporterServiceName, supporterPath, supporterHandler}
	case v2.MemberServiceName:
		memberPath, memberHandler := v2.NewMemberServiceHandler(opts.MemberServiceHandler, copts...)
		return v2HandlerDetail{v2.MemberServiceName, memberPath, memberHandler}
	case v2.KoiosName:
		koiosPath, koiosHandler := v2.NewKoiosHandler(opts.KoiosHandler, copts...)
		return v2HandlerDetail{v2.KoiosName, koiosPath, koiosHandler}
	case v2.AccountCacheName:
		acPath, acHandler := v2.NewAccountCacheHandler(opts.AccountCacheHandler, copts...)
		return v2HandlerDetail{v2.AccountCacheName, acPath, acHandler}
	case v2.PoolCacheName:
		pcPath, pcHandler := v2.NewPoolCacheHandler(opts.PoolCacheHandler, copts...)
		return v2HandlerDetail{v2.PoolCacheName, pcPath, pcHandler}
	}
	return v2HandlerDetail{}
}

func RegisterApiV2(ctx context.Context, engine *gin.Engine, rg *gin.RouterGroup, opts ApiV2Options) {
	copts := append([]connect.HandlerOption{}, connect.WithCompressMinBytes(1024))

	details := slices.Collect(func(yield func(v2HandlerDetail) bool) {
		for _, svcName := range []string{
			v2.ControlMsgServiceName,
			v2.MainQueueServiceName,
			v2.AddonQueueServiceName,
			v2.SupporterServiceName,
			v2.MemberServiceName,
			v2.KoiosName,
			v2.AccountCacheName,
			v2.PoolCacheName,
		} {
			detail := v2HandlerDetailFor(svcName, opts, copts)
			if detail.name == "" {
				continue
			}
			if !yield(detail) {
				return
			}
		}
	})
	rw := regWrapper{engine, http.MethodPost}
	for _, detail := range details {
		rw.wrapV2(detail.path, detail.handler)
	}

	names := slices.Collect(func(yield func(string) bool) {
		for _, detail := range details {
			if !yield(detail.name) {
				return
			}
		}
	})
	rw = regWrapper{engine, http.MethodPost}
	rw.wrapV2(grpchealth.NewHandler(grpchealth.NewStaticChecker(names...)))
	rw.wrapV2(grpcreflect.NewHandlerV1(grpcreflect.NewStaticReflector(names...)))
	rw.wrapV2(grpcreflect.NewHandlerV1Alpha(grpcreflect.NewStaticReflector(names...)))

	transcoder, _ := vanguard.NewTranscoder(slices.Collect(func(yield func(*vanguard.Service) bool) {
		for _, detail := range details {
			if !yield(vanguard.NewService(detail.name, detail.handler)) {
				return
			}
		}
	}))
	rg.Any("", gin.WrapH(transcoder))
	// rg.Any("", func(c *gin.Context) {
	// 	//if strings.HasSuffix(c.Request.Header.Get("referer"), "/openapi-doc") || strings.HasSuffix(c.Request.Header.Get("referer"), "/openapi-explorer") {
	// 	if c.Request.Header.Get("x-please-avoid-compression") != "" {
	// 		respRec := httptest.NewRecorder()
	// 		transcoder.ServeHTTP(respRec, c.Request)
	// 		resp := respRec.Result()
	// 		defer resp.Body.Close()
	// 		logging.GetLogger().Info("rec headers", "headers", respRec.Header())
	// 		if respRec.Header().Get("Content-Encoding") == "gzip" {
	// 			resp.Header.Del("Content-Encoding")
	// 			resp.Header.Del("Transfer-Encoding")
	// 			zr, _ := gzip.NewReader(resp.Body)
	// 			c.Writer.Header().Set("x-transcoder-response", "modified")
	// 			for k, vl := range resp.Header {
	// 				if strings.ToLower(k) == "content-encoding" {
	// 					continue
	// 				}
	// 				for _, v := range vl {
	// 					c.Writer.Header().Add(k, v)
	// 				}
	// 			}
	// 			c.Writer.WriteHeader(resp.StatusCode)
	// 			io.Copy(c.Writer, zr)
	// 			return
	// 		}
	// 		c.Writer.Header().Set("x-transcoder-response", "unmodified")
	// 		for k, vl := range resp.Header {
	// 			for _, v := range vl {
	// 				if strings.ToLower(k) == "content-encoding" {
	// 					continue
	// 				}
	// 				c.Writer.Header().Add(k, v)
	// 			}
	// 		}
	// 		c.Writer.WriteHeader(resp.StatusCode)
	// 		io.Copy(c.Writer, resp.Body)
	// 		return
	// 	}
	// 	transcoder.ServeHTTP(c.Writer, c.Request)
	// })
}
