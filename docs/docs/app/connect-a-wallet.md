---
title: 'Connect a wallet'
description: 'How to connect a wallet to the Definica app, accepting the Terms for your address, the wallet menu, switching to Ethereum, disconnecting and making sure you are on the official app.'
sidebar_position: 2
---

# Connect a wallet

Connecting a wallet lets the app read your Definica position and prepare transactions for you to sign. It gives the app no control over your funds: you approve every transaction in your wallet, and your wallet's confirmation screen is the one that counts.

## Before you connect

1. **Check the address bar.** Open the app from Definica's website or the **Launch app** button on these pages. Definica's official channels are definica.com, [t.me/definica](https://t.me/definica) and [x.com/definicacom](https://x.com/definicacom); links from anywhere else are not official.
2. **Keep your keys to yourself.** Never share a private key, seed phrase or recovery phrase. Definica never asks for them, and the connect dialog says so.
3. **Check that you are eligible.** You must be 18 or over, not subject to sanctions, and not in a region where Definica is restricted, and you must not use a VPN to get round a restriction. Access can be restricted by jurisdiction, IP address, wallet address or risk signal.

## Connect

1. Select **Connect wallet** in the top bar (**Connect** on a phone), or the connect button on any screen that needs an account, such as **Connect wallet to continue** under a form.
2. The **Connect a wallet** dialog opens, as a sheet on a phone. Tick the statement at the top: you are 18 or over, not subject to sanctions, not in a region where Definica is restricted and not using a VPN to get round a restriction, and you accept the Terms and have read the Privacy Policy. Both are linked from the statement. The wallet options stay off until you tick it.
3. Choose **Browser wallet** for MetaMask, Rabby or another extension, **WalletConnect** to scan a code with a mobile wallet, or **Coinbase Wallet** for its app or extension.
4. Approve the connection in your wallet. The button reads **Connecting…** until it completes.
5. The button then shows your address, or only its avatar on a small phone screen, and on a wide screen your ETH balance. Your acceptance of the Terms is recorded for that address, and every screen loads your position, exit requests, locks and activity.

The app remembers the connection on this device and reconnects on your next visit until you disconnect or clear the app's data in Settings.

## The Terms for each address

The app records your acceptance of the Terms per address and per version. If the connected address has not accepted the current version, for example after you switch to another account in your wallet, or after the Terms change, the app asks before anything else. The prompt reads **Before you continue**, or **The Terms have changed** for an address that accepted an earlier version, and repeats the statement with the version number. **Accept and continue** records your acceptance; **Disconnect** leaves without it.

Settings shows the version accepted for the connected address.

Every address is also screened. An address that does not pass sees only **This address can't use Definica**, with **Disconnect**; if you think that is a mistake, contact the team through the official channels.

## The wallet menu

Select your address in the top bar to open the wallet menu: a menu under the button on a wide screen, a sheet titled **Wallet** on a phone. It shows your address, the network your wallet is on and your ETH balance, and offers **Copy address**, **View on Etherscan**, **Settings** and **Disconnect**.

## Network

Definica runs on Ethereum, and the network pill in the top bar reads **Ethereum**. If your wallet is set to another network:

- a banner names the network your wallet is on and offers **Switch to Ethereum**; your figures stay visible;
- the network pill turns red and reads **Switch to Ethereum**, or **Switch** on a phone;
- the main button of each form reads **Switch to Ethereum**, and a review's confirm button reads **Switch to Ethereum first** and stays off;
- the wallet menu shows the network in red, with **Switch to Ethereum**.

Switching asks your wallet to change to Ethereum; approve the request there. Your wallet shows the network on every request, so check it there too.

## What a connection shares

Connecting shares your public address with the app. Reading the chain and sending transactions also passes your address, IP address and device data to RPC providers, indexers and your wallet provider, as with any onchain app. Your private key never leaves your wallet.

The app sets no cookies. Your display choices and the remembered connection are kept in your browser on this device, and **Clear data on this device** in Settings removes them.

## Using the app without a wallet

You can look around before you connect. Home shows a short introduction, **How it works** and the Vault card, with its capacity, share price, fees, minimum deposit and next harvest. The Stake screen shows the form with the share price and fees, the Vault card and **How it works**. The Unstake screen shows **How exits settle**, and the Locks screen **What a lock does**. Each form's button reads **Connect wallet to continue**, and your exit queue, your lock positions and your activity show a connect prompt in place of account data.

Before you commit anything, read [Verify addresses](/security/verify-addresses) for how to check the contract your wallet shows.

## Disconnecting

Choose **Disconnect** in the wallet menu, or in the Wallet card in Settings. This ends the app's access to your address and stops it reconnecting on your next visit. It does not affect your position, which is held in DefinicaCore and the Vault, not in the app.

## Related

- [Stake](/app/stake)
- [Verify addresses](/security/verify-addresses)
- [Source of truth](/security/source-of-truth)
