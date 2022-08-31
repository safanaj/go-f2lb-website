VERSION ?= 0.1.6
COMPONENT = go-f2lb-website
FLAGS =
ENVVAR = CGO_ENABLED=0
GOOS ?= $(shell go env GOOS) #linux
GO ?= go
LDFLAGS ?= -s -w

SRCS = ./main.go
PROTO_SRCS = proto/*.proto

golang:
	@echo "--> Go Version"
	@$(GO) version

clean:
	rm -f $(COMPONENT) pkg/pb/*.pb.go
	rm -f webui/src/lib/pb/*_pb.* webui/src/lib/pb/*_pb_service.*
	rm -f proto/.built
	rm -rf webui/dist webui/build webui/version.json

clean-all: clean
	rm -rf webui/node_modules vendor

go-deps:
	$(GO) mod tidy -v && $(GO) mod vendor -v

go-deps-verify: go-deps
	$(GO) mod verify

proto/.built: $(PROTO_SRCS)
	$(MAKE) build-proto
	touch $@

build-proto:
	mkdir -p $(CURDIR)/webui/src/lib/pb
	cd $(CURDIR)/proto ; protoc *.proto -I. -I/usr/include \
		--go_out=paths=source_relative:$(CURDIR)/pkg/pb \
		--go-grpc_out=paths=source_relative:$(CURDIR)/pkg/pb \
		--js_out=import_style=commonjs,binary:$(CURDIR)/webui/src/lib/pb \
		--ts_out=service=grpc-web,import_style=es6:$(CURDIR)/webui/src/lib/pb

	for f in $(CURDIR)/webui/src/lib/pb/*_pb.js; do cat $${f} | ./scripts/fix-js-for-es6.py | sponge $${f} ; done

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

build-go: vendor webui/build proto/.built
	$(ENVVAR) GOOS=$(GOOS) $(GO) build -mod=vendor \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build-static-go: proto/.built
	@echo "--> Compiling the static binary"
	$(ENVVAR) GOARCH=amd64 GOOS=$(GOOS) $(GO) build -mod=vendor -a -tags netgo \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=$(VERSION) -X main.progname=$(COMPONENT)" \
		-v -o $(COMPONENT) $(SRCS)

build: proto/.built build-webui build-go

start: build
	./$(COMPONENT)
