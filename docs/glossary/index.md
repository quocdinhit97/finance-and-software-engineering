---
title: "Thuật ngữ"
sidebar_label: "Thuật ngữ"
sidebar_position: 1
subtitle: "Tiếng Việt - English"
reading_time: 17
source_file: "phu-luc-b-glossary.md"
editorial_status: "mechanical"
---

> *Mỗi thuật ngữ: định nghĩa ngắn gọn, context sử dụng trong ngành, và chương xuất hiện trong sách.*

## A

### Account Management

*Quản lý tài khoản*

Module/hệ thống quản lý vòng đời tài khoản sau khi khoản vay được giải ngân: theo dõi số dư, tính lãi hàng ngày, xử lý thanh toán, tạo sao kê. Trong VLP: module LAS (vlp-las).

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

### Adverse Selection

*Lựa chọn bất lợi*

Hiện tượng thị trường khi sản phẩm thu hút nhiều hơn tỷ lệ bình thường khách hàng có rủi ro cao. Xảy ra khi pricing không phân biệt được risk - high-risk customers tìm đến sản phẩm cheap nhất, low-risk customers rời đi.

Xuất hiện trong: [Chương 1](/docs/foundations/ch01-credit-economics), [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Affordability Assessment

*Đánh giá khả năng chi trả*

Quy trình xác định liệu khách hàng có thực sự có khả năng trả nợ hay không - khác với eligibility (đủ điều kiện). Bao gồm income verification, expense analysis, stress testing.

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Alternative Data

*Dữ liệu thay thế*

Dữ liệu không phải từ credit bureau truyền thống: telco data, eWallet transactions, utility payment history, behavioral data. Dùng để score thin-file borrowers.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Amortization

*Khấu hao/Trả dần*

Quá trình trả dần nợ gốc theo thời gian. Trong installment loan: mỗi kỳ trả một phần gốc + lãi. Early payments: tỷ lệ lãi cao hơn; late payments: tỷ lệ gốc cao hơn.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

### APR

*Annual Percentage Rate - Lãi suất phần trăm năm*

Lãi suất thực sự hàng năm bao gồm TẤT CẢ chi phí: lãi suất danh nghĩa + phí origination + phí hàng tháng + bảo hiểm bắt buộc. Phản ánh chi phí thực của khoản vay. Regulatory yêu cầu hiển thị APR bên cạnh lãi suất danh nghĩa. Cách tính dùng trong sách: APR = IRR theo tháng × 12, không ghép lãi; chỉ số có ghép lãi là EIR.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending), [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Auto-debit

*Trích nợ tự động*

Cơ chế tự động trích tiền từ tài khoản ngân hàng của khách hàng vào ngày đến hạn. Default-on design: opt-in rate 82% vs opt-out rate 45%.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## B

### β-δ Model

*Mô hình chiết khấu hyperbolic*

Model tâm lý học mô tả present bias: người ta overweight lợi ích/chi phí hiện tại so với tương lai. β < 1 là present bias factor; δ < 1 là standard time preference.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Banking-as-a-Service

*BaaS - Ngân hàng như dịch vụ*

Mô hình cung cấp hạ tầng tài chính (licenses, core banking, compliance) qua API cho third parties. Cho phép fintech xây sản phẩm tài chính mà không cần banking license.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Behavioral Score

*Điểm hành vi*

Credit score được tính từ behavioral data (app usage, payment patterns, telco) thay vì chỉ bureau data. Đặc biệt hữu ích cho thin-file customers.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring), [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Billing Cycle

*Chu kỳ thanh toán*

Vòng lặp hàng tháng: từ khi lãi phát sinh → statement generation → payment due → payment received → reconciliation → DPD tracking nếu không thanh toán.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

### BNPL

*Buy Now Pay Later - Mua trước trả sau*

Hình thức tín dụng cho phép mua ngay, trả góp sau - thường trong 3-6 kỳ, thường 0% lãi danh nghĩa. Revenue model: merchant discount fee.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Bureau

*Credit Bureau - Công ty thông tin tín dụng*

Tổ chức thu thập và cung cấp lịch sử tín dụng. Vietnam: CIC (Trung tâm Thông tin Tín dụng Quốc gia). International: Experian, TransUnion, Equifax.

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 11](/docs/intelligence/ch11-credit-scoring).

## C

### Calibration

*Hiệu chỉnh model*

Kiểm tra xem predicted probability có khớp với actual outcome không. "Score 420 → predicted PD 2% → actual PD 2.1% → well calibrated."

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### CAC

*Customer Acquisition Cost - Chi phí thu hút khách hàng*

Tổng chi phí để có được một khách hàng mới: marketing + sales + processing. CAC ảnh hưởng đến minimum loan size viable.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### CLV

*Customer Lifetime Value - Giá trị vòng đời khách hàng*

Tổng doanh thu/lợi nhuận ròng từ một khách hàng trong toàn bộ mối quan hệ. CLV = margin per loan × number of loans × retention rate / (1 - retention rate).

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Cognitive Load

*Tải nhận thức*

Lượng mental effort cần để xử lý thông tin và ra quyết định. High cognitive load → System 1 thinking → impaired financial decisions.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Collections

*Thu hồi nợ*

Quy trình liên hệ, thương lượng, và thu hồi nợ từ khách hàng quá hạn. Bao gồm: early intervention, restructuring, legal action.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Commitment Device

*Thiết bị cam kết*

Cơ chế cho phép người ta voluntarily restrict future choices để giữ lời hứa với chính mình. Ví dụ: savings lock, bonus paydown commitment.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Concentration Risk

*Rủi ro tập trung*

Rủi ro khi portfolio quá phụ thuộc vào một sector, employer, hay geography. Khi sector đó bị ảnh hưởng, toàn bộ portfolio bị ảnh hưởng đồng thời.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio), [Chương 16](/docs/future/ch16-timeless-principles).

### ContractService

*Dịch vụ hợp đồng*

Entity trong LAS kết nối Account với tariff code - xác định lãi suất và phí áp dụng cho tài khoản đó.

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

### Cost of Funds

*Chi phí vốn*

Lãi suất mà lender phải trả để huy động vốn cho vay. Bao gồm: bank borrowing rate, bond yield, equity opportunity cost. Thường 8-10% tại Vietnam.

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Credit Score

*Điểm tín dụng*

Con số tổng hợp phản ánh mức độ rủi ro tín dụng của một khách hàng. Tính từ: lịch sử thanh toán, dư nợ, thời gian có tín dụng, loại tín dụng, inquiries gần đây.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Credit Utilization

*Tỷ lệ sử dụng tín dụng*

Balance / Credit limit. Tỷ lệ cao → tín hiệu stress tài chính. Thành phần trong FICO score.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## D

### 30/360

*D30_360 Day-Count Convention*

Quy ước tính lãi dùng trong VLP: lãi hàng ngày = P × r / 360, mọi tháng tính là 30 ngày. Khác với Actual/365 (dùng ngày thực tế). Ảnh hưởng đến: tháng có 31 ngày (30/360 thấp hơn 1/31), tháng Hai (30/360 cao hơn nếu 28 ngày). Được cấu hình qua `AnnualRateDayCount.D30_360` trong tariff.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending), [Chương 9](/docs/system/ch09-billing-cycle).

### DSA

*Data Source Aggregator*

Service tổng hợp dữ liệu từ nhiều hệ thống nội bộ thành XML format cho document generation. **KHÔNG phải Disbursement**. LOS calls DSA để fetch applicant data cho contract document. Plugin-based architecture với các providers (AgreementDataSourceProvider, ContractDataSourceProvider...).

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### Dark Pattern

*Mẫu thiết kế tối*

UX design có chủ đích manipulate người dùng ra quyết định không phải best interest của họ. Ví dụ: fake urgency timers, hidden fees, impossible-to-find opt-out.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Data Drift

*Trôi dạt dữ liệu*

Thay đổi trong phân phối input features theo thời gian. PSI > 0.25 → significant drift → model may be invalid.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Debt Stacking

*Chồng nợ*

Khi khách hàng có nhiều BNPL/loan accounts từ nhiều lenders, mỗi lender thấy partial picture. Risk: aggregate DTI cao hơn bất kỳ lender nào biết.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Default

*Vỡ nợ*

Thường định nghĩa là DPD 90+ (bất kỳ lúc nào trong 24 tháng). Có thể stricter (write-off) hoặc looser (DPD 30+) tùy mục đích.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Delinquency

*Quá hạn*

Trạng thái khi khoản vay chưa đến mức default nhưng đã quá hạn thanh toán. Thường: DPD 1-89.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Disparate Impact

*Tác động không cân xứng*

Khi một policy trung lập về mặt hình thức nhưng ảnh hưởng không cân xứng đến nhóm được bảo vệ. Xảy ra ngay cả khi không có discriminatory intent.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### DPD

*Days Past Due - Số ngày quá hạn*

Số ngày kể từ ngày đến hạn mà payment chưa được nhận. DPD 0 = đúng hạn. DPD 30 = 30 ngày quá hạn. Key metric cho delinquency tracking.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

### DTI

*Debt-to-Income Ratio - Tỷ lệ nợ/thu nhập*

Tổng nghĩa vụ nợ hàng tháng / Thu nhập hàng tháng. Regulatory guideline Vietnam: DTI ≤ 50% (varies by product).

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Dual-Process Theory

*Lý thuyết hai quá trình*

Kahneman's framework: System 1 (fast, automatic, emotional) vs System 2 (slow, deliberate, logical). Financial decisions often dominated by System 1.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## E

### EAD

*Exposure at Default - Dư nợ tại thời điểm vỡ nợ*

Số tiền còn outstanding khi khách hàng default. Thường ≈ outstanding principal.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Early Warning System

*Hệ thống cảnh báo sớm*

Hệ thống phát hiện khách hàng có nguy cơ mất khả năng trả nợ trước khi DPD xảy ra, để can thiệp sớm.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections), [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Effective Interest Rate

*Lãi suất hiệu dụng*

Xem APR.

### EL

*Expected Loss - Tổn thất kỳ vọng*

EL = PD × LGD × EAD. Chi phí rủi ro bình quân được tính vào giá sản phẩm. Không phải rủi ro - là chi phí đã được định giá.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Embedded Finance

*Tài chính nhúng*

Tích hợp sản phẩm tài chính vào non-financial platforms. Customer tiếp cận credit ngay trong context dùng (checkout, booking, etc.) không cần rời sang app tài chính.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### EMI

*Equated Monthly Installment - Kỳ trả góp hàng tháng đều*

Khoản tiền cố định trả mỗi tháng, bao gồm một phần gốc và một phần lãi. Tính bằng công thức: PMT = P × r(1+r)^n / ((1+r)^n - 1).

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

### EOM

*End of Month - Cuối tháng*

Batch processing cuối tháng: tính lãi tích lũy, tạo sao kê, cập nhật số dư, trigger DPD tracking.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

## F

### Feature Drift

*Trôi dạt đặc trưng*

Một loại data drift cụ thể: phân phối của input features cho model thay đổi theo thời gian. Measured bằng PSI.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Feature Engineering

*Kỹ thuật đặc trưng*

Quá trình chuyển đổi raw data thành features phù hợp cho ML model. Ví dụ: WOE transformation, ratios, time windows.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Feature Store

*Kho đặc trưng*

Hạ tầng lưu trữ và phục vụ features cho ML models: centralized, versioned, consistent giữa training và serving.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### FICO Score

Credit scoring model phổ biến nhất của Mỹ (Fair Isaac Corporation), thang 300-850. Thành phần: payment history 35%, amounts owed 30%, credit history length 15%, credit mix 10%, new credit 10%.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Fraud

*Gian lận*

Cố ý cung cấp thông tin sai để lấy tín dụng. Loại: application fraud, identity theft, synthetic identity, velocity fraud.

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

## G

### Gini Coefficient

*Hệ số Gini*

Thước đo discriminatory power của credit model: Gini = 2 × AUROC - 1. Thang 0-1. Industry benchmark: > 0.45 acceptable, > 0.60 good.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Grace Period

*Thời gian ân hạn*

Thời gian sau due date mà payment vẫn được chấp nhận mà không tính DPD hay late fee. Thường 3-7 ngày tại Vietnam.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

## H

### Hallucination

*Ảo giác AI*

Khi LLM tạo ra nội dung sai, không có trong training data, nhưng nghe có vẻ thuyết phục. Đặc biệt nguy hiểm trong finance (sai số cụ thể, sai policy). RAG architecture giảm thiểu.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Hardship Program

*Chương trình hỗ trợ khó khăn*

Tập hợp các giải pháp cho khách hàng gặp khó khăn tài chính: payment holiday, tenor extension, rate reduction. Mục tiêu: cure và giữ khách hàng thay vì collect.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Hyperbolic Discounting

*Chiết khấu hyperbolic*

Xem β-δ Model. Xu hướng overvalue lợi ích/chi phí ngắn hạn so với dài hạn. Giải thích tại sao người ta "luôn sẽ tiết kiệm từ tháng sau."

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## I

### Idempotency

*Tính không thay đổi khi lặp*

Property của operation: thực hiện 1 lần hay N lần đều cho cùng kết quả. Critical cho payment APIs và batch jobs để prevent double-charging.

Xuất hiện trong: [Chương 16](/docs/future/ch16-timeless-principles).

### IFRS 9

*International Financial Reporting Standard 9*

Chuẩn mực kế toán quốc tế cho financial instruments. Yêu cầu provision theo 3 stages (ECL model): Stage 1 (performing), Stage 2 (credit deteriorated), Stage 3 (defaulted).

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Information Value

*Giá trị thông tin - IV*

Thước đo predictive power của một feature trong credit scoring. IV < 0.02: useless; IV 0.02-0.10: weak; IV 0.10-0.30: medium; IV > 0.30: strong.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### InstalmentSummary

*Tiêu đề kỳ trả góp*

Denormalized summary entity trong LAS, tổng hợp thông tin về instalment plan của một account. Phải được refresh sau khi tất cả child instalments được persist.

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

### IRR

*Internal Rate of Return - Tỷ suất hoàn vốn nội bộ*

Lãi suất chiết khấu làm NPV của tất cả cash flows = 0. Dùng để tính APR thực sự từ tất cả payments và fees.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

## J

### Judgmental Lending

*Cho vay theo phán đoán*

Mô hình cho vay truyền thống dựa trên phán đoán của loan officer. Không consistent, không scalable, thiên kiến tiềm ẩn. Đã được thay thế bởi statistical scoring.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## K

### KS Statistic

*Kolmogorov-Smirnov*

Thước đo tại score threshold nào model phân biệt tốt nhất giữa good và bad customers. KS = max(Cum%Good - Cum%Bad). KS > 30%: good.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## L

### LGD

*Loss Given Default - Tỷ lệ tổn thất khi vỡ nợ*

Tỷ lệ EAD mà lender thực sự mất khi customer default, sau recovery. LGD = 1 - Recovery Rate. Unsecured consumer loans: 55-70%.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### LLM

*Large Language Model*

AI model được train trên lượng lớn text data, có khả năng hiểu và generate text. GPT-4, Claude, Gemini. Dùng trong lending: document processing, customer service, knowledge management.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Loss Aversion

*Ám ảnh mất mát*

Tâm lý học: mất mát gây đau khổ nhiều hơn lợi ích cùng giá trị gây vui vẻ. λ ≈ 2.25: mất 100K tệ như được 225K tốt. Dùng trong payment reminder design.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## M

### Mental Accounting

*Kế toán tâm lý*

Xu hướng treat tiền khác nhau tùy vào "bucket" trong tâm trí (lương, thưởng, tiết kiệm). Bonus money thường được spend nhanh hơn lương tương đương.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Model Risk

*Rủi ro model*

Rủi ro từ việc sử dụng model sai hoặc sử dụng model đúng không đúng cách. Bao gồm: model error, implementation error, misuse. Quản lý bởi MRM framework.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring), [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Moral Hazard

*Rủi ro đạo đức*

Khi có bảo hiểm/safety net, người ta có xu hướng take more risk. Trong lending: lender với deposit guarantee có thể take excessive risk.

Xuất hiện trong: [Chương 1](/docs/foundations/ch01-credit-economics).

## N

### Net Interest Margin

*NIM - Biên lãi suất ròng*

Chênh lệch giữa lãi suất thu từ loans và lãi suất trả cho vốn huy động. Thước đo cơ bản của lender profitability.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### NPL

*Non-Performing Loan - Nợ xấu*

Khoản vay DPD 90+ (theo định nghĩa Vietnam NHNN). NPL ratio = NPL / Total outstanding. Regulatory threshold: ≤ 3% cho ngân hàng.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Nudge

*Thúc đẩy hành vi*

Can thiệp design nhỏ không cưỡng ép nhưng influence behavior theo hướng mong muốn. Default options là nudge mạnh nhất. Thaler & Sunstein, 2008.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## O

### Open Banking

*Ngân hàng mở*

Framework cho phép khách hàng share financial data với third parties qua API (với consent). Enables better credit assessment, competition, personalization.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Optimism Bias

*Thiên kiến lạc quan*

Xu hướng overestimate probability of positive outcomes và underestimate negative outcomes cho chính mình. Trong lending: borrowers underestimate risk of default.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### LOS

*Origination Router & Processor*

Service stateless orchestrator của origination flow. Nhận application → route qua fraud check, scoring, pricing → create account.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

## P

### Payment Holiday

*Nghỉ trả nợ*

Cho phép khách hàng dừng thanh toán trong 1-3 tháng. Lãi vẫn tiếp tục tích lũy trong thời gian này, được cộng vào dư nợ.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### PD

*Probability of Default - Xác suất vỡ nợ*

Xác suất một khách hàng sẽ default trong một window nhất định. PD × LGD × EAD = EL.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio), [Chương 11](/docs/intelligence/ch11-credit-scoring).

### PMT

*Payment Amount*

Số tiền trả mỗi kỳ. Công thức: PMT = P × r(1+r)^n / ((1+r)^n - 1). Trong hầu hết sản phẩm trả góp: PMT cố định.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

### Present Bias

*Thiên kiến hiện tại*

Xem β-δ Model. Xu hướng overvalue lợi ích/chi phí ngay lập tức so với tương lai. Dẫn đến over-borrowing và under-saving.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Propensity Model

*Mô hình xu hướng*

ML model predict khả năng một customer sẽ "convert" (accept offer, buy product). Dùng trong marketing targeting.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Prospect Theory

*Lý thuyết triển vọng*

Kahneman & Tversky (1979): người ta evaluate outcomes theo changes from reference point, không theo absolute values. Loss aversion là một component.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### PSI

*Population Stability Index*

Thước đo sự thay đổi trong phân phối dữ liệu. PSI < 0.10: stable; PSI 0.10-0.25: moderate shift; PSI > 0.25: major shift → model review needed.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## R

### RAG

*Retrieval-Augmented Generation*

Kiến trúc AI kết hợp LLM với information retrieval: trước khi answer, retrieve relevant documents → LLM answers from retrieved content. Giảm hallucination, tăng accuracy.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Risk-Based Pricing

*Định giá dựa trên rủi ro*

Pricing methodology: khách hàng rủi ro cao hơn trả lãi suất cao hơn. Phản ánh EL trong giá. Trái với "one-size-fits-all" pricing.

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### ROE

*Return on Equity - Tỷ suất lợi nhuận trên vốn chủ sở hữu*

Lợi nhuận / Vốn chủ sở hữu. Target ROE ảnh hưởng đến required spread trong pricing.

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### CurrentBalance

*Số dư luân chuyển*

Entity trong LAS theo dõi số dư hiện tại theo từng loại (principal, interest, fee, penalty).

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

## S

### SRT

*Service Router*

Stateless routing service trong VLP. Nhận LoanProcessingRequest từ LOS và route đến các backends (LAS, CTM, AOS, CTS, PDC, ADR, QST, LBS, INSR) qua 9 FeignClient connectors. Không có database - pure orchestration. Resilience4j circuit breaker trên tất cả connectors.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### QST

*Quote Store*

Module lưu trữ và quản lý vòng đời sales quotes - KHÔNG phải Scoring Queue Service. Stores quotes được tạo bởi QCE. Entities: SalesQuote với cascading collections (amountArrangements, interestArrangements, feeArrangements...). LOS calls QST để retrieve quotes; QST publishes Kafka CloudEvents khi quotes thay đổi.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### AOS

*Supplement*

Module quản lý supplement - add-on products (insurance, warranty, payment protection) gắn vào loan contract. Lifecycle: INITIAL → REGISTERED → ACTIVE → TERMINATED. Activated khi LAS fires "FIRST_PRINCIPAL_TX_CHARGED" event.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### Scorecard

*Bảng điểm*

Traditional credit scoring model: logistic regression on WOE-transformed features → converted to integer points. Interpretable, regulatory-friendly.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### SHAP

*SHapley Additive exPlanations*

Framework giải thích ML model predictions: đo contribution của từng feature vào prediction cụ thể. Cho phép generate actionable rejection reasons.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Stress Test

*Kiểm tra căng thẳng*

Đánh giá portfolio/model performance trong adverse scenarios: recession, unemployment spike, interest rate spike. Required bởi regulators.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio), [Chương 16](/docs/future/ch16-timeless-principles).

### Sub-prime

*Dưới chuẩn*

Segment khách hàng với credit score thấp hơn prime threshold. Higher risk → higher rate → lower approval limit.

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

## T

### Tail Risk

*Rủi ro đuôi phân phối*

Rủi ro của rare, extreme events. Normal risk management optimizes for average; tail risk management focuses on survival in worst cases.

Xuất hiện trong: [Chương 16](/docs/future/ch16-timeless-principles).

### Tariff-Driven Design

*Thiết kế theo thuế suất*

Kiến trúc trong đó business rules (lãi suất, phí, giới hạn) được lưu trong database config, không hardcode vào code. Cho phép thay đổi nhanh mà không cần deploy.

Xuất hiện trong: [Chương 3](/docs/products/ch03-product-design), [Chương 16](/docs/future/ch16-timeless-principles).

### Thin-File

*Hồ sơ mỏng*

Khách hàng với ít hoặc không có credit history. Không thể score bằng traditional bureau data. Cần alternative data hoặc behavioral scoring.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring), [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Time Value of Money

*Giá trị thời gian của tiền*

Nguyên tắc: 1 đồng hôm nay có giá trị hơn 1 đồng tương lai, vì có thể đầu tư sinh lãi. Nền tảng của NPV, IRR, annuity calculations.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

## U

### UL

*Unexpected Loss - Tổn thất không kỳ vọng*

Biến động thực tế của loss so với EL. UL đòi hỏi capital buffer. EL được cover bởi pricing; UL được cover bởi capital.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### UNREACHABLE_FUTURE_DATE

Sentinel date values dùng cho "open-ended" records. Hai variants trong VLP:
- `AccountParameter.validTo = 3000-01-01` - `DateUtil.UNREACHABLE_FUTURE_DATE` = 3000-01-01; NULL trong DB → Java convert qua `NullDateToFarFutureConverter`
- `AccountService.endDate = 3000-01-01` - explicit default trong entity
- `PostingUnit.firstPrescribeDate = 3333-01-01` - sentinel riêng cho "chưa prescribe" (IP allocations)

Note: 3000-01-01 vs 3333-01-01 là hai sentinel khác nhau cho hai purposes khác nhau.

Cho phép simple date range queries (`WHERE validTo >= :today`) thay vì IS NULL checks. *→ Ch.8*

## V

### Velocity Fraud

*Gian lận vận tốc*

Fraud attack: nộp nhiều đơn vay đến nhiều lenders trong thời gian ngắn, trước khi lenders biết nhau's approvals. Detection: inquiry velocity, shared negative list.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Vintage Analysis

*Phân tích theo đợt*

Phân tích performance của các cohort khoản vay theo thời gian origination. So sánh 6-month DPD rate của cohort January vs February vs March. Phát hiện model drift và portfolio quality trends.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

## W

### WOE

*Weight of Evidence - Trọng số bằng chứng*

Transformation cho credit scoring features: WOE_i = ln(%Default_i / %Good_i). Negative = predominantly good customers; positive = predominantly bad.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Write-off

*Xóa nợ*

Quyết định kế toán ghi nhận khoản vay là uncollectible và remove khỏi balance sheet. Thường sau DPD 180+. Write-off ≠ forgiveness; collection attempts may continue.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

## X

### XGBoost

*eXtreme Gradient Boosting*

Gradient boosting ML framework phổ biến nhất cho tabular data. Consistently achieves highest accuracy on credit scoring datasets. Fast, handles missing values natively.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## Z

### Zeebe

BPMN workflow engine (Camunda). Trong VLP: **chỉ dùng cho scoring workflow** (step `chooseOffer`, profile `zeebe-integration`). KHÔNG phải main origination orchestrator - LOS dùng controller-driven async với Infinispan cache. Scoring result: POSITIVE/NEGATIVE callback về LOS qua RabbitMQ.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### Infinispan

Distributed in-memory cache. Trong VLP: LOS dùng Infinispan embedded cache để lưu workflow state giữa các async steps. 7 named caches: `zeebeChooseOfferCache`, `chooseOfferCache`, `loanPurposeCache`, `generateAgreementCache`, `signAgreementCache`, `rejectSupplementCache`, `cancelSupplementCache`.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination), [Chương 15](/docs/future/ch15-ai-future-of-lending).

*Phụ lục B - Glossary. Bổ sung khi có thuật ngữ mới xuất hiện trong tài liệu.*
