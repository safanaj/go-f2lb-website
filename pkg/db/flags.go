package db

import (
	flag "github.com/spf13/pflag"
)

func AddFlags(fs *flag.FlagSet) {
	dbFlagSet := flag.NewFlagSet("database connection", flag.ExitOnError)

	dbFlagSet.StringVar(&privateKeyPath, "db-key-file", "", "")
	dbFlagSet.StringVar(&certificatePath, "db-cert-file", "", "")
	dbFlagSet.StringVar(&caCertificatePath, "db-cacert-file", "", "")
	dbFlagSet.StringVar(&dbDSN, "db-dsn", dbDSN, "")

	fs.AddFlagSet(dbFlagSet)
}
