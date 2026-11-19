---
title: "Thuật ngữ"
sidebar_label: "Thuật ngữ"
sidebar_position: 1
subtitle: "Tiếng Việt - English"
reading_time: 17
description: "Từ điển thuật ngữ Anh - Việt của cuốn sách: tài chính tín dụng, quản trị rủi ro, kinh tế học hành vi, ML và các module của VLP, mỗi mục kèm chương giải thích."
source_file: "phu-luc-b-glossary.md"
editorial_status: "edited"
---

Mỗi thuật ngữ gồm tên tiếng Anh, tên tiếng Việt, một định nghĩa ngắn, và các chương giải thích chi tiết. Thuật ngữ được xếp theo tên tiếng Anh, vì đó là tên người đọc thường gặp nhất trong tài liệu và mã nguồn.

## A

### Account Management

*Quản lý tài khoản*

Phần hệ thống quản lý vòng đời tài khoản sau khi khoản vay được giải ngân: theo dõi số dư, tính lãi, xử lý thanh toán, tạo sao kê. Trong VLP là module LAS.

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

### Adverse Selection

*Lựa chọn bất lợi*

Hiện tượng một sản phẩm thu hút tỷ lệ khách hàng rủi ro cao hơn bình thường. Xảy ra khi giá không phân biệt được rủi ro: khách rủi ro cao tìm đến vì giá rẻ so với rủi ro của họ, khách rủi ro thấp bỏ đi vì giá đắt so với rủi ro của họ.

Xuất hiện trong: [Chương 1](/docs/foundations/ch01-credit-economics), [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Affordability Assessment

*Đánh giá khả năng chi trả*

Quy trình xác định khách hàng có thực sự trả được khoản vay mà không gặp khó khăn quá mức hay không, khác với kiểm tra đủ điều kiện (eligibility). Gồm xác minh thu nhập, liệt kê nghĩa vụ hiện có, kiểm tra thu nhập còn lại và kiểm tra sức chịu đựng.

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Alternative Data

*Dữ liệu thay thế*

Dữ liệu không đến từ trung tâm thông tin tín dụng truyền thống: dữ liệu nhà mạng, giao dịch ví điện tử, lịch sử trả hóa đơn, hành vi trong ứng dụng. Dùng để chấm điểm khách hàng thin-file, và chỉ được dùng khi có sự đồng ý rõ ràng.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Amortization

*Trả dần (khấu hao khoản vay)*

Quá trình trả dần nợ gốc theo thời gian. Với khoản vay trả góp đều, mỗi kỳ gồm một phần gốc và một phần lãi; kỳ đầu phần lãi lớn nhất, kỳ sau phần gốc tăng dần.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

### AOS

*Supplement, sản phẩm bổ sung*

Module quản lý các sản phẩm bổ sung gắn với hợp đồng vay (bảo hiểm, bảo hành, gói bảo vệ thanh toán). Vòng đời: INITIAL → REGISTERED → ACTIVE → TERMINATED; được kích hoạt khi LAS phát sự kiện FIRST_PRINCIPAL_TX_CHARGED.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### APR

*Annual Percentage Rate, lãi suất phần trăm năm*

Chi phí tín dụng tính theo năm, gồm mọi khoản phí bắt buộc chứ không chỉ lãi suất danh nghĩa. Trong sách, APR = IRR theo tháng × 12 (không ghép lãi); chỉ số có ghép lãi là EIR. Khoản vay của chị Lan có lãi suất danh nghĩa 18% nhưng APR 20.10% vì phí thẩm định 200,000 VNĐ.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending), [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Auto-debit

*Trích nợ tự động*

Cơ chế tự động trích tiền từ tài khoản của khách hàng vào ngày đến hạn. Khi trích nợ tự động được bật sẵn (khách có thể tắt), tỷ lệ sử dụng ở Vela Finance là 82%, so với 45% khi khách phải tự đăng ký.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## B

### Banking-as-a-Service

*BaaS, ngân hàng như một dịch vụ*

Mô hình cung cấp hạ tầng tài chính (giấy phép, core banking, tuân thủ) qua API cho bên thứ ba, để fintech xây sản phẩm tài chính mà không cần tự có giấy phép ngân hàng.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Behavioral Score

*Điểm hành vi*

Điểm tín dụng tính từ dữ liệu hành vi (cách dùng ứng dụng, thói quen thanh toán, dữ liệu nhà mạng) thay vì chỉ dữ liệu trung tâm tín dụng. Đặc biệt hữu ích cho khách hàng thin-file.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring), [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### β-δ Model

*Mô hình β-δ (chiết khấu gần hyperbol)*

Mô hình của Laibson (1997) mô tả thiên kiến hiện tại: mọi lợi ích tương lai bị chiết khấu thêm một hệ số β < 1, còn hiện tại thì không; δ là hệ số chiết khấu thời gian thông thường.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Billing Cycle

*Chu kỳ billing*

Vòng lặp hằng tháng: lãi và phí phát sinh, EOM tạo kỳ trả nợ và sao kê, đến hạn thanh toán, nhận và ghép thanh toán, theo dõi DPD nếu chưa trả.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

### BNPL

*Buy Now Pay Later, mua trước trả sau*

Hình thức tín dụng cho phép mua ngay và trả góp sau, thường 3-6 kỳ, thường 0% lãi danh nghĩa. Doanh thu đến từ phí người bán, và ở nhiều thị trường còn từ "phí xử lý" thu của người mua.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Bureau

*Trung tâm thông tin tín dụng*

Tổ chức thu thập và cung cấp lịch sử tín dụng. Ở Việt Nam là CIC (Trung tâm Thông tin tín dụng Quốc gia); trên thế giới có Experian, TransUnion, Equifax.

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 11](/docs/intelligence/ch11-credit-scoring).

## C

### CAC

*Customer Acquisition Cost, chi phí thu hút khách hàng*

Tổng chi phí để có một khách hàng mới: marketing, bán hàng, xử lý hồ sơ. CAC quyết định số tiền vay tối thiểu để một khoản vay có lãi.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Calibration

*Hiệu chuẩn mô hình*

Kiểm tra xác suất dự báo có khớp với tỷ lệ thực tế không. Ví dụ: những khách hàng 420 điểm được dự báo PD 2.4%; nếu tỷ lệ vỡ nợ thực tế của họ khoảng 2.4%, mô hình hiệu chuẩn tốt.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### CLV

*Customer Lifetime Value, giá trị vòng đời khách hàng*

Giá trị hiện tại của lợi nhuận ròng mà một khách hàng mang lại trong suốt mối quan hệ: tổng theo từng năm của lợi nhuận năm đó nhân xác suất khách còn ở lại, chiết khấu về hiện tại.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Cognitive Load

*Tải nhận thức*

Lượng nỗ lực trí óc cần để xử lý thông tin và ra quyết định. Tải nhận thức cao đẩy người ta sang tư duy Hệ 1 và làm giảm chất lượng quyết định tài chính.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Collections

*Thu hồi nợ*

Quy trình liên hệ, thương lượng và thu hồi nợ từ khách hàng quá hạn, từ nhắc nhở sớm, thỏa thuận thanh toán, hỗ trợ khó khăn đến khởi kiện hoặc bán nợ.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Commitment Device

*Cơ chế cam kết*

Cơ chế cho phép người ta tự nguyện giới hạn lựa chọn tương lai để giữ đúng ý định hiện tại. Ví dụ: khóa tiết kiệm, cam kết dùng tiền thưởng để trả bớt nợ.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Concentration Risk

*Rủi ro tập trung*

Rủi ro khi danh mục phụ thuộc quá nhiều vào một ngành, một chủ lao động hay một vùng. Khi điểm tập trung đó gặp cú sốc, cả danh mục bị ảnh hưởng cùng lúc.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio), [Chương 16](/docs/future/ch16-timeless-principles).

### ContractService

*Dịch vụ hợp đồng*

Thực thể nối tài khoản với mã và phiên bản biểu phí, xác định lãi suất và phí áp dụng cho tài khoản đó.

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

### Cost of Funds

*Chi phí vốn*

Chi phí bên cho vay phải trả để huy động vốn cho vay: lãi vay ngân hàng, lợi suất trái phiếu. Phần vốn chủ sở hữu được tính qua ROE mục tiêu. Các ví dụ trong sách dùng 8.5%/năm cho phần nợ.

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Credit Score

*Điểm tín dụng*

Con số tổng hợp phản ánh mức rủi ro tín dụng của một khách hàng, tính từ lịch sử thanh toán, dư nợ, độ dài lịch sử tín dụng, cơ cấu tín dụng và số lần tra cứu gần đây.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Credit Utilization

*Tỷ lệ sử dụng hạn mức*

Dư nợ chia cho hạn mức tín dụng. Tỷ lệ cao là tín hiệu căng thẳng tài chính; đây là một thành phần của điểm FICO.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### CurrentBalance

*Số dư hiện tại*

Thực thể trong LAS theo dõi số dư hiện tại của tài khoản theo từng loại: gốc, lãi, phí, phạt.

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

## D

### 30/360

*Quy ước ngày 30/360*

Quy ước tính lãi dùng trong các ví dụ của VLP: mọi tháng tính là 30 ngày, năm 360 ngày, nên lãi một kỳ đủ tháng = dư nợ × lãi suất năm / 12. Khác với Actual/365 dùng số ngày thực tế. Được cấu hình qua `AnnualRateDayCount.D30_360` trong biểu phí.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending), [Chương 9](/docs/system/ch09-billing-cycle).

### Dark Pattern

*Mẫu thiết kế lừa dối*

Thiết kế giao diện có chủ đích dẫn người dùng đến quyết định không vì lợi ích của họ: đồng hồ đếm ngược giả, phí ẩn, nút từ chối khó tìm.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Data Drift

*Drift dữ liệu*

Phân phối của dữ liệu đầu vào thay đổi theo thời gian. PSI > 0.25 là thay đổi lớn, mô hình có thể không còn đúng.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Debt Stacking

*Chồng nợ*

Khách hàng có nhiều khoản BNPL hay khoản vay ở nhiều bên, mỗi bên chỉ thấy một phần. DTI thật cao hơn mức mà bất kỳ bên nào biết.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Default

*Vỡ nợ*

Thường định nghĩa là DPD 90+ bất kỳ lúc nào trong một cửa sổ quan sát (ví dụ 24 tháng). Có thể chặt hơn (write-off) hoặc lỏng hơn (DPD 30+) tùy mục đích.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Delinquency

*Quá hạn*

Trạng thái khoản vay đã quá hạn thanh toán nhưng chưa đến mức vỡ nợ, thường là DPD 1-89.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Disparate Impact

*Tác động bất lợi*

Một chính sách trung lập về hình thức nhưng ảnh hưởng không cân xứng đến một nhóm được bảo vệ, kể cả khi không có ý định phân biệt đối xử.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### DPD

*Days Past Due, số ngày quá hạn*

Số ngày kể từ ngày đến hạn của kỳ quá hạn sớm nhất chưa được thanh toán. DPD 0 là đúng hạn. Là chỉ số then chốt của collections, phân loại nợ và IFRS 9.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

### DSA

*Data Source Aggregator*

Module tổng hợp dữ liệu từ nhiều hệ thống nội bộ thành XML để sinh tài liệu (hợp đồng, phụ lục). Không phải module giải ngân. Kiến trúc dạng plugin với các provider như AgreementDataSourceProvider, ContractDataSourceProvider.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### DTI

*Debt-to-Income, tỷ lệ nợ trên thu nhập*

Tổng nghĩa vụ trả nợ hằng tháng chia cho thu nhập hằng tháng. Khoản vay của chị Lan có DTI 7.7% (1,696,080 / 22,000,000).

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### Dual-Process Theory

*Lý thuyết hai hệ tư duy*

Khung của Kahneman: Hệ 1 nhanh, tự động, cảm tính; Hệ 2 chậm, có chủ đích, logic. Quyết định tài chính thường do Hệ 1 dẫn dắt.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## E

### EAD

*Exposure at Default, dư nợ tại thời điểm vỡ nợ*

Số tiền còn phải trả khi khách hàng vỡ nợ. Với khoản vay trả góp, EAD thường là dư nợ gốc còn lại tại thời điểm đó, nhỏ hơn số tiền vay ban đầu.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Early Warning System

*Hệ thống cảnh báo sớm*

Hệ thống phát hiện khách hàng có nguy cơ không trả được nợ trước khi DPD xuất hiện, để can thiệp sớm theo các tầng từ nhắc nhẹ đến hỗ trợ khó khăn.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections), [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Effective Interest Rate

*EIR, lãi suất thực tế*

Lãi suất năm có ghép lãi tương ứng với IRR theo kỳ: EIR = (1 + IRR tháng)^12 − 1. Luôn cao hơn APR (= IRR tháng × 12) khi IRR dương.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

### EL

*Expected Loss, tổn thất dự kiến*

EL = PD × LGD × EAD. Tổn thất bình quân dự kiến, được tính vào giá sản phẩm: đó là một chi phí đã định giá, không phải rủi ro.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Embedded Finance

*Tài chính nhúng*

Tích hợp sản phẩm tài chính vào nền tảng phi tài chính, để khách hàng dùng tín dụng ngay trong ngữ cảnh (bước thanh toán, đặt dịch vụ) mà không rời sang ứng dụng tài chính.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### EMI

*Equated Monthly Instalment, khoản trả góp đều hằng tháng*

Khoản tiền cố định trả mỗi tháng, gồm một phần gốc và một phần lãi, tính bằng công thức PMT. Khoản vay của chị Lan có EMI 1,696,080 VNĐ.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

### EOM

*End of Month, xử lý cuối tháng*

Job batch cuối kỳ: tính lãi, tạo kỳ trả nợ, tính phí, sinh dữ liệu sao kê, cập nhật số dư. Trong VLP chạy song song theo partition.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

## F

### Feature Drift

*Drift của biến đầu vào*

Một dạng drift dữ liệu: phân phối của một biến đầu vào thay đổi theo thời gian, đo bằng PSI của từng biến.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Feature Engineering

*Xây dựng biến đầu vào*

Chuyển dữ liệu thô thành biến phù hợp cho mô hình: biến đổi WOE, tỷ lệ, cửa sổ thời gian.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Feature Store

*Kho biến đầu vào*

Hạ tầng tính, lưu và phục vụ biến đầu vào cho các mô hình: tập trung, có phiên bản, đúng tại thời điểm, nhất quán giữa huấn luyện và phục vụ.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### FICO Score

*Điểm FICO*

Mô hình điểm tín dụng phổ biến nhất ở Mỹ, của Fair Isaac Corporation, thang 300-850. Năm nhóm yếu tố: lịch sử thanh toán 35%, số tiền đang nợ 30%, độ dài lịch sử 15%, cơ cấu tín dụng 10%, tín dụng mới 10%.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Fraud

*Gian lận*

Cố ý cung cấp thông tin sai để được cấp tín dụng. Các dạng: gian lận hồ sơ, đánh cắp danh tính, danh tính tổng hợp, gian lận vận tốc, tài liệu do AI tạo.

Xuất hiện trong: [Chương 4](/docs/products/ch04-customer-journey), [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

## G

### Gini Coefficient

*Hệ số Gini*

Thước đo khả năng phân biệt của mô hình tín dụng: Gini = 2 × AUROC − 1, thang 0-1. Trên 0.45 thường được coi là chấp nhận được, trên 0.60 là tốt. Gini đo khả năng xếp hạng, không phải phần trăm vỡ nợ được giải thích.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Grace Period

*Thời gian ân hạn*

Khoảng thời gian sau ngày đến hạn mà thanh toán vẫn được chấp nhận không bị tính phí trễ hạn. Độ dài là tham số cấu hình của sản phẩm.

Xuất hiện trong: [Chương 9](/docs/system/ch09-billing-cycle).

## H

### Hallucination

*Bịa thông tin (của LLM)*

Khi LLM sinh ra nội dung sai nhưng nghe thuyết phục. Đặc biệt nguy hiểm trong tài chính (số liệu sai, chính sách sai). Giảm thiểu bằng RAG và quy tắc: mọi con số phải lấy từ cơ sở dữ liệu.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Hardship Program

*Chương trình hỗ trợ khó khăn*

Các giải pháp cho khách hàng gặp khó khăn tài chính: hoãn thanh toán, kéo dài kỳ hạn, giảm lãi tạm thời. Mục tiêu là giúp khách cure và giữ quan hệ, thay vì thu nợ bằng mọi giá.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Hyperbolic Discounting

*Chiết khấu hyperbol*

Xu hướng coi trọng lợi ích và chi phí ngắn hạn quá mức so với dài hạn. Giải thích vì sao người ta "luôn định tiết kiệm từ tháng sau". Xem Mô hình β-δ.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## I

### Idempotency

*Tính lũy đẳng*

Thực hiện một thao tác một lần hay nhiều lần đều cho cùng kết quả. Bắt buộc với API thanh toán và job batch để tránh thu hay giải ngân trùng.

Xuất hiện trong: [Chương 16](/docs/future/ch16-timeless-principles).

### IFRS 9

*Chuẩn mực báo cáo tài chính quốc tế số 9*

Chuẩn mực kế toán cho công cụ tài chính, yêu cầu dự phòng theo tổn thất tín dụng dự kiến (ECL) qua ba stage: Stage 1 (bình thường, ECL 12 tháng), Stage 2 (rủi ro tín dụng tăng đáng kể, ECL toàn thời hạn), Stage 3 (suy giảm giá trị tín dụng, ECL toàn thời hạn).

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### Infinispan

*Bộ nhớ đệm phân tán Infinispan*

Cache phân tán trong bộ nhớ. Trong VLP, LOS dùng Infinispan nhúng để giữ trạng thái workflow giữa các bước bất đồng bộ, với 7 cache có tên: `zeebeChooseOfferCache`, `chooseOfferCache`, `loanPurposeCache`, `generateAgreementCache`, `signAgreementCache`, `rejectSupplementCache`, `cancelSupplementCache`.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### Information Value

*Giá trị thông tin, IV*

Thước đo sức dự báo của một biến trong chấm điểm tín dụng. IV < 0.02: không có giá trị; 0.02-0.10: yếu; 0.10-0.30: trung bình; > 0.30: mạnh; > 0.50: mạnh bất thường, nên kiểm tra rò rỉ dữ liệu.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### InstalmentSummary

*Tổng hợp kỳ trả góp*

Thực thể tổng hợp phi chuẩn hóa trong LAS, tóm tắt kế hoạch trả góp của một tài khoản. Chỉ được làm mới sau khi mọi kỳ trả nợ con đã được lưu (xem lỗi VLP-670 ở Chương 16).

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management).

### IRR

*Internal Rate of Return, tỷ suất hoàn vốn nội bộ*

Lãi suất chiết khấu làm giá trị hiện tại ròng của mọi dòng tiền bằng 0. Dùng để tính APR và EIR từ dòng tiền thực nhận và thực trả của khách hàng.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

## J

### Judgmental Lending

*Cho vay theo phán đoán*

Cách cho vay truyền thống dựa trên phán đoán của nhân viên tín dụng: không nhất quán, không mở rộng được, có thiên lệch ngầm và không có dấu vết kiểm toán. Đã được thay thế dần bằng chấm điểm thống kê.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## K

### KS Statistic

*Chỉ số Kolmogorov-Smirnov*

Khoảng cách lớn nhất giữa phân phối lũy kế của khách hàng tốt và xấu theo điểm: KS = max(%Xấu lũy kế − %Tốt lũy kế). KS > 30% là tốt.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## L

### LGD

*Loss Given Default, tỷ lệ tổn thất khi vỡ nợ*

Phần EAD bên cho vay thực sự mất sau khi thu hồi: LGD = 1 − tỷ lệ thu hồi. Khoản vay tiêu dùng không bảo đảm thường 55-70%; các ví dụ trong sách dùng 62%.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### LLM

*Large Language Model, mô hình ngôn ngữ lớn*

Mô hình AI huấn luyện trên lượng văn bản rất lớn, hiểu và sinh văn bản. Trong cho vay: xử lý hồ sơ, chăm sóc khách hàng, quản lý tri thức, luôn kèm rào chắn chống bịa thông tin.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### LOS

*Loan Origination Service*

Module điều phối khởi tạo khoản vay, không trạng thái: nhận đơn, gọi các module kiểm tra, chấm điểm, tính giá, rồi tạo hợp đồng và tài khoản. Dùng controller bất đồng bộ và Infinispan, không dùng engine BPMN cho luồng chính.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### Loss Aversion

*Né tránh mất mát*

Mất mát gây khó chịu nhiều hơn niềm vui của một khoản được có cùng giá trị. Theo ước lượng của Tversky và Kahneman (1992), λ ≈ 2.25: mất 100,000 khó chịu tương đương niềm vui khi được khoảng 225,000. Dùng khi thiết kế thông điệp nhắc nợ, với điều kiện con số đúng sự thật.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## M

### Mental Accounting

*Kế toán tâm lý*

Xu hướng đối xử với tiền khác nhau tùy "ngăn" tâm lý của nó (lương, thưởng, tiết kiệm). Tiền thưởng thường được tiêu nhanh hơn tiền lương cùng số tiền (Thaler).

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Model Risk

*Rủi ro mô hình*

Rủi ro từ việc dùng mô hình sai, hoặc dùng mô hình đúng sai cách: lỗi mô hình, lỗi hiện thực, dùng sai mục đích. Được quản trị bằng khung MRM ba tầng: thẩm định khi phát triển, thẩm định độc lập, giám sát liên tục.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring), [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Moral Hazard

*Rủi ro đạo đức*

Khi được bảo vệ khỏi hậu quả, người ta có xu hướng chấp nhận rủi ro nhiều hơn. Trong cho vay: người vay đã nhận tiền có thể dùng sai mục đích; bên cho vay được bảo lãnh có thể cho vay quá mạo hiểm.

Xuất hiện trong: [Chương 1](/docs/foundations/ch01-credit-economics).

## N

### Net Interest Margin

*NIM, biên lãi ròng*

Chênh lệch giữa thu nhập lãi từ cho vay và chi phí lãi của nguồn vốn, chia cho tài sản sinh lãi bình quân. Thước đo cơ bản về khả năng sinh lời của bên cho vay.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### NPL

*Non-Performing Loan, nợ xấu*

Ở Việt Nam là nợ nhóm 3 đến nhóm 5 theo Thông tư 31/2024/TT-NHNN, về cơ bản là quá hạn trên 90 ngày. Tỷ lệ nợ xấu = nợ xấu / tổng dư nợ.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### Nudge

*Cú hích*

Can thiệp thiết kế nhỏ, không ép buộc, nhưng hướng hành vi theo chiều mong muốn. Lựa chọn mặc định là cú hích mạnh nhất (Thaler và Sunstein, 2008).

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## O

### Open Banking

*Ngân hàng mở*

Khung cho phép khách hàng chia sẻ dữ liệu tài chính với bên thứ ba qua API khi đồng ý, giúp đánh giá tín dụng tốt hơn và thúc đẩy cạnh tranh. Ở Việt Nam có Thông tư 64/2024/TT-NHNN về Open API.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Optimism Bias

*Thiên kiến lạc quan*

Xu hướng đánh giá quá cao khả năng điều tốt và quá thấp khả năng điều xấu xảy ra với chính mình. Người vay đánh giá thấp rủi ro gặp khó khăn khi trả nợ.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

## P

### Payment Holiday

*Hoãn thanh toán*

Cho khách hàng tạm ngừng thanh toán trong một số kỳ (thường 1-3 tháng), ngày đến hạn được dời về sau. Lãi có tiếp tục tích lũy hay được miễn tùy cấu hình (cờ `payholInterestWaiving` trong VLP).

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

### PD

*Probability of Default, xác suất vỡ nợ*

Xác suất một khách hàng vỡ nợ trong một khoảng thời gian xác định. PD × LGD × EAD = EL.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio), [Chương 11](/docs/intelligence/ch11-credit-scoring).

### PMT

*Khoản trả mỗi kỳ*

Số tiền trả mỗi kỳ của khoản vay trả góp đều: PMT = P × r(1+r)^n / ((1+r)^n − 1), với r là lãi suất kỳ. Khoản vay của chị Lan: PMT = 1,696,080 VNĐ, kỳ cuối điều chỉnh làm tròn còn 1,696,077.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

### Present Bias

*Thiên kiến hiện tại*

Xu hướng coi trọng lợi ích và chi phí trước mắt quá mức so với tương lai, dẫn đến vay quá nhiều và tiết kiệm quá ít. Xem Mô hình β-δ.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### Propensity Model

*Mô hình xu hướng*

Mô hình ML ước lượng khả năng một khách hàng phản hồi (nhận đề nghị, mua sản phẩm). Nên kết hợp với rủi ro để không nhắm vào người đang gấp.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Prospect Theory

*Thuyết triển vọng*

Kahneman và Tversky (1979): người ta đánh giá kết quả theo sự thay đổi so với một điểm tham chiếu, không theo giá trị tuyệt đối, và mất mát có sức nặng lớn hơn khoản được tương đương.

Xuất hiện trong: [Chương 13](/docs/intelligence/ch13-behavioral-economics).

### PSI

*Population Stability Index, chỉ số ổn định tập khách hàng*

Thước đo thay đổi phân phối giữa dữ liệu huấn luyện và dữ liệu hiện tại. PSI < 0.10: ổn định; 0.10-0.25: thay đổi vừa, theo dõi sát; > 0.25: thay đổi lớn, cần xem lại mô hình.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## Q

### QST

*Quote Store*

Module lưu và quản lý vòng đời báo giá do QCE tạo ra. Thực thể chính là SalesQuote với các arrangement về số tiền, lãi, phí. LOS gọi QST để lấy báo giá; QST publish sự kiện CloudEvents qua Kafka khi báo giá thay đổi.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

## R

### RAG

*Retrieval-Augmented Generation*

Kiến trúc kết hợp LLM với truy xuất thông tin: trước khi trả lời, hệ thống lấy ra tài liệu liên quan và LLM chỉ trả lời từ nội dung đó. Giảm bịa thông tin, nhất quán và có nguồn.

Xuất hiện trong: [Chương 15](/docs/future/ch15-ai-future-of-lending).

### Risk-Based Pricing

*Định giá dựa trên rủi ro*

Khách hàng rủi ro cao hơn trả lãi suất cao hơn, để giá phản ánh tổn thất dự kiến. Ở VLP: Prime 15%, Standard 18%, Sub-prime 21%.

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

### ROE

*Return on Equity, tỷ suất lợi nhuận trên vốn chủ sở hữu*

Lợi nhuận chia cho vốn chủ sở hữu. ROE mục tiêu quyết định phần lợi nhuận phải có trong lãi suất (Chương 12 dùng 18% trên 15% vốn chủ).

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

## S

### Scorecard

*Thẻ điểm*

Mô hình chấm điểm truyền thống: hồi quy logistic trên các biến đã biến đổi WOE, quy đổi sang điểm bằng điểm neo và PDO. Dễ giải thích, được cơ quan quản lý ưa chuộng.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### SHAP

*SHapley Additive exPlanations*

Phương pháp giải thích dự đoán của mô hình bằng cách chia dự đoán thành phần đóng góp cộng được của từng biến. Là cơ sở để tạo lý do từ chối cụ thể.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### SRT

*Service Router*

Module định tuyến không trạng thái: nhận yêu cầu xử lý khoản vay từ LOS và chuyển đến các backend (LAS, CTM, AOS, CTS, PDC, ADR, QST, LBS...) qua 9 connector FeignClient, có circuit breaker Resilience4j. Không có cơ sở dữ liệu riêng.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

### Stress Test

*Kiểm tra sức chịu đựng*

Đánh giá danh mục hoặc mô hình trong kịch bản bất lợi: suy thoái, thất nghiệp tăng vọt, lãi suất tăng. Kết quả quyết định kế hoạch vốn.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio), [Chương 16](/docs/future/ch16-timeless-principles).

### Sub-prime

*Hạng dưới chuẩn*

Phân khúc khách hàng có điểm dưới ngưỡng Standard. Ở VLP là 340-379 điểm, lãi suất 21%/năm, hạn mức tối đa thấp hơn.

Xuất hiện trong: [Chương 12](/docs/intelligence/ch12-risk-based-pricing).

## T

### Tail Risk

*Rủi ro đuôi*

Rủi ro của các sự kiện hiếm và cực đoan. Quản trị rủi ro thông thường tối ưu cho trung bình; quản trị rủi ro đuôi tập trung vào khả năng sống sót trong trường hợp xấu nhất.

Xuất hiện trong: [Chương 16](/docs/future/ch16-timeless-principles).

### Tariff-Driven Design

*Thiết kế dựa trên biểu phí*

Kiến trúc trong đó quy tắc kinh doanh (lãi suất, phí, giới hạn) nằm trong cấu hình có phiên bản và ngày hiệu lực, không viết cứng trong code, nên thay đổi được mà không cần triển khai.

Xuất hiện trong: [Chương 3](/docs/products/ch03-product-design), [Chương 16](/docs/future/ch16-timeless-principles).

### Thin-File

*Hồ sơ tín dụng mỏng*

Khách hàng có ít hoặc không có lịch sử tín dụng, không chấm điểm được bằng dữ liệu trung tâm tín dụng truyền thống. Cần dữ liệu thay thế hoặc điểm hành vi.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring), [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Time Value of Money

*Giá trị thời gian của tiền*

Một đồng hôm nay có giá trị hơn một đồng trong tương lai vì có thể đầu tư sinh lời. Là nền tảng của NPV, IRR và công thức niên kim.

Xuất hiện trong: [Chương 2](/docs/foundations/ch02-mathematics-of-lending).

## U

### UL

*Unexpected Loss, tổn thất ngoài dự kiến*

Mức tổn thất thực tế có thể vượt EL. EL được bù bằng giá; UL được bù bằng vốn.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

### UNREACHABLE_FUTURE_DATE

*Ngày canh gác "không bao giờ tới"*

Giá trị ngày rất xa dùng cho bản ghi chưa có ngày kết thúc, để truy vấn khoảng ngày đơn giản (`WHERE validTo >= :today`) thay vì kiểm tra NULL. Trong VLP: `AccountParameter.validTo` và `AccountService.endDate` dùng 3000-01-01 (`DateUtil.UNREACHABLE_FUTURE_DATE`, NULL trong DB được đổi qua `NullDateToFarFutureConverter`); `PostingUnit.firstPrescribeDate` dùng 3333-01-01 cho "chưa prescribe". Hai giá trị khác nhau cho hai mục đích khác nhau, và nhầm lẫn giữa chúng là nguồn lỗi truy vấn kinh điển.

Xuất hiện trong: [Chương 8](/docs/system/ch08-account-management), [Phụ lục A](/docs/appendices/a-architecture-reference).

## V

### Velocity Fraud

*Gian lận vận tốc*

Nộp nhiều đơn vay cho nhiều bên trong thời gian ngắn, trước khi các bên kịp thấy phê duyệt của nhau. Phát hiện bằng số lần tra cứu gần đây, danh sách đen dùng chung, dấu vân tay thiết bị.

Xuất hiện trong: [Chương 14](/docs/future/ch14-embedded-finance-bnpl).

### Vintage Analysis

*Phân tích theo vintage*

Theo dõi hiệu quả của các nhóm khoản vay theo tháng giải ngân, ví dụ so tỷ lệ DPD 30+ sau 6 tháng của nhóm tháng 1 với tháng 2, tháng 3. Phát hiện drift của mô hình và xu hướng chất lượng danh mục.

Xuất hiện trong: [Chương 5](/docs/products/ch05-revenue-portfolio).

## W

### WOE

*Weight of Evidence, trọng số bằng chứng*

Biến đổi cho biến chấm điểm: WOE_i = ln(%Vỡ nợ_i / %Tốt_i). Âm là bin nghiêng về khách tốt, dương là nghiêng về khách xấu.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

### Write-off

*Xóa nợ (kế toán)*

Quyết định kế toán đưa khoản vay không còn kỳ vọng thu hồi ra khỏi bảng cân đối, dùng dự phòng đã trích. Ngưỡng là tham số cấu hình (ví dụ DPD 90 với vay tiêu dùng không bảo đảm). Write-off không phải tha nợ: nghĩa vụ trả nợ vẫn còn và việc thu hồi vẫn tiếp tục.

Xuất hiện trong: [Chương 10](/docs/system/ch10-collections).

## X

### XGBoost

*eXtreme Gradient Boosting*

Thư viện gradient boosting phổ biến cho dữ liệu dạng bảng, thường cho độ chính xác cao trong chấm điểm tín dụng, xử lý được giá trị thiếu, huấn luyện nhanh.

Xuất hiện trong: [Chương 11](/docs/intelligence/ch11-credit-scoring).

## Z

### Zeebe

*Engine workflow Zeebe*

Engine workflow BPMN (Camunda). Trong VLP chỉ dùng cho chấm điểm ở bước `chooseOffer` (profile `zeebe-integration`), không phải bộ điều phối chính của khởi tạo. Kết quả POSITIVE/NEGATIVE được gửi về LOS qua RabbitMQ.

Xuất hiện trong: [Chương 7](/docs/system/ch07-origination).

*Trang Thuật ngữ được bổ sung khi có thuật ngữ mới trong sách.*
