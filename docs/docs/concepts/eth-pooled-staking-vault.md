---
title: 'EthPooledStakingVault'
description: 'EthPooledStakingVault is Definica''s dedicated StakeWise Vault: based on EthFoxVault, it pools ETH, funds validators and mints no osETH.'
sidebar_position: 5
---

# EthPooledStakingVault

[EthPooledStakingVault](/glossary#eth-pooled-staking-vault) is Definica's dedicated staking Vault and the share layer of Phase 1. It is a StakeWise [Vault](/glossary#vault) based on [EthFoxVault](/glossary#ethfoxvault): it accepts ETH only and does not mint osETH.

## How it works

The Vault pools the ETH that [DefinicaCore](/concepts/definica-core) forwards and funds validators, 32 ETH each, that the selected [operator](/glossary#operator) runs. It reflects rewards and penalties through share accounting at each [harvest](/concepts/keeper-and-harvests), runs the [exit queue](/concepts/exit-queue) and mints fee shares to the fee recipient. It is an [ERC-1967 proxy](/glossary#erc-1967-proxy) with its own admin and a StakeWise-approved implementation path.

A StakeWise Vault is an isolated staking pool: a contract that takes deposits, distributes rewards and handles withdrawals without a custodian. Vaults do not socialise risk. Each deposit funds only that Vault's validators, and its rewards and penalties stay inside that Vault. A Vault's admin can upgrade it only to implementations the StakeWise DAO has registered.

## What it inherits from EthFoxVault

EthFoxVault is StakeWise's custom non-ERC-20 Vault with a blocklist, its own MEV escrow and no osToken minting, in the `stakewise/v3-core` repository. StakeWise built it for Consensys/MetaMask staking. Definica's Vault inherits these features:

| Feature | What it means |
|---|---|
| Non-transferable shares | Shares are ledger entries, not tokens. |
| No osToken minting | The `VaultOsToken` module is absent, so the Vault cannot mint osETH. |
| [Blocklist](/glossary#blocklist) and `ejectUser` | A blocklist manager can block addresses and move a blocked user's shares into the exit queue. Deposits check both sender and receiver. |
| Own [MEV escrow](/glossary#mev-escrow) | Block proposal rewards go to this Vault alone, not through the Smoothing Pool. |
| Immutable [capacity](/glossary#capacity) | A deposit limit set at creation; a deposit beyond it reverts with `CapacityExceeded`. |
| [Fee](/glossary#vault-fee) on rewards | A percentage of rewards, paid as new shares to the fee recipient at each profitable harvest. |
| Donation functions | `donateAssets()` and `donateShares()`, which the [treasury](/concepts/treasury) uses. |
| Upgradeability | Upgrades only to DAO-registered implementations of the same type, one version at a time. |

Consensys Diligence reviewed EthFoxVault for StakeWise. That review covers StakeWise's contract, not Definica's version of it; see [Audits](/security/audits). The diff from EthFoxVault, the source revisions and compiler settings, and the proxy and implementation addresses are part of Definica's [release evidence](/security/release-evidence).

## Registry admission

StakeWise's [VaultsRegistry](/glossary#vaults-registry) is the canonical onchain list of valid Vaults. It also whitelists factories and approved implementations, and only its owner, the StakeWise DAO, can add implementations. The Keeper and the Oracles treat a Vault as valid only once it is in the registry. A custom Vault that no factory created, such as one of the EthFoxVault type, is admitted when the registry owner registers it directly.

## What it means for you

- Your ETH funds only this Vault's validators, and only this Vault's rewards and penalties reach your position.
- Your shares cannot be moved to another wallet. You leave through the [exit queue](/concepts/exit-queue).
- The Vault cannot mint osETH, so Phase 1 shares are not an entry to Phase 2; see [osETH](/concepts/oseth).
- The Vault's capacity, fee, fee recipient, minimum deposit and operator are set per Vault and shown in the app before you confirm, together with the network and the participation conditions.

## What you can verify

The Vault's address is listed on the Contracts card of the Stake screen in the app; the StakeWise registry and Keeper addresses are in [Verify addresses](/security/verify-addresses).

| Check | How |
|---|---|
| The Vault is a recognised StakeWise Vault | `VaultsRegistry.vaults(vault)` |
| It has registered validators | `Keeper.isCollateralized(vault)` |
| Capacity, fee and fee recipient | `capacity()`, `feePercent()` in basis points, `feeRecipient()` |
| Admin, version and implementation | `admin()`, `version()`, `implementation()` |
| Whether a harvest is pending | `isStateUpdateRequired()` |
| Blocklist manager | `blocklistManager()` |

## Related

- [DefinicaCore](/concepts/definica-core)
- [Keeper and harvests](/concepts/keeper-and-harvests)
- [Controls and upgrades](/phase-1/controls-and-upgrades)
