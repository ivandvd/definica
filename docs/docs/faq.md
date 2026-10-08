---
title: 'FAQ'
description: 'Short answers to the questions people ask about Definica, grouped by theme, each linking to the page with the detail.'
sidebar_position: 10
---

# FAQ

Short answers to common questions, grouped by theme. Each answer links to the page with the detail.

## About Definica

### What is Definica?

An Ethereum protocol that connects pooled ETH staking (Phase 1), committed osETH and aEthosETH liquidity through the Main Liquidity Module (Phase 2) and borrowing markets for approved ETH-correlated collateral (Phase 3). Each module runs on its own contracts. See the [Introduction](/).

### Which network does Definica use?

Ethereum. The Vault uses StakeWise's mainnet infrastructure and the Main Liquidity Module uses Aave V3 Ethereum. The app shows the network on every transaction review. See [Verify addresses](/security/verify-addresses).

### Why StakeWise?

StakeWise Vaults give Definica what it needs: independent Vault administration, proportional accounting and the adoption of approved upgrades. They are isolated pools with shares-based accounting and permissionless Vault creation. See [EthPooledStakingVault](/concepts/eth-pooled-staking-vault).

### Is Definica non-custodial?

Your ETH sits in a StakeWise Vault governed by smart contracts, not with a company. Non-custodial does not mean that no administrative or operational permissions exist: the contracts are upgradeable through distinct roles, and those roles are described openly. See [Controls and upgrades](/phase-1/controls-and-upgrades).

## Staking (Phase 1)

### Do I need 32 ETH or my own validator?

No. Deposits are pooled in a dedicated StakeWise Vault and the Vault's operator runs the validators. You do not own a specific validator. See [Phase 1](/phase-1).

### What do I actually hold?

A proportional position recorded by DefinicaCore, backed by Vault shares that Core holds in aggregate. Shares are accounting units, not one-to-one ETH. See [Vault shares](/concepts/vault-shares).

### How do rewards reach me?

StakeWise's Oracles report validator rewards and penalties every 12 hours, and the Vault applies them at its next harvest. The value of each share changes and your position's value follows; nothing is paid out separately. See [Positions and rewards](/phase-1/positions-and-rewards).

### Is there a guaranteed APY?

No. Rewards depend on validator performance, and treasury contributions to the Vault are discretionary, budget-dependent and never a guaranteed APY. Any rate the app shows is informational. See [Treasury policy](/phase-1/treasury-policy).

### What fees apply?

A Vault fee on rewards, set by the Vault admin within StakeWise's limits and paid as new shares to the fee recipient, plus network gas. In Phase 2 and Phase 3, Aave and market interest apply as well. Every fee that applies is shown in the app before you confirm. See [Fees](/phase-1/fees).

### Does the Phase 1 Vault mint osETH?

No. It is based on EthFoxVault and does not mint osETH. osETH comes from a separate StakeWise Vault that supports minting. See [osETH](/concepts/oseth).

## Withdrawals

### How do withdrawals work?

You request an exit and your shares enter the Vault's exit queue. The Vault serves the queue from available ETH or by exiting validators. Once your request is processed and the Vault's claim delay has passed, you claim the ETH in a separate transaction. See [Exits and withdrawals](/phase-1/exits-and-withdrawals).

### How long does a withdrawal take?

It depends on the network. Ethereum limits validator exits per epoch, adds a 256-epoch withdrawability delay and pays withdrawals through a sweep, so a withdrawal can take from hours to weeks. Times shown in the app are estimates. See [Exit queue](/concepts/exit-queue).

### Can I withdraw part of an exit?

Yes. A managed partial claim pays what is claimable and keeps the remaining exit position for later settlement, with a new ticket for the remainder. See [Exits and withdrawals](/phase-1/exits-and-withdrawals).

## Share locks

### Can I lock my Vault shares?

Yes. Share locks run from 7 to 365 days, with up to 10 lock positions at a time, and locked shares stay in reward accounting. These Core locks are separate from Phase 2 aEthosETH commitments. See [Share locks](/phase-1/share-locks).

### What do I get for locking?

Locked shares earn exactly what unlocked shares earn. Where a lock-incentive programme runs, it is funded separately and shows its budget, duration, eligibility and allocation rules in the app. A lock-duration multiplier, where one applies, changes incentive-allocation weight only, never validator rewards or market interest. See [Share locks](/concepts/share-locks).

### Can I unlock early?

Do not count on it. Early unlocking may be impossible, even in adverse market, validator, protocol or security conditions. Choose a duration you can hold. See [Share locks](/phase-1/share-locks).

## Treasury

### What does the treasury do to my shares?

Definica's multisig can donate ETH to the Vault, which raises assets per share by `D / S` at the next successful harvest, or burn its own shares, which raises the value of every other share by `B / (S − B)`. It never touches user balances, and neither route is a guaranteed return. See [Treasury policy](/phase-1/treasury-policy).

## osETH and aEthosETH

### What are osETH and aEthosETH?

osETH is StakeWise's repricing liquid staking token. aEthosETH is the Aave V3 Ethereum aToken for the osETH reserve (Aave Ethereum osETH), representing osETH supplied to that market. See [osETH](/concepts/oseth) and [aEthosETH](/concepts/aethoseth).

### Does aEthosETH double my staking rewards?

No. aEthosETH does not create a second ETH deposit or duplicate the osETH staking return. It adds Aave supply interest, which is reported separately. See [aEthosETH](/concepts/aethoseth).

## Phase 2: the Main Liquidity Module

### What is the Main Liquidity Module?

The Phase 2 layer that records committed aEthosETH positions, any allocated Aave debt, income and withdrawal conditions. With your authorisation, it can borrow WETH or another permitted asset against the position to supply Definica's lending markets. See [Main Liquidity Module](/concepts/main-liquidity-module).

### Does committing aEthosETH make it collateral?

No. Locking aEthosETH does not make it collateral on its own; collateral status has to be enabled explicitly by the relevant market. See [Phase 2](/phase-2).

### Who takes the Aave loan and who owes it?

The Module takes the funding loan at Aave only with your authorisation, records custody and allocates the debt to participants. Your allocated debt and its cost appear on your position in the app. See [Funding loan](/phase-2/funding-loan).

### How do I close a financed position?

Repay Aave with the asset owed, withdraw aEthosETH to osETH (subject to Aave liquidity and collateral constraints), burn osETH including fees at the minting Vault if you minted, then exit the stake through the Vault's exit process. Lock expiry does not by itself turn a position into cash. See [Closing a financed position](/phase-3/closing-a-financed-position).

## Phase 3: borrowing markets

### How is lending interest split?

Of the lending interest attributable to you, 75% is allocated to you and 25% to Definica, before financing costs. Your net result is `0.75 × I_u − funding costs − other costs`, which can be negative. See [Economics](/phase-3/economics).

### What can I borrow against?

Approved ETH or ETH-correlated collateral, with osETH as the primary collateral asset. Each market sets its borrow asset, oracle, maximum LTV, liquidation threshold, rate model, caps, liquidation process and emergency controls, and the app shows them before you confirm. See [Market parameters](/phase-3/market-parameters).

### What happens if my collateral falls?

If your position crosses its liquidation threshold, some or all of the collateral can be sold to repay the debt, and liquidators receive a bonus. Any liquidation fee is separate from debt repayment and liquidator compensation. See [Liquidation](/phase-3/liquidation).

### Does ETH correlation protect me?

No. Correlation with ETH does not remove price, liquidity, oracle, redemption or contract risk. See [Correlation is not safety](/risks/correlation-is-not-safety).

## Security and control

### Has Definica been audited?

DefinicaCore and EthPooledStakingVault have been reviewed in two private audits, and reports are provided on request through security@definica.com. StakeWise's upstream EthFoxVault review covers EthFoxVault, not Definica's changes. No audit guarantees that a contract is secure. See [Audits](/security/audits).

### Who controls upgrades?

DefinicaCore has a distinct admin and upgrade authoriser, with one pre-authorised implementation at a time. The Vault has its own admin and can only move to StakeWise-DAO-registered implementations, one version at a time. Every role holder is readable onchain. See [Control model](/security/control-model).

### Where do I verify addresses and ask questions?

Definica's contract addresses are listed in the app, with Phase 1's on the Contracts card of the Stake screen; check them on a block explorer and in your wallet before you sign. For questions, write to contact@definica.com, or security@definica.com for security matters. The official accounts are [t.me/definica](https://t.me/definica) and [x.com/definicacom](https://x.com/definicacom). See [Verify addresses](/security/verify-addresses).
