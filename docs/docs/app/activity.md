---
title: 'Activity'
description: 'Every deposit, exit, lock and reward of your account, each traced to its transaction, and how to read your position figures.'
sidebar_position: 6
---

# Activity

The Activity screen is the history of the connected account: every deposit, exit, lock and reward, each with a link to its transaction. Read together with the position card on the Overview, it lets you trace each figure in your position back to an onchain event.

## The Activity screen

Filters at the top narrow the list to **Deposits**, **Exits**, **Locks** or **Rewards**; **All** shows everything, newest first. Without a wallet, the screen asks you to connect.

| Entry | Recorded when | Amount shown |
|---|---|---|
| Staked | A deposit is confirmed | The ETH deposited |
| Exit requested | Shares enter the exit queue | The estimated ETH, with the route |
| Exit claimed | The ETH of an exit is paid out | The ETH claimed |
| Shares locked | A share lock is created | The shares, with the lock's duration |
| Lock released | A matured lock is released | The shares |
| Rewards accrued | A Vault harvest adds rewards to your position | The ETH added |

Each entry shows how long ago it happened and links to its transaction on Etherscan. Amounts that add to your position carry a plus sign, and ETH leaving it carries a minus sign. An entry still waiting for confirmation is marked **Pending**, and one that failed is marked **Failed**.

## Your position figures

The position card on the [Overview](/app) sums up the account.

| Figure | What it means |
|---|---|
| Value | Your Vault shares converted to ETH at the current share price |
| Rewards (lifetime) | What the position has earned, after fees |
| Available | Shares free to exit or lock; the number locked is shown beneath |
| Vault shares and ETH deposited | Your shares in DefinicaCore's ledger, and the ETH you have put in |
| Chart | The value over the last week, month or three months, with the change in ETH and per cent |

The **Your layers** card keeps each source of return on its own line: staking performance, Aave supply interest and Definica incentives, never blended into one number.

## Reading the numbers

- **Values move at harvests.** Rewards and penalties reach the Vault through StakeWise's [Oracles](/glossary#oracles) every 12 hours and apply at a [harvest](/glossary#harvest). Your value changes then, not continuously.
- **No projected rate.** The app shows the share price and its past change, not an APY. Treasury contributions from Definica's multisig raise the value of every share, but they are discretionary and never a guaranteed return. See [Treasury policy](/phase-1/treasury-policy).
- **Exit amounts are estimates until claimed.** A queued exit shows its ETH at the current share price; the amount paid follows the Vault's accounting.

## What you can verify

- Each entry's transaction, through its Etherscan link.
- Your position's ETH value: `convertToAssets(shares)` on the Vault.
- Core's aggregate Vault shares and the Vault's total: `getShares(core)` and `totalShares()` on the Vault.
- Treasury contributions: `AssetsDonated` and `SharesDonated` events on the Vault.

## Related

- [Positions and rewards](/phase-1/positions-and-rewards)
- [Treasury policy](/phase-1/treasury-policy)
- [Keeper and harvests](/concepts/keeper-and-harvests)
