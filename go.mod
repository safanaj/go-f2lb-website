module github.com/safanaj/go-f2lb

go 1.18

require (
	github.com/blockfrost/blockfrost-go v0.1.0
	github.com/cardano-community/koios-go-client/v2 v2.0.1
	github.com/echovl/cardano-go v0.0.0-00010101000000-000000000000
	github.com/gin-contrib/gzip v0.0.6
	github.com/gin-gonic/gin v1.8.1
	github.com/go-logr/logr v1.2.3
	github.com/google/uuid v1.3.0
	github.com/iand/logfmtr v0.2.1
	github.com/improbable-eng/grpc-web v0.15.0
	github.com/spf13/pflag v1.0.5
	golang.org/x/crypto v0.0.0-20220525230936-793ad666bf5e
	golang.org/x/oauth2 v0.0.0-20220718184931-c8730f7fcb92
	google.golang.org/api v0.88.0
	google.golang.org/grpc v1.47.0
	google.golang.org/protobuf v1.28.0
	gopkg.in/yaml.v3 v3.0.1
)

require (
	cloud.google.com/go/compute v1.7.0 // indirect
	filippo.io/edwards25519 v1.0.0 // indirect
	github.com/cenkalti/backoff/v4 v4.1.1 // indirect
	github.com/desertbit/timer v0.0.0-20180107155436-c41aec40b27f // indirect
	github.com/echovl/ed25519 v0.2.0 // indirect
	github.com/fatih/color v1.13.0 // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/go-playground/locales v0.14.0 // indirect
	github.com/go-playground/universal-translator v0.18.0 // indirect
	github.com/go-playground/validator/v10 v10.10.0 // indirect
	github.com/goccy/go-json v0.9.7 // indirect
	github.com/golang/groupcache v0.0.0-20210331224755-41bb18bfe9da // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/googleapis/enterprise-certificate-proxy v0.1.0 // indirect
	github.com/googleapis/gax-go/v2 v2.4.0 // indirect
	github.com/hashicorp/go-cleanhttp v0.5.2 // indirect
	github.com/hashicorp/go-hclog v1.0.0 // indirect
	github.com/hashicorp/go-retryablehttp v0.7.0 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/compress v1.12.3 // indirect
	github.com/leodido/go-urn v1.2.1 // indirect
	github.com/mattn/go-colorable v0.1.12 // indirect
	github.com/mattn/go-isatty v0.0.14 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/pelletier/go-toml/v2 v2.0.1 // indirect
	github.com/rs/cors v1.7.0 // indirect
	github.com/shopspring/decimal v1.3.1 // indirect
	github.com/ugorji/go/codec v1.2.7 // indirect
	github.com/x448/float16 v0.8.4 // indirect
	go.opencensus.io v0.23.0 // indirect
	golang.org/x/net v0.0.0-20220624214902-1bab6f366d9e // indirect
	golang.org/x/sys v0.0.0-20220624220833-87e55d714810 // indirect
	golang.org/x/text v0.3.7 // indirect
	golang.org/x/time v0.0.0-20220922220347-f3bd1da661af // indirect
	google.golang.org/appengine v1.6.7 // indirect
	google.golang.org/genproto v0.0.0-20220624142145-8cd45d7dbd1f // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	nhooyr.io/websocket v1.8.6 // indirect
)

//replace github.com/cardano-community/koios-go-client => github.com/safanaj/koios-go-client v1.2.1
// replace github.com/fivebinaries/go-cardano-serialization => github.com/safanaj/go-cardano-serialization v0.0.0-20220930095728-b817e2b018d1

// replace github.com/echovl/cardano-go => /home/marco/src/Others/cardano-go

replace github.com/echovl/cardano-go => github.com/safanaj/cardano-go v0.0.0-20221024103531-2e6f45080b11
