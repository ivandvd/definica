---
title: 'Release evidence'
description: 'The evidence each Definica contract release is documented and reviewed against: identity, audits, accounting and market controls.'
sidebar_position: 3
---

# Release evidence

Each Definica contract release is documented and reviewed against the same evidence, in four areas: release identity, audit and remediation, accounting and operations, and market controls. This page lists each piece of evidence and what it shows.

## Release identity

| Evidence | What it shows |
|---|---|
| Source revision of each implementation | The exact commit the deployed code is built from |
| Compiler version and settings | That the source reproduces the onchain bytecode |
| EthFoxVault diff | Every change between StakeWise's EthFoxVault and EthPooledStakingVault, with its reason |
| Configured Vault and Keeper | That Core points at Definica's Vault and at StakeWise's Keeper |
| Proxy and implementation addresses | Exactly which contracts you interact with, for Core and the Vault |

## Audit and remediation

| Evidence | What it shows |
|---|---|
| Audit reports | The two private audits of DefinicaCore and EthPooledStakingVault, provided on request |
| Scope and commit of each report | Which contracts and which source revision were reviewed |
| Findings, fixes and retesting | How each issue was resolved, matched to the deployed commit |
| Combined-system coverage | That the review covers Core, the Vault and their integration, without relying on the EthFoxVault review |

## Accounting and operations

| Evidence | What it shows |
|---|---|
| Donation recognition | How ETH donations are recognised: at the next successful harvest |
| Rounding | How amounts round at deposit, exit and conversion |
| Fees | The Vault fee percentage and recipient, and any Definica fee |
| Harvests | The harvest cadence, and what happens to deposits and exits while a harvest is pending |
| Partial exits | How partial exits and managed partial claims are handled, and the claim delay |
| Core and Vault reconciliation | That Core's ledger matches the Vault shares Core holds |
| Oracle treatment of assets | How Oracle-reported assets enter Core's accounting |

## Market controls

These cover the Main Liquidity Module and the Phase 3 markets.

| Evidence | What it shows |
|---|---|
| Collateral and borrow assets | Which assets each market accepts as collateral and lends |
| Oracles | How each asset is priced, and how stale prices are handled |
| Caps | The limits on supply and borrowing |
| Health monitoring | How positions are watched against their liquidation thresholds |
| Liquidation process | Who may liquidate and how much per call, liquidator compensation and any liquidation fee |
| Liquidity management | How withdrawals are served, and under what conditions |
| Debt attribution | The debt allocated to each participant, and its cost |

Reading the source yourself is useful, but it is not a security audit, and no single piece of evidence guarantees that a contract is secure.

## Related

- [Audits](/security/audits)
- [Control model](/security/control-model)
- [Verify addresses](/security/verify-addresses)
