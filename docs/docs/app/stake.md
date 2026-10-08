---
title: 'Stake'
description: 'The Stake screen: choosing an amount, the checks on it, what the review shows before you confirm, and how your ETH becomes Vault shares in DefinicaCore.'
sidebar_position: 3
---

# Stake

The Stake screen, headed **Stake ETH**, turns ETH into a staking position. You enter an amount, check the review and sign one transaction; DefinicaCore forwards the ETH to the dedicated StakeWise Vault and records the Vault shares it receives as your position.

On a phone the form comes first, with the Stake, Unstake and Locks switch above it. On a wide screen it sits on the right, beside your stake, the Vault card and **How it works**.

## How it works

The screen's **How it works** card sums up the path in three steps:

1. **Your ETH goes in.** Definica sends it to the dedicated Vault and records your position. Behind this, DefinicaCore deposits the ETH with Core as the receiver and you as the [referrer](/glossary#referrer).
2. **You hold Vault shares.** Your [Vault shares](/glossary#vault-shares) are your proportion of the Vault's assets, so they stay worth your share of it. Core holds the aggregate shares and keeps your part in its ledger.
3. **Rewards arrive.** Validators run by the selected operator earn rewards, which reach every share at each [harvest](/glossary#harvest), net of fees.

**No validator to run**, under the form, makes the same point: the Vault pools deposits until there is enough to fund validators.

## The form

| Part | What it shows |
|---|---|
| You stake | The ETH to deposit, with your wallet **Balance** and **MAX**, and quick amounts of **0.1 ETH**, **1 ETH** and **5 ETH**. **MAX** keeps a little ETH in your wallet for the network fee. |
| You receive ≈ … Vault shares | Under the amount: the estimated shares at the current share price |
| Share price | The ETH value of one Vault share |
| Fees | The total fee as a percentage of rewards: taken from rewards, never from your deposit |

The button reads **Enter an amount** until you type one, then **Stake** with the amount, for example **Stake 1.25 ETH**. Without a wallet it reads **Connect wallet to continue**, and on another network **Switch to Ethereum**.

Vault shares are accounting units, not a fixed balance: the number of shares stays the same while their ETH value moves with the share price. See [Vault shares](/concepts/vault-shares).

Beside the form:

- **Your stake**, once you have a position: its value, your Vault shares, the shares available and your lifetime rewards, with a link to this page.
- The Vault card: the capacity used, the share price and its change over 30 days, the fees as a share of rewards, split between the Vault and Definica, the minimum deposit and the next harvest. The card reads **Active**, or **Activating** until the Vault accepts deposits.
- **How it works**, as above.
- **Unstaking**: unstaking uses the Vault's available liquidity, or waits for validator exits, before the ETH can be claimed, and locked shares can be unstaked once their lock matures.

### Checks on the amount

The form explains any problem with the amount under the field, and the button stays off until it is fixed. Balance checks apply once a wallet is connected.

| Message | Cause |
|---|---|
| Enter a number. | The amount is not a number |
| The minimum deposit is … ETH. | The amount is below the Vault's minimum deposit |
| That is more than the ETH in your wallet. | The amount exceeds your wallet balance |
| Leave about … ETH for the network fee. | The amount leaves too little ETH in your wallet to pay the network fee |
| The Vault has room for … ETH more. | The amount exceeds the Vault's remaining capacity |
| The Vault is full. Deposits reopen when capacity frees up. | The Vault has no capacity left |

A problem with the whole form shows above the button instead:

- When the Vault is not activated, a notice at the top of the form, **Deposits open once the Vault is activated**, explains that the Vault accepts deposits once it has registered validators.
- When the figures on screen are out of date, confirming waits until they refresh.
- When new positions are not available in your region, staking is closed; exits, claims, releases and repayments stay open.

## The review

Once the amount is valid, the button opens the review in the form's place. It shows the ETH you give and the Vault shares you get, then how your **Vault shares** and **Position value** change, before and after, and the conditions of the deposit. Their values are set per Vault and shown before every transaction.

| Row | What it tells you |
|---|---|
| Vault | The Vault your ETH goes to |
| Share price | The ETH value of one Vault share now |
| Vault fee | The Vault's [fee](/glossary#vault-fee), as a percentage of rewards |
| Definica fee | Definica's fee, as a percentage of rewards |
| Minimum deposit | The smallest deposit accepted |
| Capacity left | The ETH the Vault can still accept before it reaches its [capacity](/glossary#capacity) |
| Network fee | The estimated cost of the transaction, in ETH on Ethereum |

A note under the rows repeats that rewards depend on validator performance and are not guaranteed, and that fees come out of rewards, never your deposit. You then tick the acknowledgement: you understand that rewards depend on validator performance and are not guaranteed, that fees are taken from rewards, and that a withdrawal may wait for validator exits before the ETH can be claimed. The confirm button repeats the amount, and **Back** returns to the form.

## Confirming a deposit

Staking follows the app's [transaction steps](/app#how-every-transaction-works).

1. **Review.** As above.
2. **Confirm in your wallet.** The pane asks you to check the amount and the network in your wallet, then confirm. Your wallet shows a transaction to DefinicaCore carrying your ETH; [Verify addresses](/security/verify-addresses) sets out how to check a Definica address.
3. **Transaction submitted.** The app shows the deposit as submitted while the network confirms it, and **View transaction** opens its receipt. You can leave with **Close and keep going**; the bell lists the transaction while it is in progress.
4. **Updating your position.** The transaction is confirmed and the app reads your new position from the chain.
5. **Staked.** Your Vault shares are in your position, and rewards apply at each harvest. **Your first rewards** counts down to the next harvest, when they arrive. The pane repeats the summary and offers **View transaction**. **Stake more** clears the form for another deposit, and **See your position** opens Home.

A notification also confirms the deposit, with **View transaction**. That opens the transaction's [receipt](/app#receipts): its status, the amount, the date, the network fee, the transaction hash with a button to copy it, and **View on Etherscan**.

If you reject the request in your wallet, the pane reads **Request rejected**: nothing was sent, and **Try again** returns you to the review. If the transaction reverts onchain, it reads **Transaction failed** with the reason, for example the Vault filling up while your transaction was pending. Nothing is deposited and nothing moves except the network fee, which is spent; **Try again** is offered here too.

## When a deposit cannot go through

The contracts enforce two conditions of their own:

- **[Activation check](/glossary#activation-check).** Core accepts deposits only once `Keeper.isCollateralized(vault)` returns true, which happens when the Vault has registered validators. Until then the Vault card reads **Activating** and the form shows **Deposits open once the Vault is activated**.
- **Capacity.** A deposit above the Vault's remaining capacity reverts with `CapacityExceeded`. The app stops it before you sign. If the Vault fills up while your transaction is pending, the transaction fails with that reason.

## After staking

Your position appears on [Home](/app#the-home-screen): its value, lifetime rewards, the shares available and a chart of its value, with what it earned over the range you choose. The deposit is listed in [Activity](/app/activity) as **Staked**, with the shares received and its transaction. Rewards and penalties reach the Vault through StakeWise's [Oracles](/glossary#oracles) every 12 hours and apply at harvests, so your value changes in steps rather than continuously.

## Related

- [Depositing](/phase-1/depositing)
- [Fees](/phase-1/fees)
- [Vault shares](/concepts/vault-shares)
- [Verify addresses](/security/verify-addresses)
