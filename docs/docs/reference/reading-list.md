---
title: 'Reading list'
description: 'The StakeWise, Aave and Ethereum documentation behind the mechanics Definica builds on.'
sidebar_position: 1
---

# Reading list

Definica builds on StakeWise V3, Aave V3 Ethereum and Ethereum's proof-of-stake. Their owners' documentation is the best place to go deeper on the mechanics these docs summarise.

## StakeWise

Documentation:

- [Vaults: introduction](https://docs.stakewise.io/docs/vaults/intro)
- [Vaults: technical architecture](https://docs.stakewise.io/docs/vaults/technical-architecture)
- [Vault types](https://docs.stakewise.io/docs/vaults/vault-types)
- [Boost](https://docs.stakewise.io/docs/vaults/boost)
- [Glossary](https://docs.stakewise.io/docs/glossary)
- [Fees](https://docs.stakewise.io/docs/fees/intro)
- [Oracles: introduction](https://docs.stakewise.io/docs/oracles/intro) and [Oracle duties](https://docs.stakewise.io/docs/oracles/oracle-duties)
- [How osToken works](https://docs.stakewise.io/docs/ostoken/how-ostoken-works) and [osToken redemptions](https://docs.stakewise.io/docs/ostoken/ostoken-redemptions)
- [Staker guide: Vault staking](https://docs.stakewise.io/staker/vault-staking) and [simple staking](https://docs.stakewise.io/staker/simple-staking)
- [Vault administration](https://docs.stakewise.io/operator/manage-vault/vault-administration)
- Contract APIs: [KeeperRewards](https://docs.stakewise.io/contracts/api/keeper/KeeperRewards), [Keeper](https://docs.stakewise.io/contracts/api/keeper/KeeperContract), [VaultsRegistry](https://docs.stakewise.io/contracts/api/vaults/VaultsRegistry), [EthVault](https://docs.stakewise.io/contracts/api/vaults/ethereum/EthVault)
- [Mainnet addresses](https://docs.stakewise.io/contracts/networks/Mainnet)
- SDK: [getExitQueuePositions](https://docs.stakewise.io/sdk/api/vault/requests/getexitqueuepositions), [claimExitQueue](https://docs.stakewise.io/sdk/api/vault/transactions/claimexitqueue), [withdraw](https://docs.stakewise.io/sdk/api/vault/transactions/withdraw), [concepts](https://docs.stakewise.io/sdk/fundamentals/concepts)

Source code, [`stakewise/v3-core`](https://github.com/stakewise/v3-core):

- `contracts/interfaces/`: `IVaultEnterExit`, `IVaultState`, `IVaultEthStaking`, `IKeeperRewards`, `IVaultVersion`, `IVaultAdmin`, `IVaultBlocklist`, `IVaultOsToken`, `IVaultFee`, `IEthFoxVault`
- `contracts/vaults/ethereum/custom/EthFoxVault.sol`
- `contracts/vaults/modules/VaultEnterExit.sol` and `VaultState.sol`
- `audits/`: StakeWise's audit reports, including the Consensys Diligence review of EthFoxVault

## Aave

Documentation:

- [Aave V3 overview](https://aave.com/docs/aave-v3/overview) and [developer overview](https://aave.com/docs/developers/aave-v3/overview)
- [Glossary](https://aave.com/docs/resources/glossary) and [parameters](https://aave.com/docs/resources/parameters)
- [Pool contract](https://aave.com/docs/developers/smart-contracts/pool)
- [Interest-rate strategy](https://aave.com/docs/aave-v3/smart-contracts/interest-rate-strategy)
- Help: [liquidations](https://aave.com/help/borrowing/liquidations) and [E-Mode](https://aave.com/help/borrowing/e-mode)

Governance:

- [ARFC: Onboard osETH to Aave V3 on Ethereum](https://governance.aave.com/t/arfc-onboard-oseth-to-aave-v3-on-ethereum/16913)
- [Chaos Labs Risk Stewards: increase supply caps on Aave V3](https://governance.aave.com/t/chaos-labs-risk-stewards-increase-supply-caps-on-aave-v3-02-18-25/21136)
- [BGD: Aave v3.2 Liquid eModes](https://governance.aave.com/t/bgd-aave-v3-2-liquid-emodes/19037)
- [Technical maintenance proposals (ETH-correlated eMode borrowable set)](https://governance.aave.com/t/technical-maintenance-proposals/15274/86)

Address book and source:

- [BGD Labs Aave address book: `AaveV3Ethereum.sol`](https://github.com/bgd-labs/aave-address-book/blob/main/src/AaveV3Ethereum.sol)
- [`aave-dao/aave-v3-origin`](https://github.com/aave-dao/aave-v3-origin): `src/contracts/misc/DefaultReserveInterestRateStrategyV2.sol`, `src/contracts/protocol/libraries/logic/ValidationLogic.sol`

## Ethereum

- [Proof-of-stake](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/)
- [Rewards and penalties](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/)
- [Proof-of-stake FAQs](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/faqs/)
- [Staking withdrawals](https://ethereum.org/en/staking/withdrawals/) and [staking pools](https://ethereum.org/en/staking/pools/)
- [Consensus specs: mainnet configuration](https://github.com/ethereum/consensus-specs/blob/master/configs/mainnet.yaml)
- [EIP-1967: Proxy storage slots](https://eips.ethereum.org/EIPS/eip-1967)
- [EIP-1153: Transient storage opcodes](https://eips.ethereum.org/EIPS/eip-1153)
