/**
 * Sidebar link with a lucide icon (ejected from @docusaurus/theme-classic DocSidebarItem/Link).
 */
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/DocSidebarItem/Link';
import {iconForDoc} from '../icons';
import styles from './styles.module.css';

export default function DocSidebarItemLink({item, onItemClick, activePath, level, index, ...props}: Props): ReactNode {
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const Icon = iconForDoc((item as {docId?: string}).docId);
  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx('menu__link', styles.link, {'menu__link--active': isActive})}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {onClick: onItemClick ? () => onItemClick(item) : undefined})}
        {...props}>
        <Icon className={styles.icon} size={16} strokeWidth={1.8} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}
