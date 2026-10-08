---
title: 'About these docs'
description: 'What these docs cover, how they are organised and written, and how to report an error.'
sidebar_position: 2
---

# About these docs

These docs describe how Definica works: the contracts behind each phase, what you hold at each step, where each return comes from, what you owe and what can go wrong. They are written for people using Definica and for reviewers and integrators.

## How they are organised

| Section | What it covers |
|---|---|
| [Introduction](/) | What Definica is, how the three phases fit together and where to start. |
| [Concepts](/concepts) | One building block per page, from Vault shares to the funding loan. |
| [Phase 1](/phase-1), [Phase 2](/phase-2), [Phase 3](/phase-3) | Each phase from first transaction to exit. |
| [Using the app](/app) | Each screen of the app and what it shows before every transaction. |
| [Risks](/risks) | Every risk a position carries, and what you can check yourself. |
| [Security](/security) | Audits, the control model, release evidence, the source of truth and address verification. |
| [Roadmap](/roadmap), [FAQ](/faq), [Glossary](/glossary) | How Definica is built, short answers and definitions. |

## Conventions

- **Terms** link to the [Glossary](/glossary) the first time they appear on a page.
- **Contract and function names** appear in `code` and match the contract source.
- **Values that vary** per Vault, Module or market, such as fees, capacity, lock terms and market parameters, are not printed here. The app shows the current values before you confirm, and the contracts hold them onchain.
- **Rates** are never quoted. Staking rewards move with validator performance and lending rates with utilisation, so the docs explain how a rate forms rather than what it is today.
- **Third-party mechanics** for StakeWise, Aave and Ethereum follow their owners' documentation, collected in the [Reading list](/reference/reading-list).
- **What you can verify** sections list the onchain reads that confirm what a page describes.
- **Spelling** is British.

## When the docs and the contracts differ

The deployed contract state prevails over the app and these docs. See [Source of truth](/security/source-of-truth).

## Reporting an error

If something in these docs does not match what you see in the app or onchain, write to contact@definica.com. Send security matters to security@definica.com.
