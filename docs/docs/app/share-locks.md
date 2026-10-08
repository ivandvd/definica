---
title: 'Share locks'
description: 'Locking Vault shares for 7 to 365 days in the app, following each lock to maturity and releasing it once it matures.'
sidebar_position: 5
---

# Share locks

The Share locks screen lets you lock some of your Vault shares in DefinicaCore for 7 to 365 days, with up to 10 lock positions open at a time. It lists every lock with its maturity and releases matured locks back to your available shares. Locked shares stay in reward accounting throughout.

## At a glance

Four figures sit at the top of the screen.

| Figure | What it shows |
|---|---|
| Locked shares | The Vault shares currently under a lock |
| Open positions | Locks in use out of 10, with the free slots |
| Matured | Locks that have reached maturity and are ready to release |
| Next maturity | The date the next active lock matures, and the time left |

## Create a lock

The **New lock** card locks available shares for a fixed duration:

- **Shares to lock.** Up to your available shares: those not already locked and not in an exit request. MAX fills in all of them.
- **Duration.** A slider from 7 to 365 days, with quick choices of 7, 30, 90, 180 and 365 days.
- **Matures on.** The maturity date for the chosen duration, and the time from now.
- **Positions after this lock.** How many of your 10 lock positions will be in use.

The button repeats the shares and the duration. With 10 locks open the form is disabled and the card reads **Lock limit reached**: release a matured lock to open a slot.

### The review

The **Lock shares** review shows the shares to lock and the maturity date, then the duration, the reward accounting (locked shares keep accruing) and the lock positions in use. You tick an acknowledgement that locked shares cannot exit before the lock matures and that they stay in reward accounting throughout. Then you confirm, with a button such as **Lock for 90 days**, and sign in your wallet. The result, **Shares locked**, confirms that the lock is recorded in DefinicaCore.

## Lock positions

The **Lock positions** card lists your locks, matured ones first, then the rest by maturity date. Each shows the shares, the duration, the start and maturity dates and, until it is released, a progress bar. Matured locks are kept apart from active ones until you release them.

| State | What it means | Action |
|---|---|---|
| Active | The lock runs until maturity; its shares keep accruing | None until maturity |
| Matured | Maturity is reached; the shares stay locked until you release them | **Release** |
| Released | The shares are available again | None |

**Release** opens the **Release lock** review, which shows the matured shares returning to your available shares, with the lock and maturity dates. Confirm **Release shares** and sign in your wallet. The result, **Lock released**, confirms that the shares are available again for an exit or a new lock. The Overview also flags matured locks, with a **Release** button that opens this screen.

## What a lock does

- **Rewards continue.** Locked shares remain part of reward accounting: they earn and lose exactly as unlocked shares do. Rewards, and any treasury contribution, accrue to every share alike, so a lock earns no extra staking reward.
- **No early exit.** Locked shares cannot enter the exit queue before the lock matures, and the app offers no early unlock, including in adverse market, validator, protocol or security conditions.
- **Release is a separate step.** A matured lock needs the **Release** transaction before its shares are available.
- **Separate from Phase 2.** A share lock concerns Vault shares in Phase 1. Commitments of aEthosETH in the [Liquidity Module](/app/liquidity-and-borrowing#liquidity-module) have their own rules. See [Share locks](/concepts/share-locks) under Concepts for a comparison.

## Related

- [Share locks](/phase-1/share-locks) in Phase 1
- [Share locks](/concepts/share-locks) under Concepts
- [Withdraw and the exit queue](/app/withdraw-and-exit-queue)
