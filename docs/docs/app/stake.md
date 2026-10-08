---
title: 'Stake'
description: 'The Stake screen: choosing an amount, what you see before you confirm, and how your ETH becomes Vault shares in DefinicaCore.'
sidebar_position: 3
---

# Stake

The Stake screen turns ETH into a Phase 1 position. You enter an amount, check the conditions and sign one transaction; DefinicaCore forwards the ETH to the dedicated StakeWise Vault and records the Vault shares it receives as your position.

## How it works

The screen's **How it works** card sums up the path in three steps:

1. **ETH goes to DefinicaCore.** Core forwards it to the dedicated Vault, with Core as the receiver and you as the [referrer](/glossary#referrer), and records your position.
2. **The Vault credits shares.** Your [Vault shares](/glossary#vault-shares) are your proportion of the Vault's assets. Core holds the aggregate shares and keeps your part in its ledger.
3. **Validators earn rewards.** The Vault funds validators run by the selected operator. Rewards accrue to every share after each [harvest](/glossary#harvest), net of fees.

There is no validator to run: the Vault pools deposits until they are enough to fund validators.

## The form

| Field | What it shows |
|---|---|
| Amount to stake | The ETH to deposit, with your wallet balance, a MAX button and quick amounts of 0.1, 1 and 5 ETH |
| You receive | The estimated Vault shares at the current share price |
| Share price | The ETH value of one Vault share |
| Fees | The total fee as a percentage of rewards; fees are taken from rewards, never from your deposit |

Once the amount is valid, the button reads **Stake** followed by the amount. Without a wallet it reads **Connect wallet to stake**.

Vault shares are accounting units, not a fixed balance: the number of shares stays the same while their ETH value moves with the share price. See [Vault shares](/concepts/vault-shares).

### Checks on the amount

The field explains any problem under the amount, and the button stays disabled until it is fixed.

| Message | Cause |
|---|---|
| Enter a number. | The amount is not a number |
| Enter an amount above zero. | The amount is zero or less |
| The minimum deposit is … ETH. | The amount is below the minimum deposit |
| That is more than the balance in your wallet. | The amount exceeds your wallet balance |
| The Vault does not have capacity for this deposit. | The amount exceeds the Vault's remaining capacity |

## Before you confirm

The **Before you confirm** card beside the form shows the Vault's remaining capacity with a bar of capacity used, then the conditions of the deposit. The review repeats them. Their values are set per Vault and shown before every transaction.

| Row | What it tells you |
|---|---|
| Vault | The Vault your ETH goes to |
| Share price | The ETH value of one Vault share now |
| Vault fee (of rewards) | The Vault's [fee](/glossary#vault-fee), as a percentage of rewards |
| Definica fee (of rewards) | Definica's fee, as a percentage of rewards |
| Minimum deposit | The smallest deposit accepted |
| Capacity left | The ETH the Vault can still accept before it reaches its [capacity](/glossary#capacity) |

The **Contracts** card lists the contracts behind your deposit, each address linked to Etherscan.

| Contract | Role |
|---|---|
| DefinicaCore | User ledger; holds the aggregate Vault shares |
| Staking Vault | Pools the assets and funds validators |
| Keeper | StakeWise's contract for harvests and reward updates |

Check each address against [Verify addresses](/security/verify-addresses), and again in your wallet before you sign.

A **Withdrawals** note completes the column: a withdrawal may use available liquidity or require validator exits before ETH becomes claimable, and locked shares cannot be withdrawn until the lock matures.

## Confirming a deposit

Staking follows the app's four-step transaction flow.

1. **Review: Stake ETH.** The dialog shows the ETH you stake and the shares you receive, the conditions above, and an acknowledgement to tick: rewards depend on validator performance, fees are taken from rewards, and a withdrawal may require validator exits before ETH becomes claimable. The confirm button repeats the amount.
2. **Wallet: Confirm in your wallet.** Your wallet shows a transaction to DefinicaCore carrying your ETH. Check the address against the Contracts card, and the network, before you approve.
3. **Pending: Transaction submitted.** The app waits for the network to confirm the transaction.
4. **Result: Staked.** Your Vault shares are recorded in DefinicaCore, and the dialog links to the transaction on Etherscan.

If you reject the request in your wallet or the transaction fails, the dialog shows **Something went wrong** with the reason. **Try again** returns you to the review.

## When a deposit cannot go through

The contracts enforce two conditions of their own:

- **[Activation check](/glossary#activation-check).** Core accepts deposits only once `Keeper.isCollateralized(vault)` returns true, which happens when the Vault has registered validators.
- **Capacity.** A deposit above the Vault's remaining capacity reverts with `CapacityExceeded`. The app stops it before you sign.

## After staking

Your position appears on the [Overview](/app): its value, lifetime rewards, available shares and a chart of its value. The deposit is listed in [Activity](/app/activity) as **Staked**, with its transaction. Rewards and penalties reach the Vault through StakeWise's [Oracles](/glossary#oracles) every 12 hours and apply at harvests, so your value changes in steps rather than continuously.

## Related

- [Depositing](/phase-1/depositing)
- [Fees](/phase-1/fees)
- [Vault shares](/concepts/vault-shares)
- [Verify addresses](/security/verify-addresses)
