VERSION ?= 0.1.0
COMPONENT = go-f2lb-website
FLAGS =
ENVVAR = CGO_ENABLED=0
GOOS ?= $(shell go env GOOS) #linux
GO ?= go
LDFLAGS ?= -s -w

SRCS = ./main.go

golang:
	@echo "--> Go Version"
	@$(GO) version

clean:
	rm -f main $(COMPONENT)
	rm -rf webui/dist pb webui/pb

clean-all: clean
	rm -rf webui/node_modules vendor

go-deps:
	mkdir -p $(CURDIR)/pb && echo "package pb" > $(CURDIR)/pb/doc.go
	$(GO) mod tidy -v && $(GO) mod vendor -v && $(GO) mod verify

build-proto:
	mkdir -p $(CURDIR)/pb $(CURDIR)/webui/pb
	cd $(CURDIR)/proto ; protoc *.proto -I. -I/usr/include \
		--go_out=paths=source_relative:$(CURDIR)/pb \
		--go-grpc_out=paths=source_relative:$(CURDIR)/pb \
		--js_out=import_style=commonjs,binary:$(CURDIR)/webui/pb \
		--ts_out=service=grpc-web,import_style=es6:$(CURDIR)/webui/pb

	for f in $(CURDIR)/webui/pb/*_pb.js; do cat $${f} | ./scripts/fix-js-for-es6.py | sponge $${f} ; done

webui/node_modules:
	cd webui ; yarn install

build-webui: build-proto webui/node_modules
	cd webui ; yarn build

build-go:
	$(ENVVAR) GOOS=$(GOOS) $(GO) build -mod=vendor \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=${VERSION} -X main.progname=${COMPONENT}" \
		-v -o ${COMPONENT} $(SRCS)

build-static-go:
	@echo "--> Compiling the static binary"
	$(ENVVAR) GOARCH=amd64 GOOS=$(GOOS) $(GO) build -mod=vendor -a -tags netgo \
		-gcflags "-e" \
		-ldflags "$(LDFLAGS) -X main.version=${VERSION} -X main.progname=${COMPONENT}" \
		-v -o ${COMPONENT} $(SRCS)

build: build-proto build-webui build-go

start: build
	./${COMPONENT}
