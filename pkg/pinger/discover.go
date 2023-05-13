package pinger

import (
	"context"
	"fmt"
	"net"
	"strings"

	ku "github.com/safanaj/go-f2lb/pkg/caches/koiosutils"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

func getTargetsFromRelay(ctx context.Context, relay ku.Relay) ([]string, error) {
	targets := []string{}
	if relay.DNS != "" {
		targets = append(targets, fmt.Sprintf("%s:%d", relay.DNS, relay.Port))
	} else if relay.Ipv4 != "" {
		targets = append(targets, fmt.Sprintf("%s:%d", relay.Ipv4, relay.Port))
	} else if relay.Ipv6 != "" {
		targets = append(targets, fmt.Sprintf("%s:%d", relay.Ipv6, relay.Port))
	} else if relay.Srv != "" {
		_, srvs, err := net.DefaultResolver.LookupSRV(ctx, "", "", relay.Srv)
		if err != nil {
			return utils.UniquifyStrings(targets), err
		}
		for _, r := range srvs {
			targets = append(targets, fmt.Sprintf("%s:%d", strings.TrimSuffix(r.Target, "."), r.Port))
		}
	}
	return targets, nil
}
