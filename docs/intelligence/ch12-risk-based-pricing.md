---
title: "Chương 12. Định giá dựa trên rủi ro"
sidebar_label: "12. Định giá dựa trên rủi ro"
sidebar_position: 2
chapter: 12
subtitle: "Risk-Based Pricing"
reading_time: 26
source_file: "phan-3-chuong-12.md"
editorial_status: "mechanical"
---

> *"Giá đúng không phải là giá thấp nhất, cũng không phải là giá cao nhất. Giá đúng là giá phản ánh đúng rủi ro - đủ để lender bền vững, đủ để borrower có thể trả, và đủ để cả hai muốn giao dịch lại."*

## Dẫn nhập: Tại sao một giá cho tất cả là Sai

::::story
Năm 2015, một công ty tài chính tiêu dùng ở Đông Nam Á quyết định đơn giản hóa: một mức lãi suất 24%/năm cho tất cả sản phẩm vay tiêu dùng. Không phân biệt risk profile, không phân biệt segment.

Kết quả sau 18 tháng:
- Approval rate: tăng (vì không cần complex scoring)
- Default rate: tăng từ 4% lên 8.5%
- Customer chất lượng cao: rời đi (họ tìm được 18% ở nơi khác)
- Customer rủi ro cao: ở lại và vay nhiều hơn
- Net interest margin: âm

Đây là adverse selection spiral được dự báo từ Chương 1 - và nó xảy ra vì không có risk-based pricing.
::::

Chương này xây dựng từ credit scoring (Chương 11) để trả lời câu hỏi: sau khi biết ai là Prime, Standard, Sub-prime - nên charge họ bao nhiêu? Không phải trả lời bằng cảm tính hay benchmark thị trường - mà bằng mô hình tài chính chặt chẽ, kết hợp với understanding về customer behavior và competitive dynamics.

## 12.1 Từ Credit Score đến Risk Tier

### Tier Boundaries: Không phải tùy tiện

::::story
Data Science team vừa xây xong scoring model. Anh Minh hỏi: "Thế thì cutoff là bao nhiêu? Score bao nhiêu thì approve, score bao nhiêu thì decline?"

Đây không phải câu hỏi của data scientist - đây là câu hỏi của business, có hệ quả tài chính rất cụ thể.
::::

**Economic rationale cho tier boundaries:**

Recall từ Chương 1 và 12.2: mỗi khoản vay cần cover cost of funds + EL + operating cost + target margin.

```text
Cost structure per loan (30 triệu VNĐ, 18 tháng):

                    Prime     Standard   Sub-prime
                   (Score     (Score     (Score
                   400-500)   320-399)   240-319)
─────────────────────────────────────────────────
Cost of funds:      8.5%       8.5%       8.5%
EL = PD×LGD:        1.2%       3.0%       7.2%
Operating cost:     3.5%       4.0%       5.0%
Target ROE adj:     1.8%       2.0%       2.3%
─────────────────────────────────────────────────
Min rate needed:   15.0%      17.5%      23.0%
Actual rate:       15.5%      18.5%      24.5%
Margin:             0.5%       1.0%       1.5%

Why margin increases for higher risk tiers:
  → Higher risk = higher volatility in EL estimates
  → Need more buffer for unexpected losses
  → Higher CLV risk (less likely to return) → amortize acquisition cost over fewer loans
```

**PD estimation per tier:**

```text
Risk Tier   Score Range   Historical Default Rate   EL (LGD=60%)
Prime       420-500       2.0%                       1.2%
Standard    340-419       5.0%                       3.0%
Sub-prime   260-339       12.0%                      7.2%
Decline     < 260         30%+                       18%+
```

**Calibration là bắt buộc:**

```text
Model gives scores, but what matters is:
  "Do people with Score 400 actually default at 2%?"

Calibration plot:
  Score band    Predicted PD    Actual PD    Ratio
  460-480:      1.8%            2.1%         1.17 ← slight underprediction
  440-459:      2.3%            2.5%         1.09 ← close
  420-439:      2.8%            2.9%         1.04 ← well calibrated
  400-419:      3.5%            3.4%         0.97 ← well calibrated
  380-399:      4.2%            4.8%         1.14 ← underprediction

If ratio consistently > 1: model underestimates risk → adjust pricing up
If ratio consistently < 1: model overestimates → may be leaving money on table
```

### Dynamic vs Static Thresholds

**Static thresholds:**
```text
Score >= 420: Prime tier (15.5%/năm)
Score 340-419: Standard tier (18.5%/năm)
Score 260-339: Sub-prime tier (24.5%/năm)
Score < 260: Decline

Simple, consistent, easy to audit.
Reviewed annually or when model is retrained.
```

**Dynamic thresholds:**
```text
Adjust thresholds based on portfolio objectives:

If portfolio default rate trending up:
  Raise approval threshold: 260 → 280
  Raise Prime threshold: 420 → 440 (only best customers get best rate)

If origination volume target not being met:
  Lower approval threshold: 260 → 240 (carefully, with monitoring)
  Consider rate increase for new lower-risk bucket

If competitive pressure losing Prime customers:
  Keep Prime threshold, lower Prime rate: 15.5% → 14.5%
  (If economics allow)

Dynamic threshold requires:
  Daily monitoring of incoming portfolio quality
  Pre-defined rules for when to adjust
  Approval from risk committee, not just models team
  Audit trail of every threshold change and reason
```

### Multi-Dimensional Segmentation

**Beyond just credit score:**

```text
Single-dimension: Score only
  Prime: Score >= 420
  Problem: Two customers with score 425 but different risk profiles:
    Customer A: Score 425, income 10M/month, high DTI
    Customer B: Score 425, income 50M/month, low DTI
    → Same score, very different affordability risk

Two-dimensional: Score × Affordability
  Prime A: Score >= 420 AND DTI < 30%: rate = 14.5% (best)
  Prime B: Score >= 420 AND DTI 30-50%: rate = 15.5%
  Standard A: Score 340-419 AND DTI < 30%: rate = 17.5%
  Standard B: Score 340-419 AND DTI 30-50%: rate = 19.5%
  ...

Three-dimensional: Score × Affordability × Behavioral
  If existing customer:
    + Good payment history (always on time): rate discount -0.5%
    + Early payment behavior: rate discount -0.5%
    + Loyalty (3+ loans): rate discount -1%
    
  → Incentivizes good behavior, rewards loyalty, improves retention
```

**Practical implementation - risk matrix:**

```text
            DTI < 30%    DTI 30-50%   DTI 50%+
Score 420+    14.5%        15.5%        18.5%
Score 340-419 17.5%        18.5%        21.5%
Score 260-339 22.5%        24.5%        DECLINE
Score < 260   DECLINE      DECLINE      DECLINE

Additional modifiers:
  + Returning customer, no late payment: -0.5%
  + Employer: Government/State-owned enterprise: -0.5%
  + Income type: SALARIED: -0.3%
  + Loan purpose: PRODUCTIVE (laptop, tools): -0.3%
  + Loan purpose: CONSUMPTION (entertainment): +0.3%
```

:::summary[Risk Tier Segmentation]
Tier boundaries: economic rationale từ cost
structure, không phải arbitrary
Calibration: verify predicted PD vs actual PD
→ Adjust pricing if miscalibrated
Dynamic thresholds: adjust theo portfolio quality
→ Need risk committee governance
Multi-dimensional: Score × DTI × Behavioral
→ More precise, mais complex governance
:::

## 12.2 Cost-Plus Pricing Model

### Full Cost Decomposition

::::story
Bà Hương phải present pricing proposal cho Board. Board hỏi: "Tại sao 24.5% cho Sub-prime? Cơ sở tính toán là gì?"

Câu trả lời phải dựa trên cost decomposition đầy đủ, không phải "vì thị trường charge vậy."
::::

**Ví dụ số chi tiết - Sub-prime tier:**

```text
Product: Unsecured consumer loan
Tier: Sub-prime (Score 260-339)
Average loan: 15,000,000 VNĐ
Average tenor: 18 months

COST COMPONENT ANALYSIS:

1. COST OF FUNDS (Chi phí vốn)
   Blended funding cost: 8.5%/năm
   
   Funding mix:
     Bank borrowing (60%): 9.0%/năm
     Bond issuance (30%): 8.5%/năm  
     Equity (10%): 6.0%/năm (opportunity cost)
   
   Blended: 60%×9.0 + 30%×8.5 + 10%×6.0 = 8.55% ≈ 8.5%

2. EXPECTED LOSS (Chi phí rủi ro dự kiến)
   PD (Sub-prime, 18 months): 12% × (18/12) adjustment = 15%
   LGD: 62%
   EAD: 15,000,000 VNĐ (full outstanding)
   
   EL = 15% × 62% × 15,000,000 = 1,395,000 VNĐ per loan per year
   EL/Loan amount = 1,395,000 / 15,000,000 = 9.3%/năm

   Note: PD is adjusted for 18-month observation window
   (12-month model PD × time adjustment factor)

3. OPERATING COST (Chi phí vận hành)
   Origination (one-time, amortized over tenor):
     Credit check: 80,000
     Processing: 120,000
     Agent commission: 400,000 (POS channel)
     System cost: 50,000
     Total: 650,000 / 18 months = 43,333 VNĐ/tháng
     Annualized: 43,333 × 12 / 15,000,000 = 3.5%/năm
   
   Servicing (monthly):
     Collections (Sub-prime: intensive): 350,000 VNĐ/năm
     Customer service: 120,000 VNĐ/năm
     System maintenance: 80,000 VNĐ/năm
     Total: 550,000 VNĐ/năm / 15,000,000 = 3.7%/năm
   
   Total operating cost: 3.5% + 3.7% = 7.2%/năm
   
   Note: Sub-prime has higher operating cost than Prime due to:
     - More intensive collections effort
     - Higher customer service calls (more issues)
     - Higher credit check costs (more bureaus checked)

4. UNEXPECTED LOSS BUFFER
   UL buffer = function(volatility of EL)
   For Sub-prime: EL volatility high → buffer 1.5%
   (Prime: buffer 0.5% due to lower volatility)

5. TARGET RETURN ON EQUITY (ROE contribution)
   Target ROE: 18%/năm (company target)
   Equity allocation per loan: 15% of loan amount (capital requirement)
   = 15,000,000 × 15% = 2,250,000 VNĐ equity
   
   ROE contribution needed:
   = 2,250,000 × 18% / 15,000,000 = 2.7%/năm

6. TOTAL MINIMUM RATE:
   Cost of funds:    8.5%
   Expected loss:    9.3%
   Operating cost:   7.2%
   UL buffer:        1.5%
   ROE contribution: 2.7%
   ─────────────────────
   Total:           29.2%
   
   But wait — this is 29.2%, but we said 24.5%?
```

**Resolving the apparent inconsistency:**

```text
"Floor" calculation is based on MARGINAL loan (worst in tier).
"Actual" pricing uses AVERAGE expected performance.

Sub-prime tier average PD: 12% (not 15% worst case)
EL at 12% PD × 62% LGD = 7.4%/năm (not 9.3%)

Recalculation with average:
  Cost of funds:    8.5%
  Expected loss:    7.4%
  Operating cost:   6.0% (weighted, not all loans are worst case)
  UL buffer:        1.1%
  ROE contribution: 2.3%
  ─────────────────────
  Total:           25.3%

Actual rate 24.5% → margin 24.5 - 25.3 = -0.8%?
No — this is because:
  Not all sub-prime loans default: 88% perform, generating revenue
  Interest income from 88% good loans covers EL from 12% bad loans
  
The correct way: net margin calculation over portfolio
```

### Break-Even Analysis: Tối thiểu phải Charge bao nhiêu?

**Portfolio simulation:**

```text
Sub-prime portfolio: 1,000 loans, 15M each, 18 months, rate r%

Revenue:
  All 1,000 loans pay interest for some period
  Good loans (88%): pay full 18 months
  Bad loans (12%): default at average month 9 (midpoint assumption)
  
Revenue = 880 × 15M × r × 1.5 years [good loans, full tenor]
        + 120 × 15M × r × 0.75 years [bad loans, half tenor]
        = 15M × r × (880×1.5 + 120×0.75)
        = 15M × r × (1,320 + 90)
        = 15M × r × 1,410

Cost:
  Cost of funds = 1,000 × 15M × 8.5% × 1.5 years = 1,912,500,000
  Operating cost = 1,000 × (650,000 origination + 550,000×1.5 servicing)
                 = 1,000 × (650,000 + 825,000) = 1,475,000,000
  Credit losses = 120 loans × 15M × 62% LGD = 1,116,000,000
  UL buffer = 1,000 × 15M × 1.1% × 1.5 = 247,500,000
  ROE = 1,000 × 2,250,000 equity × 18% × 1.5 = 607,500,000
  
  Total costs: 1,912.5M + 1,475M + 1,116M + 247.5M + 607.5M = 5,358.5M VNĐ

Break-even: Revenue = Costs
  15M × r × 1,410 = 5,358,500,000
  r = 5,358,500,000 / (15,000,000 × 1,410)
  r = 5,358,500,000 / 21,150,000,000
  r = 0.2534 = 25.34%/năm

Break-even rate: 25.3%/năm
  If r = 24.5%: slight loss → subsidized by Prime tier margin
  If r = 26.5%: reasonable margin

Decision: 24.5% is below break-even for Sub-prime standalone.
  Rationale: Sub-prime customers may graduate to Standard/Prime → CLV justifies subsidy
  Risk: If graduation rate low → portfolio loses money
  Action: Monitor graduation rate, adjust rate if graduation rate < 15%
```

### Target Margin và ROE

**Tổng hợp pricing table:**

```text
                    Prime     Standard   Sub-prime
Break-even rate:    12.8%     17.2%      25.3%
Target rate:        15.5%     18.5%      24.5%
Margin vs BE:       +2.7%     +1.3%      -0.8%

Overall portfolio margin (weighted by volume):
  Volume mix: Prime 40%, Standard 45%, Sub-prime 15%
  Blended margin = 40%×2.7% + 45%×1.3% + 15%×(-0.8%)
               = 1.08% + 0.585% - 0.12%
               = 1.545%/năm on portfolio

Target ROE contribution from lending: 2.5%+
  → Sub-prime cross-subsidized by Prime margin
  → Acceptable if CLV of Sub-prime customers is positive over time
```

:::summary[Cost-Plus Pricing]
5 cost components: CoF + EL + OpEx + UL buffer +
ROE contribution
Break-even: portfolio simulation, not individual
loan - good loans cover EL from bad loans
Sub-prime cross-subsidy: acceptable if CLV
justifies; monitor graduation rate
Board presentation: every rate has justification
:::

## 12.3 Competitive Pricing Dynamics

### Price Elasticity trong Consumer Lending

**Khái niệm:**

:::key
**Price elasticity of demand** *(độ co giãn giá cầu)* đo lường mức độ thay đổi của cầu khi giá thay đổi 1%.
:::

```text
Elasticity = % change in quantity / % change in price

|Elasticity| > 1: Elastic (quantity sensitive to price)
|Elasticity| < 1: Inelastic (quantity not very sensitive to price)
|Elasticity| = 0: Perfectly inelastic (quantity doesn't change with price)
```

**Elasticity trong consumer lending - research findings:**

```text
Prime segment:
  Elasticity ≈ -1.5 to -2.0 (elastic)
  → Rate increases 1% → applications decrease 1.5-2%
  → These customers actively compare rates, have alternatives
  
Sub-prime segment:
  Elasticity ≈ -0.3 to -0.6 (inelastic)
  → Rate increases 1% → applications decrease only 0.3-0.6%
  → Fewer alternatives, more urgent need, less rate-sensitive

Implications:
  For Prime: Competitive rate is critical. Lose on price → lose the customer.
  For Sub-prime: Rate is less critical. Focus on access and speed.
```

**Ví dụ số - pricing decision impact:**

```text
Current: Prime rate = 15.5%, monthly applications = 5,000

Option A: Lower rate to 14.5% (-1%)
  New applications = 5,000 × (1 + 1.8 × 1%) = 5,000 × 1.018 = 5,090
  Revenue change: 
    Volume increase: +90 loans × 15M × 15% margin = +202,500,000/year
    Rate decrease on existing: 5,000 × 15M × (-1%) × 1.5 years = -1,125,000,000/year
    Net: -922,500,000/year → Lower rate loses money at this scale

Option B: Raise rate to 16.5% (+1%)
  New applications = 5,000 × (1 - 1.8 × 1%) = 5,000 × 0.982 = 4,910
  Revenue change:
    Volume decrease: -90 loans × [15M × (15%+1%) margin] = slight decrease
    Rate increase on remaining: 4,910 × 15M × 1% × 1.5 = +1,105,000,000/year
    Net: positive → Raise rate is profitable IF volume loss is acceptable

Decision framework:
  "Is it better to have 5,090 loans at 15% margin 
   or 4,910 loans at 16% margin?"
  
  At 15.5% rate: 5,000 × 15M × 15% × 1.5y = 16,875,000,000 VNĐ/year
  At 16.5% rate: 4,910 × 15M × 16% × 1.5y = 17,676,000,000 VNĐ/year
  
  → Higher rate is more profitable, even with 90 fewer loans!
  But: strategic risk (market position, brand perception) matters too
```

### Market Positioning Strategy

**Four positioning strategies:**

```text
STRATEGY 1: Price Leader (Market Rate Minus)
  Rate = Market benchmark - 0.5% to 1%
  Target: Attract volume, especially Prime customers
  Risk: Margin compression, attract mixed quality
  When to use: New entrant wanting market share

STRATEGY 2: Market Parity
  Rate = Market benchmark ± 0.2%
  Target: Compete across all segments
  Risk: No differentiation
  When to use: Established player in competitive market

STRATEGY 3: Value-Add Premium
  Rate = Market benchmark + 0.5% to 1.5%
  Justification: Better service, faster approval, digital experience
  Target: Customers who value speed/convenience over rate
  Risk: Rate-sensitive customers go elsewhere
  When to use: Strong brand, digital advantage

STRATEGY 4: Niche / Segment-Specific
  Rate adjusted per segment, not tied to single benchmark
  Example: Better rate for teachers, healthcare workers
  Target: High-value segments with specific needs
  Risk: Complex to manage, fair lending scrutiny
  When to use: Strong segment data, regulatory comfort
```

**VLP positioning example:**

```text
Prime: 15.5% (market parity for well-priced segment)
Standard: 18.5% (slight premium: faster approval digital)
Sub-prime: 24.5% (below market 25-28%, but above costs)
Teacher product: 13.5% (segment-specific, data supports it)
BNPL: 0% nominal (merchant subsidy model)
```

### Adverse Selection Spiral: Phòng tránh

**Revisit từ Chương 1 - bây giờ với pricing lens:**

```text
The adverse selection problem in pricing:

If Prime rate too high (above market):
  Prime customers leave to competitors (they have options)
  Standard/Sub-prime customers stay (fewer options)
  Average portfolio quality degrades
  → Must raise rate further to cover higher defaults
  → More Prime customers leave
  → Spiral down

Prevention strategy:
  Monitor "quality mix" of incoming applications monthly
  Track: What % are Prime/Standard/Sub-prime?
  Compare to 6-month rolling average
  
  If Prime % drops: rate competitiveness issue → investigate
  If Sub-prime % rises sharply: selection shift → tighten criteria
```

**Practical monitoring:**

```text
Monthly dashboard — Incoming Application Mix:

Segment    Current Month   6M Average   Alert Threshold
Prime         38%             42%          < 35% (warning)
Standard      47%             46%          > 55% (warning)  
Sub-prime     15%             12%          > 20% (warning)

If Prime < 35%:
  → Check competitor rates (mystery shopping)
  → Survey rejected Prime customers: why did they go elsewhere?
  → Consider rate adjustment or feature addition (faster approval)

If Sub-prime > 20%:
  → Are marketing campaigns targeting wrong segments?
  → Has scoring threshold changed inadvertently?
  → Tighten approval criteria temporarily
```

## 12.4 Tariff Architecture như Pricing Infrastructure

### Từ Pricing Decision đến Tariff Config

**Recall Chương 3:** Tariff-driven design = pricing decisions live in database, not code.

Bây giờ: connect pricing model → tariff config.

**Step 1: Pricing decision (business/risk team)**

```text
Risk committee decision (March 2025):
  Prime segment: reduce rate from 15.5% to 15.0% (competitive pressure)
  Effective: 1 April 2025
  Reason: Competitor launched 14.8%, losing Prime applications
```

**Step 2: Translate to tariff configuration**

```text
// NOTE: Tariff code naming — illustrative examples
// verified: pricing-risk-chapter-claims.md
// Actual tariff codes trong VLP là short abbreviations (không phải descriptive):
//   e.g., SVCFEE (interest fee), ORIGFEE (origination fee), STMTFEE (statement fee)
// Version stored in separate 'version' field, not embedded in code name
// Names dưới đây là ILLUSTRATIVE để dễ đọc

Current: Tariff "SVCFEE_v2025" (code = "SVCFEE", version = 1, valid through 31 March 2025)
  FeeComponent type SVCFEE:
    percentage: 0.01292 (=15.5%/12 monthly = 1.292%/month)
    validFrom: 2025-01-01

Action: Create new tariff version for April 2025
  New Tariff: code = "SVCFEE", version = 2 (valid from 1 April 2025)
  New FeeComponent type SVCFEE:
    percentage: 0.01250 (=15.0%/12 monthly = 1.250%/month)
    validFrom: 2025-04-01

Key: Existing Prime loans keep OLD rate (contract terms)
     New loans from April 2025 get NEW rate
     No code changes needed — version selected by validFrom/validTo date
```

**Step 3: Apply to existing vs new customers**

```text
Existing Prime customers (loan started before April 2025):
  AccountService.tariffCode = "SVCFEE" version = 1 (unchanged)
  They pay 15.5% for duration of their loan
  (Contract terms are locked at origination)

New Prime customers (loan started April 2025+):
  AccountService.tariffCode = "SVCFEE" version = 2
  They pay 15.0%

How tariff selection works in origination:
  1. Determine tier at approval time
  2. Look up ACTIVE tariff version for that code (validFrom <= today < validTo)
  3. Assign tariff code + version to new account (stored in AccountService)
  4. Tariff is locked at account creation
```

### A/B Testing Pricing Strategies

::::story
Anh Minh proposes: "Let's A/B test: half of Prime applicants get 15.0%, other half get 15.5%. Compare conversion and default rate."

Có hai vấn đề cần giải quyết trước khi run test:
::::

**Issue 1: Fairness (regulatory)**

```text
Two customers apply on same day, same risk profile:
  Customer A gets 15.0% (A group)
  Customer B gets 15.5% (B group)

Is this fair? Is this legal?

Answer varies by jurisdiction:
  US: Generally acceptable if random assignment, no protected class bias
  EU: More scrutiny, need documented purpose and duration limit
  Vietnam: No explicit prohibition, but regulatory trend toward transparency

Mitigation:
  Clearly document experiment purpose, duration, scope
  Ensure random assignment (not correlated with any protected attribute)
  Set time limit: 3 months, then promote winner
  Have exit criteria: if B group default rate diverges significantly, stop
```

**Issue 2: Statistical significance**

```text
How long to run experiment?

For conversion rate difference:
  Baseline conversion (at 15.5%): 65%
  Expected conversion (at 15.0%): 68% (+3%)
  
  Power analysis:
    α = 0.05 (5% false positive rate)
    β = 0.20 (80% power — detect real effect 80% of time)
    Minimum detectable effect: 3% absolute difference
    
    Required sample: n = 2 × (Z_α/2 + Z_β)² × p(1-p) / Δ²
    = 2 × (1.96 + 0.84)² × 0.65(0.35) / 0.03²
    = 2 × 7.84 × 0.2275 / 0.0009
    = 3,964 per group
    
  At 1,000 applicants/day to Prime: 4 days to reach significance for conversion rate.

For default rate difference:
  Need to observe defaults → minimum 12 months
  → A/B test for default rate takes much longer
  → Use Champion/Challenger with long-term monitoring instead
```

### Dynamic Pricing: Cơ hội và rủi ro

**Dynamic pricing concept:**

```text
Instead of fixed tiers, price each customer individually:
  Rate = f(score, DTI, channel, time, competitive context, CLV)

Amazon does this for products.
Airlines do this for tickets.
Why not consumer lending?
```

**Why consumer lending is different:**

```text
1. Regulatory constraint:
   "Identical" customers should get identical treatment
   Dynamic pricing based on behavioral data → proxy discrimination risk
   
2. Contract duration:
   Airline ticket: 2-hour flight, price forgotten
   Consumer loan: 18-36 months, customer will see rate daily
   → If friend gets lower rate, grievance filed
   
3. Adverse selection feedback loop:
   Dynamic pricing might appear to optimize, but:
   Customers who "accept" very high rate → may be less rational
   → Actually higher risk (selection effect)
   
4. Reputational risk:
   "Company charges different rates based on your browsing history"
   → PR nightmare, regulatory investigation

WHEN dynamic pricing IS acceptable:
  ✓ Returning customers: rate discount for good history
  ✓ Channel-based: lower rate for digital (lower cost to serve)
  ✓ Promotional: time-limited offers (Independence Day special)
  ✓ Pre-approved offers: tailored to individual based on bureau pull
  
WHEN it IS NOT acceptable:
  ✗ Based on demographic proxies
  ✗ Based on urgency signals (applying at 2am → higher rate)
  ✗ Opaque criteria customer cannot understand
  ✗ "Personalized" but actually discriminatory
```

:::summary[Tariff Architecture & A/B Testing]
Pricing decision → tariff config: no code change
existing loans locked at origination rate
A/B testing pricing: regulatory review first,
statistical significance calculation, time limit
Dynamic pricing: acceptable for loyalty/channel/
promotional; NOT for demographic proxies or
urgency exploitation
:::

## 12.5 Behavioral Pricing: Không chỉ là Numbers

### Anchoring trong Offer Presentation

**Recall Chương 4:** Anchoring - người đọc tập trung vào con số đầu tiên họ thấy.

Trong pricing, đây là một công cụ mạnh - nhưng phải dùng đúng cách.

**Ví dụ - Two ways to present the same offer:**

```text
Offer: 30,000,000 VNĐ, 18 tháng, 18.5%/năm
Monthly payment: 1,897,000 VNĐ/tháng
Total cost: 34,146,000 VNĐ

Presentation A (PMT anchor — exploitative):
```
  
:::note[]
Chỉ
1,897,000 VNĐ
/tháng
:::

  [Fine print: APR 20.2%, Total: 34,146,000 VNĐ]

```text
→ Customer focuses on PMT, ignores total cost
→ Anchoring to low number → looks affordable
```

Presentation B (Balanced - ethical):
  
:::note[]
:::
```text
>
> Khoản vay: 30,000,000 VNĐ
> Lãi suất: 18.5%/năm (APR: 20.2%)
> Số tiền trả hàng tháng: 1,897,000 ✓
> Tổng phải trả: 34,146,000 VNĐ
> = 13.8% thu nhập tháng của bạn

→ Anchors to multiple numbers → balanced view
→ "13.8% thu nhập" gives affordability context
→ Customer makes informed decision
```

**Regulatory trend:** EU Mortgage Credit Directive, UK FCA rules require full cost disclosure upfront. Vietnam trend moving same direction. Design systems for ethical presentation now.

### Decoy Effect trong Product Design

**Khái niệm:**

:::key
**Decoy effect** xảy ra khi một option thứ ba (không hấp dẫn) được thêm vào để làm một trong hai options ban đầu trông hấp dẫn hơn.
:::

**Ứng dụng trong loan product design:**

```text
Classic decoy experiment (Dan Ariely, The Economist):
  Option A: Web subscription: $59
  Option B: Print subscription: $125
  Option C: Print + Web: $125

Without Option B: 68% chose A, 32% chose C
With Option B (decoy): 16% chose A, 84% chose C

Why? Option B makes C look like a great deal (same price, more value)

Consumer lending application:

Without decoy:
  Option A: 15M VNĐ, 12 months, PMT=1,365,000 VNĐ
  Option B: 15M VNĐ, 24 months, PMT=755,000 VNĐ
  Result: 60% choose shorter tenor (rational)

With decoy (Option C: 15M, 18 months, PMT=1,010,000 VNĐ at higher rate):
  Option A: 15M VNĐ, 12 months, PMT=1,365,000 VNĐ (rate 15%)
  Option B: 15M VNĐ, 24 months, PMT=755,000 VNĐ (rate 15%)
  Option C (decoy): 15M VNĐ, 18 months, PMT=1,080,000 VNĐ (rate 18%)
  
  C makes A look good (similar PMT but shorter) and B look good (longer, cheaper)
  → Customer more likely to choose A or B, doesn't matter which

Is this ethical?
  If C is a real, fair product that customers can choose: ✓ OK
  If C is designed purely to manipulate, not actually offered: ✗ NOT OK
  If C has unfairly high rate to make others look good: ✗ NOT OK
```

### Ethical Boundaries của Behavioral Pricing

**Framework từ Chapter 4 (áp dụng vào pricing):**

```text
ACCEPTABLE behavioral pricing:
  ✓ Transparency: all costs shown clearly
  ✓ Informed choice: customer understands what they're choosing
  ✓ Opt-in: customer actively selects product
  ✓ Genuine value: all options are fair and real
  ✓ Education: "if you pay in 12 months vs 24, you save X"

NOT ACCEPTABLE:
  ✗ Hidden fees that emerge after commitment
  ✗ Fake urgency: "This rate expires in 10 minutes" (when it doesn't)
  ✗ Complexity designed to confuse: impossible to compare options
  ✗ Exploiting vulnerability: higher rates for customers who apply in crisis
  ✗ Deceptive anchoring: large number crossed out, "discounted" to lower number

The test: Would a reasonable person, with full information, feel deceived?
  If yes → don't do it
  If no → probably acceptable (still verify regulatory compliance)
```

## 12.6 Pricing Governance và Regulatory Compliance

### Rate Cap Compliance

::::story
NHNN công bố: từ 1/7/2025, tất cả tổ chức tín dụng không được cho vay tiêu dùng với lãi suất (APR) vượt 24%/năm.

Hệ thống phải ensure compliance automatically.
::::

**System enforcement:**

```text
// ⚠️ ILLUSTRATIVE — RateCapValidator KHÔNG tồn tại trong VLP codebase
// verified: verify-remaining-chapters.md, pricing-risk-chapter-claims.md
// LPS tính toán XIRR (EIR) nhưng KHÔNG validate rate cap
// Không có RateCapValidator class, APR_EXCEEDS_RATE_CAP error code, 
// hay lending.rate-cap property trong bất kỳ module nào
//
// Recommended pattern cho rate cap enforcement (nếu cần implement):
// - LPS calculate XIRR sau khi tính IP
// - Thêm validation step trong chooseOffer workflow
// - So sánh XIRR với regulatory cap từ config
// - Return error nếu vượt quá limit
//
// Ví dụ design minh họa (conceptual, không phải code thực):
// if (calculatedXIRR.compareTo(regulatoryCapConfig.getConsumerUnsecured()) > 0) {
//     throw new ValidationException("APR exceeds regulatory cap");
// }
```

### Pricing Audit Trail

**Every pricing decision must be logged:**

```sql
-- ILLUSTRATIVE SCHEMA — pricing_audit_log KHÔNG tồn tại trong VLP
-- verified: pricing-risk-chapter-claims.md
-- Không có pricing_audit_log table, PricingAuditLog entity, hay pricing audit DB
-- Audit information hiện tại stored trong: CTM contract history + LAS account history
-- Table dưới đây là ví dụ thiết kế tốt (best practice, không phải implementation thực tế):

CREATE TABLE pricing_audit_log (  -- ILLUSTRATIVE
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    application_id UUID NOT NULL,
    account_id BIGINT,
    tariff_code VARCHAR(50),    -- e.g., "SVCFEE", "ORIGFEE" (short codes, not "STANDARD_2025")
    tariff_version INTEGER,
    nominal_rate DECIMAL(6,4),
    apr DECIMAL(6,4),           -- Calculated XIRR (LPS module)
    scored_at TIMESTAMP,
    pricing_model_version VARCHAR(50)
);
-- Append-only, never updated
```

**Why audit trail matters:**

```text
Scenario: Customer dispute 18 months later
  "You charged me more than agreed"
  
  With audit trail:
    Query pricing decisions where application_id = X
    Show: at time of approval, tariff was active
    Show: APR disclosed was 20.2%
    → Complete evidence chain
  
  Without audit trail:
    "We don't have records from 18 months ago"
    → Loss of credibility, regulatory violation,
      potentially unfavorable legal outcome

Note: VLP stores tariff snapshot at origination time via CTM contract.
Pricing audit is reconstructable from contract + tariff version data.
```

:::summary[Pricing Governance]
Rate cap: NOT enforced in VLP (LPS calculates
XIRR but no RateCapValidator exists)
Transparency: APR prominently displayed, total
cost shown - regulatory requirement
Audit trail: reconstructable from CTM contract
+ tariff version (no pricing_audit_log table)
:::

## Tóm tắt chương 12

```text
Từ credit score 420 của chị Lan đến rate 15.5%:

Score 420 → Prime tier
  DTI = 7.6% → Prime A (best sub-tier)
  Channel = DIGITAL → no agent commission
  First-time borrower → no loyalty discount

Cost analysis:
  Cost of funds: 8.5%
  EL (PD 2%, LGD 60%): 1.2%
  Operating cost (digital): 3.3%
  UL buffer: 0.5%
  ROE contribution: 1.8%
  Break-even: 15.3%

Market context:
  Competitor A: 14.8% (slightly below us)
  Competitor B: 16.0% (above us)
  Our position: 15.5% → competitive, slight margin

A/B test running: 5% traffic gets 15.0%
  → If conversion improves AND margin holds → promote to 15.0%
  → If margin insufficient → stay at 15.5%

Disclosure:
  Nominal rate: 15.5%/năm
  APR: 16.8%/năm (includes 200,000 origination fee)
  Monthly payment: 1,668,400 VNĐ
  Total cost: 20,020,800 VNĐ
  
  Pricing decision reconstructable from CTM contract + tariff version (no dedicated pricing_audit_log).
  Rate cap check: APR 16.8% < cap 24% → PASS.

Pricing is not guesswork. Every number has a reason.
```

## Câu hỏi tự kiểm tra

**Loại 1 - Nhớ lại:**
1. Kể 5 thành phần của cost-plus pricing model. Thành phần nào thường lớn nhất cho Sub-prime tier?
2. Price elasticity là gì? Tại sao Prime segment thường elastic hơn Sub-prime?
3. Tariff có validFrom/validTo. Tại sao existing loans không bị ảnh hưởng khi tariff mới được tạo?
4. APR khác nominal rate ở điểm nào? Tại sao regulatory yêu cầu hiển thị APR?

**Loại 2 - Hiểu:**
5. Giải thích adverse selection spiral trong pricing. Tại sao việc tăng rate để bù đắp high defaults lại tạo ra more defaults?
6. Tại sao break-even analysis phải được thực hiện ở cấp portfolio (1,000 loans) thay vì cấp individual loan?
7. Dynamic pricing được chấp nhận cho loyalty discount nhưng không được chấp nhận cho urgency signals. Tại sao sự khác biệt này?
8. Decoy effect là gì? Khi nào dùng decoy trong product design là ethical, khi nào không?

**Loại 3 - Áp dụng:**
9. Product mới: Sub-prime, 10,000,000 VNĐ, 12 tháng.
   - Cost of funds: 9%/năm
   - PD: 14%, LGD: 65%
   - Origination cost: 500,000 VNĐ (one-time)
   - Servicing cost: 400,000 VNĐ/năm
   - UL buffer: 1.2%
   - Target ROE: 20% on 15% equity allocation
   
   (a) Calculate break-even rate using portfolio simulation (100 loans)
   (b) What's the minimum rate to charge?
   (c) If competitor charges 26%, what should your positioning be?

10. A/B test design: Standard tier (18.5% vs 18.0%)
    - Baseline application volume: 3,000/month
    - Baseline approval rate: 70%
    - Baseline default rate: 5%
    - Expected elasticity: -1.5
    
    (a) Expected application volume change if rate drops to 18.0%
    (b) Sample size needed for statistical significance (conversion rate)
    (c) What's the net revenue impact of the rate change?
    (d) How long to run before checking default rate impact?

**Loại 4 - Phân tích:**
11. Công ty đang xem xét "urgency pricing" - khách hàng apply ngoài giờ hành chính (18h-22h) được tính lãi suất cao hơn 1.5% với lý do "rủi ro behavioral cao hơn." Data support: default rate của off-hours applications là 6.5% vs 4.5% business hours.

    Phân tích: (a) Is the data sufficient to justify differential pricing? (b) Is this regulatory compliant? (c) Is this ethical? (d) What alternative approaches could achieve same risk management goal?

12. Board yêu cầu: "Tăng Standard tier rate từ 18.5% lên 20.5% để cải thiện margin." Risk team phản đối: "Chúng ta sẽ mất Standard customers." Marketing team nói: "Không sao, Standard customers ít nhạy cảm với rate." Ai đúng?
    
    Design the analysis: (a) What data do you need? (b) How to estimate elasticity for Standard segment specifically? (c) What is the P&L impact of the change? (d) What's your recommendation to Board?

## Bài tập áp dụng

**Bài 1 - Full Pricing Model:**
Xây dựng complete pricing model cho 3 tiers cho sản phẩm mới: BNPL (Buy Now Pay Later), không có origination fee, tenor 3 months, average amount 5,000,000 VNĐ.

Assumptions:
- Cost of funds: 9%/năm
- Operating cost: 250,000 VNĐ/loan (flat, channel is merchant POS)
- Target ROE: 20% on 12% equity allocation
- Merchant subsidy available for "0% rate" offer: depends on your negotiation

Segments (BNPL customers are different from standard loans):
- Thin-file: No bureau data, alt data only: PD 18%, LGD 55%
- Standard: Light bureau data: PD 8%, LGD 58%
- Prime: Full bureau, good history: PD 3%, LGD 52%

Yêu cầu:
(a) Calculate break-even rate for each segment
(b) Design the pricing strategy: what rate to charge each segment?
(c) If offering "0% lãi," calculate required merchant subsidy
(d) APR calculation (including any fees): does it comply with rate cap?
(e) Tariff configuration: what TariffItems would you create?

**Bài 2 - Competitive Response Analysis:**

Competitor vừa launch sản phẩm với Prime rate 13.8% (vs your 15.5%). Anh Minh cần analysis trong 48 giờ.

Available data:
- Your monthly Prime applications: 5,000
- Competitor announcement date: 2 weeks ago
- Your applications since announcement: 4,200/month (down 800 = -16%)
- Your credit loss rate (Prime): 2.1%
- Elasticity estimate: -1.8

Yêu cầu:
(a) Is the 16% drop significant or within normal variation? (statistical test)
(b) Revenue impact of current situation (vs before competitor launch)
(c) Three response options with P&L analysis for each
(d) Your recommendation with risk assessment
(e) What additional data would make your analysis more confident?

**Bài 3 - Rate Cap Compliance System:**

NHNN thông báo: từ 1/6/2025, rate cap cho consumer unsecured = 22% APR (currently 24%).

Current portfolio analysis:
- 15% of loans have APR between 22-24% (would violate new cap)
- These are all Sub-prime loans originated after January 2025

Thiết kế compliance response:
(a) System changes needed in origination (validation logic)
(b) What happens to existing loans above new cap? (cannot retroactively change)
(c) How to reprice Sub-prime product to fit under 22% APR?
(d) Business impact: how many Sub-prime customers will now be declined?
(e) Monitoring: how to ensure no new loans exceed cap post-implementation?

## Đọc thêm

**Risk-Based Pricing:**
- Thomas, L. C., Edelman, D. B., & Crook, J. N. (2002). *Credit Scoring and Its Applications.* SIAM. - Chapter 8-10 về pricing models và their implementation.

**Behavioral Pricing:**
- Ariely, D. (2008). *Predictably Irrational: The Hidden Forces That Shape Our Decisions.* Harper Collins. - Chapters 1-3 về decoy effect, anchoring, và their application to pricing.

**Financial Regulation:**
- Consumer Financial Protection Bureau. (2020). *Truth in Lending (Regulation Z).* - Available at consumerfinance.gov - comprehensive guide về APR calculation và disclosure requirements.

*Chương 13 sẽ đưa kinh tế học hành vi vào ứng dụng thực tế - không chỉ là lý thuyết mà là concrete product design và UX decisions. Từ "nudge" thiết kế repayment behavior, đến transparency tools giúp khách hàng ra quyết định tốt hơn, đến những ranh giới đạo đức mà hệ thống tài chính trách nhiệm không nên vượt qua.*
