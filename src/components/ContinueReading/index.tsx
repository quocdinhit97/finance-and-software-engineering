import React, {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {loadPosition, type ReadingPosition} from '@site/src/lib/readingPosition';
import {sendEvent} from '@site/src/lib/analytics';
import styles from './styles.module.css';

/** "Continue reading" card for returning readers; renders nothing on a first visit. */
export default function ContinueReading(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const [pos, setPos] = useState<ReadingPosition | null>(null);
  useEffect(() => {
    setPos(loadPosition(i18n.currentLocale));
  }, [i18n.currentLocale]);
  if (!pos) return null;
  const to = pos.sectionId && pos.percent > 3 && pos.percent < 97 ? `${pos.path}#${pos.sectionId}` : pos.path;
  return (
    <aside className={styles.card} aria-labelledby="continue-reading-title">
      <p id="continue-reading-title" className={styles.label}>
        <Translate id="home.continue.label">Đọc tiếp từ lần trước</Translate>
      </p>
      <Link className={styles.link} to={to} onClick={() => sendEvent('continue_reading_click', {target: pos.path, percent: pos.percent})}>
        <span className={styles.title}>{pos.title}</span>
        {pos.section && <span className={styles.section}>{pos.section}</span>}
      </Link>
      <div className={styles.progress} aria-hidden="true">
        <span style={{width: `${Math.max(3, pos.percent)}%`}} />
      </div>
      <p className={styles.meta}>
        <Translate id="home.continue.percent" values={{percent: String(pos.percent)}}>
          {'Đã đọc khoảng {percent}% chương'}
        </Translate>
      </p>
    </aside>
  );
}
