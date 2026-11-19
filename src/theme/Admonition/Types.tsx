import React, {type ReactNode} from 'react';
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';
import {translate} from '@docusaurus/Translate';
import styles from './book-callouts.module.css';

interface Props {
  title?: ReactNode;
  children: ReactNode;
}

function Callout({kind, label, title, children}: Props & {kind: 'summary' | 'story' | 'key'; label: string}) {
  return (
    // role="note", not <aside>: callouts are part of the text, not page landmarks,
    // and a page has many of them with the same label.
    <div role="note" className={`${styles.callout} ${styles[kind]}`} aria-label={typeof title === 'string' ? `${label}: ${title}` : label}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {title && <span className={styles.title}>{title}</span>}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

/** Section summary: the points a reader should retain. */
function SummaryAdmonition(props: Props) {
  return <Callout kind="summary" label={translate({id: 'callout.summary', message: 'Tóm tắt'})} {...props} />;
}

/** Narrative passage: a scenario following the book's characters. */
function StoryAdmonition(props: Props) {
  return <Callout kind="story" label={translate({id: 'callout.story', message: 'Câu chuyện'})} {...props} />;
}

/** Key concept, definition or rule that the rest of the section builds on. */
function KeyAdmonition(props: Props) {
  return <Callout kind="key" label={translate({id: 'callout.key', message: 'Trọng tâm'})} {...props} />;
}

const AdmonitionTypes = {
  ...DefaultAdmonitionTypes,
  summary: SummaryAdmonition,
  story: StoryAdmonition,
  key: KeyAdmonition,
};

export default AdmonitionTypes;
