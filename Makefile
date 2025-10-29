VERSION ?= 0.5.1
COMPONENT = go-f2lb-website
FLAGS =
ENVVAR = \
	CGO_ENABLED=1 \
	CGO_CFLAGS=-I$(CURDIR)/pkg/libsodium/_c_libsodium_built/include \
	CGO_LDFLAGS=-L$(CURDIR)/pkg/libsodium/_c_libsodium_built

GOOS ?= $(shell go env GOOS)
GOARCH ?= $(shell go env GOARCH)
GO ?= go
LDFLAGS ?= -s -w

SRCS = ./main.go
PROTO_SRCS = api/v1/*.proto api/v2/*.proto

golang:
	@echo "--> Go Version"
	@$(GO) version

clean:
	rm -f $(COMPONENT) pkg/api/v1/*.pb.go pkg/api/v1/*.pb.gw.go pkg/api/v2/*.connect.go pkg/api/v2/*.pb.go
	rm -f webui/src/lib/api/v1/*_pb.* webui/src/lib/api/v1/*_pb_service.* webui/src/lib/api/*_pb.*
	rm -f api/.built
	rm -rf webui/dist webui/build webui/version.json
	rm -f package-lock.json

clean-all: clean
	rm -rf webui/node_modules webui/.svelte-kit vendor api/v1/google api/v1/openapiv2 pkg/libsodium/_c_libsodium_built
	rm -f package-lock.json

lint:
	golint && ( cd webui && bun install && bun run lint )

installdepstoolslatest:
	go install github.com/bufbuild/buf/cmd/buf@latest
	go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
	go install github.com/sudorandom/protoc-gen-connect-openapi@latest
	CGO_ENABLED=0 go install github.com/go-swagger/go-swagger/cmd/swagger@latest
	cd webui && bun add -d @bufbuild/buf @bufbuild/protoc-gen-es

go-deps:
	$(GO) mod tidy -v

go-vendor:
	 $(GO) mod vendor -v

go-deps-verify: go-deps
	$(GO) mod verify

go-generate: go-deps
	$(GO) generate ./...

pkg/libsodium/_c_libsodium_built/libsodium.a:
	$(MAKE) go-generate
	touch $@

api/.built: $(PROTO_SRCS)
	$(MAKE) build-proto
	touch $@

PROTOC_GEN_JS_SUPPORT_IMPORT_STYLE_ES6 = 0
PROTOC_GEN_JS_IMPORT_STYLE_OPT = commonjs
ifeq ($(shell protoc-gen-js --has-es6-import-style-support 2>/dev/null && echo 1 || echo 0), 1)
	PROTOC_GEN_JS_SUPPORT_IMPORT_STYLE_ES6 = 1
	PROTOC_GEN_JS_IMPORT_STYLE_OPT = es6
endif

PROTOC_GEN_OPENAPIV2_IMPORT_PATH = $(shell dirname $(shell which protoc-gen-openapiv2))/../pkg/mod/github.com/grpc-ecosystem/grpc-gateway/v2@$(shell go list -m github.com/grpc-ecosystem/grpc-gateway/v2 | cut -d' ' -f2)

api/v1/google/api:
	mkdir -p $@

api/v1/openapiv2:
	mkdir -p $@

google/api/http.proto google/api/annotations.proto: api/v1/google/api
	cd $< && curl -sLJO https://raw.githubusercontent.com/googleapis/googleapis/master/$@

build-proto: google/api/http.proto google/api/annotations.proto api/v1/openapiv2
	mkdir -p $(CURDIR)/pkg/api/v1 $(CURDIR)/webui/src/lib/api/v1
	cd $(CURDIR)/api/v1 ; protoc *.proto -I. -I/usr/include -I$(PROTOC_GEN_OPENAPIV2_IMPORT_PATH) \
		--include_imports --descriptor_set_out=all.protoset \
		--go_out=paths=source_relative:$(CURDIR)/pkg/api/v1 \
		--go-grpc_out=paths=source_relative:$(CURDIR)/pkg/api/v1 \
		--grpc-gateway_out paths=source_relative:$(CURDIR)/pkg/api/v1 \
	 	--grpc-gateway_opt logtostderr=true \
	 	--grpc-gateway_opt paths=source_relative \
	 	--grpc-gateway_opt generate_unbound_methods=true \
	 	--openapiv2_out $(CURDIR)/api/v1/openapiv2 \
	 	--openapiv2_opt logtostderr=true \
	 	--openapiv2_opt allow_merge=true \
	 	--js_out=import_style=$(PROTOC_GEN_JS_IMPORT_STYLE_OPT),binary:$(CURDIR)/webui/src/lib/api/v1 \
	 	--ts_out=service=grpc-web,import_style=es6:$(CURDIR)/webui/src/lib/api/v1

	test $(PROTOC_GEN_JS_SUPPORT_IMPORT_STYLE_ES6) -eq 1 || \
	for f in $(CURDIR)/webui/src/lib/api/v1/*_pb.js; do \
		cat $${f} | ./scripts/fix-js-for-es6.py | sponge $${f} ; \
	done

	for f in $(CURDIR)/webui/src/lib/api/v1/*_pb.js; do \
		cat $${f} | ./scripts/fix-js-for-grpcgw.py | sponge $${f} ; \
	done

	buf generate

webui/node_modules:
	cd webui && bun install
	cd webui && bun add -d @bufbuild/buf @bufbuild/protoc-gen-es

webui/version.json:
	echo "$(VERSION)" > $@

build-webui: webui/version.json webui/node_modules api/.built
	cd webui ; bun run build

webui/build:
	$(MAKE) build-webui
	touch $@

vendor:
	$(MAKE) go-deps go-vendor
	touch $@

build-go: vendor webui/build api/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	$(ENVVAR) GOOS=$(GOOS) $(GO) build -mod=vendor \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-go-dbg: vendor webui/build api/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	$(ENVVAR) GOOS=$(GOOS) $(GO) build -mod=vendor \
		-gcflags all="-N -l" \
		-ldflags "-X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-static-go: vendor api/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	@echo "--> Compiling the static binary"
	$(ENVVAR) GOARCH=$(GOARCH) GOOS=$(GOOS) $(GO) build -mod=vendor -a -tags netgo \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -extldflags=-static -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-static-go-dbg: vendor api/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	@echo "--> Compiling the static binary"
	$(ENVVAR) GOARCH=$(GOARCH) GOOS=$(GOOS) $(GO) build -mod=vendor -a -tags netgo \
		-gcflags all="-N -l" \
		-ldflags "-extldflags=-static -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-go-nomod: webui/build api/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	$(ENVVAR) GOOS=$(GOOS) $(GO) build \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-go-nomod-dbg: webui/build api/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	$(ENVVAR) GOOS=$(GOOS) $(GO) build \
		-gcflags all="-N -l" \
		-ldflags "-X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build: api/.built webui/build build-go-nomod

build-dbg: api/.built webui/build build-go-nomod-dbg

static-release: vendor webui/build proto/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	@echo "--> Compiling the static binary for release"
	$(ENVVAR) GOARCH=$(GOARCH) GOOS=$(GOOS) $(GO) build -mod=vendor -a -tags netgo \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -extldflags=-static -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT)_$(GOOS)_$(GOARCH)_$(VERSION) $(SRCS)

start: build
	./$(COMPONENT)
