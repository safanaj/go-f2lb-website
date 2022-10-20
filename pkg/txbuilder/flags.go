package txbuilder

import (
	flag "github.com/spf13/pflag"
)

func AddFlags(fs *flag.FlagSet) {
	fs.StringVar(&secretsFilePath, "secrets-path", secretsFilePath, "")
	fs.StringVar(&passphrase, "secrets-passphrase", passphrase, "")
}
