---
title: 'Liquidity Module and Borrow'
description: 'Where Liquidity and Borrow sit in the app, and how the Liquidity Module screen for committing aEthosETH and the Borrow screen for the borrowing markets work.'
sidebar_position: 7
---

# Liquidity Module and Borrow

In the app, **Liquidity** and **Borrow** sit in the sidebar under **Next** with a **Coming soon** label, and each opens a short page on what it does, with a link to this page.

Two screens cover committed liquidity and borrowing. The Liquidity Module screen takes osETH through Aave V3 into a committed aEthosETH position, with optional financing. The Borrow screen lists the borrowing markets, each with its collateral and parameters, beside your borrow position.

## The Liquidity Module screen \{#liquidity-module\}

The screen, headed **Main Liquidity Module**, is the layer for locking Aave-supplied osETH, held as [aEthosETH](/glossary#aethoseth).

### The committed-liquidity path

The path runs in three steps:

1. **Supply osETH to Aave V3 Ethereum.** The supplied position is represented by aEthosETH, the [aToken](/glossary#atoken) of the osETH reserve.
2. **Lock the aEthosETH position.** The [Main Liquidity Module](/glossary#main-liquidity-module) records custody and keeps the [commitment](/glossary#commitment) for a fixed duration.
3. **Optionally fund lending markets.** With your authorisation, an eligible position supports a [funding loan](/glossary#funding-loan) of WETH or another permitted asset, which supplies Definica's lending markets.

You enter with osETH you already hold or a compatible aEthosETH receipt, or with osETH minted against ETH staked in a separate StakeWise factory Vault: see [Entry A and Entry B](/glossary#entry-a-and-entry-b). Vault shares from the Stake screen are not a way in, because the staking Vault does not mint osETH.

### Lock aEthosETH

The lock form takes the osETH to supply and lock, or aEthosETH you already hold, and a fixed duration. Before you confirm, the review shows:

- whether the osETH reserve at Aave is active, frozen or paused, its supply-cap headroom and the current supply rate;
- the Module's rules for the commitment: duration, lock, allocation, capacity and withdrawal rules;
- the budget, duration, eligibility and allocation rules of any [lock-incentive](/glossary#lock-incentives) programme that applies.

These values are set by the Module and by Aave, and shown in the app before you confirm.

### Financing

Financing is opt-in: a commitment alone creates no debt. When you authorise a funding loan, the review shows the asset borrowed, the [eMode](/glossary#emode) category, the [LTV](/glossary#ltv) and [liquidation threshold](/glossary#liquidation-threshold), the current borrow rate, the [caps](/glossary#caps), the debt allocated to you and your [health factor](/glossary#health-factor) after the borrow. Whether a loan is available depends on the Aave market, eMode, liquidity and caps at that moment.

### What the screen tracks

The screen lists what the Module records for you: your commitments, the debt allocated to you, income and withdrawal conditions. Debts are listed apart from returns, and each part of the return is reported on its own line: osETH exposure, Aave supply interest, allocated debt and its cost, lending income and incentives.

aEthosETH does not create a second ETH deposit or duplicate the osETH staking return, and locking it does not make it collateral.

:::warning[Debts stay separate]
Minting osETH against stake leaves an osETH liability at the originating Vault, and a funding loan at Aave adds another. Neither holding the aEthosETH receipt nor locking it extinguishes those debts, and the end of a commitment does not guarantee cash. See [Separate obligations](/phase-2/separate-obligations).
:::

### Leaving a position

A financed position unwinds in order:

1. Release the commitment under the Module's rules.
2. Repay the debt allocated to you.
3. Withdraw aEthosETH to osETH at Aave, as far as the reserve's unborrowed osETH and your health factor allow.
4. Keep the osETH, or convert it to ETH through StakeWise's [redemption queue](/glossary#oseth-redemption) or a market.

If you minted osETH against staked ETH (Entry B), you also burn osETH, including accrued fees, at the minting Vault before you exit the stake. See [Closing a financed position](/phase-3/closing-a-financed-position).

## The Borrow screen \{#borrow\}

The screen, headed **Borrowing markets**, is where you borrow supported assets against approved ETH or ETH-correlated collateral, under each market's collateral, interest and liquidation rules.

### Markets

The markets card lists each market, named after its asset. osETH is the primary collateral asset. A market can also accept aEthosETH from the Main Liquidity Module, with its own oracle, LTV, liquidity, lock, redemption and liquidation rules. The card's **Parameters** view sets out each collateral market's parameters side by side.

| Parameter | What it sets |
|---|---|
| Borrow asset | The asset you borrow and repay |
| Max LTV | The most you can borrow against the collateral's value |
| Liquidation threshold | The loan-to-value at which a position can be liquidated |
| Oracle | The price source that values collateral and debt |
| Interest rate model | How the borrow rate follows [utilisation](/glossary#utilisation) |
| Market caps | The limits on total supply and borrowing |
| Liquidation process | Who may liquidate, how much, and the liquidator's compensation |
| Emergency controls | The controls that can pause or cap the market, and who holds them |

The values are set per market and shown in the app before you confirm. See [Market parameters](/phase-3/market-parameters).

### Your borrow position

The **Your borrow position** card shows your collateral and its value, your debt, what you can still borrow, the liquidation price and your health, with a bar that runs from red, near liquidation, to green. From here you supply collateral, borrow, repay and withdraw collateral. Before each action, the review shows your health factor and borrowing power before and after, the maximum LTV, the liquidation threshold and the oracle, and, for a borrow or a repayment, the borrow rate and the liquidation penalty.

### What applies to every market

The screen's **What applies to every market** card lists four rules:

- **Debt and interest.** Borrowers pay variable interest, and the debt with its accrued interest must be repaid to release the collateral.
- **Oracle dependency.** An oracle prices the collateral and the borrow asset; its correctness is a dependency of every market.
- **Liquidation.** If the collateral's value falls, the debt grows or the position crosses its threshold, some or all of the collateral can be sold.
- **Correlation isn't safety.** ETH-correlated collateral still carries validator, fee, price, liquidity, redemption and contract risks.

### Where lending liquidity comes from

Market liquidity comes from funding loans through the Liquidity Module and from [direct ETH supply](/glossary#direct-eth-supply): your own ETH, with no Aave funding debt, supplied through the screen's **Lend ETH** card. Of the [attributable lending interest](/glossary#attributable-lending-interest), 75% is allocated to the participant and 25% to Definica, before financing costs. A financed participant's net result is `0.75 × I_u − funding costs − other costs`, which can be negative. See [Economics](/phase-3/economics).

## When Aave refuses an action

Supply, financing and withdrawals in the Liquidity Module run through Aave V3, and Aave's own checks can stop a transaction. The app then shows the reason.

| Aave check | When it stops an action |
|---|---|
| Supply cap | Supplying osETH would take the reserve past its cap (`SupplyCapExceeded`) |
| Borrow cap | The funding loan would take the borrowed asset past its cap (`BorrowCapExceeded`) |
| eMode category | The asset cannot be borrowed in the selected category (`NotBorrowableInEMode`) |
| Health factor | A borrow or withdrawal would take the health factor below 1 (`HealthFactorLowerThanLiquidationThreshold`) |
| Unborrowed liquidity | A withdrawal can take only as much osETH as the reserve has unborrowed; withdraw less or wait |

## Related

- [Main Liquidity Module](/phase-2)
- [Borrowing markets](/phase-3)
- [Separate obligations](/phase-2/separate-obligations)
- [Borrowing risk](/risks/borrowing)
