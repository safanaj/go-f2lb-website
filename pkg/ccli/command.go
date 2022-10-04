package ccli

import (
	"context"
	"encoding/json"
	"fmt"
	flag "github.com/spf13/pflag"
	"os/exec"
	"strings"
)

var socketPath string

func AddFlags(fs *flag.FlagSet) {
	fs.StringVar(&socketPath, "cardano-node-socket-path", "", "")
}

func GetDelegatedPoolForStakeAddress(ctx context.Context, saddr string) (poolIdBech32 string, err error) {
	sout := &strings.Builder{}
	cmd := exec.CommandContext(ctx, "cardano-cli", "query", "stake-address-info", "--mainnet", "--address", saddr)
	cmd.Env = []string{fmt.Sprintf("CARDANO_NODE_SOCKET_PATH=%s", socketPath)}
	cmd.Stdout = sout
	err = cmd.Run()
	if err != nil {
		return "", err
	}
	res := []map[string]any{}
	err = json.Unmarshal([]byte(sout.String()), &res)
	if err != nil {
		return "", err
	}
	return res[0]["delegation"].(string), nil
}
