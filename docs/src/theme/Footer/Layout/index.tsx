import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/Footer/Layout';

/**
 * Footer on the landing page's model: logo and social circles on top, the three link groups,
 * then a short copyright line with the legal links.
 */
const SOCIALS = [
  {
    label: 'Definica on X',
    href: 'https://x.com/definicacom',
    icon: (
      <svg viewBox="0 0 17 17" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="m9.875 7.361 5.38-6.298h-1.276L9.31 6.53 5.579 1.063H1.275l5.642 8.27-5.642 6.604H2.55l4.932-5.775 3.94 5.775h4.304L9.875 7.361ZM8.129 9.405l-.572-.823L3.01 2.029h1.958l3.67 5.288.572.824 4.771 6.874h-1.958L8.13 9.405Z"
        />
      </svg>
    ),
  },
  {
    label: 'Definica on Telegram',
    href: 'https://t.me/definica',
    icon: (
      <svg viewBox="0 0 21 18" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.7767 0.429965C19.0238 0.325956 19.2943 0.290084 19.5599 0.326082C19.8256 0.362081 20.0768 0.468633 20.2873 0.63465C20.4979 0.800667 20.6601 1.02008 20.757 1.27005C20.854 1.52002 20.8822 1.79141 20.8387 2.05597L18.5707 15.813C18.3507 17.14 16.8947 17.901 15.6777 17.24C14.6597 16.687 13.1477 15.835 11.7877 14.946C11.1077 14.501 9.02465 13.076 9.28065 12.062C9.50065 11.195 13.0007 7.93696 15.0007 5.99997C15.7857 5.23897 15.4277 4.79997 14.5007 5.49997C12.1987 7.23797 8.50265 9.88097 7.28065 10.625C6.20265 11.281 5.64065 11.393 4.96865 11.281C3.74265 11.077 2.60565 10.761 1.67765 10.376C0.423654 9.85597 0.484654 8.13197 1.67665 7.62997L18.7767 0.429965Z"
        />
      </svg>
    ),
  },
];

const LEGAL = [
  {label: 'Terms of service', href: 'https://www.definica.com/terms-of-service'},
  {label: 'Privacy policy', href: 'https://www.definica.com/privacy-policy'},
];

export default function FooterLayout({links, logo, copyright}: Props): ReactNode {
  return (
    <footer className={clsx(ThemeClassNames.layout.footer.container, 'footer', 'df-footer')}>
      <div className="container">
        <div className="df-footer__top">
          {logo && <div className="df-footer__logo">{logo}</div>}
          <ul className="df-footer__socials clean-list">
            {SOCIALS.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer">
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {links}
        <div className="df-footer__bottom">
          {copyright}
          <ul className="df-footer__legal clean-list">
            {LEGAL.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
