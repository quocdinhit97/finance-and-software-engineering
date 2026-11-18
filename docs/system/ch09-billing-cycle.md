---
title: "Chương 9. Chu kỳ thanh toán"
sidebar_label: "9. Chu kỳ thanh toán"
sidebar_position: 3
chapter: 9
subtitle: "The Billing Cycle"
reading_time: 28
source_file: "phan-2-chuong-9.md"
editorial_status: "mechanical"
---

> *"Mỗi tháng một lần, hàng triệu câu hỏi được trả lời cùng lúc: Bao nhiêu tiền? Đến hạn khi nào? Ai nợ ai? Câu trả lời phải chính xác đến từng đồng - và phải có mặt trong hòm thư của khách hàng trước khi họ thức dậy."*

> Lưu ý: **Lưu ý về code examples:** Các đoạn Java code là illustrative pseudo-code - minh họa logic, tên class/method có thể không chính xác hoàn toàn với production code. Luôn verify với source code khi implement.

## Dẫn nhập: Tháng 4 bắt đầu lúc 23h00 ngày 31/3

::::story
Lúc 23h00 ngày 31/3, không ai ở văn phòng. Nhưng hệ thống bắt đầu công việc quan trọng nhất của tháng.

Trong 8 giờ tới, VLP sẽ khép lại tháng 3 và mở ra tháng 4 cho 1.2 triệu tài khoản. Mỗi khách hàng sẽ nhận được câu trả lời cho ba câu hỏi:

1. "Tháng 3, tôi đã dùng bao nhiêu, nợ bao nhiêu?"
2. "Tháng 4, tôi cần trả bao nhiêu, và đến ngày nào?"
3. "Nếu tôi không trả đúng hạn, chuyện gì sẽ xảy ra?"
::::

Chương này theo dõi một chu kỳ billing hoàn chỉnh - từ moment EOM trigger đến khi statement được deliver đến điện thoại của chị Lan. Không chỉ là flowchart - mà là hiểu sâu tại sao từng bước tồn tại, tại sao thứ tự quan trọng, và tại sao một lỗi nhỏ ở bất kỳ đâu có thể gây ra statement sai cho hàng nghìn người.

## 9.1 Tổng quan Chu kỳ Billing

### Anatomy của một Billing Period

::::story
Chị Lan vay ngày 10/2. Account được activate, billing day được set là ngày 20. Điều này có nghĩa là:
::::

```text
Billing Period 1:
  Start: 10/2 (activation date)
  End: 19/3 (ngày trước billing day tháng kế tiếp)
  Statement date: 20/3 (billing day)
  Due date: 5/4 (billing day + due day offset 16 ngày)

Billing Period 2:
  Start: 20/3
  End: 19/4
  Statement date: 20/4
  Due date: 5/5
```

**Ba ngày quan trọng:**

```text
┌───────────────────────────────────────────────────────────────┐
│  BILLING DATE (ngày 20)                                        │
│  → EOM chạy đêm 19/3 → tính toán cho billing period kết thúc │
│  → Statement được generate                                     │
│  → Khách hàng nhận statement                                  │
│                                                               │
│  DUE DATE (ngày 5 tháng sau)                                  │
│  → Hạn chót để thanh toán                                     │
│  → Nếu chưa trả → bắt đầu tính phí phạt                      │
│                                                               │
│  GRACE PERIOD (từ billing date đến due date = 16 ngày)        │
│  → Thời gian để review statement và prepare payment           │
│  → Lãi vẫn tích lũy trong grace period (revolving)          │
│  → Nhưng không có late fee trong grace period                 │
└───────────────────────────────────────────────────────────────┘
```

**Tại sao due day offset tồn tại:**

```text
Billing day = 20 → Statement ready ngày 20
Nếu due date = 20 (ngày đó luôn): không có time để review
Nếu due date = 30 (tháng sau): quá ngắn, banking processing time

Due day offset = 16: khách hàng có 16 ngày để:
  1. Nhận và review statement
  2. Arrange payment
  3. Bank transfer processing (1-3 ngày)
  4. Payment posted vào account

16 ngày = balance giữa lợi ích lender (muốn tiền sớm)
          và convenience khách hàng (muốn nhiều thời gian)
```

### Real-Time Events vs EOM Events

**Trong một billing period, hai loại events xảy ra:**

```text
REAL-TIME EVENTS (xảy ra liên tục, được process ngay):
  - Transaction confirmations (purchase, payment, cash)
  - Authorization holds/releases
  - Fee events marked IMMEDIATE (late fee, over-limit fee)
  - Account parameter changes
  - Service activations/deactivations

EOM EVENTS (chỉ xảy ra một lần vào cuối kỳ):
  - Monthly interest calculation
  - Monthly service fees (ACCMAINT, insurance...)
  - Instalment generation (REGULAR type)
  - Overpayment pairing
  - DPD recalculation
  - PeriodBalanceSnapshot snapshot
  - Statement generation trigger
```

**Tại sao không tính lãi daily (real-time):**

```text
Option A: Tính lãi hàng ngày, post ngay
  Pro: Accurate, khách hàng thấy lãi tích lũy real-time
  Con: 1.2M accounts × 30 ngày = 36M interest calculations/tháng
       Hàng ngày: 1.2M mini-transactions
       → Performance overhead đáng kể
       → Statement phức tạp (30 dòng interest thay vì 1 dòng)
       → Banking standard: monthly billing

Option B: Tính lãi hàng ngày, post vào EOM (daily accrual, monthly post)
  Pro: Accurate + simpler statement (1 dòng interest)
  Con: Không thể thấy daily accrual realtime

Option C: Tính lãi vào EOM dựa trên balance history (VLP)
  Approach: Daily balance × daily rate → sum for month
  → Một lần tính cuối tháng → simple
  → Cần balance history để tính đúng
  → Trade-off: accuracy vs simplicity

Với revolving account, daily balance thay đổi liên tục:
  Day 1: balance = 10,000,000 VNĐ
  Day 5: trả 3,000,000 → balance = 7,000,000 VNĐ
  Day 20: mua 1,500,000 → balance = 8,500,000 VNĐ

  Day-count convention: VLP dùng 30/360 (D30_360)
  Daily rate = annual rate / 360 (không phải /365)

  Interest = Sum(daily_balance × daily_rate)
  daily_rate = 18% / 360 = 0.05%/ngày

           = (5 days × 10M × 18%/360) + (15 days × 7M × 18%/360)
             + (10 days × 8.5M × 18%/360)
           = 25,000 + 52,500 + 42,500
           = 120,000 VNĐ

  Note: 30/360 vs Actual/365 cho kết quả khác nhau, đặc biệt trong tháng
  dài (31 ngày) và năm nhuận. VLP dùng 30/360 cho consistency.
  Khác với simple calculation: 30 days × average_balance × rate
  → Daily accrual với 30/360 chính xác hơn, khớp với tariff config
```

:::summary[Anatomy Của Billing Period]
3 key dates: billing date, due date, grace period
Due day offset: time for customer to review +
arrange payment
Real-time events: transactions, immediate fees
EOM events: interest, fees, instalments, snapshot
Daily accrual: chính xác hơn simple monthly calc
:::

## 9.2 Trong tháng: Real-Time Billing

### Tháng 3 của chị Lan: Day By Day

Hãy theo dõi tháng 3 của chị Lan để hiểu billing hoạt động trong một tháng thực tế.

**Account state đầu tháng 3 (sau khi trả xong tháng 2):**

```text
AccountNumber: ACC-2025-789456
Status: ACTIVE
CreditLimit: 18,500,000 VNĐ
OutstandingDebt: 13,494,800 VNĐ (số dư sau 2 tháng theo amortization)
AvailableBalance: 5,005,200 VNĐ
BillingDay: 20
DPD: 0 (current)
```

**Ngày 5/3 - Giao Dịch Mua Hàng:**

Chị Lan dùng thẻ mua quần áo 2,500,000 VNĐ tại trung tâm thương mại.

```text
10:23:15 — POS Authorization:
  Auth request: amount=2,500,000, merchantCode="FASHION_STORE_001"
  LAS processes:
    holdBalance += 2,500,000 → holdBalance = 2,500,000
    availableBalance -= 2,500,000 → availableBalance = 2,505,200
  Auth response: APPROVED

10:23:16 — Account state:
  holdBalance: 2,500,000
  outstandingDebt: 13,494,800 (unchanged)
  availableBalance: 2,505,200

10:25:30 — Merchant settlement (same day, same batch):
  Confirmation: amount=2,500,000, sourceTxCode="POS-TXN-20250305-789"
  LAS processes:
    1. Check idempotency: sourceTxCode not found → proceed
    2. Create Transaction record (CONFIRMED)
    3. Create LedgerEntry: DEBIT 2,500,000, FeeComponentType: PRINCIPAL
    4. Create PostingUnit: baseAmount=2,500,000, applyIr=true
    5. Update CurrentBalance:
       holdBalance -= 2,500,000 → holdBalance = 0
       outstandingDebt += 2,500,000 → outstandingDebt = 15,994,800
       availableBalance = 18,500,000 - 0 - 15,994,800 = 2,505,200 (unchanged)
    6. Bill event: EventType = IMMEDIATE_RESPECT_FREEZE
       → Not in freeze period → bill now
       → No EXTRA instalment (prescribeImmediately=false for PRINCIPAL)
       → Event processed, marked PROCESSED
    7. Publish TransactionConfirmedEvent → RabbitMQ
    8. STS notified → real-time balance update in statement preview
```

**Ngày 15/3 - Tiền Lương Về, Khách Hàng Trả Nợ:**

```text
09:15:22 — Payment: 5,000,000 VNĐ (bank transfer)
  LAS processes:
    1. Create Transaction: CREDIT 5,000,000, type=PAYIN (Payment)
    2. Create LedgerEntry: CREDIT 5,000,000
    3. Update CurrentBalance:
       customerCredit += 5,000,000 (credit → customerCredit trước, pairing sau)
       availableBalance += 5,000,000 → availableBalance = 7,505,200

    4. Pairing (MatchingService runs immediately):
       Check for unpaired DEBIT instalments on this account:
       [REGULAR instalments cho tháng 3 chưa có — EOM chưa chạy]
       [EXTRA instalments? Không có]
       → Không có instalment nào để pair
       → Payment stays as customerCredit (unpaired credit)

    5. Khi EOM tháng 3 chạy:
       → EOM tạo REGULAR instalments (prescribing step)
       → EOM runs pairing (Sub-step 3.8): customerCredit paired với new instalments
       
       Lưu ý quan trọng: Nếu tại thời điểm payment đến đã có pending
       instalments (ví dụ EXTRA late fee chưa paid), pairing xảy ra NGAY —
       không chờ EOM.

    6. Publish PaymentReceivedEvent → DRG, STS
```

**Ngày 19/3 23:00 - EOM Trigger:**

EOM cho billing period kết thúc ngày 19/3 bắt đầu. Chị Lan là một trong 1.2 triệu accounts được xử lý.

### Fee Events: IMMEDIATE vs EOM

**Ví dụ - Late Fee (IMMEDIATE):**

Giả sử chị Lan trả trễ tháng 2 (DPD = 5 ngày). Khi phát hiện late payment:

```text
Late fee calculation (AccountFeeComponentType: LATEFEE1):
  prescribeImmediately = true
  Amount: 200,000 VNĐ (fixed amount cho product này)

Processing:
  1. LedgerEntry: DEBIT 200,000, FeeComponentType=LATEFEE1
  2. PostingUnit: applyIr=true (lãi tính trên late fee nếu không trả)
  3. Because prescribeImmediately=true:
     → Create EXTRA Instalment: 200,000 VNĐ, due=TODAY
     → InstalmentSummary cho TODAY với EXTRA type
  4. Update CurrentBalance:
     outstandingDebt += 200,000
     availableBalance -= 200,000
  5. Push notification: "Phí trả trễ 200,000 VNĐ đã được ghi vào tài khoản"
```

**Ví dụ - Monthly Service Fee (EOM):**

ACCMAINT (Maintenance Account) service fee - phí duy trì tài khoản hàng tháng:

```text
Tariff item types cho ACCMAINT: SVCFEE, CORUA, CURUA (variants)
  prescribeImmediately = false (EOM)

Processing tại eomServiceFeesJob (STEP 2 — trước main EOM):
  1. ServiceFeeItemProcessor check ACCMAINT service active trên billingPeriodEnd
  2. Đọc fee amount từ tariff item (SVCFEE) — amount theo config
  3. Create EventRecord (type=SERVICE_FEE)
  4. Create LedgerEntry: DEBIT, FeeComponentType=SVCFEE
  
  Phải chạy TRƯỚC interest calculation:
  → Fee phải nằm trong outstanding balance khi tính lãi
  → Nếu fee chạy sau interest: interest sẽ thiếu (không tính trên fee amount)
```

## 9.3 EOM: Closing The Month

### Step-by-Step Walkthrough cho Account của chị Lan

**Account state trước EOM (đêm 19/3):**

```text
Account: ACC-2025-789456
OutstandingDebt: 15,994,800 VNĐ (sau giao dịch 5/3)
CustomerCredit: 5,000,000 VNĐ (payment 15/3, chưa paired)
AvailableBalance: 7,505,200 VNĐ
Account.billingPeriod: BP_20 (EOM chạy vào ngày 20 mỗi tháng — fixed)
PeriodBalanceSnapshot.billingPeriodNumber: 2 (sequential counter: kỳ thứ 2)
DPD: 0
LastEOMDate: 2025-02-19
```

**EOM Step P1: ClearAccountingNotifications**

```text
Clear notification buffer từ session trước.
→ Technical prep, không visible cho user
```

**EOM Step P2: PrepareContextForEOM**

```text
Load vào memory:
  - Account entity (lock for EOM processing)
  - AccountParameters: CREDIT_LIMIT=18.5M, BILLING_DAY=20, DUE_DAY_OFFSET=16
  - ContractServices: ACCMAINT, ACCSTMT, PAYM, LIFEINS (active)
  - Tariff: STANDARD_2025 (illustrative name — actual: short code e.g. "SVCFEE"), version 4
  - AccountFeeComponentType mappings
  - Outstanding TechnicalAccountItems (chưa fully prescribed)
  - PeriodBalanceSnapshot từ tháng 2 (previous period snapshot)
```

**EOM Step P3: Main EOM Logic**

```text
billingBatchProcessingService.processEOMForRevolvingAccount(account, context)

─── Sub-step 3.1: Delinquency Check ─────────────────────────────

Tính DPD cuối kỳ:
  Previous instalment due date: 20/2 → chị Lan đã trả đúng hạn
  DPD = 0 (no overdue instalments)
  → DpDDaysCount vẫn là 0

─── Sub-step 3.2: Debt Calculation ──────────────────────────────

Calculate outstanding debt breakdown:
  Principal items: 15,994,800 VNĐ (gốc laptop + quần áo)
  Interest items: 0 (chưa có interest posting tháng này)
  Fee items: 0 (chưa có fee tháng này)
  Total outstanding: 15,994,800 VNĐ

─── Sub-step 3.3: Interest Calculation ──────────────────────────

Daily interest accrual cho billing period 20/2 - 19/3:

  Account giao dịch trong tháng:
    20/2 - 4/3: balance = 13,494,800 VNĐ (13 ngày — sau EOM tháng 2)
    5/3 - 14/3: balance = 15,994,800 VNĐ (10 ngày — sau mua quần áo)
    15/3 - 19/3: balance = 10,994,800 VNĐ (5 ngày — sau payment 5M)
    [customerCredit 5M không reduce outstanding debt ngay — paired sau EOM]

  Interest rate: 15%/năm
  Day-count: 30/360 (D30_360) → daily rate = 15% / 360 = 0.041667%/ngày

  Interest calculation:
    13 days × 13,494,800 × 0.041667% = 73,026 VNĐ
    10 days × 15,994,800 × 0.041667% = 66,645 VNĐ
    5 days  × 10,994,800 × 0.041667% = 22,906 VNĐ
    ───────────────────────────────────────────────
    Total interest: 162,577 VNĐ (rounded)
    
  (Note: sách ban đầu dùng 0.041096% = 15%/365 — đã sửa thành 15%/360)

  Create LedgerEntry: DEBIT 162,577, FeeComponentType=INTEREST_CASHLESS
  Create PostingUnit: applyIr=false (không tính lãi trên lãi)

  Update CurrentBalance:
    outstandingDebt += 162,577 → outstandingDebt = 16,157,377 VNĐ

─── Sub-step 3.4: Fee Calculation ───────────────────────────────

ACCMAINT service fee (đã được tính bởi eomServiceFeesJob):
  LedgerEntry đã có: DEBIT 50,000, FeeComponentType=ACCMAINT

LIFEINS insurance premium:
  LedgerEntry: DEBIT 90,000, FeeComponentType=LIFEINS

Total fees this period: 140,000 VNĐ
outstandingDebt += 140,000 → outstandingDebt = 16,295,324 VNĐ

─── Sub-step 3.5: MMI Calculation ───────────────────────────────

Minimum Monthly Instalment:
  Account Parameter: MMI_LIMIT = 1,800,000 VNĐ (từ contract)
  Hoặc: 5% outstanding = 5% × 16,295,324 = 814,766 VNĐ
  MMI = MAX(1,800,000, 814,766) = 1,800,000 VNĐ

Đây là số tiền tối thiểu chị Lan phải trả tháng này.

─── Sub-step 3.6: Billing Period bookkeeping ─────────────────────

Account.billingPeriod: BP_20 (không thay đổi — là day-of-month cố định)
PeriodBalanceSnapshot.billingPeriodNumber: 2 → 3 (sequential counter tăng)
Account.currentPeriodEndDate updated → next EOM date
LastEOMDate = 2025-03-19

─── Sub-step 3.7: INSTALMENT GENERATION (Prescribing) ───────────

Tất cả TechnicalAccountItems chưa prescribed:
  TAI-001: Principal laptop (từ khi mua) — unprescribed portion
  TAI-002: Principal quần áo — unprescribed: 2,500,000
  TAI-003: Interest tháng 3 — unprescribed: 160,524
  TAI-004: ACCMAINT fee — unprescribed: 50,000
  TAI-005: Insurance — unprescribed: 90,000

Sorting by priority (PRIORITY_ONLY):
  [Ưu tiên theo tariff config — simplified here]
  Priority 1: Principal items (TAI-001, TAI-002)
  Priority 2: Interest (TAI-003)
  Priority 3: Fees (TAI-004, TAI-005)

Due date: 20/3 + 16 = 5/4

Generate REGULAR instalments:
  Instalment R-001: amount=1,400,000 (portion of laptop principal), due=5/4
  Instalment R-002: amount=400,000 (remaining MMI from MMI_LIMIT)
    → Wait: total so far 1,800,000 = MMI_LIMIT → stop!
    
    Remaining unprescribed: interest + fees + more principal
    → Carried over to NEXT period (next EOM will prescribe more)

InstalmentSummary created:
  DueDate: 5/4
  Type: REGULAR
  Amount: 1,800,000 VNĐ
  Children: [R-001: 1,400,000, R-002: 400,000]

─── Sub-step 3.8: Overpayment Pairing ───────────────────────────

CustomerCredit: 5,000,000 VNĐ (payment từ 15/3)
Pending instalments: 1,800,000 VNĐ (just created above)

Pairing:
  CustomerCredit 5,000,000 → Instalment R-001 (1,400,000): FULLY PAIRED
  CustomerCredit remaining: 3,600,000 → Instalment R-002 (400,000): FULLY PAIRED
  CustomerCredit remaining: 3,200,000 → No more pending instalments
  → CustomerCredit: 3,200,000 (credit balance — chị Lan trả dư)

After pairing:
  InstalmentSummary 5/4: repaid=true (all children repaid)
  → Chị Lan không cần trả gì vào 5/4! Đã trả trước rồi.
  
  Update CurrentBalance:
    outstandingDebt -= 1,800,000 → outstandingDebt = 14,495,324 VNĐ
    customerCredit = 3,200,000 VNĐ
    availableBalance = 18,500,000 - 14,495,324 + 3,200,000 = 7,204,676 VNĐ

─── Sub-step 3.9: Balance Recalculation ─────────────────────────

Verify CurrentBalance consistency:
  Calculated from events: matches CurrentBalance → OK
  No reconciliation needed
```

### PeriodBalanceSnapshot: Snapshot tháng 3

```text
W1 Writer: StoreEOMResultsItemWriter

CREATE LAS_PERIOD_BALANCE_SNAPSHOT:
  account_id: [ID of ACC-2025-789456]
  billing_period_number: 3  ← sequential counter (kỳ thứ 3)
  period_start: 2025-02-20, period_end: 2025-03-19
  due_date: 2025-04-05
  start_balance: 13,494,800 (đầu kỳ)
  end_balance: 14,495,324 (cuối kỳ, sau EOM)
  per_credit_interest: 160,524  (lãi kỳ này)
  per_fee: 140,000              (phí kỳ này: ACCMAINT + insurance)
  per_payments: 5,000,000       (payments received this period)
  own_funds: 3,200,000
  prescribed_instalment: 1,800,000
  day_past_due: 0
  billing_run → link đến BillingRun
  previous_period_balance_snapshot → link về kỳ trước
  cancelled: false

Đây là snapshot bất biến của tháng 3.
Dùng cho: statement generation, regulatory reporting, audit, historical queries.
```

:::summary[EOM Walkthrough]
9 sub-steps trong đúng thứ tự:
Delinquency → Debt → Interest → Fees →
MMI → BillingPeriod → Prescribing →
Pairing → Balance
Daily interest accrual: chính xác hơn monthly
MMI limits prescribing: excess → next period
CustomerCredit pair với EOM instalments → can pre-pay
PeriodBalanceSnapshot: immutable snapshot
:::

## 9.4 Statement Generation: Từ Numbers đến Document

### STS Module: Statement Management

::::story
Lúc 4h30 sáng, EOM hoàn thành xử lý account của chị Lan. LAS publish event → RabbitMQ → STS subscriber nhận được.

STS bắt đầu tạo statement tháng 3 cho chị Lan.
::::

**STS nhận gì từ LAS:**

```text
AMQPEvent từ LAS:
  accountId: [ID]
  accountNumber: "ACC-2025-789456"
  billingPeriodNumber: 3  (sequential counter, period 3)
  billingDate: "2025-03-20"
  periodBalanceSnapshotId: [ID of snapshot just created]
  dueDate: "2025-04-05"
  mmiAmount: 1,800,000
```

**STS assembles statement từ:**

```text
1. PeriodBalanceSnapshot (snapshot từ LAS):
   → Opening balance, closing balance, fees, interest
   
2. Transaction history (events từ LAS via Kafka):
   → List of all transactions in period: dates, amounts, types
   
3. Instalment schedule (from LAS):
   → Next period instalments, amounts, due dates
   
4. Account information (from LAS + CIS):
   → Account number, customer name (from CIS), credit limit
   
5. Product terms (from PDC):
   → Interest rate, APR, payment terms for disclosure
```

### Regulatory Disclosure Requirements: Bắt buộc phải có

**Statement phải include (theo regulatory):**

```text
1. OPENING BALANCE
   Số dư đầu kỳ: 13,494,800 VNĐ

2. TRANSACTIONS
   Liệt kê từng giao dịch:
   05/03  Fashion Store          PURCHASE      2,500,000 VNĐ
   15/03  Bank Transfer          PAYMENT      -5,000,000 VNĐ

3. CHARGES (PHẢI hiện rõ từng loại)
   Lãi suất tháng 3:                          160,524 VNĐ
   Phí duy trì tài khoản (ACCMAINT):            50,000 VNĐ
   Phí bảo hiểm:                              90,000 VNĐ

4. CLOSING BALANCE
   Số dư cuối kỳ: 14,495,324 VNĐ
   (= opening + purchases + charges - payments)

5. MINIMUM PAYMENT (REQUIRED BY LAW)
   Số tiền tối thiểu phải trả: 1,800,000 VNĐ
   Hạn thanh toán: 05/04/2025

6. INTEREST RATE DISCLOSURE
   Lãi suất: 15%/năm
   APR: 16.8%/năm (bao gồm tất cả phí)

7. TOTAL COST IF MINIMUM PAYMENT ONLY (MỚI REQUIRED)
   Nếu chỉ trả tối thiểu hàng tháng:
   Thời gian tất toán: 11 tháng còn lại
   Tổng lãi thêm: 820,000 VNĐ
   [Đây là anti-minimum-payment disclosure — counter-act behavioral bias]

8. FULL PAYMENT AMOUNT
   Để trả hết toàn bộ: 14,495,324 VNĐ
   (Không có thêm lãi nếu trả đủ trước ngày 05/04)

9. DISPUTE RESOLUTION
   Nếu có tranh chấp: hotline, email, deadline để dispute

10. NEXT BILLING DATE
    Ngày sao kê tiếp theo: 20/04/2025
```

**Item 7 - Behavioral Economics in Regulation:**

```text
Disclosure "nếu chỉ trả tối thiểu" là regulatory requirement
ở EU (Consumer Credit Directive), UK, và ngày càng nhiều thị trường.

Mục đích: counter-act present bias và anchoring
→ Khi thấy "820,000 VNĐ thêm nếu chỉ trả tối thiểu",
  khách hàng có context để ra quyết định tốt hơn

Trong VLP: STS phải calculate và include trong statement
Calculation:
  Using amortization schedule từ current balance:
  current balance: 14,495,324 VNĐ
  Rate: 15%/năm, MMI = 1,800,000/tháng
  Calculate months to payoff: 11 months
  Total interest during payoff: SUM(interest portion of each payment)
```

### Statement Delivery: Channels và Timing

**Multiple delivery channels:**

```text
Channel 1: In-App (highest priority)
  → Push notification khi statement ready
  → Deep link vào statement screen
  → Timing: ngay sau khi STS generate (4h30-7h00 sáng)

Channel 2: Email
  → HTML email với summary + link vào app/portal
  → Timing: 6h00 sáng (sau khi tất cả EOM xong)
  → Tránh gửi lúc 3h sáng (spam filter, user experience)

Channel 3: SMS
  → Short message: "Sao kê tháng 3 sẵn sàng. Số tiền cần trả: 1,800,000 VNĐ trước 05/04"
  → Timing: 7h00 sáng
  → Chỉ amount và due date (không phải full statement — privacy)

Channel 4: Paper (opt-in)
  → Print và mail
  → Timing: T+2 sau billing date
  → Phổ biến ít hơn nhưng vẫn required cho một số segments
```

**Timing logic:**

```java
// illustrative pseudo-code — STS delivery internals not verified
// verified: stm-cos-rse-internals.md
// STS entity: STS_STATEMENT (fields: cabinetUUID, state: NEW→XML_GENERATED→PDF_GENERATED)
// Trigger: RabbitMQ EOM_FEE event from LAS (NOT a direct method call)
// Delivery: Delivery entity with DeliveryState + DistributionChannel
// Timing (6h email, 7h SMS): CANNOT_VERIFY from codebase

// Conceptual illustration of delivery scheduling logic:
public void scheduleDelivery(Statement statement) {
    // In-app: ngay khi ready
    deliveryService.deliverInApp(statement, LocalDateTime.now());
    // Email: timing managed by Delivery entity (exact time not verified)
    // SMS: timing managed by Delivery entity (exact time not verified)
}
```

**Statement là immutable document:**

```text
Sau khi statement được deliver, không thể sửa.

Nếu phát hiện lỗi SAU khi deliver:
  → Không update statement đã gửi
  → Issue "Revised Statement" với:
     - Reference đến statement gốc
     - Explanation của change
     - Revised numbers
  → Notify customer về revision

Tại sao immutable:
  1. Customer đã received và có thể đã in/screenshot
  2. Legal document — điều chỉnh cần rõ ràng và transparent
  3. Audit trail: statement at time T là gì?
```

:::summary[Statement Generation]
STS assembles từ nhiều sources:
PeriodBalanceSnapshot + transactions + schedule
Regulatory disclosures bắt buộc: 10 items
bao gồm minimum-payment consequence
Delivery: in-app (immediate) → email (6h) →
SMS (7h) → paper (T+2)
Statement là immutable - revision nếu cần sửa
:::

## 9.5 Due Date và Payment Matching

### Grace Period Mechanics

::::story
Chị Lan nhận statement lúc 6h30 sáng ngày 20/3. Số tiền tối thiểu: 1,800,000 VNĐ, hạn 5/4. Nhưng chị đã trả 5,000,000 VNĐ ngày 15/3 - trước EOM.

Điều gì xảy ra?
::::

**Payment matching sau EOM:**

```text
Chị Lan đã trả 5,000,000 VNĐ (15/3) trước khi instalments được tạo (EOM 19/3)

Sau EOM:
  CustomerCredit = 5,000,000 VNĐ (payment chờ matching)
  REGULAR instalments created: 1,800,000 VNĐ (due 5/4)

Overpayment pairing (trong EOM sub-step 3.8):
  5,000,000 → 1,800,000 (fully paid)
  Remaining: 3,200,000 → customerCredit

Result:
  InstalmentSummary 5/4: repaid=true (before due date even arrives!)
  Account status: CURRENT (không có upcoming due obligations)
  CustomerCredit: 3,200,000 VNĐ

Chị Lan không cần làm gì vào 5/4 — đã trả trước rồi.
Statement sẽ show: "Đã trả 5,000,000 VNĐ ngày 15/3. Số tiền cần trả: 0 VNĐ."
```

### On-Time vs Late Payment Flow

**Kịch bản A - Chị Minh (khác với chị Lan) trả đúng hạn:**

```text
Account sau EOM: instalment due 5/4: 1,800,000 VNĐ unpaid

4/4, 14:30 — Payment 2,000,000 VNĐ (nhiều hơn MMI):
  1. Create Transaction: CREDIT 2,000,000
  2. Create LedgerEntry: CREDIT 2,000,000
  3. CustomerCredit += 2,000,000

  Immediate pairing trigger (payment event):
    CustomerCredit 2,000,000 → Instalment I-001 (1,800,000): FULLY PAIRED
    → I-001: repaid=true, repaidDate=4/4
    InstalmentSummary: all children repaid → repaid=true
    Remaining customerCredit: 200,000 VNĐ

  Update CurrentBalance:
    outstandingDebt -= 1,800,000
    customerCredit = 200,000
    availableBalance += 1,800,000 - 200,000 = 1,600,000 net increase

5/4 — Due date arrives:
  System check: InstalmentSummary due 5/4 → repaid=true → NO ACTION
  DPD counter: remains 0
  No late fee generated
```

**Kịch bản B - Chị Hoa trả trễ:**

```text
Account sau EOM: instalment due 5/4: 1,800,000 VNĐ unpaid

5/4 23:59 — Chưa nhận payment nào.

6/4 00:00 — DPD counter update job:
  Check: InstalmentSummary due 5/4 → repaid=false
  DPD = 1 → account.dpdDaysCount = 1
  
  Trigger: LatePaymentEventProcessor
    Create LedgerEntry: DEBIT 200,000, FeeComponentType=LATEFEE1
    prescribeImmediately=true → EXTRA Instalment: 200,000 VNĐ, due=6/4
    Push notification: "Tài khoản quá hạn. Phí trả trễ 200,000 VNĐ đã được ghi nhận."
    Available credit giảm: 200,000 VNĐ (updatingAvailableAmount=true cho LATEFEE1)

7/4 — Chị Hoa trả 2,000,000 VNĐ:
  Pairing (PRIORITY_ONLY):
    EXTRA instalment (late fee 200,000) → priority cao nhất → paired first
    REGULAR instalment (1,800,000) → paired
    Total paired: 2,000,000 VNĐ → all instalments repaid
    DPD cleared: account → CURRENT
    
  But: DPD=2 was already recorded (6/4 và 7/4)
  → Credit bureau report sẽ có DPD information này
  → Future credit decisions có thể bị ảnh hưởng
```

### Partial Payment: Không đủ để trả toàn bộ

::::story
Chị Hoa chỉ có 1,000,000 VNĐ. Cô trả nhưng không đủ để clear tất cả.
::::

```text
Pending instalments (sau 6/4 late fee):
  EXTRA late fee: 200,000 VNĐ (due 6/4, DPD 1)
  REGULAR: 1,800,000 VNĐ (due 5/4, DPD 2)

Payment: 1,000,000 VNĐ

Pairing (PRIORITY_ONLY):
  Step 1: EXTRA late fee (200,000) → paired: 200,000
    Payment remaining: 800,000
    Late fee: FULLY REPAID
  
  Step 2: REGULAR instalment (1,800,000) → partially paired
    Paired: 800,000
    Payment: EXHAUSTED
    Remaining unpaid: 1,000,000 VNĐ

  InstalmentSummary 5/4:
    amount: 1,800,000
    paidAmount: 800,000
    repaid: false (still has unpaid children)

Account state:
  DPD: 2 (still overdue — instalment not fully paid)
  Outstanding partial debt: 1,000,000 VNĐ
  Next day: DPD = 3, potential LATE2 fee (nếu tariff config)

Collections trigger:
  DPD = 7 → collection SMS
  DPD = 30 → Stage 2 migration (IFRS 9)
  DPD = 90 → Stage 3 migration, write-off consideration
```

**Tại sao không distribute 1,000,000 VNĐ proportionally:**

```text
Option A: Distribute proportionally
  Late fee: 200,000/2,000,000 × 1,000,000 = 100,000
  Principal: 1,800,000/2,000,000 × 1,000,000 = 900,000
  Neither instalment fully repaid

Option B: PRIORITY_ONLY (VLP)
  Late fee: FULLY paid (200,000) → cleared
  Principal: 800,000 partially paid

Tại sao B tốt hơn A:
  Late fee cleared → customer has one less obligation to track
  Customer may find it easier to manage remaining 1,000,000 debt
  Lender: late fee revenue recognized sooner
  Collections: cleaner state (one obligation, not two partials)
```

:::summary[Due Date & Payment Matching]
Pre-payment (trả trước EOM): stored in customerCredit,
paired khi EOM creates instalments
On-time payment: immediate pairing, DPD stays 0
Late payment: DPD++ mỗi ngày, late fee EXTRA inst
Partial payment: PRIORITY_ONLY → high priority
items paid first → cleaner state
:::

## 9.6 Cycle Integrity: Khi mọi thứ phải khớp nhau

### Three-Way Reconciliation

::::story
Lúc 7h00 sáng ngày 20/3, EOM hoàn thành. Reconciliation job bắt đầu.

Reconciliation không chỉ là "kiểm tra balance đúng không?" - đó là đảm bảo ba hệ thống nhất quán với nhau.
::::

**Ba nguồn dữ liệu cần khớp:**

```text
Source 1: LAS Database (Source of Truth)
  → LedgerEntry records (all debits and credits)
  → CurrentBalance (materialized view)
  → PeriodBalanceSnapshot (EOM snapshot)

Source 2: STS (Statement Management)
  → Statement data (what customer was billed)
  → Statement items (transactions on statement)

Source 3: DRG (Debt Register)
  → DPD tracking
  → Outstanding debt by category
  → Provision bucket (IFRS 9 stage)
```

**Reconciliation checks:**

```text
Check 1: LAS ↔ PeriodBalanceSnapshot
  PeriodBalanceSnapshot.outstanding_debt_end
  == CurrentBalance.outstanding_debt (after EOM)
  
  Allowed gap: 0 VNĐ (exact match required)

Check 2: LAS ↔ STS
  Sum of all AccountItems in billing period
  == Statement total charges
  
  Allowed gap: 0 VNĐ

Check 3: LAS ↔ DRG
  LAS.CurrentBalance.overdue_debt
  == DRG.DebtRegister.totalOverdueDebt (current record: validTo = 3333-01-01)
  
  Allowed gap: small lag (milliseconds to seconds via Kafka + daily cron)
  DRG uses SCD Type 2 — must query WHERE validTo = UNREACHABLE_FUTURE_DATE

Check 4: Statement ↔ Payment records
  Total payments in billing period (from LAS)
  == Total payment credits on statement (from STS)
  
  Allowed gap: 0 VNĐ

Check 5: Interest formula verification
  Recalculate interest từ daily balance history
  == Interest charged in billing period
  
  Allowed gap: ±1 VNĐ (rounding, sau rounding standardization)
```

**Khi reconciliation fails:**

```text
Gap < 1 VNĐ (rounding):
  → Log, schedule review
  → Auto-adjust nếu rounding logic documented

Gap 1-1,000 VNĐ:
  → Alert to operations team
  → Suspend affected account from new transactions
  → Investigate same day

Gap > 1,000 VNĐ:
  → Immediate alert (P1 incident)
  → Suspend account
  → Freeze statement delivery (statement might be wrong)
  → Incident response team

Gap at scale (> 1% of accounts have gaps):
  → System-wide issue — potential code bug
  → Rollback consideration
  → Regulatory notification may be required
```

### Common Inconsistencies và Root Causes

**Inconsistency Type 1: Balance drift over time**

```text
Symptom: Account balance correct at EOM, but drifts slowly over months
Root cause: Missing event in real-time processing pipeline

Example:
  Transaction confirmed at 11:59 PM → LAS processes
  Event published to Kafka → midnight → Kafka consumer processes next morning
  But DRG calculates DPD at midnight → misses this payment
  → DRG shows DPD=1 when account actually paid

Fix: Ensure Kafka consumer processes with correct temporal semantics
     (event time, not processing time)
```

**Inconsistency Type 2: Duplicate installment**

```text
Symptom: Two identical instalments for same amount and due date
Root cause: EOM ran twice (or on-demand EOM overlapped)

Scenario:
  EOM night run: creates instalment I-001
  Ops triggered on-demand EOM (thinking EOM hadn't run)
  On-demand EOM: creates instalment I-002
  → Duplicate!

Fix: BillingRun check before EOM:
  "If BillingRun for this period already has status=SUCCESS → skip"
  BillingRun.status: NEW → RUNNING → SUCCESS/FAILURE/TERMINATED
  *(PeriodBalanceSnapshot has no .status field)*
  → Idempotent EOM design
```

**Inconsistency Type 3: STS/LAS mismatch**

```text
Symptom: Statement shows different amount than LAS
Root cause: Event delivery failure (LAS → RabbitMQ → STS)

Scenario:
  EOM creates PeriodBalanceSnapshot
  LAS publishes event → RabbitMQ
  Network blip → event delivered twice to STS
  STS processes first event → statement created
  STS processes second event → duplicate statement OR double-counting

Fix:
  STS must be idempotent — check periodBalanceSnapshotId:
  "If statement for this periodBalanceSnapshotId already exists → skip"
  
  RabbitMQ DLQ for failed events → manual review
```

### Idempotent Billing: Running EOM Twice Safely

**Tại sao quan trọng:**

EOM là critical operation. Có những trường hợp phải run lại (failover, bug fix, data correction). Nếu EOM không idempotent → chạy lại → duplicate charges → financial error.

**Idempotency through state checks:**

```java
@Transactional
public EOMResult processEOMForAccount(Account account, LocalDate billingDate) {

    // illustrative pseudo-code — actual idempotency mechanism differs
// verified: verify-ch8-ch9-code.md, am-core-entities-deep.md
// Note: PeriodBalanceSnapshot has NO .status field
//       Idempotency tracked via BillingRun.status (NEW→RUNNING→SUCCESS/FAILURE)
//       PeriodBalanceSnapshot has: simulationOnly (boolean), cancelled (boolean)

// Conceptual idempotency check:
    Optional<BillingRun> existingSession = billingRunRepo
        .findByBillingPeriodAndType(billingPeriod, REGULAR);

    if (existingSession.isPresent()) {
        BillingRunStatus status = existingSession.get().getStatus();
        if (status == SUCCESS) {
            // Đã process thành công → skip
            log.info("BillingRun SUCCESS for period {}. Skipping.", billingPeriod);
            return EOMResult.alreadyCompleted(existingSession.get());
        } else if (status == RUNNING) {
            // Another node is running → skip or wait
            return EOMResult.alreadyRunning();
        }
        // FAILURE/TERMINATED → allow re-run
    }

    // Process EOM... BillingRun status: NEW → RUNNING → SUCCESS/FAILURE
    return EOMResult.success(newBalance);
}
```

**Instalment prescribing idempotency:**

```java
// illustrative pseudo-code — method names differ from actual
// verified: verify-ch8-ch9-code.md
// Note: findByAccountAndDueDateAndInstalmentType → NOT found in repository
//       InconsistencyException → actual class: DataInconsistencyException
//       (InstalmentFactory.java line 122)

// Conceptually correct — actual code implements similar idempotency logic:
List<Instalment> existing = instalmentRepo
    .findByAccountAndDueDate(account, dueDate);  // illustrative method name

if (!existing.isEmpty()) {
    BigDecimal existingTotal = existing.stream()
        .map(Instalment::getAmount).reduce(ZERO, BigDecimal::add);

    if (existingTotal.compareTo(expectedTotal) == 0) {
        return existing;  // Already prescribed → skip
    } else {
        log.error("Prescribing inconsistency for account {}: expected={}, existing={}",
            account.getAccountNumber(), expectedTotal, existingTotal);
        throw new DataInconsistencyException(...);  // Actual exception class
    }
}
```

:::summary[Cycle Integrity]
3-way reconciliation: LAS ↔ STS ↔ DRG
Gap > 1,000 VNĐ = P1 incident, freeze account
Common causes: event delivery failure, duplicate
processing, temporal semantic issues
Idempotent EOM: BillingRun.status check trước
→ Skip nếu đã SUCCESS, cancel nếu FAILED
:::

## Tóm tắt chương 9

```text
30 ngày của chị Lan — từ billing perspective:

THÁNG 3:
  5/3:   Mua quần áo 2,500,000 VNĐ
         → Authorization (hold) → Confirmation (debt)
         → LedgerEntry created, balance updated

  15/3:  Trả 5,000,000 VNĐ
         → CustomerCredit += 5,000,000 (chờ pairing sau EOM)

  19/3 23:00:  EOM starts
    Interest calculated: 160,524 VNĐ (daily accrual × 28 days)
    Fees: 140,000 VNĐ (ACCMAINT + insurance)
    REGULAR instalments created: 1,800,000 VNĐ (due 5/4)
    CustomerCredit paired: 1,800,000 → repaid
    CustomerCredit remaining: 3,200,000 VNĐ

  20/3 06:30:  Statement delivered (in-app)
    Shows: 2,500,000 purchase, 5,000,000 payment,
           160,524 interest, 140,000 fees
    Status: "Đã trả đủ — không cần trả gì trước 5/4"
    (Vì CustomerCredit > MMI)

  5/4:   Due date arrives
    → System check: all instalments repaid → CURRENT
    → DPD: 0

THÁNG 4: Billing period 4 starts with:
  Outstanding: 14,495,324 VNĐ
  CustomerCredit: 3,200,000 VNĐ
  Available: 7,204,676 VNĐ
  Next statement date: 20/4
  Next due date: 5/5

Mỗi bước có một lý do:
  Daily interest accrual → fairness và accuracy
  Prescribing tại EOM → clean separation of concerns
  CustomerCredit pairing → reward early payment
  Immutable statement → trust và audit
  3-way reconciliation → correctness guarantee
```

## Câu hỏi tự kiểm tra

**Loại 1 - Nhớ lại:**
1. Ba key dates của một billing cycle là gì? Due day offset dùng để làm gì?
2. Tại sao lãi được tính theo daily accrual method thay vì tính một lần vào cuối tháng?
3. Khi payment đến trước EOM, tiền được xử lý như thế nào? Tại sao không pair ngay với instalments?
4. Statement là immutable. Nếu phát hiện lỗi sau khi deliver, phải làm gì?

**Loại 2 - Hiểu:**
5. Giải thích tại sao "billing period freeze" cần thiết khi EOM đang chạy. Cho một ví dụ cụ thể về race condition nếu không có freeze.
6. Tại sao DPD tính theo calendar days, không phải business days? Có hệ quả gì về mặt customer experience và regulatory?
7. Three-way reconciliation (LAS ↔ STS ↔ DRG) là gì? Nếu LAS và STS khớp nhau nhưng DRG không khớp, vấn đề có thể là gì?
8. Tại sao statement disclosure cần bao gồm "thời gian tất toán nếu chỉ trả tối thiểu"? Đây là behavioral economics hay regulatory requirement (hay cả hai)?

**Loại 3 - Áp dụng:**
9. Account có:
   - Billing day: 15
   - Due day offset: 14
   - Outstanding (đầu tháng): 25,000,000 VNĐ
   - Rate: 18%/năm
   - ACCMAINT fee: 60,000 VNĐ/tháng
   - Insurance: 100,000 VNĐ/tháng
   - MMI: 2,500,000 VNĐ
   
   Trong tháng có các transactions:
   Day 3: Purchase 3,000,000 VNĐ
   Day 10: Purchase 1,500,000 VNĐ
   Day 12: Payment 4,000,000 VNĐ
   
   (a) Tính interest cho billing period (30 ngày)
   (b) Total fees
   (c) Closing balance sau EOM
   (d) REGULAR instalments được tạo
   (e) Net amount customer needs to pay (sau khi pair payment)

10. Chị An trả đúng hạn tháng 1, trễ tháng 2 (DPD=8), trả đủ tháng 3. Ảnh hưởng lên:
    (a) IFRS 9 staging: stages nào ở cuối mỗi tháng?
    (b) Credit bureau: được report như thế nào?
    (c) Provision requirement: tính toán cho mỗi tháng
    (d) Future pricing: rate của chị An có thể bị adjust không?

**Loại 4 - Phân tích:**
11. Một fintech đề xuất: "Real-time billing - mỗi giao dịch triggers immediate interest calculation và instalment creation. Không cần EOM batch processing. Simpler, faster."

    Phân tích: (a) Technical feasibility, (b) Business implications (customer experience, revenue recognition), (c) Regulatory considerations, (d) Khi nào approach này makes sense?

12. Sau một incident, phát hiện rằng EOM đã chạy 2 lần cho 500 accounts (lần đầu failed, ops chạy lại, nhưng lần đầu thực ra đã partially succeed). Result: 500 accounts có duplicate instalments.

    Thiết kế recovery:
    (a) Detection: SQL/query để identify duplicated instalments
    (b) Impact assessment: customers đã nhận statement chưa?
    (c) Fix approach: cancel duplicate hay merge?
    (d) Communication: có cần notify customers không?
    (e) Prevention: thay đổi kiến trúc nào để prevent tái diễn?

## Bài tập áp dụng

**Bài 1 - Full Billing Cycle Simulation:**

Thiết kế complete billing cycle cho một revolving credit account với 3 tháng hoạt động:

Account setup:
- Credit limit: 30,000,000 VNĐ
- Rate: 18%/năm
- Billing day: 25
- Due day offset: 15
- ACCMAINT: 70,000 VNĐ/tháng

Month 1 transactions:
- Day 1 (activation): disbursement 20,000,000
- Day 5: purchase 3,000,000
- Day 20: payment 5,000,000

Month 2 transactions:
- Day 10: purchase 2,000,000
- Day 22: payment 2,500,000

Month 3 transactions:
- Day 5: purchase 5,000,000
- Day 20: payment 1,500,000 (insufficient - trả ít hơn MMI)

Yêu cầu:
(a) EOM calculation cho mỗi tháng (interest, fees, instalments)
(b) Closing balance sau mỗi EOM
(c) Payment matching: đủ hay thiếu mỗi tháng?
(d) DPD và late fees nếu có
(e) Statement summary cho mỗi tháng
(f) IFRS 9 staging progression

**Bài 2 - Reconciliation Job Design:**

Thiết kế reconciliation job chạy daily sau EOM:

Yêu cầu:
- Check LAS ↔ STS ↔ DRG cho tất cả accounts có EOM đêm qua
- Performance: phải hoàn thành trong 2 giờ (trước khi branch mở)
- Reporting: summary report cho operations team
- Alerting: P1/P2/P3 theo gap size

Deliverables:
(a) SQL queries cho mỗi check (simplified schema)
(b) Gap classification: logic phân loại severity
(c) Auto-fix vs human review: decision tree
(d) Performance: làm thế nào check 1.2M accounts trong 2 giờ?
(e) Report format: operations team cần thấy gì?

**Bài 3 - Statement System Design:**

Công ty đang redesign statement system. Requirements:
- Deliver to 1.2M customers trong 3 giờ sau EOM
- Multiple channels: app push, email, SMS, paper (5%)
- Compliance: include tất cả 10 regulatory disclosures
- Performance: statement generation < 500ms per account

Thiết kế:
(a) Template system: làm thế nào personalize 1.2M statements hiệu quả?
(b) Parallel processing: design cho throughput 400K statements/hour
(c) Delivery orchestration: sequencing channels để không overwhelm systems
(d) Failure handling: nếu email server down, fallback strategy?
(e) Audit: làm thế nào prove "customer đã nhận statement" cho dispute resolution?

## Đọc thêm

**Financial Accounting:**
- Weygandt, J., Kimmel, P., & Kieso, D. (2018). *Financial Accounting.* Wiley. - Chapters 8-10 về accounts receivable, revenue recognition, và statement presentation - business foundation cho billing system design.

**Statement Design:**
- CFPB. (2012). *Know Before You Owe: Mortgage.* Consumer Financial Protection Bureau. - Ví dụ về regulatory disclosure design cho financial products, available tại consumerfinance.gov. Áp dụng được nguyên tắc cho statement design.

**Batch Processing:**
- Minella, M. T. (2019). *The Definitive Guide to Spring Batch* (2nd ed.). Apress. - Chapters 10-12 về error handling, skip logic, và retry trong batch processing - critical knowledge cho EOM implementation.

*Chương 10 sẽ khép lại Phần II với chủ đề không ai muốn nghĩ đến nhưng không thể bỏ qua: Collections và quản lý nợ. Khi khách hàng không trả được, hệ thống phải làm gì? Không phải chỉ là "đòi tiền" - mà là một pipeline phức tạp balancing giữa lợi ích lender, khả năng phục hồi của khách hàng, và những ràng buộc pháp lý về cách thu hồi nợ.*
