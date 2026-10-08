---
title: 'Glossary'
description: 'Every term used in these docs, defined once and grouped by layer: Definica, StakeWise, Aave and Ethereum.'
sidebar_position: 11
---

# Glossary

Each term is defined once here and linked from its first use on other pages. Terms are grouped by the layer they belong to: Definica's own contracts and mechanisms, then the StakeWise, Aave and Ethereum infrastructure Definica builds on.

## Definica

### Activation check \{#activation-check\}

A gate in DefinicaCore linked to Keeper collateralisation. StakeWise's `Keeper.isCollateralized(vault)` becomes true once the Vault has registered validators, and Core accepts deposits only after that. See [Keeper and harvests](/concepts/keeper-and-harvests).

### aEthosETH \{#aethoseth\}

The Aave V3 Ethereum aToken for the osETH reserve, officially named Aave Ethereum osETH. Supplying osETH to that market creates a position represented by aEthosETH, whose balance grows with variable supply interest. aEthosETH is not a StakeWise token, does not represent a second ETH deposit and does not create a second source of validator rewards. See [aEthosETH](/concepts/aethoseth).

### Attributable lending interest (I<sub>u</sub>) \{#attributable-lending-interest\}

The Phase 3 lending interest allocated to a participant. It is split 75% to the participant and 25% to Definica, before upstream financing costs; the split applies to interest, not to deposited principal or net profit. See [Economics](/phase-3/economics).

### Beneficiary \{#beneficiary\}

The account Core credits with shares when it is not the depositor. Shares returned by the Vault are credited internally to the depositor or to a designated beneficiary.

### Borrowing markets \{#borrowing-markets\}

Phase 3: lending markets in which borrowers post approved ETH or ETH-correlated collateral and borrow a supported asset, supplied by funding loans and direct ETH supply. Also called the Borrowing Module. See [Phase 3](/phase-3).

### Commitment \{#commitment\}

Placing an aEthosETH position under the Main Liquidity Module's accounting for a fixed duration, also called an aEthosETH lock-up. The Module records custody, the commitment period and any debt allocated to the position. See [Main Liquidity Module](/concepts/main-liquidity-module).

### DefinicaCore \{#definica-core\}

The user-facing accounting layer. Core receives deposits, holds the aggregate Vault shares and attributes each economic position to an individual user, including locks and exit positions. See [DefinicaCore](/concepts/definica-core).

### Direct ETH supply \{#direct-eth-supply\}

Phase 3 liquidity from your own ETH. It enters the lending markets without Aave funding debt, and you leave through the market's own withdrawals.

### Donator role \{#donator-role\}

A Core role, held by Definica's multisig, that may call `donateAllAssets()` on Core, which forwards ETH to `donateAssets()` on the Vault. See [Treasury](/concepts/treasury).

### Entry A and Entry B \{#entry-a-and-entry-b\}

The two ways into Phase 2. Entry A starts from osETH you already hold, or a compatible aEthosETH receipt. Entry B starts from ETH staked in a separate StakeWise factory Vault that mints osETH. The Phase 1 Vault does not mint osETH and is not part of either entry. See [The committed-liquidity path](/phase-2/committed-liquidity-path).

### ETH donation \{#eth-donation\}

The treasury route in which the multisig adds ETH to the Vault without minting shares: `P_after = (A + D) / S`. The donation is recognised at the next successful harvest. See [Treasury policy](/phase-1/treasury-policy).

### EthPooledStakingVault \{#eth-pooled-staking-vault\}

Definica's dedicated StakeWise Vault and its staking and Vault-share layer. It is based on EthFoxVault, accepts ETH only and does not mint osETH. See [EthPooledStakingVault](/concepts/eth-pooled-staking-vault).

### Funding loan \{#funding-loan\}

An optional Aave borrow, authorised by you, against a committed aEthosETH position: WETH or another permitted asset, subject to the market, eMode, liquidity and caps. The borrowed asset supplies the Phase 3 lending markets. See [Funding loan](/phase-2/funding-loan).

### Lock incentives \{#lock-incentives\}

A separately funded programme for eligible aEthosETH commitments, with its own budget, duration, eligibility and allocation rules, shown in the app. A lock-duration multiplier, where one applies, changes incentive-allocation weight only; it does not multiply validator rewards or market interest.

### Main Liquidity Module \{#main-liquidity-module\}

The Phase 2 layer for locking Aave-supplied osETH, held as aEthosETH. It manages committed aEthosETH supply positions and, with your authorisation and where Aave's market supports it, borrowing against those positions through Aave. See [Main Liquidity Module](/concepts/main-liquidity-module).

### Managed partial claim \{#managed-partial-claim\}

What happens when an exit handled through Core is only partly claimable: the claimable part is paid and the remaining exit position is kept for later settlement. It mirrors StakeWise's partial `claimExitedAssets`, which issues a new ticket for the remainder.

### Multisig \{#multisig\}

A wallet that needs several signers to execute a transaction. Definica's multisig executes treasury contributions; its signers and threshold are readable from the multisig contract itself.

### Referrer \{#referrer\}

The second argument of StakeWise's `deposit(receiver, referrer)`, recorded only in the `Deposited` event. Core forwards each deposit with itself as receiver and the caller as referrer. See [Depositing](/phase-1/depositing).

### Share lock (Core lock) \{#share-lock\}

An optional Phase 1 lock on Vault shares, from 7 to 365 days, with up to 10 lock positions at a time. Locked shares remain part of reward accounting. Share locks are separate from Phase 2 commitments. See [Share locks](/concepts/share-locks).

### Treasury share burn \{#treasury-share-burn\}

The treasury route in which the multisig burns Vault shares it owns through `donateShares()`: `P_after = A / (S − B)`. Only the caller's own shares are burned. See [Treasury policy](/phase-1/treasury-policy).

### Upgrade authoriser \{#upgrade-authoriser\}

The DefinicaCore role that pre-authorises an upgrade. It approves exactly one implementation at a time, the approval is consumed when the upgrade runs, and the role is distinct from Core's admin. See [Controls and upgrades](/phase-1/controls-and-upgrades).

## StakeWise

### Blocklist and blocklist manager \{#blocklist\}

A Vault feature that accepts deposits from any wallet except those on a blocklist. The blocklist manager can add or remove blocked addresses and, in EthFoxVault, can call `ejectUser`, which moves a user's shares into the exit queue. EthFoxVault, the base of Definica's Vault, includes this feature.

### Capacity \{#capacity\}

A deposit limit set when a Vault is created, which caps the total ETH the Vault can accept. Deposits beyond it revert with `CapacityExceeded`.

### Claim delay \{#claim-delay\}

The minimum time between entering a Vault's exit queue and claiming the exited ETH. A claim succeeds only once the request has been processed and the delay has passed; the Vault's own setting applies. See [Exits and withdrawals](/phase-1/exits-and-withdrawals).

### EthFoxVault \{#ethfoxvault\}

A custom StakeWise Vault type in `v3-core`: an Ethereum Vault with non-transferable shares, a blocklist and its own MEV escrow, without osToken minting. It was built for Consensys and MetaMask staking and reviewed by Consensys Diligence. Definica's Vault is based on it. See [EthPooledStakingVault](/concepts/eth-pooled-staking-vault).

### Exit queue \{#exit-queue\}

The queue that manages withdrawal requests from a Vault. Shares in the queue keep earning rewards until the Vault burns them, and a claim is possible after the Vault's claim delay. See [Exit queue](/concepts/exit-queue).

### Position ticket \{#position-ticket\}

The record issued when you enter the exit queue. It tracks your place in line and the amount you asked to withdraw. A partial claim creates a new ticket for the remainder.

### Vault fee and fee recipient \{#vault-fee\}

A percentage fee on staking rewards, between 0% and 100%, deducted at harvests and paid as newly minted shares to the fee recipient. StakeWise limits fee increases to steps of 20% with a three-day delay, and a fee starting from 0% cannot exceed 1% at first. See [Fees](/phase-1/fees).

### Harvest (updateState) \{#harvest\}

The update of a Vault's state onchain. It brings the Vault's balance in line with the consensus layer, applies fee accruals and processes the exit queue. The Operator Service triggers it every 12 hours by default, and any interaction can trigger it too. See [Keeper and harvests](/concepts/keeper-and-harvests).

### Keeper \{#keeper\}

The StakeWise contract that coordinates the Operator Service and the Oracle network. It approves validator registrations through Oracle consensus and processes reward updates. The Keeper is immutable and applies a 12-hour `rewardsDelay`.

### MEV escrow (own) and Smoothing Pool \{#mev-escrow\}

With its own escrow, a Vault collects the block proposal rewards of its own validators. With the Smoothing Pool, block rewards are shared across all participating Vaults in proportion to the attestation rewards their validators earned. EthFoxVault uses its own escrow.

### Operator and Operator Service \{#operator\}

An operator runs the validators of a Vault. The Operator Service automates validator registration, consolidations, withdrawals, state updates and fee claims. Definica's Vault uses a selected operator, which runs the node and validator clients.

### Oracles \{#oracles\}

StakeWise's decentralised signing committee between the Beacon Chain and the Vaults. The Oracles report staking rewards and penalties, approve validator registrations and consolidations, and enable validator exits. There are eleven per chain with a threshold of 6 of 11 signatures; they hold no funds and never submit transactions themselves.

### osETH (osToken) \{#oseth\}

StakeWise's overcollateralised staked token: a repricing ERC-20 whose value increases as staking rewards accrue. A 5% StakeWise DAO fee on osToken rewards accrues to the minter's debt. See [osETH](/concepts/oseth).

### osToken position (LTV and liquidation, StakeWise side) \{#ostoken-position\}

A minter's liability at its Vault, measured as the value of minted osToken against the value of the staked collateral. Standard Vaults allow 90% LTV; positions above 92% can be liquidated, and liquidators receive collateral plus a 1% premium. It applies to Entry B only.

### osETH redemption (OsTokenRedeemer) \{#oseth-redemption\}

osETH can be redeemed for ETH at its fair exchange rate through a queue: you enter, receive a ticket, the queue is settled against minters' positions starting with the riskiest, a checkpoint follows after 12 hours, and you claim. If Vaults lack liquidity, the Oracle network forces validator exits.

### Vault shares \{#vault-shares\}

The accounting units every StakeWise Vault uses to represent a proportional stake in the Vault: `shares = assets × S / A` and `assets = shares × A / S`. Shares are non-transferable in Definica's Vault type. See [Vault shares](/concepts/vault-shares).

### Unbonded ETH \{#unbonded-eth\}

ETH in a Vault that is not staked in validators, which provides liquidity for withdrawals. The amount withdrawable now is the Vault balance minus assets that are queued, exiting or unclaimed.

### Vault \{#vault\}

An isolated StakeWise staking pool: a smart contract that takes deposits, distributes rewards and handles withdrawals without a custodian. Vaults do not share risk with each other.

### Vault admin \{#vault-admin\}

The main controller of a Vault. The admin manages permissions, sets fees and the fee recipient, updates metadata and adjusts settings, and can upgrade only to implementations registered by the StakeWise DAO.

### Validators manager (keys manager) \{#validators-manager\}

The Vault role that may run validator operations: registration, funding, consolidation and withdrawals, each with Oracle approval.

### VaultsRegistry \{#vaults-registry\}

StakeWise's canonical onchain list of valid Vaults. It also lists approved factories and implementations, and is owned by the StakeWise DAO. A Vault upgrade must target a registered implementation exactly one version higher.

## Aave

### aToken \{#atoken\}

The interest-bearing token you receive when you supply an asset to an Aave V3 market. Its balance increases over time from borrowing activity in the pool. aEthosETH is one.

### Supply cap and borrow cap \{#caps\}

Limits, set by Aave governance, on the total amount of an asset that can be supplied or borrowed. A transaction that would exceed them reverts with `SupplyCapExceeded` or `BorrowCapExceeded`.

### eMode (Efficiency Mode) \{#emode\}

An Aave mode that gives more borrowing power against correlated assets. Within an eMode category, borrowing is limited to the category's borrowable assets, and the category sets its own LTV, liquidation threshold and liquidation bonus.

### Health factor \{#health-factor\}

`Health factor = (total collateral value × weighted average liquidation threshold) / total borrow value`. A position can be liquidated when its health factor falls below 1.

### Isolation mode and debt ceiling \{#isolation-mode\}

Isolation mode limits borrowers who supply an isolated asset to borrowing only certain stablecoins. The debt ceiling is the most debt that can be issued against an isolated asset.

### Liquidation (Aave) \{#liquidation\}

What happens when a borrower's health factor falls below 1: collateral is sold to repay part of the debt. A liquidator can repay up to 50% of the debt in one call while the health factor is above 0.95 (with both sides at least $2,000), and up to 100% otherwise. The liquidation bonus compensates the liquidator. See [Liquidation](/phase-3/liquidation).

### Liquidation threshold \{#liquidation-threshold\}

The point at which a loan becomes eligible for liquidation because the collateral is too small relative to the debt.

### LTV (loan-to-value) \{#ltv\}

The largest percentage of a collateral asset's value that can be borrowed. LTV is a borrowing constraint, not an allocation key.

### Reserve factor \{#reserve-factor\}

The share of borrowers' interest that goes to the Aave treasury. The supply rate equals the borrow rate × utilisation × (1 − reserve factor).

### Siloed borrowing \{#siloed-borrowing\}

A setting that limits anyone who borrows a given asset to borrowing only that asset.

### Utilisation and the interest-rate model \{#utilisation\}

Utilisation is debt divided by debt plus available liquidity. Aave's rate model has two slopes around an optimal utilisation; above that point, rates rise faster.

### Variable debt token \{#variable-debt-token\}

The ERC-20 token that tracks an outstanding variable-rate borrow and accrues interest over time.

### Withdrawal constraints (Aave) \{#withdrawal-constraints\}

Withdrawing redeems aTokens for the underlying asset, including accrued interest, as far as unborrowed liquidity allows and as long as any active borrow stays collateralised. The errors are `NotEnoughAvailableUserBalance` and `HealthFactorLowerThanLiquidationThreshold`.

## Ethereum

### Epoch \{#epoch\}

32 slots of 12 seconds, or 6.4 minutes. Validator exits, withdrawability delays and churn limits are measured in epochs.

### ERC-1967 proxy \{#erc-1967-proxy\}

The standard storage location a proxy uses for the address of the logic contract it delegates to. StakeWise Vaults and DefinicaCore each use a separate ERC-1967 proxy, which preserves state across upgrades.

### Slashing \{#slashing\}

The destruction of part of a validator's stake and its ejection from the network, triggered by proposing two blocks for one slot, or by surround or double votes. See [Staking and validator risk](/risks/staking-and-validator).

### Transient-storage reentrancy guard \{#transient-storage-reentrancy-guard\}

A reentrancy lock built on EIP-1153 `TSTORE` and `TLOAD`, whose state is discarded after every transaction. DefinicaCore uses one.

### Validator exit queue (Ethereum) \{#validator-exit-queue\}

Exits are capped per epoch by a churn limit; an exited validator becomes withdrawable only after 256 epochs; its funds are then paid by the withdrawal sweep, at most 16 withdrawals in a single block. See [Exit queue](/concepts/exit-queue).
