---
title: 'Exit queue'
description: 'An exit moves your shares into the Vault''s queue, waits for processing and the claim delay, then pays ETH when you claim.'
sidebar_position: 7
---

# Exit queue

To leave Phase 1 you move shares into the Vault's [exit queue](/glossary#exit-queue), wait for a harvest to process them and for the claim delay to pass, then claim your ETH in a separate transaction. DefinicaCore can manage the exit for you or route it to your own address at the Vault.

## Why there is a queue

Most of the Vault's ETH is staked in validators on the Beacon Chain, and Ethereum rate-limits validator exits, so the Vault cannot pay every exit at once. The queue matches exit requests with ETH as it becomes available.

## How it works

1. **Enter the queue.** `enterExitQueue(shares, receiver)` moves the chosen shares into the queue and returns a [position ticket](/glossary#position-ticket), which records your place in line and the amount requested. The receiver is the address that may later claim: Core for a managed exit, your own address for a direct one.
2. **Keep earning.** Queued shares keep earning rewards, and bearing penalties, until the Vault burns them.
3. **Processing.** At each harvest the Vault processes as much of the queue as its available ETH covers: it burns those queued shares, sets aside the matching ETH and records a checkpoint for your ticket.
4. **Claim delay.** A claim reverts until the Vault's claim delay has passed since you entered the queue. The delay is immutable, fixed when the Vault is constructed, and shown in the app before you confirm.
5. **Claim.** `claimExitedAssets(positionTicket, timestamp, exitQueueIndex)` pays the processed ETH, and only the receiver can call it. If only part of the position has been processed, the claim pays that part and issues a new ticket for the remainder.

## Where the ETH comes from

1. [Unbonded ETH](/glossary#unbonded-eth): ETH in the Vault that is not staked in validators. The amount withdrawable now is the Vault's balance minus assets already queued, exiting or unclaimed.
2. New deposits, which cover the exit queue before they fund new validators.
3. Validator exits. The operator starts them; if it has not freed enough ETH within StakeWise's 24-hour `force_withdrawals_period`, the Oracles force validator exits.

## Timing

Definica does not promise an exit time. When an exit needs validator exits, it depends on Ethereum's [validator exit queue](/glossary#validator-exit-queue): exits are capped per [epoch](/glossary#epoch) by a churn limit, an exited validator becomes withdrawable only 256 epochs later, and the withdrawal sweep pays at most 16 withdrawals per block. Depending on how many validators are leaving, such an exit can take hours or weeks. See [Staking and validator risk](/risks/staking-and-validator).

## Managed and direct exits

| Route | Receiver | Claim |
|---|---|---|
| Managed through Core | Core | Core claims and settles your position; a [managed partial claim](/glossary#managed-partial-claim) keeps the remainder open. |
| Direct at the Vault | Your address | You claim at the Vault. |

You choose the route on the Unstake screen in the app, where the two routes read **Through Definica** and **Directly at the Vault**.

## What it means for you

- The ETH you receive follows the share price when your shares are burned, not when you made the request.
- An exit takes at least two transactions, the request and the claim, and a partial claim adds more.
- The queue position and timing the app shows are estimates.
- Locked shares cannot enter the queue until their lock matures; see [Share locks](/concepts/share-locks).

## What you can verify

- `withdrawableAssets()` on the Vault: how much unbonded ETH can serve exits now.
- `getExitQueueIndex(positionTicket)` and `calculateExitedAssets(receiver, positionTicket, timestamp, exitQueueIndex)`: the state of a ticket.
- The claim delay, read from the Vault.

## Related

- [Exits and withdrawals](/phase-1/exits-and-withdrawals)
- [Unstake and the exit queue](/app/withdraw-and-exit-queue)
- [Market and liquidity risk](/risks/market-and-liquidity)
