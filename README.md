A website for F2LB community
============================

The goal of this project is mainly experiment with some technologies
like: golang, grpc-web, sveltejs/sveltekit, wasm.

This is a simple frontend to access and partecipate the
[First 2 Lifetime Block community](https://www.f2lb.org/).

The website is using the data that are stored into a
[google spread sheet](https://docs.google.com/spreadsheets/d/1-mA8vY0ZtzlVdH4XA5-J4nIZo4qFR_vFbnBFkpMLlYo/edit#gid=1857947541)
as primary source of truth, other "more dynamic/evolving" information
are collected from [koios](https://www.koios.rest/) mainly.

## Building ##

A single, huge (~22MB), statically linked binary is produced, that embed all the javascript and html static files.

The Makefile is helping to generate code from proto files, build the static js files from the sveltekit based web ui and finally build the golang code embedding the static files for the frontend.

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

Python3 is used just as simple script to patch the generated js files from proto files, to make the js files work in modern browser using es6 import/export style. It is needed until [protobuf-javascript](https://github.com/protocolbuffers/protobuf-javascript) won't produce ES6 compatible code. This patch is to avoid to use browserify or similar.
