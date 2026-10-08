---
title: 'Audits'
description: 'DefinicaCore and EthPooledStakingVault have been reviewed in two private audits; how to request a report and how to read one.'
sidebar_position: 1
---

# Audits

DefinicaCore and EthPooledStakingVault have been reviewed in two private audits, and the reports are provided on request through a formal channel. This page explains how to request a report, how to read one, and what StakeWise's own review of EthFoxVault does and does not cover.

## Definica's audits

Two private audits cover Definica's own contracts:

| Contract | What it is |
|---|---|
| [DefinicaCore](/glossary#definica-core) | The user ledger: it accepts your ETH, forwards it to the Vault and records your share of the Vault shares it holds |
| [EthPooledStakingVault](/glossary#eth-pooled-staking-vault) | The dedicated StakeWise Vault, based on EthFoxVault, that stakes the pooled ETH |

To request a report, write to security@definica.com.

:::info[No audit is a guarantee]
No audit, review or monitoring system guarantees that a contract is secure. An audit examines one version of the code at one point in time, so read each report against the code that is deployed.
:::

## StakeWise's review of EthFoxVault

Definica's Vault is based on StakeWise's [EthFoxVault](/glossary#ethfoxvault), which Consensys Diligence reviewed for StakeWise over about a month. StakeWise's `v3-core` repository publishes that report alongside StakeWise's other audit reports, from Halborn, Sigma Prime, Consensys Diligence, ABDK and Statemind. In summary, the EthFoxVault review:

- Found no critical or major issues among its listed findings.
- Raised medium-severity points that were acknowledged or fixed: the registry owner can register Vaults that bypass factories; a theoretical overflow in reward-update arithmetic (acknowledged, given the immutable Keeper and its 12-hour reward delay); an inconsistency between the whitelist and blocklist interfaces; a user able to block ejection by reverting on ETH transfer while the Vault is not collateralised (avoided by collateralising the Vault); and front-running of initialisation in non-factory deployments (fixed).
- Raised minor points, including a missing `UserEjected` event (fixed) and a non-transferable Vault admin (acknowledged; the current interface has `setAdmin`).

That review covers EthFoxVault as StakeWise wrote it. It does not cover Definica's changes in EthPooledStakingVault, DefinicaCore, or the way the two work together, and it is no substitute for the reports on Definica's own contracts.

## How to read a report

A report is useful only when you can tie it to the code you are about to use. Each report covers:

| Part of the report | What to look for |
|---|---|
| Scope | Which contracts and files were reviewed, and which were left out |
| Commit | The exact source revision reviewed |
| Compiler settings | Compiler version, optimiser runs and EVM version, so the bytecode can be reproduced |
| Findings and severity | Each issue, how serious it is and where it sits in the code |
| Fixes and retesting | How each finding was resolved (fixed, mitigated or acknowledged) and the commit in which the fix was retested |
| Diff against the deployed implementation | Any change between the audited commit and the implementation the proxy points to, which falls outside the audit |

For the Vault, also compare the audited code with EthFoxVault: that diff shows exactly what Definica changed.

## Reporting a vulnerability

Send security reports to security@definica.com. Contact the same address before any testing that could affect users, assets, availability or confidential information. The official channels are listed on [Source of truth](/security/source-of-truth).

## What you can verify

- That a report's scope and commit match the verified source of the deployed implementations.
- That the auditor named in a report confirms it through the auditor's own channel.
- How every finding was resolved, checked against the deployed code.

## Related

- [Smart contract and upgrade risk](/risks/smart-contract-and-upgrade)
- [Release evidence](/security/release-evidence)
- [Verify addresses](/security/verify-addresses)
