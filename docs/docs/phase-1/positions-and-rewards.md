---
title: 'Positions and rewards'
description: 'What a Definica position consists of, where its rewards come from, how they reach you at each harvest, and how fees and penalties appear.'
sidebar_position: 3
---

# Positions and rewards

A Definica position is a proportion of the aggregate [Vault shares](/glossary#vault-shares) held by [DefinicaCore](/glossary#definica-core). Its ETH value is that proportion multiplied by the Vault's share price, so it rises when the Vault's validators earn and falls when they are penalised. Rewards reach your position without any action on your part and are never paid out as a separate token.

## What a position is made of

| Component | What it is | How it is read |
|---|---|---|
| Principal | The ETH you deposited, in total | Core's deposit history |
| Shares | Your proportion of Core's aggregate shares | Core's ledger |
| Value | `shares × P`, where `P = A / S` | `convertToAssets(shares)` on the Vault |
| Proportion | Your share of Core's position, and Core's share of the Vault | Core's ledger; `getShares(core)` and `totalShares()` on the Vault |
| Rewards | `value − principal`, after Vault fees and before taxes | Derived |
| Locks | Shares committed under a Core lock, with maturity and state | Core's ledger |
| Exit positions | Open exit-queue tickets and claimable amounts | Core's ledger and the Vault |

Here `A` is the Vault's accounted assets and `S` its total shares, so `P` is the ETH value of one share.

## Where rewards come from

Validators earn two kinds of reward:

- **Consensus-layer rewards** for attestations (source, target and head votes), block proposals and sync committee duties.
- **Execution-layer rewards**: priority fees and MEV from the blocks they propose. The Vault uses its own [MEV escrow](/glossary#mev-escrow), as the EthFoxVault lineage does, so it alone collects its block proposal rewards rather than sharing them through StakeWise's Smoothing Pool.

Penalties apply too. A missed source or target vote costs as much as the reward the validator would have earned for it. [Slashing](/glossary#slashing) is a larger penalty for provable misbehaviour; see [Staking and validator risk](/risks/staking-and-validator).

## How rewards reach you

1. Every 12 hours the StakeWise [Oracles](/glossary#oracles) compute the Vault's consensus rewards, penalties and MEV, and sign a Merkle root (6 of 11 Oracles must agree).
2. At the next [harvest](/glossary#harvest) (`updateState`), the Vault's total assets change by the reported amount, fee shares are minted on any profit, pending donations are recognised and the exit queue is processed.
3. The share price `P = A / S` changes, and the value of your position follows in proportion.

Locked shares remain part of reward accounting, so a lock changes none of this.

## Fees in the picture

The [Vault fee](/glossary#vault-fee) is a percentage of rewards, paid as newly minted shares to the fee recipient at each profitable harvest. Those new shares dilute every other share by the same proportion, so the value of your position always reflects performance net of fees. The fee is set for the Vault and shown in the app before you confirm.

In symbols: if a harvest reports a net gain `G` and the fee rate is `f`, shares worth `f × G` go to the fee recipient and the remaining `(1 − f) × G` raises the value of every share. See [Fees](/phase-1/fees).

## Treasury contributions are shown separately

ETH donations and share burns by Definica's [multisig](/glossary#multisig) also raise the share price. They are discretionary and budget-dependent and never a guaranteed APY, so they are reported as their own component, separate from validator performance, and never blended into a headline figure. See [Treasury policy](/phase-1/treasury-policy).

The same rule applies across Definica: staking performance, Aave supply interest and any Definica incentives are always reported as separate components. Any rate the app shows is informational, not a promise.

## Taking rewards out

Rewards stay in the value of your shares until you exit. To take ETH out, including gains, you request an exit for shares; see [Exits and withdrawals](/phase-1/exits-and-withdrawals).

## What you see in the app

The [Home screen](/app#the-home-screen) shows your position's value, in ETH or in Vault shares, its lifetime rewards and the ETH deposited, and how many shares are available to exit or lock, locked, or in the exit queue. Next to it are **Needs you**, with exits ready to claim and matured locks, and the Vault card, with the network, operator, capacity used, share price and fees. [Activity](/app/activity) lists every deposit, exit, lock and reward entry.

## What you can verify

- Your position's value: `convertToAssets(yourShares)` on the Vault.
- The last harvest time: `Keeper.lastRewardsTimestamp()`. Whether a harvest is pending: `isStateUpdateRequired()` on the Vault.
- Fee shares minted: `FeeSharesMinted` events. Treasury contributions: `AssetsDonated` and `SharesDonated` events.

## Related

- [Vault shares](/concepts/vault-shares)
- [Keeper and harvests](/concepts/keeper-and-harvests)
- [Activity](/app/activity) in the app
