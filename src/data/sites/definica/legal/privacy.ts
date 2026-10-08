export const privacy = {
  title: "Privacy Policy",
  /** Meta description: one plain sentence, under 155 characters. */
  description:
    "How Definica handles information when you use its website, web app and docs, including cookies, analytics with your consent and public onchain data.",
  updated: "8 October 2026",
  intro: [
    "This Privacy Policy explains what information Definica processes when you use the Definica website, web app and documentation, why we process it, how long we keep it and what rights you have.",
    "You can use all three without giving us your name or email address. The personal data involved is mainly technical data, your public wallet address and anything you choose to send us.",
  ],
  sections: [
    {
      id: "who-we-are",
      heading: "1. Who we are and what this policy covers",
      blocks: [
        {
          type: "p",
          text: "“Definica”, “we”, “us” and “our” mean the Definica project and the contributors who operate the Website (definica.com), the Interface (Definica’s web app, which lets you interact with the smart contracts from your own wallet) and the Docs (docs.definica.com), together the “Services”. Definica decides why and how the personal data described here is processed and is the controller responsible for it. If Definica designates an operating entity, its name and details will be published on this page.",
        },
        {
          type: "p",
          text: "This policy also covers emails you send us and your interactions with our official accounts, t.me/definica on Telegram and x.com/definicacom on X. It does not cover Ethereum itself or third-party services such as your wallet, StakeWise or Aave, which have their own policies.",
        },
      ],
    },
    {
      id: "summary",
      heading: "2. Summary",
      blocks: [
        {
          type: "ul",
          items: [
            "You can use the Services without giving us your name or email address.",
            "Without your consent, we use only the storage the Services need: your cookie choice and your Interface preferences. PostHog analytics runs only if you accept it.",
            "We never send wallet addresses, names or email addresses to analytics.",
            "Your wallet address and transactions are public on Ethereum, and no one, including Definica, can change or delete them.",
            "We use information to run and secure the Services, screen for sanctions, reply to you and meet legal obligations.",
            "We do not sell personal data or use advertising networks.",
            "You can exercise your rights by writing to privacy@definica.com and we respond within one month.",
          ],
        },
      ],
    },
    {
      id: "information-we-process",
      heading: "3. Information we process",
      blocks: [
        { type: "p", text: "We process the following information:" },
        {
          type: "ul",
          items: [
            "Technical data: your IP address, browser and device type, operating system, language, the pages you request, the referring page and the time of each request. Our hosting and infrastructure providers receive this whenever you use the Services.",
            "Consent records: your cookie choice, stored in the definica_consent cookie so that it is respected across the Services.",
            "Analytics data, only with your consent: page views and interactions, such as the links and buttons you use, with a random identifier stored on your device (section 7).",
            "Wallet addresses and onchain data: when you connect a wallet, the Interface uses your public address to read your balances, positions and activity from Ethereum and to prepare transactions for you to sign. We may also screen the address (section 5).",
            "Information you send us: your email address, any name you give, and the content of your message and any attachments, such as a wallet address or a security report. If you sign up for updates on the Website, we use your email address to send them.",
            "Information from public channels: if you interact with our Telegram or X accounts, we see your public profile, username and the messages you post or send us there.",
          ],
        },
        {
          type: "p",
          text: "We do not try to identify the person behind a wallet address, although we will know the two are linked if you send us your address. Never send us your private keys or seed phrase; we never ask for them.",
        },
      ],
    },
    {
      id: "public-blockchains",
      heading: "4. Public blockchains",
      blocks: [
        {
          type: "p",
          text: "When you deposit, request an exit, claim, lock, commit, borrow or repay, the transaction is recorded on Ethereum with your wallet address, the contracts involved, the amounts and the time. This is public by design: anyone can read, copy and analyse it, including with tools that try to link addresses to people.",
        },
        {
          type: "p",
          text: "Onchain data is replicated across the network’s nodes worldwide and cannot be changed or deleted by Definica or anyone else. The rights to correct or delete data in section 13 therefore apply to the off-chain information we hold, not to onchain data. If you connect your address to your identity in public, others may link your onchain activity to you.",
        },
      ],
    },
    {
      id: "how-we-use-information",
      heading: "5. How we use information and our legal bases",
      blocks: [
        {
          type: "p",
          text: "We use information only for these purposes, each with the legal basis shown:",
        },
        {
          type: "ul",
          items: [
            "Operating the Services: delivering the Website, the Docs and the Interface, showing your positions, preparing the transactions you ask for and remembering your preferences. Basis: our legitimate interest in providing the Services and, in the Interface, taking the steps you ask for.",
            "Security and fraud prevention: detecting and stopping attacks, abuse, phishing and impersonation, and investigating incidents. Basis: our legitimate interest in protecting the Services and their users.",
            "Sanctions and blocklist screening: checking wallet addresses, the approximate location indicated by IP addresses and other risk signals against sanctions lists, the Vault’s blocklist and our access restrictions. Basis: legal obligations and our legitimate interest in preventing prohibited use.",
            "Analytics: understanding how the Services are used so that we can fix problems and improve them. Basis: your consent.",
            "Communications: replying to your messages, handling security reports and data requests, and sending updates you asked for. Basis: our legitimate interest in responding to you, and your consent for updates.",
            "Legal obligations: complying with the law, responding to lawful requests from authorities, and establishing, exercising or defending legal claims. Basis: legal obligation and our legitimate interest in protecting our rights.",
          ],
        },
        {
          type: "p",
          text: "We rely on legitimate interests only where your rights do not override them, and you can object (section 13). If screening restricts your access to the Interface, you can write to privacy@definica.com to ask about it.",
        },
      ],
    },
    {
      id: "cookies",
      heading: "6. Cookies and similar technologies",
      blocks: [
        {
          type: "p",
          text: "Cookies are small files that a website stores in your browser, and local storage is a similar store in your browser. The Services use the following:",
        },
        {
          type: "ul",
          items: [
            "definica_consent – strictly necessary. Stores your cookie choice. Kept for 12 months. Shared across definica.com, docs.definica.com and the Interface, so that one choice applies to all three.",
            "PostHog cookies and local storage (ph_*) – analytics. Set only if you accept. Kept for up to 12 months.",
            "Local storage for Interface preferences, such as display settings – functional. Stays on your device until you clear it.",
          ],
        },
        {
          type: "p",
          text: "We do not ask for consent for strictly necessary or functional storage, because the Services need it to work as you expect. We do not use advertising cookies or cookies that track you across other websites.",
        },
        {
          type: "p",
          text: "You can change your choice at any time with the “Cookie settings” link in the footer. Withdrawing consent stops analytics from then on but does not affect earlier processing. You can also delete cookies and local storage in your browser settings; if you delete definica_consent, we will ask for your choice again.",
        },
      ],
    },
    {
      id: "analytics",
      heading: "7. Analytics",
      blocks: [
        {
          type: "p",
          text: "We use PostHog to understand how the Services are used: which pages are visited, which features are used and where people run into problems. PostHog records page views and interactions such as clicks and navigation.",
        },
        {
          type: "p",
          text: "PostHog loads only after you accept analytics. If you decline or make no choice, it does not load and sets no ph_* cookies or local storage.",
        },
        {
          type: "p",
          text: "We do not send wallet addresses, names or email addresses to analytics. PostHog does receive the technical data that comes with any web request, such as your IP address and browser type, and processes it on our behalf as a service provider.",
        },
        {
          type: "p",
          text: "We use analytics to fix and improve the Services, not to advertise to you or to build a profile of you. You can withdraw consent at any time with the “Cookie settings” link in the footer.",
        },
      ],
    },
    {
      id: "wallets-and-infrastructure",
      heading: "8. Wallet connections and infrastructure providers",
      blocks: [
        {
          type: "p",
          text: "Your wallet is your own software or device, supplied by a third party. When you connect it, the Interface receives your public address and network, never your private keys. Your wallet provider may collect information under its own privacy policy, which Definica does not control.",
        },
        {
          type: "p",
          text: "To read the chain and send your transactions, the Interface and your wallet use RPC and indexing providers. These providers see your IP address and the requests made, which can include your wallet address. Opening a block explorer link sends the explorer your IP address and what you look up.",
        },
        {
          type: "p",
          text: "The Interface remembers your connection on your device, as one of its preferences, until you disconnect. Disconnecting stops the Interface reading your address and reconnecting on your next visit. It does not delete onchain data or records held by wallet, RPC or indexing providers.",
        },
      ],
    },
    {
      id: "sharing",
      heading: "9. Who we share information with",
      blocks: [
        { type: "p", text: "We share personal data only with:" },
        {
          type: "ul",
          items: [
            "Service providers that host and deliver the Services, provide RPC and indexing infrastructure, send email and support security, and PostHog if you accept analytics. They act on our instructions and may use the data only to provide their services to us.",
            "Professional advisers, such as lawyers and accountants, who are bound by confidentiality.",
            "Authorities, courts and law enforcement, when the law requires it, or where needed to protect the Services, our users or others from harm or fraud.",
            "An operating entity that Definica designates, or a successor to the Services, which must keep protecting the data in line with this policy.",
          ],
        },
        {
          type: "p",
          text: "We never sell personal data, and we do not share it with advertising networks or data brokers.",
        },
      ],
    },
    {
      id: "international-transfers",
      heading: "10. International transfers",
      blocks: [
        {
          type: "p",
          text: "Definica’s contributors and service providers may be located, or process data, in countries other than yours, whose data protection laws may differ from those where you live.",
        },
        {
          type: "p",
          text: "When we transfer personal data out of a country whose law restricts such transfers, we rely on standard contractual clauses or equivalent safeguards recognised by that law. You can write to privacy@definica.com for details of these safeguards.",
        },
      ],
    },
    {
      id: "retention",
      heading: "11. How long we keep information",
      blocks: [
        {
          type: "p",
          text: "We keep personal data only as long as we need it for the purposes in section 5, and then delete or anonymise it:",
        },
        {
          type: "ul",
          items: [
            "definica_consent: 12 months on your device, after which we ask for your choice again.",
            "PostHog cookies and local storage: up to 12 months on your device. Analytics data held by PostHog is kept only as long as it is useful for understanding how the Services are used.",
            "Interface preferences: on your device until you clear them.",
            "Technical logs: only as long as needed to run and secure the Services and to investigate incidents.",
            "Emails and security reports: as long as needed to deal with them and any follow-up. If you signed up for updates, we keep your email address until you unsubscribe.",
            "Screening records: as long as the law requires.",
          ],
        },
        {
          type: "p",
          text: "We may keep information for longer where the law requires it or where we need it for legal claims. Onchain data is permanent and outside our control.",
        },
      ],
    },
    {
      id: "security",
      heading: "12. Security",
      blocks: [
        {
          type: "p",
          text: "We protect personal data with measures suited to the risk, including encrypted connections, access limited to the contributors who need it, and collecting as little as we can. We never hold your private keys.",
        },
        {
          type: "p",
          text: "No system is completely secure. If a personal data breach is likely to put your rights at risk, we will tell you and the relevant authorities as the law requires. Report any security issue to security@definica.com as soon as you notice it.",
        },
      ],
    },
    {
      id: "your-rights",
      heading: "13. Your rights",
      blocks: [
        { type: "p", text: "Depending on where you live, you have the right to:" },
        {
          type: "ul",
          items: [
            "Access the personal data we hold about you and receive a copy.",
            "Correct data that is inaccurate or incomplete.",
            "Delete your off-chain data. Onchain data cannot be deleted (section 4).",
            "Restrict how we use your data while a concern is resolved.",
            "Object to processing based on our legitimate interests.",
            "Receive data you gave us in a portable format, or have it sent to someone else.",
            "Withdraw your consent at any time, without affecting earlier processing.",
            "Complain to a data protection supervisory authority, in particular where you live or work or where you think the problem arose.",
          ],
        },
        {
          type: "p",
          text: "Send requests to privacy@definica.com and we will respond within one month. We may first need to confirm your identity, and for a request about a wallet address we may ask for information showing that it is yours. We will never ask you to sign a transaction, send funds or share your keys. Requests are free of charge.",
        },
      ],
    },
    {
      id: "children",
      heading: "14. Children",
      blocks: [
        {
          type: "p",
          text: "The Services are not for anyone under 18, and we do not knowingly process personal data about children. If you believe a child has sent us personal data, write to privacy@definica.com and we will delete the off-chain data concerned.",
        },
      ],
    },
    {
      id: "third-party-links",
      heading: "15. Third-party links and services",
      blocks: [
        {
          type: "p",
          text: "The Services link to and work with services that Definica does not operate, including StakeWise, Aave, wallet providers, block explorers, RPC and indexing providers, PostHog, Telegram and X. Their own terms and privacy policies apply when you use them, and Definica is not responsible for their practices.",
        },
        {
          type: "p",
          text: "Messages you post in our Telegram or X channels are visible to others there and are handled under those platforms’ policies.",
        },
      ],
    },
    {
      id: "changes",
      heading: "16. Changes to this policy",
      blocks: [
        {
          type: "p",
          text: "We may update this policy to reflect changes to the Services, our providers or the law, and we will change the date at the top of this page when we do. If a change materially affects how we use your personal data, we will tell you through the Services or our official accounts before it takes effect and, where the law requires it, ask for your consent again.",
        },
      ],
    },
    {
      id: "contact",
      heading: "17. Contact",
      blocks: [
        { type: "p", text: "You can contact us by email:" },
        {
          type: "ul",
          items: [
            "Privacy questions and requests: privacy@definica.com",
            "Security reports: security@definica.com",
            "Legal matters: legal@definica.com",
            "General questions: contact@definica.com",
          ],
        },
        {
          type: "p",
          text: "Definica’s only official accounts are t.me/definica on Telegram and x.com/definicacom on X. If Definica designates an operating entity, its name and details will be published on this page.",
        },
      ],
    },
  ],
} as const;
