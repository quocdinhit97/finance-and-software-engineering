import React, {type ReactNode} from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useLocation} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type Props = WrapperProps<typeof NavbarType>;

interface Tab {
  label: string;
  to: string;
  /** Path prefixes (without base URL) that make this tab active. */
  match: string[];
}

function useTabs(): Tab[] {
  return [
    {label: translate({id: 'tabs.read', message: 'Đọc sách'}), to: '/docs/introduction/preface', match: ['/docs/introduction', '/docs/foundations', '/docs/products', '/docs/system', '/docs/intelligence', '/docs/future']},
    {label: translate({id: 'tabs.toc', message: 'Mục lục'}), to: '/docs/table-of-contents', match: ['/docs/table-of-contents']},
    {label: translate({id: 'tabs.glossary', message: 'Thuật ngữ'}), to: '/docs/glossary', match: ['/docs/glossary']},
    {label: translate({id: 'tabs.appendices', message: 'Phụ lục'}), to: '/docs/appendices', match: ['/docs/appendices']},
    {label: translate({id: 'tabs.tools', message: 'Công cụ tính'}), to: '/docs/tools', match: ['/docs/tools']},
  ];
}

function SectionTabs() {
  const tabs = useTabs();
  const {pathname} = useLocation();
  const base = useBaseUrl('/');
  const path = '/' + pathname.slice(base.length).replace(/^\/+/, '');
  return (
    <nav className={styles.tabs} aria-label={translate({id: 'tabs.aria', message: 'Các phần của sách'})}>
      <div className={styles.inner}>
        {tabs.map((t) => {
          const active = t.match.some((m) => path === m || path.startsWith(m + '/'));
          return (
            <Link key={t.to} to={t.to} className={active ? `${styles.tab} ${styles.active}` : styles.tab} aria-current={active ? 'page' : undefined}>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Top bar (logo, search, actions) plus a row of section tabs, sticky together. */
export default function NavbarWrapper(props: Props): ReactNode {
  return (
    <div className={styles.shell}>
      <Navbar {...props} />
      <SectionTabs />
    </div>
  );
}
