import React, {type ReactNode} from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';
import {Clock, Printer} from 'lucide-react';
import ReadingProgress from '@site/src/components/ReadingProgress';
import {sendEvent} from '@site/src/lib/analytics';
import styles from './styles.module.css';

type Props = WrapperProps<typeof ContentType>;

/** Label of the sidebar group (category) that contains the given permalink. */
function findGroupLabel(items: PropSidebarItem[], permalink: string, parent?: string): string | undefined {
  for (const item of items) {
    if (item.type === 'category') {
      const found = findGroupLabel(item.items, permalink, item.label);
      if (found) return found;
    } else if (item.type === 'link' && item.href === permalink) {
      return parent;
    }
  }
  return undefined;
}

interface BookFrontMatter {
  chapter?: number;
  subtitle?: string;
  reading_time?: number;
  lang?: string;
}

/**
 * Page header in the style of a documentation reader: section eyebrow, title,
 * lead paragraph (front matter description) and a meta line. The default
 * synthetic title rendered by Docusaurus is hidden in CSS (.theme-doc-markdown > header).
 */
export default function ContentWrapper(props: Props): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const fm = frontMatter as BookFrontMatter;
  const sidebar = useDocsSidebar();
  const {i18n} = useDocusaurusContext();
  const untranslated = i18n.currentLocale !== i18n.defaultLocale && fm.lang !== i18n.currentLocale;
  const section = sidebar ? findGroupLabel(sidebar.items, metadata.permalink) : undefined;

  const isChapter = fm.chapter !== undefined;
  const onPrint = () => {
    sendEvent('print_chapter', {chapter: fm.chapter});
    window.print();
  };

  return (
    <>
      {isChapter && <ReadingProgress />}
      <header className={styles.header}>
        {section && <p className={styles.eyebrow}>{section}</p>}
        <h1 className={styles.title}>{metadata.title}</h1>
        {(frontMatter as {description?: string}).description && (
          <p className={styles.lead}>{(frontMatter as {description?: string}).description}</p>
        )}
        {(fm.chapter !== undefined || fm.subtitle || fm.reading_time !== undefined) && (
          <p className={styles.meta}>
            {fm.chapter !== undefined && (
              <span>{translate({id: 'book.chapter', message: 'Chương {n}'}, {n: String(fm.chapter)})}</span>
            )}
            {fm.subtitle && <span className={styles.subtitle}>{fm.subtitle}</span>}
            {fm.reading_time !== undefined && (
              <span className={styles.time}>
                <Clock size={14} strokeWidth={1.8} aria-hidden="true" />
                {translate({id: 'book.readingTime', message: 'Khoảng {m} phút đọc'}, {m: String(fm.reading_time)})}
              </span>
            )}
            {isChapter && (
              <span className={`${styles.printItem} print-hide`}>
                <button type="button" className={styles.print} onClick={onPrint}>
                  <Printer size={14} strokeWidth={1.8} aria-hidden="true" />
                  <Translate id="book.print">In hoặc lưu PDF</Translate>
                </button>
              </span>
            )}
          </p>
        )}
      </header>
      {untranslated && (
        <div className={styles.notice} role="note">
          <Translate id="book.untranslated">
            This page has not been translated yet and is shown in the original Vietnamese.
          </Translate>
        </div>
      )}
      <Content {...props} />
    </>
  );
}
