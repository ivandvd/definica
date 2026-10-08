---
title: 'Share locks'
description: 'Locking Vault shares for 7 to 365 days in the app, following each lock to maturity and releasing it, one at a time or all together.'
sidebar_position: 5
---

# Share locks

The Share locks screen, **Locks** in the app's navigation, lets you lock some of your Vault shares in DefinicaCore for 7 to 365 days, with up to 10 lock positions open at a time. It lists every lock with its maturity and releases matured locks back to your available shares. Locked shares stay in reward accounting throughout.

On a wide screen the **New lock** form sits on the right; on a phone it comes after your lock positions and **What a lock does**.

## At a glance

Four figures sit at the top of the screen.

| Figure | What it shows |
|---|---|
| Locked shares | The Vault shares under a lock that has not been released |
| Positions | Locks in use out of 10, with the free slots |
| Matured | Locks that have reached maturity and are ready to release |
| Next maturity | The date the next active lock matures, and the time left |

## Create a lock

The **New lock** card shows the range, 7 to 365 days, and how many of your 10 lock positions are in use:

- **You lock** takes the shares, with what is **Available** (shares not already locked and not in an exit request), **MAX**, and quick choices of **25%**, **50%** and **All**. Once you enter an amount, the line under the field gives the shares' value in ETH, still earning while locked.
- **Duration** offers quick picks of **7 days**, **30 days**, **90 days**, **180 days** and **1 year**, a slider, and a field for the number of days, from 7 to 365. The form starts at 90 days.
- **Unlock date will be set to** shows the maturity date for the chosen duration and the number of days, on a calendar page that turns over as you change the duration, with a reminder that at maturity you release the lock to use the shares again, and that there is no early unlock.

The button repeats the duration, for example **Lock for 90 days**.

### Lock limit reached

With all 10 positions in use, the card shows **Lock limit reached**: every lock position is taken, and releasing a matured lock opens a slot. The form is disabled and the button also reads **Lock limit reached**.

### Checks on the amount

| Message | Cause |
|---|---|
| Enter a number. | The amount is not a number |
| That is more than your available shares. | The amount exceeds your available shares |
| There are no shares to lock. Stake ETH first. | The connected account holds no position |
| Leave about … ETH for the network fee. | Your wallet holds too little ETH to pay the network fee |

### The review

The button opens the review in the form's place. It shows the shares you lock, how your **Available shares**, **Locked shares** and **Lock positions** (out of 10) change, before and after, and these rows:

| Row | What it tells you |
|---|---|
| Duration | The length of the lock, in days |
| Matures on | The maturity date |
| Reward accounting | Locked shares keep earning |
| Early unlock | Not available |
| Network fee | The estimated cost of the transaction, in ETH on Ethereum |

A caution repeats that locked shares can't exit before the lock matures, and that there is no early unlock. You tick an acknowledgement of both, and that locked shares stay in reward accounting throughout. Then you confirm with the button, such as **Lock for 90 days**, and sign in your wallet. The result, **Shares locked**, confirms that the lock is in place and gives its maturity date, counting down. **Add the date to your calendar** saves a reminder for the moment it matures: a calendar file that your calendar app opens.

## Lock positions

The **Lock positions** card lists your locks, matured ones first, then the rest by maturity date, with released locks last. Each shows the shares, the state, the duration, and the start and maturity dates. Until a lock is released, it also shows a progress bar towards maturity and the time left, counting down, with **Remind me** to save the same calendar reminder; or, once it has matured, **Ready to release. Until then the shares stay locked.**

| State | What it means | Action |
|---|---|---|
| Active | The lock runs until maturity; its shares keep earning | None until maturity |
| Matured | Maturity is reached; the shares stay locked until you release them | **Release** |
| Released | The shares are available again | None |

**Release** opens straight on the review, as a sheet on a phone or a dialog on a wide screen, titled **Release lock**. When more than one lock has matured, **Release all** at the top of the card releases them in one transaction, under **Release locks**. The review shows the shares you get back, how your **Available shares** and **Lock positions** change, the lock's duration, start date and maturity date (or the number of matured locks), and the network fee. Confirm **Release … shares** and sign in your wallet, or choose **Cancel**. The result, **Lock released**, confirms that the shares are available again, for an exit or a new lock.

Matured locks also show under **Needs you** on Home, in the bell and in the hexagon sheet on a phone, with a **Release** button that opens this screen, and a badge on Locks counts them.

## What a lock does

The **What a lock does** card sets out four rules:

- **Rewards continue.** Locked shares remain part of reward accounting: they earn and lose exactly as unlocked shares do. Rewards, and any treasury contribution, accrue to every share alike, so a lock earns no extra staking reward.
- **No early exit.** Locked shares cannot enter the exit queue before the lock matures, and the app offers no early unlock, including in adverse market, validator, protocol or security conditions.
- **Release is a step.** A matured lock needs the **Release** transaction before its shares are available again.
- **Up to ten at a time.** Each lock is its own position, with up to ten open at once. A released lock frees its slot.

A share lock concerns Vault shares. Commitments of aEthosETH in the [Liquidity Module](/app/liquidity-and-borrowing#liquidity-module) are separate and have their own rules; see [Share locks](/concepts/share-locks) under Concepts for a comparison.

## Related

- [How share locks work](/phase-1/share-locks)
- [Share locks](/concepts/share-locks) under Concepts
- [Unstake and the exit queue](/app/withdraw-and-exit-queue)
