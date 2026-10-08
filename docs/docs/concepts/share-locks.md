---
title: 'Share locks'
description: 'Share locks keep chosen Vault shares from exiting for 7 to 365 days, up to 10 positions, while the shares keep earning rewards.'
sidebar_position: 8
---

# Share locks

A [share lock](/glossary#share-lock) is an optional DefinicaCore feature of Phase 1: you commit chosen Vault shares not to exit for 7 to 365 days. Locked shares stay in reward accounting, and you can hold up to 10 open lock positions.

## How it works

1. **Lock.** Choose available shares and a duration of 7 to 365 days. Core records the lock with its shares, start and maturity.
2. **Active.** Until maturity the locked shares cannot be requested for exit. They keep earning rewards and bearing penalties exactly like unlocked shares.
3. **Matured.** At maturity the lock does not disappear. Core keeps matured, unclaimed locks apart from active ones.
4. **Released.** Releasing the lock, a claim on Core, returns the shares to your available balance, ready for an exit or a new lock, and frees a lock slot.

Core also keeps historical snapshots of lock positions for position analysis.

## What a lock does and does not do

- It does not change the share price or your proportion of the Vault.
- It offers no early exit to rely on. Unlocking before maturity may be impossible, even in adverse market, validator, protocol or security conditions.
- It earns nothing extra. Locked shares earn the same rewards as unlocked shares, and a Core lock carries no bonus, multiplier or governance right.
- It does not attract treasury contributions. A Vault donation benefits every remaining share and is not a bonus for lockers.

## Core locks and Phase 2 commitments

Core locks are separate from the aEthosETH [commitments](/glossary#commitment) of Phase 2.

| | Core share lock | aEthosETH commitment |
|---|---|---|
| Phase | Phase 1 | Phase 2 |
| What is locked | Vault shares recorded in Core | An aEthosETH supply position at Aave, committed to the Main Liquidity Module |
| Duration and limits | 7 to 365 days, up to 10 positions | Set by the Module and shown in the app before you confirm |
| Incentives | None | Where a [lock-incentive](/glossary#lock-incentives) programme runs, its own budget and rules |

## What you see in the app

The Share locks screen shows your locked shares, your open positions out of 10, matured locks waiting for release and the next maturity. Each lock is listed with its shares, duration, start and maturity dates, and state.

## What you can verify

Core's address is listed on the Contracts card of the Stake screen in the app, and shown again by your wallet before you sign; see [Verify addresses](/security/verify-addresses). Its lock records, with shares, start, maturity and state, are readable onchain.

## Related

- [Share locks in Phase 1](/phase-1/share-locks)
- [Share locks in the app](/app/share-locks)
- [Main Liquidity Module](/concepts/main-liquidity-module)
