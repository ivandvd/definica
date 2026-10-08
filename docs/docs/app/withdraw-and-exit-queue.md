---
title: 'Unstake and the exit queue'
sidebar_label: 'Unstake'
description: 'Requesting an exit for available shares, choosing a route, following each request in the exit queue and claiming the ETH, in full or in part.'
sidebar_position: 4
---

# Unstake and the exit queue

Unstaking takes two transactions with a wait between them. Requesting an exit places Vault shares in the Vault's [exit queue](/glossary#exit-queue), and **Claim** pays out the ETH once it is ready. The Unstake screen holds both: the request form, and your exit queue with whatever is ready to claim. On a wide screen the form sits on the right; on a phone it comes after the queue.

## Ready to claim

When ETH is ready, the **Ready to claim** card at the top of the screen shows the total and how many requests it comes from. **Claim** pays out a single request; with several, **Claim all** claims them together in one transaction. See [Claim](#claim) below.

## Request an exit

The **Unstake** form holds the request:

- The **Shares** and **ETH** switch beside the heading sets the unit you type in. In ETH, the app converts the amount to Vault shares at today's share price and shows the shares under the field. Switching clears the amount.
- **You exit** takes the amount, with what is **Available** (shares that are not locked and not already in an exit request), **MAX**, and quick choices of **25%**, **50%**, **75%** and **All**. Under the field is the ETH value at today's share price. Before you enter an amount, the same line says how many of your shares are locked until their lock matures, or, with none locked, that locked shares and shares already exiting are not available.
- **Route** offers **Through Definica** or **Directly at the Vault** (see the table below).
- Once you enter an amount, three rows show where the ETH comes from: **From available liquidity**, the part the Vault's available liquidity covers; **After validator exits**, the part that waits for validators to exit, shown only when there is one; and **Expected wait**, an estimate, not a promise.
- A note repeats that shares in an exit request keep earning rewards, and bearing any penalties, until the Vault burns them.

The button reads **Request exit of … shares** with the number of shares.

| Route | How it works |
|---|---|
| Through Definica | Definica holds the exit for you, in DefinicaCore. A partial claim pays what is ready and keeps the rest for later: a [managed partial claim](/glossary#managed-partial-claim). |
| Directly at the Vault | The exit goes to your own address at the Vault, and you claim it there. A partial claim issues a new [position ticket](/glossary#position-ticket) for the rest. |

### Checks on the amount

| Message | Cause |
|---|---|
| Enter a number. | The amount is not a number |
| That is more than your available shares. | The amount exceeds your available shares. When some of your shares are locked, the message adds that locked shares can exit once their lock matures. |
| There are no shares to exit. | The connected account holds no position |
| Leave about … ETH for the network fee. | Your wallet holds too little ETH to pay the network fee |

### The review

The button opens the review in the form's place. It shows the shares you give and the estimated ETH you get, then how your **Available shares** and the shares **In the exit queue** change, before and after, and these rows:

| Row | What it tells you |
|---|---|
| Route | Through Definica, or Directly at the Vault |
| Estimated ETH | The shares' value at today's share price; the amount paid follows the Vault's accounting |
| From available liquidity | The part of the request the Vault can serve from available liquidity |
| After validator exits | The part that waits for validator exits, when there is one |
| Expected wait | The app's estimate of the wait before the ETH can be claimed |
| Partial claims | Through Definica, the rest of the exit is kept for later; directly at the Vault, a new ticket is issued for the rest |
| Network fee | The estimated cost of the transaction, in ETH on Ethereum |

Two notes follow: queued shares keep earning rewards, and bearing any penalties, until the Vault burns them, and a request can't be cancelled once it is in the queue. You tick an acknowledgement that the request can't be cancelled, that it may wait for validator exits before the ETH is claimable, and that queued shares keep earning and bearing penalties until they are burned. Then you confirm and sign in your wallet. The result, **Exit requested**, confirms that the request is in the exit queue; this screen and Home show when the ETH is ready to claim.

## Follow the exit queue

The **Exit queue** card lists the connected account's requests, newest first, with their number. Each row shows the shares, the request's state, the estimated ETH, the request date and the route.

| State | What it means | Action |
|---|---|---|
| In the queue | The request is waiting for the Vault to process it | None |
| Waiting for validator exits | The Vault's available liquidity did not cover the request, so it waits for validators to exit | None |
| Partly claimable | Part of the ETH is ready, and the rest follows | **Claim** the ready part |
| Ready to claim | All of the ETH is ready | **Claim** |
| Claimed | The ETH has been paid out; the row shows the amount and the date | None |

### Progress and estimates

Each open request has a progress bar and a line under it: **Claimable in about …**, counting down, an estimate that depends on harvests and validator exits; **Part is ready now; the rest in about …** for a partly claimable request (or **the rest follows as validators exit** when there is no estimate); **The ETH is ready.**; or **Not estimated yet.** when no estimate is available. After a partial claim, the row also shows the ETH claimed so far.

When a request is ready, **Needs you** on Home, the bell and the hexagon sheet on a phone list the exits ready to claim, with a **Claim** or **Claim all** button that opens this screen, and a badge on Unstake counts them.

## How exits settle

The **How exits settle** card shows three figures:

- **Available liquidity now.** ETH the Vault can pay without waiting for validators.
- **Wait when validators must exit.** The Vault's current estimate of that wait, or **Not estimated**.
- **Next harvest.** When the Vault next processes requests.

A request becomes claimable once the Vault has processed it and the Vault's [claim delay](/glossary#claim-delay) has passed. The Vault processes requests at a [harvest](/glossary#harvest): from [unbonded ETH](/glossary#unbonded-eth) and new deposits where it can, and from validator exits otherwise. When validators must exit, the timing depends on Ethereum's [validator exit queue](/glossary#validator-exit-queue), which Definica does not control. Any time the app shows is an estimate, not a promise. See [Exit queue](/concepts/exit-queue).

## Claim

**Claim** opens straight on the review, as a sheet on a phone or a dialog on a wide screen, titled **Claim exit**, or **Claim exits** when **Claim all** covers several requests. The review shows the ETH you get, how the ETH **Ready to claim** and your **Vault shares** change, and these rows:

| Row | What it tells you |
|---|---|
| Request or Requests | The request date, or the number of requests claimed together |
| Route | Through Definica, or Directly at the Vault |
| Partial claim | Shown when only part of a request is ready: the rest stays in the queue |
| Paid to | Your wallet |
| Network fee | The estimated cost of the transaction, in ETH on Ethereum |

Confirm **Claim … ETH** and sign in your wallet, or choose **Cancel**. The result, **Claimed**, confirms that the ETH is in your wallet and the exited shares have left your position.

How the claim settles depends on the route:

- **Through Definica.** Core claims from the Vault and settles your position. If only part of the request has been processed, the processed part is paid and the rest stays in your exit position for later settlement: a [managed partial claim](/glossary#managed-partial-claim). Its row in the exit queue then shows the ETH claimed so far.
- **Directly at the Vault.** You claim at the Vault with your [position ticket](/glossary#position-ticket), through `claimExitedAssets(positionTicket, timestamp, exitQueueIndex)`. A partial claim issues a new ticket for the remainder.

## What you can verify

- `withdrawableAssets()` on the Vault, before you request: how much the Vault can serve from unbonded ETH.
- `getExitQueueIndex(positionTicket)` and `calculateExitedAssets(receiver, positionTicket, timestamp, exitQueueIndex)` on the Vault, after you request: where the request stands and how much of it has exited.

## Related

- [Exits and withdrawals](/phase-1/exits-and-withdrawals)
- [Exit queue](/concepts/exit-queue)
- [Share locks](/app/share-locks)
- [Staking and validator risk](/risks/staking-and-validator)
