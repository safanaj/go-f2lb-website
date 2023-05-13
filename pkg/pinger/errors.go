package pinger

import "errors"

var (
	PingerAlreadyStartedError      error = errors.New("Pinger is already started")
	PingerIsMissingControllerError error = errors.New("Pinger cannot start without a MiniController")
)
