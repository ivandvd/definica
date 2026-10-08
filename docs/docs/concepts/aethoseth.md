---
title: 'aEthosETH'
description: 'aEthosETH is the Aave V3 aToken for supplied osETH: it earns Aave supply interest and is the position you commit in Phase 2.'
sidebar_position: 3
---

# aEthosETH

[aEthosETH](/glossary#aethoseth) is the Aave V3 Ethereum [aToken](/glossary#atoken) for the osETH reserve, officially named Aave Ethereum osETH. When you supply [osETH](/glossary#oseth) to that market, your supply position is represented by aEthosETH, whose balance grows with Aave's variable supply interest. In Phase 2 it is the position you commit to the [Main Liquidity Module](/glossary#main-liquidity-module).

## What an aToken is

Aave's aTokens are interest-bearing ERC-20 tokens minted when you supply an asset to an Aave V3 market; their balance increases over time from borrowing activity in the pool. The supply rate depends on the reserve's borrow rate, its [utilisation](/glossary#utilisation) and the [reserve factor](/glossary#reserve-factor) that goes to the Aave treasury.

## What aEthosETH is not

- It is not a StakeWise token.
- It is not a second ETH deposit, and it creates no second source of validator rewards.
- It does not duplicate the osETH staking return.

Holding aEthosETH gives you two distinct things, reported separately and never counted twice: exposure to osETH's exchange rate, which is staking performance, and Aave's variable supply interest.

## Supplying osETH

Supplying calls Aave's `Pool.supply(asset, amount, onBehalfOf, referralCode)`. It reverts if the osETH reserve is inactive, frozen or paused, or if it would exceed the reserve's [supply cap](/glossary#caps) (`SupplyCapExceeded`). Aave governance sets supply caps and changes them over time, so the current cap is read from the Pool and shown in the app before you confirm.

## Withdrawing to osETH

Withdrawing redeems aTokens for the underlying osETH, including accrued interest, subject to two Aave constraints:

| Constraint | What it means | Aave error |
|---|---|---|
| Reserve liquidity | Aave must hold enough unborrowed osETH to pay you. | `NotEnoughAvailableUserBalance` |
| Collateral health | If the aEthosETH backs a borrow, the [health factor](/glossary#health-factor) must stay at or above 1 after the withdrawal. | `HealthFactorLowerThanLiquidationThreshold` |

See [Withdrawal constraints](/glossary#withdrawal-constraints) in the glossary.

## Supplying is not using as collateral

Supplying liquidity and using an asset as collateral are separate actions. Committing aEthosETH to the Module does not make it collateral; the relevant market must enable collateral use explicitly. In Aave, collateral use is a per-asset flag on your account, and in Definica any funding loan against the supplied position requires your explicit authorisation.

## Role in Definica

| Phase | Role |
|---|---|
| Phase 2 | The receipt you commit to the Main Liquidity Module, which records custody and debt. |
| Phase 3 | Where a market approves it, collateral under that market's own oracle, LTV, liquidity, lock, redemption and liquidation rules. |

## What you can verify

- The aEthosETH and osETH reserve addresses, from the BGD Labs Aave address book. These are Aave's contracts, not Definica's; see [Verify addresses](/security/verify-addresses).
- The reserve's state, supply cap and current supply rate, via `getReserveData` on the Aave Pool.

## Related

- [osETH](/concepts/oseth)
- [Aave V3 supply and aEthosETH](/phase-2/aave-supply-and-aethoseth)
- [Market and liquidity risk](/risks/market-and-liquidity)
