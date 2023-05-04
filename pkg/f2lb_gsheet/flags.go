package f2lb_gsheet

import (
	flag "github.com/spf13/pflag"
)

func AddFlags(fs *flag.FlagSet) {
	fs.StringVar(&serviceAccountCredsJSONFileName, "service-account-credentials", serviceAccountCredsJSONFileName, "")

	fs.DurationVar(&defaultRefreshInterval, "controller-refresh-interval", defaultRefreshInterval, "")

	fs.StringVar(&poolsHintsPath, "pools-hints-path", poolsHintsPath, "CSV file for pools mapping hints")

	fs.StringVar(&cachesStoreDirPath, "caches-store-path", cachesStoreDirPath, "Directory where to store koios caches")
	acFlagSet := flag.NewFlagSet("account cache", flag.ExitOnError)
	acFlagSet.DurationVar(&acRefreshInterval, "account-refresh-interval", acRefreshInterval, "")
	acFlagSet.DurationVar(&acWorkersInterval, "account-worker-interval", acWorkersInterval, "")
	acFlagSet.IntVar(&acWorkers, "account-workers", acWorkers, "")
	acFlagSet.IntVar(&acCacheSyncers, "account-cache-syncers", acCacheSyncers, "")
	acFlagSet.IntVar(&acAccountInfosToGet, "account-info-to-get-in-chunk", acAccountInfosToGet, "")
	pcFlagSet := flag.NewFlagSet("pool cache", flag.ExitOnError)
	pcFlagSet.DurationVar(&pcRefreshInterval, "pool-refresh-interval", pcRefreshInterval, "")
	pcFlagSet.DurationVar(&pcWorkersInterval, "pool-worker-interval", pcWorkersInterval, "")
	pcFlagSet.IntVar(&pcWorkers, "pool-workers", pcWorkers, "")
	pcFlagSet.IntVar(&pcCacheSyncers, "pool-cache-syncers", pcCacheSyncers, "")
	pcFlagSet.IntVar(&pcPoolInfosToGet, "pool-info-to-get-in-chunk", pcPoolInfosToGet, "")

	koiosFlagSet := flag.NewFlagSet("koios cache", flag.ExitOnError)
	koiosFlagSet.DurationVar(&koiosTipRefreshInterval, "koios-tip-refresh-interval", koiosTipRefreshInterval, "")

	fs.AddFlagSet(acFlagSet)
	fs.AddFlagSet(pcFlagSet)
	fs.AddFlagSet(koiosFlagSet)
}
