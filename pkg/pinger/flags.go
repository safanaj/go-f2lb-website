package pinger

import (
	"time"

	flag "github.com/spf13/pflag"
)

var (
	// pinger flags
	pingerCheckers          = 10
	pingerPingsCount        = 1
	pingerPingInterval      = time.Duration(time.Second)
	pingerCheckInterval     = time.Duration(30 * time.Minute)
	pingerResponseThreshold = time.Duration(500 * time.Millisecond)
	pingerConnectTimeout    = time.Duration(5 * time.Second)
	pingerKeepAliveTimeout  = time.Duration(5 * time.Second)
	pingerCheckAlsoTip      = false
)

func AddFlags(fs *flag.FlagSet) {
	pingerFlagSet := flag.NewFlagSet("pinger", flag.ExitOnError)
	pingerFlagSet.IntVar(&pingerCheckers, "pinger-checkers", pingerCheckers, "")
	pingerFlagSet.IntVar(&pingerPingsCount, "pinger-pings-per-check", pingerPingsCount, "")
	pingerFlagSet.DurationVar(&pingerPingInterval, "pinger-pings-interval", pingerPingInterval, "")
	pingerFlagSet.DurationVar(&pingerCheckInterval, "pinger-check-interval", pingerCheckInterval, "")
	pingerFlagSet.DurationVar(&pingerResponseThreshold, "pinger-response-time-threshold", pingerResponseThreshold, "")
	pingerFlagSet.DurationVar(&pingerConnectTimeout, "pinger-connect-timeout", pingerConnectTimeout, "")
	pingerFlagSet.DurationVar(&pingerKeepAliveTimeout, "pinger-keepalive-timeout", pingerKeepAliveTimeout, "")
	pingerFlagSet.BoolVar(&pingerCheckAlsoTip, "pinger-check-also-tip", pingerCheckAlsoTip, "")

	fs.AddFlagSet(pingerFlagSet)
}
