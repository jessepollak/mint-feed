'use client';

import {
  DISCORD_LINK,
  FIGMA_LINK,
  GITHUB_LINK,
  ONCHAINKIT_LINK,
  TWITTER_LINK,
} from 'src/links';
import ArrowSvg from 'src/svg/ArrowSvg';

const docLinks = [
  { href: ONCHAINKIT_LINK, title: 'Docs' },
  { href: GITHUB_LINK, title: 'Github' },
  { href: DISCORD_LINK, title: 'Discord' },
  { href: FIGMA_LINK, title: 'Figma' },
  { href: TWITTER_LINK, title: 'X' },
];

export default function Footer() {
  return (
    <section className="mt-auto mb-2 flex w-full flex-col flex-col-reverse justify-between gap-2 md:mt-8 md:mb-6 md:flex-row">
      <ul className="mt-4 flex max-w-full flex-col flex-wrap justify-center gap-3 md:mt-0 md:flex-row md:justify-start md:gap-6">
        {docLinks.map(({ href, title }) => (
          <li className="flex" key={href}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title={title}
              className="flex items-center gap-1"
            >
              <p>{title}</p>
              <ArrowSvg />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
