---
title: 'Control model'
description: 'Who controls Core, the Vault and the treasury, what each role can do, and how to read every role holder onchain.'
sidebar_position: 2
---

# Control model

Definica is non-custodial, but that does not mean no administrative or operational permissions exist. This page lists every role on DefinicaCore, EthPooledStakingVault and the treasury, what each can do, what limits it, and how to read who holds it.

## The model in four lines

| Area | Control |
|---|---|
| Core upgrades | Distinct admin and upgrade authoriser; one pre-authorised implementation at a time |
| Treasury | Definica's multisig executes contributions |
| [Activation check](/glossary#activation-check) | Core accepts deposits only once `Keeper.isCollateralized(vault)` is true |
| Vault | Its own administration and an approved implementation pathway |

## Roles and powers

| Role | Contract | Powers | Limits |
|---|---|---|---|
| Admin | DefinicaCore | Administrative configuration | Distinct from the upgrade authoriser |
| Upgrade authoriser | DefinicaCore | Pre-authorises one implementation | The approval is consumed on upgrade |
| [Donator](/glossary#donator-role) | DefinicaCore | `donateAllAssets()`, forwarding ETH to the Vault's `donateAssets()` | Adds assets only; cannot mint or move user shares |
| [Vault admin](/glossary#vault-admin) | EthPooledStakingVault | Fee percentage and recipient, metadata, role assignment, upgrades | Fee changes within StakeWise's limits; upgrades only to DAO-registered implementations, one version at a time |
| [Blocklist manager](/glossary#blocklist) | EthPooledStakingVault | `updateBlocklist`, `ejectUser` | Inherited from EthFoxVault; ejected shares enter the exit queue for their owner |
| [Validators manager](/glossary#validators-manager) | EthPooledStakingVault | Register, fund, consolidate and withdraw validators | Oracle approval required |
| [Fee recipient](/glossary#vault-fee) | EthPooledStakingVault | Receives fee shares | Passive |
| [Multisig](/glossary#multisig) | Treasury | Executes ETH donations and burns of its own shares | Never touches Core's user balances |
| StakeWise DAO | VaultsRegistry, Keeper | Registers implementations and factories; selects the Oracles | Cannot change or upgrade a Vault's contracts unilaterally |
| Aave governance and risk stewards | Aave V3 Ethereum | Reserve parameters, caps, eMode membership | Aave's own process |

The holder of each role is readable onchain:

- On the Vault, `admin()`, `validatorsManager()`, `blocklistManager()` and `feeRecipient()` return the current holders.
- On Core, the admin, upgrade authoriser and donator are returned by the role getters in Core's verified source on a block explorer.
- The multisig's signers and threshold are read from the multisig contract itself (on a Safe, `getOwners()` and `getThreshold()`).

## What the separation buys

- **Core upgrades** need two roles to agree: one pre-authorises a specific implementation and the other executes the upgrade. The approval is single-use.
- **The Vault** cannot be upgraded to arbitrary code: the target must already be registered by the StakeWise DAO and be the next version of the same Vault type.
- **The treasury** can only strengthen shares, by adding ETH or burning its own shares; it has no power over user balances.
- **Core's activation check** depends on Keeper collateralisation, an external fact Definica cannot fake: the Vault must have registered validators, which requires Oracle approval.

## Incident controls

In response to an incident, Definica can pause the interface, recommend that users stop interacting, migrate contracts, disable a module or restrict deposits. No emergency action is guaranteed to be available, timely or effective. Any such action is announced through the official channels listed on [Source of truth](/security/source-of-truth).

## What you can verify

- The role holders on Core and the Vault, read onchain as described above.
- The ERC-1967 implementation and admin slots of both proxies.
- `VaultsRegistry.vaultImpls(implementation)` for the Vault's implementation.
- The multisig's signers and threshold, on its own contract.
- `Keeper.isCollateralized(vault)`.

## Related

- [Controls and upgrades](/phase-1/controls-and-upgrades), for the mechanics of each control
- [Treasury policy](/phase-1/treasury-policy)
- [Smart contract and upgrade risk](/risks/smart-contract-and-upgrade)
