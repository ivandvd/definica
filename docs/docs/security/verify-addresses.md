---
title: 'Verify addresses'
description: 'How to check Definica''s contract addresses before you send funds, and the StakeWise and Aave contracts Definica works with.'
sidebar_position: 5
---

# Verify addresses

Check every address before you send funds to it. This page covers Definica's own contracts, what each does and what to check, and the StakeWise and Aave contracts Definica works with, which belong to their owners and are not Definica's.

:::danger[Never deposit to an address from a chat, post or screenshot]
Take Definica's addresses only from the official interface, and confirm them in your wallet before you sign. Do not transfer assets on the strength of a screenshot, a social-media post, a test deployment or an unverified address.
:::

## Definica contracts

Definica's contract addresses are listed in the app (the Contracts card on the Stake screen lists DefinicaCore, the Vault and the Keeper) and shown again by your wallet before you sign. Check them on a block explorer before sending funds.

| Contract | What it does | What to check |
|---|---|---|
| DefinicaCore (proxy) | Takes your ETH, forwards it to the Vault and records your share | Verified source; its implementation slot points at the Core implementation |
| DefinicaCore (implementation) | The logic behind the Core proxy | Source revision and compiler settings match the release |
| EthPooledStakingVault (proxy) | The dedicated StakeWise Vault that stakes the pooled ETH | `VaultsRegistry.vaults(vault)` and `Keeper.isCollateralized(vault)` are true |
| EthPooledStakingVault (implementation) | The Vault logic, based on EthFoxVault | `VaultsRegistry.vaultImpls(implementation)` is true |
| Treasury multisig | Executes ETH donations through Core and burns its own shares | Signers and threshold, on the multisig itself |
| Main Liquidity Module | Holds committed aEthosETH; records custody, commitments and allocated debt | Verified source; uses the Aave Pool and aEthosETH listed below |
| Phase 3 lending markets | Lend to borrowers against approved collateral | Verified source; collateral, oracle and parameters match the app |

Definica is built on Ethereum: the Vault uses StakeWise's mainnet infrastructure and the Module uses Aave V3 Ethereum. The app shows the network on every transaction review.

## StakeWise contracts (Ethereum mainnet)

StakeWise lists these on its mainnet address page, [docs.stakewise.io/contracts/networks/Mainnet](https://docs.stakewise.io/contracts/networks/Mainnet). They are StakeWise's contracts: Definica's Vault interacts with them, but they are not Definica's.

| Contract | Address | Why it matters to Definica |
|---|---|---|
| Keeper | `0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5` | Reward updates and validator approvals; `isCollateralized(vault)` drives Core's activation check |
| VaultsRegistry | `0x3a0008a588772446f6e656133C2D5029CC4FC20E` | `vaults(address)` confirms a Vault is recognised; `vaultImpls(address)` confirms an implementation is DAO-registered |
| osETH token (OsToken) | `0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38` | The osETH used in Phase 2 |
| OsTokenVaultController | `0x2A261e60FB14586B474C208b1B7AC6D0f5000306` | osETH exchange rate |
| OsTokenRedeemer | `0xc43A7b16A7a167c0318390Cba16787C11e9e1FD0` | osETH to ETH redemption queue |

StakeWise's page also lists a Vault named **FoxVault** at `0x4FEF9D741011476750A243aC70b9789a63dd47Df`. That is a StakeWise-listed Vault of the EthFoxVault type, the lineage Definica's Vault is based on. It is **not** Definica's Vault and is listed here only so that it is not mistaken for one.

## Aave V3 Ethereum contracts

The BGD Labs Aave address book lists these in [`AaveV3Ethereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/AaveV3Ethereum.sol). They are Aave's contracts, governed by Aave; the Main Liquidity Module and the funding loan interact with them.

| Contract | Address | Why it matters to Definica |
|---|---|---|
| Pool | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` | `supply`, `borrow`, `withdraw`, `getReserveData`, `getUserAccountData` |
| osETH (reserve underlying) | `0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38` | Same token as StakeWise's osETH above |
| aEthosETH (osETH aToken) | `0x927709711794F3De5DdBF1D176bEE2D55Ba13c21` | The receipt committed to the Main Liquidity Module |
| osETH variable debt token | `0x8838eefF2af391863E1Bb8b1dF563F86743a8470` | Debt token if osETH were borrowed |
| osETH price oracle (adapter) | `0x2b86D519eF34f8Adfc9349CDeA17c09Aa9dB60E2` | How Aave values osETH collateral |
| WETH (reserve underlying) | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | The funding loan's asset (WETH, or another permitted asset) |

Address books change. Re-check the linked source before relying on any entry.

## How to verify a Definica address

1. **Find it in the app, then in your wallet.** The app lists it (for Phase 1, on the Contracts card of the Stake screen), and your wallet shows it again before you sign; the two must agree. Never use an address from a chat, a post or a screenshot.
2. **Check the source is verified** on a block explorer and matches the release's source revision and compiler settings.
3. **Read the proxy.** The ERC-1967 implementation slot should point at the implementation, and the admin slot at the expected admin; see [Control model](/security/control-model).
4. **For the Vault:** `VaultsRegistry.vaults(vault)` is true; `Keeper.isCollateralized(vault)` is true before you deposit; `capacity()`, `feePercent()`, `feeRecipient()`, `admin()` and `version()` match what the app shows.
5. **For Core:** `Vault.getShares(core)` is non-zero once deposits exist, and the Vault and Keeper that Core is configured with match the Vault shown in the app and StakeWise's Keeper above.
6. **Before signing:** your wallet shows the same address, network, function and amount as the interface.

## Related

- [Source of truth](/security/source-of-truth)
- [Controls and upgrades](/phase-1/controls-and-upgrades)
- [Reading list](/reference/reading-list)
