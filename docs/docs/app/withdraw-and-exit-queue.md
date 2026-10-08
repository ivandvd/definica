---
title: 'Withdraw and the exit queue'
description: 'Requesting an exit for available shares, choosing a route, following each request in the exit queue and claiming the ETH.'
sidebar_position: 4
---

# Withdraw and the exit queue

Withdrawing takes two transactions with a wait between them. **Request exit** places Vault shares in the Vault's [exit queue](/glossary#exit-queue), and **Claim** pays out the ETH once the request is claimable. The Withdraw screen has a tab for each step: **Request exit** and **Exit queue**.

## Request an exit

The **Request exit** tab holds the exit form:

- **Shares to exit.** The number of Vault shares to exit, with the shares available, a MAX button and quick choices of 25%, 50% and All. Available shares exclude locked shares and shares already in an exit request; the field notes how many of your shares are locked until their lock matures.
- **Route.** Managed through Core, or Direct at the Vault (see the table below).
- **Estimated ETH.** The value of the shares at today's share price. The amount you receive follows the Vault's accounting when the request is processed.

| Route | How it works |
|---|---|
| Managed through Core | DefinicaCore holds the exit position. A partial claim keeps the remainder for later settlement. |
| Direct at the Vault | The exit is routed to your address at the Vault and claimed there. |

Beside the form, **How exits settle** explains that an exit may use the Vault's available liquidity or require validator exits first, and that either way the request waits in the exit queue until it is claimable.

### The review

The button repeats the number of shares and opens the **Request exit** review. It shows the shares to exit and the estimated ETH, then:

| Row | What it tells you |
|---|---|
| Route | Managed through DefinicaCore, or Direct at the Vault |
| Estimated ETH | The shares' value at the current share price |
| Settlement | Available liquidity, or validator exits |
| Partial claims | Managed: the remaining exit position is kept. Direct: claimed at the Vault |

You tick an acknowledgement that the exit may wait on available liquidity or validator exits before the ETH becomes claimable, then confirm and sign in your wallet. The result, **Exit requested**, confirms that the request is in the exit queue. A request cannot be cancelled once it is in the queue.

## Follow the exit queue

The **Exit queue** tab lists the connected account's requests, newest first, with their number shown on the tab. Each row shows the shares and their estimated ETH, the request date, the route and the request's state.

| State | What it means | Action |
|---|---|---|
| Queued | The request is waiting in the exit queue; the app shows the estimated time until it becomes claimable | None |
| Claimable | The ETH is ready | **Claim** |
| Claimed | The ETH has been paid out | None |

When a request is claimable, the Overview also shows how many exits are ready to claim, with a **Claim** button that opens this tab.

### What sets the timing

A request becomes claimable once the Vault has processed it and the Vault's claim delay has passed. The Vault processes requests at a [harvest](/glossary#harvest): from [unbonded ETH](/glossary#unbonded-eth) and new deposits where it can, and from validator exits otherwise. When validators must exit, the timing depends on Ethereum's [validator exit queue](/glossary#validator-exit-queue), which Definica does not control. Any time the app shows is an estimate, not a promise. See [Exit queue](/concepts/exit-queue).

## Claim

**Claim** opens the **Claim exit** review: the shares of the exit position, the ETH you receive, the request date and the route. Confirm **Claim ETH** and sign in your wallet. The result, **Claimed**, confirms that the ETH is in your wallet and the shares have left your position.

How the claim settles depends on the route:

- **Managed through Core.** Core claims from the Vault and settles your position. If only part of the request has been processed, the processed part is paid and the remaining exit position is kept for later settlement: a [managed partial claim](/glossary#managed-partial-claim).
- **Direct at the Vault.** You claim at the Vault with your [position ticket](/glossary#position-ticket), through `claimExitedAssets(positionTicket, timestamp, exitQueueIndex)`. A partial claim issues a new ticket for the remainder.

## What you can verify

- `withdrawableAssets()` on the Vault, before you request: how much the Vault can serve from unbonded ETH.
- `getExitQueueIndex(positionTicket)` and `calculateExitedAssets(receiver, positionTicket, timestamp, exitQueueIndex)` on the Vault, after you request: where the request stands and how much of it has exited.

## Related

- [Exits and withdrawals](/phase-1/exits-and-withdrawals)
- [Exit queue](/concepts/exit-queue)
- [Share locks](/app/share-locks)
- [Staking and validator risk](/risks/staking-and-validator)
