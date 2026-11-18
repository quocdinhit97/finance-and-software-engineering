import React, {useMemo, useState} from 'react';
import Translate from '@docusaurus/Translate';
import {costOfCredit, formatPct, formatVnd} from '@site/src/lib/loan';
import styles from './styles.module.css';

export default function CostOfCreditCalculator() {
  const [principal, setPrincipal] = useState(18_500_000);
  const [rate, setRate] = useState(18);
  const [months, setMonths] = useState(12);
  const [upfront, setUpfront] = useState(200_000);
  const [monthlyFee, setMonthlyFee] = useState(100_000);

  const valid = principal >= 100_000 && rate >= 0 && rate <= 100 && Number.isInteger(months) && months >= 1 && months <= 120
    && upfront >= 0 && upfront < principal && monthlyFee >= 0;
  const c = useMemo(() => (valid ? costOfCredit(Math.round(principal), rate, months, Math.round(upfront), Math.round(monthlyFee)) : null),
    [principal, rate, months, upfront, monthlyFee, valid]);

  const field = (id: string, label: React.ReactNode, value: number, set: (n: number) => void, step: number) => (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" min={0} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
    </div>
  );

  return (
    <div className={styles.panel}>
      <div className={styles.inputs}>
        {field('cc-principal', <Translate id="calc.principal">Số tiền vay (VNĐ)</Translate>, principal, setPrincipal, 100000)}
        {field('cc-rate', <Translate id="calc.rate">Lãi suất danh nghĩa (%/năm)</Translate>, rate, setRate, 0.1)}
        {field('cc-months', <Translate id="calc.months">Kỳ hạn (tháng)</Translate>, months, setMonths, 1)}
        {field('cc-upfront', <Translate id="cost.upfront">Phí trả trước, trừ vào giải ngân (VNĐ)</Translate>, upfront, setUpfront, 10000)}
        {field('cc-monthly', <Translate id="cost.monthly">Phí cố định mỗi tháng (VNĐ)</Translate>, monthlyFee, setMonthlyFee, 10000)}
      </div>
      {!valid && <p className={styles.error}><Translate id="cost.invalid">Kiểm tra lại dữ liệu: phí trả trước phải nhỏ hơn số tiền vay, kỳ hạn từ 1 đến 120 tháng.</Translate></p>}
      {c && (
        <div className={styles.results}>
          <div><div className={styles.metricLabel}><Translate id="cost.net">Thực nhận</Translate></div><div className={styles.metricValue}>{formatVnd(c.netDisbursed)}</div></div>
          <div><div className={styles.metricLabel}><Translate id="cost.outflow">Trả mỗi tháng (gồm phí)</Translate></div><div className={styles.metricValue}>{formatVnd(c.monthlyOutflow)}</div></div>
          <div><div className={styles.metricLabel}><Translate id="cost.nominal">Lãi suất danh nghĩa</Translate></div><div className={styles.metricValue}>{formatPct(rate / 100)}</div></div>
          <div><div className={styles.metricLabel}>IRR / tháng</div><div className={styles.metricValue}>{formatPct(c.irrMonthly, 3)}</div></div>
          <div><div className={styles.metricLabel}>APR = IRR × 12</div><div className={styles.metricValue}>{formatPct(c.apr)}</div></div>
          <div><div className={styles.metricLabel}>EIR = (1 + IRR)¹² − 1</div><div className={styles.metricValue}>{formatPct(c.eir)}</div></div>
        </div>
      )}
      <div className={styles.assumptions}>
        <Translate id="calc.assumptionsTitle">Giả định và phương pháp tính:</Translate>
        <ul>
          <li><Translate id="cost.a1">Dòng tiền kỳ 0 = số tiền vay trừ phí trả trước. Dòng tiền kỳ 1 đến n = khoản trả góp theo lịch khấu hao (kể cả điều chỉnh kỳ cuối) cộng phí cố định hằng tháng.</Translate></li>
          <li><Translate id="cost.a2">IRR theo tháng được giải bằng phương pháp chia đôi (bisection). APR là IRR tháng nhân 12 (không ghép lãi); EIR ghép lãi 12 kỳ.</Translate></li>
          <li><Translate id="cost.a3">Cách tính APR thực tế phụ thuộc quy định từng thị trường. Đây là công cụ minh họa, không thay thế cách tính được cơ quan quản lý quy định.</Translate></li>
        </ul>
      </div>
    </div>
  );
}
