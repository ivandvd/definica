---
title: 'Oracle risk'
description: 'Definica relies on StakeWise''s Oracles for rewards and exits and on price oracles to value collateral, and either can be wrong or late.'
sidebar_position: 3
---

# Oracle risk

Definica relies on two kinds of oracle. StakeWise's Oracle network reports every Vault's rewards and penalties and approves validator operations through the Keeper; price oracles value osETH as collateral at Aave and value collateral in Definica's Phase 3 markets. A wrong, stale or absent report can misstate your position, delay your exit or cause a liquidation that the market price would not have caused.

## StakeWise's Oracles

Eleven [Oracles](/glossary#oracles) per chain form a decentralised signing committee between the Beacon Chain and the Vaults. A reward update needs six of the eleven signatures. Exit signatures are pre-signed at validator registration and split so that four of the eleven can reconstruct them. The Oracles hold no funds and never submit transactions themselves: they produce signed attestations, which the Operator Service or any other caller submits to the [Keeper](/glossary#keeper).

The Consensys Diligence review of EthFoxVault states the trust assumption plainly: the system depends on a majority of the Oracles, and therefore on their off-chain components, behaving correctly.

| If the Oracles… | Then… |
|---|---|
| Stop reporting | No harvest can succeed; the share price freezes; the exit queue is not processed; pending donations are not recognised |
| Report incorrectly, with a majority | Total assets are misstated and shares are mispriced until corrected |
| Refuse validator registrations | New deposits are not put to work, and the Vault cannot become collateralised |
| Force validator exits | Only if the operator has not freed enough assets within the `force_withdrawals_period` (24 hours) |

Rewards are reported every 12 hours, so between reports the Vault's figures can be up to 12 hours old by design.

## Aave's price oracle for osETH

Aave values its osETH reserve with a correlated-asset price adapter that combines StakeWise's exchange rate with an ETH/USD feed. For a funding loan, that price determines the [health factor](/glossary#health-factor). If the reported price is lower than the true value, a position can be liquidated that should not have been; if it is higher, a position can look healthy while the market would not pay that price for the collateral.

## Oracles in Phase 3 markets

Each Phase 3 market values its collateral with its own oracle, set per market and shown in the app before you confirm. The same failure modes apply: a stale or wrong price can liquidate a healthy loan or leave an unhealthy one open. A market that accepts aEthosETH as collateral prices it with its own oracle, alongside its own LTV, liquidity, lock, redemption and liquidation rules.

## Infrastructure failures

Oracle risk sits alongside infrastructure risk: Keeper, RPC and indexer failures. An RPC or indexer failure does not change the chain, but it can make the interface show stale or incomplete figures; the app then warns that estimates may be delayed or incomplete.

## What you can verify

- `Keeper.lastRewardsTimestamp()` and the Vault's `isStateUpdateRequired()`, to see how fresh the figures are.
- The Oracle set and threshold that StakeWise publishes, and that the Keeper address in use is StakeWise's; see [Verify addresses](/security/verify-addresses).
- At Aave, the osETH oracle address and its reported price, compared with StakeWise's `convertToAssets` for the same amount.
- For a Phase 3 market, the oracle it uses, shown in the app before you confirm, and the time of that oracle's last update.

## Related

- [Keeper and harvests](/concepts/keeper-and-harvests)
- [Market parameters](/phase-3/market-parameters)
- [Liquidation](/phase-3/liquidation)
