---
title: 'Borrowing risk'
description: 'Any borrow creates debt that grows with variable interest, relies on an oracle and can be liquidated, and lenders carry bad-debt risk.'
sidebar_position: 5
---

# Borrowing risk

Any borrow in Definica creates a debt that grows with variable interest, is valued by an oracle and can be liquidated. That applies to the optional Phase 2 [funding loan](/glossary#funding-loan) at Aave and to Phase 3 loans against approved collateral. Lenders bear the other side: a borrower who is not liquidated in time leaves bad debt.

Borrowing can also involve fees, loan-to-value limits, collateral caps and changes to your health factor that you did not cause.

## If you take a funding loan

| Risk | Mechanism |
|---|---|
| Debt grows | Variable interest accrues continuously on the [variable debt token](/glossary#variable-debt-token), at a rate that rises with the WETH reserve's utilisation |
| Health factor falls | Collateral value falls, debt rises, or governance changes thresholds |
| Liquidation | Below a health factor of 1, up to 50% of the debt per call (100% at a health factor of 0.95 or below, or for small positions); the liquidator receives collateral at a discount |
| Cost exceeds return | Lending losses and funding costs can outweigh returns; Definica's 25% share is taken on gross interest first |
| Blocked actions | Borrow caps can stop new borrowing; eMode rules restrict what can be borrowed |
| Separate obligations persist | Repaying Aave does not clear an osETH minting liability, and neither does a liquidation |

Any liquidation fee is separate from debt repayment and from the liquidator's compensation. See [Liquidation](/phase-3/liquidation).

## If you borrow in a Phase 3 market

The same mechanics apply under each market's parameters: maximum LTV, liquidation threshold, oracle, interest-rate model, caps, liquidation process and emergency controls, set per market and shown in the app before you confirm. If the collateral value falls, the debt grows, or the position otherwise crosses its liquidation threshold, some or all of the collateral can be sold through liquidation. Borrowing instead of selling does not guarantee that you keep the collateral.

## If you lend in a Phase 3 market

As a liquidity participant you carry interest, liquidation, bad-debt, collateral, utilisation and market-insolvency risk. In plain terms:

- **Bad debt.** If a borrower's collateral is sold too late or too cheaply to cover the debt, the shortfall falls on lenders.
- **Utilisation.** If most of the liquidity is lent out, withdrawals wait until borrowers repay or new liquidity arrives.
- **Market insolvency.** A market-wide event can leave more debt than collateral.
- **Funding cost.** If you supplied through a funding loan, you still owe Aave whatever the market returns. [Direct ETH supply](/glossary#direct-eth-supply) carries no Aave funding debt, but the same market risks.

## A worked example

With invented numbers, taken from [Economics](/phase-3/economics): your attributable lending interest is 1.00 ETH, so 0.75 ETH is allocated to you after Definica's 25% share.

```text
allocated interest (0.75 × 1.00)    0.75 ETH
funding cost                        0.90 ETH
other costs                         0.05 ETH
net = 0.75 − 0.90 − 0.05          = −0.20 ETH
```

The market worked, and the lender still lost money.

## What you can verify

- On Aave: `getUserAccountData` (health factor, LTV, liquidation threshold, available borrows), `getEModeCategoryData` (what the category lets you borrow) and `getReserveData(WETH)` (borrow rate, cap, utilisation).
- Your allocated debt and its accrued cost, as the Module records them and the app shows them.
- Each Phase 3 market's parameters in the app, and that they match the deployed contracts.
- Whether an emergency pause or cap is in force.

## Related

- [Funding loan](/phase-2/funding-loan)
- [Separate obligations](/phase-2/separate-obligations)
- [Economics](/phase-3/economics)
- [Liquidation](/phase-3/liquidation)
