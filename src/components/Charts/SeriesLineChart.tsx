import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import styles from '@site/src/components/Loan/styles.module.css';

export interface LineSeries {
  key: string;
  label: string;
  color: string;
  /** Draw the series dashed, e.g. for a reference or benchmark curve. */
  dashed?: boolean;
}

interface Props {
  title: string;
  caption?: React.ReactNode;
  /** One row per x value; a series may be missing (undefined) for some rows. */
  data: Array<Record<string, number | string | undefined>>;
  xKey: string;
  xLabel?: string;
  series: LineSeries[];
  unit?: string;
}

/**
 * Multi-series line chart for curves passed in from the page (vintage curves, rates over time).
 * Missing points are left as gaps, so a young vintage simply stops where its data ends.
 */
export default function SeriesLineChart({title, caption, data, xKey, xLabel, series, unit = '%'}: Props) {
  const fmt = (v: unknown) => `${Number(v).toLocaleString('en-US', {maximumFractionDigits: 2})}${unit}`;
  return (
    <figure className={styles.figure}>
      <p className={styles.figureTitle}>{title}</p>
      <BrowserOnly fallback={<div className={styles.chart} />}>
        {() => (
          <div className={styles.chart} style={{height: 300}} role="img" aria-label={title}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{top: 8, right: 16, bottom: xLabel ? 20 : 8, left: 8}}>
                <CartesianGrid stroke="var(--book-rule)" />
                <XAxis
                  dataKey={xKey}
                  stroke="var(--book-muted)"
                  fontSize={12}
                  label={xLabel ? {value: xLabel, position: 'insideBottom', offset: -12, fontSize: 12, fill: 'var(--book-muted)'} : undefined}
                />
                <YAxis stroke="var(--book-muted)" fontSize={12} tickFormatter={fmt} width={56} />
                <Tooltip
                  formatter={fmt}
                  contentStyle={{background: 'var(--book-paper)', border: '1px solid var(--book-rule)', borderRadius: 4, fontSize: 12}}
                />
                <Legend wrapperStyle={{fontSize: 12, paddingTop: 8}} />
                {series.map((s) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={s.color}
                    strokeWidth={2}
                    strokeDasharray={s.dashed ? '5 4' : undefined}
                    dot={{r: 3}}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </BrowserOnly>
      {caption && <figcaption className={styles.figureNote}>{caption}</figcaption>}
    </figure>
  );
}
