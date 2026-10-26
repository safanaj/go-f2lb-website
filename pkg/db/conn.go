package db

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/safanaj/go-f2lb/pkg/logging"
)

type StakeAddressInfo interface {
	StakeAddress() string
	DelegatedPool() string
	DelegatedPoolTicker() string
	AdaAmount() uint64
}

type stakeAddressInfo struct {
	stakeAddress          string
	delegatedPoolIDBech32 string
	delegatedPoolTicker   string
	adaAmount             uint64
}

func (i *stakeAddressInfo) StakeAddress() string {
	if i == nil {
		return ""
	}
	return i.stakeAddress
}

func (i *stakeAddressInfo) DelegatedPool() string {
	if i == nil {
		return ""
	}
	return i.delegatedPoolIDBech32
}

func (i *stakeAddressInfo) DelegatedPoolTicker() string {
	if i == nil {
		return ""
	}
	return i.delegatedPoolTicker
}

func (i *stakeAddressInfo) AdaAmount() uint64 {
	if i == nil {
		return 0
	}
	return i.adaAmount
}

var (
	privateKeyPath    string
	certificatePath   string
	caCertificatePath string
	dbDSN             string = "host=marge.bardels.me port=5432 dbname=cexplorer user=cardano"
	dbPool            *pgxpool.Pool
	dbPoolMu          sync.RWMutex
)

type DBConn interface {
	GetStakeAddressInfo(saddr string) StakeAddressInfo
}

type dbConn struct {
	logging.Logger
	*sql.DB
	ctx context.Context
}

func checkCerts() error {
	if privateKeyPath == "" ||
		certificatePath == "" ||
		caCertificatePath == "" {
		return errors.New("TLS material not provided")
	}
	pfi, err := os.Stat(privateKeyPath)
	if err != nil {
		return err
	}
	cfi, err := os.Stat(certificatePath)
	if err != nil {
		return err
	}
	cafi, err := os.Stat(caCertificatePath)
	if err != nil {
		return err
	}
	if !pfi.Mode().IsRegular() ||
		!cfi.Mode().IsRegular() ||
		!cafi.Mode().IsRegular() {
		return errors.New("TLS material not as regular file")
	}
	return nil
}

func NewDBConn(ctx context.Context, logger logging.Logger) (DBConn, error) {
	if err := checkCerts(); err != nil {
		logger.Error(err, "check TLS material for db connection failed")
		return (*dbConn)(nil), err
	}
	dbPoolMu.Lock()
	defer dbPoolMu.Unlock()
	if dbPool != nil {
		return &dbConn{
			Logger: logger,
			DB:     stdlib.OpenDBFromPool(dbPool),
			ctx:    ctx}, nil
	}

	dbPool, err := pgxpool.New(ctx, dbDSN+fmt.Sprintf(
		" sslcert=%s sslkey=%s sslrootcert=%s",
		certificatePath, privateKeyPath, caCertificatePath))
	if err != nil {
		logger.Error(err, "creating db connection pool failed")
		return (*dbConn)(nil), err
	}
	go func() {
		<-ctx.Done()
		dbPool.Close()
		dbPoolMu.Lock()
		defer dbPoolMu.Unlock()
		dbPool = nil
	}()
	return &dbConn{
		Logger: logger,
		DB:     stdlib.OpenDBFromPool(dbPool),
		ctx:    ctx}, nil
}

func (dbc *dbConn) GetStakeAddressInfo(saddr string) StakeAddressInfo {
	if dbc == nil {
		return nil
	}

	query := getStakeAddressInfoSQL(saddr)
	dbc.Info("gonna query with", "sql", query)
	ctx, cancel := context.WithTimeout(dbc.ctx, 5*time.Second)
	defer cancel()

	var info stakeAddressInfo
	var amount float64
	err := dbc.DB.QueryRowContext(ctx, query).Scan(
		&info.delegatedPoolIDBech32,
		&info.delegatedPoolTicker,
		&info.stakeAddress,
		&amount,
	)
	if err != nil {
		dbc.Error(err, "unable to execute query")
		return nil
	}
	info.adaAmount = uint64(amount)
	dbc.Info("got from db", "info", info)
	return &info
}
