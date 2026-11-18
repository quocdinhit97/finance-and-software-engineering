import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import styles from '@site/src/components/Loan/styles.module.css';

export interface CostSeries {
  key: string;
  label: string;
  color: string;
}

interface Props {
  title: string;
  caption?: React.ReactNode;
  /** One row per category (e.g. product); numeric fields in percentage points. */
  data: Array<Record<string, number | string>>;
  categoryKey: string;
  series: CostSeries[];
  unit?: string;
}

/**
 * Stacked horizontal bars for a cost or rate decomposition (percentage points).
 * Data is passed in from the page so the figure always matches the table next to it.
 */
export default function CostStackChart({title, caption, data, categoryKey, series, unit = '%'}: Props) {
  return (
    <figure className={styles.figure}>
      <p className={styles.figureTitle}>{title}</p>
      <BrowserOnly fallback={<div className={styles.chart} />}>
        {() => (
          <div className={styles.chart} style={{height: 80 + data.length * 70}} role="img" aria-label={title}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{top: 8, right: 16, bottom: 8, left: 8}}>
                <CartesianGrid stroke="var(--book-rule)" horizontal={false} />
                <XAxis type="number" stroke="var(--book-muted)" fontSize={12} tickFormatter={(v) => `${v}${unit}`} />
                <YAxis type="category" dataKey={categoryKey} stroke="var(--book-muted)" fontSize={12} width={110} />
                <Tooltip
                  formatter={(v) => `${Number(v).toLocaleString('en-US', {maximumFractionDigits: 2})}${unit}`}
                  contentStyle={{background: 'var(--book-paper)', border: '1px solid var(--book-rule)', borderRadius: 4, fontSize: 12}}
                />
                <Legend wrapperStyle={{fontSize: 12, paddingTop: 8}} />
                {series.map((s) => (
                  <Bar key={s.key} dataKey={s.key} name={s.label} stackId="a" fill={s.color} isAnimationActive={false} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </BrowserOnly>
      {caption && <figcaption className={styles.figureNote}>{caption}</figcaption>}
    </figure>
  );
}
