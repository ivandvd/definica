---
title: 'Market and liquidity risk'
description: 'osETH rates and Aave conditions change over time; caps, variable rates and liquidity at each layer decide how fast you can leave.'
sidebar_position: 4
---

# Market and liquidity risk

osETH rates and Aave conditions change over time. A position that reaches into Phase 2 or Phase 3 depends on markets Definica does not control: Aave's utilisation and caps, osETH's exchange rate and market price, and the liquidity available at each layer when you want to leave. Even in Phase 1, the Vault's own liquidity decides whether an exit is quick or slow.

## Liquidity at three layers

| Layer | What must be available | What blocks it |
|---|---|---|
| Vault exit (Phase 1 and Entry B) | [Unbonded ETH](/glossary#unbonded-eth) or validator exits | A long Ethereum exit queue; the Vault's claim delay |
| Aave withdrawal (Phase 2) | Unborrowed osETH in the reserve, and a health factor at or above 1 after the withdrawal | High utilisation (`NotEnoughAvailableUserBalance`); a funding loan the withdrawal would leave under-collateralised (`HealthFactorLowerThanLiquidationThreshold`) |
| osETH to ETH (after Phase 2) | StakeWise's [redeemer queue](/glossary#oseth-redemption) (12-hour checkpoint, with forced validator exits if needed) or a market buyer | Queue depth; market depth and price |

Lock expiry does not guarantee cash. A commitment maturing, or a lock ending, releases nothing at any of these layers by itself.

## Caps

Aave's [supply and borrow caps](/glossary#caps) are set by governance and can be reached at any time. Reaching the osETH supply cap blocks new supply (`SupplyCapExceeded`); reaching the WETH borrow cap blocks new funding loans (`BorrowCapExceeded`). StakeWise's documentation of its own Boost product notes that osETH supply-cap exhaustion can block new positions. Aave governance has changed the osETH cap more than once, so only the value currently set on the Pool counts.

## Variable rates

Aave's supply and borrow rates are driven by [utilisation](/glossary#utilisation) and rise faster once a reserve passes its optimal utilisation. A funding loan's cost can therefore jump when the WETH reserve is heavily borrowed, which is often exactly when ETH-correlated strategies are crowded. Supply interest on aEthosETH varies in the same way, in the other direction.

## Exchange rate and market price

osETH has two prices. Its exchange rate, from `OsTokenVaultController`, reflects accumulated staking performance and moves only at reward updates. Its market price on secondary venues can trade away from that rate, and a discount to it is a depeg.

Aave values osETH through an adapter anchored to the exchange rate, so a market discount does not by itself trigger liquidation. But if you need ETH quickly and sell osETH on the market, you receive the market price, not the exchange rate. The redeemer queue pays the exchange rate but takes time.

## Concentration

Everything in Definica's design is ETH-correlated: the stake, osETH, aEthosETH, the funding loan and the Phase 3 collateral. A fall in ETH's price does not change the ETH-denominated accounting, but it changes what the position is worth in any other currency, and it tends to coincide with high utilisation and crowded exits. See [Correlation is not safety](/risks/correlation-is-not-safety).

## What you can verify

- On the Vault: `withdrawableAssets()` and the claim delay.
- On Aave: `getReserveData` for osETH and WETH (whether each reserve is active, frozen or paused, and its caps, utilisation and rates), `getEModeCategoryData` for the category in use, and your `getUserAccountData`.
- On StakeWise: the osETH exchange rate and the state of the redeemer queue.
- On secondary markets: the osETH price against its exchange rate, and the depth available at that price.

## Related

- [Exits and withdrawals](/phase-1/exits-and-withdrawals)
- [Aave supply and aEthosETH](/phase-2/aave-supply-and-aethoseth)
- [Closing a financed position](/phase-3/closing-a-financed-position)
