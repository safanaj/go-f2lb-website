package ccli

import (
	"context"
	"encoding/json"
	"fmt"
	flag "github.com/spf13/pflag"
	"os"
	"os/exec"
	"strings"

	"github.com/echovl/cardano-go"
)

var socketPath string

func AddFlags(fs *flag.FlagSet) {
	fs.StringVar(&socketPath, "cardano-node-socket-path", "", "")
}

func DoCommand(ctx context.Context, cmd_ string) (string, error) {
	sout := &strings.Builder{}
	cmd := exec.CommandContext(ctx, "cardano-cli", strings.Split(cmd_, " ")...)
	if socketPath == "" && os.Getenv("CARDANO_NODE_SOCKET_PATH") != "" {
		socketPath = os.Getenv("CARDANO_NODE_SOCKET_PATH")
	}
	cmd.Env = []string{fmt.Sprintf("CARDANO_NODE_SOCKET_PATH=%s", socketPath)}
	// fmt.Printf("DoCommand: env: %v\nargs: %v\n", cmd.Env, cmd.Args)
	cmd.Stdout = sout
	err := cmd.Run()
	if err != nil {
		return "", err
	}
	return sout.String(), nil
}

func GetDelegatedPoolForStakeAddress(ctx context.Context, saddr string) (string, error) {
	cmd_ := "query stake-address-info --mainnet --address %s"
	out, err := DoCommand(ctx, fmt.Sprintf(cmd_, saddr))
	res := []map[string]any{}
	err = json.Unmarshal([]byte(out), &res)
	if err != nil {
		return "", err
	}
	return res[0]["delegation"].(string), nil
}

func GetTipJson(ctx context.Context) (string, error) {
	cmd_ := "query tip --mainnet"
	out, err := DoCommand(ctx, cmd_)
	res := map[string]any{}
	err = json.Unmarshal([]byte(out), &res)
	if err != nil {
		return "", err
	}
	b, err := json.MarshalIndent(res, "", "  ")
	return string(b), err
}

func GetNodeTip(ctx context.Context) (*cardano.NodeTip, error) {
	cmd_ := "query tip --mainnet"
	out, err := DoCommand(ctx, cmd_)
	res := map[string]any{}
	err = json.Unmarshal([]byte(out), &res)
	if err != nil {
		return nil, err
	}
	return &cardano.NodeTip{
		Epoch: uint64(res["epoch"].(float64)),
		Block: uint64(res["block"].(float64)),
		Slot:  uint64(res["slot"].(float64)),
	}, err

}

// func GetDelegatedPoolForStakeAddress(ctx context.Context, saddr string) (poolIdBech32 string, err error) {
// 	sout := &strings.Builder{}
// 	cmd := exec.CommandContext(ctx, "cardano-cli", "query", "stake-address-info", "--mainnet", "--address", saddr)
// 	if socketPath == "" && os.Getenv("CARDANO_NODE_SOCKET_PATH") != "" {
// 		socketPath = os.Getenv("CARDANO_NODE_SOCKET_PATH")
// 	}
// 	cmd.Env = []string{fmt.Sprintf("CARDANO_NODE_SOCKET_PATH=%s", socketPath)}
// 	cmd.Stdout = sout
// 	err = cmd.Run()
// 	if err != nil {
// 		return "", err
// 	}
// 	res := []map[string]any{}
// 	err = json.Unmarshal([]byte(sout.String()), &res)
// 	if err != nil {
// 		return "", err
// 	}
// 	return res[0]["delegation"].(string), nil
// }
