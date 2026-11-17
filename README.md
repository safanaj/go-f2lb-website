A website for F2LB community
============================

The goal of this project is to mainly experiment with some core technologies
like: golang, grpc-web, sveltejs/sveltekit, wasm.

This is a simple frontend to access and participate in the
[First 2 Lifetime Block community](https://www.f2lb.org/).

The website uses data that is stored in a
[google spread sheet](https://docs.google.com/spreadsheets/d/1-mA8vY0ZtzlVdH4XA5-J4nIZo4qFR_vFbnBFkpMLlYo/edit#gid=1857947541)
as primary source of truth which is periodically updated by members. Other "dynamic/evolving" information
is also collected from [koios](https://www.koios.rest/) to aid with the process.

## Building ##

Building, involves the generation of a (~22MB) statically linked binary, which embeds all the javascript and html static files in the codebase.

A Makefile is also used to generate code from proto files, build the static js files, using the sveltekit based web ui. Finally, golang is then used to embed the static files for the frontend.

### Dependencies for building ###

The build is split across two proto layers that use different toolchains:

* **`api/v2` (current)** is generated with [buf](https://buf.build/docs/) and the
  [connectrpc](https://connectrpc.com/) codegen plugins.
* **`api/v1` (legacy)** is still generated with the classic `protoc` compiler.

Both layers are wired together by the `Makefile`; run `make installdepstoolslatest`
(current toolchain) and `make installdepstoolsforoldv1` (legacy v1 tools) to install
everything, or use the individual install commands shown below.

Host requirements:

  * golang (1.26)
  * nodejs
  * bun (used in place of yarn for the sveltekit webui)
  * python3

Go runtime dependencies include the connectrpc stack (see `go.mod`):

  * `connectrpc.com/connect`
  * `connectrpc.com/grpchealth`
  * `connectrpc.com/grpcreflect`
  * `connectrpc.com/vanguard`

Tooling to install (installed by the Makefile targets, all must be on `PATH`):

  * `buf` — `go install github.com/bufbuild/buf/cmd/buf@latest`
  * `protoc-gen-go` — `go install google.golang.org/protobuf/cmd/protoc-gen-go@latest`
  * `protoc-gen-connect-go` — `go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest`
  * `protoc-gen-connect-openapi` — `go install github.com/sudorandom/protoc-gen-connect-openapi@latest`
  * `grpcurl` — `go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest`
  * `go-swagger` — `CGO_ENABLED=0 go install github.com/go-swagger/go-swagger/cmd/swagger@latest`
  * JS codegen for the webui — `cd webui && bun add -d @bufbuild/buf @bufbuild/protoc-gen-es`

For the legacy `api/v1` layer only, the following classic `protoc` plugins are still
required (see `make installdepstoolsforoldv1`):

  * `protoc` (protobuf-compiler)
  * `protoc-gen-go-grpc` — `go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest`
  * `protoc-gen-grpc-gateway` / `protoc-gen-openapiv2` (from
    `github.com/grpc-ecosystem/grpc-gateway/v2`, pinned to the version in `go.mod`)

The `api/v2` layer uses `buf generate` (see `buf.gen.yaml`), which invokes
`protoc-gen-go`, `protoc-gen-connect-go`, `protoc-gen-connect-openapi` (for the
OpenAPI v3 docs in `api/v2/oav3`) and the `@bufbuild/protoc-gen-es` plugin to emit
ES6 JavaScript directly into `webui/src/lib/api/v2`.

The Python patch scripts under `scripts/` (`fix-js-for-es6.py`,
`fix-js-for-grpcgw.py`) are only applied to the **legacy v1** generated JS, to ensure
the embedded js files work in a modern browser using es6 import/export style without
requiring browserify or a similar bundler. The v2 layer no longer needs this patching
because `@bufbuild/protoc-gen-es` already emits ES6 `import`/`export` code. The patch
was originally required because
[protobuf-javascript](https://github.com/protocolbuffers/protobuf-javascript)
wouldn't produce the necessary ES6 compatible code.
