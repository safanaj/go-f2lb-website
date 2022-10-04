package blockfrostutils

import (
	"context"
	// "fmt"
	flag "github.com/spf13/pflag"
	"strconv"
	// "strings"
	// "time"

	"github.com/blockfrost/blockfrost-go"
)

type BlockFrostClient struct {
	ctx context.Context
	api blockfrost.APIClient
}

var projectId string

func AddFlags(fs *flag.FlagSet) {
	fs.StringVar(&projectId, "blockfrost-project-id", "", "")
}

func New(ctx context.Context) *BlockFrostClient {
	if projectId == "" {
		return nil
	}
	api := blockfrost.NewAPIClient(
		blockfrost.APIClientOptions{
			Server:    blockfrost.CardanoMainNet,
			ProjectID: projectId,
		},
	)
	return &BlockFrostClient{ctx: ctx, api: api}
}

func (c *BlockFrostClient) GetBlockFrostClient() blockfrost.APIClient { return c.api }
func (c *BlockFrostClient) GetContext() context.Context               { return c.ctx }

func (c *BlockFrostClient) GetStakeAddressInfo(stakeAddr string) (delegatedPool string, totalAda uint32, err error) {
	account, err := c.api.Account(c.ctx, stakeAddr)
	if err != nil {
		return "", 0, err
	}
	amount, err := strconv.ParseUint(account.ControlledAmount, 10, 64)
	if err != nil {
		return "", 0, err
	}
	delegatedPool = account.PoolID
	totalAda = uint32(amount / 1e6)
	return
}
