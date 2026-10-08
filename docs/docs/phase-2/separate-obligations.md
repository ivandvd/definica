---
title: 'Separate obligations'
description: 'The debts a Phase 2 or Phase 3 position can carry, why no receipt or lock cancels them, and what each one requires at exit.'
sidebar_position: 5
---

# Separate obligations

A financed position can carry up to three distinct debts, each owed to a different party and settled in a different place. Minting osETH against stake leaves an osETH liability at the originating Vault, borrowing at Aave adds another obligation, and a Phase 3 borrower owes the loan taken against approved collateral. Neither receipt ownership nor a lock extinguishes any of them.

## The obligations

| Obligation | Owed at | Grows with | Settled by |
|---|---|---|---|
| osETH minting liability (Entry B only) | The StakeWise Vault that minted the osETH | StakeWise's 5% fee on osToken rewards | Burning enough osETH, fees included, at that Vault and covering any shortfall |
| Funding loan | Aave V3 Ethereum; the Module records your share as allocated debt | Variable borrow interest | Repaying the asset owed: attributable principal plus accrued interest |
| Phase 3 loan (borrower side) | The Phase 3 market | Interest under the market's rate model | Repaying, or losing collateral to liquidation |

The app lists every obligation on a position separately from its returns.

## Why a receipt does not cancel a debt

aEthosETH is a receipt for osETH supplied to Aave. It proves the supply; it does not repay the osETH that was minted, and it does not repay anything borrowed against it. A commitment to the Module fixes how long the receipt stays committed; it settles nothing.

## What this means at exit

The order of settlement follows from the obligations:

1. Repay the funding loan first. The aEthosETH cannot be withdrawn while it backs an open borrow that the withdrawal would leave with a health factor below 1.
2. Withdraw the aEthosETH to osETH, subject to Aave liquidity.
3. Burn osETH at the minting Vault, if there is a minting liability.
4. Exit the stake.

See [Closing a financed position](/phase-3/closing-a-financed-position) for each step.

:::warning[Lock expiry is not cash]
Lock expiry does not guarantee cash. A commitment that reaches maturity is released from the Module's rules, but that creates no liquidity at Aave, at StakeWise or in the market, so the steps above still apply.
:::

## Liquidation is also separate

If an Aave position's health factor falls below 1, liquidators repay part or all of the debt and take collateral plus a bonus. Any liquidation fee is separate from debt repayment and liquidator compensation. A liquidation reduces the position; it does not necessarily clear the debt, and it leaves any osETH minting liability untouched. See [Liquidation](/phase-3/liquidation).

## What you see in the app

Every financed position has an obligations box that lists each debt, its current amount, how it accrues interest and where it is settled, with the reminder that neither receipt ownership nor a lock extinguishes those debts. Returns are listed in a separate box. See [Liquidity and borrowing in the app](/app/liquidity-and-borrowing).

## Related

- [The committed-liquidity path](/phase-2/committed-liquidity-path)
- [Funding loan](/phase-2/funding-loan)
- [Liquidation](/phase-3/liquidation)
