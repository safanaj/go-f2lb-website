VERSION ?= 0.4.10
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
PROTO_SRCS = proto/*.proto

golang:
	@echo "--> Go Version"
	@$(GO) version

clean:
	rm -f $(COMPONENT) pkg/pb/*.pb.go pkg/pb/*.pb.gw.go
	rm -f webui/src/lib/pb/*_pb.* webui/src/lib/pb/*_pb_service.*
	rm -f proto/.built
	rm -rf webui/dist webui/build webui/version.json
	rm -f package-lock.json

clean-all: clean
	rm -rf webui/node_modules webui/.svelte-kit vendor proto/google proto/openapiv2 pkg/libsodium/_c_libsodium_built
	rm -f package-lock.json

lint:
	golint && ( cd webui && yarn install && yarn run lint )

go-deps:
	$(GO) mod tidy -v && $(GO) mod vendor -v

go-deps-verify: go-deps
	$(GO) mod verify

go-generate: go-deps
	$(GO) generate ./...

pkg/libsodium/_c_libsodium_built/libsodium.a:
	$(MAKE) go-generate
	touch $@

proto/.built: $(PROTO_SRCS)
	$(MAKE) build-proto
	touch $@

PROTOC_GEN_JS_SUPPORT_IMPORT_STYLE_ES6 = 0
PROTOC_GEN_JS_IMPORT_STYLE_OPT = commonjs
ifeq ($(shell protoc-gen-js --has-es6-import-style-support 2>/dev/null && echo 1 || echo 0), 1)
	PROTOC_GEN_JS_SUPPORT_IMPORT_STYLE_ES6 = 1
	PROTOC_GEN_JS_IMPORT_STYLE_OPT = es6
endif

PROTOC_GEN_OPENAPIV2_IMPORT_PATH = $(shell dirname $(shell which protoc-gen-openapiv2))/../pkg/mod/github.com/grpc-ecosystem/grpc-gateway/v2@$(shell go list -m github.com/grpc-ecosystem/grpc-gateway/v2 | cut -d' ' -f2)

proto/google/api:
	mkdir -p $@

proto/openapiv2:
	mkdir -p $@

google/api/http.proto google/api/annotations.proto: proto/google/api
	cd $< && curl -sLJO https://raw.githubusercontent.com/googleapis/googleapis/master/$@

build-proto: google/api/http.proto google/api/annotations.proto proto/openapiv2
	mkdir -p $(CURDIR)/webui/src/lib/pb
	cd $(CURDIR)/proto ; protoc *.proto -I. -I/usr/include -I$(PROTOC_GEN_OPENAPIV2_IMPORT_PATH) \
		--include_imports --descriptor_set_out=all.protoset \
		--go_out=paths=source_relative:$(CURDIR)/pkg/pb \
		--go-grpc_out=paths=source_relative:$(CURDIR)/pkg/pb \
		--grpc-gateway_out paths=source_relative:$(CURDIR)/pkg/pb \
		--grpc-gateway_opt logtostderr=true \
		--grpc-gateway_opt paths=source_relative \
		--grpc-gateway_opt generate_unbound_methods=true \
		--openapiv2_out $(CURDIR)/proto/openapiv2 \
		--openapiv2_opt logtostderr=true \
		--openapiv2_opt allow_merge=true \
		--js_out=import_style=$(PROTOC_GEN_JS_IMPORT_STYLE_OPT),binary:$(CURDIR)/webui/src/lib/pb \
		--ts_out=service=grpc-web,import_style=es6:$(CURDIR)/webui/src/lib/pb

	test $(PROTOC_GEN_JS_SUPPORT_IMPORT_STYLE_ES6) -eq 1 || \
	for f in $(CURDIR)/webui/src/lib/pb/*_pb.js; do cat $${f} | ./scripts/fix-js-for-es6.py | sponge $${f} ; done

	for f in $(CURDIR)/webui/src/lib/pb/*_pb.js; do cat $${f} | ./scripts/fix-js-for-grpcgw.py | sponge $${f} ; done

webui/node_modules:
	cd webui ; yarn install

webui/version.json:
	echo "$(VERSION)" > $@

build-webui: webui/version.json webui/node_modules proto/.built
	cd webui ; yarn build

webui/build:
	$(MAKE) build-webui
	touch $@

vendor:
	$(MAKE) go-deps
	touch $@

build-go: vendor webui/build proto/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	$(ENVVAR) GOOS=$(GOOS) $(GO) build -mod=vendor \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-static-go: proto/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	@echo "--> Compiling the static binary"
	$(ENVVAR) GOARCH=$(GOARCH) GOOS=$(GOOS) $(GO) build -mod=vendor -a -tags netgo \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -extldflags=-static -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-go-nomod: vendor webui/build proto/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	$(ENVVAR) GOOS=$(GOOS) $(GO) build \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build: proto/.built build-webui build-go-nomod

static-release: vendor webui/build proto/.built pkg/libsodium/_c_libsodium_built/libsodium.a
	@echo "--> Compiling the static binary for release"
	$(ENVVAR) GOARCH=$(GOARCH) GOOS=$(GOOS) $(GO) build -mod=vendor -a -tags netgo \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -extldflags=-static -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT)_$(GOOS)_$(GOARCH)_$(VERSION) $(SRCS)

start: build
	./$(COMPONENT)
