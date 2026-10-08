---
title: 'Aave V3 supply and aEthosETH'
description: 'Supplying osETH to Aave V3 Ethereum, what the aEthosETH balance reflects, what can block supply or withdrawal, and how it is reported.'
sidebar_position: 3
---

# Aave V3 supply and aEthosETH

Supplying [osETH](/glossary#oseth) to Aave V3 Ethereum mints [aEthosETH](/glossary#aethoseth), the [aToken](/glossary#atoken) of the osETH reserve. Its balance grows with Aave's variable supply interest, which the Module reports separately from osETH staking performance. A supply can be blocked by the reserve's configuration or its supply cap, and a withdrawal depends on unborrowed liquidity and, if the position backs a borrow, on the health factor.

## Supplying

`Pool.supply(asset, amount, onBehalfOf, referralCode)` transfers osETH to the Pool and mints aEthosETH to the `onBehalfOf` address. Once the position is committed, the Module records its custody.

A supply reverts in two cases:

| Condition | Aave error |
|---|---|
| The reserve is inactive, frozen or paused | `ReserveInactive`, `ReserveFrozen`, `ReservePaused` |
| The [supply cap](/glossary#caps) is reached | `SupplyCapExceeded` |

Supply caps are set by Aave governance and its risk stewards, and the osETH cap has been changed more than once. StakeWise's own documentation notes that an exhausted osETH supply cap can block new positions. The app shows the current cap and its headroom before you supply.

## What the aEthosETH balance reflects

- Growth from Aave's variable supply rate: the reserve's borrow rate, multiplied by its [utilisation](/glossary#utilisation) and by one minus the [reserve factor](/glossary#reserve-factor).
- Nothing else. aEthosETH is not a StakeWise token, does not represent a second ETH deposit and does not create a second source of validator rewards.

The osETH staking return is already inside osETH's exchange rate. Holding aEthosETH therefore gives you two separately measurable components, the osETH rate and the Aave supply interest, and they are never counted as duplicated rewards.

## How Aave sets the rates

Aave's interest-rate strategy has two slopes around an optimal utilisation:

```text
U = totalDebt / (availableLiquidity + totalDebt)
if U is at or below U_opt:   borrowRate = base + slope1 × U / U_opt
if U is above U_opt:         borrowRate = base + slope1 + slope2 × (U − U_opt) / (1 − U_opt)
supplyRate = borrowRate × U × (1 − reserveFactor)
```

Above the optimal utilisation, rates rise faster. For you as a supplier, supply interest is variable and can change quickly; for a funding loan, so can the cost of the debt. The current strategy parameters for the osETH and WETH reserves are read from the Pool.

## Withdrawing to osETH

A withdrawal redeems aEthosETH for osETH, including accrued interest, subject to the reserve's unborrowed liquidity and to the collateralisation of any active borrow.

| Constraint | Aave error |
|---|---|
| Not enough unborrowed osETH in the reserve | `NotEnoughAvailableUserBalance` |
| The position backs a borrow and the health factor would fall below 1 | `HealthFactorLowerThanLiquidationThreshold` |

A committed position is first released from its commitment, and any allocated debt repaid, before its aEthosETH is withdrawn. See [Closing a financed position](/phase-3/closing-a-financed-position).

## Collateral is a separate switch

Supplying does not make aEthosETH collateral for a borrow: supplying liquidity and using an asset as collateral are separate actions. In Aave, collateral use is a per-asset setting on the account. In the Module, a funding loan against your position requires your explicit authorisation.

## What the Module reports

The Module accounts separately for StakeWise staking exposure through osETH, variable Aave supply interest reflected by aEthosETH, and any separately funded Definica incentives. Your position shows each on its own line. If you authorise financing, allocated debt and its funding cost appear as further lines.

## What you can verify

- Aave's `getReserveData(osETH)`: whether the reserve is active, frozen or paused, its caps, utilisation and current rates, and the aToken address.
- Your aEthosETH balance against the amount you supplied.
- The osETH exchange rate on StakeWise's `OsTokenVaultController`, to separate the two components yourself.

## Related

- [aEthosETH](/concepts/aethoseth)
- [Funding loan](/phase-2/funding-loan)
- [Market and liquidity risk](/risks/market-and-liquidity)
