---
title: 'DefinicaCore'
description: 'DefinicaCore is the contract you deposit through: it holds the pooled Vault shares and records each user''s position, exits and locks.'
sidebar_position: 4
---

# DefinicaCore

[DefinicaCore](/glossary#definica-core) is the user-facing accounting layer of Phase 1 and the contract you interact with. It forwards your ETH to the dedicated Vault, holds the aggregate Vault shares, and records your position, your exits and your share locks.

## How it works

| Responsibility | What Core does |
|---|---|
| User ledger | Holds the aggregate Vault shares and records each user's proportion of them. |
| Deposit routing | Forwards your ETH to the Vault with Core as receiver and you as [referrer](/glossary#referrer). |
| Position attribution | Credits the returned shares to you or a designated [beneficiary](/glossary#beneficiary). Positions are keyed to the Vault's identity and address. |
| Exits | Manages an exit position itself or routes it to you at the Vault. A [managed partial claim](/glossary#managed-partial-claim) keeps the remainder for later settlement. |
| Share locks | Optional [locks](/concepts/share-locks) of 7 to 365 days, up to 10 open positions per user. |
| Treasury | Gives Definica's multisig the [donator role](/glossary#donator-role): `donateAllAssets()` on Core calls `donateAssets()` on the Vault. |
| Execution safety | A [transient-storage reentrancy guard](/glossary#transient-storage-reentrancy-guard) and an [activation check](/glossary#activation-check) tied to the StakeWise Keeper. |

## What Core does not do

- It does not run or choose validators. The Vault funds validators, and the selected [operator](/glossary#operator) runs them.
- It does not keep your ETH after a deposit. The ETH goes into the Vault; what Core holds is shares.
- It does not set the Vault fee. The Vault has its own administration and its own approved implementation path.
- It does not mint osETH or interact with Aave. Those belong to the Phase 2 contracts, which are separate.

## What it means for you

Because Core holds one aggregate share balance, the Vault sees a single depositor. Core's ledger turns that aggregate into per-user positions: you hold a proportional economic position in the pool, not a specific validator. The ETH value of your position is your proportion of Core's shares multiplied by the Vault's current share price; see [Vault shares](/concepts/vault-shares).

StakeWise's `deposit(receiver, referrer)` records the referrer only in the `Deposited` event. Core sets the receiver to itself and the referrer to the caller, so every pooled deposit at the Vault names the user who made it. The referrer does not change who holds the shares.

## Controls

Core and the Vault are separate [ERC-1967 proxies](/glossary#erc-1967-proxy) that preserve state across upgrades. Core's admin and upgrade authoriser are distinct roles. One implementation is pre-authorised at a time, and it is consumed when the upgrade happens. The activation check makes Core refuse deposits until `Keeper.isCollateralized(vault)` is true, that is, until the Vault has registered validators. See [Controls and upgrades](/phase-1/controls-and-upgrades).

## What you can verify

Core's address is listed on the Contracts card of the Stake screen in the app, and shown again by your wallet before you sign; see [Verify addresses](/security/verify-addresses). You can then read:

- The implementation and admin, from the ERC-1967 storage slots.
- The holders of the upgrade-authoriser and donator roles, readable onchain from Core.
- Core's aggregate share balance, with `getShares(core)` on the Vault.
- `Keeper.isCollateralized(vault)` for the dedicated Vault.

## Related

- [EthPooledStakingVault](/concepts/eth-pooled-staking-vault)
- [Depositing](/phase-1/depositing)
- [Control model](/security/control-model)
