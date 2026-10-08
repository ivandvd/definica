"use client";

import { useRef } from "react";
import { AppSvg } from "../shared/AppSvg";
import { usePop, useRise } from "../shared/motion";
import { Card, MoreLink, Note, TextLink } from "../shared/page-kit/Blocks";
import { StickerIcon } from "../shared/page-kit/icons";
import kit from "../shared/page-kit/kit.module.css";
import { Section } from "../shared/page-kit/Section";
import { Statement } from "../shared/page-kit/Statement";
import { FoundationArt, MailArt, MissionStickers } from "./AboutArt";
import styles from "./about.module.css";
import { about, type Channel, type Foundation, type LayerLink } from "./content";

function Question({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  usePop(ref, { delay: 0.12 * index });

  return (
    <li ref={ref} className={styles.question}>
      <span className={`${kit.float} ${styles.bubbleFloat}`} style={{ animationDelay: `${index * -1.1}s` }}>
        <span className={styles.bubble} data-tone={index % 5}>
          {text}
        </span>
      </span>
    </li>
  );
}

/** Why Definica exists: the questions that should be easy, as speech bubbles popping in, and the answer. */
export function Why() {
  const { why } = about;
  const refAnswer = useRef<HTMLParagraphElement>(null);
  useRise(refAnswer, { delay: 0.3 });

  return (
    <Section id="why" tone="grey" surtitle={why.surtitle} title={why.title} dotColor="sky" intro={why.intro}>
      <ul className={styles.questions}>
        {why.questions.map((question, index) => (
          <Question key={question} text={question} index={index} />
        ))}
      </ul>
      <p ref={refAnswer} className={`${styles.answer} AppText-1`}>
        {why.answer}
      </p>
    </Section>
  );
}

/** The mission: the statement darkening word by word as it scrolls up, as the roadmap's north star does. */
export function Mission() {
  const { mission } = about;
  return (
    <Section
      id="mission"
      tone="white"
      surtitle={mission.surtitle}
      title={mission.title}
      dotColor="lemonade"
      deco={<MissionStickers />}
      wrapper="AppWrapper-1160"
    >
      <Statement text={mission.statement} className={`${styles.statement} AppTitle-9`} />
    </Section>
  );
}

/** The five principles, three cards over two. */
export function Principles() {
  const { principles } = about;
  return (
    <Section id="principles" tone="grey" surtitle={principles.surtitle} title={principles.title} dotColor="green" intro={principles.intro}>
      <div className={styles.principles}>
        {principles.items.map((item, index) => (
          <Card key={item.title} item={item} index={index} />
        ))}
      </div>
    </Section>
  );
}

function FoundationCard({ foundation, index }: { foundation: Foundation; index: number }) {
  const ref = useRef<HTMLElement>(null);
  useRise(ref, { delay: 0.1 * index });

  return (
    <article ref={ref} className={`${kit.card} ${kit.cardLine}`}>
      <div className={styles.foundationHead}>
        <StickerIcon name={foundation.icon} className={styles.foundationIcon} />
        <div>
          <h3 className={kit.cardTitle}>{foundation.name}</h3>
          <span className={styles.role}>{foundation.role}</span>
        </div>
      </div>
      <p className={`${kit.cardText} AppText-8`}>{foundation.text}</p>
    </article>
  );
}

/** Built on: StakeWise V3 and Aave V3 under Definica's layer, and what each provides. */
export function BuiltOn() {
  const { builtOn } = about;
  const refArt = useRef<HTMLDivElement>(null);
  useRise(refArt);

  return (
    <Section id="built-on" tone="white" surtitle={builtOn.surtitle} title={builtOn.title} dotColor="sky" intro={builtOn.intro}>
      <div ref={refArt} className={styles.foundationArt}>
        <FoundationArt />
      </div>
      <div className={`${kit.grid} ${kit.grid2}`}>
        {builtOn.items.map((foundation, index) => (
          <FoundationCard key={foundation.name} foundation={foundation} index={index} />
        ))}
      </div>
      <MoreLink link={builtOn.link} />
    </Section>
  );
}

/** What Definica connects: the three layers, each with the way to its own page. */
export function Layers() {
  const { layers } = about;
  return (
    <Section id="layers" tone="grey" surtitle={layers.surtitle} title={layers.title} dotColor="baby" intro={layers.intro}>
      <div className={`${kit.grid} ${kit.grid3}`}>
        {layers.items.map((item: LayerLink, index) => (
          <Card key={item.title} item={item} index={index}>
            <p className={`${styles.layerLink} AppText-8`}>
              <TextLink link={item.link} />
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ChannelIcon({ icon }: { icon: string }) {
  if (icon === "x" || icon === "telegram") return <AppSvg name={icon} className={styles.socialIcon} />;
  return <StickerIcon name={icon} className={styles.stickerIcon} />;
}

function ChannelLink({ channel }: { channel: Channel }) {
  // The website itself is this site; Telegram and X open in a new tab.
  const external = /^https?:\/\//.test(channel.href);
  return (
    <a className={styles.channel} href={channel.href} {...(external ? { target: "_blank", rel: "noreferrer" } : null)}>
      <span className={styles.channelIcon} aria-hidden="true">
        <ChannelIcon icon={channel.icon} />
      </span>
      <span>
        <span className={styles.channelLabel}>{channel.label}</span>
        <span className={styles.channelHandle}>{channel.handle}</span>
      </span>
    </a>
  );
}

/** Contact: where to write, the only official channels, and the warning about keys. */
export function Contact() {
  const { contact } = about;
  const refEmails = useRef<HTMLUListElement>(null);
  const refArt = useRef<HTMLDivElement>(null);
  const refChannels = useRef<HTMLDivElement>(null);
  useRise(refEmails);
  useRise(refArt, { delay: 0.15 });
  useRise(refChannels, { delay: 0.1 });

  return (
    <Section id="contact" tone="white" surtitle={contact.surtitle} title={contact.title} dotColor="green" intro={contact.intro}>
      <div className={kit.split}>
        <ul ref={refEmails} className={styles.emails}>
          {contact.emails.map((email) => (
            <li key={email.address} className={styles.email}>
              <span className={`${styles.emailLabel} AppText-8`}>{email.label}</span>
              <a className={styles.emailLink} href={`mailto:${email.address}`}>
                {email.address}
              </a>
            </li>
          ))}
        </ul>
        <div ref={refArt} className={kit.splitArt}>
          <MailArt />
        </div>
      </div>
      <div ref={refChannels} className={`${styles.channels} ${kit.gap}`}>
        <h3 className={`${kit.subhead} ${kit.subheadCentre}`}>{contact.channels.title}</h3>
        <p className={`${styles.channelsText} AppText-1`}>{contact.channels.text}</p>
        <ul className={styles.channelList}>
          {contact.channels.items.map((channel) => (
            <li key={channel.href}>
              <ChannelLink channel={channel} />
            </li>
          ))}
        </ul>
      </div>
      <div className={kit.gap}>
        <Note title={contact.safety.title} text={contact.safety.text} warn />
      </div>
    </Section>
  );
}
