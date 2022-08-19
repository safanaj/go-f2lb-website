package f2lb_gsheet

import (
	"context"
	"io/ioutil"

	"golang.org/x/oauth2/google"
	// "google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"

	"github.com/safanaj/go-f2lb/pkg/utils"
)

var serviceAccountCredsJSONFileName string

type F2LB struct {
	*sheets.Service

	// Drive   *drive.Service
	ctx context.Context
	// modTime string
}

func NewF2LB(ctx context.Context) *F2LB {
	creds, err := ioutil.ReadFile(serviceAccountCredsJSONFileName)
	utils.CheckErr(err)
	conf, err := google.JWTConfigFromJSON(creds, sheets.SpreadsheetsReadonlyScope)
	utils.CheckErr(err)
	svc, err := sheets.NewService(ctx, option.WithScopes(sheets.SpreadsheetsReadonlyScope),
		option.WithTokenSource(conf.TokenSource(ctx)))
	utils.CheckErr(err)
	// drv, err := drive.NewService(ctx, option.WithScopes(drive.DriveReadonlyScope),
	// 	option.WithTokenSource(conf.TokenSource(ctx)))
	// utils.CheckErr(err)

	return &F2LB{Service: svc, ctx: ctx /* , Drive: drv */}
}
