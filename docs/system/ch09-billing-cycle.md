---
title: "Chương 9. Chu kỳ thanh toán"
sidebar_label: "9. Chu kỳ thanh toán"
sidebar_position: 3
chapter: 9
subtitle: "The Billing Cycle"
reading_time: 30
description: "Một chu kỳ billing hoàn chỉnh của chị Lan: các mốc ngày, giao dịch trong kỳ, từng bước EOM với số liệu cụ thể, sao kê và các nội dung bắt buộc công bố, ghép thanh toán khi trả trước, đúng hạn, trễ hạn và trả thiếu, và đối soát giữa LAS, STS, DRG."
source_file: "phan-2-chuong-9.md"
editorial_status: "edited"
---

> *"Mỗi tháng một lần, hàng triệu câu hỏi được trả lời cùng lúc: bao nhiêu tiền, đến hạn khi nào, ai nợ ai. Câu trả lời phải chính xác đến từng đồng, và phải có trong hộp thư của khách hàng trước khi họ thức dậy."*

## Dẫn nhập: tháng mới bắt đầu lúc 23 giờ

::::story
23 giờ đêm 19/3, văn phòng không còn ai. Nhưng hệ thống bắt đầu công việc quan trọng nhất của tháng.

Trong tám giờ tới, VLP khép lại kỳ billing cho 1.2 triệu tài khoản. Sáng hôm sau, mỗi khách hàng nhận được câu trả lời cho ba câu hỏi:

1. "Kỳ vừa rồi tôi đã dùng bao nhiêu, đang nợ bao nhiêu?"
2. "Kỳ này tôi phải trả bao nhiêu, trước ngày nào?"
3. "Nếu tôi không trả đúng hạn, chuyện gì sẽ xảy ra?"
::::

[Chương 8](/docs/system/ch08-account-management) mô tả từng thành phần của LAS. Chương này ghép chúng lại, đi theo một chu kỳ billing hoàn chỉnh trên tài khoản của chị Lan, từ giao dịch đầu kỳ đến lúc sao kê hiện trên điện thoại của chị. Mục tiêu không chỉ là biết các bước, mà là hiểu vì sao từng bước tồn tại, vì sao thứ tự của chúng quan trọng, và vì sao một lỗi nhỏ ở bất kỳ đâu có thể làm sai sao kê của hàng nghìn người.

Ví dụ xuyên suốt chương là tài khoản hạn mức linh hoạt của chị Lan: hạn mức 18,500,000 VNĐ, lãi suất 18%/năm tính theo quy ước 30/360, phí quản lý tài khoản 50,000 VNĐ/tháng và phí bảo hiểm 90,000 VNĐ/tháng.

## 9.1 Tổng quan chu kỳ billing

### Giải phẫu một kỳ billing

::::story
Tài khoản của chị Lan được kích hoạt ngày 10/1, với ngày billing là ngày 20 hằng tháng và khoảng cách đến hạn là 16 ngày.
::::

```text
Kỳ billing 1:
  Bắt đầu: 10/1 (ngày kích hoạt)
  Kết thúc: 19/1 (ngày trước ngày billing)
  Ngày sao kê: 20/1
  Ngày đến hạn: 5/2 (ngày sao kê + 16 ngày)

Kỳ billing 2:
  Bắt đầu: 20/1, kết thúc: 19/2
  Ngày sao kê: 20/2
  Ngày đến hạn: 8/3

Kỳ billing 3:
  Bắt đầu: 20/2, kết thúc: 19/3
  Ngày sao kê: 20/3
  Ngày đến hạn: 5/4
```

Kỳ đầu tiên ngắn hơn một tháng vì nó bắt đầu từ ngày kích hoạt. Ngày đến hạn của kỳ 2 là 8/3 chứ không phải 5/3, vì tháng 2 chỉ có 28 ngày: khoảng cách đến hạn được đếm theo ngày, không theo ngày cố định trong tháng.

Ba mốc thời gian quan trọng của mỗi kỳ:

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

Vì sao cần khoảng cách giữa ngày sao kê và ngày đến hạn:

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

### Sự kiện trong kỳ và sự kiện cuối kỳ

Trong một kỳ billing có hai loại sự kiện:

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

Vì sao không ghi nhận lãi mỗi ngày? Có ba cách làm:

```text
Option A: Tính lãi hàng ngày, post ngay
  Pro: Khách hàng thấy lãi tích lũy real-time
  Con: 1.2M accounts × 30 ngày = 36M bút toán lãi/tháng
       → Performance overhead đáng kể
       → Sao kê phức tạp (30 dòng lãi thay vì 1 dòng)

Option B: Tính lãi hàng ngày (daily accrual), ghi nhận một lần cuối kỳ
  Pro: Chính xác + sao kê đơn giản (1 dòng lãi)
  Con: Không thấy lãi tích lũy theo thời gian thực

Option C: Tính lãi một lần vào EOM từ lịch sử số dư trong kỳ (VLP)
  Lãi = Σ (số dư từng đoạn × số ngày của đoạn × lãi suất ngày)
  → Một lần tính cuối kỳ, kết quả như cộng dồn hằng ngày
  → Cần lịch sử số dư trong kỳ để tính đúng

Ví dụ với số dư thay đổi trong kỳ 30 ngày:
  Ngày 1-5:   số dư 10,000,000 VNĐ  (5 ngày)
  Ngày 6-20:  trả 3,000,000  → số dư 7,000,000 VNĐ  (15 ngày)
  Ngày 21-30: mua 1,500,000  → số dư 8,500,000 VNĐ  (10 ngày)

  Quy ước 30/360 (D30_360): lãi suất ngày = 18% / 360 = 0.05%
  Lãi = (5 × 10,000,000 + 15 × 7,000,000 + 10 × 8,500,000) × 0.05%
      = 25,000 + 52,500 + 42,500
      = 120,000 VNĐ
```

Với quy ước 30/360, mọi tháng được coi là 30 ngày và năm là 360 ngày, nên kỳ từ 20/2 đến 19/3 (28 ngày theo lịch) vẫn được tính 30 ngày. Quy ước Actual/365 cho kết quả khác, nhất là ở tháng 2 và tháng có 31 ngày. Điều quan trọng là quy ước phải nhất quán giữa biểu phí, engine tính lãi và công cụ đối soát.

:::summary[Mục 9.1]
Mỗi kỳ có ba mốc: ngày sao kê, ngày đến hạn và khoảng ân hạn giữa hai ngày đó; khoảng cách đến hạn được đếm theo ngày. Sự kiện trong kỳ (giao dịch, thanh toán, phí ngay lập tức) được xử lý ngay; lãi, phí tháng, kỳ trả nợ và snapshot được tạo ở EOM. VLP tính lãi một lần vào EOM từ lịch sử số dư trong kỳ, theo quy ước 30/360, cho kết quả như cộng dồn từng ngày.
:::

## 9.2 Trong kỳ: billing theo thời gian thực

### Kỳ billing thứ 3 của chị Lan, từng ngày

Hãy theo dõi kỳ 20/2 đến 19/3 của chị Lan.

**Trạng thái tài khoản đầu kỳ, sau EOM ngày 20/2:**

```text
AccountNumber: ACC-2025-789456
Status: ACTIVE
CreditLimit: 18,500,000 VNĐ
OutstandingDebt: 13,500,000 VNĐ
  (gốc 13,300,000 + lãi và phí kỳ 2 là 200,000)
AvailableBalance: 5,000,000 VNĐ
Kỳ trả nợ đang chờ: REGULAR 1,800,000 VNĐ, đến hạn 8/3
  (gồm lãi và phí kỳ 2 là 200,000 + gốc 1,600,000)
BillingDay: 20
DPD: 0
```

**Ngày 5/3: mua hàng.** Chị Lan dùng thẻ mua quần áo 2,500,000 VNĐ.

```text
10:23:15 — POS Authorization:
  Auth request: amount=2,500,000, merchantCode="FASHION_STORE_001"
  LAS processes:
    holdBalance += 2,500,000 → holdBalance = 2,500,000
    availableBalance -= 2,500,000 → availableBalance = 2,500,000
  Auth response: APPROVED

10:25:30 — Merchant settlement (cùng ngày):
  Confirmation: amount=2,500,000, sourceTxCode="POS-TXN-20250305-789"
  LAS processes:
    1. Check idempotency: sourceTxCode chưa tồn tại → xử lý tiếp
    2. Create Transaction record (CONFIRMED)
    3. Create LedgerEntry: DEBIT 2,500,000, FeeComponentType: PRINCIPAL
    4. Create PostingUnit: baseAmount=2,500,000, applyIr=true
    5. Update CurrentBalance:
       holdBalance -= 2,500,000 → holdBalance = 0
       outstandingDebt += 2,500,000 → outstandingDebt = 16,000,000
       availableBalance = 18,500,000 - 0 - 16,000,000 = 2,500,000 (không đổi)
    6. Bill event: EventType = IMMEDIATE_RESPECT_FREEZE
       → Không trong thời gian đóng băng → bill ngay
       → Không tạo kỳ EXTRA (prescribeImmediately=false cho PRINCIPAL)
    7. Publish TransactionConfirmedEvent
```

**Ngày 7/3: trả kỳ đến hạn.** Chị Lan chuyển khoản 1,800,000 VNĐ, đúng số tiền của kỳ đến hạn 8/3.

```text
09:15:22 — Payment: 1,800,000 VNĐ (bank transfer)
  1. Create Transaction: CREDIT 1,800,000, type=PAYIN
  2. Create LedgerEntry: CREDIT 1,800,000
  3. Pairing chạy ngay (đã có kỳ trả nợ đang chờ):
     → Kỳ REGULAR đến hạn 8/3 (1,800,000): FULLY PAIRED, repaid=true
  4. Update CurrentBalance:
     outstandingDebt -= 1,800,000 → outstandingDebt = 14,200,000 (toàn bộ là gốc)
     availableBalance = 18,500,000 - 14,200,000 = 4,300,000
  5. Publish PaymentReceivedEvent → DRG, STS
```

**Ngày 18/3: trả thêm khi chưa có kỳ trả nợ.** Lương về, chị Lan chuyển thêm 3,000,000 VNĐ.

```text
08:40:05 — Payment: 3,000,000 VNĐ
  1. Create Transaction: CREDIT 3,000,000, type=PAYIN
  2. Create LedgerEntry: CREDIT 3,000,000
  3. Pairing: không có kỳ trả nợ nào đang chờ
     (kỳ 8/3 đã trả, kỳ tiếp theo chỉ được tạo ở EOM 19/3)
     → Khoản tiền nằm trong customerCredit, chờ ghép ở EOM
  4. Update CurrentBalance:
     customerCredit = 3,000,000
     outstandingDebt = 14,200,000 (chưa giảm — chưa được ghép)
     availableBalance = 18,500,000 - 14,200,000 + 3,000,000 = 7,300,000
```

Hai khoản thanh toán được xử lý khác nhau. Khoản ngày 7/3 có kỳ trả nợ để ghép nên được ghép ngay và giảm dư nợ ngay. Khoản ngày 18/3 đến khi chưa có kỳ trả nợ nào, nên nằm trong số dư có của khách hàng: số dư khả dụng tăng ngay, nhưng dư nợ chịu lãi chỉ giảm khi khoản tiền được ghép ở EOM. Đây là một lựa chọn thiết kế, có hệ quả nhỏ nhưng có thật: hai ngày lãi trên 3 triệu đồng, khoảng 3,000 VNĐ. Một số hệ thống khác trừ khoản trả thêm vào dư nợ gốc ngay lập tức.

**Đêm 19/3, 23 giờ:** EOM của kỳ kết thúc ngày 19/3 bắt đầu. Tài khoản của chị Lan là một trong 1.2 triệu tài khoản được xử lý.

### Phí ngay lập tức và phí cuối kỳ

Phí trả trễ là ví dụ của phí ngay lập tức. Giả sử chị Lan đã trả trễ kỳ đến hạn 8/3:

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

Phí quản lý tài khoản là phí cuối kỳ:

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

Như đã nói ở [Chương 3](/docs/products/ch03-product-design) và [Chương 8](/docs/system/ch08-account-management), `SVCFEE` là tariff item của dịch vụ `ACCMAINT`. Bước phí dịch vụ chạy trước EOM chính để phí có mặt trong số dư khi các bước sau tính toán.

## 9.3 EOM: khép lại kỳ billing

### Từng bước EOM trên tài khoản của chị Lan

**Trạng thái tài khoản trước EOM, đêm 19/3:**

```text
Account: ACC-2025-789456
OutstandingDebt: 14,200,000 VNĐ (toàn bộ là gốc)
CustomerCredit: 3,000,000 VNĐ (thanh toán 18/3, chưa ghép)
AvailableBalance: 7,300,000 VNĐ
Account.billingPeriod: BP_20 (EOM chạy cho kỳ kết thúc trước ngày 20)
PeriodBalanceSnapshot.billingPeriodNumber: 2 (kỳ trước)
DPD: 0
LastEOMDate: 2025-02-19
```

**Bước P1: ClearAccountingNotifications**

```text
Clear notification buffer từ session trước.
→ Technical prep, không visible cho user
```

**Bước P2: PrepareContextForEOM**

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

**Bước P3: logic EOM chính**

```text
billingBatchProcessingService.processEOMForRevolvingAccount(account, context)

─── 3.1 Kiểm tra quá hạn ─────────────────────────────────────────

  Kỳ trả nợ đến hạn 8/3: đã trả ngày 7/3
  DPD = 0 (không có kỳ trả nợ quá hạn)

─── 3.2 Tổng hợp dư nợ ───────────────────────────────────────────

  Gốc: 14,200,000 VNĐ
  Lãi chưa trả: 0 (lãi kỳ 2 đã trả trong kỳ trả nợ 8/3)
  Phí chưa trả: 0
  Tổng dư nợ: 14,200,000 VNĐ

─── 3.3 Tính lãi ─────────────────────────────────────────────────

  Lãi suất 18%/năm, quy ước 30/360 → lãi suất ngày = 18% / 360 = 0.05%
  Số ngày theo 30/360 trong kỳ 20/2 - 19/3: 30 ngày

  Gốc chịu lãi theo từng đoạn:
    20/2 - 4/3:   13,300,000 VNĐ  (15 ngày)
    5/3 - 6/3:    15,800,000 VNĐ  (2 ngày, sau khi mua 2,500,000)
    7/3 - 19/3:   14,200,000 VNĐ  (13 ngày, sau khi trả 1,800,000;
                                   khoản 3,000,000 ngày 18/3 chưa ghép)

  Lãi = (15 × 13,300,000 + 2 × 15,800,000 + 13 × 14,200,000) × 0.05%
      = 415,700,000 × 0.05%
      = 207,850 VNĐ

  Create LedgerEntry: DEBIT 207,850, FeeComponentType=INTEREST_CASHLESS
  Create PostingUnit: applyIr=false (không tính lãi trên lãi)
  outstandingDebt = 14,200,000 + 207,850 = 14,407,850 VNĐ

─── 3.4 Phí ──────────────────────────────────────────────────────

  Phí quản lý tài khoản (đã ghi bởi eomServiceFeesJob):
    LedgerEntry: DEBIT 50,000, FeeComponentType=SVCFEE
  Phí bảo hiểm:
    LedgerEntry: DEBIT 90,000, FeeComponentType=LIFEINS

  Tổng phí kỳ này: 140,000 VNĐ
  outstandingDebt = 14,407,850 + 140,000 = 14,547,850 VNĐ

─── 3.5 Khoản trả tối thiểu (MMI) ────────────────────────────────

  Tham số hợp đồng: MMI_LIMIT = 1,800,000 VNĐ
  5% dư nợ: 5% × 14,547,850 = 727,393 VNĐ
  MMI = MAX(1,800,000, 727,393) = 1,800,000 VNĐ

─── 3.6 Cập nhật kỳ billing ──────────────────────────────────────

  Account.billingPeriod: BP_20 (không đổi, là ngày cố định trong tháng)
  PeriodBalanceSnapshot.billingPeriodNumber: 2 → 3
  LastEOMDate = 2025-03-19

─── 3.7 Tạo kỳ trả nợ (prescribing) ──────────────────────────────

  PostingUnit chưa được tạo kỳ trả nợ:
    Phí quản lý tài khoản:  50,000
    Phí bảo hiểm:            90,000
    Lãi kỳ 3:               207,850
    Gốc:                 14,200,000

  Thứ tự ưu tiên theo biểu phí (PRIORITY_ONLY): phí → lãi → gốc
  Ngày đến hạn: 20/3 + 16 ngày = 5/4

  Tạo kỳ trả nợ REGULAR cho đến khi đủ MMI 1,800,000:
    R-001: phí            140,000
    R-002: lãi            207,850
    R-003: gốc          1,452,150  → tổng đạt 1,800,000, dừng
  Phần gốc còn lại 12,747,850 được tạo kỳ trả nợ ở các kỳ sau.

  InstalmentSummary:
    DueDate: 5/4, Type: REGULAR, Amount: 1,800,000 VNĐ

─── 3.8 Ghép số dư có (overpayment pairing) ──────────────────────

  CustomerCredit: 3,000,000 VNĐ (thanh toán 18/3)
  Kỳ trả nợ đang chờ: 1,800,000 VNĐ (vừa tạo)

  Ghép:
    R-001 (140,000)   → FULLY PAIRED, credit còn 2,860,000
    R-002 (207,850)   → FULLY PAIRED, credit còn 2,652,150
    R-003 (1,452,150) → FULLY PAIRED, credit còn 1,200,000
  InstalmentSummary 5/4: repaid=true

  Update CurrentBalance:
    outstandingDebt = 14,547,850 - 1,800,000 = 12,747,850 VNĐ
    customerCredit = 1,200,000 VNĐ
    availableBalance = 18,500,000 - 12,747,850 + 1,200,000 = 6,952,150 VNĐ

─── 3.9 Kiểm tra số dư ───────────────────────────────────────────

  Dư nợ tính lại từ bút toán khớp CurrentBalance → OK
```

Hai điểm cần chú ý trong ví dụ này. Thứ nhất, kỳ trả nợ chỉ lấy đủ MMI: phần lớn gốc vẫn còn đó và được tạo kỳ trả nợ dần ở các kỳ sau, đúng bản chất của tín dụng quay vòng. Thứ hai, nhờ khoản trả thêm ngày 18/3, kỳ trả nợ đến hạn 5/4 đã được trả ngay khi vừa được tạo. Chị Lan không phải trả gì trước ngày 5/4.

### PeriodBalanceSnapshot của kỳ 3

```text
W1 Writer: StoreEOMResultsItemWriter

CREATE LAS_PERIOD_BALANCE_SNAPSHOT:
  account_id: [ID of ACC-2025-789456]
  billing_period_number: 3
  period_start: 2025-02-20, period_end: 2025-03-19
  due_date: 2025-04-05
  start_balance: 13,500,000   (dư nợ đầu kỳ)
  end_balance: 12,747,850     (dư nợ cuối kỳ, sau EOM)
  per_interest: 207,850       (lãi kỳ này)
  per_fee: 140,000            (phí kỳ này: quản lý tài khoản + bảo hiểm)
  per_payments: 4,800,000     (thanh toán trong kỳ: 1,800,000 + 3,000,000)
  own_funds: 1,200,000        (số dư có của khách hàng)
  prescribed_instalment: 1,800,000
  day_past_due: 0
  billing_run → link đến BillingRun
  previous_period_balance_snapshot → link về kỳ 2
  cancelled: false
```

Đây là ảnh chụp bất biến của kỳ 3, dùng để tạo sao kê, báo cáo cho cơ quan quản lý, kiểm toán và trả lời các câu hỏi về lịch sử. Có thể kiểm tra các con số: dư nợ đầu kỳ 13,500,000 cộng giao dịch mua 2,500,000, lãi 207,850 và phí 140,000, trừ khoản 1,800,000 đã ghép ngày 7/3 và khoản 1,800,000 ghép ở EOM, ra đúng 12,747,850.

:::summary[Mục 9.3]
EOM xử lý mỗi tài khoản qua chín bước theo đúng thứ tự: quá hạn, dư nợ, lãi, phí, MMI, cập nhật kỳ, tạo kỳ trả nợ, ghép số dư có, kiểm tra số dư. Lãi được tính trên từng đoạn số dư trong kỳ. MMI giới hạn số tiền được tạo kỳ trả nợ; phần còn lại chuyển sang kỳ sau. Khoản khách hàng trả trước được ghép ngay vào kỳ trả nợ vừa tạo. `PeriodBalanceSnapshot` là ảnh chụp bất biến của kỳ.
:::

## 9.4 Tạo sao kê: từ con số đến tài liệu

### Module STS

::::story
4 giờ 30 sáng, EOM xử lý xong tài khoản của chị Lan. LAS phát sự kiện qua RabbitMQ, STS nhận được và bắt đầu tạo sao kê kỳ 3 cho chị.
::::

STS nhận từ LAS:

```text
AMQPEvent từ LAS:
  accountId: [ID]
  accountNumber: "ACC-2025-789456"
  billingPeriodNumber: 3
  billingDate: "2025-03-20"
  periodBalanceSnapshotId: [ID of snapshot just created]
  dueDate: "2025-04-05"
  mmiAmount: 1,800,000
```

Rồi tổng hợp sao kê từ nhiều nguồn:

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

### Nội dung bắt buộc của sao kê

Sao kê là một tài liệu pháp lý. Quy định về công bố thông tin ở nhiều thị trường yêu cầu sao kê tín dụng quay vòng có các mục sau; dưới đây là sao kê kỳ 3 của chị Lan:

```text
1. DƯ NỢ ĐẦU KỲ
   13,500,000 VNĐ

2. GIAO DỊCH
   05/03  Fashion Store          MUA HÀNG       2,500,000 VNĐ
   07/03  Chuyển khoản           THANH TOÁN    -1,800,000 VNĐ
   18/03  Chuyển khoản           THANH TOÁN    -3,000,000 VNĐ

3. LÃI VÀ PHÍ (phải hiện rõ từng loại)
   Lãi kỳ 20/02 - 19/03:                        207,850 VNĐ
   Phí quản lý tài khoản:                        50,000 VNĐ
   Phí bảo hiểm:                                 90,000 VNĐ

4. SỐ DƯ CUỐI KỲ
   11,547,850 VNĐ
   (= đầu kỳ + mua hàng + lãi và phí - thanh toán)
   Gồm dư nợ 12,747,850 VNĐ trừ số dư có 1,200,000 VNĐ

5. KHOẢN TRẢ TỐI THIỂU
   Khoản trả tối thiểu kỳ này: 1,800,000 VNĐ
   Đã thanh toán trước bằng số dư có
   Số tiền còn phải trả trước 05/04/2025: 0 VNĐ

6. LÃI SUẤT VÀ CHI PHÍ TÍN DỤNG
   Lãi suất: 18%/năm (0.05%/ngày theo quy ước 30/360)
   APR: theo công thức của cơ quan quản lý, gồm mọi phí bắt buộc

7. NẾU CHỈ TRẢ TỐI THIỂU
   Nếu từ kỳ sau chỉ trả mức tối thiểu và không chi tiêu thêm:
   Thời gian trả hết: khoảng 8 tháng
   Tổng lãi phải trả thêm: khoảng 742,000 VNĐ
   Tổng phí phải trả thêm: khoảng 1,120,000 VNĐ

8. SỐ TIỀN ĐỂ TRẢ HẾT
   11,547,850 VNĐ
   (cộng lãi phát sinh từ 20/03 đến ngày thanh toán)

9. KHIẾU NẠI
   Đường dây nóng, email và thời hạn khiếu nại

10. NGÀY SAO KÊ TIẾP THEO
    20/04/2025
```

Mục 7 được tính bằng cách mô phỏng lịch trả nợ từ số dư cuối kỳ: mỗi tháng cộng lãi 1.5% trên dư nợ và 140,000 VNĐ phí, trừ khoản trả tối thiểu bằng MAX(1,800,000, 5% dư nợ).

Mục 7 là kinh tế học hành vi đi vào quy định. Thông tin "nếu chỉ trả tối thiểu" là yêu cầu bắt buộc ở Anh và nhiều thị trường khác, nhằm hóa giải thiên kiến hiện tại và hiệu ứng mỏ neo đã phân tích ở [Chương 4](/docs/products/ch04-customer-journey): khi thấy rõ thời gian và chi phí của việc chỉ trả tối thiểu, khách hàng có thêm cơ sở để quyết định. Với khoản nợ lớn và MMI thấp, con số này có thể gây giật mình, như ví dụ 85 tháng ở [Chương 3](/docs/products/ch03-product-design). Trong VLP, STS tính mục này từ số dư cuối kỳ, lãi suất và quy tắc MMI, rồi đưa vào sao kê.

### Kênh và thời điểm gửi sao kê

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

Logic lập lịch gửi:

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

Gửi email vào 6 giờ chứ không phải 3 giờ sáng là một quyết định về trải nghiệm: thư đến lúc khách hàng bắt đầu ngày mới, và ít bị bộ lọc thư rác đánh dấu hơn. Tin nhắn SMS chỉ chứa số tiền và ngày đến hạn, không chứa toàn bộ sao kê, vì lý do bảo mật.

### Sao kê là tài liệu bất biến

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

:::summary[Mục 9.4]
STS tổng hợp sao kê từ `PeriodBalanceSnapshot`, lịch sử giao dịch, lịch trả nợ và thông tin sản phẩm. Sao kê có mười nội dung bắt buộc, trong đó có hậu quả của việc chỉ trả tối thiểu. Sao kê được gửi qua ứng dụng ngay khi sẵn sàng, email lúc 6 giờ, SMS lúc 7 giờ và bản giấy nếu khách hàng chọn. Sao kê đã gửi không bao giờ bị sửa; nếu có sai, công ty phát hành sao kê điều chỉnh.
:::

## 9.5 Ngày đến hạn và ghép thanh toán

### Khi khoản thanh toán đến trước

::::story
6 giờ 30 sáng ngày 20/3, chị Lan nhận sao kê. Khoản trả tối thiểu là 1,800,000 VNĐ, hạn 5/4. Nhưng chị đã chuyển thêm 3,000,000 VNĐ hôm 18/3, trước EOM. Chuyện gì đã xảy ra?
::::

```text
Chị Lan trả 3,000,000 VNĐ (18/3) trước khi kỳ trả nợ được tạo (EOM 19/3)

Sau khi tạo kỳ trả nợ ở EOM:
  CustomerCredit = 3,000,000 VNĐ (chờ ghép)
  Kỳ trả nợ REGULAR: 1,800,000 VNĐ (đến hạn 5/4)

Ghép số dư có (bước 3.8 của EOM):
  3,000,000 → 1,800,000 (trả đủ)
  Còn lại: 1,200,000 → customerCredit

Kết quả:
  InstalmentSummary 5/4: repaid=true (trước cả ngày đến hạn)
  Tài khoản: đúng hạn, không còn khoản phải trả sắp đến hạn
  CustomerCredit: 1,200,000 VNĐ

Chị Lan không cần làm gì vào 5/4.
Sao kê ghi: "Khoản trả tối thiểu đã được thanh toán. Số tiền còn phải trả: 0 VNĐ."
```

Số dư có 1,200,000 VNĐ còn lại sẽ được ghép vào kỳ trả nợ của kỳ sau, khi EOM ngày 20/4 tạo ra nó.

### Trả đúng hạn và trả trễ

**Kịch bản A: chị Thu trả đúng hạn.** Chị Thu là một khách hàng khác, có kỳ trả nợ 1,800,000 VNĐ đến hạn 5/4.

```text
Account sau EOM: kỳ trả nợ đến hạn 5/4: 1,800,000 VNĐ, chưa trả

4/4, 14:30 — Payment 2,000,000 VNĐ (nhiều hơn MMI):
  1. Create Transaction: CREDIT 2,000,000
  2. Create LedgerEntry: CREDIT 2,000,000
  3. CustomerCredit += 2,000,000

  Pairing chạy ngay (sự kiện thanh toán):
    CustomerCredit 2,000,000 → Instalment I-001 (1,800,000): FULLY PAIRED
    → I-001: repaid=true, repaidDate=4/4
    InstalmentSummary: all children repaid → repaid=true
    Remaining customerCredit: 200,000 VNĐ

  Update CurrentBalance:
    outstandingDebt -= 1,800,000
    customerCredit = 200,000
    availableBalance tăng 2,000,000 (1,800,000 dư nợ giảm + 200,000 số dư có)

5/4 — Ngày đến hạn:
  Kiểm tra: InstalmentSummary đến hạn 5/4 → repaid=true → không làm gì
  DPD: vẫn 0, không phát sinh phí trả trễ
```

**Kịch bản B: chị Hoa trả trễ.**

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

Hai ngày trễ hạn của chị Hoa đã được ghi nhận. Dù chị trả đủ ngay sau đó, thông tin này có thể được báo cáo lên trung tâm thông tin tín dụng và ảnh hưởng tới các quyết định tín dụng sau này.

### Trả thiếu

::::story
Chị Hoa chỉ có 1,000,000 VNĐ. Chị trả, nhưng không đủ để trả hết các kỳ đang nợ.
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

Vì sao không chia khoản 1,000,000 VNĐ theo tỷ lệ cho các kỳ?

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

Lập luận "dễ quản lý hơn" ở trên có giá trị, nhưng cần nhớ phân tích ở [Chương 8, mục 8.4](/docs/system/ch08-account-management): với một khoản thanh toán thiếu, thứ tự phân bổ không quyết định việc tài khoản có hết quá hạn hay không. Nó quyết định khoản nào được trả trước, nên doanh thu loại nào được ghi nhận sớm hơn và khoản nào còn bị tính lãi. Trả phí phạt trước có lợi cho doanh thu của bên cho vay; khoản gốc 1,000,000 VNĐ vẫn quá hạn như thường.

:::summary[Mục 9.5]
Khoản trả trước EOM nằm trong số dư có và được ghép ngay khi EOM tạo kỳ trả nợ. Khoản trả đúng hạn được ghép ngay, DPD giữ ở 0. Trả trễ làm DPD tăng mỗi ngày và sinh kỳ trả nợ EXTRA cho phí trả trễ. Với khoản trả thiếu, thứ tự phân bổ quyết định khoản nào được trả trước, không quyết định việc tài khoản có hết quá hạn.
:::

## 9.6 Toàn vẹn của chu kỳ: khi mọi thứ phải khớp nhau

### Đối soát ba bên

::::story
7 giờ sáng ngày 20/3, EOM hoàn tất và tác vụ đối soát bắt đầu.

Đối soát không chỉ là "số dư có đúng không?", mà là bảo đảm ba hệ thống nhất quán với nhau.
::::

Ba nguồn dữ liệu phải khớp:

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

Các phép kiểm tra:

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

Khi đối soát phát hiện chênh lệch:

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

Ngưỡng ở đây chặt hơn ngưỡng của tác vụ đối soát số dư hằng ngày ở [Chương 8](/docs/system/ch08-account-management), vì đây là đối soát ngay sau EOM: sai lệch lúc này có thể đi thẳng vào sao kê của khách hàng, nên chặn việc gửi sao kê quan trọng hơn chặn giao dịch.

### Những sai lệch thường gặp và nguyên nhân

**Loại 1: số dư trôi dần theo thời gian.**

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

**Loại 2: kỳ trả nợ bị tạo trùng.**

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

**Loại 3: STS và LAS không khớp.**

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

### Billing idempotent: chạy EOM hai lần mà vẫn an toàn

EOM là thao tác then chốt, và có những lúc phải chạy lại: chuyển máy chủ dự phòng, sửa lỗi, điều chỉnh dữ liệu. Nếu EOM không idempotent, chạy lại nghĩa là tính phí hai lần.

Idempotency ở cấp `BillingRun`:

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

Idempotency ở bước tạo kỳ trả nợ:

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

Nguyên tắc chung: trước khi tạo một thứ, kiểm tra xem nó đã tồn tại chưa. Nếu đã tồn tại và khớp kỳ vọng thì bỏ qua; nếu tồn tại nhưng không khớp thì dừng lại và báo lỗi, không tự đoán cách sửa.

:::summary[Mục 9.6]
Sau EOM, đối soát ba bên kiểm tra LAS, STS và DRG khớp nhau; chênh lệch trên 1,000 VNĐ là sự cố nghiêm trọng, tài khoản bị chặn và sao kê bị giữ lại. Nguyên nhân thường gặp là sự kiện bị giao trùng hoặc thất lạc, xử lý trùng, và dùng sai thời gian xử lý thay cho thời gian sự kiện. EOM idempotent nhờ kiểm tra trạng thái `BillingRun` trước khi chạy và kiểm tra kỳ trả nợ đã tồn tại trước khi tạo.
:::

## Tổng kết chương 9

Một kỳ billing của chị Lan:

```text
KỲ 3 (20/2 - 19/3):
  20/2:  Đầu kỳ: dư nợ 13,500,000; kỳ trả nợ 1,800,000 đến hạn 8/3

  5/3:   Mua quần áo 2,500,000 VNĐ
         → Authorization (giữ chỗ) → Confirmation (ghi nợ)

  7/3:   Trả 1,800,000 VNĐ → ghép ngay vào kỳ đến hạn 8/3

  18/3:  Trả thêm 3,000,000 VNĐ → số dư có, chờ ghép ở EOM

  19/3 23:00:  EOM
    Lãi: 207,850 VNĐ (30 ngày theo 30/360)
    Phí: 140,000 VNĐ (quản lý tài khoản + bảo hiểm)
    Kỳ trả nợ REGULAR: 1,800,000 VNĐ (đến hạn 5/4)
    Ghép số dư có: 1,800,000 → đã trả
    Số dư có còn lại: 1,200,000 VNĐ

  20/3 06:30:  Sao kê gửi qua ứng dụng
    Số dư cuối kỳ: 11,547,850 VNĐ
    "Khoản trả tối thiểu đã được thanh toán, còn phải trả 0 VNĐ"

  5/4:   Ngày đến hạn → mọi kỳ trả nợ đã trả, DPD 0

KỲ 4 bắt đầu với:
  Dư nợ: 12,747,850 VNĐ
  Số dư có: 1,200,000 VNĐ
  Số dư khả dụng: 6,952,150 VNĐ
  Ngày sao kê tiếp theo: 20/4, đến hạn 6/5
```

Ngày đến hạn của kỳ 4 là 6/5, vì tháng 4 có 30 ngày: 20/4 cộng 16 ngày.

Mỗi bước có lý do của nó. Tính lãi trên từng đoạn số dư bảo đảm công bằng và chính xác. Tạo kỳ trả nợ ở EOM tách rõ việc ghi nhận trong kỳ với việc chốt kỳ. Ghép số dư có ngay khi có kỳ trả nợ thưởng cho khách hàng trả sớm. Sao kê bất biến giữ niềm tin và dấu vết kiểm toán. Đối soát ba bên bảo đảm cả hệ thống nói cùng một con số.

## Câu hỏi tự kiểm tra

**Nhớ lại**

1. Ba mốc thời gian của một kỳ billing là gì? Khoảng cách đến hạn dùng để làm gì?
2. Vì sao lãi được tính trên từng đoạn số dư trong kỳ thay vì trên số dư cuối kỳ?
3. Khi thanh toán đến trước EOM và chưa có kỳ trả nợ nào, tiền được xử lý thế nào? Vì sao không ghép ngay?
4. Sao kê là tài liệu bất biến. Nếu phát hiện sai sau khi đã gửi, phải làm gì?

**Hiểu**

5. Vì sao cần đóng băng kỳ billing khi EOM đang chạy? Cho một ví dụ cụ thể về xung đột nếu không có cơ chế này.
6. Vì sao DPD được tính theo ngày lịch chứ không theo ngày làm việc? Điều đó có hệ quả gì về trải nghiệm khách hàng và quy định?
7. Đối soát ba bên giữa LAS, STS và DRG là gì? Nếu LAS và STS khớp nhau nhưng DRG không khớp, vấn đề có thể nằm ở đâu?
8. Vì sao sao kê phải có mục "nếu chỉ trả tối thiểu"? Đây là yêu cầu của kinh tế học hành vi, của quy định, hay cả hai?

**Áp dụng**

9. Một tài khoản có ngày billing 15, khoảng cách đến hạn 14 ngày, dư nợ gốc đầu kỳ 25,000,000 VNĐ, lãi suất 18%/năm theo quy ước 30/360, phí quản lý tài khoản 60,000 VNĐ/tháng, phí bảo hiểm 100,000 VNĐ/tháng, MMI 2,500,000 VNĐ. Trong kỳ có: ngày 3 mua 3,000,000 VNĐ, ngày 10 mua 1,500,000 VNĐ, ngày 12 trả 4,000,000 VNĐ (không có kỳ trả nợ nào đang chờ). Giả sử khoản trả ngày 12 chỉ giảm dư nợ khi được ghép ở EOM.
   (a) Tính lãi của kỳ (30 ngày).
   (b) Tổng phí.
   (c) Dư nợ sau EOM.
   (d) Các kỳ trả nợ REGULAR được tạo.
   (e) Số tiền khách hàng còn phải trả sau khi ghép số dư có.
10. Chị An trả đúng hạn tháng 1, trễ tháng 2 (DPD 8), trả đủ tháng 3. Ảnh hưởng thế nào tới (a) phân loại stage theo IFRS 9 cuối mỗi tháng, (b) báo cáo lên trung tâm thông tin tín dụng, (c) dự phòng mỗi tháng, (d) lãi suất của chị An trong tương lai?

**Phân tích**

11. Một fintech đề xuất: "Billing theo thời gian thực: mỗi giao dịch kích hoạt ngay việc tính lãi và tạo kỳ trả nợ. Không cần EOM batch. Đơn giản hơn, nhanh hơn." Phân tích (a) tính khả thi kỹ thuật, (b) hệ quả kinh doanh về trải nghiệm khách hàng và ghi nhận doanh thu, (c) các cân nhắc về quy định, (d) khi nào cách làm này hợp lý.
12. Sau một sự cố, phát hiện EOM đã chạy hai lần cho 500 tài khoản: lần đầu bị coi là lỗi nên đội vận hành chạy lại, nhưng thực ra lần đầu đã thành công một phần. Kết quả là 500 tài khoản có kỳ trả nợ trùng. Thiết kế phương án khôi phục: (a) truy vấn để phát hiện kỳ trả nợ trùng, (b) đánh giá tác động: khách hàng đã nhận sao kê chưa, (c) hủy bản trùng hay gộp, (d) có cần thông báo cho khách hàng không, (e) thay đổi kiến trúc nào để không tái diễn.

## Bài tập áp dụng

**Bài 1. Mô phỏng ba kỳ billing.** Một tài khoản tín dụng quay vòng có hạn mức 30,000,000 VNĐ, lãi suất 18%/năm, ngày billing 25, khoảng cách đến hạn 15 ngày, phí quản lý tài khoản 70,000 VNĐ/tháng. Tháng 1: ngày 1 kích hoạt và giải ngân 20,000,000 VNĐ, ngày 5 mua 3,000,000 VNĐ, ngày 20 trả 5,000,000 VNĐ. Tháng 2: ngày 10 mua 2,000,000 VNĐ, ngày 22 trả 2,500,000 VNĐ. Tháng 3: ngày 5 mua 5,000,000 VNĐ, ngày 20 trả 1,500,000 VNĐ, ít hơn MMI. (a) Tính lãi, phí và kỳ trả nợ ở mỗi EOM. (b) Dư nợ sau mỗi EOM. (c) Mỗi tháng khách hàng trả đủ hay thiếu? (d) DPD và phí trả trễ, nếu có. (e) Tóm tắt sao kê mỗi tháng. (f) Diễn biến stage theo IFRS 9.

**Bài 2. Thiết kế tác vụ đối soát.** Thiết kế tác vụ đối soát chạy hằng ngày sau EOM, kiểm tra LAS, STS và DRG cho mọi tài khoản vừa chạy EOM, hoàn tất trong 2 giờ trước giờ mở cửa chi nhánh, có báo cáo tổng hợp cho đội vận hành và cảnh báo theo ba mức độ nghiêm trọng. (a) Truy vấn SQL cho từng phép kiểm tra, với lược đồ đơn giản hóa. (b) Logic phân loại mức độ nghiêm trọng. (c) Cây quyết định: khi nào tự sửa, khi nào cần người xem xét. (d) Làm sao kiểm tra 1.2 triệu tài khoản trong 2 giờ? (e) Báo cáo cho đội vận hành cần những gì?

**Bài 3. Thiết kế hệ thống sao kê.** Công ty thiết kế lại hệ thống sao kê với yêu cầu: gửi tới 1.2 triệu khách hàng trong 3 giờ sau EOM, qua thông báo ứng dụng, email, SMS và bản giấy (5% khách hàng), có đủ mười nội dung bắt buộc, mỗi sao kê tạo trong dưới 500 ms. (a) Hệ thống mẫu sao kê: làm sao cá nhân hóa 1.2 triệu sao kê hiệu quả? (b) Xử lý song song cho thông lượng 400 nghìn sao kê mỗi giờ. (c) Điều phối các kênh gửi để không làm quá tải hệ thống. (d) Nếu máy chủ email ngừng hoạt động, phương án dự phòng là gì? (e) Làm sao chứng minh khách hàng đã nhận sao kê khi có tranh chấp?

## Đọc thêm

**Kế toán tài chính**

- Weygandt, J., Kimmel, P. & Kieso, D. (2018). *Financial Accounting.* Wiley. Các chương về khoản phải thu và ghi nhận doanh thu, nền tảng nghiệp vụ cho thiết kế hệ thống billing.

**Thiết kế thông tin công bố**

- Consumer Financial Protection Bureau. *Know Before You Owe.* Các mẫu công bố thông tin tín dụng và nghiên cứu thử nghiệm với người dùng, tại consumerfinance.gov. Nguyên tắc thiết kế áp dụng được cho sao kê.

**Xử lý theo lô**

- Minella, M. T. (2019). *The Definitive Guide to Spring Batch* (2nd ed.). Apress. Các chương về xử lý lỗi, bỏ qua và thử lại, kiến thức cần thiết khi hiện thực EOM.

Chương 10 khép lại Phần III với chủ đề không ai muốn nghĩ tới nhưng không thể bỏ qua: thu hồi nợ. Khi khách hàng không trả được, hệ thống phải làm gì? Không chỉ là "đòi tiền", mà là một quy trình phải cân bằng lợi ích của bên cho vay, khả năng phục hồi của khách hàng và các ràng buộc pháp lý về cách thu hồi nợ. [Chương 10. Quản lý nợ và thu hồi](/docs/system/ch10-collections).
