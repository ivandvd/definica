---
title: 'Correlation is not safety'
description: 'Every layer of Definica is ETH-correlated, and that removes none of the price, liquidation, interest or governance risk.'
sidebar_position: 6
---

# Correlation is not safety

Borrowing an ETH-denominated asset against ETH-correlated collateral feels safe because both sides move together. They do not move identically, debt grows on its own, oracles and markets can disagree, and the higher borrowing limits that correlated-asset modes grant make the remaining cushion thinner, not thicker. Correlation with ETH does not remove collateral-price or liquidation risk.

## Four ways a correlated position still fails

| Failure | What happens |
|---|---|
| The two sides diverge | osETH's exchange rate reflects staking performance, which can fall on penalties or slashing while WETH does not; osETH's market price can trade below its exchange rate; a collateral's oracle price can lag or lead |
| The debt grows | Variable interest accrues continuously, and fast at high utilisation. A position that was healthy at the start drifts toward the threshold without any price move |
| Parameters change | Aave governance sets LTVs, thresholds, caps and eMode membership; it has, for example, cut the Ethereum ETH-correlated category's borrowable assets to WETH only. A change can leave an existing position closer to liquidation or unable to add debt |
| Liquidity disappears | Correlated strategies crowd the same reserves; when ETH falls, utilisation rises, rates spike and exits queue at every layer at once |

## Why the cushion is thinner in correlated modes

Aave's [eMode](/glossary#emode) gives borrowers higher borrowing power when they use correlated assets. A higher maximum LTV with a liquidation threshold only slightly above it means that a position borrowed to the limit is only a small move from liquidation. StakeWise's documentation of its Boost product cites, for osETH collateral and ETH debt on Aave, a maximum LTV of 93% and a liquidation threshold of 95%. Aave governance can change both, so read the current values from the Pool; the shape is the point.

:::warning[Illustrative only]
Values chosen for the arithmetic; Aave governance sets and changes the real parameters.
:::

```text
10 ETH-worth of osETH collateral, 95% liquidation threshold

borrow 6 ETH-worth    → health factor = 9.5 / 6   = 1.58
borrow 9.3 ETH-worth  → health factor = 9.5 / 9.3 = 1.02   (the 93% LTV maximum)
```

At the maximum, a fall of about 2% in the collateral's valuation against the debt is enough to reach a health factor of 1. The correlation is what allowed the 93% in the first place; it does not protect the 2%.

## Correlation across Definica

Every layer of Definica is ETH-correlated: Phase 1 shares, osETH, aEthosETH, the funding loan, and the Phase 3 collateral and borrow asset. That keeps the ETH-denominated accounting coherent. It also means that one event, a sharp ETH move with crowded exits, can touch every layer in the same hour. Correlation with ETH does not remove these risks.

## What you can verify

- The gap between maximum LTV and liquidation threshold for the category and assets in use (`getEModeCategoryData`, `getReserveData`).
- Your health factor after the borrow you are about to make, before you sign.
- The osETH oracle price at Aave against the StakeWise exchange rate and against the market price.
- Recent Aave governance changes to the reserves and eMode categories you depend on.
- Each Phase 3 market's cushion (maximum LTV against liquidation threshold), shown in the app before you confirm.

## Related

- [Borrowing risk](/risks/borrowing)
- [Market and liquidity risk](/risks/market-and-liquidity)
- [Liquidation](/phase-3/liquidation)
