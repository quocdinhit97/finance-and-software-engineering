import React, {useMemo, useState} from 'react';
import Translate from '@docusaurus/Translate';
import {earlySettlement, formatVnd} from '@site/src/lib/loan';
import styles from './styles.module.css';

interface Props {
  defaultPrincipal?: number;
  defaultRate?: number;
  defaultMonths?: number;
  defaultPaid?: number;
  defaultDays?: number;
  defaultFeePct?: number;
}

/**
 * Settlement amount for paying off an instalment loan early, compared with
 * continuing the schedule. Same rounding rules as the amortization schedule.
 */
export default function EarlySettlementCalculator({
  defaultPrincipal = 18_500_000,
  defaultRate = 18,
  defaultMonths = 12,
  defaultPaid = 6,
  defaultDays = 0,
  defaultFeePct = 0,
}: Props) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const [months, setMonths] = useState(defaultMonths);
  const [paid, setPaid] = useState(defaultPaid);
  const [days, setDays] = useState(defaultDays);
  const [feePct, setFeePct] = useState(defaultFeePct);

  const valid = Number.isFinite(principal) && principal >= 100_000 && principal <= 10_000_000_000
    && Number.isFinite(rate) && rate >= 0 && rate <= 100
    && Number.isInteger(months) && months >= 2 && months <= 120
    && Number.isInteger(paid) && paid >= 0 && paid < months
    && Number.isInteger(days) && days >= 0 && days <= 30
    && Number.isFinite(feePct) && feePct >= 0 && feePct <= 20;
  const r = useMemo(
    () => (valid ? earlySettlement(Math.round(principal), rate, months, paid, days, feePct) : null),
    [principal, rate, months, paid, days, feePct, valid],
  );

  const field = (id: string, label: React.ReactNode, value: number, set: (n: number) => void, step: number, max?: number) => (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" min={0} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} />
    </div>
  );

  const metric = (label: React.ReactNode, value: string) => (
    <div>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value}</div>
    </div>
  );

  return (
    <div className={styles.panel}>
      <div className={styles.inputs}>
        {field('es-principal', <Translate id="calc.principal">Số tiền vay (VNĐ)</Translate>, principal, setPrincipal, 100000)}
        {field('es-rate', <Translate id="calc.rate">Lãi suất danh nghĩa (%/năm)</Translate>, rate, setRate, 0.1, 100)}
        {field('es-months', <Translate id="calc.months">Kỳ hạn (tháng)</Translate>, months, setMonths, 1, 120)}
        {field('es-paid', <Translate id="settle.paid">Số kỳ đã trả</Translate>, paid, setPaid, 1, Math.max(0, months - 1))}
        {field('es-days', <Translate id="settle.days">Số ngày kể từ kỳ đã trả gần nhất (0-30)</Translate>, days, setDays, 1, 30)}
        {field('es-fee', <Translate id="settle.fee">Phí trả trước hạn (% dư nợ gốc)</Translate>, feePct, setFeePct, 0.5, 20)}
      </div>

      {!valid && (
        <p className={styles.error}>
          <Translate id="settle.invalid">Kiểm tra lại dữ liệu: kỳ hạn từ 2 đến 120 tháng, số kỳ đã trả nhỏ hơn kỳ hạn, số ngày từ 0 đến 30, phí trả trước từ 0 đến 20%.</Translate>
        </p>
      )}

      {r && (
        <>
          <div className={styles.results}>
            {metric(<Translate id="settle.outstanding">Dư nợ gốc còn lại</Translate>, formatVnd(r.outstandingPrincipal))}
            {metric(<Translate id="settle.accrued">Lãi phát sinh từ kỳ gần nhất</Translate>, formatVnd(r.accruedInterest))}
            {metric(<Translate id="settle.feeAmount">Phí trả trước hạn</Translate>, formatVnd(r.prepaymentFee))}
            {metric(<Translate id="settle.amount">Số tiền tất toán</Translate>, formatVnd(r.settlementAmount))}
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th><Translate id="settle.colSchedule">Tiếp tục trả theo lịch</Translate></th>
                  <th><Translate id="settle.colSettle">Tất toán ngay</Translate></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Translate id="settle.rowStillPay">Số tiền còn phải trả</Translate></td>
                  <td>{formatVnd(r.remainingScheduled)}</td>
                  <td>{formatVnd(r.settlementAmount)}</td>
                </tr>
                <tr>
                  <td><Translate id="settle.rowInterest">Lãi còn phải trả</Translate></td>
                  <td>{formatVnd(r.remainingScheduledInterest)}</td>
                  <td>{formatVnd(r.accruedInterest)}</td>
                </tr>
                <tr>
                  <td><Translate id="settle.rowTotal">Tổng đã trả và sẽ trả cho khoản vay</Translate></td>
                  <td>{formatVnd(r.paidSoFar + r.remainingScheduled)}</td>
                  <td>{formatVnd(r.paidSoFar + r.settlementAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.figureNote}>
            {r.borrowerSaving >= 0 ? (
              <Translate id="settle.saving" values={{amount: formatVnd(r.borrowerSaving)}}>
                {'Tất toán ngay giúp người vay trả ít hơn {amount} VNĐ so với tiếp tục trả theo lịch. Đây cũng là phần thu nhập lãi bên cho vay mất đi, trước khi tính tới việc cho vay lại số tiền thu về.'}
              </Translate>
            ) : (
              <Translate id="settle.loss" values={{amount: formatVnd(-r.borrowerSaving)}}>
                {'Với mức phí này, tất toán ngay khiến người vay trả nhiều hơn {amount} VNĐ so với tiếp tục trả theo lịch.'}
              </Translate>
            )}
          </p>
        </>
      )}

      <div className={styles.assumptions}>
        <Translate id="calc.assumptionsTitle">Giả định và phương pháp tính:</Translate>
        <ul>
          <li><Translate id="settle.a1">Lịch trả nợ là niên kim cuối kỳ, làm tròn giống công cụ tính lịch trả nợ. Dư nợ gốc còn lại là dư nợ cuối kỳ của kỳ đã trả gần nhất.</Translate></li>
          <li><Translate id="settle.a2">Lãi phát sinh tính theo quy ước 30/360: dư nợ gốc × lãi suất năm / 360 × số ngày, làm tròn HALF_UP về đồng.</Translate></li>
          <li><Translate id="settle.a3">Phí trả trước hạn tính theo phần trăm dư nợ gốc. Mức phí và cách tính thực tế do hợp đồng và quy định từng thị trường quyết định.</Translate></li>
        </ul>
      </div>
    </div>
  );
}
