---
title: 'Smart contract and upgrade risk'
description: 'Contracts can contain bugs and be upgraded: how Definica separates upgrade powers, what audits cover and which admin roles remain.'
sidebar_position: 2
---

# Smart contract and upgrade risk

Any contract can contain a flaw, and Definica's contracts can be upgraded. This page covers bugs, upgrade powers, the administrative roles that remain in a non-custodial design, and the third-party contracts your position depends on.

DefinicaCore and EthPooledStakingVault are upgradeable [ERC-1967 proxies](/glossary#erc-1967-proxy). The Vault inherits administrative powers from [EthFoxVault](/glossary#ethfoxvault), and the system depends on StakeWise and Aave, which have their own contracts, governance and upgrade paths. Non-custodial does not mean that no administrative or operational permissions exist. Verify every address you interact with; see [Verify addresses](/security/verify-addresses).

## Bugs

Audits reduce the chance of a flaw; they do not remove it. DefinicaCore and EthPooledStakingVault have been reviewed in two private audits, and the reports are provided on request; see [Audits](/security/audits). No audit, review or monitoring system guarantees that a contract is secure.

The EthFoxVault that Definica's Vault is based on was reviewed for StakeWise by Consensys Diligence. That review flagged, among other things, trust in privileged accounts and in the Oracles, unsanitised parameters, and unprotected initialisation in non-factory deployments; it found no critical or major issues among its listed findings. It covers EthFoxVault, not Definica's changes to it.

## Upgrades

| Contract | Who can upgrade | Constraint |
|---|---|---|
| DefinicaCore | Admin and upgrade authoriser, two distinct roles | One pre-authorised implementation at a time, consumed on upgrade |
| EthPooledStakingVault | Its own admin | Only to StakeWise-DAO-registered implementations of the same type, one version at a time |
| StakeWise Keeper, registry, osETH | StakeWise DAO | The Keeper is immutable; the DAO cannot change or upgrade a Vault's contracts unilaterally |
| Aave V3 Pool and reserves | Aave governance | Parameters and upgrades by governance vote |

An upgrade can change behaviour. The protections are the role separation, the registry constraint and the accounts that hold each role, all readable onchain. See [Controls and upgrades](/phase-1/controls-and-upgrades) and [Control model](/security/control-model).

## Inherited powers

From the EthFoxVault lineage, a [blocklist manager](/glossary#blocklist) can block addresses from depositing and can call `ejectUser`, which forces a user's shares into the exit queue. The account holding that role is readable on the Vault with `blocklistManager()`.

Core's [reentrancy guard](/glossary#transient-storage-reentrancy-guard) uses EIP-1153 transient storage, available on Ethereum since the Cancun upgrade.

## Third-party contracts

Downtime, exploits, governance decisions, upgrades, forks and oracle errors at a third party can affect Definica and your position. A flaw or a governance decision at StakeWise or Aave reaches a Definica position through the Vault, osETH, the Aave reserve or the funding loan without any action by Definica.

## Keys and governance

Administrative keys carry their own risks: governance capture, a malicious governance action, compromise of a multisig or an admin key, and emergency actions that are unavailable or come too late. Definica's treasury actions are executed by a [multisig](/glossary#multisig), and the holder of every role on Core and the Vault is readable onchain; see [Control model](/security/control-model).

## What you can verify

- Verified source code on a block explorer for Core, the Vault and their implementations, matching the release's source revision and compiler settings.
- The ERC-1967 implementation and admin slots of each proxy, and `VaultsRegistry.vaults(vault)` for the Vault.
- The audit reports, on request: scope, commit, findings and remediation, matched against the deployed code.
- The role holders: Core admin, upgrade authoriser, donator, Vault admin, blocklist manager and fee recipient; the multisig's signers, threshold and any timelock.
- The address you are interacting with, against [Verify addresses](/security/verify-addresses), never against a social post or screenshot.

## Related

- [Audits](/security/audits)
- [Control model](/security/control-model)
- [Release evidence](/security/release-evidence)
