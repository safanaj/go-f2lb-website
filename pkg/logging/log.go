package logging

import (
	"os"
	"sync"

	flag "github.com/spf13/pflag"

	"github.com/go-logr/logr"
	"github.com/go-logr/zerologr"
	"github.com/rs/zerolog"
)

type Logger = logr.Logger

var (
	log   logr.Logger
	once  sync.Once
	level int
)

func AddFlags(fs *flag.FlagSet) {
	flag.IntVarP(&level, "verbosity", "v", 0, "")
}

func GetLogger() logr.Logger {
	once.Do(func() {
		zerologr.NameFieldName = "logger"
		zerologr.NameSeparator = "/"
		// zerologr.VerbosityFieldName = ""

		lvlV := int(zerolog.ErrorLevel) - level
		if lvlV < int(zerolog.TraceLevel) {
			lvlV = int(zerolog.TraceLevel)
		} else if lvlV > int(zerolog.PanicLevel) {
			lvlV = int(zerolog.PanicLevel)
		}
		zerolog.SetGlobalLevel(zerolog.Level(lvlV))

		zl := zerolog.New(os.Stdout).With().Caller().Timestamp().Logger()
		// zl := zerolog.NewConsoleWriter(func(w *zerolog.ConsoleWriter) {
		// 	w.TimeFormat = time.RFC3339
		// })
		log = zerologr.New(&zl)
	})
	return log
}
