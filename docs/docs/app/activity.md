---
title: 'Activity'
description: 'Every stake, exit, lock and reward of your account, grouped by day and traced to its transaction, the CSV export, and how to read the position figures on Home.'
sidebar_position: 6
---

# Activity

The Activity screen is the history of the connected account: every stake, exit, lock and reward, each traced to its transaction. Read together with the position card on Home, it lets you trace each figure in your position back to an onchain event.

## The Activity screen

Filters at the top narrow the list to **Deposits**, **Exits**, **Locks** or **Rewards**; **All** shows everything. Entries are grouped by day, newest first, under **Today**, **Yesterday** or the date, and each shows the time it happened. Without a wallet, the screen asks you to connect.

| Entry | Recorded when | Amount shown | Filter |
|---|---|---|---|
| Staked | A deposit is confirmed | The ETH deposited, with the Vault shares received | Deposits |
| Exit requested | Shares enter the exit queue | The estimated ETH, with the shares and the route | Exits |
| Exit claimed | The ETH of an exit is paid out | The ETH claimed | Exits |
| Shares locked | A share lock is created | The shares, with the lock's duration | Locks |
| Lock released | A matured lock is released | The shares | Locks |
| Rewards accrued | A Vault harvest adds rewards to your position | The ETH added | Rewards |
| Treasury contribution | A treasury contribution to the Vault adds to your position | The ETH added | Rewards |

Amounts that add to your position carry a plus sign, and ETH leaving it carries a minus sign. An entry with a transaction shows its short hash, linked to Etherscan.

Select an entry to open its transaction's [receipt](/app#receipts): its status, the amount, the date, the network fee, the transaction hash with a button to copy it, and **View on Etherscan**. The entries under **Recent activity** on Home, the transactions in the bell and the **View transaction** buttons after a transaction open the same receipt.

### Pending and failed entries

A transaction you send appears at the top of the list once it is submitted, under its name, for example **Stake ETH**, and marked **Pending** until it is confirmed; its receipt reads **Pending** until then. An entry that failed is marked **Failed**, with its amount struck through. The bell in the top bar lists the transactions of this visit too, including those still in progress, and its **All activity** link opens this screen.

### Export

**Export CSV**, at the top of the screen, downloads the entries shown under the current filter as `definica-activity.csv`, with each entry's date, type, direction, amount, asset, status, note and transaction. It appears once the account has activity.

When the account has no entries yet, the screen reads **No activity yet**; when a filter matches nothing, it reads **Nothing here**.

## Your position figures

The position card on [Home](/app#the-home-screen) sums up the account.

| Figure | What it means |
|---|---|
| Value | Your Vault shares converted to ETH at the current share price, or the shares themselves if you show the position in Vault shares |
| Lifetime rewards | What the position has earned after fees: staking rewards and treasury contributions, less penalties |
| Deposited | The ETH you have put in |
| Chart | The position's value over the range you pick (**1W**, **1M**, **3M** or **All**), drawn in steps. The figure above it is what the position earned over that range, never your deposits. |
| Available | Shares free to exit or lock |
| Locked | Shares under a lock, still earning |
| In the exit queue | Shares in an exit request, still earning until the Vault burns them |
| Share price | The ETH value of one Vault share, with its change in 30 days |

The **Your layers** card keeps each layer on its own line, never added together, and **Where your return comes from** lists staking rewards, treasury contributions and penalties separately, never blended into one rate.

## Reading the numbers

- **Values move at harvests.** Rewards and penalties reach the Vault through StakeWise's [Oracles](/glossary#oracles) every 12 hours and apply at a [harvest](/glossary#harvest). Your value changes then, not continuously, which is why the chart moves in steps.
- **No projected rate.** The app shows the share price and its past change, not an APY. Treasury contributions from Definica's multisig raise the value of every share, but they are discretionary and never a guaranteed return. See [Treasury policy](/phase-1/treasury-policy).
- **Exit amounts are estimates until claimed.** A queued exit shows its ETH at today's share price; the amount paid follows the Vault's accounting.

## What you can verify

- Each entry's transaction, through its Etherscan link.
- Your position's ETH value: `convertToAssets(shares)` on the Vault.
- Core's aggregate Vault shares and the Vault's total: `getShares(core)` and `totalShares()` on the Vault.
- Treasury contributions: `AssetsDonated` and `SharesDonated` events on the Vault.

## Related

- [Positions and rewards](/phase-1/positions-and-rewards)
- [Treasury policy](/phase-1/treasury-policy)
- [Keeper and harvests](/concepts/keeper-and-harvests)
