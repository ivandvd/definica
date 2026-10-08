---
title: 'Market parameters'
description: 'The parameters that define each Phase 3 borrowing market, what each one determines and how to read them together.'
sidebar_position: 3
---

# Market parameters

Each borrowing market is defined by a set of parameters. They are set per market and shown in the app: the Borrow screen lists every market by its collateral asset with its parameters, and the review step repeats the ones that apply to your transaction before you confirm.

## Assets and pricing

| Parameter | What it determines |
|---|---|
| **Supported borrow asset** | The asset borrowers receive and repay, and in which the debt and its interest are counted. |
| **Approved collateral assets** | The assets you can post as collateral in the market. osETH is the primary collateral asset; nothing is collateral unless the market approves it. See [Collateral and borrow assets](/phase-3/collateral-and-borrow-assets). |
| **Oracle** | How collateral and debt are valued: the price source, how a stale or failed price is handled, and how often the value updates. See [Oracle risk](/risks/oracle). |

## Risk limits

| Parameter | What it determines |
|---|---|
| **Maximum LTV** | The most you can borrow, as a percentage of your collateral's value. It limits new borrowing; it is not a target to borrow up to. See [LTV](/glossary#ltv). |
| **Liquidation threshold** | The loan-to-value at which a position becomes eligible for liquidation. The gap between maximum LTV and this threshold is your cushion. See [Liquidation threshold](/glossary#liquidation-threshold). |
| **Interest-rate model** | How the borrow rate responds to [utilisation](/glossary#utilisation), and how much of the interest reaches lenders. |
| **Market caps** | The limits on total supply and total borrowing in the market. A reached cap blocks new supply or new loans. |

## Operations

| Parameter | What it determines |
|---|---|
| **Liquidation process** | Who may liquidate a position, how much of the debt one liquidation can repay, the liquidator's compensation and any liquidation fee. See [Liquidation](/phase-3/liquidation). |
| **Health monitoring** | How positions are watched and how borrowers are warned as they approach the liquidation threshold. |
| **Liquidity management** | How lenders' withdrawals are served, and what happens when utilisation is high. |
| **Debt attribution** | How loans, interest and losses are attributed to the liquidity behind them, which sets each participant's [attributable lending interest](/glossary#attributable-lending-interest). |
| **Emergency controls** | Which controls exist (pause, caps, migration) and who can use them. See [Control model](/security/control-model). |

## Deployment

| Parameter | What it determines |
|---|---|
| **Deployed contracts and network** | The market's contract addresses and the network they run on, checkable onchain. See [Verify addresses](/security/verify-addresses). |
| **Activation conditions** | The conditions that must hold for the market to accept supply and new loans. |

## Reading a market's parameters

The parameters matter most in combination:

1. **The cushion.** Compare maximum LTV with the liquidation threshold. A small gap means a small price move, or a little accrued interest, can make a position liquidatable. See [Correlation is not safety](/risks/correlation-is-not-safety).
2. **The oracle.** Know which price the market uses. A position is liquidated on the oracle's price, which can differ from the price you see elsewhere.
3. **The rate model and the caps.** A market near its borrow cap or at high utilisation can see its borrow rate rise quickly, and lenders can find withdrawals delayed.
4. **The emergency powers.** Check who can pause or cap the market, and whether a delay applies before a change takes effect.
5. **The onchain values.** If the app, these docs and the deployed contracts ever differ, the contract state prevails. See [Source of truth](/security/source-of-truth).

## What parameters do not change

Parameters set the limits of a market. They do not change its basic risks:

- Borrowing creates debt, with variable interest, fees, LTV limits, collateral caps, oracle dependencies, health-factor changes and liquidation.
- Borrowing without selling does not guarantee that you keep the collateral.
- Correlation with ETH does not remove any of these risks.

## Related

- [Collateral and borrow assets](/phase-3/collateral-and-borrow-assets)
- [Liquidation](/phase-3/liquidation)
- [Borrowing risk](/risks/borrowing)
- [Liquidity Module and Borrow in the app](/app/liquidity-and-borrowing)
