---
title: 'Vault shares'
description: 'Vault shares are the accounting units of your position, each a proportional claim on the Vault''s assets at a price of P = A / S.'
sidebar_position: 1
---

# Vault shares

Your Phase 1 position is a number of Vault shares, not an ETH balance. Each share is a proportional claim on the assets of Definica's dedicated Vault, and its ETH value, `P = A / S`, moves with the Vault's net performance after fees.

## What a share is

A StakeWise [Vault](/glossary#vault) does not keep a per-user ETH balance. It keeps a total of accounted assets and a total of [shares](/glossary#vault-shares), and each share is a proportional claim on those assets. Definica's Vault, [EthPooledStakingVault](/concepts/eth-pooled-staking-vault), is a non-ERC-20 Vault of the [EthFoxVault](/glossary#ethfoxvault) type, so its shares are ledger entries, not tokens you can move between wallets.

[DefinicaCore](/concepts/definica-core) holds the aggregate shares issued for Definica deposits and records what proportion of them belongs to each user.

## How it works

Three symbols describe the Vault at any moment:

| Symbol | Meaning |
|---|---|
| `A` | Accounted assets in the Vault, in ETH, as of the last [harvest](/glossary#harvest) |
| `S` | Total shares outstanding, greater than zero |
| `P = A / S` | The ETH value of one share |

The Vault converts between ETH and shares at that price:

```text
shares = assets × S / A      (a deposit rounds up)
assets = shares × A / S      (rounds down by default)
```

Every conversion rounds. Two deposits of the same amount made at different times receive different numbers of shares, small residual amounts can arise, and the ETH value of a position is never exactly its number of shares.

## What moves the share price

| Event | `A` | `S` | `P` |
|---|---|---|---|
| Rewards reported at a harvest | Up | Unchanged | Up |
| Penalties or [slashing](/glossary#slashing) reported at a harvest | Down | Unchanged | Down |
| [Vault fee](/glossary#vault-fee) minted on profit | Unchanged | Up, as fee shares | Up by less than the gross reward |
| A deposit | Up by the deposit | Up by `deposit × S / A` | Unchanged, apart from rounding |
| [Exit queue](/glossary#exit-queue) processed | Down by the exited assets | Down by the burned shares | Unchanged |
| Treasury [ETH donation](/glossary#eth-donation) of `D` | Up by `D` at the next successful harvest | Unchanged | Up by `D / S` |
| [Treasury share burn](/glossary#treasury-share-burn) of `B` | Unchanged | Down by `B` | Up by `B / (S − B)`, relative |

Shares never rebase. When the Vault earns, each share is worth more ETH; when it loses, each share is worth less. The two treasury routes are explained in [Treasury](/concepts/treasury).

## What it means for you

- Your ETH value is your shares multiplied by the current `P`, so every Definica user's value moves with the Vault's net performance in the same proportion.
- The app tracks your principal, shares, rewards, locks and exits separately, so each can be read on its own.
- Fees reduce net performance: your position is your share of the Vault after protocol and operator fees. The fees that apply are set per Vault and shown in the app before you confirm; see [Fees](/phase-1/fees).

**Illustration (made-up numbers, not a forecast).** Suppose `A = 1,000 ETH` and `S = 950`, so `P ≈ 1.0526 ETH`. A 1 ETH deposit mints `1 × 950 / 1,000 = 0.95` shares, worth 1 ETH at that price. If later harvests raise `P` to `1.0632 ETH`, the same 0.95 shares are worth about `1.01 ETH`; if penalties lower `P` to `1.0400 ETH`, they are worth about `0.988 ETH`.

## What you can verify

The Vault's address is listed on the Contracts card of the Stake screen in the app, and shown again by your wallet before you sign; see [Verify addresses](/security/verify-addresses). On the Vault you can read:

- `totalAssets()` and `totalShares()`, for `A` and `S`.
- `convertToShares(assets)` and `convertToAssets(shares)`, for the current conversions.
- `getShares(core)`, for Core's aggregate share balance.
- `isStateUpdateRequired()`, to see whether a harvest is pending.

## Related

- [Positions and rewards](/phase-1/positions-and-rewards)
- [Keeper and harvests](/concepts/keeper-and-harvests)
- [Treasury policy](/phase-1/treasury-policy)
