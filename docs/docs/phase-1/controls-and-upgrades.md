---
title: 'Controls and upgrades'
description: 'Who can change what in Phase 1: the proxies, Core''s admin and upgrade authoriser, its safety checks and the Vault''s upgrade path.'
sidebar_position: 7
---

# Controls and upgrades

Phase 1 runs on two upgradeable contracts with separate controls. [DefinicaCore](/glossary#definica-core) and [EthPooledStakingVault](/glossary#eth-pooled-staking-vault) are separate ERC-1967 proxies that keep their state across upgrades: Core has a distinct admin and upgrade authoriser, and the Vault has its own admin, who can upgrade only to implementations the StakeWise DAO has registered.

Non-custodial does not mean that no administrative or operational permissions exist. This page sets out each one and where you can check it.

## The control model in one table

| Area | Control |
|---|---|
| Core upgrades | Distinct admin and upgrade authoriser; one pre-authorised implementation at a time |
| Treasury | Definica's multisig executes every contribution |
| Deposits | Keeper collateralisation and Core's activation check |
| Vault | Its own administration and a StakeWise-approved implementation path |

## ERC-1967 proxies

An [ERC-1967 proxy](/glossary#erc-1967-proxy) stores the address of its logic contract in a standard storage slot and delegates calls to it. An upgrade replaces the logic while the proxy's storage, and with it every user's position, stays where it is. Both Core and the Vault use this pattern; StakeWise deploys every Vault as an upgradeable ERC-1967 proxy. You can read a proxy's current implementation and admin directly from its storage slots.

## Core: admin and upgrade authoriser

Core has two roles, held separately:

- The **admin** administers Core.
- The **upgrade authoriser** pre-authorises exactly one implementation at a time. When the upgrade happens, that approval is consumed.

As a result, no single key can both choose the upgrade target and carry out the upgrade without the other role having pre-approved exactly that target. The holders of both roles are readable onchain; see [What you can verify](#what-you-can-verify).

## Core: transient-storage reentrancy guard

Core's [reentrancy guard](/glossary#transient-storage-reentrancy-guard) uses EIP-1153 transient storage (`TSTORE`/`TLOAD`), whose state is discarded after every transaction; EIP-1153 names reentrancy locks as a primary use case. It needs an EVM with the Cancun upgrade, which Ethereum mainnet has. For you, the effect is a standard protection against a contract re-entering Core in the middle of a call.

## Core: activation check

Core's [activation check](/glossary#activation-check) is linked to Keeper collateralisation. StakeWise's `Keeper.isCollateralized(vault)` is true once the Vault has registered validators, and Core refuses deposits until it is, so ETH never flows into a Vault without validators. See [Keeper and harvests](/concepts/keeper-and-harvests).

## Vault: its own admin and StakeWise-registered implementations

The [Vault admin](/glossary#vault-admin) is the primary controller of the Vault: it manages permissions, sets the fee and fee recipient, updates metadata and adjusts settings. Upgrades are constrained by StakeWise's [VaultsRegistry](/glossary#vaults-registry): the admin can upgrade only to an implementation the StakeWise DAO has registered, of the same Vault type and exactly one version higher, so versions cannot be skipped. In the other direction, the StakeWise DAO cannot change or upgrade a Vault's contracts unilaterally.

The EthFoxVault lineage also lets the Vault admin assign the [validators manager](/glossary#validators-manager) and the [blocklist manager](/glossary#blocklist). The blocklist manager can update the blocklist (`updateBlocklist`) and eject a user (`ejectUser`), which forces a blocked user's shares into the exit queue.

## Incident response

In an incident, Definica can pause the app's interface, recommend that users stop interacting, migrate contracts, disable a module, restrict deposits or take another technically available action. Definica does not guarantee that any of these actions will be available, timely, effective or approved when needed.

## What you can verify

| Check | How |
|---|---|
| Core's implementation and admin | ERC-1967 slots `eip1967.proxy.implementation` and `eip1967.proxy.admin` |
| Core's upgrade authoriser and donator | Core's role assignments, read on Core |
| Vault's implementation, admin and version | `implementation()`, `admin()` and `version()` on the Vault, or its ERC-1967 slots |
| The Vault implementation is registered | `VaultsRegistry.vaultImpls(implementation)` on the StakeWise registry |
| Fee and fee recipient | `feePercent()` and `feeRecipient()` on the Vault |
| Blocklist manager | `blocklistManager()` on the Vault |
| Multisig | Its signers and threshold, read from the multisig itself |
| Collateralisation | `Keeper.isCollateralized(vault)` |

Core's and the Vault's addresses are listed on the Contracts card of the Stake screen in the app, and your wallet shows them again before you sign; see [Verify addresses](/security/verify-addresses).

## Related

- [Control model](/security/control-model)
- [Smart contract and upgrade risk](/risks/smart-contract-and-upgrade)
- [Release evidence](/security/release-evidence)
