module github.com/safanaj/go-f2lb

go 1.22

toolchain go1.22.7

require (
	github.com/blinklabs-io/gouroboros v0.106.0
	github.com/blockfrost/blockfrost-go v0.1.1
	github.com/cardano-community/koios-go-client/v4 v4.0.0
	github.com/gin-contrib/gzip v0.0.6
	github.com/gin-gonic/gin v1.9.1
	github.com/go-logr/logr v1.3.0
	github.com/google/uuid v1.4.0
	github.com/grpc-ecosystem/grpc-gateway/v2 v2.18.1
	github.com/hako/durafmt v0.0.0-20210608085754-5c1018a4e16b
	github.com/iand/logfmtr v0.2.2
	github.com/improbable-eng/grpc-web v0.15.0
	github.com/safanaj/cardano-go v0.1.23
	github.com/spf13/pflag v1.0.5
	github.com/swaggo/files v1.0.1
	github.com/swaggo/gin-swagger v1.6.0
	github.com/swaggo/swag v1.16.2
	golang.org/x/crypto v0.31.0
	golang.org/x/oauth2 v0.14.0
	google.golang.org/api v0.150.0
	google.golang.org/genproto/googleapis/api v0.0.0-20231106174013-bbf56f31fb17
	google.golang.org/grpc v1.59.0
	google.golang.org/protobuf v1.36.1
	gopkg.in/yaml.v3 v3.0.1
)

require (
	cloud.google.com/go/compute v1.23.3 // indirect
	cloud.google.com/go/compute/metadata v0.2.3 // indirect
	filippo.io/edwards25519 v1.1.0 // indirect
	github.com/KyleBanks/depth v1.2.1 // indirect
	github.com/bytedance/sonic v1.10.2 // indirect
	github.com/cenkalti/backoff/v4 v4.2.1 // indirect
	github.com/chenzhuoyu/base64x v0.0.0-20230717121745-296ad89f973d // indirect
	github.com/chenzhuoyu/iasm v0.9.1 // indirect
	github.com/desertbit/timer v0.0.0-20180107155436-c41aec40b27f // indirect
	github.com/fatih/color v1.13.0 // indirect
	github.com/fxamacker/cbor/v2 v2.7.0 // indirect
	github.com/gabriel-vasile/mimetype v1.4.3 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/go-openapi/jsonpointer v0.20.0 // indirect
	github.com/go-openapi/jsonreference v0.20.2 // indirect
	github.com/go-openapi/spec v0.20.9 // indirect
	github.com/go-openapi/swag v0.22.4 // indirect
	github.com/go-playground/locales v0.14.1 // indirect
	github.com/go-playground/universal-translator v0.18.1 // indirect
	github.com/go-playground/validator/v10 v10.16.0 // indirect
	github.com/goccy/go-json v0.10.2 // indirect
	github.com/golang/groupcache v0.0.0-20210331224755-41bb18bfe9da // indirect
	github.com/golang/protobuf v1.5.3 // indirect
	github.com/google/s2a-go v0.1.7 // indirect
	github.com/googleapis/enterprise-certificate-proxy v0.3.2 // indirect
	github.com/googleapis/gax-go/v2 v2.12.0 // indirect
	github.com/happy-sdk/happy/pkg/version v0.1.2 // indirect
	github.com/hashicorp/go-cleanhttp v0.5.2 // indirect
	github.com/hashicorp/go-hclog v1.0.0 // indirect
	github.com/hashicorp/go-retryablehttp v0.7.5 // indirect
	github.com/jinzhu/copier v0.4.0 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/cpuid/v2 v2.2.6 // indirect
	github.com/leodido/go-urn v1.2.4 // indirect
	github.com/mailru/easyjson v0.7.7 // indirect
	github.com/mattn/go-colorable v0.1.12 // indirect
	github.com/mattn/go-isatty v0.0.20 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/otiai10/copy v1.14.0 // indirect
	github.com/pelletier/go-toml/v2 v2.1.0 // indirect
	github.com/rs/cors v1.10.1 // indirect
	github.com/shopspring/decimal v1.3.1 // indirect
	github.com/twitchyliquid64/golang-asm v0.15.1 // indirect
	github.com/ugorji/go/codec v1.2.11 // indirect
	github.com/utxorpc/go-codegen v0.15.0 // indirect
	github.com/veraison/go-cose v1.1.0 // indirect
	github.com/x448/float16 v0.8.4 // indirect
	go.opencensus.io v0.24.0 // indirect
	golang.org/x/arch v0.6.0 // indirect
	golang.org/x/mod v0.17.0 // indirect
	golang.org/x/net v0.25.0 // indirect
	golang.org/x/sync v0.10.0 // indirect
	golang.org/x/sys v0.28.0 // indirect
	golang.org/x/text v0.21.0 // indirect
	golang.org/x/time v0.5.0 // indirect
	golang.org/x/tools v0.21.1-0.20240508182429-e35e4ccd0d2d // indirect
	google.golang.org/appengine v1.6.8 // indirect
	google.golang.org/genproto v0.0.0-20231106174013-bbf56f31fb17 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20231106174013-bbf56f31fb17 // indirect
	nhooyr.io/websocket v1.8.10 // indirect
)

// replace github.com/blinklabs-io/gouroboros v0.38.4 => github.com/safanaj/gouroboros v0.0.0-20230513104126-364f41fb05dd
// replace github.com/cardano-community/koios-go-client/v3 v3.1.2 => github.com/safanaj/koios-go-client/v3 v3.0.0-20240124005647-9110de241894
