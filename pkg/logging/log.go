package logging

import (
	// "os"
	"sync"

	flag "github.com/spf13/pflag"

	"github.com/go-logr/logr"
	"github.com/iand/logfmtr"
	// "github.com/go-logr/logr"
	// "github.com/go-logr/zapr"
	// "go.uber.org/zap"
	// "go.uber.org/zap/zapcore"
	// "github.com/go-logr/logr"
	// "github.com/go-logr/zerologr"
	// "github.com/rs/zerolog"
)

type Logger = logr.Logger

var (
	log   logr.Logger
	once  sync.Once
	level int
)

func AddFlags(fs *flag.FlagSet) {
	flag.IntVarP(&level, "verbosity", "v", 1, "")
}

func GetLogger() logr.Logger {
	once.Do(func() {
		// Set options that all loggers will be based on
		opts := logfmtr.DefaultOptions()
		opts.Humanize = true
		opts.Colorize = true
		opts.AddCaller = true
		opts.NameDelim = "/"
		opts.CallerSkip = 1
		logfmtr.UseOptions(opts)
		logfmtr.SetVerbosity(level)
		log = logfmtr.New()

		// zc := zap.NewProductionConfig()
		// zc.Level = zap.NewAtomicLevelAt(zapcore.Level(-level))
		// zc.Encoding = "console"
		// zc.EncoderConfig.EncodeTime = zapcore.RFC3339NanoTimeEncoder
		// // zc.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
		// zc.EncoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
		// zc.EncoderConfig.ConsoleSeparator = "\t| "

		// z, err := zc.Build()
		// if err != nil {
		// 	// ...
		// }
		// log = zapr.NewLogger(z)

		// zerologr.NameFieldName = "logger"
		// zerologr.NameSeparator = "/"
		// // zerologr.VerbosityFieldName = ""

		// lvlV := int(zerolog.ErrorLevel) - level
		// if lvlV < int(zerolog.TraceLevel) {
		// 	lvlV = int(zerolog.TraceLevel)
		// } else if lvlV > int(zerolog.PanicLevel) {
		// 	lvlV = int(zerolog.PanicLevel)
		// }
		// zerolog.SetGlobalLevel(zerolog.Level(lvlV))

		// zl := zerolog.New(os.Stdout).With().Caller().Timestamp().Logger()
		// // zl := zerolog.NewConsoleWriter(func(w *zerolog.ConsoleWriter) {
		// // 	w.TimeFormat = time.RFC3339
		// // })
		// log = zerologr.New(&zl)
	})
	return log
}
