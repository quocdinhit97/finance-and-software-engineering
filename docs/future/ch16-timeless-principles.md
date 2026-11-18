---
title: "Chương 16. Những nguyên tắc thiết kế bất biến"
sidebar_label: "16. Những nguyên tắc thiết kế bất biến"
sidebar_position: 3
chapter: 16
subtitle: "Timeless Design Principles"
reading_time: 25
source_file: "phan-4-chuong-16.md"
editorial_status: "mechanical"
---

> *"Technology thay đổi mỗi 5 năm. Regulations thay đổi mỗi 10 năm. Nhưng những nguyên tắc tốt - về toán học tài chính, về thiết kế hệ thống, về đạo đức kinh doanh - chúng không thay đổi. Học chúng một lần, dùng mãi mãi."*

## Dẫn nhập: Cuộc hội thoại cuối năm

::::story
Cuối năm, bà Hương gọi cả team vào họp. Không phải review số. Không phải planning. Bà hỏi một câu:

*"Nếu ngày mai công ty này đóng cửa, và tất cả chúng ta đi xây một hệ thống tín dụng mới từ đầu - với blank sheet of paper - chúng ta sẽ làm gì khác đi?"*

Phòng im lặng. Rồi câu trả lời bắt đầu đến. Từ Anh Minh: "Tôi sẽ thiết kế tariff-driven từ đầu, không phải hardcode." Từ Kỹ sư Tuấn: "Tôi sẽ không dùng double cho bất kỳ con số tài chính nào." Từ collector Hà: "Tôi sẽ gọi khách hàng trước khi họ DPD, không phải sau."

Chị Lan không có mặt trong phòng đó. Nhưng toàn bộ cuộc trò chuyện đó - về thiết kế đúng, về hệ thống đúng, về đạo đức đúng - là về người như chị.
::::

Chương này là tổng kết. Không có khái niệm mới. Chỉ có những nguyên tắc, được distill từ 15 chương trước, được trình bày theo cách bạn có thể mang theo - vào công việc hàng ngày, vào design decisions, vào những lúc bị áp lực phải làm tắt.

## 16.1 Nguyên tắc về toán học và dữ liệu

### Nguyên tắc 1: Tiền là số chính xác

:::key
**Không bao giờ dùng `float` hay `double` cho số tiền. Không bao giờ.**
:::

```text
Một ngân hàng ở Anh, thập niên 1980s:
  Hệ thống tính lãi dùng floating-point arithmetic
  Sai số mỗi transaction: ~0.001 pence (không đáng kể)
  Sau 300 triệu transactions/năm: sai số tích lũy hàng triệu pounds
  
  Ai nhận khoản tiền thừa đó? Không ai — nó biến mất trong rounding errors.
  Ai mất? Customers — mỗi người một chút, không ai nhận ra.
  Kết quả: Class action lawsuit. Regulatory fine. Reputational damage.
```

**Tại sao float không được:**

```java
// THIS IS WRONG — never do this:
double amount = 1234567.89;
double rate = 0.155 / 12; // monthly rate
double interest = amount * rate; // = 15946.49...
// Internally: floating-point cannot represent these decimals exactly
// Error: ~0.00000001 per calculation → accumulates

// THIS IS CORRECT:
BigDecimal amount = new BigDecimal("1234567.89");
BigDecimal rate = new BigDecimal("0.155")
    .divide(new BigDecimal("12"), 10, RoundingMode.HALF_UP);
BigDecimal interest = amount.multiply(rate)
    .setScale(0, RoundingMode.HALF_UP); // Round to VNĐ (no sub-unit)
```

**Rounding strategy:**

```text
Principle: Round at the LAST step, never intermediate.

Interest calculation for 18 months:
  WRONG: Round each monthly amount → sum them
         Month 1: 1,234,568 + round → 1,234,568
         Month 2: 1,218,622 + round → 1,218,622
         ... → sum 18 rounded values → error accumulates
  
  CORRECT: Compute all months → sum → round once at end
            Sum all 18 unrounded = 21,456,789.234567
            Final rounding: 21,456,789 (discard fractional VNĐ)
  
Rounding rule for lending:
  Interest rounded UP (lender-favorable): customer pays slightly more
  Principal repayment rounded DOWN: customer owes slightly less next month
  Final payment: exact to zero out the account (absorbs all accumulated rounding)
```

### Nguyên tắc 2: Thời gian là Dimension cần tôn trọng

:::key
**Mọi financial event phải được ghi lại với đúng ngày xảy ra, không phải ngày được xử lý.**
:::

::::story[Câu chuyện - Bug VLP-706]
::::

```text
Scenario: Transaction được charge "bill-in-past" (chargeTransactionInPast=true)
          Nghĩa là transaction date trong quá khứ, nhưng xử lý hôm nay.

Bug: TransactionService.checkContractService() dùng billingDate (ngày trong quá khứ)
     làm effectiveDate để lookup contract service.

Effect: Contract service hôm nay đang ACTIVE, nhưng billingDate thì service chưa có.
        → Lookup thất bại → "Contract service not found" error
        → Transaction bị rejected mặc dù customer hoàn toàn eligible

Root cause: Nhầm "effective date để validate quyền charge" với "effective date của transaction"

Fix: Dùng timeService.getCurrentDate() thay vì billingDate khi chargeTransactionInPast=true
     Rationale: "checkContractService validates CURRENT permission to charge,
                  not historical permission" — service phải đang active HÔM NAY

Lesson: Luôn phân biệt rõ ràng:
  billingDate    = ngày của transaction (thuộc về quá khứ)
  currentDate    = ngày validation đang diễn ra (hôm nay)
  effectiveDate  = ngày để filter entities (tuỳ context)
```

**Temporal integrity rules:**

```text
Rule 1: Immutable event log
  Once an event is recorded with its timestamp → never change it
  If correction needed: post a reversal event with new timestamp
  The original event remains (audit trail)
  
Rule 2: Bi-temporal modeling for critical entities
  account.effectiveDate: when this state became effective in business world
  account.recordedDate: when system learned about it
  → Query "what was the state of this account on 1 January 2023?"
    requires both dimensions
  → Without bi-temporal: can't answer that question correctly
  
Rule 3: Time zone discipline
  All times stored in UTC
  Display in local time (Vietnam: UTC+7)
  Never store local time in database
  → "2024-11-30 17:00 HCM" = "2024-11-30 10:00 UTC"
  
Rule 4: Date arithmetic
  "Add 1 month to January 31" = February 28 (not March 3)
  Use proper date libraries, not integer arithmetic
  Business day calculation: must use calendar (holidays)
```

### Nguyên tắc 3: Data Quality là nền tảng

:::key
**Garbage in, garbage out. Một credit model tốt trên data xấu cho kết quả tệ hơn một simple rule trên data tốt.**
:::

**Data quality dimensions:**

```text
COMPLETENESS: Is all required data present?
  Missing income field: decision quality degrades
  Mitigation: Data quality SLA per field, not just per record
  "This field must be present in 99.5% of applications"
  
ACCURACY: Is the data correct?
  Typo in income: 25,000 vs 250,000 VNĐ → 10× difference
  Mitigation: Range checks, format validation, cross-field consistency
  
CONSISTENCY: Same concept defined same way everywhere?
  "Default" defined as DPD 30+ in model, DPD 60+ in reporting
  → Model and reporting tell different stories
  Mitigation: Single source of truth, data dictionary
  
TIMELINESS: Is data fresh enough for its purpose?
  Bureau data 90 days old for real-time credit decision
  → Customer could have defaulted last month
  Mitigation: Data freshness requirements per use case
  
LINEAGE: Can you trace every data point to its source?
  "Where did this income figure come from?"
  Mitigation: Every feature: source system + timestamp + transformation log

Practical monitoring:
  Data quality dashboard: track all 5 dimensions, daily
  Alert when quality drops below threshold
  Block model execution if critical field quality < 95%
```

:::note[NGUYÊN TẮC 1-3: TOÁN HỌC VÀ DỮ LIỆU]
1. BigDecimal always, round at last step only
2. Event date ≠ processing date; store UTC, all
3 temporal dimensions
3. Data quality: 5 dimensions, daily monitoring
:::

## 16.2 Nguyên tắc về kiến trúc hệ thống

### Nguyên tắc 4: Tariff-Driven Design

:::key
**Business rules thuộc về database, không phải code. Không bao giờ hardcode tỷ lệ lãi suất, hạn mức, hay fee vào source code.**
:::

```text
Ngày 1 tháng 3: Regulatory thông báo rate cap thay đổi từ 1 tháng sau.
  
Option A (hardcoded): 
  Rate cap hardcoded: "if (rate > 0.24) throw Exception"
  Change request → code change → test → deploy → 2 weeks
  Risk: If deployment delayed → non-compliant for days/weeks
  
Option B (tariff-driven):
  Rate cap in database: rate_cap_config table
  Change: INSERT INTO rate_cap_config (value=0.22, effective_date='2024-04-01')
  Takes 5 minutes, zero deployment risk
  System automatically uses new cap from April 1.
```

**What should be config (not code):**

```text
ALWAYS CONFIG:
  Interest rates (nominal, penalty, late)
  Fee amounts (origination, processing, monthly)
  Regulatory limits (rate cap, DTI limits, max loan amounts)
  Credit tier thresholds (score boundaries)
  DPD thresholds (for tier escalation, write-off triggers)
  Business rules (grace period length, payment holiday max per year)
  Notification templates (SMS, email content)
  
SOMETIMES CONFIG (based on frequency of change):
  Approval decision logic (if changes quarterly: config)
  Collections strategy (if changes seasonally: config)
  Marketing campaign parameters
  
SHOULD BE CODE (structural, infrequent change):
  Calculation algorithms (interest accrual formula)
  Data validation logic (format checks)
  Integration protocols (API authentication)
```

### Nguyên tắc 5: Mọi thứ phải Traceable

:::key
**Nếu bạn không thể audit ngược lại một quyết định từ 3 năm trước, bạn sẽ thua trong bất kỳ dispute nào.**
:::

**The audit trail imperative:**

```text
Three questions every financial system must be able to answer:

Q1: What happened? (Event log)
  "Show me everything that happened to account A-12345 on 15 November 2023"
  → Immutable event log: every state change, with who/what/when/why

Q2: Why did it happen? (Decision log)
  "Why was this customer rejected on 15 November 2023?"
  → Scoring input features, model version, score output, policy rules applied
  → ALL inputs logged at decision time, not reconstructed later

Q3: Who decided? (Authorization log)
  "Who approved this exception? Who changed this config?"
  → Every write operation: operator ID, timestamp, reason
  → Cannot update without identity recorded

Non-negotiable audit requirements:
  ALL financial transactions: retained 10 years (regulatory minimum VN)
  ALL credit decisions: retained 7 years
  ALL config changes: retained permanently (or until system decommissioned)
  
  Audit logs: APPEND ONLY. Never update, never delete.
  Physical storage: separate from operational DB (integrity preserved)
```

### Nguyên tắc 6: Idempotency và Durability

:::key
**Mọi payment API phải idempotent. Mọi EOM job phải safe to retry. Khi nghi ngờ: design for at-least-once delivery, nhưng implement idempotency để at-most-once effect.**
:::

::::story[Câu chuyện - Bug VLP-670]
::::

```text
Scenario: Pairing sau EOM — hệ thống pair instalment mới prescribe với payment cũ.

Bug: InstalmentSummary aggregation trả về sai aggregate amounts
     sau khi tạo instalment mới bằng InstalmentFactory.

Root cause: JPA PersistentBag stale state.
  InstalmentSummary có @OneToMany collection instalments.
  Khi instalment mới được persist bằng InstalmentDAO.save() (riêng biệt),
  PersistentBag của InstalmentSummary KHÔNG được update tự động.
  → refreshInstalmentSummary() đọc stale collection
  → aggregate sai (thiếu instalment mới)

Bug manifestation: Wrong paidAmount trên InstalmentSummary
  → Wrong outstandingDebt trên CurrentBalance
  → Incorrect account balance display

Fix: 
  1. InstalmentSummaryService: dùng addInstalmentAmountsToHeader() thay vì collection-based refresh
     (incremental update, không depend vào PersistentBag freshness)
  2. refreshInstalmentSummary() được gọi unconditionally trong pairing flow
     (ensures header luôn consistent sau mỗi payment pair)

Lesson: Khi dùng JPA với @OneToMany, beware stale PersistentBag:
  - Nếu child entity được persist qua DAO riêng (không qua parent collection)
  - Parent collection có thể stale đến khi session refresh
  - Dùng incremental operations thay vì collection-derived aggregates
```

**Idempotency for payment APIs:**

```text
Customer payment: customer presses "Pay" → network timeout → presses again
Without idempotency: 2 payments deducted → customer overcharged

With idempotency:
  First request: idempotency_key = "PAYMENT_C123_20241115_102347_abc123"
  Server: process payment, store key → return SUCCESS
  
  Second request (same key due to retry):
  Server: key already exists → return SAME response (200 OK, same payment_id)
  → No duplicate charge
  
  Rule: idempotency key = user-generated UUID + timestamp
  TTL: 24 hours (retry window)
  Storage: distributed cache (Redis) for fast lookup
```

### Nguyên tắc 7: Fail-Safe Design

:::key
**Hệ thống sẽ fail. Câu hỏi không phải "nếu" mà là "khi nào" và "như thế nào." Thiết kế sao cho failure mode gây ít hại nhất.**
:::

**Fail-safe cho credit decisions:**

```text
Credit bureau API timeout (600ms, times out):
  Option A: Return ERROR → customer sees "service unavailable"
  Option B: Approve anyway (unsafe — no bureau check)
  Option C: Queue for manual review → customer waits
  Option D: Use cached score (TTL: 1 hour) + flag for review
  
Best practice: Option D for returning customers (have history)
              Option C for new customers (no history, need bureau)
  
  Rationale: New customer without bureau check → high unknown risk
             Returning customer with 12-month history → cache is reasonable proxy

Network partition during disbursement:
  Customer signs agreement. Disbursement instruction sent.
  Network partition: confirmation never received.
  
  Risk A: Send again → double disbursement → company loses money
  Risk B: Don't send → customer doesn't receive funds → complaint
  
  Solution: Distributed transaction + idempotency
    Step 1: Mark disbursement as "PENDING"
    Step 2: Send to bank with idempotency key
    Step 3: Async confirmation → mark "COMPLETED"
    On restart: idempotency key prevents double send
                Pending status triggers reconciliation check
```

:::note[NGUYÊN TẮC 4-7: KIẾN TRÚC HỆ THỐNG]
4. Tariff-driven: rules in DB, not code
5. Audit trail: who/what/when/why → immutable
6. Idempotency: payment/EOM safe to retry
7. Fail-safe: design for minimum harm on failure
:::

## 16.3 Nguyên tắc về Risk Management

### Nguyên tắc 8: Expected Loss là chi phí, không phải rủi ro

:::key
**EL đã được tính vào giá. Nó không đáng lo. Cái đáng lo là Unexpected Loss - khi reality lệch xa khỏi expectation.**
:::

**Tư duy đúng về credit loss:**

```text
WRONG thinking: "5% default rate này rất nguy hiểm!"
RIGHT thinking: "5% default rate đã được tính vào rate 18.5%.
                 EL = 5% × 62% LGD = 3.1% → covered.
                 UL = if actual default jumps to 9% → we're exposed."

What to monitor (NOT EL, but UL signals):
  ✓ Default rate vs forecast: divergence > 20% → investigate
  ✓ Default correlation: are defaults clustered (sector/region) or idiosyncratic?
     Clustered → systemic risk → much worse than individual defaults
  ✓ LGD volatility: are recovery rates stable?
  ✓ Vintage analysis: are new cohorts worse than old cohorts?
     Consistent vintage deterioration → model drift → UL increasing

Provision adequacy:
  IFRS 9 Stage 1: 12-month EL provision
  IFRS 9 Stage 2: Lifetime EL provision (when credit quality deteriorates)
  IFRS 9 Stage 3: Defaulted → write-off reserves
  
  → Provision = expected loss held in reserve
  → Capital = buffer for unexpected loss
  → Both must be adequate, but for different risks
```

### Nguyên tắc 9: Tail Risk Kills Companies

:::key
**Tối ưu hóa cho average case không đủ. Hệ thống phải survive worst case.**
:::

```text
Long-Term Capital Management (LTCM), 1998:
  Most sophisticated quant hedge fund of its time
  Models showed: probability of total loss = 1 in 10^24
  (That's 1 in a trillion trillion)
  
  Reality: Total loss in 1998 Russian debt crisis
  
  What went wrong? Models assumed independent risks.
  Reality: In crisis, correlations approach 1.
  
  Russian default → all EM bonds fall simultaneously
  Normally uncorrelated positions → all moved against LTCM at once
  
  Lesson: Historical correlation is calm-weather correlation.
          Crisis correlation is what kills you.

Application for consumer lending:
  Normal times: defaults are idiosyncratic (independent)
  Crisis: defaults are correlated (economic shock affects everyone)
  
  VaR in normal times: 3% default rate
  VaR in crisis (COVID): 8% default rate → 2.7× normal
  
  Stress testing requirement:
    "What if unemployment rises from 5% to 15%? What is portfolio default rate?"
    "What if interest rates rise 300bps? What is runoff rate?"
    "What if GDP contracts 5%? What is our 2-year loss?"
    
    → Results drive capital planning, not normal-times EL
```

### Nguyên tắc 10: Model Calibration: Trust But Verify

:::key
**Mọi model đều sai. Câu hỏi là: sai như thế nào, và bao nhiêu là chấp nhận được?**
:::

**Model humility:**

```text
George Box (statistician): "All models are wrong, but some are useful."

What this means in practice:
  Your credit model has Gini 0.62 → impressive
  But: 38% of variance in defaults is UNEXPLAINED
  
  The unexplained 38% includes:
    Luck (job loss due to random company closure)
    Fraud (model never sees fraudulent applications accurately)
    Novel behavior (AI-generated documents, synthetic identity)
    Model assumptions that break in edge cases
  
  Don't optimize the 62%. Manage the 38%.

Calibration schedule (minimum):
  Monthly: PSI check (population stability)
  Quarterly: Gini on accumulated outcomes (as data matures)
  Annually: Full revalidation (does model still reflect reality?)
  Event-triggered: Any economic shock, regulatory change, product change
  
  If calibration fails: override model with conservative rules
  until retrained model passes validation
```

### Nguyên tắc 11: Concentration Is Dangerous

:::key
**Một portfolio với 30% exposure to một sector, một employer, hay một geography là một portfolio waiting to blow up.**
:::

**Diversification as survival:**

```text
Lesson from Vietnam consumer finance (2019-2021):
  Several lenders heavily concentrated in:
  → Auto loan (single product)
  → Manufacturing sector workers (single employer group)
  → Northern provinces (geographic concentration)
  
  COVID hit manufacturing hardest.
  Northern lockdowns were longest.
  Auto values crashed (import restrictions).
  
  Concentrated lenders: NPL 15-25%
  Diversified lenders: NPL 6-9% (same market, very different outcome)

Concentration limits (example policy):
  Single employer: max 3% of portfolio
  Single sector (e.g., manufacturing): max 20% of portfolio
  Single province: max 25% of portfolio
  Single product (e.g., auto loan): max 40% of portfolio
  
  Monitor monthly. Alert at 80% of limit. Hard cap at 100%.
  
  "But our employer-concentration customers are really good!"
  → They are, until they're not. The whole sector's correlations
    become obvious only in a crisis. Prevent it before.
```

:::note[NGUYÊN TẮC 8-11: RISK MANAGEMENT]
8. EL = cost, built into pricing. Monitor UL.
9. Optimize for tail, not average. Stress test.
10. All models wrong - calibrate, don't trust
11. Concentration kills. Diversify early.
:::

## 16.4 Nguyên tắc về sản phẩm và khách hàng

### Nguyên tắc 12: Right Product, Right Customer, Right Time

:::key
**Selling the wrong product to the right customer is as bad as selling the right product to the wrong customer.**
:::

```text
Chị Mai, 58 tuổi, sắp về hưu trong 2 năm:
  Walks into branch for a small home repair loan (5M VNĐ, 6 months)
  Agent cross-sells: "You could borrow 50M, 36 months — renovate everything!"
  
  Agent's incentive: 50M loan = 10× commission
  Chị Mai's need: 5M, short term
  Chị Mai's reality: Fixed income in retirement → cannot service 36-month loan
  
  Short-term outcome: Agent gets commission
  Long-term outcome: Chị Mai cannot service loan → default → hardship
                     Company: default + regulatory risk + CLV = negative
```

**Right product framework:**

```text
Before offering a product, verify 3 things:

1. RIGHT CUSTOMER:
   Does customer's financial profile support this product?
   (Credit score, DTI, income stability, existing obligations)
   → If no: don't offer. Suggest smaller product or wait.
   
2. RIGHT PRODUCT:
   Does this product solve customer's stated need?
   "I need 5M for home repair" → Offer 5M. Not 50M.
   → If mismatch: clarify need. Don't assume upsell is helpful.
   
3. RIGHT TIME:
   Is this the right phase of life for this product?
   "I'm 58, retiring in 2 years" → 36-month loan is probably wrong timing
   → Consider: can they service it through life transition?

Customer advocate mindset:
  Agent's job: help customer get what they need.
  Not: maximize loan amount per customer.
  
  This sounds noble. It IS noble. It's also profitable:
  Customers who get right product → lower default → lower cost
  Customers who feel understood → loyalty → referrals
  Long-term: both ethics and business align.
```

### Nguyên tắc 13: Transparency là lợi thế cạnh tranh

:::key
**Khách hàng biết khi nào họ bị mislead. Họ có thể không nói ra. Nhưng họ sẽ không quay lại.**
:::

**The trust dividend:**

```text
Study (Indonesian consumer finance, 2023):
  Group A: Customers who fully understood terms before signing
  Group B: Customers who didn't understand terms before signing
  
  Metrics after 24 months:
                    Group A    Group B
  On-time payment:   89%       76%
  Complaint rate:    3%        12%
  Repeat loan:       67%       41%
  Referral rate:     28%       9%
  
  Group A: not just lower default — MUCH higher business value.
  
  Explanation:
    Understanding → fewer surprises → fewer complaints
    Feeling respected → emotional loyalty → repeat business
    Trust → willingness to recommend → viral growth

Transparency practices that build trust:
  ✓ APR shown prominently — don't hide it
  ✓ "Here's what you'll actually pay total" — before signing
  ✓ "Here's how this compares to alternative" — informed choice
  ✓ Rejection reason that's actually useful — not bureaucratic
  ✓ "Your score improved — here's a better rate" — proactive
  ✗ Fine print that matters buried in 40-page document
  ✗ "Interest-free" when fees make it interest-equivalent
  ✗ Rate that changes without clear communication
  ✗ Automatic renewal without explicit consent
```

### Nguyên tắc 14: CLV Thinking: Bền vững hơn tối ưu hóa ngắn hạn

:::key
**Một khách hàng hài lòng mang về 8-12 lần giá trị so với khách hàng mới. Mọi decision nên tính đến số nhân này.**
:::

**CLV calculation (recap từ Chương 4, nhưng bây giờ như nguyên tắc):**

```text
Short-term thinking:
  "This customer is DPD 3 — collect aggressively!"
  Outcome: Customer pays under pressure. Feels bad. Leaves.
  Lost CLV: 5 future loans × 18M × 3% margin × 1.5y = 4,050,000 VNĐ
  
Long-term thinking:
  "This customer has been with us 18 months, always on time before.
   This is probably a blip. Reach out supportively."
  Outcome: Customer cured, stays, refers friends.
  Retained CLV: 4,050,000 VNĐ + referral value
  
  Decision: Supportive approach when P(temporary hardship) is high.
  Rule: When in doubt, assume the best → the CLV math usually supports it.

Organizational implication:
  Metrics should include CLV, not just: volume, NIM, default rate
  Decision-making should include: "CLV impact of this policy change?"
  Compensation should include: customer retention component
```

### Nguyên tắc 15: Responsible Lending Is Profitable

:::key
**Đây không phải niềm tin lạc quan. Đây là kết quả thực nghiệm từ các thị trường trưởng thành.**
:::

**The evidence:**

```text
India microfinance sector study (2015-2023):
  Lenders ranked by "responsible lending score" (affordability assessment,
  disclosure quality, collections ethics)
  
  Top quartile (responsible): 
    Default rate: 3.1%
    Customer retention: 71%
    CLV: 2.4× industry average
    Revenue growth: 18%/year
    
  Bottom quartile (predatory):
    Default rate: 11.8%
    Customer retention: 29%
    CLV: 0.6× industry average
    Revenue growth: 4%/year (before regulatory sanctions)
    
  3 of 5 "predatory" lenders: regulatory sanctions, license restrictions,
  or exit from market within 10 years.

Why responsible lending is profitable:
  Lower defaults → lower provisions → higher NIM
  Higher retention → lower CAC amortized → higher margin
  Trust → referrals → lower marketing cost
  Regulatory safety → no fines, no restrictions → growth allowed
  
  The one tension: short-term origination volume may be lower
  The resolution: short-term revenue ↓ → long-term profitability ↑
  
  CFO: "I need numbers now, not in 3 years."
  CRO: "The numbers in 3 years determine if you have a company."
  Both are right. The goal: find the balance.
```

:::note[NGUYÊN TẮC 12-15: SẢN PHẨM VÀ KHÁCH HÀNG]
12. Right product/customer/time: not just ethics,
it's the business model that works
13. Transparency → trust → loyalty → CLV
14. CLV thinking: 1 loyal customer = 8-12× new
15. Responsible lending: empirically profitable
:::

## 16.5 Nguyên tắc về tổ chức và văn hóa

### Nguyên tắc 16: Measure What Matters

:::key
**Mọi người optimize cho những gì được đo. Đo sai → optimize sai → destroy value.**
:::

**Metric alignment:**

```text
SALES TEAM incentivized by: volume only
  → Will push customers to borrow more than needed
  → Will ignore affordability signals
  → Short-term volume, long-term defaults

SALES TEAM incentivized by: quality-adjusted volume
  (Commission × cohort quality multiplier — recall Chương 13)
  → Aligned: want both volume and quality
  → Will self-select appropriate customers

COLLECTIONS TEAM incentivized by: recovery amount
  → Will maximize short-term recovery by any means
  → Aggressive tactics destroy customer relationships
  → High complaints, high churn

COLLECTIONS TEAM incentivized by: cure rate + customer satisfaction
  → Aligned: want to resolve AND preserve relationship
  → Sustainable collections strategies

PRODUCT TEAM incentivized by: product launch volume
  → Will rush features without proper testing
  → Technical debt, bugs, customer harm

PRODUCT TEAM incentivized by: 12-month vintage performance
  → Aligned: will think about long-term customer outcome
  → Won't launch products that look good short-term but fail long-term

Rule: Before setting any metric, ask:
  "If we optimize for this metric, what behavior does it incentivize?"
  "Is that the behavior we actually want?"
  If not: fix the metric.
```

### Nguyên tắc 17: Data-Informed, Human-Decided

:::key
**Data không membuat keputusan. Data menginformasikan keputusan. Manusia membuat keputusan. Dan manusia bertanggung jawab atas keputusan itu.**
*(Dữ liệu không ra quyết định. Dữ liệu thông tin cho quyết định. Con người ra quyết định. Và con người chịu trách nhiệm về quyết định đó.)*
:::

**The seduction of data:**

```text
"The model says decline. What's there to discuss?"
→ This is wrong. The model is a tool. You are the decision-maker.

"The data shows this is profitable. Let's do it."
→ Does data show ALL effects? Regulatory risk? Reputational risk? 
  Long-term customer harm? Data never shows everything.

RIGHT usage of data:
  Data: "Urgent payment timing correlates with 15% higher default rate"
  Human: "Should we charge higher rate for 'urgent' applications?"
  Data: cannot answer this (normative question)
  Human: must decide (with legal, ethics, business considerations)

Data-informed workflow:
  1. Define the question (human)
  2. Gather data (system)
  3. Analyze and model (data scientist)
  4. Interpret results (analyst + domain expert)
  5. Make decision (business leader, accountable)
  6. Implement and monitor (system + human)
  7. Review outcomes (human, loop back to step 1)

Accountability never transfers to "the model" or "the data."
The human who made the decision is accountable.
Full stop.
```

### Nguyên tắc 18: Speed vs Safety: Không phải Trade-Off thực sự

:::key
**"Move fast and break things" là advice cho social media. Trong consumer finance, broken things are people's financial lives.**
:::

```text
2021: A fintech launches "instant loan, no income verification"
  Speed: 30-second approval, no documentation
  Appeal: huge conversion rate, rapid growth
  Quarterly numbers: amazing
  
2022: First cohort matures
  Default rate: 18% (vs industry 5-6%)
  Regulatory inquiry: "Are you assessing affordability?"
  Answer: "Our AI does it automatically" (it didn't)
  Outcome: Regulatory sanction, forced slowdown, customer harm
  
Speed without safety: fast failure, not fast success

The reframe:
  "Move fast AND maintain safety" — not trade-off, but design challenge
  
  Examples:
  Fast AND safe: 2-second credit decision with full bureau check
  Fast AND safe: Same-day disbursement with fraud check completed
  Fast AND safe: 24-hour document processing with quality validation
  
  These require investment in AUTOMATION, not skipping steps.
  Skipping steps is not speed — it's debt (technical, regulatory, ethical).
```

### Nguyên tắc 19: Blameless Postmortem Culture

:::key
**Khi lỗi xảy ra, câu hỏi không phải "ai làm sai?" mà là "hệ thống có lỗ hổng nào cho phép điều này xảy ra?"**
:::

```text
VLP-670: PersistentBag stale state bug
  A developer made a change. The change caused an issue.
  
  Blame culture response:
    "Who wrote this code? They need to be held accountable."
    Result: Developer scared to make changes.
             Bugs hidden, not reported.
             Culture of fear → worse software quality over time.
  
  Blameless postmortem response:
    "How did the system allow this to reach production?"
    "What tests should we have had?"
    "What code review process failed?"
    "How do we make it impossible to make this class of mistake again?"
    Result: Better tests, better review process, better architecture.
             Developer learns without fear.
             Next person won't make same mistake.

Blameless postmortem template:
  1. What happened? (Timeline, factual)
  2. Impact: customers affected, financial impact, duration
  3. Root cause: why did this happen? (5 Whys technique)
  4. Contributing factors: what other factors enabled this?
  5. What went well? (Don't only focus on failures)
  6. Action items: specific, owned, time-bound changes
  7. Lessons: what do we learn for future design?
  
  NOT included: who did it, who is blamed, individual punishment
  Punishment for intentional misconduct: separate HR process
  Technical mistakes: always blameless postmortem
```

:::note[NGUYÊN TẮC 16-19: TỔ CHỨC VÀ VĂN HÓA]
16. Measure what matters → align incentives
17. Data-informed, human-decided, human-accountable
18. Speed + safety: design challenge, not trade-off
19. Blameless postmortem: fix systems, not people
:::

## Tổng hợp: 19 nguyên tắc

```text
TOÁN HỌC VÀ DỮ LIỆU:
  1. BigDecimal always. Round at last step only.
  2. Event date ≠ processing date. Store UTC.
  3. Data quality: completeness, accuracy, consistency, timeliness, lineage.

KIẾN TRÚC HỆ THỐNG:
  4. Tariff-driven: rules in database, not code.
  5. Audit trail: immutable, who/what/when/why, 7-10 years.
  6. Idempotency: safe to retry without double effect.
  7. Fail-safe: minimum harm on failure.

RISK MANAGEMENT:
  8. EL is cost. Monitor unexpected loss signals.
  9. Stress test for tail. Optimize for survival, not average.
  10. Calibrate models. Trust results, not assumptions.
  11. Concentration limits. Diversify before you need to.

SẢN PHẨM VÀ KHÁCH HÀNG:
  12. Right product, right customer, right time. Always.
  13. Transparency builds trust → CLV multiplier.
  14. CLV thinking: 1 loyal = 8-12× new customer.
  15. Responsible lending is empirically profitable.

TỔ CHỨC VÀ VĂN HÓA:
  16. Measure what you want to incentivize. Not just what's easy.
  17. Data informs. Humans decide. Humans accountable.
  18. Speed + safety: design challenge, not trade-off.
  19. Blameless postmortem: systems fail, not people.
```

## 16.6 Lá thư gửi người đọc tương lai

*Bạn đã đọc đến đây - và nếu bạn đã đọc theo đúng cách, bạn đã làm việc.*

*Bạn đã tính EMI của chị Lan bằng tay. Bạn đã trace EOM batch qua 10 steps. Bạn đã thiết kế fairness audit framework. Bạn đã debug một velocity fraud attack. Bạn đã viết một customer service prompt không hallucinate.*

*Đó là điểm khác biệt của cuốn sách này - không phải để đọc, mà để làm.*

**Nhưng có điều tôi muốn nói thêm, và không thể nói bằng công thức hay code.**

Consumer finance không phải chỉ là toán học. Không phải chỉ là hệ thống. Không phải chỉ là business model.

Đằng sau mỗi loan_id là một người.

Chị Lan - 28 tuổi, nhân viên kế toán, mua laptop để học thêm, để tiến xa hơn. Khoản vay 18.5M không lớn với bảng tính. Nhưng với chị, đó là 18 tháng tiết kiệm, là lựa chọn giữa đầu tư tương lai và đi đường vòng. Khi hệ thống của chúng ta approve trong 4 phút, đó không chỉ là transaction - đó là cơ hội.

Khi hệ thống của chúng ta charge lãi suất phù hợp, không ẩn phí - đó là tôn trọng.

Khi hệ thống của chúng ta gọi điện trước khi chị DPD, không phải sau - đó là quan tâm.

Khi hệ thống của chúng ta giúp chị tất toán sớm 2 tháng và tiết kiệm được 380,000 VNĐ - con số đó nhỏ trong bảng tổng kết, nhưng với chị, đó là 2 buổi đi chơi với con.

**Những nguyên tắc trong chương này** - từ BigDecimal đến tariff-driven đến responsible lending - không phải chỉ là best practices kỹ thuật. Chúng là cách để đảm bảo rằng hệ thống bạn xây phục vụ đúng mục đích: giúp người như chị Lan tiếp cận vốn một cách fair, transparent, và bền vững.

Bất kỳ hệ thống nào vi phạm những nguyên tắc này - dù có lý do gì, dù áp lực nào - đang làm tổn hại đến người cụ thể.

**Về tương lai:**

BNPL sẽ phát triển. AI sẽ score ngày càng chính xác hơn. Embedded finance sẽ biến credit thành invisible. Regulatory sẽ thắt chặt ở những nơi cần thiết.

Nhưng fundamentals không thay đổi:

Người ta vẫn sẽ cần vốn để seize opportunities.
Lenders vẫn sẽ cần tiền lãi để bền vững.
Rủi ro vẫn sẽ cần được đo, định giá, và quản lý.
Khách hàng vẫn sẽ cần được đối xử công bằng và minh bạch.

Những điều đó không thay đổi với technology.

**Về bạn:**

Bạn đã đọc cuốn sách này vì bạn muốn hiểu - không chỉ muốn biết. Bạn muốn có thể làm, không chỉ mô tả.

Giờ thì bạn có thể.

Bạn có thể ngồi với bà Hương và giải thích tại sao sub-prime rate 24.5% là hợp lý. Bạn có thể nói với Kỹ sư Tuấn tại sao tariff-driven design quan trọng hơn hardcode. Bạn có thể thiết kế một collections workflow biết phân biệt ai cần empathy và ai cần reminder.

Và quan trọng hơn - bạn có thể nhận ra khi nào hệ thống đang đi sai hướng, và nói ra.

**Lời cuối:**

Năm 1950, anh Bình ngồi đối diện với loan officer ông Hùng. Ông Hùng quyết định bằng cảm tính - đôi khi đúng, đôi khi sai, không consistency, không scale.

Năm 2025, hệ thống của chúng ta quyết định trong 4 giây - consistent, scalable, data-driven. Gini 0.62. PSI < 0.10. Auto-debit 82% opt-in.

Nhưng mục tiêu chưa bao giờ là một con số. Mục tiêu là: anh Bình xứng đáng được vay có cơ hội. Người không xứng đáng được bảo vệ khỏi debt spiral. Và toàn bộ ecosystem - lenders, borrowers, xã hội - bền vững.

Đó là lý do tồn tại của ngành này. Đó là lý do tồn tại của những gì bạn xây dựng.

**Xây dựng tốt.**

## Phụ lục của chương

### Quick Reference: 19 nguyên tắc một câu

```text
1.  BigDecimal, không double. Round cuối cùng, không mỗi bước.
2.  Event date ≠ processing date. Lưu UTC, hiện địa.
3.  Data quality: đo và monitor — completeness, accuracy, freshness.
4.  Config in DB. Code cho algorithm, DB cho business rule.
5.  Audit log immutable. Who/what/when/why — mãi mãi.
6.  Idempotency key trên mọi write operation.
7.  Design for failure mode, không chỉ happy path.
8.  EL là chi phí, đã tính vào giá. Monitor Unexpected Loss.
9.  Stress test for tail, không optimize for average.
10. Calibrate mọi model. Distrust unvalidated predictions.
11. Concentration limits trước khi cần, không sau khi cần.
12. Right product + right customer + right time. Always.
13. Transparency → trust → loyalty. Không ẩn phí.
14. 1 loyal customer = 8-12× new customer. CLV ngừng tính.
15. Responsible lending là profitable. Không phải chỉ ethical.
16. Đo những gì bạn muốn incentivize. Không phải gì dễ đo.
17. Data informs, human decides, human accountable.
18. Speed + safety là design challenge, không phải trade-off.
19. Postmortem: fix systems, not people.
```

*"Kiến Trúc Tín Dụng" kết thúc ở đây. Không phải vì đã nói hết mọi thứ - mà vì nền tảng đã đủ để bạn tiếp tục tự mình.*

*Câu chuyện tiếp theo là của bạn.*
