package utils

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

var shutdownSignals = []os.Signal{os.Interrupt, syscall.SIGTERM}

func SetupShutdownSignals(parentCtx context.Context) context.Context {
	ctx, cancel := context.WithCancel(parentCtx)

	c := make(chan os.Signal, 2)
	signal.Notify(c, shutdownSignals...)
	go func() {
		<-c
		cancel()
		fmt.Println("Received shutdown signal, context cancelled.")
		<-c
		os.Exit(1) // second signal. Exit directly.
	}()

	return ctx
}
