---
title: 'Connect a wallet'
description: 'How to connect a wallet to the Definica app, what the connection allows, and how to make sure you are on the official app.'
sidebar_position: 2
---

# Connect a wallet

Connecting a wallet lets the app read your Definica position and prepare transactions for you to sign. It gives the app no control over your funds: you approve every transaction in your wallet, and your wallet's confirmation screen is the one that counts.

## Before you connect

1. **Check the address bar.** The app is at `definica.com/app`. Definica's official channels are definica.com, [t.me/definica](https://t.me/definica) and [x.com/definicacom](https://x.com/definicacom); links from anywhere else are not official.
2. **Keep your keys to yourself.** Never share a private key, seed phrase or recovery phrase. Definica never asks for them.
3. **Check that you are eligible.** You must be 18 or over, in a jurisdiction where using the app is lawful, and not subject to sanctions. Access can be restricted by jurisdiction, IP address, wallet address or risk signal.

## Connect

1. Select **Connect wallet** in the top bar, or the connect button on any screen that needs an account.
2. Choose an option in the **Connect a wallet** dialog: **Browser wallet** for MetaMask, Rabby or another extension, **WalletConnect** to scan a code with a mobile wallet, or **Coinbase Wallet** for its app or extension.
3. Approve the connection in your wallet. The button reads **Connecting…** until it completes.
4. The button then shows your shortened address and, on wider screens, your ETH balance. Every screen loads your position, exit requests, locks and activity.

The app remembers the connection on this device and reconnects on your next visit until you disconnect.

## The wallet menu

Select your address in the top bar to open the wallet menu. It shows your address, your ETH balance and the network, and offers **Copy address**, **View on Etherscan** and **Disconnect**.

## Network

Definica runs on Ethereum. The top bar shows the network the app uses, and the wallet menu repeats it next to your balance. If your wallet is set to another network, switch it to Ethereum before you sign. Your wallet shows the network on every request, so check it there too.

## What a connection shares

Connecting shares your public address with the app. Reading the chain and sending transactions also passes your address, IP address and device data to RPC providers, indexers and your wallet provider, as with any onchain app. Your private key never leaves your wallet.

## Using the app without a wallet

You can look around before you connect. The Overview shows the Vault's capacity, share price, fees and minimum deposit. The Stake screen shows the **Before you confirm** conditions and the **Contracts** card with each contract address, so you can check them against [Verify addresses](/security/verify-addresses) before you commit anything. Withdraw, Share locks and Activity show a connect prompt in place of account data.

## Disconnecting

Choose **Disconnect** in the wallet menu. This ends the app's access to your address and stops it reconnecting on your next visit. It does not affect your position, which is held in DefinicaCore and the Vault, not in the app.

## Related

- [Stake](/app/stake)
- [Verify addresses](/security/verify-addresses)
- [Source of truth](/security/source-of-truth)
