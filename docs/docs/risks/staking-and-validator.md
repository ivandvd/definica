---
title: 'Staking and validator risk'
description: 'Rewards depend on validator performance: penalties and slashing lower every share''s value, and exit timing depends on Ethereum.'
sidebar_position: 1
---

# Staking and validator risk

A Phase 1 position is a proportional claim on a Vault whose ETH is staked in Ethereum validators run by an operator. When those validators perform well the share price rises; when they miss duties, are penalised or are slashed it falls, and the loss is spread across every share in the Vault. Getting ETH back out depends on Ethereum's own validator exit process, whose timing nobody controls.

## What can go wrong

| Event | Cause | Effect on the Vault |
|---|---|---|
| Missed attestations | Validator offline or late | A penalty equal to the reward the attestations would have earned |
| Missed proposals | Validator offline at its slot | Forgone block reward and MEV |
| Inactivity leak | The chain fails to finalise for more than four epochs | Growing penalties on inactive validators until finality returns |
| [Slashing](/glossary#slashing) | Double block proposal, surround vote or double vote | An immediate penalty, ejection from the validator set, and a further penalty that scales with how many other validators were slashed around the same time |

A slashed validator loses an initial amount at once (0.0078125 ETH for a 32 ETH validator, scaled with its balance) and is then removed over 36 days. At the midpoint, day 18, a further penalty applies whose size scales with the total stake of all validators slashed in the previous 36 days. Losses range from under 0.1% of stake for a validator slashed on its own to the whole stake in a mass, correlated event. Ethereum's documentation notes that slashing is very difficult to trigger without deliberate misbehaviour, so the weight of this risk falls on the operator's competence and setup.

## How losses pass through

In StakeWise's design, rewards and penalties are contained within each Vault: Definica's Vault is not affected by other Vaults' validators, and other Vaults are not affected by its validators. Inside the Vault, losses are pooled. The [Keeper](/glossary#keeper) reports a negative reward at the next [harvest](/glossary#harvest), total assets fall, and every share, locked or not, is worth less.

Pooled staking also concentrates stake with the [operator](/glossary#operator) who runs the nodes. A dishonest or incompetent operator can censor transactions, extract value or become a single point of failure. The app shows the operator alongside the Vault's details, and the Vault's `validatorsManager()` returns the address that runs its validator operations.

## Exit timing

Ethereum rate-limits validator exits. The [validator exit queue](/glossary#validator-exit-queue) processes exits at a limited rate each [epoch](/glossary#epoch), the churn limit. An exited validator becomes withdrawable 256 epochs later; at 6.4 minutes per epoch, that is about 27 hours. Withdrawals are then paid by a sweep that processes at most 16 withdrawals per block, about 115,200 a day: a full sweep of 400,000 validators takes about 3.5 days, and of 800,000 about 7 days.

A withdrawal that the Vault cannot serve from its [unbonded ETH](/glossary#unbonded-eth) waits on all of this. Depending on how many validators are exiting at the time, it can take hours or weeks. Any wait time the app shows is an estimate.

## What Definica controls, and what it does not

| Definica and its operator control | Outside Definica's control |
|---|---|
| Choice and oversight of the operator | Ethereum's reward rate, penalties and churn limit |
| The Vault fee and MEV configuration | The length of the validator exit queue |
| When validators are exited to serve the exit queue | The Oracles' 12-hour reporting cadence |

## What you can verify

- The operator, shown alongside the Vault's details in the app, its track record, and the Vault's `validatorsManager()`.
- The Vault's fee and MEV configuration: `feePercent()` and the [MEV escrow](/glossary#mev-escrow) it uses, returned by `mevEscrow()`.
- `Keeper.isCollateralized(vault)` and the time of the last harvest.
- The Oracle set selected by the StakeWise DAO: 11 nodes, with 6 of 11 signatures needed for a reward update.
- The Vault's `withdrawableAssets()` before you request an exit.
- That any queue time shown is marked as an estimate.

## Related

- [Exits and withdrawals](/phase-1/exits-and-withdrawals)
- [Keeper and harvests](/concepts/keeper-and-harvests)
- [Oracle risk](/risks/oracle)
