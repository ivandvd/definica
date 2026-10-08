---
title: 'Module rules'
description: 'The rules the Main Liquidity Module applies to commitments, custody, financing, incentives and reporting.'
sidebar_position: 6
---

# Module rules

The Main Liquidity Module applies the rules below to every position, and each rule is set by the Module and shown in the app before you commit.

## Commitment

| Rule | What it determines |
|---|---|
| Accepted receipts | Which aEthosETH receipts you already hold can be committed directly, without a new supply |
| Commitment durations | The fixed durations you can choose |
| Commitment amounts | The minimum and maximum you can commit |
| Capacity | The total the Module accepts across all commitments |
| Early release | Whether a commitment can end before maturity, and on what conditions |
| Withdrawal conditions | What must be true for a commitment to be released and the position withdrawn |
| Maturity | The claim or accounting action that settles a commitment when it ends |

## Custody and financing

| Rule | What it determines |
|---|---|
| Custody | How the Module records custody of each committed position |
| Financing consent | A funding loan is taken only with your explicit authorisation; a commitment alone creates no debt |
| Aave market and eMode | The Aave V3 Ethereum market and the eMode category a funding loan uses |
| Permitted borrow assets | WETH or another permitted asset, subject to the market's eMode, liquidity and caps |
| Allocated debt | The share of the funding loan recorded against your position, and its cost |
| Health-factor monitoring | How the Module watches the loan's health factor and responds as it falls, including in a liquidation |

## Incentives

| Rule | What it determines |
|---|---|
| Lock-incentive programme | Where a programme runs, its budget, asset, duration, eligibility and allocation rules; the programme is funded separately |
| Lock-duration multiplier | Where one applies, incentive-allocation weight only; it does not multiply validator rewards or market interest |

## Accounting and reporting

| Rule | What it determines |
|---|---|
| Separate reporting | osETH staking exposure, Aave supply interest, allocated debt and its funding cost, Phase 3 interest allocation and incentives, each on its own line |
| Interest allocation | Of the lending interest attributable to you, 75% is allocated to you and 25% to Definica, before financing costs |
| Other applicable costs | The costs, beyond funding costs, deducted in the net-result formula |

## What always holds

Whatever the rules above are set to, three statements hold:

- aEthosETH does not create a second ETH deposit or duplicate the osETH staking return.
- Locking aEthosETH does not make it collateral.
- Lending losses and funding costs can outweigh returns.

## Related

- [Main Liquidity Module](/concepts/main-liquidity-module)
- [Funding loan](/phase-2/funding-loan)
- [Economics](/phase-3/economics)
- [Release evidence](/security/release-evidence)
