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

  * golang (1.18)
  * nodejs
  * yarn
  * python3
  * protoc (protobuf-compiler)
  * protoc-gen-go
  * protoc-gen-go-grpc
  * protoc-gen-js
  * protoc-gen-ts ([forked version](https://github.com/safanaj/ts-protoc-gen/tree/use-import_style), needs to be installed and available in PATH)

Python3 is used in the code as simple script to patch the generated js files from proto files. This is to ensure the embedded js files work in a modern browser using es6 import/export style. 
This is part of the requirements otherwise [protobuf-javascript](https://github.com/protocolbuffers/protobuf-javascript) won't produce the necessary  ES6 compatible code. This patch is to also avoid the use browserify or something similar.
