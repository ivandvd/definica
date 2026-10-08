export const terms = {
  title: "Terms of Service",
  /** Meta description: one plain sentence, under 155 characters. */
  description:
    "The terms for using the Definica website, web app and docs, including eligibility, self-custody, the main risks and the limits of our liability.",
  updated: "8 October 2026",
  intro: [
    "These Terms of Service (the “Terms”) govern your use of the Definica website, web app and documentation. Please read them carefully.",
    "Definica’s services are non-custodial: they help you stake, commit liquidity, lend and borrow on Ethereum from your own wallet. These activities carry real risk. You can lose some or all of the assets you use, and nothing in the services guarantees a return. Sections 18, 23 and 24, on risks and the limits of our liability, are particularly important.",
  ],
  sections: [
    {
      id: "agreement",
      heading: "1. Agreement to these Terms",
      blocks: [
        {
          type: "p",
          text: "By accessing or using the Website, the Interface or the Docs (together, the “Services”), you agree to these Terms. If you do not agree, do not use the Services. If you use them for an organisation, you confirm that you are authorised to bind it, and “you” includes it.",
        },
      ],
    },
    {
      id: "about",
      heading: "2. About Definica and these services",
      blocks: [
        {
          type: "p",
          text: "“Definica”, “we”, “us” and “our” mean the Definica project and the contributors who operate the Website, the Interface and the Docs. If Definica designates an operating entity, its name and details will be published on this page.",
        },
        {
          type: "p",
          text: "The Website is definica.com. The Interface is Definica’s web app, which lets you interact with the Smart Contracts from your own wallet. The Docs are at docs.definica.com.",
        },
        {
          type: "p",
          text: "Definica has three phases: Phase 1, pooled ETH staking; Phase 2, the Main Liquidity Module; and Phase 3, borrowing markets (sections 7–12). Each runs on Smart Contracts on Ethereum and relies on third-party protocols, mainly StakeWise and Aave.",
        },
        {
          type: "p",
          text: "The Telegram account t.me/definica and the X account x.com/definicacom are the only accounts operated by Definica. Treat any other account, website or message claiming to be Definica as unofficial.",
        },
      ],
    },
    {
      id: "definitions",
      heading: "3. Definitions",
      blocks: [
        { type: "p", text: "In these Terms:" },
        {
          type: "ul",
          items: [
            "“Services” means the Website, the Interface and the Docs.",
            "“Smart Contracts” means the contracts deployed on Ethereum for Definica, including DefinicaCore, the Vault, the Main Liquidity Module and the Phase 3 markets.",
            "“DefinicaCore” means the Phase 1 contract that records each user’s position, locks and exits.",
            "“Vault” means EthPooledStakingVault, the dedicated StakeWise Vault used in Phase 1, and “Vault shares” means the accounting units it uses to record a proportional stake in it.",
            "“osETH” means StakeWise’s liquid staking token, and “aEthosETH” means the token Aave issues to represent osETH supplied to Aave V3 Ethereum.",
            "“Third-Party Services” means protocols, networks and services that Definica does not operate, including those listed in section 13.",
            "“Official Channels” means the Website, the Docs, t.me/definica and x.com/definicacom.",
          ],
        },
      ],
    },
    {
      id: "eligibility",
      heading: "4. Eligibility",
      blocks: [
        { type: "p", text: "You may use the Services only if, each time you use them:" },
        {
          type: "ul",
          items: [
            "You are 18 or older and of legal age to enter into a binding contract where you live.",
            "You are not subject to sanctions or listed on any sanctions list, and you are not acting for anyone who is.",
            "You are not located in, or acting for anyone in, a jurisdiction where using the Services is prohibited.",
            "The assets you use are lawfully yours and are not the proceeds of crime.",
          ],
        },
        {
          type: "p",
          text: "Definica may restrict access by jurisdiction, IP address, wallet address or risk signals, at any time and without notice, and the Vault has a blocklist (section 15). You must not use a VPN, a proxy or any other method to get around a restriction. If any statement above stops being true, you must stop using the Services.",
        },
      ],
    },
    {
      id: "interface-and-smart-contracts",
      heading: "5. The Interface and the smart contracts",
      blocks: [
        {
          type: "p",
          text: "The Interface is a convenience layer over the Smart Contracts. It reads public blockchain data and prepares transactions for you to review and sign in your wallet; it cannot execute a transaction without your signature. Three rules apply:",
        },
        {
          type: "ul",
          items: [
            "The executed contract state prevails. If the Interface, the Docs or the Website shows a different result from the deployed Smart Contracts, the executed state of the Smart Contracts controls.",
            "Only active features are available. A feature is available only when the official Interface marks it as active and connects it to published contract addresses.",
            "No transfers on unverified information. Never transfer assets on the strength of a screenshot, a social media post, a test deployment or an address you have not checked.",
          ],
        },
        {
          type: "p",
          text: "Deployed contract addresses are listed in the Interface and the Docs, and your wallet shows the address again before you sign. Fees, rates, loan-to-value ratios, caps, durations and other parameters are set by the Smart Contracts or the relevant markets and shown in the Interface before you confirm.",
        },
        {
          type: "p",
          text: "Figures shown in the Services, such as balances, rewards, rates, queue positions and wait times, can be estimates, delayed or incomplete. Any APR, APY or other rate shown is information, not a promise. Transactions on Ethereum are public and irreversible: Definica cannot cancel or reverse them, or recover assets sent to the wrong address.",
        },
      ],
    },
    {
      id: "wallets",
      heading: "6. Wallets, self-custody and authorisations",
      blocks: [
        {
          type: "p",
          text: "Definica never holds your private keys or your funds and cannot sign a transaction for you. Every transaction is signed in your own wallet and executes on Ethereum. Some Smart Contracts hold assets for their users under their code, as DefinicaCore holds Vault shares. Non-custodial does not mean that no administrative or operational permissions exist; section 15 sets them out.",
        },
        {
          type: "p",
          text: "You are responsible for your wallet, keys, recovery phrase and devices. If you lose them or someone else obtains them, your assets can be lost for good, and Definica cannot recover them. Never share your private key or seed phrase with anyone; Definica never asks for them.",
        },
        {
          type: "p",
          text: "Some actions need an authorisation, such as a token approval or, in Phase 2, your authorisation for a funding loan. An authorisation lets a Smart Contract act within the limits you approve until it is used up or revoked. Before you sign anything, check the network, contract address, function, amount and receiver that your wallet shows, and revoke authorisations you no longer need.",
        },
      ],
    },
    {
      id: "phase-1",
      heading: "7. Phase 1 – pooled ETH staking",
      blocks: [
        {
          type: "p",
          text: "In Phase 1 you deposit ETH through DefinicaCore into EthPooledStakingVault, a dedicated StakeWise Vault that pools deposits and funds Ethereum validators run by an operator. DefinicaCore holds the Vault shares in aggregate and records the proportion that is yours, including any locks and exits.",
        },
        {
          type: "p",
          text: "Phase 1 is ETH only. The Vault does not mint osETH, and Vault shares cannot be transferred, so you take value out through an exit (section 9). A deposit can be refused, for example if the Vault has reached its capacity or the amount is below its minimum; the Interface shows both before you confirm.",
        },
        {
          type: "p",
          text: "Definica’s multisig may donate ETH to the Vault or burn Vault shares it owns. Either raises the value of every remaining share and favours no particular user. These contributions are discretionary, depend on budget and can stop at any time; they are never a guaranteed return.",
        },
      ],
    },
    {
      id: "vault-shares-and-rewards",
      heading: "8. Vault shares and rewards (no guaranteed return)",
      blocks: [
        {
          type: "p",
          text: "Your position is recorded as Vault shares: accounting units for a proportional stake in the Vault, not a fixed ETH balance. Its ETH value is your shares multiplied by the Vault’s share price, which changes over time.",
        },
        {
          type: "p",
          text: "Rewards depend on the performance of the Vault’s validators. StakeWise’s Keeper and Oracles report rewards and penalties, and the Vault applies them at harvests, so figures between harvests can be out of date. Rewards stay in the value of your shares until you exit; they are not paid out as a separate token.",
        },
        {
          type: "p",
          text: "The share price can fall: penalties, slashing and other losses reduce the value of every share, locked or not, and the Vault fee is taken from rewards (section 14). Definica promises no return. No APR or APY is guaranteed, and you can get back less ETH than you deposited.",
        },
      ],
    },
    {
      id: "exits",
      heading: "9. Exits, the exit queue and claims",
      blocks: [
        {
          type: "p",
          text: "To leave, you request an exit for some or all of your available shares, which then enter the Vault’s exit queue. The Vault serves requests from available liquidity first and otherwise from validator exits. Their timing depends on Ethereum’s validator exit queue, which nobody controls, so an exit can take hours or weeks.",
        },
        {
          type: "p",
          text: "After a request is processed, the Vault’s claim delay applies before you can claim the ETH, and the Interface shows when each exit becomes claimable. If only part of a request has been processed, you can claim that part and the rest stays in the queue.",
        },
        {
          type: "ul",
          items: [
            "Requesting and claiming are separate transactions, and each costs gas.",
            "A queued exit request cannot be cancelled.",
            "Locked shares cannot be queued until their lock has matured and been released.",
          ],
        },
      ],
    },
    {
      id: "share-locks",
      heading: "10. Share locks",
      blocks: [
        {
          type: "p",
          text: "Share locks are optional. You can lock Vault shares for 7–365 days, with up to 10 lock positions open at once. Locked shares stay in reward accounting, so they gain and lose value like any other share, but they cannot enter the exit queue before the lock matures.",
        },
        {
          type: "p",
          text: "Early unlocking may be impossible, even in adverse market, validator, protocol or security conditions, so lock only shares you can leave committed until maturity. A matured lock must be released before its shares are available. A lock carries no bonus, multiplier or governance right, and it is separate from Phase 2 commitments.",
        },
      ],
    },
    {
      id: "phase-2",
      heading: "11. Phase 2 – Main Liquidity Module",
      blocks: [
        {
          type: "p",
          text: "In Phase 2, osETH supplied to Aave V3 Ethereum is represented by aEthosETH, which you can commit to the Main Liquidity Module for a fixed duration under the Module’s rules. Those rules, including durations, capacity, early release and withdrawal conditions, are shown in the Interface before you commit.",
        },
        {
          type: "p",
          text: "With your explicit authorisation, an eligible committed position can support a funding loan at Aave, for example in WETH, that supplies Definica’s Phase 3 lending markets. A commitment alone creates no debt. A funding loan is a real debt: it accrues variable interest, follows Aave’s rules and can be liquidated if the position’s health factor falls below 1.",
        },
        {
          type: "p",
          text: "You remain responsible for your separate obligations, such as the liability for osETH minted at another StakeWise Vault and any debt at Aave. Holding or committing aEthosETH settles neither; only repayment does. A commitment creates no second staking return and does not make aEthosETH collateral.",
        },
        {
          type: "p",
          text: "A commitment that matures does not guarantee cash: repaying the funding loan, Aave’s liquidity and any minting debt can still stand between you and a withdrawal. Funding costs and lending losses can outweigh returns, and your net result can be negative.",
        },
      ],
    },
    {
      id: "phase-3",
      heading: "12. Phase 3 – borrowing markets",
      blocks: [
        {
          type: "p",
          text: "Phase 3 markets let you borrow a supported asset against approved ETH-correlated collateral, with osETH as the primary collateral asset. Each market has its own collateral, interest and liquidation rules, including its oracle, maximum loan-to-value ratio, liquidation threshold, interest-rate model and caps, which the Interface shows before you confirm.",
        },
        {
          type: "p",
          text: "If your collateral loses value, your debt grows or your position otherwise crosses the liquidation threshold, some or all of your collateral can be liquidated, often at a discount, and liquidation may not clear your debt. Borrowing without selling does not guarantee that you keep your collateral.",
        },
        {
          type: "p",
          text: "Liquidity comes from Phase 2 funding loans and from lenders who supply ETH directly. Lenders can lose money if borrowers are not liquidated in time, and withdrawals depend on how much of the market is borrowed. Of the lending interest attributable to a participant, 75% is allocated to the participant and 25% to Definica. The split is made before the participant’s financing costs, so a participant’s net result can be negative.",
        },
      ],
    },
    {
      id: "third-parties",
      heading: "13. Third-party protocols and services",
      blocks: [
        {
          type: "p",
          text: "The Services rely on third parties that Definica does not operate or control: StakeWise (Vaults, Keeper, Oracles and osETH), Aave (V3 markets), Ethereum validators and operators, wallet providers, RPC and indexing providers, block explorers, PostHog (analytics, only with your consent), and Telegram and X.",
        },
        {
          type: "p",
          text: "Their failures, exploits, governance decisions, parameter changes and upgrades can affect your positions without any action by Definica; Aave governance, for example, can change loan-to-value limits, thresholds and caps. Their own terms apply to them. Definica does not endorse them and is not responsible for them.",
        },
      ],
    },
    {
      id: "fees-gas-taxes",
      heading: "14. Fees, gas and taxes",
      blocks: [
        {
          type: "p",
          text: "Fees and charges are set by the Smart Contracts or the relevant markets and shown in the Interface before you confirm. They include the Vault fee, a percentage of rewards paid as newly minted shares to its recipient and never taken from your deposit; any Definica fee; Definica’s 25% of attributable lending interest in Phase 3; and the interest and liquidation costs of Aave and each Phase 3 market.",
        },
        {
          type: "p",
          text: "Fees can change within the limits the Smart Contracts allow, and the value in force when a transaction executes applies. Gas is paid to the Ethereum network, not to Definica, and is not refunded if a transaction fails.",
        },
        {
          type: "p",
          text: "You are responsible for any taxes on your use of the Services, including on rewards, interest and liquidations. Definica does not give tax advice.",
        },
      ],
    },
    {
      id: "administration",
      heading: "15. Administrative roles, upgrades and emergency actions",
      blocks: [
        {
          type: "p",
          text: "Non-custodial does not mean that no administrative or operational permissions exist. The main ones are below. The holder of each role is readable onchain, and the Docs explain where to check.",
        },
        {
          type: "ul",
          items: [
            "DefinicaCore is upgradeable and has separate admin and upgrade roles. The upgrade authoriser pre-approves one implementation at a time, and an upgrade can go only to that approved implementation.",
            "The Vault has its own admin, who can upgrade it only to implementations registered by StakeWise’s governance and who sets the Vault fee within StakeWise’s limits.",
            "The Vault’s blocklist manager can stop an address from depositing and can move a blocked address’s shares into the exit queue for its owner.",
          ],
        },
        {
          type: "p",
          text: "An upgrade can change how the Smart Contracts behave. In an incident, Definica may pause the Interface, use a pause where a Smart Contract or market provides one, recommend that users stop interacting, disable a module, restrict deposits or migrate contracts. No emergency action is guaranteed to be available, timely or effective.",
        },
        {
          type: "p",
          text: "Definica announces upgrades, changes to parameters it controls and emergency actions only through the Official Channels, where possible before they take effect. Treat instructions from anywhere else as unofficial.",
        },
      ],
    },
    {
      id: "prohibited-use",
      heading: "16. Prohibited use",
      blocks: [
        { type: "p", text: "You must not use the Services, or help anyone else use them, to:" },
        {
          type: "ul",
          items: [
            "Break any law, including sanctions, anti-money-laundering and counter-terrorist-financing laws, or deal in the proceeds of crime.",
            "Get around an access restriction, including with a VPN, a proxy or someone else’s wallet.",
            "Exploit a vulnerability, or manipulate the Smart Contracts, oracles, markets or prices.",
            "Disrupt or overload the Services, including with malicious code or abusive automated access.",
            "Impersonate Definica, present an unofficial channel as official, or attempt phishing.",
            "Mislead others about Definica, including by promising returns on its behalf.",
            "Infringe anyone’s intellectual property, privacy or other rights.",
          ],
        },
        {
          type: "p",
          text: "If you find a vulnerability, report it under section 17 instead of using it.",
        },
      ],
    },
    {
      id: "security",
      heading: "17. Security and incidents",
      blocks: [
        {
          type: "p",
          text: "Report suspected vulnerabilities to security@definica.com with enough detail to reproduce them, and contact the same address before any testing that could affect users, assets, availability or confidential information. Give Definica a reasonable time to fix an issue before you disclose it, do not exploit it beyond what is needed to show that it exists, and do not make disclosure conditional on payment.",
        },
        {
          type: "p",
          text: "Audits and monitoring reduce risk but cannot remove it. In an incident, Definica publishes instructions only through the Official Channels. Write to security@definica.com about any website or account that impersonates Definica.",
        },
      ],
    },
    {
      id: "risks",
      heading: "18. Risks",
      blocks: [
        {
          type: "p",
          text: "Using the Services involves significant risk, and you could lose some or all of the assets you use. Use only assets you can afford to lose, and read the risk pages in the Docs. The main risks are:",
        },
        {
          type: "ul",
          items: [
            "Staking and validator risk: validators can be penalised or slashed, losses are shared by every share in the Vault, and exits depend on Ethereum’s validator exit queue.",
            "Smart contract and upgrade risk: contracts can contain bugs that audits miss, upgrades can change behaviour, administrative keys can be compromised, and emergency actions can come too late.",
            "Oracle risk: a wrong, stale or missing report from StakeWise’s Oracles or a price oracle can misstate your position, delay an exit or trigger a liquidation.",
            "Market and liquidity risk: ETH-correlated assets can fall sharply, osETH can trade below its exchange rate, and liquidity at Aave, in a market or in the exit queue can run short when you need it.",
            "Borrowing and liquidation risk: debt grows with variable interest, collateral can be sold at a discount, and funding costs and lending losses can exceed returns.",
            "Correlation is not safety: ETH-correlated collateral and ETH-denominated debt do not move identically, and correlation removes none of the price, liquidation, interest or governance risk.",
            "Third-party risk: StakeWise, Aave, wallets and infrastructure providers can fail, be exploited or change their rules.",
            "Regulatory and tax risk: laws and tax treatment can change and can restrict or prohibit the Services where you are.",
            "Network, MEV and gas risk: congestion can delay transactions or make them fail, failed transactions still cost gas, and others can front-run or sandwich pending transactions.",
            "Wallet and phishing risk: lost keys, malicious approvals, fake websites and impersonators can cost you your assets.",
          ],
        },
        {
          type: "p",
          text: "This list is not complete. By using the Services, you confirm that you understand and accept these risks.",
        },
      ],
    },
    {
      id: "no-advice",
      heading: "19. No advice and no fiduciary relationship",
      blocks: [
        {
          type: "p",
          text: "Nothing in the Services is investment, financial, legal, tax or other advice, or a recommendation or offer to buy, sell or hold any asset. Information in the Services is general and does not take your circumstances into account, so consider independent advice before you act.",
        },
        {
          type: "p",
          text: "Definica is not your broker, agent, adviser, custodian or fiduciary and owes you no fiduciary duty. These Terms create no partnership, agency or employment relationship.",
        },
      ],
    },
    {
      id: "intellectual-property",
      heading: "20. Intellectual property and your licence to use the services",
      blocks: [
        {
          type: "p",
          text: "The Services, including their text, design, logos and software, and the Definica name and brand belong to Definica or its licensors. Subject to these Terms, Definica grants you a limited, personal, non-exclusive, non-transferable and revocable licence to use the Services for their intended purpose.",
        },
        {
          type: "p",
          text: "You must not use Definica’s name or branding in a way that suggests a connection with Definica or could confuse people, or build a look-alike of the Services. Any part released under an open-source licence is governed by that licence.",
        },
      ],
    },
    {
      id: "privacy",
      heading: "21. Privacy",
      blocks: [
        {
          type: "p",
          text: "The Privacy Policy explains what information we process, how we use cookies and analytics, and your rights. Your wallet address and transactions are public on Ethereum, and Definica cannot change or delete onchain data. Write to privacy@definica.com with any privacy question or request.",
        },
      ],
    },
    {
      id: "availability",
      heading: "22. Availability, restriction and termination",
      blocks: [
        {
          type: "p",
          text: "The Services can be unavailable, for example during maintenance or when a third party fails. Definica may change, suspend or discontinue any part of them, or restrict or end your access, at any time, including where the law requires it, for sanctions compliance, for security or if you breach these Terms.",
        },
        {
          type: "p",
          text: "Restricting your access to the Interface does not move your assets: your positions stay in the Smart Contracts under their rules. You can stop using the Services at any time, but stopping does not close your positions. Sections 18–20 and 23–28 continue to apply after your use ends.",
        },
      ],
    },
    {
      id: "disclaimer",
      heading: "23. Disclaimer of warranties",
      blocks: [
        {
          type: "p",
          text: "To the extent permitted by law, the Services are provided “as is” and “as available”, without warranties of any kind, express or implied, including of satisfactory quality, fitness for a particular purpose, non-infringement, accuracy or uninterrupted operation. Definica does not warrant that the Smart Contracts or any Third-Party Service will work as intended, or that any transaction will execute at a particular price or time.",
        },
        {
          type: "p",
          text: "Nothing in these Terms excludes or limits a right you have under law that cannot be excluded or limited.",
        },
      ],
    },
    {
      id: "liability",
      heading: "24. Limitation of liability",
      blocks: [
        {
          type: "p",
          text: "To the extent permitted by law, Definica and its contributors are not liable for any indirect or consequential loss, or for any loss of profits, revenue, data, goodwill or digital assets, arising from the Services, the Smart Contracts or any Third-Party Service, however caused.",
        },
        {
          type: "p",
          text: "This includes losses from validator performance or slashing, contract vulnerabilities or upgrades, oracle failures, market movements, liquidations, exit delays, third parties, network conditions, lost keys, phishing, or a transaction you did not check before signing.",
        },
        {
          type: "p",
          text: "To the extent permitted by law, the total liability of Definica and its contributors for all claims is limited to the fees you paid to Definica for the Services in the 12 months before the event giving rise to the claim.",
        },
        {
          type: "p",
          text: "Nothing in these Terms limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited by law.",
        },
      ],
    },
    {
      id: "indemnity",
      heading: "25. Indemnity",
      blocks: [
        {
          type: "p",
          text: "To the extent permitted by law, you agree to indemnify Definica and its contributors against claims, losses and costs, including reasonable legal fees, arising from your breach of these Terms or of any law, or from your misuse of the Services, except to the extent they were caused by Definica’s own breach of these Terms.",
        },
      ],
    },
    {
      id: "changes",
      heading: "26. Changes to these Terms",
      blocks: [
        {
          type: "p",
          text: "We may change these Terms to reflect changes to the Services, the Smart Contracts or the law, and we will update the date at the top of this page when we do. Where reasonably possible, we will announce material changes through the Interface or the Official Channels before they take effect.",
        },
        {
          type: "p",
          text: "If you keep using the Services after a change takes effect, you accept the updated Terms. If you do not agree, stop using the Services.",
        },
      ],
    },
    {
      id: "governing-law",
      heading: "27. Governing law and disputes",
      blocks: [
        {
          type: "p",
          text: "These Terms do not select a governing law. The law that applies and the forum for any dispute are determined by mandatory law and the applicable conflict-of-law rules. If you are a consumer, you keep the protection of the mandatory rules of the country where you live.",
        },
        {
          type: "p",
          text: "If you have a dispute with Definica, contact legal@definica.com first with a description of the issue, and allow 30 days for us to try to resolve it informally. This does not affect any right you have under mandatory law.",
        },
      ],
    },
    {
      id: "general",
      heading: "28. General",
      blocks: [
        {
          type: "ul",
          items: [
            "Entire agreement: these Terms and the rules the Interface shows for a feature are the whole agreement between you and Definica about the Services.",
            "Severability: if any part of these Terms is found unenforceable, the rest remains in force.",
            "No waiver: a delay in enforcing a right does not give that right up.",
            "Transfer: you may not transfer your rights under these Terms without Definica’s consent. Definica may transfer them to an operating entity it designates or to a successor, and will say so on this page.",
            "Events beyond control: Definica is not responsible for failures caused by events beyond its reasonable control, such as network failures, attacks or third-party governance decisions.",
            "Notices: Definica gives notice through the Interface or the Official Channels, and you can send notices to legal@definica.com by email.",
          ],
        },
      ],
    },
    {
      id: "contact",
      heading: "29. Contact",
      blocks: [
        { type: "p", text: "You can reach Definica by email:" },
        {
          type: "ul",
          items: [
            "General questions: contact@definica.com",
            "Business enquiries: business@definica.com",
            "Legal matters and disputes: legal@definica.com",
            "Privacy and data requests: privacy@definica.com",
            "Security reports: security@definica.com",
          ],
        },
        {
          type: "p",
          text: "Official accounts: t.me/definica on Telegram and x.com/definicacom on X.",
        },
      ],
    },
  ],
} as const;
