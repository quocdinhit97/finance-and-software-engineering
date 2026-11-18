---
title: "Chương 13. Kinh tế học hành vi và tài chính có trách nhiệm"
sidebar_label: "13. Kinh tế học hành vi và tài chính có trách nhiệm"
sidebar_position: 3
chapter: 13
subtitle: "Behavioral Economics and Responsible Finance"
reading_time: 28
source_file: "phan-3-chuong-13.md"
editorial_status: "mechanical"
---

> *"Người ta không ra quyết định tài chính như robot tối ưu hóa. Họ ra quyết định như con người - với cảm xúc, với thiên kiến, với thông tin không đầy đủ, trong bối cảnh áp lực và không chắc chắn. Hệ thống tài chính tốt phải hiểu điều này - và thiết kế để giúp, không phải khai thác."*

## Dẫn nhập: Hai cuộc gặp gỡ, một quyết định

::::story
**Cảnh 1 - Tháng 3/2024:**

Chị Lan bước vào cửa hàng điện thoại. Trên màn hình iPad của sales rep: "Chỉ cần 490,000 VNĐ/tháng - iPhone 15 về nhà ngay hôm nay!"

Chị Lan không hỏi lãi suất. Chị không tính tổng tiền trả. Chị chỉ nghĩ: *490,000 - có vẻ ổn.* Và ký.

Lãi suất: 22%/năm. Tổng tiền trả: 15,680,000 VNĐ cho chiếc điện thoại giá 12,000,000 VNĐ.

**Cảnh 2 - Tháng 9/2024:**

Chị Lan nhận được thông báo từ app: "Khoản vay của bạn còn 3 tháng. Thanh toán trước 1 lần có thể tiết kiệm 320,000 VNĐ tiền lãi. Bạn có muốn xem không?"

Chị Lan click. Thấy số tiền tiết kiệm cụ thể. Chuyển khoản ngay.

Hai tình huống khác nhau về cùng một người, cùng một hệ thống tài chính. Tình huống 1: hệ thống khai thác cognitive bias để bán. Tình huống 2: hệ thống dùng behavioral design để giúp customer ra quyết định tốt hơn.

Ranh giới giữa hai tình huống này - đó là chủ đề của chương cuối Phần III.
::::

## 13.1 Nền tảng kinh tế học hành vi

### Dual-Process Theory: System 1 vs System 2

**Khái niệm (Daniel Kahneman, *Thinking, Fast and Slow*, 2011):**

:::key
**System 1:** Tư duy nhanh, tự động, cảm tính. Không tốn effort. Dễ bị biased.

**System 2:** Tư duy chậm, có chủ đích, logic. Tốn effort. Chính xác hơn nhưng mệt mỏi.
:::

**Tại sao quan trọng cho tài chính:**

```text
Quyết định tài chính lý tưởng: System 2
  Tính toán đầy đủ: tổng tiền trả, lãi suất thực, so sánh alternatives
  Đánh giá khả năng trả trong 18 tháng tới
  Cân nhắc rủi ro: nếu mất việc, nếu ốm đau...

Quyết định tài chính thực tế: System 1 dominant
  "490,000/tháng — OK, tôi có thể trả được"
  "Được duyệt rồi, cứ ký đi"
  "Cần cái điện thoại đó lắm, cần ngay bây giờ"

Kết quả: Mismatch giữa quyết định thực tế và quyết định lý trí
  → Over-indebtedness
  → Default
  → Regret
```

**Cái bẫy cognitive load:**

```text
Scenario: Customer đang mua tủ lạnh tại cửa hàng
  - Đứng giữa cửa hàng ồn ào
  - Sales rep đứng ngay bên cạnh
  - Đứa con nhỏ đang kéo tay
  - Đã xem 5 mẫu tủ lạnh trong 2 tiếng
  
Cognitive load: rất cao
→ System 2 đã mệt (ego depletion)
→ System 1 dominant: "Ký đi, về nhà thôi"

Ethical system design phải:
  Không exploit high cognitive load moments
  Provide simple, key information at point of decision
  Allow time to think (không tạo false urgency)
```

### Prospect Theory: Loss Aversion

**Kahneman & Tversky (1979) - Nobel Prize winning insight:**

> Người ta không evaluate outcomes theo absolute value.
> Họ evaluate theo **changes** from a **reference point**.
> Và **losses loom larger than equivalent gains**.

**Phát biểu toán học:**

```text
Value function v(x):
  Gains: v(x) = x^α, where α ≈ 0.88 (concave — diminishing sensitivity)
  Losses: v(x) = -λ(-x)^β, where β ≈ 0.88, λ ≈ 2.25 (loss aversion coefficient)

What λ ≈ 2.25 means:
  Losing 100,000 VNĐ feels as bad as gaining 225,000 VNĐ feels good
  
Practical implication for lending:
  Customer who has just paid off a loan (reference point reset):
  → Framing next loan as "getting back 20M you had before" 
    feels better than "taking on 20M debt"
  → Retention offers should frame as restore, not borrow
```

**Loss aversion trong repayment behavior:**

```text
Experiment (Beshears et al., 2021):
  Group A: "Pay now and SAVE 50,000 VNĐ in interest"
  Group B: "Don't pay now and PAY 50,000 VNĐ extra in interest"
  
  Mathematically identical.
  Group B payment rate: 34% HIGHER than Group A.
  
  → Loss framing more motivating than gain framing
  → "You're losing 50,000" > "You're saving 50,000"

Application: Payment reminders
  ❌ "Thanh toán sớm để tiết kiệm 50,000 đồng lãi"
  ✓  "Nếu không thanh toán trước ngày 25, bạn sẽ phải trả thêm 50,000 đồng lãi"
  
  Second framing triggers loss aversion → higher payment rate
  (But must be accurate — cannot fabricate penalties)
```

### Present Bias: Tại sao người ta vay quá nhiều

**Khái niệm:**

:::key
**Present bias** *(thiên kiến hiện tại)*: Người ta overweight hiện tại so với tương lai - ngay cả khi biết điều đó không rational.
:::

**β-δ model (Laibson, 1997):**

```text
Standard discounting (rational):
  Utility at time t = δ^t × future_utility
  
  Ví dụ: δ = 0.95 (5% annual discount)
  100,000 hôm nay = 95,000 năm sau = 90,250 hai năm sau...
  
  Consistent preferences over time

Hyperbolic discounting (behavioral reality):
  Utility at time t = β × δ^t × future_utility (for t > 0)
  Where β < 1 (present bias factor, typically 0.6-0.8)
  
  100,000 hôm nay >> β × 95,000 năm sau
  (Present valued disproportionately higher)
  
  "I'll start saving next month" — but next month never comes
  Because when next month arrives: NOW is the present too!
```

**Ví dụ số - vay tiêu dùng:**

```text
Chị Lan muốn mua laptop 18,500,000 VNĐ:

Option A: Save 12 months, buy with savings
  Cost: 18,500,000 VNĐ (no interest)
  But: Wait 12 months → significant present cost (delay)
  
Option B: Borrow now, pay back over 18 months
  Cost: 18,500,000 × (1 + 15.5%×1.5) = 22,800,000 VNĐ
  Monthly payment: 1,267,000 VNĐ/month
  Extra cost: 4,300,000 VNĐ (23% premium for immediacy)
  
  But: Get laptop NOW
  Present bias: Future 4,300,000 VNĐ discounted heavily

For chị Lan (β = 0.7):
  Present value of "wait 12 months" pain: HIGH (β undershoots future)
  Present value of "4,300,000 extra in 18 months": LOW (β + δ discount)
  
  → Rational to borrow even at 23% premium given her actual preferences!

This is NOT irrationality — it's hyperbolic discounting.
System design implication: 
  Leverage present bias for GOOD: design savings-as-default
  Don't EXPLOIT present bias to sell unnecessary debt
```

:::summary[Behavioral Economics Foundations]
System 1 vs System 2: financial decisions mostly
System 1 → cognitive load exploitation is easy
but unethical
Loss aversion λ≈2.25: "lose 50K" motivates more
than "save 50K" - use in payment reminders
Present bias: over-borrowing is predictable, not
stupid - design systems that help, not exploit
:::

## 13.2 Cognitive Biases trong vay mượn

### Anchoring: Kẻ thù của Informed Decision

::::story[Tình huống - bài tập]
Trước khi đọc tiếp, ghi ra: bạn sẵn sàng trả bao nhiêu tiền/tháng cho một khoản vay 15 triệu VNĐ?
::::

**Nếu bạn vừa thấy con số "750,000" ở đâu đó trong 30 giây qua**, nghiên cứu cho thấy bạn có 40% khả năng trả lời gần 750,000 hơn so với nhóm vừa thấy "1,500,000."

Đây là anchoring - và nó ảnh hưởng trực tiếp đến credit decisions.

**Anchoring trong loan presentation:**

```text
Research finding (Bertrand et al., 2010, South Africa):
  Loan offer letters with PHOTO of attractive person:
  → Men approved 8% more often (gender effect of anchor)
  
  Loan offer with comparison table showing competitor rate 30%:
  → Our rate of 22% looks much better → higher acceptance
  → "Anchored" to 30%, even though 22% may still be expensive

Trong consumer lending application flow:
  Scenario A: Show maximum approved amount first
    Customer sees: "Bạn được duyệt tối đa 50,000,000 VNĐ"
    Most customers then request amount close to maximum
    → "If I'm approved for 50M, 30M seems reasonable"
    
  Scenario B: Show recommended amount based on DTI
    Customer sees: "Dựa trên thu nhập, chúng tôi khuyến nghị 15,000,000 VNĐ"
    Most customers request amount close to recommendation
    → Lower default rate, higher customer wellbeing

Real experiment: Change "Show max first" to "Show recommended first"
  → Average loan amount: -18%
  → Default rate: -22%
  → Customer satisfaction (long-term): +15%
  → Short-term revenue: -8% (less volume)
  
The tension: Less loan = less revenue SHORT TERM
             Better affordability = less default LONG TERM
             Better customer outcome = trust + retention FOREVER
```

### Optimism Bias: "Mình sẽ không gặp vấn đề"

**Khái niệm:**

:::key
**Optimism bias** *(thiên kiến lạc quan)*: Người ta systematic overestimate khả năng positive outcomes và underestimate khả năng negative outcomes cho chính họ.
:::

**Ví dụ số trong lending:**

```text
Survey kết quả (1,000 borrowers trước khi vay):
  "Bạn có nghĩ bạn sẽ gặp khó khăn trả nợ không?"
  
  Answered "definitely not": 72%
  Answered "unlikely": 20%
  Answered "possible": 7%
  Answered "likely": 1%
  
  But actual outcome after 18 months:
  "No difficulty": 68%
  "Some difficulty": 19%
  "Significant difficulty": 9%
  "Defaulted": 4%
  
  → 72% thought "definitely not" → only 68% actually fine
  → 8% thought "possible to likely" → 13% actually had difficulty/default
  
  EVERYONE underestimates their own risk.
```

**Tại sao này quan trọng cho system design:**

```text
If everyone underestimates risk:
  Self-reported affordability → systematically optimistic
  "Can you afford 1,267,000/month?" → "Yes" (thinking of best case)
  But stress scenarios never considered

System response:
  Don't rely solely on self-reported affordability
  Stress test in affordability calculation:
    "If your income drops 20%, can you still service this loan?"
    "If you have an unexpected expense of 3M, can you still pay?"
  
  Communicate risk explicitly:
    "Với thu nhập hiện tại, nếu bạn mất việc hoặc thu nhập giảm 20%,
     khoản trả hàng tháng 1,267,000 VNĐ có thể là gánh nặng.
     Bạn có dự phòng cho tình huống này không?"
  
  → Not to scare customer away, but to help them make informed decision
  → Some will reconsider. Those who don't: at least they were warned.
```

### Mental Accounting: Tiền trong các "ngăn" khác nhau

**Khái niệm (Richard Thaler, Nobel 2017):**

:::key
**Mental accounting** *(kế toán tâm lý)*: Người ta treat money differently depending on its mental "bucket" - salary, bonus, windfall, savings đều là tiền nhưng behave khác nhau.
:::

**Ví dụ phổ biến:**

```text
Case 1: Unexpected windfall
  Chị Lan nhận thưởng bất ngờ 3,000,000 VNĐ
  → Typically SPENT (it's "found money," not "earned money")
  → Even if she has outstanding loan at 18%
  
  Rational behavior: Use windfall to pay down loan → save interest
  Actual behavior: "Bonus money" → buy something nice
  
  Mental accounting explanation: Bonus ≠ regular money in her mind

Case 2: Tax refund
  Same effect: Tax refund feels like "free money"
  → Higher spend rate than equivalent salary income
  
Case 3: Earmarked savings
  "Money for child's education": very hard to touch
  "General savings": easier to spend
  → Same money, different mental bucket → different behavior

Application for repayment design:
  Help customer create "loan repayment" mental bucket
  Auto-debit on salary day: money never enters "spending" bucket
  → Much higher repayment rate than "remember to pay manually"
  
  Outcome: Auto-debit customers: 94% on-time payment
            Manual payment customers: 76% on-time payment
```

:::summary[Cognitive Biases Trong Vay Mượn]
Anchoring: "Show recommended amount" not max →
-18% avg loan, -22% default rate
Optimism bias: everyone underestimates own risk →
stress test affordability, communicate risk
Mental accounting: auto-debit on salary day →
94% vs 76% on-time (same customer, different
design)
:::

## 13.3 Nudge Design: Thiết kế để giúp

### Default Options: Lựa chọn mặc định mạnh nhất

**Khái niệm:**

:::key
**Default option** *(lựa chọn mặc định)*: Kết quả xảy ra nếu customer không actively chọn gì khác. Research nhất quán: most people accept defaults.
:::

**Classic example - organ donation:**

```text
Austria (opt-out): 99.98% donation rate
Germany (opt-in): 12% donation rate

Exact same population, different DEFAULT.
→ Default is the most powerful design decision you can make
```

**Defaults trong consumer lending:**

```text
AUTO-DEBIT DEFAULT:

Current design (opt-in):
  Application form: "Bạn có muốn đăng ký trả nợ tự động không? [ ] Có"
  Opt-in rate: 45%
  
Better design (default-on, opt-out):
  Application form: "Trả nợ tự động đã được bật cho tài khoản của bạn.
                    Nếu bạn muốn tắt: [ ] Tắt tự động trả"
  Opt-in rate: 82% (same feature, default-on)
  
Result: 37% more customers on auto-debit
  → 37% fewer late payments
  → 37% fewer late fees charged to customer
  → Positive for BOTH customer and lender

LOAN AMOUNT DEFAULT:

When customer enters income:
  Old design: "Amount:" [blank field]
  New design: "Amount: [15,000,000 VNĐ ← Khuyến nghị dựa trên thu nhập]"
  
  Old design: Average requested = 24M (self-set anchor)
  New design: Average requested = 17M (recommendation anchor)
  Default saves customer from over-borrowing.

REPAYMENT DATE DEFAULT:

Old design: "Choose repayment date" [1st ... 28th]
New design: Default to 3 days AFTER salary date
  → Customer doesn't have to think
  → Money arrives → loan paid → simple
  
On-time payment improvement: +11%
```

### Commitment Devices: Giúp người ta giữ lời hứa với chính mình

**Khái niệm:**

:::key
**Commitment device** *(thiết bị cam kết)*: Cơ chế cho phép người ta voluntarily restrict their future choices để stick to their current intentions.
:::

**Ứng dụng kinh điển:**

```text
Ulysses và Sirens: Ulysses biết mình sẽ không resist tiếng Sirens.
Giải pháp: Tự trói mình vào cột thuyền trước.
→ Present self commits future self to the desired behavior.
```

**Commitment devices trong lending:**

```text
SAVINGS LOCK:
  Customer muốn tiết kiệm để tránh vay tiếp.
  Challenge: Present bias → savings gets raided.
  
  Feature: "Mục tiêu tiết kiệm" — lock savings for 6 months
  If withdraw early: 2% penalty
  
  Result: 67% higher savings retention vs unlocked savings
  Customers WANT this feature: they know they're present-biased

DEBT PAYDOWN COMMITMENT:
  When getting a bonus, customer can "commit" to paydown:
  "Tôi cam kết dùng khoản thưởng tiếp theo để trả trước khoản vay"
  → App sends reminder when payroll from committed employer arrives
  → One-click confirm to execute
  
  Opt-in rate: 34% of customers make this commitment
  Follow-through: 81% who commit actually execute
  (vs 23% who intend to but don't commit formally)

SPENDING BUDGET + LOAN LOCK:
  Customer can set: "If my non-essential spending exceeds X,
                    block my ability to request new loans for 30 days"
  → Voluntary self-exclusion
  
  Niche feature but highly valued by financially stressed customers
  → Reduces debt spiral, reduces defaults, increases trust
```

### Feedback và Transparency Tools

**The transparency gap:**

```text
What customers typically know:
  ✓ Monthly payment amount
  ✓ Payment due date
  
What customers often don't know:
  ✗ How much of PMT is interest vs principal
  ✗ Total interest paid to date
  ✗ How much interest they'd save by paying early
  ✗ How current loan affects their overall debt picture

The gap creates passive customers → miss optimization opportunities
```

**Effective transparency features:**

**Feature 1: Amortization Visualization**

```text
Loan: 18,500,000 VNĐ, 18 months, 15.5%
PMT: 1,168,000 VNĐ/month

Month  | Principal Paid | Interest Paid | Outstanding
1      |    930,000    |    238,000    | 17,570,000
2      |    942,000    |    226,000    | 16,628,000
...
18     |  1,153,000    |     15,000    |          0

Visualization: Bar chart showing principal (green) vs interest (red)
  Early months: mostly red → "I'm paying mostly interest!"
  Later months: mostly green → "I'm building equity!"

Insight customers get: "If I pay off early, I save all that red interest"
Action: 23% of customers who see this visualization make extra payment within 30 days
```

**Feature 2: Early Payoff Calculator**

```text
Screen element: "Tiết kiệm bao nhiêu nếu trả trước?"

Input: "Số tiền bạn có thể trả thêm: [          ]"
Output: "Trả thêm 2,000,000 VNĐ tháng này sẽ:
         → Rút ngắn kỳ hạn: 2 tháng
         → Tiết kiệm lãi: 380,000 VNĐ
         → Tất toán sớm: Tháng 4/2026 (thay vì Tháng 6/2026)"

[Thanh toán ngay] button → direct to payment flow

Adoption: 18% of customers use this feature monthly
Of users: 42% make partial prepayment after seeing calculation
```

**Feature 3: Debt Health Score (không phải credit score)**

```text
Monthly summary sent via push notification:
  ┌──────────────────────────────────┐
  │ 💚 Sức khỏe tài chính của bạn   │
  │                                  │
  │ Tổng nợ:  34,200,000 VNĐ        │
  │ Tỷ lệ DTI: 18.4% (mức an toàn) │
  │ Tiến độ trả nợ: ████████░░ 78%  │
  │                                  │
  │ 🎯 Còn 4 tháng là tất toán!     │
  │ [Xem chi tiết] [Trả trước]      │
  └──────────────────────────────────┘

Key design choices:
  ✓ "Sức khỏe" framing (positive) not "debt" framing (negative)
  ✓ Progress bar: completion motivation (Zeigarnik effect)
  ✓ Concrete milestone: "4 tháng" not abstract "23% remaining"
  ✓ Action button: zero-friction path to desired behavior
```

:::summary[Nudge Design]
Default options: most powerful tool
→ Auto-debit default-on: 45% → 82% opt-in
→ Recommended amount: -18% avg loan
Commitment devices: customers WANT to commit
→ Savings lock: 67% better retention
→ Bonus paydown commitment: 81% follow-through
Transparency: show what's normally hidden
→ Amortization viz: 23% make extra payment
→ Early payoff calculator: 42% act on it
:::

## 13.4 Phát hiện và ngăn chặn Over-Indebtedness

### Dấu hiệu cảnh báo sớm

::::story
Sau 8 tháng trả nợ đúng hạn, chị Lan bắt đầu gặp khó khăn. Cô không nói với ai. Cô cứ tiếp tục. Tháng 9: trả đúng. Tháng 10: trả muộn 3 ngày. Tháng 11: trả muộn 8 ngày. Tháng 12: không trả được.

Có 4 tháng để can thiệp. Hệ thống phải "thấy" trước khi DPD xảy ra.
::::

**Early warning indicators:**

```text
BEHAVIORAL SIGNALS (từ app/digital channel):
  App login frequency: giảm (0.7× vs baseline)
  Payment timing: shifting later in grace period
  Customer service calls: tăng (questions about relief options)
  Profile change: employment information updated (job change?)
  
PAYMENT PATTERN SIGNALS:
  Partial payment (paid 80% of due amount): strong early warning
  Payment timing drift: paying on day 5 → day 10 → day 15 of grace
  Multiple payment attempts: tried to pay, failed → retry next day
  
EXTERNAL SIGNALS (if integrated):
  Bureau inquiries increase: applying elsewhere (needs cash)
  New loans opened at other lenders: taking on more debt
  Utility payment delay: broader financial stress
  
FINANCIAL STRESS SCORE MODEL:
  Features: all above signals
  Output: P(will default in next 60 days)
  
  Trigger: P(default) > 30% → early intervention
  
  Precision at 30% threshold: 62% (of flagged customers: 62% do have issues)
  Recall at 30% threshold: 71% (of customers with issues: 71% are flagged)
```

### Affordability Assessment Design

**Nguyên tắc: Affordability ≠ Eligibility**

```text
Eligibility: "Can the customer GET this loan?"
  Based on: credit score, fraud check, bureau data
  
Affordability: "SHOULD the customer GET this loan?"
  Based on: can they actually service it without undue hardship?
  
Common mistake: Only do eligibility, skip affordability
  → Legal in some markets, but not Responsible Lending

Affordability assessment includes:

1. Income verification (không chỉ declaration):
   ✓ Payslip verification via OCR/manual check
   ✓ Bank statement analysis (actual spending patterns)
   ✓ Employment confirmation (phone check with employer)
   
2. Existing obligations:
   ✓ All outstanding loans (from bureau)
   ✓ Self-declared obligations bureau doesn't know about
   ✓ Regular essential expenses (rent, utilities, school fees)
   
3. Residual income test:
   Residual = Income - All obligations (existing + new loan)
   Must exceed minimum living expenses for household
   
   Minimum living expenses benchmark:
   HCM City: 5,000,000 VNĐ/person/month
   Other cities: 3,500,000 VNĐ/person/month
   Rural: 2,500,000 VNĐ/person/month
   
   Threshold: Residual / Household minimum >= 1.2 (20% buffer)

4. Stress test:
   "What if income drops 20%?"
   Can household still meet all obligations?
   If not: reduce loan amount, extend tenor, or decline
```

### Intervention Strategies

**Tiered intervention framework:**

```text
TIER 1: Pre-emptive nudge (P(default) 15-30%)
  Action: App push notification
  Message: "Chúng tôi nhận thấy bạn đang trong giai đoạn bận rộn.
            Khoản thanh toán 1,168,000 VNĐ đến hạn 25/11.
            Nhắc tôi lại [3 ngày trước] [1 ngày trước]"
  
  Goal: Remove friction, not alarm customer
  Expected impact: 40% reduction in DPD event

TIER 2: Proactive reach-out (P(default) 30-50%)
  Action: Customer service outbound call
  Script: "Chào chị Lan, tôi gọi để hỏi thăm về khoản vay sắp đến hạn.
           Gần đây chị có gặp khó khăn gì không? Chúng tôi có thể
           hỗ trợ điều chỉnh lịch thanh toán nếu cần."
  
  Key: Do NOT mention "you're at risk of default"
  Key: Offer help proactively, not demand payment
  Expected impact: 55% of reached customers take some action
  
  Options offered:
    - Payment date change (free, 1× per year)
    - Payment holiday 1 month (free, 1× per life of loan)
    - Restructure: extend tenor, reduce monthly payment

TIER 3: Hardship intervention (P(default) 50%+ or DPD 1-15)
  Action: Dedicated hardship team contact
  Assessment: What's the root cause? (job loss, medical, divorce?)
  Solution tailored to cause:
    Job loss: 3-month payment holiday + job placement support link
    Medical: Extended holiday + insurance claim assistance
    Over-indebtedness: Restructure + budgeting counseling referral
  
  Goal: Cure and retain, not collect and sue

TIER 4: Collections (DPD 30+)
  [Recall Chapter 10 — Collections & Debt Management]
```

## 13.5 Responsible Marketing và Sales

### Ethical Offer Presentation

::::story
Kỹ sư Tuấn nhận yêu cầu từ Marketing: "Xây dựng tính năng hiển thị amount lớn nhất được duyệt đầu tiên, nổi bật trên màn hình."

Tuấn biết từ data: hiển thị max amount trước → average loan +23% → default rate +18%.

Anh nên làm gì?
::::

**Framework: The "Reasonable Person" Standard**

```text
Câu hỏi: "Would a reasonable person, with full information,
          feel manipulated or deceived by this design?"

Test 1 — Legal:
  Is this compliant with consumer protection regulations?
  Does it violate truth-in-lending requirements?
  
Test 2 — Newspaper:
  If this design choice appeared in headline:
  "Công ty tài chính X hiển thị max loan amount để dụ khách vay nhiều hơn"
  Would you be comfortable with that headline?
  
Test 3 — Reciprocal:
  Would you apply this design to your own mother/sibling
  applying for a loan?
  
Test 4 — CLV:
  Does this design help or hurt the customer's long-term financial health?
  If hurts: does short-term revenue justify long-term harm?
```

**Practical ethical guidelines:**

```text
PRICING DISPLAY:
  ✓ APR prominently displayed (same size as rate)
  ✓ Total cost shown before acceptance
  ✓ Monthly payment WITH total cost, not just monthly payment
  ✗ Never: Hide fees in fine print
  ✗ Never: Show only monthly payment, bury total cost

AMOUNT DISPLAY:
  ✓ Show recommended amount (based on DTI calculation)
  ✓ Allow customer to adjust (informed choice)
  ✓ Show impact: "If you borrow X more: PMT increases by Y, total interest +Z"
  ✗ Never: Show max amount as default/recommended
  ✗ Never: Upsell amount without showing full cost implication

URGENCY:
  ✓ True limited-time offers with actual expiry
  ✓ "Your application expires in 7 days" (if true)
  ✗ Never: Fake countdown timers
  ✗ Never: "Only 3 spots left!" (if not true)
  ✗ Never: "This rate is only available today" (if renewable tomorrow)
```

### Vulnerable Customer Identification

**Định nghĩa vulnerable customer:**

```text
FCA (UK Financial Conduct Authority) definition:
  A customer who, due to their personal circumstances, is especially 
  susceptible to harm — particularly when a firm is not acting with 
  appropriate levels of care.

Categories:
  1. Health: physical or mental health conditions affecting judgment
  2. Life events: bereavement, job loss, relationship breakdown
  3. Resilience: low financial resilience, unable to withstand shocks
  4. Capability: low financial literacy, limited understanding of products

Vietnam context:
  Elderly customers: may not fully understand digital products
  First-time borrowers: no experience with debt management
  Customers under financial stress (detected from behavior signals)
  Customers with high DTI before applying
```

**System identification signals:**

```text
Vulnerability indicators (requires consent to collect/use):
  Age > 65 AND first loan application → age + first-timer flag
  Customer service history: distress indicators in transcripts (NLP)
  Multiple declined applications in short period → financial stress
  Application submitted after midnight repeatedly → stress behavior
  
Action when vulnerability flag triggered:
  Route to human agent review (not auto-decision)
  Extended explanation time at POS (agent trained)
  Second review before disbursement
  Follow-up call 30 days after disbursement: "Mọi thứ ổn không?"
  
Note: Cannot deny service based on vulnerability alone (discrimination risk)
Must: Provide service with additional care and support
```

### Sales Incentive Alignment

::::story
Bà Hương reviewing Q3 performance. Agent Hà ở Hà Nội: volume 200 loans, bonused \$2,000. Average loan size: 25M. Default rate trong cohort: 11%.

Agent Nam ở Đà Nẵng: volume 140 loans, bonus \$700. Average loan size: 18M. Default rate trong cohort: 3.5%.

Ai là agent tốt hơn?
::::

**Misaligned incentive problem:**

```text
Common bad incentive structure:
  Commission = X% of loan amount disbursed
  
  Agent's rational response:
    → Maximize loan amount (get customer to borrow more)
    → Minimize application friction (overlook red flags)
    → Not care about repayment (they've moved on)
  
  Result:
    High origination volume → High defaults → Profit illusion
    Agent wins short-term → Company loses long-term

Better incentive structure — Quality-adjusted commission:
  Base commission: X% of disbursed amount
  Quality multiplier: based on cohort DPD 30+ rate at 12 months
  
  Multiplier:
    DPD 30+ < 3%: 1.5× (reward excellence)
    DPD 30+ 3-6%: 1.0× (standard)
    DPD 30+ 6-10%: 0.7× (penalty)
    DPD 30+ > 10%: 0.0× (clawback previous commissions)
  
  For Agent Hà: 200 loans × 25M × X% × 0 = $0 (clawback)
  For Agent Nam: 140 loans × 18M × X% × 1.5 = $1,575 (1.5× for quality)
  
  Nam gets more despite lower volume because quality is higher.
  Hà is penalized for selling inappropriate loans.
```

**Alignment at product level:**

```text
Product manager incentives aligned to:
  ✓ 12-month vintage default rate (outcome metric)
  ✓ Customer satisfaction score (NPS)
  ✓ Repeat customer rate (retention)
  ✗ NOT: Pure volume or revenue (short-term)
  
Sales incentives aligned to:
  ✓ Quality-adjusted commission (as above)
  ✓ Customer satisfaction at point of sale
  ✗ NOT: Loan amount per application
  ✗ NOT: Approval rate (don't incentivize approving bad loans)
```

:::summary[Responsible Marketing & Sales]
"Reasonable person" test: Legal + Newspaper +
Reciprocal + CLV - 4 filters for design choices
Vulnerable customers: identify → route to human
review → serve with additional care
Incentive alignment: commission × quality mult.
DPD 30+ > 10%: clawback → agents aligned
:::

## 13.6 Tài chính có trách nhiệm

### Responsible Lending Framework

::::story
Anh Minh propose: "Chúng ta nên có 'Responsible Lending Charter' - một tuyên bố rõ ràng về những gì chúng ta sẽ làm và không làm."

Bà Hương: "Nghe hay đấy. Nhưng tôi muốn nó là thực chất, không phải marketing document."
::::

**Responsible Lending Charter - cấu trúc thực chất:**

```text
SECTION 1: AFFORDABILITY COMMITMENT
  We will:
  □ Assess ability to repay based on verified income, not just stated
  □ Include stress test: can customer afford at income -20%?
  □ Consider all existing obligations, not just bureau-visible
  □ Not originate loans where residual income < 1.2× minimum living expenses
  
  We will not:
  □ Approve loans purely based on collateral (without affordability check)
  □ Allow sales pressure to override affordability assessment
  □ Use complex terms to obscure true cost of borrowing

SECTION 2: TRANSPARENCY COMMITMENT
  We will:
  □ Display APR prominently in all marketing and offer materials
  □ Show total cost of credit before customer accepts
  □ Provide clear explanation of fees, penalties, and conditions
  □ Make rejection reasons available to applicant on request
  
  We will not:
  □ Advertise monthly payments without mandatory total cost disclosure
  □ Bury material conditions in fine print
  □ Change terms after customer has committed

SECTION 3: FAIRNESS COMMITMENT
  We will:
  □ Conduct quarterly fairness audit of approval rates by demographic
  □ Investigate and remediate detected disparate impact
  □ Provide consistent treatment regardless of race, gender, religion
  □ Use only credit-risk-relevant factors in pricing and approval
  
  We will not:
  □ Use protected characteristics as pricing or approval factors
  □ Use proxies for protected characteristics knowingly

SECTION 4: OVER-INDEBTEDNESS PREVENTION
  We will:
  □ Implement early warning system and proactive intervention
  □ Offer hardship programs before default escalation
  □ Train collections team on empathy and sustainable resolution
  □ Report actual DPD rates to Board quarterly (not just approval metrics)
  
  We will not:
  □ Use harassment or deceptive tactics in collections
  □ Contact customer at unreasonable hours
  □ Threaten legal action before exhausting voluntary resolution options
```

### Measuring Customer Wellbeing

**Beyond default rate - what should we measure?**

```text
STANDARD METRICS (what most lenders track):
  Approval rate, volume, NIM, default rate, NPL ratio
  → These tell you about LENDER performance
  → They don't tell you about CUSTOMER outcomes

CUSTOMER WELLBEING METRICS:

1. Financial Health Score (monthly survey, sample):
   "Compared to 3 months ago, how is your financial situation?"
   1 (much worse) to 5 (much better)
   → Trend by cohort and product
   
2. Post-loan satisfaction:
   12-month post-origination: "Was this loan the right decision for you?"
   → % saying "yes" is a direct wellbeing indicator
   
3. Debt-to-Income improvement:
   Compare DTI at origination vs 12 months after
   → Did loan help (e.g., productive use, income increase)
     or hurt (income same, more debt)?
   
4. Repeat loan request rate AND quality:
   % of customers who come back AND in better financial position
   vs % who come back AND in worse position (debt spiral signal)
   
5. Net Promoter Score with context:
   "Would you recommend us to a friend?" WITH reason
   → "Great product" vs "only option I had" — very different!

Reporting to Board:
  Each quarterly review: present BOTH lender metrics AND customer metrics
  Explicitly flag: "Customer wellbeing improving/declining" as a metric
  Tie management bonus to customer wellbeing improvement
```

### Long-Term Value vs Short-Term Extraction

**The fundamental tension:**

```text
Short-term extraction model:
  Maximize revenue per customer per interaction
  High-pressure sales → larger loans
  Complex terms → higher fees hidden
  No early payoff incentive (interest income maximized)
  Aggressive collections → maximum recovery short term
  
  Outcome: High revenue quarter 1-4
  Outcome: Customer damaged financially
  Outcome: Trust eroded → customer leaves
  Outcome: Regulatory scrutiny → fines, restrictions
  Outcome: Year 5: lower CLV than ethical approach

Long-term value model:
  Right loan, right customer, right time
  Transparent terms → customer makes informed choice
  Support prepayment → reduce customer cost
  Proactive hardship management → preserve customer relationship
  Ethical collections → customer retains dignity → may return
  
  Outcome: Lower revenue quarter 1-4
  Outcome: Customer financially healthier
  Outcome: Trust built → customer returns, refers others
  Outcome: Regulatory headroom → grow faster
  Outcome: Year 5: 2.3× higher CLV than extraction model

The CLV math (simplified):
  Extraction model: CLV = high short-term × low retention = moderate
  Value model: CLV = moderate short-term × high retention = high
  
  Data from mature consumer finance markets (India, Mexico):
    Top quartile "responsible lenders": CLV 2.1× industry average
    Bottom quartile ("predatory" lenders): CLV 0.6× industry average
    → Responsible lending is profitable, not just ethical
```

## Tóm tắt chương 13

```text
Toàn bộ hành trình của chị Lan — nhìn qua behavioral lens:

APPLICATION:
  She applied via digital (lower cognitive load than POS)
  Recommended amount shown first: 18.5M (not max 50M)
  Affordability: Residual income check passed + stress test passed
  → She received loan she could genuinely afford

MANAGEMENT:
  Auto-debit default-on: she accepted (didn't notice the default — it worked!)
  Monthly debt health score notification: "78% progress, 4 months left!"
  → Positive reinforcement, low-friction engagement

MONTH 14 (chị Lan's behavioral economics in action):
  She saw the early payoff calculator: "Pay 2M extra → save 380K, done 2 months early"
  Loss aversion worked: "380K ko trả là mất tiền"
  Mental accounting: Tháng này có thêm thu nhập → "dùng để tắt nợ sớm"
  → She made an extra payment

OUTCOME:
  Loan repaid 2 months early
  Total interest: 15.8% less than maximum
  
  Customer satisfaction: 4.7/5
  "Was this the right decision?" answered 18 months later: "Yes" (87%)
  → She will be back for her next loan

The behavioral design didn't manipulate her — it helped her
act on her own stated preferences.
That's the difference between ethical nudge and dark pattern.
```

## Câu hỏi tự kiểm tra

**Loại 1 - Nhớ lại:**
1. System 1 vs System 2 thinking là gì? Tại sao financial decisions thường dominated by System 1?
2. Loss aversion coefficient λ ≈ 2.25 có nghĩa gì trong thực tế? Cho ví dụ trong payment reminder design.
3. Present bias là gì? Tại sao người ta "luôn muốn tiết kiệm từ tháng sau" nhưng không bao giờ làm?
4. Mental accounting: tại sao tiền thưởng thường được spend nhanh hơn tiền lương?

**Loại 2 - Hiểu:**
5. "Default option là quyết định design mạnh nhất." Giải thích tại sao với ví dụ từ organ donation và auto-debit.
6. Commitment device là gì? Tại sao người ta voluntarily restrict tương lai của mình? Có vẻ không rational - giải thích tại sao nó rational.
7. Optimism bias trong lending: tại sao việc hỏi "bạn có nghĩ bạn sẽ gặp khó khăn không?" không phải là affordability assessment?
8. Phân biệt "ethical nudge" vs "dark pattern" trong financial product design. Ranh giới ở đâu?

**Loại 3 - Áp dụng:**
9. Thiết kế payment reminder message cho khách hàng có 7 ngày trước due date.
   - Amount due: 1,168,000 VNĐ
   - Customer has been paying on time 8 months
   - App detects: paying later each month (day 5 → day 12 → day 19)
   
   (a) Viết message version A (standard)
   (b) Viết message version B (loss aversion framing)
   (c) Viết message version C (commitment device trigger)
   (d) Which version would you A/B test first and why?

10. Sales agent được duyệt loan: customer Income 15M/month, existing obligations 4M/month, requesting 20M loan 18 months, PMT = 1,267,000 VNĐ/month.
    
    (a) Affordability calculation: pass or fail?
    (b) Stress test at -20% income: pass or fail?
    (c) Optimism bias correction: what should agent communicate?
    (d) Vulnerable customer check: what signals to look for?
    (e) If passing all checks: recommended amount to present first?

**Loại 4 - Phân tích:**
11. Marketing team proposes: "When customer's friend repays their loan, send notification: 'Bạn của bạn vừa tất toán khoản vay. Bạn có muốn vay để [mục đích]?' with friend's photo visible."

    Phân tích: (a) What behavioral mechanisms does this use? (b) Is this ethical? (c) What regulatory issues might arise? (d) How would you redesign to be more ethical while still effective?

12. Bà Hương proposes quality-adjusted commission: base + multiplier based on 12-month default rate.

    Sales team pushback: "This is unfair - some agents have harder territories with worse demographics."
    
    (a) Is the sales team's argument valid? What's the economic logic?
    (b) How to design the incentive system to account for territory differences?
    (c) What's the risk if you DON'T adjust for territory? What's the risk if you DO?
    (d) Design a balanced proposal for the Board to approve.

## Bài tập áp dụng

**Bài 1 - Behavioral Design Audit:**

Audit loan application flow hiện tại của một fintech (hypothetical flow described below):

Step 1: Landing page shows: "Vay tới 100 TRIỆU đồng! Chỉ cần 5 phút!"
Step 2: Enter personal info → immediately shown: "Bạn đủ điều kiện vay tới 75,000,000 VNĐ!"
Step 3: Loan amount input - blank field (customer enters amount)
Step 4: Rate disclosed: "Lãi suất từ 1.5%/tháng" [annual rate not mentioned]
Step 5: "Nhận tiền ngay trong 30 phút! [Duyệt ngay]"
Step 6: Review screen shows only: Monthly payment amount and due date
Step 7: [Xác nhận] button

Yêu cầu audit:
(a) Identify all behavioral issues in each step
(b) Categorize: Dark pattern vs Suboptimal UX vs Potentially illegal
(c) Redesign each problematic step
(d) Predict impact of redesign on: approval rate, avg loan size, default rate

**Bài 2 - Early Intervention Program Design:**

Design complete early warning and intervention program for portfolio of 100,000 active loans.

Available data:
- App behavioral data (login, navigation, support tickets)
- Payment timing data (exact payment date each month)
- Bureau monthly refresh (available first of each month)

Yêu cầu:
(a) Define early warning model features and target variable
(b) Define tier thresholds (P(default) → Tier 1/2/3/4)
(c) Design intervention for each tier (message, channel, content)
(d) Estimate capacity requirements (how many agents for tier 3?)
(e) Define success metrics for the program
(f) How to avoid: contacting customers who don't need it (false positives)

**Bài 3 - Responsible Lending Assessment:**

Bạn là consultant được hire để assess responsible lending practices của một consumer finance company.

Available to review:
- Loan products (3 products: standard, fast, sub-prime)
- Origination process (application → disbursement)
- Collections process
- Marketing materials (5 TV ads, 3 app notification types, sales script)
- Agent incentive structure
- Default rates by vintage

Thiết kế framework đánh giá:
(a) What 10 questions would you ask in your assessment?
(b) What documents/data would you request?
(c) What would "green flag" (good practice) look like for each area?
(d) What would "red flag" (problematic) look like?
(e) How would you score and present findings to Board?

## Đọc thêm

**Behavioral Economics Foundations:**
- Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux. - Định nghĩa book về dual-process theory, prospect theory, và cognitive biases. Chương 1-12 đặc biệt relevant.
- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness.* Yale University Press. - Framework cho nudge design trong policy và product.

**Behavioral Finance Applied:**
- Ariely, D. (2010). *Predictably Irrational: The Hidden Forces That Shape Our Decisions.* Harper Collins. - More accessible than Kahneman, với nhiều ví dụ về financial decisions.

**Responsible Finance:**
- FCA (UK Financial Conduct Authority). (2021). *Consumer Duty.* Available at fca.org.uk. - Most comprehensive regulatory framework cho responsible retail finance. Section 2 về "good outcomes" là must-read.

*Phần III kết thúc ở đây. Chúng ta đã đi từ data → score (Chương 11) → price (Chương 12) → human behavior (Chương 13). Phần IV sẽ mở rộng ra tương lai: BNPL và embedded finance (Chương 14), AI/ML trends (Chương 15), và tổng kết những lessons learned để đúc kết thành design principles (Chương 16).*
