package db

import "fmt"

const getStakeAddressInfoFmt string = `
WITH
saddr as (
    select id, view
    from stake_address
    where view = '%s'
),
utxo_balance AS (
    SELECT COALESCE(SUM(value), 0) AS amount, stake_address_id as saddr_id
    FROM utxo_view
    where stake_address_id = (select id from saddr)
	group by stake_address_id
),
rewards AS (
    SELECT COALESCE(SUM(amount), 0) AS amount
    FROM reward
    where addr_id = (select id from saddr)
),
withdrawals AS (
    SELECT COALESCE(SUM(amount), 0) AS amount
    FROM withdrawal
    where addr_id = (select id from saddr)
),

total_controlled_ada as (
SELECT
    (u.amount + r.amount - w.amount) / 1000000.0 AS total_controlled_ada,
    u.saddr_id
FROM utxo_balance u, rewards r, withdrawals w
),
phid as (SELECT pool_hash_id as id, addr_id FROM public.delegation
where addr_id = (select id from saddr)
order by slot_no desc
limit 1),

delegated_pool as (
SELECT
    (select addr_id from phid) as saddr_id,
    ph.view AS pool_id,
    opd.ticker_name
FROM pool_hash ph
JOIN pool_update pu ON pu.hash_id = ph.id
JOIN pool_metadata_ref pmr ON pu.meta_id = pmr.id
JOIN off_chain_pool_data opd ON opd.pmr_id = pmr.id
where ph.id = (select id from phid)
order by pu.active_epoch_no desc limit 1
)

select pool_id, ticker_name, view, total_controlled_ada
from saddr sa
join delegated_pool dp on dp.saddr_id = sa.id
join total_controlled_ada tca on tca.saddr_id = sa.id;
`

func getStakeAddressInfoSQL(sa string) string {
	return fmt.Sprintf(getStakeAddressInfoFmt, sa)
}
