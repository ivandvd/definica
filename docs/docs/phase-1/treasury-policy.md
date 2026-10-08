---
title: 'Treasury policy'
description: 'How Definica''s multisig can raise the value of every Vault share by donating ETH or burning its own shares, with the maths and worked examples.'
sidebar_position: 6
---

# Treasury policy

Definica's [multisig](/glossary#multisig) can raise the value of every remaining Vault share in two ways: donate ETH to the Vault through Core's [donator role](/glossary#donator-role), which adds assets without minting shares, or burn Vault shares it owns, which reduces supply without removing assets. Both are discretionary and budget-dependent, and neither is a guaranteed APY.

## The two formulas

Let `A` be the Vault's accounted assets, `S` its total shares (greater than zero) and `P = A / S` the asset value per share. An [ETH donation](/glossary#eth-donation) of `D` gives `P_after = (A + D) / S`, and a [treasury share burn](/glossary#treasury-share-burn) of `B` shares gives `P_after = A / (S − B)`.

| | ETH donation | Treasury share burn |
|---|---|---|
| Condition | `D` greater than 0 | `A` greater than 0 and `0 < B < S` |
| Formula | `P_after = (A + D) / S` | `P_after = A / (S − B)` |
| Effect | The absolute increase per share is `D / S` | The relative increase is `B / (S − B)` |
| How it is executed | The multisig, in Core's donator role, calls `donateAllAssets()` on Core, which calls `donateAssets()` on the Vault | The multisig calls `donateShares()` on the Vault directly; only the caller's shares are burned |
| When it counts | At the next successful harvest | Immediately: the burned shares' backing assets stay in the Vault |

These equations isolate the contribution before fees, unrelated rewards or losses, rounding and exit-queue changes.

## Worked examples

:::info[Illustrative numbers]
The numbers below show how the arithmetic works. They are not a forecast, a target or a record of any contribution.
:::

Start with `A = 1,000 ETH` and `S = 950 shares`, so `P = 1,000 / 950 = 1.05263 ETH per share`. A user holding 95 shares owns 10% of the Vault, worth 100 ETH.

**ETH donation of D = 10 ETH.**

```text
P_after              = (1,000 + 10) / 950 = 1.06316 ETH per share
increase per share   = 10 / 950          = 0.01053 ETH
the 95-share user    = 95 × 0.01053      ≈ +1.0 ETH (10% of the donation)
```

The user's proportion of the Vault is unchanged at 10%; each share is simply backed by more ETH. The increase appears at the next successful harvest, not when the ETH is sent.

**Treasury share burn of B = 50 shares.**

```text
P_after              = 1,000 / (950 − 50) = 1.11111 ETH per share
relative increase    = 50 / 900           = 5.56%
the 95-share user    = 95 / 900           = 10.56% of the Vault, worth about 105.6 ETH
```

Here the user's proportion rises because the total supply fell. A burn needs shares the multisig already owns: it uses the multisig's own deposits or fee allocations, never Core's user balances.

## Rules for contributions

- **Discretionary.** Treasury contributions are discretionary and budget-dependent. They never establish a guaranteed APY.
- **Funded by Definica.** Contributions come from protocol-owned revenue and an allocated treasury budget, and Definica's multisig executes them.
- **General, not targeted.** Donations benefit the remaining Vault shares generally, and returning fees this way is a rebate. A donation is never a payment to a particular user.
- **No lock bonus.** A Vault donation creates no exclusive bonus for lockers. Lock incentives for aEthosETH commitments have their own budget and allocation rules.
- **Not a buyback.** Vault shares are internal accounting units, not a conventional secondary-market buyback asset.
- **User balances untouched.** A burn uses only the multisig's own shares; the Vault burns only the caller's shares.

## Recognition at the next successful harvest

When ETH is donated, the StakeWise Vault records it as pending donated assets. At the next successful harvest the pending amount is added to the asset delta, and only then does it enter `A`. Until that harvest the share price does not reflect the donation. Donation recognition is part of the accounting covered by the [release evidence](/security/release-evidence).

## How contributions appear in your position

Treasury contributions are shown as their own component, separate from validator performance, and are never blended into a headline return. See [Positions and rewards](/phase-1/positions-and-rewards).

## What you can verify

- `AssetsDonated` and `SharesDonated` events on the Vault.
- The share price before and after the harvest that follows a donation.
- The multisig's address, as the holder of Core's donator role, and its signers and threshold, read from the multisig itself.

## Related

- [Treasury](/concepts/treasury)
- [Vault shares](/concepts/vault-shares)
- [Positions and rewards](/phase-1/positions-and-rewards)
