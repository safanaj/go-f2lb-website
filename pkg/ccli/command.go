package ccli

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"

	flag "github.com/spf13/pflag"

	"github.com/safanaj/cardano-go"
)

var socketPath, fallbackSocketPath string

func AddFlags(fs *flag.FlagSet) {
	fs.StringVar(&socketPath, "cardano-node-socket-path", "", "")
	fs.StringVar(&fallbackSocketPath, "fallback-cardano-node-socket-path", "", "")
}

func availableAsSocket(fn string) bool {
	fi, err := os.Stat(fn)
	if err != nil {
		return false
	}
	if (fi.Mode().Type() & os.ModeSocket) != os.ModeSocket {
		return false
	}
	return true
}

func getSocketPathToUse() string {
	sp := socketPath
	if sp != "" && availableAsSocket(sp) {
		return sp
	}
	sp = fallbackSocketPath
	if sp != "" && availableAsSocket(sp) {
		return sp
	}
	return os.Getenv("CARDANO_NODE_SOCKET_PATH")
}

func DoCommand(ctx context.Context, cmd_ string) (string, error) {
	sout := &strings.Builder{}
	cmd := exec.CommandContext(ctx, "cardano-cli", strings.Split(cmd_, " ")...)
	sp := getSocketPathToUse()
	if socketPath == "" && sp != "" {
		// just to short circuit next time
		socketPath = sp
	}
	cmd.Env = []string{fmt.Sprintf("CARDANO_NODE_SOCKET_PATH=%s", sp)}
	// fmt.Printf("DoCommand: env: %v\nargs: %v\n", cmd.Env, cmd.Args)
	cmd.Stdout = sout
	err := cmd.Run()
	if err != nil {
		// TODO: check error and in case is connection related re-try with fallback socket if available
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
