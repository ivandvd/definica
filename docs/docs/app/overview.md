---
title: 'Using the app'
sidebar_label: 'Overview'
description: 'What the Definica app is for, how its seven sections are organised, and the review step behind every transaction.'
sidebar_position: 1
slug: /app
---

import DocCardList from '@theme/DocCardList';

# Using the app

The Definica app at [definica.com/app](https://definica.com/app) is where you stake ETH, follow your position, manage exits and share locks, and use the Liquidity Module and the borrowing markets. It reads your position from the chain and prepares each transaction for you to sign in your own wallet; it never takes custody of your ETH or shares.

## How the app is organised

The app has seven sections. Stake, Withdraw and Share locks cover Phase 1, pooled ETH staking. The Liquidity Module covers Phase 2, and Borrow covers Phase 3, the borrowing markets.

| Section | What you do there |
|---|---|
| Overview | See your position, its return layers and anything waiting on you |
| [Stake](/app/stake) | Deposit ETH through DefinicaCore and receive Vault shares |
| [Withdraw](/app/withdraw-and-exit-queue) | Request an exit for available shares, then claim the ETH |
| [Share locks](/app/share-locks) | Lock shares for 7 to 365 days and release matured locks |
| [Liquidity Module](/app/liquidity-and-borrowing#liquidity-module) | Supply osETH to Aave, commit the aEthosETH position and authorise financing |
| [Borrow](/app/liquidity-and-borrowing#borrow) | Compare the borrowing markets and manage your borrow position |
| [Activity](/app/activity) | Review every deposit, exit, lock and reward of your account |

On a computer the sections sit in the sidebar on the left, with links to the Roadmap, this documentation and definica.com. On a phone the tab bar at the bottom holds Home, Stake, Locks and Activity, and the Definica mark in its centre opens the full list. The top bar shows the network, Ethereum, and your wallet button.

## The Overview screen

The Overview is the app's home. Without a wallet it opens with an introduction to staking and the **Connect wallet** and **Explore staking** buttons. The Vault's figures and a summary of the three phases, with a link to the Roadmap, are visible to anyone. Once you connect, your position card and the Queue and locks card appear; if the account holds no position, the position card offers a **Stake ETH** button instead.

| Card | What it shows |
|---|---|
| Your position | Value in ETH, lifetime rewards and available shares (with the number locked), your Vault shares and the ETH you deposited, and a chart of the value over one week, one month or three months |
| Your layers | Staking performance, Aave supply interest and Definica incentives, each on its own line with the phase that manages it, never blended into one number |
| Actions | Stake, Withdraw and Lock, plus a prompt when an exit is ready to claim or a lock has matured |
| Queue and locks | Your exit requests and how many are claimable, and your open share locks out of 10 with the next maturity |
| Vault | The network and operator, capacity used, the share price and its change over 30 days, fees as a share of rewards, and the minimum deposit |
| Recent activity | Your five latest events, with a link to the full [Activity](/app/activity) list |

A note at the foot of the screen sets out that there is no guaranteed return: staking rewards depend on validator performance, the Phase 2 and Phase 3 layers depend on market conditions, and treasury contributions to the Vault are discretionary and do not establish an APY.

## How every transaction works

Every action in the app, from staking to releasing a lock, runs through the same dialog in four steps.

1. **Review.** The dialog is named after the action, for example **Stake ETH**. It shows what goes in and what comes out, then the conditions that apply. Some actions ask you to tick an acknowledgement before the confirm button becomes active. **Cancel** closes the dialog without sending anything.
2. **Wallet.** The dialog reads **Confirm in your wallet**. Check the contract, network and amount in your wallet, then approve or reject the request there.
3. **Pending.** Once you sign, the dialog reads **Transaction submitted** while the network confirms the transaction. The dialog stays open through this step and the one before.
4. **Result.** On success the dialog names the outcome, for example **Staked**, repeats the summary and links to the transaction on Etherscan. If you reject the request or the transaction fails, it reads **Something went wrong** with the reason, and **Try again** returns you to the review.

When a transaction completes, the app reloads your position, exit requests, locks and activity.

## What the app always shows you

- **The conditions before you confirm.** For a deposit, the Vault's capacity, fees and minimum deposit appear on the screen and again in the review. Every other action lists its own conditions in the same place.
- **Each return layer on its own.** Staking performance, Aave supply interest and incentives are never blended, and the app shows no headline APY.
- **The contracts behind your position.** The Contracts card on the Stake screen lists DefinicaCore, the Staking Vault and StakeWise's Keeper with their addresses, and your wallet shows the address again before you sign. See [Verify addresses](/security/verify-addresses).
- **Your signature on every action.** The app prepares transactions; only your wallet can send them.

## In this section

<DocCardList />
