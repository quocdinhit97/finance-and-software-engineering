---
title: "Chương 7. Quy trình khởi tạo khoản vay"
sidebar_label: "7. Quy trình khởi tạo khoản vay"
sidebar_position: 1
chapter: 7
subtitle: "Origination Engineering"
reading_time: 31
source_file: "phan-2-chuong-7.md"
editorial_status: "mechanical"
---

> *"Origination là nơi mà business strategy, risk management, và user experience va chạm nhau trong vài phút. Thiết kế đúng: khách hàng được phục vụ tốt, rủi ro được kiểm soát. Thiết kế sai: cả ba đều fail cùng lúc."*

## Dẫn nhập: Năm phút quyết định Ba năm

::::story
Chị Lan mở app lúc 10h15 sáng thứ Hai và nộp đơn vay 18,500,000 VNĐ. Lúc 10h19, app báo "Đơn của bạn đã được phê duyệt. Tiền sẽ được giải ngân trong 24 giờ."

Bốn phút. Trong bốn phút đó, điều gì đã xảy ra?

Câu trả lời: một pipeline phức tạp được thiết kế cẩn thận đã chạy - kiểm tra danh tính, đánh giá rủi ro, tính toán offer, và tạo account - với hàng chục business rules được execute theo đúng thứ tự, trong đúng thời gian, với tính nhất quán được đảm bảo.

Và tất cả điều này phải hoạt động đúng với cả 99.9% trường hợp khác đang diễn ra song song - người khác cũng đang nộp đơn cùng lúc, hệ thống scoring đang được update, tariff mới vừa được active.
::::

Chương này trace toàn bộ origination flow từ khi chị Lan nhấn "Nộp đơn" đến khi account được activate. Không phải trace flow một cách hời hợt - mà đi sâu vào từng quyết định thiết kế: tại sao LOS dùng stateless async pattern, tại sao approval là async, tại sao QCE là REST service chứ không phải message queue, và tại sao fail-fast là strategy thực tế thay vì saga compensation đầy đủ.

## 7.1 Tổng quan Origination Flow

### Sequence Diagram đầy đủ

```mermaid
sequenceDiagram
    participant User as Khách hàng
    participant LOS
    participant PTY
    participant ADR
    participant QCE
    participant OFR
    participant SRT
    participant LAS
    participant AOS

    Note over LOS: Step 1 — submitApplicationForm
    User->>LOS: POST /api/workflows/submitApplicationForm
    LOS->>PTY: findClient / createApplicant
    LOS->>ADR: storeApplication
    LOS-->>User: 202 Accepted {processingId}

    Note over LOS: Step 2 — checkEligibility
    User->>LOS: POST /api/workflows/checkEligibility
    LOS->>PTY: findClient
    LOS->>QCE: getIPTypes(accountNumber)
    LOS->>OFR: getEligibleOffer(cuid, amount)
    LOS-->>User: 202 Accepted

    Note over LOS: Step 3 — calculateSalesQuotes
    User->>LOS: POST /api/workflows/calculateSalesQuotes
    LOS->>QCE: getAposSalesQuotes(15+ domains → LPS)
    LOS-->>User: 202 Accepted

    Note over LOS: Step 4 — chooseOffer (Zeebe scoring)
    User->>LOS: POST /api/workflows/chooseOffer
    LOS->>LOS: Zeebe "PreTransactionRiskCheck" (async)
    LOS->>AOS: createSupplement via LBS (on POSITIVE score)
    LOS-->>User: 202 Accepted

    Note over LOS: Step 7 — generateAgreement (account CREATED)
    User->>LOS: POST /api/workflows/generateAgreement
    LOS->>SRT: processLoan()
    SRT->>LAS: create account via CTS→RabbitMQ (CREATED)
    SRT->>LOS: success
    LOS-->>User: 202 Accepted

    Note over LOS: Step 8 — signAgreement (account ACTIVE)
    User->>LOS: POST /api/workflows/signAgreement
    LOS->>AOS: acceptContractSupplementDocuments()
    AOS-->>LOS: ContractSupplementSigned (RabbitMQ)
    Note over LAS: AOS→RabbitMQ→SRT→CTS→LAS: CREATED→ACTIVE
    LOS->>LAS: origination.completed (RabbitMQ)
    LOS-->>User: Account activated
```
*(Account CREATED at generateAgreement step; ACTIVATED at signAgreement via RabbitMQ chain)*

Trên đây là flow happy path. Trong thực tế, mỗi bước có thể fail, timeout, hoặc cần retry - và toàn bộ system phải handle gracefully.

### LOS: Stateless Async Orchestrator

::::story
Kỹ sư Tuấn nhìn vào LOS codebase và ngạc nhiên: "Không có database? LOS không có một table nào?"

Tech Lead xác nhận: "Đúng. LOS dùng Infinispan embedded cache - in-memory, short TTL. State được lưu trong Infinispan, không phải persistent DB."

"Nhưng nếu LOS pod crash thì sao? State mất hết không?"

"Infinispan cluster replication. Nếu cả cluster mất - có reconciliation job xử lý. Design cho resilience, không phải perfect consistency."
::::

**Tại sao LOS dùng Infinispan thay vì database:**

```text
Approach database-backed:
  LOS lưu mọi state vào PostgreSQL
  
  Vấn đề 1: LOS trở thành bottleneck — phải hit DB mỗi step
  Vấn đề 2: LOS scale out phức tạp — distributed sessions
  Vấn đề 3: Origination data (in-flight) lẫn với operational data
  Vấn đề 4: TTL management — khi nào xóa abandoned applications?

Approach Infinispan (hiện tại):
  In-memory distributed cache với configurable TTL
  LOS pod crash → Infinispan cluster replicate sang pod khác
  Auto-expiry: abandoned applications tự động expire sau TTL
  Horizontal scale đơn giản — cache distributed tự động

Quan trọng: LOS KHÔNG dùng Zeebe làm primary state holder.
Zeebe chỉ được dùng optional ở bước scoring
(Zeebe integration là optional profile: "zeebe-integration").
```

**Workflow Architecture thực tế - Controller-Driven:**

```text
Thay vì BPMN engine, LOS dùng:
  WorkflowController (Spring MVC)
  Infinispan cache (workflow state)
  @Async methods (non-blocking steps)

Step order:
  1. submitApplicationForm → PTY + ADR
  2. checkEligibility → validate credit criteria
  3. calculateSalesQuotes → LOS → QCE → LPS (pricing)
  4. calculateAccountWithCashQuote / purchaseQuote → pre-contract
  5. chooseOffer → scoring, supplement creation (AOS)
  6. generateAgreement → SRT (loan processing), DMS
  7. signAgreement → waits for document acceptance
```

**Infinispan cache - cách dùng thực tế:**

LOS dùng **per-step typed Infinispan caches** - không có generic `WorkflowContext` class. Mỗi workflow step có cache riêng:

```java
// verified: CacheConfiguration.java trong LOS
// CHOOSE_OFFER_CACHE, LOAN_PURPOSE_CACHE, GENERATE_AGREEMENT_CACHE, SIGN_AGREEMENT_CACHE
// Mỗi cache typed riêng: Cache<String, ChooseOfferCachedObject>, v.v.
```

Workflow state được propagate qua **Kafka publish**, không phải cache.put:

```java
// verified: SubmitApplicationFormService.java
@Service
public class SubmitApplicationFormService {
    @Async
    public void submitApplicationForm(String processingId, SubmitApplicationFormTO formTO) {
        // Publish running state to Kafka:
        submitApplicationFormWorkflowKafkaService.publishRunning(processingId, formTO);

        // Execute workflow steps:
        var applicant = partyService.createApplicant(formTO);
        var application = applicationStorageService.createApplication(formTO, applicant);

        // Publish success:
        submitApplicationFormWorkflowKafkaService.publishSucceeded(processingId, ...);
    }
}
```

Pattern: mỗi step publishes `RUNNING` → execute → publishes `SUCCEEDED`/`FAILED` tới Kafka.
LOS client polls `GET /status/{processingId}` → LOS queries latest workflow event state.

**Async processing - tại sao 202 Accepted:**

```text
Nếu return response synchronously:
  POST /submit → chạy scoring (500ms) → chạy offer calc (300ms)
              → generate agreement (200ms) → ...
  Tổng: 1-5 giây trước khi return response
  → HTTP timeout risk
  → Mobile app có thể retry, tạo duplicate applications
  → User experience kém (loading spinner quá lâu)

Với 202 Accepted:
  POST /submit → LOS starts async processing (Infinispan cache) → return {processingId} ngay (50ms)
  Client poll GET /status/{processingId} mỗi 2 giây
  → Server không bị tie up chờ
  → Client biết đang processing
  → Retry an toàn (idempotent — cùng processingId)
  → Server có thể scale mỗi step independently
```

:::summary[LOS Architecture]
Stateless orchestrator: Infinispan cache giữ state,
LOS chỉ execute
Infinispan: short-lived cache (10s TTL),
không phải persistent storage
202 Accepted: async pattern → mobile-friendly,
retry-safe, horizontally scalable
Mỗi workflow step có thể fail/retry độc lập
:::

## 7.2 Application Submission và KYC

### ADR: Application Data Repository

::::story
Chị Lan bắt đầu điền form trên app lúc 10h00. Lúc 10h10, điện thoại hết pin. Chị cắm sạc và mở lại app - form vẫn còn dữ liệu đã điền. Chị tiếp tục và submit lúc 10h15.

Điều này không xảy ra tự nhiên - cần design cụ thể.
::::

**ADR là gì:**

:::key
**ADR** *(Application Data Repository)* là persistent store cho application data trong suốt origination lifecycle. Nó giữ mọi thứ từ khi user bắt đầu điền form đến khi account được tạo - và sau đó cho mục đích audit.
:::

**Tại sao ADR tách khỏi LAS:**

```text
LAS lưu: account sau khi activated (live financial data)
ADR lưu: application data trong quá trình origination

Nếu merge vào LAS:
  → LAS database chứa millions of incomplete/rejected applications
  → LAS query performance giảm
  → ADR và LAS có different lifecycle:
      ADR data: quan trọng trong origination, sau đó archive
      LAS data: quan trọng forever (audit trail)
  → Regulatory requirement khác nhau:
      ADR: có thể pseudonymize sau khi origination complete
      LAS: transactional data phải giữ nguyên

Nếu tách ra:
  → Clean domain boundary
  → Scale independently
  → Different retention policy
  → ADR events → trigger LOS steps
```

**Schema design của ADR:**

```sql
-- Application header:
CREATE TABLE application (
    id UUID PRIMARY KEY,
    processing_id VARCHAR(36) UNIQUE,
    customer_id VARCHAR(100),     -- CIS customer identifier
    status VARCHAR(50),           -- DRAFT, SUBMITTED, SCORING, APPROVED, REJECTED, ACTIVATED
    product_code VARCHAR(50),
    requested_amount DECIMAL(15,2),
    requested_tenor INT,
    channel VARCHAR(50),          -- DIGITAL, POS, TELESALES
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    submitted_at TIMESTAMP,
    decision_at TIMESTAMP
);

-- Application steps (event log):
CREATE TABLE application_event (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    application_id UUID REFERENCES application(id),
    event_type VARCHAR(100),      -- KYC_COMPLETED, SCORE_RECEIVED, OFFER_GENERATED...
    event_data JSONB,
    created_at TIMESTAMP,
    created_by VARCHAR(100)
);
-- Không bao giờ UPDATE hay DELETE — append-only log
```

**Omnichannel support:**

```java
// illustrative pseudo-code — ADR method names differ from actual
// verified: verify-ch6-ch7-code.md
// Actual ADR ApplicationService methods:
//   save(Application) — creates new application (no createDraft())
//   findByCode(String code) — find by code (no findByCustomerAndProduct())
//   update(Application) — complex cascade update (6 collections)

// User bắt đầu trên App (via LOS → ADR):
Application app = applicationService.save(newApplication);
// app.code = "abc-123", status = DRAFT

// App hết pin, re-open (LOS polls ADR):
Application existing = applicationService.findByCode(applicationCode);
// Vẫn còn, status = DRAFT → tiếp tục

// Cross-channel: teller tìm application qua application code
// (không có findByCustomerAndProduct — lookup qua code)
```

### KYC Verification Pipeline

::::story
Khi chị Lan submit form, system cần xác minh: người này có thật không? Tên, CCCD, địa chỉ có khớp không? Có trong blacklist không? Có đủ điều kiện vay không?

Đây là KYC *(Know Your Customer)* - một yêu cầu pháp lý, không chỉ là business requirement.
::::

**Các lớp KYC verification:**

**Lớp 1: Identity Verification (Xác minh danh tính)**

```text
Input: Ảnh CCCD mặt trước + mặt sau + ảnh selfie

Process:
  1. OCR: Đọc thông tin từ CCCD (tên, ngày sinh, địa chỉ, số CCCD)
  2. Liveness check: Ảnh selfie có phải người thật không? (chống ảnh in)
  3. Face match: Khuôn mặt trong selfie khớp với ảnh trên CCCD?
  4. Document authenticity: CCCD có dấu hiệu giả mạo không?

Output:
  PASS (confidence > 95%) → proceed
  REVIEW (70-95%) → manual review queue
  FAIL (< 70%) → reject với reason code
```

**Lớp 2: Sanctions và Blacklist Screening**

```text
Input: Tên + ngày sinh + quốc tịch

Process:
  1. Check against OFAC list (US sanctions)
  2. Check against local regulatory blacklist (NHNN)
  3. Check against internal blacklist (previous fraud, default)
  4. PEP screening (Politically Exposed Person — increased risk)

Output:
  CLEAR → proceed
  MATCH/POSSIBLE_MATCH → compliance team review
  BLOCKED → reject immediately, log for regulatory reporting
```

**Lớp 3: Credit Bureau Check**

```text
Input: CCCD number + họ tên

Process:
  1. Query credit bureau (CIC, PCB tại Việt Nam)
  2. Retrieve: credit score, outstanding debts, DPD history, number of inquiries

Output:
  Credit report → feed vào scoring model
```

**Lớp 4: Income Verification**

```text
Input: Loại thu nhập + documents (sao kê lương, thuế, BCTC...)

Process:
  1. Document authenticity check (DMS module)
  2. Income extraction via OCR
  3. Consistency check: income declared vs bank statement
  4. Employment verification (optional: call employer)

Output:
  Verified income amount → feed vào affordability check
```

**CIS Module - Tại Sao Tách Riêng:**

```text
CIS lưu:
  customer_id → {name, CCCD, DOB, address, income, employment}

Quan hệ với LAS:
  LAS lưu account_id → {accountNumber, balance, transactions}
  LAS KHÔNG biết tên khách hàng — chỉ biết customer_id

Tại sao:
  1. GDPR/PDP compliance: PII được isolate trong CIS
     → Right to erasure: xóa CIS data, LAS transactions vẫn intact
  2. Reuse: một customer_id có thể có nhiều accounts trong LAS
     → KYC một lần, dùng nhiều lần
  3. Security: compromise của LAS database không expose PII
  4. Different team ownership: KYC team owns CIS, LAS team owns LAS
```

 **Document flow qua DMS:**

```text
1. User upload CCCD → App → API Gateway → DMS
   DMS lưu: encrypted document, return docId = "doc-xyz"

2. LOS tells CIS: "Verify using doc-xyz"
   CIS gọi DMS để fetch document → run verification → return result
   CIS không lưu document (chỉ lưu verification result)

3. DMS lưu document với retention policy:
   In-process: full access
   After activation: read-only, compliance access only
   After 7 years: archive or delete per policy
```

:::summary[Application Submission & KYC]
ADR: persistent store, append-only events,
omnichannel support (draft resume)
KYC: 4 lớp - identity, sanctions, credit bureau,
income verification
CIS tách khỏi LAS: PII isolation, GDPR compliance,
reuse across accounts
DMS: encrypted document storage, lifecycle
management, compliance retention
:::

## 7.3 Credit Scoring trong Production

### Từ Raw Features đến Score

::::story
Dữ liệu của chị Lan đã được collect: CCCD verified, credit bureau report returned, income verified at 22,000,000 VNĐ/tháng. Bây giờ hệ thống phải quyết định: cho vay hay không? Và nếu cho vay thì bao nhiêu?

Đây là bài toán credit scoring - và "bài toán" ở đây không chỉ là chạy một model ML. Đó là một pipeline phức tạp với nhiều thành phần, nhiều constraints, và nhiều failure modes.
::::

**Feature Engineering - Từ Raw Data Đến Input Vector:**

```text
Raw data → Feature extraction → Feature vector → Model → Score

Raw data cho chị Lan:
  Từ credit bureau:
    - Số tài khoản credit hiện có: 1
    - Tổng outstanding debt: 3,500,000 VNĐ
    - Max DPD trong 12 tháng: 0
    - Số inquiry trong 6 tháng: 2

  Từ CIS (income verification):
    - Thu nhập hàng tháng: 22,000,000 VNĐ
    - Loại thu nhập: Salaried (ổn định hơn self-employed)
    - Thời gian làm việc hiện tại: 36 tháng

  Từ application:
    - Số tiền yêu cầu: 18,500,000 VNĐ
    - Kỳ hạn: 12 tháng
    - Loan purpose: Laptop (productive asset)
    - Channel: Digital (thường có PD thấp hơn POS bốc đồng)

Feature transformation:
  debt_to_income = 3,500,000 / 22,000,000 = 0.159
  requested_dti = (18,500,000 / 12) / 22,000,000 = 0.070
  employment_stability = 36 months → HIGH bucket
  max_dpd_12m = 0 → CLEAN bucket
  inquiry_rate_6m = 2 → NORMAL bucket
  loan_purpose_risk = PRODUCTIVE → LOW risk modifier
  channel_risk = DIGITAL → MEDIUM
```

**Scoring Model - Simplified Scorecard Example:**

```text
Variable              Value         Points
─────────────────────────────────────────
Max DPD (12 months)
  = 0                               +35
  1-30                              +15
  31-60                              -5
  61+                               -30

Debt-to-Income
  < 0.2                             +25
  0.2 - 0.4                         +10
  0.4 - 0.6                          -5
  > 0.6                             -20

Employment Stability
  > 24 months                       +20
  12-24 months                      +10
  6-12 months                        +0
  < 6 months                        -15

Credit Bureau Status
  CLEAN (no defaults)               +30
  MINOR (DPD <= 30 once)            +10
  POOR (multiple DPD)               -20

Số lượng inquiries (6 tháng)
  0-2                               +10
  3-5                                +0
  6+                                -10
─────────────────────────────────────────
BASE SCORE                           300 (starting point)

Chị Lan:
  Max DPD = 0          → +35
  DTI = 0.159          → +25
  Employment 36 months → +20
  Credit bureau: CLEAN → +30
  Inquiries: 2         → +10
  ─────────────────────────
  TOTAL SCORE = 300 + 35 + 25 + 20 + 30 + 10 = 420
```

**Score → Decision mapping:**

```text
Score >= 420: APPROVE — Prime tier, lowest rate
Score 380-419: APPROVE — Standard tier, standard rate
Score 340-379: APPROVE — Sub-prime tier, higher rate
Score 300-339: REVIEW — Manual underwriting
Score < 300: DECLINE
```

Chị Lan: score 420 → APPROVE, Prime tier → lãi suất 15%/năm (thay vì 18% standard).

**Tại sao không phải chỉ một threshold:**

```text
"Score >= 380: approve" là quá đơn giản.

Thực tế cần policy rules kết hợp:

Hard rejects (bất kể score):
  - Max DPD 90+ trong 12 tháng → DECLINE always
  - Sanctions list match → DECLINE always
  - DTI sau khoản vay mới > 0.5 → DECLINE (affordability)
  - Age < 18 hoặc > 70 → DECLINE (policy)

Soft rejects (có thể override bởi underwriter):
  - Score 300-339 → MANUAL_REVIEW
  - Income unverified but high score → MANUAL_REVIEW
  - First-time borrower + large loan → MANUAL_REVIEW
```

### Workflow Architecture: Controller-Driven, không phải BPMN

::::story
Anh Minh hỏi Tech Lead: "Tôi thấy có Zeebe trong dependencies. LOS có dùng Zeebe để orchestrate origination không?"

Tech Lead: "Không hoàn toàn. LOS dùng Spring async controllers với Infinispan cache cho state. Zeebe chỉ được dùng optional cho một số scoring workflows, không phải main orchestrator."

"Vậy nếu LOS crash giữa chừng thì sao?"

"Infinispan cluster replicate state. Và có reconciliation job detect stuck applications, fix manually."
::::

**LOS Workflow Steps - Thứ Tự Thực Tế:**

```text
Step 1: submitApplicationForm
  → Create applicant (PTY — Party Registry; CIS stores KYC data separately)
  → Store application (ADR)
  → Return 202 Accepted {processingId}

Step 2: checkEligibility
  → Validate against credit criteria (blacklist, sanctions, age)
  → If fail: immediate decline, don't proceed

Step 3: calculateSalesQuotes
  → LOS → QCE (REST, synchronous)
  → QCE → LPS (REST, synchronous)
  → Returns pricing proposals for customer

Step 4: calculateAccountWithCashQuote / purchaseQuote
  → Pre-contract quote calculation
  → APR disclosure preparation

Step 5: chooseOffer
  → Customer selects offer
  → Scoring runs here (optional Zeebe integration)
  → AOS (Supplement) entity created

Step 6: generateAgreement
  → SRT (Service Router) routes request to LAS, CTM, AOS for activation
    SRT is stateless — no DB, 9 FeignClient connectors
    LOS → SRT: POST /rest/v1/loan-requests → SRT fans out to backends
  → DMS generates contract PDF

  Supplementary: AOS creates Supplement entity (insurance, protection)
    → AOS activates when LAS fires "FIRST_PRINCIPAL_TX_CHARGED" event

Step 7: signAgreement
  → Wait for customer to sign (async, user-driven)
  → Document signing via DMS

[Account creation follows sign]
```

**Không có parallel execution, không có timer boundaries:**

```text
Mỗi step là sequential REST calls hoặc @Async Spring methods.
Không có parallel gateways (BPMN-style).
Timeout implicit từ Infinispan TTL (5s đến 2 phút per step).

Tại sao đơn giản hơn BPMN engine:
  ✓ Easier to debug (just Spring controllers)
  ✓ No BPMN engine dependency in critical path
  ✓ Simpler deployment
  
Tradeoff:
  ✗ Retry logic phải viết thủ công
  ✗ Không có visual workflow cho business team
  ✗ Stuck applications cần manual recovery
```

### A/B Testing Scoring Models: Cách đúng

::::story
Data Science team đã train model mới - Gini tăng từ 0.52 lên 0.61. Anh Minh muốn deploy - nhưng cần test trước khi áp dụng toàn bộ. Lưu ý: VLP hiện tại **không có** built-in Champion/Challenger framework - nhưng đây là cách design nếu implement.
::::

**Nguyên tắc A/B Testing cho credit model:**

> Thay vì deploy trực tiếp, chạy song song: model cũ với 95% traffic, model mới với 5%. Sau 3-6 tháng có đủ data (cần thời gian để default rate hiện ra), so sánh performance.

**Design pattern (nếu implement):**

```java
// illustrative pseudo-code — Champion/Challenger pattern (industry best practice)
// verified: scoring-pipeline-spec.md
// NOTE: A/B hash routing NOT implemented in VLP
// VLP dùng Zeebe BPMN "PreTransactionRiskCheck" — không có in-process routing
// Code dưới đây là ví dụ design pattern tốt cho AI/scoring systems:

@Service
public class ScoringService {  // ILLUSTRATIVE

    public ScoreResult score(ApplicationData application) {
        // Deterministic hash → same applicationId → same model (retry-safe)
        String modelVersion = routeByConfig(application.getApplicationId());

        ScoreResult result = scoringModelRegistry
            .getModel(modelVersion)
            .score(application);

        // Critical: log model version với result cho post-analysis
        auditLog.log(application.getId(), modelVersion,
                     result.getScore(), result.getDecision());
        return result;
    }

    private String routeByConfig(String applicationId) {
        int hash = Math.abs(applicationId.hashCode()) % 100;
        int challengerPct = configService.getInt("scoring.ab.challenger_pct", 0);
        return hash < challengerPct ? "challenger_v2" : "champion_v1";
    }
}
// VLP actual: ScoringService.createScoring() → Zeebe BPMN → POSITIVE/NEGATIVE callback
```

**Tại sao cần ít nhất 3-6 tháng:**

```text
Problem: Khi approve application → default xảy ra sau 3-12 tháng.
Nếu chỉ test 2 tuần: chỉ thấy approval rate, không thấy default rate.
Default rate mới là metric quan trọng nhất.

Minimum: 3 tháng để thấy DPD 30+, 6 tháng để thấy DPD 90+.

Sample size requirement:
  Muốn detect 1% difference in approval rate: ~4,000 samples per arm
  Muốn detect 0.5% difference in DPD 90+: ~20,000+ samples per arm
  → 5% challenger với 3,000 applications/tháng: ~150 challenger/tháng
  → Cần 130+ months chỉ để detect DPD 90+ difference!
  
Kết luận thực tế: Dùng DPD 30+ thay vì 90+ làm primary metric,
                  hoặc tăng challenger % lên 20-30% để đủ sample size.
```

:::summary[Credit Scoring Trong Production]
Feature engineering: raw data → vector → score
Scorecard: transparent, explainable, adjustable
Policy rules: hard reject + soft reject kết hợp
với score → holistic decision
LOS workflow: controller-driven, không phải BPMN
Zeebe chỉ optional cho scoring
A/B testing: cần 3-6 tháng để thấy default rate
→ sample size là constraint thực tế
:::

## 7.4 Offer Calculation và Presentation

### QCE: Quote Calculation Engine (REST Service)

::::story
Chị Lan được approve với Prime tier (score 420). Bây giờ hệ thống phải tính: với credit score này, income 22 triệu, yêu cầu 18.5 triệu trong 12 tháng - offer cụ thể là gì?
::::

**QCE là gì - quan trọng để hiểu đúng:**

:::key
**QCE** *(Quote Calculation Engine)* là một **REST service**, không phải message queue. Tên có thể gây nhầm lẫn (chữ "Q" không phải "Queue"). QCE xử lý pricing calculations phức tạp, bao gồm 15+ service domains: PHONELOAN, BNPLPOS, bundles, eligibility, PLOAN, precontract, và nhiều hơn.
:::

```text
LOS → QCE: POST /calculateQuote (synchronous REST call, OpenFeign)
           {score: 420, tier: PRIME, amount: 18.5M, tenor: 12M,
            offerCode: "PRIME_LAPTOP_2025"}

QCE internal flow:
  1. Load product configuration + eligibility rules
     → Tier PRIME cho product này: rate = 15%/năm
     → Available tenors: 6, 12, 18, 24 months
     → Origination fee: 1%

  2. Call LPS để tính instalment plan cho mỗi tenor:
     QCE → LPS: POST /api/v3/calculators/instalment-plan/by-offer-code
     LPS → QCE: {annuityAmount: 1,668,400, totalCost: 20,020,800, apr: 16.8%}

  3. Apply business rules:
     → Check: DTI (1,668,400 / 22,000,000 = 7.6%) < max 40% → OK
     → Check: APR (16.8%) < rate_cap → OK
     → Bundle offers (insurance, protection plans) if applicable

  4. Format quote for presentation:
     Primary offer: 12 months (matches customer request)
     Alternative: 24 months (lower PMT option)

QCE → LOS: formatted quote package (InstalmentPlansDto)
```

**Tại sao QCE tồn tại - không phải LOS gọi LPS trực tiếp:**

```text
LOS job: orchestrate workflow → không nên biết về pricing details
LPS job: calculate instalment plan từ mathematical inputs
QCE job: translate business context → LPS inputs + apply product rules

Nếu LOS gọi LPS trực tiếp:
  LOS phải biết: tariff codes, offer codes, eligibility rules, bundle logic
  → LOS trở thành "god service" — violates single responsibility
  
QCE là domain expert cho pricing:
  Biết về product catalog
  Biết cách assemble offer từ nhiều sources
  Biết eligibility rules per product
  → LOS chỉ cần biết: "tôi có application, tôi cần quote"
  
Nếu QCE down:
  LOS nhận ASQ_COMMUNICATION_ERROR
  Workflow marked FAILED
  Customer must retry → không có fallback pricing
```

### Risk-Based Offer Generation

::::story
Cùng một yêu cầu 18.5 triệu, 12 tháng - nhưng ba khách hàng khác nhau nhận được offer khác nhau:
::::

```text
Khách hàng A (score 420, Prime):
  → Approved 18,500,000 VNĐ, lãi 15%/năm, PMT 1,668,400 VNĐ/tháng

Khách hàng B (score 375, Standard):
  → Approved 18,500,000 VNĐ, lãi 18%/năm, PMT 1,696,080 VNĐ/tháng

Khách hàng C (score 345, Sub-prime):
  → Approved 12,000,000 VNĐ (counter-offer), lãi 21%/năm, PMT 1,114,500 VNĐ/tháng
  → Full amount declined: DTI sẽ vượt threshold với 21% rate
```

**Counter-offer logic:**

Với khách hàng C:

```text
Yêu cầu: 18,500,000 VNĐ, 12 tháng
Rate cho Sub-prime tier: 21%/năm
PMT nếu approve full: 1,716,400 VNĐ/tháng
DTI: 1,716,400 / 22,000,000 = 7.8% → OK (dưới 40%)

Nhưng: Sub-prime tier có max loan amount = 12,000,000 VNĐ
(Policy: cho Sub-prime khách hàng, limit exposure)

Counter-offer: 12,000,000 VNĐ × 21%/năm × 12 tháng
PMT = 12,000,000 × 0.0175 × (1.0175)^12 / [(1.0175)^12 - 1]
    = 12,000,000 × 0.09219
    = 1,106,280 VNĐ/tháng

Counter-offer message:
"Chúng tôi có thể phê duyệt 12,000,000 VNĐ với lãi suất 21%/năm.
 Bạn có muốn tiếp tục với khoản vay này không?"
```

**Behavioral considerations trong offer design:**

```text
Trình bày offer cần tính đến anchoring bias:

SARCASTIC approach (khai thác bias):
  Hiển thị PMT lớn trước → sau đó "chỉ 1,668,400 VNĐ/tháng" trông rẻ hơn

ETHICAL approach (counter-act bias):
  Hiển thị đầy đủ:
  ┌─────────────────────────────────────────────┐
  │ Khoản vay: 18,500,000 VNĐ                   │
  │ Kỳ hạn: 12 tháng                            │
  │ Lãi suất: 15%/năm (APR: 16.8%)             │
  │ Số tiền trả hàng tháng: 1,668,400 VNĐ       │
  │ Tổng tiền phải trả: 20,020,800 VNĐ          │
  │ Tổng lãi phải trả: 1,520,800 VNĐ            │
  │ Phí thẩm định: 185,000 VNĐ (một lần)        │
  │ ─────────────────────────────────────────── │
  │ Bạn cần 1,668,400 VNĐ/tháng                │
  │ (= 7.6% thu nhập hàng tháng của bạn)        │
  └─────────────────────────────────────────────┘
```

Hiển thị "7.6% thu nhập" counter-acts anchoring bias - giúp khách hàng hiểu PMT trong context của khả năng chi trả thực tế.

## 7.5 Agreement, Activation và Account Creation

### E-Signature và DMS

::::story
Chị Lan xem offer và chấp nhận. Tiếp theo: ký hợp đồng. Năm 2025, không ai muốn in giấy, ký tay, scan lại. Nhưng hợp đồng vay tiền có giá trị pháp lý - e-signature phải được thực hiện đúng chuẩn.
::::

**E-Signature Requirements:**

```text
Hợp đồng điện tử tại Việt Nam phải đáp ứng:
  Luật Giao dịch điện tử 2005 (sửa đổi 2023)
  Nghị định 130/2018/NĐ-CP về chữ ký điện tử

Requirements:
  1. Xác thực danh tính người ký (đã verified ở KYC step)
  2. Chữ ký phải liên kết với nội dung hợp đồng (content hash)
  3. Không thể deny sau khi ký (non-repudiation)
  4. Timestamp chính xác
  5. Lưu trữ lâu dài (7-10 năm)
```

**Document generation và signing flow:**

```text
Step 1: Generate contract document
  LOS → DMS: generateDocument(templateId="LOAN_AGREEMENT_V3",
                               applicationId="abc-123",
                               terms={amount, rate, tenor, pmt, ...})

  DMS process:
    Load template LOAN_AGREEMENT_V3
    Fill in variables từ terms
    Generate PDF
    Apply document hash (SHA-256)
    Return docId = "doc-789"

Step 2: Present document to customer
  LOS → App: {docId: "doc-789", documentUrl: "/documents/doc-789/view"}
  Customer reads PDF in app

Step 3: Customer signs
  App → LOS: POST /sign {docId: "doc-789", signatureData: "...biometric..."}

  LOS → DMS: signDocument(docId="doc-789",
                           customerId="cust-456",
                           signatureType="OTP_PLUS_BIOMETRIC",
                           timestamp=NOW)

  DMS process:
    Verify customer identity (OTP + face match từ KYC)
    Attach signature to document
    Record: who signed, when, IP address, device fingerprint
    Create signed document copy (immutable)
    Return signedDocId = "doc-789-signed"
```

**Tại sao OTP + Biometric, không chỉ OTP:**

```text
OTP only: "Người cầm điện thoại này đã ký"
  → Nếu điện thoại bị lấy → unauthorized signing

OTP + Face match: "Người cầm điện thoại VÀ có khuôn mặt khớp với CCCD đã ký"
  → Binding mạnh hơn nhiều
  → Non-repudiation tốt hơn (khó deny "không phải tôi ký")
```

### LAS Account Creation và Activation

::::story
Hợp đồng đã ký. Bây giờ: tạo account trong LAS và activate. Đây là bước cuối - nhưng cũng là bước phức tạp nhất từ góc độ data integrity.
::::

**Account creation sequence:**

```text
// verified: origination-flow-complete.md, supplement-lifecycle.md, supplement-bsl-lifecycle.md

// Account creation là EVENT-DRIVEN (không phải direct REST call):
// 1. generateAgreement: LOS → SRT.processLoan() → SRT → CTS create ACCMAINT service
// 2. CTS → RabbitMQ: ContractServiceCreatedNotification
//    → LAS receives → creates account → responds with accountNumber
//    → Account tồn tại sau step này

// 3. signAgreement: LOS → AOS.acceptContractSupplementDocuments()
//    (method name: acceptContractSupplementDocuments, not onDocumentSigned)
// 4. AOS → RabbitMQ: ContractSupplementSigned
//    → SRT → CTM.signContract + CTS.activate(ACCMAINT)
//      → LAS: Account CREATED → ACTIVE
// 5. LOS publishes origination.completed (RabbitMQ) → LAS confirms activation

// Key insight: Account CREATED at generateAgreement, ACTIVATED at signAgreement
// Both triggered via RabbitMQ events (not synchronous REST)
```

**LAS: Account creation với tất cả setup:**

```text
LAS receives createAccount request:
  Transaction bắt đầu:
    1. Create LAS_ACCOUNT record (status = CREATED)
    2. Create LAS_CURRENT_BALANCE (initial balance = 0)
    3. Create LAS_CONTRACT_SERVICE records:
       ACCMAINT (maintenance), ACCSTMT (statement), PAYM (payment)...
    4. Create LAS_ACCOUNT_PARAMETER records:
       CREDIT_LIMIT = appData.approvedAmount
       BILLING_DAY = contractData.billingDay
       DUE_DAY_OFFSET = contractData.dueDayOffset
    5. Link to tariff
  Transaction commit → account exists, status = CREATED
```

**Tại sao CREATED → ACTIVE là separate step:**

```text
Account CREATED: tất cả data đã setup, nhưng chưa thể dùng
Account ACTIVE: khách hàng có thể thực hiện transactions

Tại sao cần hai bước?
  1. Downstream systems cần prepare:
     STS: setup billing schedule
     DRG: register account for monitoring
     Notification system: register for alerts
     
  2. Compliance check cuối cùng:
     Đảm bảo mọi required services đã được activate
     Đảm bảo tariff đang active (không bị expire giữa chừng)
     
  3. Business rule: disbursement phải xảy ra trước khi activate
     Với digital disbursement → instant
     Với manual disbursement → có thể cần 24h
```

**Per-Step Workflow Events và LAS Activation:**

```text
LOS publish events per-step tới Kafka (CloudEvents format):
  Topic: orp.workflow-events.<step-name>.v1
  Payload: {
    processingId: "p123",
    status: "SUCCEEDED" | "RUNNING" | "FAILED",
    data: { ... step-specific data ... }
  }

Ví dụ:
  Topic: orp.workflow-events.sign-agreement.v1
  Payload: {
    processingId: "p123",
    status: "SUCCEEDED",
    data: { accountNumber: "ACC-2025-789456", signedDocId: "doc-789-signed" }
  }

Thay vì một sự kiện "origination.completed" duy nhất,
mỗi bước có event riêng. LAS account activation xảy ra qua RabbitMQ chain:
  *(verified: supplement-lifecycle.md)*
  AOS (supplement signed) → RabbitMQ → SRT → CTS.activate(ACCMAINT)
  → CTS → RabbitMQ: ContractServiceOperStatusChanged (SWITCHED_ON)
  → LAS receives: Account CREATED → ACTIVE
  LOS sau đó publishes origination.completed (RabbitMQ) → LAS confirms

Lưu ý: Kafka producer trong LOS cấu hình
  enable.idempotence: false → duplicate events possible
  → LAS phải handle idempotency (AlreadyActivatedException)
```

**Tại sao sẽ có duplicate events:**

```text
Kafka non-idempotent producer + network issue:
  LOS sends event → network timeout → không biết event đã arrive chưa
  LOS retry → event sent twice
  
LAS handler phải handle:
  First event: CREATED → ACTIVE (success)
  Second event: account đã ACTIVE → AlreadyActivatedException
    → catch, log, ack message → không gây lỗi

Bài học: Idempotency phải được implement ở consumer side
         không thể rely vào producer guarantees.
```

:::summary[Agreement & Activation]
E-signature: OTP + face match → strong identity
binding, non-repudiation cho hợp đồng điện tử
Account creation: CREATED state → setup tất cả
data (parameters, services, tariff)
CREATED → ACTIVE: RabbitMQ chain (AOS→SRT→CTS→LAS)
per-step (không phải single origination.done)
RabbitMQ events: consumer must handle dupes (DLQ)
:::

## 7.6 Failure Modes và Recovery

### Taxonomy Failure Modes trong Origination

```text
Loại failure        Ví dụ                    Recovery strategy
─────────────────────────────────────────────────────────────────
Transient failure   Credit bureau timeout    Retry với backoff
                    Network blip             Circuit breaker

Business failure    Score below threshold     Decline gracefully
                    DTI exceeds limit         Counter-offer

Idempotency         Duplicate submit          Detect via processingId
                    Retry sau timeout         Return cached result

Partial completion  KYC OK, scoring fails     Resume from KYC done
                    Offer OK, signing timeout  Re-present offer

Data inconsistency  LAS create OK, RabbitMQ event lost  Reconciliation job
                    Event lost in RabbitMQ     Dead letter queue
```

### Timeout Handling: Trường hợp quan trọng nhất

::::story
Chị Lan nhấn "Xác nhận offer" lúc 10h20. App mất kết nối Internet (wifi bị ngắt). Lúc 10h25, Internet phục hồi. App tự động retry request. Điều gì xảy ra?
::::

```text
10h20: App gửi POST /accept-offer {processingId: "p123"}
10h20: LOS nhận, bắt đầu process (Infinispan cache: "p123 → OFFER_ACCEPTED")
10h20.5: Infinispan cache saved: "p123 → OFFER_ACCEPTED" (per-step typed cache)
10h21: DMS bắt đầu generate document
       → App network dropped → không nhận response

10h25: App retry: POST /accept-offer {processingId: "p123"}
10h25: LOS kiểm tra Infinispan cache state:
       "p123 đã ở OFFER_ACCEPTED step → document đang được generate"
       → Return 200 với current status, không process lại

10h27: DMS hoàn thành document generation
       Infinispan cache: "p123 → DOCUMENT_READY"
       App poll GET /status/p123 → nhận docUrl
```

**Idempotency trong origination:**

```java
// verified: WorkflowController.java, ChooseOfferService.java
// Endpoint thực tế là /api/workflows/chooseOffer (không phải acceptOffer)
// Trả về 202 ACCEPTED + Location header cho async polling

@Override
public ResponseEntity<WorkflowResponseTO> createChooseOfferWorkflow(
        ChooseOfferWorkflowTO workflowTO) {
    var processingId = processingIdGeneratorService.getNextProcessingId();
    chooseOfferService.start(processingId, workflowTO);
    return ResponseEntity
        .status(HttpStatus.ACCEPTED)
        .headers(createHeaders(request, "chooseOffer", processingId))
        .body(new WorkflowResponseTO().processingId(processingId));
}
// Zeebe chỉ được dùng cho SCORING (không phải main workflow orchestration)
// chooseOffer triggers: scoring via Zeebe → callback → AOS supplement creation
```

### Fail-Fast Strategy: Thực tế Thay vì Saga đầy đủ

**Kịch bản:** QCE fails ở step calculateSalesQuotes. Điều gì xảy ra?

**VLP dùng fail-fast, không phải full saga compensation:**

```text
Failure tại mỗi step:

Step 1: PTY fails (cannot create/find applicant)
  → Workflow FAILED, no rollback
  → Customer retries from beginning

Step 2: ADR fails
  → Workflow FAILED, no rollback
  → Customer retries

Step 3: QCE/LPS fails (calculateSalesQuotes)
  → LOS publishes FAILED event với ASQ_COMMUNICATION_ERROR
  → Workflow FAILED, no rollback
  → Customer retries

Step 5: chooseOffer fails
  → Workflow FAILED
  → No auto-compensation

Duy nhất có automatic compensation:
  Account cancelled externally (fraud detection, etc.)
  → AccountCancellationListener (RabbitMQ)
  → AOS supplement rejected automatically
```

**Tại sao fail-fast là practical choice:**

```text
Full saga compensation rất phức tạp:

Vấn đề kỹ thuật:
  Mỗi step có thể fail theo nhiều cách
  Compensation cũng có thể fail
  "What if compensation fails?" → saga của saga
  Distributed transactions là hard problem

Vấn đề business:
  Customer đã thấy offer → cancel offer → confusion
  Customer đã ký document → "void document" → legal complexity
  E-signature là legal artifact → không thể "undo" kỹ thuật

Practical reality:
  80%+ failures là transient (network, timeout) → customer retry
  Remaining failures thường cần human intervention anyway
  → Fail-fast + reconciliation job + ops team là simpler và sufficient

Design principle (vẫn đúng dù không implement full saga):
  Delay expensive/irreversible steps as long as possible
  → Credit bureau check → early (cheap, reversible)
  → Account creation → late (after all checks pass)
  → Document signing → very late (highest commitment)
```

**Stuck Applications - Thực Tế Xảy Ra:**

```text
Scenario: Application signed → LAS account creation fails
  → Workflow FAILED, no auto-recovery
  
  Customer experience: "Tôi đã ký nhưng không nhận được tiền"
  
Ops recovery:
  Reconciliation job: detect applications in SIGNED state > 2 hours
    without corresponding ACTIVE account
  Manual intervention:
    1. Verify signing genuinely happened (check DMS)
    2. Re-trigger account creation in LAS
    3. Activate account
    4. Trigger disbursement
    5. Notify customer

Monitoring:
  Alert: applications stuck > N hours at each step
  Dashboard: origination funnel drop-off per step
  Weekly review: stuck application count + root cause
```

### Dead Letter Queue: Xử lý Events không được Consume

**Vấn đề:**

LOS publish `origination.completed` event (RabbitMQ). Nhưng LAS subscriber của event này đang down trong 5 phút. Event có bị mất không?

**RabbitMQ Dead Letter Queue pattern:**

```text
Normal flow:
  LOS → exchange("origination.events") → queue("am.origination.completed") → LAS

LAS subscriber down 5 phút:
  Events accumulated in queue (RabbitMQ buffers 10,000 messages by default)
  LAS recovers → processes queued events in order
  → No data loss

Nhưng: nếu LAS processes event và fails (exception):
  Message bị nack (negative acknowledge)
  After 3 retries → route to Dead Letter Queue (DLQ)
  Alert: "origination.completed.dlq có 5 messages"
  Ops team investigate → manual reprocess hoặc fix + replay
```

**Implementation:**

```java
// verified: origination-flow.md (step 8)
// origination.completed event CÓ TỒN TẠI — LOS publishes via RabbitMQ → LAS

// LOS publishes after signAgreement completes:
// Exchange: "origination.completed" (RabbitMQ)
// Consumer: LAS → activates account (CREATED → ACTIVE)

// Parallel: LOS also publishes per-step events via Kafka
// Topic: orp.workflow-events.<step-name>.v1
// Status: RUNNING | SUCCEEDED | FAILED

// NOTE: Account creation is event-driven via RabbitMQ (ACCMAINT service →LAS)
// Account activation is triggered by supplement signing flow
// origination.completed is the final confirmation event
```

:::summary[Failure Modes & Recovery]
4 loại failure: transient, business, idempotency,
partial completion - mỗi loại có recovery khác
Timeout: Infinispan cache state → safe retry
Saga compensation: late steps khó compensate hơn
→ delay commitment points
Dead Letter Queue: buffer events khi consumer down
→ eventual processing, no data loss
:::

## Tóm tắt chương 7

```text
4 phút origination của chị Lan, được engineer:

10h15:00 - App gửi request
           LOS nhận → start async processing (Infinispan cache per step + REST calls to backends)
           ADR tạo application record
           LOS return 202 {processingId: "p123"}

10h15:01 - Sequential processing (async per step):
           Step 1: PTY.createApplicant() → ADR.storeApplication()

10h15:03 - KYC verification:
           Identity check PASS (score 97%)
           Sanctions screening CLEAR
           Credit bureau: score 420

10h15:07 - Scoring pipeline:
           Feature extraction → 420 points → PRIME tier
           DTI check: 7.6% < 40% → PASS
           Policy rules: all PASS

10h15:10 - Offer calculation:
           QCE → LPS: 15%/năm, PMT 1,668,400 VNĐ/tháng
           APR check: 16.8% < 20% rate_cap → PASS
           Counter-offer alternatives generated

10h17:00 - Chị Lan xem offer, chấp nhận
           DMS generate contract document
           E-signature với OTP + face match

10h18:00 - generateAgreement: SRT → CTS → LAS creates account (status: CREATED)
           Account exists but not yet ACTIVE

10h19:00 - signAgreement complete: AOS → RabbitMQ → SRT → CTS → LAS
           LAS activates account: CREATED → ACTIVE
           LOS publishes origination.completed (RabbitMQ)
           Notification: "Account activated, tiền đang được giải ngân"

10h19:04 - Done. 4 phút.
           Không có downtime. Không có data loss.
           Mọi step được audit. Mọi failure có recovery path.
```

## Câu hỏi tự kiểm tra

**Loại 1 - Nhớ lại:**
1. LOS dùng Infinispan cache thay vì database - tại sao? Infinispan TTL có ý nghĩa gì trong context này?
2. Kể 4 lớp KYC verification. Mỗi lớp giải quyết vấn đề gì?
3. QCE là gì? Tại sao tên "Quote Calculation Engine" dễ gây nhầm lẫn với "Application Scoring Queue"?
4. Tại sao account có trạng thái CREATED trước ACTIVE - không phải tạo ra đã ACTIVE ngay?

**Loại 2 - Hiểu:**
5. Tại sao LOS trả về 202 Accepted thay vì chờ toàn bộ workflow hoàn thành rồi mới trả lời? Điều này ảnh hưởng thế nào đến client-side implementation?
6. VLP chọn fail-fast thay vì full saga compensation. Giải thích tại sao đây là practical choice - và những rủi ro nào vẫn còn tồn tại với approach này.
7. Kafka producer trong LOS cấu hình `enable.idempotence: false`. Điều này có nghĩa gì? Consumer (LAS) phải handle như thế nào?
8. QCE tồn tại giữa LOS và LPS vì lý do gì? Nếu LOS gọi LPS trực tiếp, điều gì xảy ra với separation of concerns?

**Loại 3 - Áp dụng:**
9. Khách hàng nộp đơn vay 30 triệu trên app. Sau 2 phút, họ bấm lại "Nộp đơn" vì không thấy response (họ nghĩ đơn chưa được gửi). Thiết kế hệ thống để xử lý đúng kịch bản này - bao gồm: database schema, logic idempotency, và UX response.

10. Data Science team đề xuất deploy model mới (Gini tăng từ 0.52 lên 0.65). Thiết kế Champion/Challenger experiment:
    - (a) Traffic allocation ban đầu và lý do
    - (b) Metrics cần monitor và tần suất
    - (c) Success criteria để promote Challenger lên Champion
    - (d) Rollback criteria và process
    - (e) Ước tính business impact khi promote hoàn toàn

**Loại 4 - Phân tích:**
11. Công ty đang xem xét thay Zeebe bằng một approach đơn giản hơn: database-backed state machine (store workflow state trong PostgreSQL, dùng cron job để advance steps). Phân tích:
    - (a) Benefits của approach đơn giản hơn
    - (b) Failure modes mà approach này không handle tốt
    - (c) Scale limitations khi portfolio tăng 10x
    - (d) Khi nào approach đơn giản hơn là acceptable?

12. Bạn phát hiện rằng trong 3 tháng qua, 0.3% applications đã bị "stuck" ở bước DOCUMENT_SIGNED nhưng account chưa được activated trong LAS - do event `origination.completed` bị lost. Thiết kế:
    - (a) Root cause investigation process
    - (b) Fix cho affected applications (không thể redo signing)
    - (c) Preventive measure cho tương lai
    - (d) Monitoring để phát hiện sớm trong tương lai

## Bài tập áp dụng

**Bài 1 - Origination Flow Design:**
Công ty tài chính muốn thêm sản phẩm mới: "Vay nhanh trong 60 giây" - target cho khách hàng returning (đã có account trước đó, lịch sử tốt). Maximum amount: 5,000,000 VNĐ.

Redesign origination flow cho sản phẩm này:
- (a) Những KYC steps nào có thể skip (và tại sao safe để skip)?
- (b) Scoring approach nào phù hợp với returning customer?
- (c) Agreement process có thể simplify như thế nào (legally)?
- (d) Thiết kế workflow steps cho sản phẩm này: liệt kê các bước theo thứ tự, xác định bước nào có thể async, bước nào phải sync
- (e) Failure modes nào trở nên quan trọng hơn với ultra-fast flow?

**Bài 2 - Champion/Challenger Analysis:**
Bạn có data sau sau 90 ngày chạy experiment:

```text
                    Champion (90%)    Challenger (10%)
Approval rate:          65%               70%
DPD 30+ tại M3:        3.8%              2.9%
DPD 90+ tại M3:        1.5%              1.0%
False positive rate:    8%                5%
Average score:          382               391
Processing time:       180ms             220ms (+40ms)
```

Portfolio: 50,000 applications/tháng, average loan 12 triệu, net margin 1.2 triệu/loan.

(a) Tính net economic impact nếu promote Challenger toàn bộ
(b) Processing time tăng 40ms - tác động đến user experience như thế nào? Có deal-breaker không?
(c) Nếu bạn là Product Manager, bạn recommend promote hay không? Với điều kiện gì?
(d) Thiết kế gradual rollout plan nếu decide promote

**Bài 3 - Failure Recovery Engineering:**
Kỹ sư Tuấn cần implement reconciliation job để detect và fix "stuck applications" - applications đã qua bước DOCUMENT_SIGNED nhưng LAS account chưa được activated sau 2 giờ.

Thiết kế complete solution:
- (a) Detection query: SQL/logic để identify stuck applications
- (b) Verification: trước khi fix, cần verify gì để tránh fix những trường hợp đang processing bình thường?
- (c) Fix logic: cần thực hiện gì để activate stuck accounts an toàn?
- (d) Idempotency: job có thể chạy nhiều lần không gây hại?
- (e) Alerting: khi nào cần alert human, khi nào auto-fix là safe?
- (f) Metrics: track những gì để measure health của origination pipeline?

## Đọc thêm

**Workflow và Process Engines:**
- Reiter, B. (2021). *Practical Process Automation.* O'Reilly Media. - Covers Zeebe/Camunda và BPMN workflow design cho production systems.

**Credit Scoring:**
- Anderson, R. (2007). *The Credit Scoring Toolkit.* Oxford University Press. - Comprehensive guide về scorecard development và deployment.

**Distributed Systems Patterns:**
- Richardson, C. (2018). *Microservices Patterns.* Manning Publications. - Chapters 4-6 về Saga pattern và compensating transactions - essential cho origination flow design.

*Chương 8 sẽ đi vào trái tim của VLP - Account Management và Billing Engine. Đây là module phức tạp nhất và quan trọng nhất: nơi mọi giao dịch được xử lý, mọi khoản lãi được tính, và mọi thay đổi trạng thái được record. Sau chương 7, bạn hiểu cách account được tạo ra. Chương 8 sẽ giải thích cách nó hoạt động trong suốt vòng đời 12-36 tháng.*
