import React, {useState} from 'react';
import Translate from '@docusaurus/Translate';
import {amortizationSchedule, formatVnd} from '@site/src/lib/loan';
import styles from './styles.module.css';

export default function TermComparison({defaultPrincipal = 18_500_000, defaultRate = 18, terms = [6, 12, 18, 24, 36]}: {defaultPrincipal?: number; defaultRate?: number; terms?: number[]}) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const valid = principal >= 100_000 && rate >= 0 && rate <= 100;
  return (
    <div className={styles.panel}>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <label htmlFor="tc-principal"><Translate id="calc.principal">Số tiền vay (VNĐ)</Translate></label>
          <input id="tc-principal" type="number" min={100000} step={100000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        </div>
        <div className={styles.field}>
          <label htmlFor="tc-rate"><Translate id="calc.rate">Lãi suất danh nghĩa (%/năm)</Translate></label>
          <input id="tc-rate" type="number" min={0} max={100} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>
      </div>
      {valid && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th><Translate id="calc.months">Kỳ hạn (tháng)</Translate></th>
              <th><Translate id="calc.pmt">Trả hằng tháng (PMT)</Translate></th>
              <th><Translate id="calc.totalInterest">Tổng lãi</Translate></th>
              <th><Translate id="calc.totalPayment">Tổng phải trả</Translate></th>
              <th><Translate id="tc.ratio">Lãi / gốc</Translate></th>
            </tr>
          </thead>
          <tbody>
            {terms.map((n) => {
              const s = amortizationSchedule(Math.round(principal), rate, n);
              return (
                <tr key={n}>
                  <td>{n}</td><td>{formatVnd(s.payment)}</td><td>{formatVnd(s.totalInterest)}</td>
                  <td>{formatVnd(s.totalPayment)}</td><td>{((s.totalInterest / principal) * 100).toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <p className={styles.assumptions}>
        <Translate id="tc.note">Cùng phương pháp với công cụ tính lịch trả nợ: niên kim cuối kỳ, r = lãi suất năm / 12, làm tròn HALF_UP đến đồng, kỳ cuối điều chỉnh. Tổng lãi đã bao gồm chênh lệch làm tròn ở kỳ cuối.</Translate>
      </p>
    </div>
  );
}
