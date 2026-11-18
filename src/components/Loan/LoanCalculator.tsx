import React, {useMemo, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, {translate} from '@docusaurus/Translate';
import {amortizationSchedule, formatVnd} from '@site/src/lib/loan';
import {BalanceChart, SplitChart} from './ScheduleCharts';
import {useLoanLabels} from './labels';
import styles from './styles.module.css';

interface Props {
  defaultPrincipal?: number;
  defaultRate?: number;
  defaultMonths?: number;
}

const MAX_PRINCIPAL = 10_000_000_000;

export default function LoanCalculator({defaultPrincipal = 18_500_000, defaultRate = 18, defaultMonths = 12}: Props) {
  const labels = useLoanLabels();
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const [months, setMonths] = useState(defaultMonths);
  const [chart, setChart] = useState<'split' | 'balance'>('split');

  const valid = Number.isFinite(principal) && principal >= 100_000 && principal <= MAX_PRINCIPAL
    && Number.isFinite(rate) && rate >= 0 && rate <= 100
    && Number.isInteger(months) && months >= 1 && months <= 120;
  const s = useMemo(() => (valid ? amortizationSchedule(Math.round(principal), rate, months) : null), [principal, rate, months, valid]);

  return (
    <div className={styles.panel}>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <label htmlFor="lc-principal"><Translate id="calc.principal">Số tiền vay (VNĐ)</Translate></label>
          <input id="lc-principal" type="number" min={100000} step={100000} value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label htmlFor="lc-rate"><Translate id="calc.rate">Lãi suất danh nghĩa (%/năm)</Translate></label>
          <input id="lc-rate" type="number" min={0} max={100} step={0.1} value={rate}
            onChange={(e) => setRate(Number(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label htmlFor="lc-months"><Translate id="calc.months">Kỳ hạn (tháng)</Translate></label>
          <input id="lc-months" type="number" min={1} max={120} step={1} value={months}
            onChange={(e) => setMonths(Number(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label htmlFor="lc-frequency"><Translate id="calc.frequency">Tần suất trả</Translate></label>
          <select id="lc-frequency" value="monthly" disabled>
            <option value="monthly">{translate({id: 'calc.monthly', message: 'Hằng tháng'})}</option>
          </select>
        </div>
      </div>

      {!valid && (
        <p className={styles.error}>
          <Translate id="calc.invalid">Nhập số tiền từ 100.000 VNĐ, lãi suất từ 0 đến 100%/năm và kỳ hạn nguyên từ 1 đến 120 tháng.</Translate>
        </p>
      )}

      {s && (
        <>
          <div className={styles.results}>
            <div><div className={styles.metricLabel}><Translate id="calc.pmt">Trả hằng tháng (PMT)</Translate></div><div className={styles.metricValue}>{formatVnd(s.payment)}</div></div>
            <div><div className={styles.metricLabel}><Translate id="calc.lastPayment">Kỳ cuối (đã điều chỉnh)</Translate></div><div className={styles.metricValue}>{formatVnd(s.rows[s.rows.length - 1].payment)}</div></div>
            <div><div className={styles.metricLabel}><Translate id="calc.totalInterest">Tổng lãi</Translate></div><div className={styles.metricValue}>{formatVnd(s.totalInterest)}</div></div>
            <div><div className={styles.metricLabel}><Translate id="calc.totalPayment">Tổng phải trả</Translate></div><div className={styles.metricValue}>{formatVnd(s.totalPayment)}</div></div>
          </div>

          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
            <button type="button" className={styles.toggle} aria-pressed={chart === 'split'} onClick={() => setChart('split')}>
              <Translate id="calc.chartSplit">Gốc và lãi theo kỳ</Translate>
            </button>
            <button type="button" className={styles.toggle} aria-pressed={chart === 'balance'} onClick={() => setChart('balance')}>
              <Translate id="calc.chartBalance">Dư nợ gốc theo thời gian</Translate>
            </button>
          </div>
          <BrowserOnly fallback={<div className={styles.chart} />}>
            {() => (chart === 'split'
              ? <SplitChart rows={s.rows} labels={labels} />
              : <BalanceChart rows={s.rows} principal={Math.round(principal)} labels={labels} />)}
          </BrowserOnly>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{labels.period}</th><th>{labels.opening}</th><th>{labels.interest}</th>
                  <th>{labels.principal}</th><th>{labels.payment}</th><th>{labels.closing}</th>
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r) => (
                  <tr key={r.period}>
                    <td>{r.period}</td><td>{formatVnd(r.openingBalance)}</td><td>{formatVnd(r.interest)}</td>
                    <td>{formatVnd(r.principal)}</td><td>{formatVnd(r.payment)}</td><td>{formatVnd(r.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className={styles.assumptions}>
        <Translate id="calc.assumptionsTitle">Giả định và phương pháp tính:</Translate>
        <ul>
          <li><Translate id="calc.a1">Niên kim thông thường (ordinary annuity): trả vào cuối mỗi kỳ tháng.</Translate></li>
          <li><Translate id="calc.a2">Lãi suất kỳ r = lãi suất danh nghĩa năm / 12, tương đương quy ước 30/360.</Translate></li>
          <li><Translate id="calc.a3">PMT làm tròn HALF_UP đến đồng; lãi mỗi kỳ = dư nợ đầu kỳ × r, làm tròn HALF_UP đến đồng; kỳ cuối trả toàn bộ dư nợ còn lại.</Translate></li>
          <li><Translate id="calc.a4">Chưa gồm phí và bảo hiểm. Xem công cụ chi phí tín dụng để tính APR và EIR khi có phí.</Translate></li>
          <li><Translate id="calc.a5">Chỉ hỗ trợ trả hằng tháng vì đây là tần suất duy nhất được mô tả trong tài liệu nguồn.</Translate></li>
        </ul>
      </div>
    </div>
  );
}
