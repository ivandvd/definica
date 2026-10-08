---
title: 'Using the app'
sidebar_label: 'Overview'
description: 'How the Definica app is organised on a wide screen and on a phone, the Home screen, the steps behind every transaction and the states that apply across the app.'
sidebar_position: 1
slug: /app
---

import DocCardList from '@theme/DocCardList';

# Using the app

The [Definica app]({{APP_URL}}) is where you stake ETH, follow your position, unstake, and lock and release Vault shares. It reads your position from the chain and prepares each transaction for you to sign in your own wallet; it never takes custody of your ETH or shares.

## How the app is organised

Stake, Unstake and Locks cover pooled ETH staking. Liquidity and Borrow, for the Liquidity Module and the borrowing markets, are listed under **Next** with a **Coming soon** label, and each opens a short page on what it does.

| Section | What you do there |
|---|---|
| [Home](#the-home-screen) | See your position, what needs you, your layers and the Vault |
| [Stake](/app/stake) | Deposit ETH and receive Vault shares |
| [Unstake](/app/withdraw-and-exit-queue) | Request an exit for available shares, follow the exit queue and claim the ETH |
| [Locks](/app/share-locks) | Lock shares for 7 to 365 days and release matured locks |
| [Activity](/app/activity) | Review every stake, exit, lock and reward of your account, and export it |
| [Settings](#settings) | Your wallet, how figures show, the data kept on this device, help and legal |
| [Liquidity](/app/liquidity-and-borrowing#liquidity-module) | A short page on the Liquidity Module, under **Next** |
| [Borrow](/app/liquidity-and-borrowing#borrow) | A short page on the borrowing markets, under **Next** |

### On a wide screen

The sidebar on the left lists Home, Stake, Unstake, Locks and Activity, then **Next** with Liquidity and Borrow, and at its foot **Settings** and **Docs**. A badge on Unstake counts the exits ready to claim, and one on Locks the locks that have matured.

The top bar shows how fresh the figures are, as **Live · updated … ago**, then the network pill, **Ethereum**, the notifications bell and your wallet button. The footer links to the Docs, the Roadmap, Telegram, X, the Terms and the Privacy Policy.

### On a phone

The top bar holds the Definica mark, which returns to Home, the network, the bell and your wallet button. The tab bar at the bottom holds **Home**, **Stake**, the Definica hexagon, **Activity** and **Settings**.

The hexagon opens a sheet, **Where to?**, that lists Stake, Unstake, Locks and Activity, then Liquidity and Borrow marked **Coming soon**, with anything ready to collect on top: an exit to claim or a lock to release, each with its button. A dot on the hexagon tells you something is waiting. Stake, Unstake and Locks share a switch at the top of each of those screens, with the same badges as the sidebar. The phone layout also applies to a narrow window on a computer.

### Notifications

The bell gathers what needs you, such as exits ready to claim and locks that have matured, and the transactions of this visit, including those still in progress, each with its state: **Waiting for your wallet**, **Pending on the network**, **Updating**, then the outcome. **View** on a transaction opens its [receipt](#receipts), and **All activity** opens the Activity screen. A badge on the bell counts what needs you and any transaction still on its way, and spins while one is. Without a wallet, the bell asks you to connect one.

## The Home screen

Without a wallet, Home opens with **Stake ETH. Put it to work.** and two buttons, **Connect wallet** and **Explore staking**, which opens the Stake screen. Below are **How it works** in three steps (**Stake**; **Earn, or lock**; **Unstake**), a note that no return is guaranteed, and the Vault card.

Once you connect, Home shows your position.

| Card | What it shows |
|---|---|
| Your position | Its value in ETH or in Vault shares, lifetime rewards, the ETH deposited, a chart, and the Available, Locked, In the exit queue and Share price figures. See [Your position](#your-position) below. |
| Needs you | Exits ready to claim and locks that have matured, each with its button (**Claim**, **Claim all** or **Release**), or a line saying nothing is waiting |
| Your layers | Vault shares, with **Stake more**, **Unstake** and **Lock shares** in its menu, then the Liquidity Module and Borrowing, each marked **Coming soon**. Each layer is on its own line, never added together. |
| Where your return comes from | Staking rewards, treasury contributions and penalties, each on its own line with what it is. Definica never blends them into one rate. |
| Quick actions | **Stake**, **Unstake**, **Lock** and **Activity** |
| Vault | The Vault's name, network and operator, whether it is **Active** or **Activating**, the capacity used, the share price and its change over 30 days, fees as a share of rewards (the Vault's and Definica's), the minimum deposit and the next harvest |
| Recent activity | Your five latest entries, with **All** opening [Activity](/app/activity) |

A note at the foot of the screen repeats that no return is guaranteed: rewards depend on validator performance, and the app never shows a projected rate. It links to [Risks](/risks).

### Your position

- The eye beside **Your position** masks every amount of your own; select it again to show them. **Hide balances** in Settings does the same.
- **Show shares** and **Show ETH** switch the headline between the value in ETH and your Vault shares. Settings has the same choice, under **Your position in**.
- Under the headline are your lifetime rewards and the ETH you have deposited.
- **Next harvest** counts down, in hours, minutes and seconds, to the next harvest, when rewards reach every share; the ring beside it fills through the 12-hour cycle. When it reaches zero, your position updates by itself.
- The chart draws the position's value in steps, because values move at harvests and transactions, not continuously. **1W**, **1M**, **3M** and **All** set the range. The figure above the chart is what the position earned over that range, never deposits counted as gains. Hover over or touch the chart to read any point. A new position's chart starts at its first harvest.
- **Available** shares are free to exit or lock. **Locked** shares and shares **In the exit queue** are still earning. **Share price** is the ETH value of one Vault share, with its change in 30 days.

Without a position, the card reads **No position yet** and offers a **Stake ETH** button.

## How every transaction works

Every action runs through the same steps. Staking, requesting an exit and locking shares run inside their form's card: the review takes the form's place, and **Back** returns to it. Claims and releases start from a list, so they open straight on the review, as a sheet on a phone or a dialog on a wide screen, titled after the action (for example **Claim exit**), with **Cancel** in place of **Back**.

1. **Review.** At the top, **You give** and **You get**, or only one of them when the action moves one way. Then the figures the action changes, before and after; the conditions that apply; the **Network fee**, estimated in ETH on Ethereum; and any warnings. When your wallet will ask more than once, the review lists each request, marked as a signature with no fee or a transaction with a fee. Some actions ask you to tick an acknowledgement before the confirm button turns on. The button names the action and the amount, for example **Stake 1.25 ETH**; on another network it reads **Switch to Ethereum first** and stays off. If something stops the action, the review reads **This can't go through as it is**, gives the reason and keeps the button off.
2. **Confirm in your wallet.** The pane asks you to check the amount and the network in your wallet, then confirm; you approve or reject the request there. A request for a signature, which costs no network fee, reads **Sign in your wallet** instead. When there are several requests, the pane shows which step of how many you are on. On a phone, approve in your wallet app, then come back to the app's tab.
3. **Transaction submitted.** Once you confirm, the pane shows the transaction as submitted, with how long ago, while the network confirms it, and **View transaction** opens its receipt. You can leave with **Close and keep going**: the transaction carries on, and the bell lists it while it is in progress.
4. **Updating your position.** The transaction is confirmed and the app reads your new position from the chain.
5. **Result.** The pane names the outcome, for example **Staked**, **Exit requested**, **Claimed**, **Shares locked** or **Lock released**, repeats the summary and offers **View transaction**. A notification confirms the transaction as well, with its own **View transaction**; on a phone it appears once you have moved away from the transaction, since the result already fills the screen.

If the request does not go through, the pane says why:

- **Request rejected.** You declined the request in your wallet, so nothing was sent.
- **Transaction failed.** The transaction reverted onchain. Nothing moves except the network fee, which is spent, and **View transaction** opens its receipt.
- **Couldn't reach the network** or **Something went wrong**, with the reason.

**Try again** returns you to the review, and **Close** returns you to the form with your entries kept, or closes the sheet. If you had already left the transaction, a notification reports the failure instead.

When a transaction completes, the app reloads your position, exit requests, locks and activity. It also refreshes every figure once a minute while it is open, and whenever you return to its tab.

### Receipts

Every transaction has a receipt, titled **Transaction**. It opens from **View transaction** on the result or in the notification, from a transaction in the bell, and from an entry in [Activity](/app/activity) or under **Recent activity** on Home. The receipt shows what the transaction did and its status (**Confirmed**, **Pending** or **Failed**), the amount, the date, the network, the block and the network fee once they are known, the address it came from and **Definica** as its destination, and the transaction hash with a button to copy it. **View on Etherscan** opens the transaction on the block explorer.

## What the app always shows you

- **The conditions before you confirm.** Each review lists what applies to the action: for a deposit, the Vault, the share price, the fees, the minimum deposit and the capacity left; for an exit, the route, the estimated ETH and the expected wait. Values that are set per Vault are shown there before you confirm.
- **What changes.** Each review shows the figures the action changes, before and after, and the estimated network fee.
- **Each return layer on its own.** Staking rewards, treasury contributions and penalties are never blended, and the app shows no projected rate or APY.
- **How fresh the figures are.** The top bar says when the figures were last read, and confirming pauses when they are out of date.
- **Your signature on every action.** The app prepares transactions; only your wallet can send them. Check the contract, network and amount your wallet shows before you approve; [Verify addresses](/security/verify-addresses) sets out how to check a Definica address.

## States across the app

Some states apply to every screen. They show as a banner above the screen, or stop everything else until you act.

| State | What you see | What stays open |
|---|---|---|
| Wrong network | A banner naming the network your wallet is on, with **Switch to Ethereum**; the network pill turns red | Your figures stay visible; switch to make changes |
| Incident notice | A banner from the team saying what is affected | Everything the notice does not name |
| Out-of-date figures | **The figures may be out of date**, with when they were last read and **Refresh**; the top bar reads **Figures may be out of date** | Confirming is paused until the figures refresh |
| No connection | **Can't reach the network**, with **Try again** | Nothing new loads until the app reaches the network |
| Outdated app | **This version of the app is no longer safe to use**, with **Reload** | Reload before you sign anything |
| Regional restriction | **New positions aren't available in your region** | Exits, claims, releases and repayments; staking and new locks are closed |
| Failed screening | **This address can't use Definica**, with only **Disconnect** | Nothing |
| Terms to accept | **Before you continue**, or **The Terms have changed** when a new version applies, with **Accept and continue** and **Disconnect** | Nothing until you accept |

You accept the Terms for each address in the connect dialog, and the app asks again when they change. See [Connect a wallet](/app/connect-a-wallet).

## Settings

- **Wallet.** The connected address with **Copy**, the network (with **Switch to Ethereum** when your wallet is on another one), the wallet you connected with, the version of the Terms accepted for the address, and **Disconnect**. Without a wallet, the card offers **Connect wallet**.
- **Display.** Kept on this device only: **Hide balances**, **Decimals** (2 or 4 places) and **Your position in** (ETH or Vault shares, for the headline on Home).
- **Privacy and data.** The app sets no cookies and sends no analytics. **Clear data on this device** forgets your display choices and the remembered wallet connection, after you confirm. Your position is untouched; you connect your wallet again afterwards.
- **Help and legal.** Under **Learn**: how to use the app, this documentation, the risks and [Verify addresses](/security/verify-addresses). Under **Definica**: the roadmap, Telegram, X, the Terms and the Privacy Policy.

## In this section

<DocCardList />
