---
title: 'osETH'
description: 'osETH is StakeWise''s repricing liquid staking token and the asset you supply to Aave V3 Ethereum to enter Definica''s Phase 2.'
sidebar_position: 2
---

# osETH

[osETH](/glossary#oseth) is StakeWise's liquid staking token, short for Overcollateralized Staked Token: a repricing ERC-20 whose value rises as staking rewards accrue. It is the entry asset of Definica's Phase 2, where it is supplied to Aave V3 Ethereum. Definica's Phase 1 Vault does not mint it.

## What osETH is

osETH represents staked ETH plus accrued rewards. It is minted against [Vault shares](/glossary#vault-shares) in StakeWise Vaults that support osToken minting. Its value is governed by StakeWise's `OsTokenVaultController`: the exchange rate is `totalAssets ÷ totalShares`, and profit accrues continuously as `avgRewardPerSecond × totalAssets × timeElapsed`, with `avgRewardPerSecond` set through the StakeWise [Keeper](/glossary#keeper).

Two consequences matter to you:

- osETH's exchange rate reflects the staking performance of the osETH system as a whole, not of any single Vault.
- The StakeWise DAO charges a 5% fee on rewards accumulated by osToken. It is applied continuously to the minter's osToken debt, not deducted from holders' balances.

## Minting and the osToken position

Minting osETH creates an [osToken position](/glossary#ostoken-position): a liability at the originating Vault, measured as the loan-to-value ratio of minted osToken value to staked collateral value. In Standard Vaults the LTV limit is 90%, and a position above 92% LTV can be liquidated: liquidators burn the osTokens and receive collateral value plus a 1% premium. DAO-approved Vaults can reach 99.99% LTV, with liquidations disabled and a 5M SWISE bond. Fully unstaking from the minting Vault requires burning all minted osETH plus the accrued fee.

That liability stays at the originating Vault. Neither holding the resulting receipt nor locking it extinguishes the debt.

## Redemption

osETH can be redeemed for ETH at its fair exchange rate through StakeWise's [redemption queue](/glossary#oseth-redemption), `OsTokenRedeemer`:

1. The holder enters the queue and receives a ticket.
2. The request is settled against minters' positions, highest LTV first.
3. A checkpoint is produced after 12 hours.
4. The holder claims the ETH.

If Vaults lack liquidity, the Oracle network forces validator exits until the queue can be filled. osETH can also be sold on secondary markets, a separate route with its own price risk.

## Where osETH appears in Definica

| Phase | Role of osETH |
|---|---|
| Phase 1 | None. The dedicated Vault does not mint osETH. |
| Phase 2, Entry A | osETH you already hold, supplied to Aave V3 Ethereum. A compatible aEthosETH receipt enters directly. |
| Phase 2, Entry B | Minted against ETH you stake in a separate StakeWise factory Vault that supports osETH minting. |
| Phase 3 | The primary collateral asset of the borrowing markets. |

Definica reports any osETH exposure as its own component, separate from Aave supply interest and any Definica incentives. See [Entry A and Entry B](/glossary#entry-a-and-entry-b).

## What you can verify

- The osETH token contract, published by StakeWise at [docs.stakewise.io/contracts/networks/Mainnet](https://docs.stakewise.io/contracts/networks/Mainnet). It is StakeWise's contract, not Definica's; see [Verify addresses](/security/verify-addresses).
- The current exchange rate and `avgRewardPerSecond` on `OsTokenVaultController`.
- For an osToken position: its LTV, and whether it is above the Vault's liquidation threshold.

## Related

- [aEthosETH](/concepts/aethoseth)
- [The committed-liquidity path](/phase-2/committed-liquidity-path)
- [Separate obligations](/phase-2/separate-obligations)
