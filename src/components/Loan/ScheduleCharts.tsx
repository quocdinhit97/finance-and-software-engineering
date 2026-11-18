import React from 'react';
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type {ScheduleRow} from '@site/src/lib/loan';
import {formatVnd} from '@site/src/lib/loan';
import {AXIS, BALANCE, GRID, INTEREST, PRINCIPAL, compactVnd} from './ChartTheme';
import styles from './styles.module.css';

const tooltipStyle = {
  background: 'var(--book-paper)',
  border: '1px solid var(--book-rule)',
  borderRadius: 4,
  fontSize: 12,
};

export function SplitChart({rows, labels}: {rows: ScheduleRow[]; labels: {principal: string; interest: string; period: string}}) {
  return (
    <div className={styles.chart} role="img" aria-label={`${labels.principal} / ${labels.interest}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{top: 8, right: 8, bottom: 8, left: 8}}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="period" stroke={AXIS} fontSize={12} tickLine={false} label={{value: labels.period, position: 'insideBottom', offset: -4, fontSize: 12, fill: AXIS}} />
          <YAxis stroke={AXIS} fontSize={12} tickFormatter={compactVnd} width={56} tickLine={false} />
          <Tooltip formatter={(v) => `${formatVnd(Number(v))} VNĐ`} labelFormatter={(l) => `${labels.period} ${l}`} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{fontSize: 12, paddingTop: 8}} />
          <Bar dataKey="principal" name={labels.principal} stackId="a" fill={PRINCIPAL} isAnimationActive={false} />
          <Bar dataKey="interest" name={labels.interest} stackId="a" fill={INTEREST} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BalanceChart({rows, principal, labels}: {rows: ScheduleRow[]; principal: number; labels: {balance: string; period: string}}) {
  const data = [{period: 0, closingBalance: principal}, ...rows.map((r) => ({period: r.period, closingBalance: r.closingBalance}))];
  return (
    <div className={styles.chart} role="img" aria-label={labels.balance}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{top: 8, right: 8, bottom: 8, left: 8}}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="period" stroke={AXIS} fontSize={12} tickLine={false} label={{value: labels.period, position: 'insideBottom', offset: -4, fontSize: 12, fill: AXIS}} />
          <YAxis stroke={AXIS} fontSize={12} tickFormatter={compactVnd} width={56} tickLine={false} />
          <Tooltip formatter={(v) => `${formatVnd(Number(v))} VNĐ`} labelFormatter={(l) => `${labels.period} ${l}`} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="closingBalance" name={labels.balance} stroke={BALANCE} strokeWidth={2} dot={{r: 2}} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
