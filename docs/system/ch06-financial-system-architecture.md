---
title: "Chương 6. Kiến trúc hệ thống tài chính"
sidebar_label: "6. Kiến trúc hệ thống tài chính"
sidebar_position: 1
chapter: 6
subtitle: "Financial System Architecture"
reading_time: 32
source_file: "phan-2-chuong-6.md"
editorial_status: "mechanical"
---

> *"Trong tài chính, hệ thống không chỉ phục vụ business - hệ thống IS business. Một ngân hàng không có hệ thống chạy tốt không phải là ngân hàng xấu - đó không phải là ngân hàng."*

## Dẫn nhập: Khi một dòng Code trị giá 460 triệu đô la

::::story
Ngày 1 tháng 8 năm 2012, Knight Capital Group - một trong những công ty trading lớn nhất ở Mỹ - triển khai phiên bản code mới. Một developer quên xóa đoạn code cũ trong một server trong số 8 servers production.

Trong 45 phút, hệ thống tự động giao dịch cổ phiếu theo logic sai - mua cao, bán thấp. Không ai trong team biết cách dừng nó lại đủ nhanh. Knight Capital mất 460 triệu đô la trong 45 phút.

Ba ngày sau, công ty bị mua lại để tránh phá sản.

Trong consumer finance, quy mô thiệt hại thường nhỏ hơn - nhưng pattern là như nhau: một quyết định thiết kế tưởng nhỏ, một giả định không được document, một test case không được cover. Và hàng triệu tài khoản của người dùng thực sự bị ảnh hưởng.
::::

Chương này xây dựng nền tảng để hiểu **tại sao** hệ thống tài chính được thiết kế khác biệt - và tại sao những khác biệt đó không phải là over-engineering, mà là phản ánh của những ràng buộc kinh doanh và pháp lý rất cụ thể.

## 6.1 Tại sao Financial Systems khác với Normal Enterprise Systems

### Tình huống: Hai hệ thống, hai thế giới

::::story
Kỹ sư Tuấn trước đây làm ở một startup e-commerce. Hôm nay là ngày đầu tiên anh làm ở công ty tài chính. Anh nhìn vào codebase và ngạc nhiên:

"Tại sao lại có nhiều validation đến vậy? Tại sao mỗi operation lại cần transaction? Tại sao không dùng eventual consistency như mọi nơi? Tại sao có cả một module chỉ để track audit trail?"

Tech Lead giải thích: "Bởi vì ở đây, một bug không chỉ là một bug - nó là một khoản tiền của ai đó. Và khoản tiền đó phải được chứng minh là đúng - với tòa án nếu cần."
::::

### Nguyên tắc 1: Correctness Over Availability

**Khái niệm:**

Trong hầu hết hệ thống web, khi phải chọn giữa *sẵn sàng phục vụ* *(availability)* và *nhất quán dữ liệu* *(consistency)*, người ta thường chọn availability - chấp nhận một chút eventual consistency. Netflix, Amazon, Google - tất cả đều ưu tiên "cứ chạy, nhất quán sau."

Trong hệ thống tài chính, thứ tự ưu tiên đảo ngược hoàn toàn: **correctness trước, availability sau**.

**Tại sao?**

```text
Scenario e-commerce:
  User A và User B cùng xem sản phẩm.
  System A thấy stock = 5, System B thấy stock = 5 (eventual consistency)
  Cả hai đều order. Cuối cùng chỉ có 5 items — một người bị cancel.
  → Annoying, nhưng manageable. Refund được, apologize được.

Scenario consumer finance:
  Account A có balance = 2,000,000 VNĐ.
  System A xử lý rút 1,500,000 VNĐ.
  System B (chưa nhận update) cũng cho phép rút 1,500,000 VNĐ.
  Tổng rút: 3,000,000 VNĐ > balance thực tế.
  → Không chỉ là lỗi — đây là financial fraud/loss.
  → Không thể "apologize" — tiền đã mất.
  → Có thể vi phạm pháp luật.
```

**Hệ quả kiến trúc:**

```text
E-commerce (availability first):
  ✓ Cache aggressively
  ✓ Eventual consistency acceptable
  ✓ Optimistic locking ok
  ✓ Read replicas without strict sync

Financial systems (correctness first):
  ✗ Cache phải có invalidation strategy nghiêm ngặt
  ✗ Eventual consistency KHÔNG acceptable cho balance
  ✗ Pessimistic locking hoặc optimistic với retry
  ✗ Read replicas chỉ cho analytics, không cho decisions
```

**Ví dụ thực tế trong VLP:**

Khi LAS module xử lý một transaction, nó không chỉ update balance - nó làm tất cả trong một database transaction ACID:

```java
// illustrative pseudo-code — actual signature differs
// verified: verify-ch6-ch7-code.md
// Actual: confirmTransaction() returns ExecuteTransactionResult (not TransactionResult)
// Actual: no SERIALIZABLE annotation — LAS uses AccountLockGuard (pessimistic locking)
// Actual: idempotency via getAuthorizationFromConfirm() (not findBySourceTxCode)
@Transactional  // LAS uses default isolation, NOT SERIALIZABLE
public ExecuteTransactionResult confirmTransaction(ConfirmationRequestTo request) {
    // 1. Lock account (via AccountLockGuard — pessimistic locking)
    Account account = accountRepo.findByNumber(request.getAccountNumber());

    // 2. Validate all business rules
    validateContractService(account, request);
    validateSufficientBalance(account, request.getAmount());

    // 3. Create transaction record
    Transaction tx = createTransaction(account, request);

    // 4. Update running balance (atomic with transaction creation)
    updateCurrentBalance(account, request.getAmount());

    // 5. Publish event (via outbox pattern — not direct Kafka call!)
    outboxService.publish(new TransactionConfirmedEvent(tx));

    return buildResponse(tx);
}
// If ANY step fails → entire transaction rolls back
// → Balance unchanged, no transaction created, no event published
```

LAS dùng **pessimistic locking** qua `AccountLockGuard` (timeout 1 phút) - đảm bảo không có hai threads nào process cùng một account đồng thời. Default isolation level (không phải SERIALIZABLE). Chi phí: thread chờ khi có lock contention. Benefit: correctness đảm bảo mà không cần isolation level cao nhất.

### Nguyên tắc 2: Audit Trail như Constraint thiết kế

::::story
Khách hàng khiếu nại: "Tháng 3 năm ngoái, tôi đã trả 2,000,000 VNĐ nhưng hệ thống ghi nhận chỉ 1,800,000 VNĐ. Tôi có bằng chứng chuyển khoản."

Công ty phải trả lời: số tiền đó đi đâu, ai xử lý, lúc mấy giờ, từ hệ thống nào, có error nào không, có retry không. Và phải trả lời trong 5 ngày theo regulatory requirement.

Nếu audit trail không tồn tại - không thể trả lời. Không thể trả lời → vi phạm regulatory → bị phạt → reputation damage.
::::

**Khái niệm:**

:::key
**Audit trail** *(dấu vết kiểm toán)* là bản ghi không thể xóa và không thể sửa của mọi hoạt động trong hệ thống - ai làm gì, lúc nào, với kết quả gì, và tại sao.
:::

**Audit trail không phải là logging thông thường:**

| | Application Log | Audit Trail |
|--|----------------|-------------|
| Mục đích | Debug, monitoring | Legal accountability |
| Ai xem | Developer, ops | Auditor, regulator, tòa án |
| Retention | 7-30 ngày | 7-10 năm (theo regulatory) |
| Xóa/sửa | Được | TUYỆT ĐỐI KHÔNG |
| Granularity | Technical events | Business events có context |
| Format | Unstructured text | Structured, queryable |

**Hệ quả thiết kế - Immutability:**

Trong VLP, không có `UPDATE` hay `DELETE` cho bất kỳ entity business nào. Chỉ có insert-only:

```sql
-- Sai: Update transaction amount
UPDATE las_transaction SET amount = 1800000 WHERE id = 123;
-- → Mất dấu vết giá trị cũ

-- Đúng: Cancel and create new
UPDATE las_transaction SET cancelled = true,
    cancellation_reason = 'AMOUNT_CORRECTION',
    cancelled_at = NOW(),
    cancelled_by = 'SYSTEM'
WHERE id = 123;

INSERT INTO las_transaction (amount, ..., source_transaction_id)
VALUES (1800000, ..., 123);
-- → Biết cũ là bao nhiêu, mới là bao nhiêu, ai làm, khi nào
```

**Temporal data:**

Tương tự, `AccountParameter` (CREDIT_LIMIT, BILLING_DAY...) không bao giờ bị update:

```sql
-- Không update credit limit
UPDATE las_account_parameter SET value = 25000000 WHERE ...;

-- Đóng record cũ, tạo record mới
UPDATE las_account_parameter
SET valid_to = TODAY - 1
WHERE account_id = X AND parameter_type = 'CREDIT_LIMIT'
  AND valid_to = UNREACHABLE_FUTURE_DATE;

INSERT INTO las_account_parameter
  (account_id, parameter_type, value, valid_from, valid_to)
VALUES (X, 'CREDIT_LIMIT', 25000000, TODAY, UNREACHABLE_FUTURE_DATE);
```

Kết quả: System biết CREDIT_LIMIT của account X là bao nhiêu tại **bất kỳ thời điểm nào trong lịch sử** - không chỉ hiện tại.

### Nguyên tắc 3: Regulatory Compliance là First-Class Concern

::::story
Tech Lead nhận được requirement từ Compliance team: "Từ 1/1/2026, NHNN yêu cầu tất cả CFTC phải report DPD bucket của mỗi tài khoản theo format mới, trong vòng 5 ngày làm việc sau mỗi tháng."

Response thông thường (sai): "Okay, chúng ta sẽ add một report endpoint sau khi ra feature X và Y."

Response đúng: "Report này cần data gì? Data đó hiện tại có sẵn không? Có cần thay đổi data model không? Làm thế nào để đảm bảo report này chạy được với 99.9% reliability - vì nếu lỡ deadline regulatory thì bị phạt?"
::::

**Regulatory requirements thường ảnh hưởng đến:**

**1. Data model:**
Report cần field X → field X phải có trong database. Nếu thiếu → phải migrate → downtime risk.

**2. Data retention:**
Regulatory yêu cầu giữ data 7 năm → storage architecture phải tính đến 7 năm của data growth.

**3. Audit capability:**
"Chứng minh rằng vào ngày 15/3/2024, credit limit của account X là 20 triệu." → Phải có temporal data model.

**4. Latency requirements:**
"Real-time reporting" của một số regulatory → không thể dùng nightly batch.

**5. Data localization:**
"Dữ liệu người dùng Việt Nam phải lưu tại Việt Nam" → Cloud infrastructure decision.

**Ví dụ - Regulatory constraint tạo ra design decision:**

```text
Regulatory requirement:
  "Khách hàng có quyền yêu cầu xóa dữ liệu cá nhân (right to erasure)"
  [GDPR Article 17]

Tension với audit trail requirement:
  "Mọi transaction phải được lưu giữ 7 năm"

Giải pháp được adopt:
  Pseudonymization — tách PII ra khỏi transactional data

  las_transaction: lưu account_id (không phải customer_id)
  CIS module: lưu mapping customer_id → account_id
  CIS module: lưu PII (tên, địa chỉ, CCCD)

  Khi right-to-erasure:
  → Xóa PII trong CIS module (và mapping)
  → Giữ transaction records trong LAS (chỉ có account_id — không còn traceable về cá nhân)
  → Audit trail vẫn intact về mặt financial
  → PII compliance achieved
```

Đây là lý do CIS *(KYC Data Storage)* là module riêng biệt - không phải vì microservices fashion, mà vì regulatory compliance yêu cầu separation of PII và transactional data.

:::summary[Financial System vs Normal System]
Correctness first: ACID transactions, pessimistic
pessimistic locking (AccountLockGuard)
Audit trail: immutable, 7-10 năm, legal-grade
→ Không bao giờ DELETE/UPDATE business entities
Regulatory: first-class design constraint, không
phải afterthought
Pseudonymization: balance PII erasure vs
audit trail retention
:::

## 6.2 Microservices trong tài chính: Cơ hội và bẫy

### Tình huống: Tại sao không phải một Monolith?

::::story
Bà Hương hỏi Tech Lead: "Chúng ta có 21 microservices. Điều đó có thực sự cần thiết không? Mỗi service là một team, một deployment pipeline, một database... Complexity rất cao."

Tech Lead trả lời: "Có và không. Không phải vì microservices là trend - mà vì domain của chúng ta thực sự có 21 bounded contexts khác nhau, với team ownership khác nhau, với deployment cadence khác nhau, và với scaling requirements khác nhau."
::::

### Bounded Contexts trong Domain tài chính

**Khái niệm:**

:::key
**Bounded context** *(ngữ cảnh giới hạn)* là ranh giới mà trong đó một model domain cụ thể có ý nghĩa nhất quán. Bên ngoài ranh giới đó, cùng một thuật ngữ có thể có nghĩa khác.
:::

**Ví dụ - "Account" trong các contexts khác nhau:**

```text
Trong LAS (Account Management):
  Account = financial account của khách hàng
  Fields: accountNumber, status, creditLimit, billingPeriod
  Operations: activate, debit, credit, close

Trong CTS (Contract Services):
  Account (Contract) = hợp đồng pháp lý
  Fields: contractCode, startDate, contractType, terms
  Operations: sign, amend, terminate

Trong CIS (KYC Data Storage):
  Account (CustomerProfile) = thông tin cá nhân
  Fields: name, CCCD, address, incomeInfo
  Operations: create, update, pseudonymize

Trong CTM (Contract Management):
  Account (Contract) = lifecycle của hợp đồng
  Fields: stages, approvals, amendments
```

Cùng từ "account" - bốn nghĩa hoàn toàn khác nhau. Nếu nhét tất cả vào một monolith, model domain sẽ trở thành mớ hỗn độn với "Account" class có 80 fields và không ai hiểu rõ.

**Tại sao các bounded contexts trong VLP được tách thành microservices:**

| Service | Bounded Context | Lý do tách riêng |
|---------|----------------|-----------------|
| LAS | Account & Transaction lifecycle | Core domain, thay đổi thường xuyên, cần isolated testing |
| LPS | Pricing calculations | Computation-heavy, có thể scale independently |
| CIS | PII data | Regulatory isolation (GDPR separation) |
| DRG | Debt & collections | Separate team, separate deployment cycle |
| LOS | Origination orchestration | Stateless, có thể fail và retry độc lập |
| STS | Statement generation | Batch processing, scale independently |

### Distributed Transactions và Saga Pattern

**Vấn đề:**

Origination flow trong VLP bao gồm:
1. LOS gọi CIS để tạo customer profile
2. LOS gọi ADR để lưu application data
3. LOS gọi QCE để tính toán offer
4. LOS gọi LAS để activate account

Nếu step 4 (LAS activate) fail sau khi step 1-3 đã success - bạn có customer profile trong CIS, application data trong ADR, nhưng không có active account. **Dữ liệu inconsistent**.

Trong monolith, giải pháp đơn giản: một database transaction bao gồm tất cả. Rollback nếu bất kỳ step nào fail.

Trong microservices, không thể có distributed ACID transaction across services - mỗi service có database riêng.

**Khái niệm - Saga Pattern:**

:::key
**Saga** là một chuỗi các local transactions, mỗi transaction publish một event hoặc message để trigger transaction tiếp theo. Nếu một bước fail, saga thực hiện compensating transactions để undo những gì đã làm.
:::

**Hai loại Saga:**

**Choreography-based Saga** *(Saga điều phối phân tán)*:

```text
LOS → publishes "ApplicationSubmitted" event
  ↓
CIS subscribes → creates customer profile → publishes "CustomerProfileCreated"
  ↓
ADR subscribes → saves application data → publishes "ApplicationDataStored"
  ↓
QCE subscribes → calculates offer → publishes "OfferCalculated"
  ↓
LAS subscribes → activates account → publishes "AccountActivated"

Nếu LAS fails:
  LAS publishes "AccountActivationFailed"
  QCE subscribes → undo offer calculation
  ADR subscribes → undo application data
  CIS subscribes → undo customer profile creation
```

*Ưu điểm:* Loosely coupled, no central coordinator
*Nhược điểm:* Khó debug khi fail (cần trace across multiple services), khó nhìn thấy overall flow

**Orchestration-based Saga** *(Saga điều phối tập trung)*:

```text
LOS (orchestrator) gọi trực tiếp từng service:
  Step 1: LOS → CIS.createProfile() → success
  Step 2: LOS → ADR.storeApplication() → success
  Step 3: LOS → QCE.calculateOffer() → success
  Step 4: LOS → LAS.activateAccount() → FAIL

LOS biết tất cả steps đã làm:
  LOS → QCE.cancelOffer()
  LOS → ADR.cancelApplication()
  LOS → CIS.cancelProfile()
```

*Ưu điểm:* LOS có toàn bộ flow logic, dễ monitor, dễ debug
*Nhược điểm:* LOS là central point - nếu LOS fail thì sao?

**VLP dùng Fail-Fast strategy thay vì full saga compensation** - khi bước nào fail, workflow được đánh dấu FAILED và customer retry từ đầu. Zeebe được dùng optional chỉ cho scoring workflow (không phải main orchestrator). State được giữ trong Infinispan cache với TTL ngắn.

**Tại sao Compensating Transactions rất khó trong tài chính:**

```text
Step 4 fail: LAS.activateAccount() → FAIL

Technical compensation muốn: QCE.cancelOffer()

Nhưng: Offer đã được gửi cho khách hàng xem rồi.
Customer đã screenshot. Customer đang expect offer này.

"Cancel offer" về mặt technical: mark CANCELLED trong DB — dễ.
"Cancel offer" về mặt business: gọi điện giải thích cho khách hàng — khó.
"Cancel offer" về mặt legal: đã có binding commitment chưa? — rất khó.
```

**Bài học về Fail-Fast:** Trong thực tế, VLP chọn fail-fast - khi fail, workflow dừng lại. Customer retry. Đây đơn giản hơn full saga và đủ tốt vì:
1. 80%+ failures là transient (network, timeout) → retry sẽ thành công
2. Remaining cases cần human judgment anyway
3. Reconciliation job detect và fix stuck applications

**Compensation tốt nhất:** Design workflow sao cho irreversible steps (signing, account creation) đến thật muộn, sau khi tất cả reversible checks đã pass.

### Anti-Pattern: Distributed Monolith

::::story
Một team khác trong công ty đã "migrate lên microservices" cách đây 2 năm. Nhưng mỗi lần deploy service A, phải deploy cả B, C, D cùng lúc. Mỗi khi service A bị down, B, C, D cũng bị down. Database của A và B thực ra cùng schema trong một database instance.

Đây là **distributed monolith** - worst of both worlds: complexity của microservices mà không có benefit.
::::

**Dấu hiệu nhận biết distributed monolith:**

```text
❌ Services phải deploy cùng nhau (tight release coupling)
❌ Service A query trực tiếp database của service B
❌ Services dùng chung schema trong cùng DB instance
❌ Một service down → cascade failure sang nhiều services khác
❌ Thay đổi API của service A → phải update tất cả consumers ngay lập tức
❌ Không thể scale một service độc lập mà không ảnh hưởng service khác
```

**Dấu hiệu microservices thực sự:**

```text
✅ Deploy độc lập, không cần coordinate với team khác
✅ Database riêng biệt, không ai access trực tiếp (chỉ qua API/events)
✅ Fail independently — một service down không cascade
✅ Scale independently — LPS scale up cho EOM, LOS scale down sau đó
✅ API versioning cho backward compatibility
✅ Circuit breaker pattern để handle downstream failures
```

**Ví dụ từ VLP:**

```text
LAS module bị down trong 5 phút (maintenance):
  LOS: Queue origination requests, retry khi LAS available
  STS: Queue statement generation requests, retry sau
  DRG: Kafka events được buffer, process sau khi LAS recovered
  User-facing: "Processing, please wait" thay vì error

Nếu là distributed monolith:
  LAS down → LOS down → tất cả origination fail
  LAS down → STS down → không generate được statement
  LAS down → user thấy 500 errors trên toàn bộ platform
```

### Circuit Breaker Pattern

**Khái niệm:**

:::key
**Circuit breaker** *(cầu dao ngắt mạch)* là pattern ngăn chặn cascade failure: khi một downstream service liên tục fail, circuit breaker "mở" và return error ngay lập tức thay vì tiếp tục chờ timeout - bảo vệ caller service khỏi bị tied up.
:::

```text
CLOSED state (bình thường):
  Requests → Service B → Response
  Nếu failure rate < threshold: stay CLOSED

OPEN state (downstream failing):
  Requests → Circuit Breaker → Return error immediately (no wait)
  Sau timeout period: thử HALF-OPEN

HALF-OPEN state (testing recovery):
  Một request được phép qua → nếu success: CLOSED
                             → nếu fail: OPEN again
```

**Ứng dụng trong VLP:**

Khi LAS gọi LPS để tính instalment plan:
- CLOSED: call LPS, nhận response trong <200ms
- Nếu LPS fail 50% requests trong 10 giây: mở circuit breaker
- OPEN: LAS không gọi LPS nữa, return "LPS unavailable" error ngay
- Sau 30 giây: thử lại với một request (HALF-OPEN)

Không có circuit breaker: 1000 requests/giây × 5s timeout = 5000 requests đang chờ trong queue → LAS thread pool exhausted → LAS cũng bị down → cascade failure.

:::summary[Microservices Trong Tài Chính]
Bounded context: lý do tách services, không phải
trend → 21 services vì 21 domain contexts
Saga pattern: distributed transactions không có
global rollback → compensating transactions
Distributed monolith: worst of both worlds
→ 6 dấu hiệu nhận biết và tránh
Circuit breaker: ngăn cascade failure,
bảo vệ system stability
:::

## 6.3 Inter-Module Communication Design

### Ba loại Communication và khi nào dùng mỗi loại

Trong VLP, các module communicate qua ba cơ chế khác nhau. Mỗi cơ chế có trade-offs riêng, và chọn sai cơ chế là nguồn gốc của nhiều vấn đề kiến trúc.

### Loại 1: Synchronous REST: Khi nào dùng

**Mô tả:** Service A gọi HTTP request đến Service B và **chờ** response trước khi tiếp tục.

**Điều kiện phù hợp:**

```text
✅ Cần kết quả ngay lập tức để tiếp tục flow
✅ Operation phải hoàn thành trong một request-response cycle
✅ Caller cần biết success/fail trước khi proceed
✅ Latency requirement thấp (< 500ms)
```

**Ví dụ trong VLP:**

```text
LAS gọi LPS để tính instalment plan:
  LAS cần số tiền PMT ngay lập tức
  → Không thể "process later" — khách hàng đang chờ xem offer
  → REST synchronous call là đúng

LOS gọi CIS để verify customer identity:
  LOS cần biết customer có legit không trước khi proceed
  → REST synchronous call là đúng
```

**Điều kiện KHÔNG phù hợp:**

```text
❌ Operation mất nhiều thời gian (> 2-3 giây)
❌ Caller có thể tiếp tục mà không cần kết quả ngay
❌ Operation là fire-and-forget
❌ High volume, cần decoupling để scale
```

**Resilience cho synchronous REST:**

```java
// illustrative pseudo-code — Resilience4j pattern (conceptually correct)
// verified: verify-ch6-ch7-code.md
// Note: LAS dùng RestTemplate để gọi LPS (không phải OpenFeign với built-in resilience)
// Resilience4j + circuit breaker được dùng tại SRT (không phải trực tiếp LAS→LPS)

// Ví dụ minh họa pattern (không phải code LAS thực tế):
InstalmentPlanDto calculateWithResilience(IPCalculationRequest request) {
    try {
        return apClient.calculatePlan(request);  // RestTemplate call
    } catch (ResourceAccessException e) {
        // Timeout → retry logic xử lý
        throw new ServiceUnavailableException("LPS_SERVICE_UNAVAILABLE");
    }
}
// SRT module có Resilience4j protection cho downstream services
// LAS gọi LPS chỉ trong IP flows (không phải regular transaction confirmation)
```

### Loại 2: Async Event-Driven: Khi nào dùng

**Mô tả:** Service A publish một event vào message broker (Kafka/RabbitMQ). Service B subscribe và process event sau - có thể milliseconds sau, có thể vài giây sau.

**Điều kiện phù hợp:**

```text
✅ Caller không cần kết quả ngay
✅ Operation có thể được queue và process sau
✅ Cần decouple producer và consumer (khác team, khác deployment cycle)
✅ Fan-out: một event cần đến nhiều consumers
✅ High volume cần buffering
```

**Ví dụ trong VLP:**

```text
LAS publish EOM_FEE event → RabbitMQ (`am.headers.event.notification` exchange) → STS subscribes:
  *(Note: TransactionConfirmedEvent → Kafka → DRG (không phải STS))*
  LAS không cần chờ STS generate statement
  Statement generation có thể mất vài giây → async là đúng
  LAS và STS là hai teams khác nhau → loose coupling là đúng
  Nhiều events có thể queue → buffering là đúng

LAS publish transaction.confirmed → Kafka → DRG subscribes:
  Debt Register sync có thể có delay vài giây — acceptable
  High volume (triệu events/ngày) → Kafka handles well
  DRG cần full history → Kafka log retention là đúng
```

**RabbitMQ vs Kafka - Khi nào dùng gì:**

```text
RabbitMQ (AMQP):
  ✓ Task queues: một event được xử lý bởi MỘT consumer (competing consumers)
  ✓ Request-reply pattern (một dạng async call-response)
  ✓ Complex routing logic (exchanges, bindings)
  ✓ Short-lived messages không cần replay
  
  Trong VLP: LAS → STS (statement generation — task queue)
                 LOS → LAS (origination.completed — task queue)

Kafka:
  ✓ Event log: nhiều consumers đọc cùng stream
  ✓ Replay events (consumer reset offset về quá khứ)
  ✓ Very high throughput
  ✓ Long-term retention (analytics)
  
  Trong VLP: LAS → DRG (transaction events — multiple consumers)
                 QST → LOS (quote events — event log)
```

### Loại 3: Direct DB Read: Khi nào Justified

**Mô tả:** Service A đọc trực tiếp database của Service B - không thông qua API hay event.

**Đây thường là anti-pattern trong microservices** - nhưng có một số trường hợp được justified trong financial systems.

**Trong VLP, LAS đọc trực tiếp CTM schema:**

```text
"Normal" approach:
  LAS cần ContractService data
  → LAS gọi CTS service via REST
  → CTS trả về data
  → LAS proceed

Tại sao VLP dùng direct DB read:
  1. Performance: Mỗi transaction confirm = 1 ContractService lookup
     Với 1000 transactions/giây → 1000 HTTP calls/giây đến CTS
     Latency: 10-20ms mỗi call → thêm 10-20ms vào mỗi transaction
     Với Direct DB read: 1-2ms → 5-10x faster

  2. Consistency: Transaction phải trong cùng DB transaction
     Nếu call CTS via HTTP, data CTS đọc được và data LAS đọc được
     có thể khác nhau (concurrent updates giữa các calls)
     Direct DB read trong cùng transaction → consistent view

  3. Operational risk: Nếu CTS service down, toàn bộ transaction
     confiramtion fail. Với direct DB read, LAS không phụ thuộc CTS availability.
```

**Điều kiện để Direct DB Read được justified:**

```text
✅ Performance requirement rất cao (hot path)
✅ Consistency requirement buộc phải trong cùng DB transaction
✅ Data owner (CTS) và consumer (LAS) cùng team/org
✅ Schema change được coordinate giữa hai teams
✅ Tradeoff được document rõ ràng và accepted consciously
```

**Khi nào KHÔNG justified:**

```text
❌ Convenience (ngại viết API)
❌ Two different organizations (data governance nightmare)
❌ Cần strict service boundary để scale independently
❌ Schema có thể thay đổi thường xuyên
```

### Inter-Module Dependency Map

Nhìn vào toàn bộ communication trong VLP:

```mermaid
flowchart LR
    App([Mobile / Web App]) --> GW[API Gateway]
    GW --> BFF["BFF (NestJS 11)"]
    BFF --> LAS[LAS]
    BFF --> CTM[CTM]
    BFF --> LOS[LOS]
    BFF --> PTY[PTY]
    BFF --> QST[QST]
    BFF --> AOS[AOS]
    BFF --> DMS[DMS]
    BFF --> PDC[PDC]
    
    LAS ---|LEDGER Cluster| LPS[LPS]
    CTM ---|CORE Cluster| CTS[CTS]
```

**Quy tắc "Owner của dependency phải documented":**

Mỗi dependency trong VLP phải có justification document:
- **Loại:** REST / Event / Direct DB
- **Tại sao:** Performance / Consistency / Decoupling
- **Trade-off accepted:** [liệt kê]
- **Failure mode:** Nếu dependency down, caller behave thế nào?

:::summary[Inter-Module Communication]
REST synchronous: khi cần kết quả ngay, latency
thấp, short-lived - luôn cần timeout + retry +
circuit breaker
Async events: khi có thể queue, fan-out,
decouple - RabbitMQ (task queue) vs
Kafka (event log)
Direct DB: anti-pattern, nhưng justified khi
performance + consistency require nó
Mọi dependency phải có documented justification
:::

## 6.4 Data Architecture trong tài chính

### Event Sourcing trong Billing

::::story
Anh Minh muốn biết: "Balance của account #12345 vào ngày 15/3/2024 lúc 10:30 là bao nhiêu?" Đây là yêu cầu từ audit team.

Với database thông thường: balance hiện tại được lưu → không thể trả lời câu hỏi về quá khứ.

Với event sourcing: tất cả sự kiện thay đổi balance được lưu → có thể "replay" để reconstruct balance tại bất kỳ thời điểm nào.
::::

**Khái niệm - Event Sourcing:**

:::key
**Event Sourcing** là pattern lưu trạng thái hệ thống dưới dạng chuỗi events (sự kiện thay đổi) thay vì lưu trạng thái hiện tại. Trạng thái hiện tại được derive bằng cách replay toàn bộ events từ đầu.
:::

**Ví dụ trong billing:**

```text
Thay vì:
  LAS_CURRENT_BALANCE: { account_id: 123, balance: 5,200,000 }
  (Chỉ biết balance hiện tại, không biết lịch sử)

Event sourcing:
  LAS_LEDGER_ENTRY (events):
  #1: 2024-01-05 10:00: +20,000,000 (giải ngân)
  #2: 2024-01-20 09:30: -1,696,080 (trả góp tháng 1)
  #3: 2024-02-03 14:22: -500,000  (phí dịch vụ)
  #4: 2024-02-20 09:30: -1,696,080 (trả góp tháng 2)
  ...

  Balance tại bất kỳ thời điểm = sum of all events up to that point
```

**Trong VLP, cả hai được dùng:**

- **LAS_LEDGER_ENTRY**: Ghi lại từng event (transaction, fee, interest) - đây là event store
- **LAS_CURRENT_BALANCE**: Materialized view - calculated từ events, updated realtime

```text
Event store (append-only):
  Mỗi transaction → INSERT INTO las_ledger_entry (...)
  Không bao giờ DELETE hay UPDATE

Materialized view (for performance):
  LAS_CURRENT_BALANCE được update sau mỗi event
  Không thể derive realtime từ events (too slow for every request)
  Nếu balance có vấn đề → reconcile từ event store
```

**Reconciliation:**

```sql
-- Kiểm tra balance có đúng không:
SELECT
    SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE -amount END)
        as calculated_balance
FROM las_ledger_entry
WHERE account_id = 123
    AND NOT cancelled
    AND transaction_date <= '2024-03-15 10:30:00';

-- So sánh với:
SELECT outstanding_debt FROM las_current_balance WHERE account_id = 123;

-- Nếu khác nhau → inconsistency → investigate
```

### Temporal Data và lịch sử bất biến

**Khái niệm - Temporal Tables:**

:::key
**Temporal data** là data có gắn validity period - biết chính xác một record có giá trị từ khi nào đến khi nào, không chỉ là "hiện tại."
:::

**Pattern trong VLP:**

```sql
-- AccountParameter: mỗi record biết valid từ/đến khi nào
CREATE TABLE las_account_parameter (
    id BIGINT PRIMARY KEY,
    account_id BIGINT NOT NULL,
    parameter_type VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL,
    valid_from DATE NOT NULL,           -- Effective start
    valid_to DATE NOT NULL,             -- Effective end (UNREACHABLE_FUTURE_DATE nếu current)
    created_at TIMESTAMP,
    created_by VARCHAR(100)
);

-- Query: Credit limit của account X vào ngày 15/3/2024
SELECT value
FROM las_account_parameter
WHERE account_id = X
    AND parameter_type = 'CREDIT_LIMIT'
    AND valid_from <= '2024-03-15'
    AND valid_to >= '2024-03-15';
```

**Tại sao không chỉ lưu giá trị hiện tại?**

```text
Tình huống: Khách hàng complain "Tháng 3 tôi bị over-limit, nhưng
  credit limit của tôi lúc đó là 25 triệu, không phải 20 triệu
  như hệ thống đang hiển thị."

Với temporal data:
  → Query credit limit vào tháng 3 → trả lời chính xác
  → Nếu confirm là 25 triệu: hệ thống có lỗi → investigate
  → Nếu confirm là 20 triệu: khách hàng nhầm → show audit trail

Không có temporal data:
  → Chỉ biết credit limit hiện tại
  → Không thể verify claim của khách hàng
  → Phải trả lời "chúng tôi không có thông tin này"
  → Loss of trust, potential legal dispute
```

### Soft Delete và Audit Implications

**Khái niệm:**

:::key
**Soft delete** là kỹ thuật "xóa" record bằng cách đánh dấu `deleted = true` (hoặc `cancelled = true` trong financial context), thay vì thực sự xóa khỏi database.
:::

**Tại sao financial systems dùng soft delete:**

```text
Hard delete: DELETE FROM las_transaction WHERE id = 123;
  → Record biến mất hoàn toàn
  → Audit trail mất
  → Không thể biết transaction này từng tồn tại
  → Vi phạm regulatory requirement

Soft delete: UPDATE las_transaction
    SET cancelled = true,
        cancellation_reason = 'DUPLICATE_ENTRY',
        cancelled_at = NOW(),
        cancelled_by = 'system:duplicate-detector'
    WHERE id = 123;
  → Record vẫn tồn tại trong DB
  → Audit trail intact: ai cancel, khi nào, tại sao
  → Có thể "undo" nếu cancel nhầm (set cancelled = false)
  → Regulatory compliant
```

**Convention trong VLP:**

```java
// illustrative pseudo-code — pattern exists, implementation differs
// verified: verify-ch6-ch7-code.md
// Note: Không có @MappedSuperclass BaseFinancialEntity chung trong LAS
// Mỗi entity implement soft delete riêng (e.g., PeriodBalanceSnapshot có cancelled field)
// Pattern cancelled=true vẫn đúng, nhưng không có shared base class

// Ví dụ: PeriodBalanceSnapshot (entity thực trong LAS):
@Entity @Table(name = "LAS_PERIOD_BALANCE_SNAPSHOT")
public class PeriodBalanceSnapshot {
    // ...
    @Column private boolean cancelled = false;
    // Cancelled entities excluded from active calculations
    // but visible for audit trail
}
```

**Query convention:**

```java
// Luôn filter cancelled = false trong business logic:
List<LedgerEntry> activeItems = ledgerEntryRepo.findByAccountAndCancelledFalse(account);

// Nhưng audit queries có thể xem cả cancelled:
List<LedgerEntry> allItemsForAudit = ledgerEntryRepo.findByAccount(account);
```

### Idempotency: Xử lý Duplicate Requests

::::story
Khách hàng nhấn nút "Xác nhận thanh toán". App gửi request đến server. Network timeout - app không biết request đã được xử lý chưa. App tự động retry. Server nhận request thứ hai.

Kết quả mong muốn: payment được xử lý một lần.
Kết quả không mong muốn: payment bị deduct hai lần.
::::

**Khái niệm - Idempotency:**

:::key
**Idempotency** *(tính lũy đẳng)* là tính chất mà một operation có thể được thực hiện nhiều lần nhưng cho kết quả giống như thực hiện một lần.
:::

**Idempotency key pattern:**

```java
// illustrative pseudo-code — concept correct, implementation differs
// verified: verify-ch6-ch7-code.md
// Note: LAS KHÔNG dùng X-Idempotency-Key header
// LAS dùng sourceTxCode trong request body — field trên Transaction entity

// Actual pattern trong LAS:
// Client gửi:
// POST /api/transactions/confirm
// Body: { "accountNumber": "ACC123", "amount": 1696080, "sourceTxCode": "EXT-TX-12345" }

// LAS kiểm tra:
@Transactional
public ExecuteTransactionResult confirmTransaction(ConfirmationRequestTo transactionTo) {
    // Idempotency: check sourceTxCode via getAuthorizationFromConfirm()
    // nếu đã tồn tại → return kết quả cũ
    return confirmTransactionInternal(transactionTo, true);
    // checkForDuplicities=true → bật kiểm tra sourceTxCode
}
```

**Ứng dụng trong VLP:**

Mỗi transaction confirmation request từ external system (POS terminal, app) phải có `sourceTxCode` - unique identifier từ phía người gửi. LAS kiểm tra `sourceTxCode` trước khi xử lý - nếu đã tồn tại → return kết quả cũ, không process lại.

:::summary[Data Architecture]
Event sourcing: lưu events, derive state →
reconstruct balance tại bất kỳ thời điểm
Temporal data: valid_from/valid_to → trả lời
"giá trị tại thời điểm X là gì?"
Soft delete: cancelled = true, không DELETE →
audit trail intact, regulatory compliant
Idempotency: sourceTxCode → prevent double
processing, critical cho payment operations
:::

## 6.5 Technology Stack Decisions: Tại sao, không chỉ là gì

### Tại sao Spring Boot cho Financial Services

Kỹ sư Tuấn hỏi: "Tại sao Java/Spring Boot? Có nhiều framework mới hơn, nhanh hơn, trendy hơn - Golang, Node.js, FastAPI..."

**Lý do 1: Maturity và stability**

```text
Spring Boot đã tồn tại 20+ năm trong financial services.
Phần lớn issues về threading, transaction management, security
đã được discover và fixed bởi hàng triệu deployments trước.

Khi bạn gặp bug với BigDecimal rounding trong Spring Data JPA,
có 10,000 Stack Overflow answers và documented workarounds.

Với một framework 2 năm tuổi: you're on your own.
```

**Lý do 2: Ecosystem**

```text
Spring ecosystem cho financial services:
  Spring Security: OAuth2/OIDC, JWT, method-level security
  Spring Data JPA: Transaction management, temporal queries
  Spring Integration: Message channel patterns (ChargingGateway)
  Spring Batch: EOM batch processing (Job, Step, Chunk)
  Spring Cloud: Circuit breaker, config server, service discovery

Tất cả work well together, same configuration model,
same testing approach, same monitoring approach.
```

**Lý do 3: Enterprise Java ecosystem**

```text
JPA/Hibernate: battle-tested ORM, excellent PostgreSQL support
Jakarta EE: standardized APIs, not vendor lock-in
Maven/Gradle: mature build tooling với dependency management tốt
JVM: GC tuning, JIT optimization, excellent profiling tools
```

**Nhưng Spring Boot không phải là perfect:**

```text
Nhược điểm:
  - Startup time chậm (5-15 giây) → không phù hợp với serverless
  - Memory footprint cao → cần tune cho containers
  - Verbose configuration so với microframeworks
  - Học curve cao cho developer mới

Khi nào nên xem xét alternative:
  - Serverless functions → Quarkus (fast startup), Micronaut
  - High-throughput, low-latency I/O → Golang, Vert.x
  - Scripting/automation → Python
  - BFF layer → Node.js (non-blocking I/O, JSON-native)
```

VLP có sự pha trộn: Backend services = Java/Spring Boot; BFF = NestJS (TypeScript/Node.js). Mỗi lựa chọn phù hợp với use case của nó.

### Tại sao PostgreSQL

```text
PostgreSQL vs alternatives cho financial systems:

PostgreSQL chọn vì:
  ✓ ACID fully compliant (với stricter isolation levels)
  ✓ MVCC (Multi-Version Concurrency Control) — concurrent reads không block writes
  ✓ Excellent support cho complex queries, JSON, temporal data
  ✓ Row-level locking → fine-grained concurrency control
  ✓ Proven ở scale (nhiều banks dùng PostgreSQL)
  ✓ Open source nhưng enterprise-grade (không có vendor lock-in)
  ✓ Strong community, excellent tooling

MySQL: Ít features hơn cho complex financial queries
Oracle: Excellent nhưng very expensive, vendor lock-in
MongoDB/NoSQL: ACID transaction across collections phức tạp hơn
NewSQL (CockroachDB): Promising nhưng ít battle-tested hơn
```

**Financial-specific PostgreSQL features được dùng trong VLP:**

```sql
-- 1. Row-level locking cho account operations:
SELECT * FROM las_account WHERE id = X FOR UPDATE;
-- Lock row này, transaction khác phải chờ

-- 2. Pessimistic locking (AccountLockGuard, timeout 1 phút):
-- // illustrative — LAS không dùng SERIALIZABLE isolation level
-- Lock account record ngay khi nhận request → release sau commit

-- 3. Advisory locks cho long-running batch operations:
SELECT pg_advisory_lock(account_id);
-- Application-level lock, không block other transactions

-- 4. Partitioning cho large tables:
CREATE TABLE las_ledger_entry_2024
    PARTITION OF las_ledger_entry
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
-- 100M+ rows được partition theo year để query nhanh hơn
```

### Tại sao Kafka và RabbitMQ: Không phải một trong hai

Nhiều người hỏi: "Tại sao dùng cả Kafka và RabbitMQ? Chọn một đi."

Câu trả lời: chúng giải quyết các vấn đề khác nhau.

```text
RabbitMQ (AMQP) trong VLP:

Use cases:
  LAS → STS: Statement generation requests
  LOS → LAS: Origination completion notification
  AOS → LOS: Supplement creation results

Đặc điểm phù hợp:
  → Task queue: message được process bởi một consumer
  → Request acknowledged khi processed successfully
  → Message không cần lưu lâu (7-14 ngày là đủ)
  → Complex routing: exchanges, bindings, dead-letter queues

─────────────────────────────────────────────────────

Kafka trong VLP:

Use cases:
  LAS → DRG: Transaction events (debt catalogue sync)
  ADR → SRT, LOS: Application lifecycle events
  QST → LOS: Quote state changes

Đặc điểm phù hợp:
  → Event log: multiple consumers đọc cùng stream
  → Consumer replay: DRG có thể reset và reprocess events
  → High throughput: triệu events/ngày
  → Long retention: analytics cần data lịch sử
  → Partitioning: parallel processing theo account_id
```

**Quy tắc chọn:**

```text
Chọn RabbitMQ khi:
  "Tôi cần task này được done exactly once bởi một worker"

Chọn Kafka khi:
  "Tôi cần nhiều consumers đọc event stream này,
   và có thể cần replay lại events từ quá khứ"
```

### Tại sao Keycloak

```text
Keycloak 26.2.0 được chọn vì:

OAuth2/OIDC standard:
  → Industry standard, không vendor lock-in
  → Tất cả services dùng same token format → consistent security model

Fine-grained authorization:
  → Role-based: ROLE_ADMIN, ROLE_TELLER, ROLE_API_CONSUMER
  → Resource-based: "User X có thể access Account Y không?"
  → Policy-based: "Chỉ trong giờ hành chính"

Audit trail cho security:
  → Mọi login, token issue, token refresh được log
  → Suspicious login patterns có thể được detect

Local development support:
  → Keycloak Docker image cho local dev
  → "Bypass" mode cho integration testing (--spring.security.provider=none)
  → Không phải production config leak vào dev environment
```

:::summary[Technology Stack Decisions]
Spring Boot: maturity, ecosystem, enterprise Java
→ Nhược điểm: startup slow, memory heavy
PostgreSQL: ACID, MVCC, row-level locking,
partitioning → phù hợp financial workloads
RabbitMQ: task queues (one consumer per message)
Kafka: event log (multiple consumers, replay)
Keycloak: OAuth2/OIDC standard, fine-grained authz
Mỗi lựa chọn có lý do cụ thể - không phải trend
:::

## Tóm tắt chương 6

```text
Từ câu hỏi của Kỹ sư Tuấn ngày đầu đi làm:
"Tại sao phức tạp đến vậy?"

Câu trả lời sau khi đọc xong chương này:

Correctness:
  Transaction thực → mọi thứ phải đúng, không chấp nhận eventual consistency
  → ACID, pessimistic locking (AccountLockGuard, 1-min timeout)

Accountability:
  Audit trail không phải là optional → immutable records, temporal data, soft delete
  → Có thể trả lời "balance là bao nhiêu vào ngày X lúc Y giờ"

Compliance:
  Regulatory là first-class design constraint
  → CIS tách riêng cho PII, pseudonymization, rate cap validation

Resilience:
  Financial services must run 24/7
  → Circuit breaker, saga pattern, idempotency, event sourcing

Scale:
  Triệu tài khoản, hàng nghìn transactions/giây
  → Microservices với bounded contexts, Kafka cho high-throughput events

Mỗi quyết định thiết kế đều có lý do kinh tế, pháp lý, hoặc operational.
Không phải over-engineering — đây là minimum viable complexity
để vận hành một hệ thống tài chính đúng đắn.

Deployment Reality (VLP):
  On-premise Kubernetes (không phải cloud)
  GitOps: ArgoCD + Helm (sync waves: ConfigMap → DB migration → App → HPA)
  Secrets: HashiCorp Vault với Kubernetes auth
  Autoscaling: KEDA (Prometheus metrics + cron-based)
  Monitoring: Prometheus + Grafana + OpenTelemetry distributed tracing
  5 PostgreSQL clusters (PgBouncer port 6432):
    LEDGER cluster (`vlp_ledger_a1p`): LAS, LPS, RVS
    CORE cluster (`vlp_core_a1p`): ADR, CTM, CTS, RDS, DRG, DMS, CIS, **PTY**, PDC, QST, AOS, **TKT** (12 modules)
    CNTR cluster (`vlp_cntr_a1p`): OFR
    STATEMENT cluster (`vlp_statement_a1p`): STS
    Local dev: `testdb` (all modules)
  Stateless modules (no DB): LOS, SRT, DSA (read-only cache)
```

## Câu hỏi tự kiểm tra

**Loại 1 - Nhớ lại:**
1. Kể ba sự khác biệt chính giữa financial systems và normal enterprise systems.
2. Soft delete là gì? Tại sao financial systems không dùng hard delete?
3. RabbitMQ và Kafka khác nhau ở điểm cơ bản nào? Cho ví dụ use case phù hợp với mỗi loại.
4. Idempotency key pattern là gì và tại sao cần thiết trong payment systems?

**Loại 2 - Hiểu:**
5. Tại sao "correctness over availability" là nguyên tắc quan trọng nhất trong financial systems? Cho một ví dụ cụ thể về hậu quả nếu vi phạm nguyên tắc này.
6. Distributed monolith là gì? Kể 3 dấu hiệu nhận biết và giải thích tại sao nó là worst of both worlds.
7. Saga pattern giải quyết vấn đề gì trong microservices? Tại sao compensating transactions trong financial domain phức tạp hơn trong e-commerce?
8. Temporal data pattern phục vụ yêu cầu gì của audit và compliance?

**Loại 3 - Áp dụng:**
9. Công ty fintech mới cần implement payment confirmation API. Thiết kế:
   - (a) Database schema để support idempotency
   - (b) Sequence diagram từ khi nhận request đến khi response
   - (c) Error handling: network timeout, duplicate request, insufficient balance
   - (d) Audit trail: những gì cần được logged

10. Team đề xuất hai architecture cho statement generation:
    - Option A: LAS gọi STS via REST synchronously trong transaction confirmation
    - Option B: LAS publish event → STS subscribes và generates statement async

    Phân tích từng option về: correctness, performance, resilience, complexity.
    Bạn chọn option nào? Với điều kiện gì?

**Loại 4 - Phân tích:**
11. VLP đang xem xét migrate từ PostgreSQL sang một distributed NewSQL database (như CockroachDB) để có global scale. Phân tích:
    - (a) Benefits mà NewSQL cung cấp
    - (b) Risks cụ thể cho financial workloads
    - (c) Những features PostgreSQL đang dùng có tương đương trong NewSQL không?
    - (d) Migration strategy và rollback plan

12. Một bug được phát hiện: LAS đang đôi khi ghi duplicate transactions khi network retry xảy ra. Investigate:
    - (a) Root cause analysis: tại sao idempotency check không work?
    - (b) Immediate mitigation: làm gì ngay bây giờ?
    - (c) Permanent fix: thay đổi architecture như thế nào?
    - (d) Detection: làm sao phát hiện nếu bug này đã xảy ra trong quá khứ?

## Bài tập áp dụng

**Bài 1 - Architecture Review:**

Một startup fintech đang launch credit card product với architecture sau:
- Monolithic Spring Boot app, single PostgreSQL database
- Synchronous REST calls cho tất cả operations
- No event streaming
- Soft delete implemented
- No audit trail ngoài application logs

Họ dự kiến scale lên 1 triệu users trong 2 năm.

Yêu cầu:
- (a) Identify 5 vấn đề kiến trúc nghiêm trọng nhất
- (b) Ưu tiên chúng theo mức độ risk (critical/high/medium)
- (c) Đề xuất migration path không downtime cho vấn đề critical nhất
- (d) Estimate technical debt và timeline để address mỗi vấn đề

**Bài 2 - Distributed Transaction Design:**

Thiết kế Saga cho origination flow:

```text
Các bước cần complete:
1. CIS: Create customer profile (PII data)
2. ADR: Store application data
3. Credit Scoring: Run scoring model → get score
4. LPS: Calculate offer (dựa trên score)
5. LAS: Create account (deactivated)
6. LOS: Mark origination complete → notify customer
```

Yêu cầu:
- (a) Choreography-based saga: design event flow
- (b) Orchestration-based saga: design LOS orchestrator logic
- (c) Failure scenarios: step 3 fail, step 5 fail - compensating transactions
- (d) Tại sao step 1 (CIS) khó compensate hơn step 4 (LPS)?
- (e) Chọn choreography hay orchestration cho use case này? Justify.

**Bài 3 - Audit Trail Implementation:**

Kỹ sư Tuấn cần implement audit trail system cho LAS module.

Requirements:
- Track: account status changes, credit limit changes, transaction cancellations
- Who: user/system doing the action
- When: timestamp với timezone
- Why: reason code + optional free text
- What changed: old value → new value
- Retention: 10 năm
- Query: "Lịch sử thay đổi credit limit của account X"

Yêu cầu:
- (a) Thiết kế database schema cho audit trail
- (b) Implementation approach: database triggers vs application-level vs event sourcing
- (c) Trade-offs của mỗi approach trong financial context
- (d) Performance implications: audit trail không được ảnh hưởng >5% latency của operation chính
- (e) Làm thế nào để verify audit trail không bị tampered với?

## Đọc thêm

**Distributed Systems:**
- Kleppmann, M. (2017). *Designing Data-Intensive Applications.* O'Reilly Media. - Chapters 7-9 về transactions và distributed data. Required reading cho bất kỳ ai build financial systems.

**Domain-Driven Design:**
- Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software.* Addison-Wesley. - Khái niệm bounded context, aggregate, domain events - foundation của microservices design.

**Financial Systems Specifically:**
- Helberg, C. (2022). *Software Architecture for Financial Systems.* Apress. - Một trong số ít sách dedicated cho intersection của software architecture và financial domain.

*Chương 7 sẽ đi sâu vào quy trình origination - từ khi khách hàng nộp đơn đến khi account được activate. Chúng ta sẽ trace toàn bộ flow qua LOS orchestrator, QCE pricing engine, credit scoring pipeline, và cuối cùng là LAS account creation. Sau chương 6, bạn đã có đủ nền tảng kiến trúc để hiểu tại sao từng quyết định thiết kế trong origination flow được đưa ra như vậy.*
