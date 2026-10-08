---
title: 'Economics'
description: 'How attributable lending interest is split 75/25, why the split comes before financing costs, and worked examples, one of them negative.'
sidebar_position: 4
---

# Economics

Of the [attributable lending interest](/glossary#attributable-lending-interest) in Phase 3, 75% is allocated to the liquidity participant and 25% to Definica. Definica's share applies to attributable lending interest before upstream financing costs, not to deposited principal or net profit. Because your funding costs are subtracted after the split, your net result can be negative.

## The formulas

```text
I_u                          = lending interest allocated to the participant
Definica revenue             = 0.25 × I_u
User interest allocation     = 0.75 × I_u
Financed net lending result  = 0.75 × I_u − funding costs − other applicable costs
                               (calculate in consistent units)
```

Allocation follows attributable lending balance and accrual over time; LTV is a borrowing constraint. How much interest is attributable to you depends on how much lending balance you supplied and for how long, not on any LTV. Definica's share supports development, operations and budgeted treasury and incentive programmes.

## What the split does not apply to

| Not applied to | Why it matters |
|---|---|
| Deposited principal | Definica's share is never a cut of what you put in. |
| Net profit | The share is taken before your costs, so it does not shrink when your funding cost rises. |
| osETH staking return | That belongs to the osETH exchange rate and is reported separately. |
| Aave supply interest | That belongs to the aEthosETH balance and is reported separately. |
| Lock incentives | A separately funded programme with its own rules, reported without double counting. |

## Illustrative examples

:::warning[Invented numbers]
The amounts below are invented to show the arithmetic. They are not Definica rates, costs or forecasts.
:::

Over some period, a participant's attributable lending interest is `I_u = 1.00 ETH`. Definica receives `0.25 ETH`; the participant is allocated `0.75 ETH`.

**Example 1: funding cost below the allocation.**

```text
funding cost (variable interest on allocated Aave debt)   0.60 ETH
other applicable costs                                    0.05 ETH
net = 0.75 − 0.60 − 0.05                                 = +0.10 ETH
```

**Example 2: funding cost above the allocation.**

```text
funding cost                                              0.90 ETH
other applicable costs                                    0.05 ETH
net = 0.75 − 0.90 − 0.05                                 = −0.20 ETH
```

In Example 2 the participant loses money even though the market earned interest, and Definica's 0.25 ETH was still taken on the gross figure. Lending losses and funding costs can outweigh returns.

**Example 3: direct ETH supplier.** A direct supplier has no Aave funding debt, so the funding-cost term is zero and the result is `0.75 × I_u − other applicable costs`. Lending losses still apply.

## What reduces the return

| Cost | Where it comes from |
|---|---|
| Funding interest | The variable borrow rate on the borrowed reserve at Aave (WETH or another permitted asset), which rises steeply above the reserve's optimal utilisation |
| Aave liquidation | Collateral sold at a discount (the liquidation bonus), plus any protocol liquidation fee |
| Lending losses and bad debt | Phase 3 borrowers who are not fully liquidated in time |
| osToken fee | StakeWise's 5% on osETH rewards, accruing on minted positions (Entry B) |
| Gas | You may need to submit and pay for more than one transaction |
| Opportunity cost of a commitment | Lock expiry does not guarantee cash, and early unlocking may be impossible |
| Other applicable costs | Set out in the [Module rules](/phase-2/module-rules) and shown in the app before you commit |

## Where each return comes from

| Layer | Source |
|---|---|
| osETH exposure | StakeWise staking performance, through the osETH exchange rate |
| Aave supply | Variable supply interest in the aEthosETH balance |
| Phase 3 lending | 75% of attributable lending interest |
| Lock incentives | A separately funded programme, where one runs |
| Funding cost | Variable Aave borrow interest, reported as a negative line |

Each layer is reported on its own line, alongside staking and Aave supply income, without double counting. No blended figure is shown.

## Related

- [Funding loan](/phase-2/funding-loan)
- [Closing a financed position](/phase-3/closing-a-financed-position)
- [Borrowing risk](/risks/borrowing)
