---
title: 'Collateral and borrow assets'
description: 'What you can post as collateral in a Phase 3 market, the two paths for aEthosETH, where lending liquidity comes from and what you borrow.'
sidebar_position: 2
---

# Collateral and borrow assets

Each Phase 3 market accepts approved ETH or ETH-correlated collateral and lends a supported asset. osETH is the primary collateral asset, and each market lists its approved collateral and its supported borrow asset in the app. The liquidity you borrow comes from Phase 2 funding loans and from direct ETH supply.

## Collateral

| Asset | Role |
|---|---|
| osETH | The primary collateral asset |
| aEthosETH, Path A | Collateral in a market that approves it explicitly, under that market's own oracle, LTV, liquidity, lock, redemption and liquidation rules |
| aEthosETH, Path B | Not collateral: committed in the Main Liquidity Module, where its funding loan supplies the market |
| Other ETH-correlated assets | Collateral in any market that approves them |

Approved means approved for a specific market under that market's rules. Nothing is collateral by default: a market enables each collateral asset explicitly, and committing aEthosETH to the Module does not make it collateral.

## The two aEthosETH paths

Path A and Path B are alternatives for the same receipt:

- **Path A, collateral.** A market may approve aEthosETH as collateral. It then applies its own oracle, LTV, liquidity, lock, redemption and liquidation rules, and you borrow against the aEthosETH you post.
- **Path B, liquidity.** You commit aEthosETH in the Main Liquidity Module, and the funding loan taken against it supplies the market. You are then a liquidity participant, not a borrower.

A single aEthosETH position does not serve both paths at once unless the market's rules provide for it.

## Lending liquidity

| Source | What it is | Funding debt |
|---|---|---|
| Phase 2 funding loans | The asset borrowed at Aave against committed aEthosETH becomes liquidity for borrowers in the market. | Yes, at Aave |
| [Direct ETH supply](/glossary#direct-eth-supply) | Your own ETH enters the market without Aave funding debt. You exit through Phase 3 withdrawals. | None |

## The borrow asset

Each market lends a supported asset, listed with the market in the app. Liquidity from funding loans arrives as the asset borrowed at Aave: WETH or another permitted asset.

## Oracles

Each market prices its collateral and its borrow asset through an oracle, listed with the market's parameters. For comparison, Aave prices its osETH reserve through a correlated-asset adapter that combines StakeWise's exchange rate with an ETH/USD feed. See [Oracle risk](/risks/oracle).

## What you see in the app

The Borrow screen lists each market with its approved collateral, its supported borrow asset and its parameters: oracle, maximum LTV, liquidation threshold, interest-rate model, caps and emergency controls. See [Liquidity and borrowing in the app](/app/liquidity-and-borrowing).

## Related

- [Market parameters](/phase-3/market-parameters)
- [osETH](/concepts/oseth)
- [aEthosETH](/concepts/aethoseth)
- [Correlation is not safety](/risks/correlation-is-not-safety)
