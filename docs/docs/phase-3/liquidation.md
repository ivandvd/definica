---
title: 'Liquidation'
description: 'How liquidation works for a funding loan at Aave and for a Phase 3 loan, how the health factor is calculated, and what you can check.'
sidebar_position: 6
---

# Liquidation

[Liquidation](/glossary#liquidation) is the forced sale of collateral to repay debt when a position is no longer sufficiently collateralised. For the Phase 2 funding loan the rules are Aave's: when the [health factor](/glossary#health-factor) falls below 1, liquidators repay part or all of the debt and receive collateral plus a bonus. For a Phase 3 loan the rules are the market's, shown with its parameters in the app.

In both cases, if the collateral value falls, the debt grows or the position otherwise crosses its liquidation threshold, some or all of the collateral can be sold through liquidation.

## The health factor

Aave defines it as:

```text
Health factor = (total collateral value × weighted average liquidation threshold) / total borrow value
```

A position can be liquidated when its health factor is below 1. The [liquidation threshold](/glossary#liquidation-threshold) is set per asset (and per eMode category) by Aave governance. The gap between the maximum [LTV](/glossary#ltv) and the liquidation threshold is the cushion between the most you can borrow and the point of liquidation.

## How an Aave liquidation proceeds

| Element | Aave rule |
|---|---|
| Trigger | Health factor below 1 |
| How much per call | Up to 50% of the debt when the health factor is above 0.95 and both the collateral and the debt are worth at least $2,000; up to 100% when the health factor is 0.95 or below, or when either is worth less than $2,000 |
| Liquidator's compensation | The liquidation bonus, paid to liquidators as an incentive to buy undercollateralised assets |
| Protocol fee | Aave may take a share of the bonus as a liquidation protocol fee, set per reserve |
| Effect on the borrower | Collateral is sold at a discount; the debt is reduced by the amount repaid |

Any liquidation fee is separate from debt repayment and liquidator compensation. A liquidation does not necessarily clear the whole debt, and it never touches an osETH minting liability at StakeWise.

## An illustration

:::warning[Illustrative only]
The threshold below is chosen for the arithmetic. It is not an Aave or Definica value; Aave's current values are read from the Pool.
:::

A position holds 10 ETH-worth of osETH as collateral with a 75% liquidation threshold and owes 6 ETH-worth of WETH:

```text
health factor = (10 × 0.75) / 6 = 1.25
```

If the collateral's value fell by 20% to 8 ETH-worth, the health factor would be `(8 × 0.75) / 6 = 1.00`, at the edge of liquidation. In a correlated-asset eMode with a higher threshold the same debt would show a higher health factor, but the same category would also allow more debt; borrowing to the maximum leaves a thin cushion whatever the threshold. See [Correlation is not safety](/risks/correlation-is-not-safety).

## Why ETH-correlated collateral still gets liquidated

The collateral and the borrow asset can both be ETH-denominated and the position can still fail:

- the collateral's exchange rate or market price can fall relative to the debt asset;
- the debt grows with variable interest;
- the oracle can report a price different from the market;
- governance can change thresholds.

Correlation with ETH does not remove these risks.

## Liquidation in Phase 3

Each Phase 3 market sets its own oracle, liquidation threshold and liquidation process: who may liquidate, how much per call, the liquidator's compensation, and any liquidation fee and its recipient. It also sets how positions are monitored and its emergency controls. The app shows all of these with the market's parameters before you borrow; see [Market parameters](/phase-3/market-parameters).

Borrowing without selling does not guarantee that you keep the collateral: some or all of it can be sold.

## What you can verify

- Your health factor, LTV and liquidation threshold on Aave: `getUserAccountData` on the Pool.
- The eMode category's parameters: `getEModeCategoryData`.
- The oracle price Aave uses for osETH, against StakeWise's own exchange rate.
- A Phase 3 market's oracle, liquidation threshold and liquidation process, listed with the market in the app.

## Related

- [Funding loan](/phase-2/funding-loan)
- [Borrowing risk](/risks/borrowing)
- [Market parameters](/phase-3/market-parameters)
