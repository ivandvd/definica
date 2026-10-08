---
title: 'Source of truth'
description: 'What prevails when the interface, the documentation and the contracts disagree, which channels are official and how to report a flaw.'
sidebar_position: 4
---

# Source of truth

The deployed contracts are the final word on what happens to your assets. This page sets out what prevails when the interface, this documentation and the contracts disagree, which channels are official, and how to report a vulnerability.

## The three rules

These rules come from Definica's [Terms of Service]({{SITE_URL}}/terms).

| Rule | What it means for you |
|---|---|
| The executed contract state prevails | If the interface, the documentation and the deployed contracts show different results, the executed smart-contract state controls |
| Only active features are available | A feature is available only when the official interface marks it as active and connects it to published contract addresses |
| No transfers on unverified information | Never transfer assets on the strength of a screenshot, a social-media post, a test deployment or an unverified address |

## What this documentation is not

- A substitute for the contracts. It explains how the mechanisms work; the deployed contracts decide what happens.
- A source of addresses. Your wallet shows the address of the contract each transaction goes to; [Verify addresses](/security/verify-addresses) sets out how to check it before you sign.
- A substitute for your wallet's confirmation screen. Check the network, address, function, amount and receiver before you sign.

## The interface is a convenience layer

The interface is a convenience layer over the contracts. It does not replace the smart-contract code, your wallet's confirmation or the blockchain record. Figures it shows can be estimates or delayed: if an RPC provider or indexer fails, the app warns that estimates may be delayed or incomplete, and a queue position or wait time it shows can be an estimate. Definica can restrict access to the interface by jurisdiction, IP address, wallet address or risk signal.

## Official channels

These are the only accounts Definica operates:

| Channel | Address |
|---|---|
| Website | [definica.com](https://definica.com) |
| Telegram | [t.me/definica](https://t.me/definica) |
| X | [x.com/definicacom](https://x.com/definicacom) |
| General | contact@definica.com |
| Business | business@definica.com |
| Legal | legal@definica.com |
| Privacy | privacy@definica.com |
| Security | security@definica.com |

Definica's contact page has a tool that checks whether a Telegram username belongs to the team; an account it does not confirm is not part of the official Definica team. Do not share funds or credentials with unverified accounts.

:::danger[Definica never asks for your keys]
Never share private keys, seed phrases or recovery phrases. Definica never asks for them.
:::

## Responsible disclosure

Send security reports to security@definica.com. Contact the same address before any testing that could affect users, assets, availability or confidential information.

## Incident actions

In response to an incident, Definica can pause the interface, recommend that users stop interacting, migrate contracts, disable a module, restrict deposits or take another technically available action. No emergency action is guaranteed to be available, timely, effective or approved. Such actions are announced through the official channels above and nowhere else.

## Related

- [Verify addresses](/security/verify-addresses)
- [Control model](/security/control-model)
- [Release evidence](/security/release-evidence)
