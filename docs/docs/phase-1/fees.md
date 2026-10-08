---
title: 'Fees'
description: 'How the Vault fee works in Phase 1, where you read it onchain, and what the app shows before you confirm a transaction.'
sidebar_position: 8
---

# Fees

Fees reduce the net performance of your position, never its principal. The [Vault fee](/glossary#vault-fee) is a percentage of rewards, set by the Vault admin within StakeWise's limits and paid as newly minted shares to the fee recipient at each profitable harvest. The app shows it before you confirm, and you can read it onchain at any time.

## The Vault fee

| Property | How it works |
|---|---|
| What it applies to | Rewards only, never principal. StakeWise allows a fee of 0% to 100% of staking rewards. |
| How it is taken | At each harvest with a profit, `feeRecipientAssets = profit × feePercent / maxFeePercent` is minted as shares to the fee recipient (`FeeSharesMinted`). |
| Units | `feePercent()` returns basis points. |
| Who sets it | The Vault admin, within StakeWise's limits. |
| Limits on changes | Increases are limited to 20% increments with 3-day delays. A fee that is currently 0% cannot exceed 1% at first. |
| Who receives it | The fee recipient, set by the Vault admin and readable with `feeRecipient()`. |
| StakeWise's own charge | None. The StakeWise DAO charges Vault creators and stakers nothing for using Vaults. |

Because the fee is paid in shares, it dilutes every other shareholder by the same proportion rather than being deducted from any one position. The value of your position therefore always reflects performance net of the Vault fee.

## How a harvest is split

If a harvest reports a net gain `G` and the fee rate is `f` (that is, `feePercent / maxFeePercent`):

- shares worth `f × G` are minted to the fee recipient;
- the remaining `(1 − f) × G` raises the value of every share;
- a position holding a proportion `p` of the Vault gains `p × (1 − f) × G` from that harvest.

## What you see before you confirm

The Stake screen shows the total fee as a percentage of rewards, taken from rewards and never from your deposit. The transaction review lists the Vault fee and any Definica fee as separate lines, each as a percentage of rewards, alongside the share price, the minimum deposit and the remaining capacity.

## Gas and other charges

Each deposit, exit request, claim and lock action is its own Ethereum transaction, and some actions take more than one: an exit needs a request and a claim, and a partial claim adds another. Your wallet shows the gas for each transaction before you sign.

Some charges belong to other phases and do not apply here:

- The StakeWise DAO's 5% fee on osToken rewards applies to minted osETH. The Phase 1 Vault does not mint osETH, so it does not apply.
- Aave's reserve factor and borrow interest belong to [Phase 2](/phase-2) and [Phase 3](/phase-3). Any such market charge is shown before you confirm a transaction there.

## What you can verify

- `feePercent()` (in basis points) and `feeRecipient()` on the Vault.
- `FeeSharesMinted` events at each harvest.

## Related

- [Positions and rewards](/phase-1/positions-and-rewards)
- [Vault shares](/concepts/vault-shares)
- [Stake](/app/stake) in the app
