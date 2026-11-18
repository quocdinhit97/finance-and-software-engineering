---
title: "Chương 3. Thiết kế sản phẩm tài chính"
sidebar_label: "3. Thiết kế sản phẩm tài chính"
sidebar_position: 1
chapter: 3
subtitle: "Financial Product Design"
reading_time: 31
source_file: "phan-1-chuong-3.md"
editorial_status: "mechanical"
---

> *"Một sản phẩm tài chính không chỉ là một hợp đồng - đó là một cấu trúc khuyến khích, một cơ chế phân bổ rủi ro, và một lời hứa về tương lai."*

## Dẫn nhập: Tại sao hai khoản vay giống nhau lại rất khác nhau

::::story
Anh Minh đang làm Product Owner cho một công ty tài chính tiêu dùng. Tuần này anh nhận được hai yêu cầu từ Sales:

**Yêu cầu 1:** "Khách hàng muốn vay 20 triệu, lãi suất thấp nhất có thể, kỳ hạn 12 tháng. Đây là nhân viên văn phòng có lương ổn định."

**Yêu cầu 2:** "Khách hàng muốn vay 20 triệu để mua tủ lạnh tại cửa hàng điện máy đối tác. Họ muốn trả góp 0% lãi suất trong 12 tháng."

Cả hai khoản vay: 20 triệu, 12 tháng. Nhưng Anh Minh biết đây là hai sản phẩm hoàn toàn khác nhau với những rủi ro, chi phí, và cơ chế vận hành khác nhau. Nếu thiết kế cùng một sản phẩm cho cả hai, ít nhất một trong hai sẽ không bền vững.

Tại sao? Và hệ thống cần thiết kế như thế nào để hỗ trợ sự đa dạng này mà không trở thành mớ hỗn độn?
::::

Chương này trả lời những câu hỏi đó bằng cách đi từ taxonomy sản phẩm, qua cấu trúc phí và lãi, đến tariff-driven architecture - cách VLP cho phép hàng chục sản phẩm khác nhau chạy trên cùng một engine.

## 3.1 Taxonomy sản phẩm tín dụng tiêu dùng

### Tình huống: Phân loại đơn giản hóa là Sai

::::story
Bà Hương phỏng vấn một ứng viên Product Manager. Câu hỏi: "Consumer finance có những loại sản phẩm nào?"

Ứng viên A trả lời: "Vay có tài sản và vay không có tài sản."

Ứng viên B trả lời: "Revolving và instalment. Nhưng trong thực tế còn phức tạp hơn - một tài khoản revolving có thể tạo ra các instalment sub-plan, BNPL là một dạng instalment đặc biệt với merchant subsidy, và một số sản phẩm hybrid cho phép chuyển đổi giữa hai chế độ..."

Bà Hương chọn ứng viên B. Không phải vì B nói nhiều hơn - mà vì B hiểu rằng taxonomy đơn giản hóa tạo ra blind spot trong thiết kế sản phẩm và hệ thống.
::::

### Chiều phân loại thứ nhất: Revolving vs Instalment

Đây là phân loại quan trọng nhất, ảnh hưởng đến toàn bộ kiến trúc hệ thống.

**Revolving Credit - Tín Dụng Quay Vòng**

**Khái niệm:** Người vay có một hạn mức *(credit limit)* cố định. Họ có thể rút tiền (hoặc chi tiêu) bất cứ lúc nào trong giới hạn đó, trả về, rồi rút lại. Hạn mức "quay vòng" liên tục.

**Đặc điểm kỹ thuật:**
- Số dư nợ thay đổi liên tục theo từng giao dịch
- Tối thiểu phải trả mỗi tháng: MMI *(Minimum Monthly Instalment)* - thường là X% số dư hoặc một số tiền tối thiểu cố định
- Lãi tính trên số dư hàng ngày *(daily balance method)*
- Không có ngày kết thúc cố định - account tồn tại cho đến khi đóng

**Ví dụ:** Thẻ tín dụng, hạn mức tín dụng linh hoạt *(flexi limit)*

**Rủi ro đặc thù:**
- EAD khó dự đoán - người vay thường rút hết hạn mức trước khi vỡ nợ
- Khách hàng có thể tích lũy nợ từ từ mà không nhận ra
- "Minimum payment trap" *(bẫy trả tối thiểu)*: nếu chỉ trả MMI, nợ gốc giảm rất chậm

**Minimum Payment Trap - Ví Dụ Số:**

Chị Lan có thẻ tín dụng hạn mức 50,000,000 VNĐ, đã dùng hết 50,000,000 VNĐ, lãi suất 24%/năm (2%/tháng). MMI = 2% số dư = 1,000,000 VNĐ/tháng.

```text
Tháng 1:
  Số dư đầu kỳ: 50,000,000
  Lãi: 50,000,000 × 2% = 1,000,000
  MMI phải trả: 1,000,000
  Gốc được trả: 1,000,000 - 1,000,000 = 0 VNĐ!

Tháng 2:
  Số dư: vẫn 50,000,000
  Lãi: lại 1,000,000
  → Chị Lan trả mãi mà không bao giờ thoát được!
```

Trong thực tế, MMI thường được thiết kế để trả được ít nhất một phần gốc (ví dụ: max(2% số dư, 500,000 VNĐ) + toàn bộ lãi). Nhưng ngay cả vậy, với lãi suất 24%, nếu chỉ trả tối thiểu, khoản nợ 50 triệu có thể mất 10+ năm để tất toán hoàn toàn.

*Đây chính xác là vấn đề behavioral economics mà Chương 13 sẽ phân tích - và là lý do tại sao nhiều regulatory yêu cầu hiển thị "thời gian tất toán nếu chỉ trả tối thiểu" trên sao kê hàng tháng.*

**Instalment Loan - Vay Trả Góp**

**Khái niệm:** Người vay nhận một khoản tiền cố định *(lump sum)*, cam kết trả theo lịch định sẵn với số tiền và ngày cụ thể cho đến khi tất toán hoàn toàn.

**Đặc điểm kỹ thuật:**
- Lịch trả nợ *(amortization schedule)* cố định từ đầu
- Ngày kết thúc xác định - account đóng khi trả hết
- PMT cố định mỗi tháng (annuity)
- Không thể rút thêm khi đã trả bớt (trừ khi tạo khoản vay mới)

**Ví dụ:** POS loan (mua điện thoại, tivi), cash loan (vay tiền mặt), PHONELOAN (Advanced Loan on Phone)

**So sánh rủi ro Revolving vs Instalment:**

| Yếu tố | Revolving | Instalment |
|--------|-----------|------------|
| EAD predictability | Thấp (volatile) | Cao (từ schedule) |
| PD pattern | Tăng chậm rồi đột biến | Thường đột biến sớm |
| Prepayment risk | Cao (có thể trả bất kỳ lúc nào) | Có phí trả trước |
| Behavioral risk | Cao (accumulation, minimum trap) | Thấp hơn |
| Revenue predictability | Thấp | Cao |
| Phù hợp với | Khách hàng ổn định, cần linh hoạt | Mua sắm có mục đích cụ thể |

 **Tại sao phân biệt này quan trọng với kiến trúc VLP?**

Revolving và Instalment yêu cầu **logic billing hoàn toàn khác nhau:**

```text
Revolving Account:
  → Lãi tính hàng ngày trên số dư thực tế
  → MMI tính cuối kỳ dựa trên số dư
  → Có thể có nhiều giao dịch khác nhau trong cùng billing period
  → Balance thay đổi liên tục

Instalment Account:
  → Lịch trả cố định từ đầu (InstalmentPlan)
  → PMT không đổi mỗi tháng
  → Billing chỉ cần confirm theo schedule
  → Balance giảm dần theo amortization
```

Trong VLP, LAS module phải xử lý cả hai chế độ - và một tài khoản revolving có thể chứa các instalment sub-plan (khi khách hàng chuyển đổi một phần số dư sang trả góp cố định). Đây là một trong những điểm phức tạp nhất của consumer finance core banking.

### Chiều phân loại thứ hai: Secured vs Unsecured

**Secured Loan - Có Tài Sản Đảm Bảo**

Khoản vay được đảm bảo bằng một tài sản cụ thể. Nếu người vay không trả được, lender có quyền tịch thu tài sản.

*Trong consumer finance thuần túy:* tương đối hiếm - phần lớn là thế chấp ô tô hoặc thiết bị.

**Unsecured Loan - Không Có Tài Sản Đảm Bảo**

Phần lớn sản phẩm consumer finance. Không có tài sản đảm bảo - lender chỉ có thể dựa vào creditworthiness của người vay.

*Hệ quả kiến trúc:* Không có collateral management module trong VLP - đây là quyết định thiết kế có chủ ý, phản ánh business model unsecured lending.

### BNPL: Kiến trúc mới, rủi ro cũ

::::story
Kỹ sư Tuấn đọc báo về Nordlane, Kiwipay, và làn sóng BNPL *(Buy Now Pay Later)*. Anh hỏi Anh Minh: "BNPL có phải là sản phẩm mới hoàn toàn không, hay chỉ là POS loan đổi tên?"

Anh Minh trả lời: "Cả hai. Về bản chất kinh tế, BNPL là instalment loan ngắn hạn. Nhưng business model và rủi ro của nó khác đáng kể."
::::

**Khái niệm - BNPL:**

:::key
**BNPL** *(Buy Now Pay Later)* là sản phẩm tín dụng cho phép người mua thanh toán một khoản mua hàng theo nhiều đợt - thường 3-4 lần, trong 6-8 tuần, thường không tính lãi nếu trả đúng hạn.
:::

**Cơ chế kinh tế - Ai trả lãi?**

Nếu khách hàng không trả lãi, BNPL provider vẫn phải kiếm tiền. Từ đâu?

```text
Revenue model của BNPL:

1. Phí từ merchant (merchant discount rate)
   Merchant trả 2-6% giá trị giao dịch cho BNPL provider
   Đổi lại: tăng conversion rate, tăng average order value
   → Người mua "không có lãi" nhưng merchant trả thay

2. Late fee từ người mua
   Trả trễ → phí phạt cao
   Một số người dựa vào đây để bù đắp loss từ non-payers

3. Interest từ longer-term plans
   BNPL "3 tháng 0%" thường chỉ là marketing
   Nếu chưa trả hết sau 3 tháng → lãi suất retroactive rất cao
```

**Rủi ro BNPL - Mới hay Cũ?**

| Rủi ro | Mức độ mới | Giải thích |
|--------|-----------|------------|
| Adverse selection | Cũ | Người vay rủi ro cao attracted bởi "0% lãi" |
| Moral hazard | Cũ | Dễ mua → dễ mua thêm → over-indebtedness |
| Multiple BNPL | **Mới** | Không có credit bureau reporting → khách hàng vay nhiều nơi cùng lúc, không ai biết |
| Thin-file risk | **Mới** | Target phân khúc không có credit history → ít data để score |
| Regulatory gap | **Mới** | Nhiều nước chưa có BNPL-specific regulation |

**Ví dụ thực tế - Multiple BNPL risk:**

Chị Lan dùng đồng thời:
- BNPL A: 5 triệu mua điện thoại (trả 4 lần)
- BNPL B: 3 triệu mua quần áo (trả 3 lần)
- BNPL C: 8 triệu mua laptop (trả 6 lần)

Tổng nghĩa vụ: 16 triệu - nhưng mỗi BNPL provider chỉ thấy khoản của mình. Credit bureau chưa có dữ liệu từ BNPL (ở nhiều thị trường). Không ai biết tổng exposure thực sự của chị Lan cho đến khi cô bắt đầu default trên tất cả cùng một lúc.

 **BNPL trong VLP:**

TransactionType `BNPL_ECOM` trong VLP xử lý giao dịch BNPL e-commerce. `BNPL_ECOM` là một TransactionType thuộc nhóm `OUTER_DEBT_TRANSACTION_TYPES` và `DISBURSEMENT_TRANSACTION_TYPES`. Về mặt kỹ thuật:
- `BNPL_ECOM` tạo ra một **outer-debt transaction** (không phải trực tiếp tạo instalment plan)
- IP (Instalment Plan) được tạo qua **IP reconciliation flow** riêng biệt (nếu được cấu hình)
- Merchant subsidy flow (xem section 3.2)
- Khác POS loan ở flow: POS loan có dedicated origination; BNPL_ECOM đi qua transaction path

*(verified: miscellaneous-claims.md)*

:::summary[Taxonomy Sản Phẩm]
Revolving: hạn mức quay vòng, lãi trên daily
balance, MMI, rủi ro behavioral cao
Instalment: lịch cố định, PMT đều, rủi ro thấp hơn
BNPL: instalment ngắn hạn + merchant subsidy +
rủi ro multiple provider mới
Phân loại ảnh hưởng trực tiếp đến billing logic
và risk model - không phải chỉ là label
:::

## 3.2 Cấu trúc phí và lãi

### Tình huống: Khi "0% lãi suất" không có nghĩa là miễn phí

::::story
Anh Minh vào cửa hàng điện máy và thấy banner lớn: "Trả góp 0% lãi suất, 12 tháng, không phí!" Anh biết ngay đây là quảng cáo không chính xác - nhưng không phải là gian lận. Nó phản ánh một cấu trúc kinh tế phức tạp đằng sau.

Vậy ai thực sự trả 12 tháng lãi suất đó?
::::

### Phân loại các loại phí

Trước khi trả lời câu hỏi trên, cần hiểu toàn bộ "bảng giá" của một khoản vay tiêu dùng.

**Nhóm 1: Lãi Suất *(Interest)***

| Loại lãi | Khi áp dụng | Đặc điểm |
|----------|-------------|----------|
| Lãi thường *(regular interest)* | Trong kỳ bình thường | Tính trên số dư nợ, hàng ngày hoặc hàng tháng |
| Lãi phạt *(penalty interest)* | Khi quá hạn | Cao hơn lãi thường, tính trên số dư quá hạn |
| Lãi khuyến mãi *(promo rate)* | Trong kỳ promo | Thấp hơn hoặc bằng 0% |
| Lãi sau khuyến mãi *(post-promo)* | Sau kỳ promo | Thường bằng lãi thường, đôi khi retroactive |

**Nhóm 2: Phí Một Lần *(One-time Fees)***

| Loại phí | Thời điểm thu | Ghi chú |
|----------|---------------|---------|
| Phí thẩm định *(origination fee)* | Khi giải ngân | Thường trừ thẳng vào số tiền nhận được |
| Phí tất toán trước hạn *(prepayment fee)* | Khi trả sớm | Bù đắp interest income lender bị mất |
| Phí gia hạn *(renewal fee)* | Khi gia hạn khoản vay | Ít phổ biến |

**Nhóm 3: Phí Định Kỳ *(Recurring Fees)***

| Loại phí | Tần suất | Ghi chú |
|----------|----------|---------|
| Phí quản lý tài khoản *(maintenance fee)* | Hàng tháng | ACCMAINT trong VLP |
| Phí sao kê *(statement fee)* | Hàng tháng | Một số nơi miễn phí nếu eStatement |
| Phí bảo hiểm khoản vay | Hàng tháng | Optional nhưng thường được bundle |
| Phí SMS thông báo | Hàng tháng | Nhỏ nhưng nhiều tài khoản → đáng kể |

**Nhóm 4: Phí Phạt *(Penalty Fees)***

| Loại phí | Khi áp dụng | Đặc điểm |
|----------|-------------|----------|
| Phí trả trễ *(late fee)* | DPD ≥ 1 | Cố định hoặc % số dư |
| Phí vượt hạn mức *(over-limit fee)* | Khi exceed credit limit | Áp dụng với revolving |
| Phí từ chối thanh toán *(returned payment fee)* | Khi thanh toán thất bại | Ít phổ biến hơn |

**Ví dụ số - Tổng chi phí thực sự:**

Khoản vay của chị Lan (18,500,000 VNĐ, 18%/năm, 12 tháng) với đầy đủ phí:

```text
Phí thẩm định: 200,000 VNĐ (trừ khi nhận → nhận 18,300,000)
PMT hàng tháng: 1,696,080 VNĐ (gốc + lãi)
Phí bảo hiểm: 90,000 VNĐ/tháng
Phí quản lý tài khoản (ACCMAINT): 50,000 VNĐ/tháng

Tổng chi phí mỗi tháng: 1,696,080 + 90,000 + 50,000 = 1,836,080 VNĐ
Tổng 12 tháng: 1,836,080 × 12 = 22,032,960 VNĐ
Tổng chi phí phụ thêm: 22,032,960 + 200,000 - 18,500,000 = 3,732,960 VNĐ

APR thực tế (bao gồm tất cả phí): ≈ 28.5%/năm
Nominal rate trên hợp đồng: 18%/năm
```

Chênh lệch 10.5 điểm phần trăm - đây là thông tin mà disclosure laws yêu cầu phải minh bạch.

### Lãi suất trong kỳ khuyến mãi: Anatomy của "0% lãi suất"

**Trở lại tình huống của Anh Minh:**

Cửa hàng điện máy bán tủ lạnh 15,000,000 VNĐ với "0% lãi suất, 12 tháng". Người mua trả góp 1,250,000 VNĐ/tháng × 12 tháng = 15,000,000 VNĐ. Không xu lãi.

Vậy công ty tài chính làm gì để sống?

**Cơ chế Subvention:**

:::key
**Subvention** *(trợ cấp lãi suất)* là cơ chế mà một bên thứ ba (thường là merchant hoặc nhà sản xuất) trả phần lãi suất thay cho người mua.
:::

```text
Không có subvention (normal loan):
  Khách hàng vay 15 triệu, 18%/năm, 12 tháng
  → Trả 1,374,000 VNĐ/tháng (theo annuity)
  → Lãi tổng cộng: 16,488,000 - 15,000,000 = 1,488,000 VNĐ

Với subvention:
  Khách hàng trả 1,250,000 VNĐ/tháng (= 15,000,000 / 12)
  Merchant trả subvention fee = phần lãi suất còn lại
  → Merchant trả: 1,488,000 VNĐ cho công ty tài chính
```

**Tại sao merchant chịu trả 1,488,000 VNĐ subvention?**

Nghiên cứu thực tế trong ngành cho thấy:
- Tỷ lệ chuyển đổi *(conversion rate)* tăng 30-50% khi có tùy chọn "0% lãi"
- Giá trị đơn hàng trung bình *(average order value)* tăng 20-40% (người mua chọn model cao hơn vì "chỉ tốn thêm vài trăm nghìn mỗi tháng")

```text
Phân tích kinh tế của merchant:

Doanh thu tăng thêm khi có BNPL/0%:
  Trước: bán được 100 tủ lạnh × 15 triệu = 1.5 tỷ
  Sau: bán được 150 tủ lạnh × 17 triệu (model cao hơn) = 2.55 tỷ

Subvention phải trả:
  150 × 1,488,000 = 223,200,000 VNĐ

Net benefit:
  (2.55 - 1.5) tỷ - 223.2 triệu = 826.8 triệu VNĐ thêm
```

**Kết luận:** Merchant trả subvention vì nó tạo ra giá trị nhiều hơn cho họ. Khách hàng "được" 0% lãi nhưng thực ra merchant đã tính chi phí subvention vào giá bán. Đây là **positive-sum game** - tất cả các bên đều có thể win nếu cơ chế được thiết kế đúng (merchant tăng doanh số, khách hàng được trả chậm, lender kiếm phí từ merchant).

### Lãi suất Retroactive: Cái bẫy tinh vi

::::story
Chị Lan mua điện thoại với chương trình "0% lãi trong 6 tháng, nếu trả hết trước tháng 6". Tháng 5, chị có việc cần tiền, chỉ trả được một nửa.

Tháng 7, chị nhận hóa đơn với con số khổng lồ. Hóa ra: lãi suất 0% chỉ áp dụng **nếu** trả hết trước deadline. Nếu không, lãi suất 24%/năm được tính **retroactive từ đầu** - tức là tính lại lãi cho toàn bộ 6 tháng đã qua.
::::

```text
Retroactive interest calculation:
  Tháng 1-6: số dư trung bình ≈ 8,000,000 VNĐ (đơn giản hóa)
  Lãi retroactive: 8,000,000 × 24% × 6/12 = 960,000 VNĐ
  → Xuất hiện trong hóa đơn tháng 7 như một khoản phí bất ngờ
```

**Đây là "deferred interest" model** - phổ biến ở Mỹ, đang bị regulatory nhiều nước hạn chế vì gây confusion cho người tiêu dùng. Tại Việt Nam, model này cần được disclosure rõ ràng.

 **Trong VLP:**

Hệ thống phải hỗ trợ cả hai model:
1. **True 0%**: Lãi suất thực sự là 0%, merchant trả subvention
2. **Deferred interest**: Lãi được defer, tính lại nếu không trả đủ

Hai model này có billing logic hoàn toàn khác nhau trong LAS module. Nhầm lẫn giữa hai model khi implement là nguồn gốc của nhiều bug nghiêm trọng.

:::summary[Cấu Trúc Phí Và Lãi]
4 nhóm phí: Interest, One-time, Recurring, Penalty
APR phải bao gồm tất cả → disclosure obligation
Subvention: merchant trả lãi thay → "0% lãi" là
cơ chế kinh tế hợp lý, không phải magic
Deferred interest ≠ True 0% - phải phân biệt rõ
trong system để tránh billing error
:::

## 3.3 Tariff-Driven Design: Tại sao không Hardcode

### Tình huống: Vấn đề của Hardcode

::::story
Năm 2019, công ty tài chính X có 5 sản phẩm. Dev team implement mỗi sản phẩm với logic riêng trong code:
::::

```java
// Sản phẩm A
if (productType == "POS_LOAN") {
    interest = balance * 0.018 / 12;
    lateFee = 200_000;
}
// Sản phẩm B
if (productType == "CASH_LOAN") {
    interest = balance * 0.021 / 12;
    lateFee = 300_000;
}
// ... 3 sản phẩm nữa
```

Năm 2020: Cần ra 3 sản phẩm mới → thêm 3 if-else → code phức tạp hơn.

Năm 2021: Cần thay đổi late fee từ 200,000 lên 250,000 cho POS_LOAN → phải deploy lại toàn bộ hệ thống → downtime → review cycle 2 tuần.

Năm 2022: Regulatory yêu cầu áp dụng fee mới từ ngày 1/1 → deploy ngay ngày 1/1 lúc 0h00 → ngoài giờ hành chính → incident xảy ra → rollback → vi phạm regulatory deadline.

Đây là thực tế của rất nhiều hệ thống tài chính xây dựng theo kiểu hardcode.

### Tariff-Driven Design: Triết lý

**Khái niệm:**

:::key
**Tariff-driven design** là kiến trúc trong đó toàn bộ logic tính toán phí, lãi, và hành vi billing được **cấu hình trong database** - không nằm trong code. Code chỉ biết cách đọc config và execute logic - không biết gì về số liệu cụ thể.
:::

**Lợi ích:**

| Vấn đề với Hardcode | Giải pháp với Tariff-Driven |
|--------------------|---------------------------|
| Thay đổi rate → deploy code | Thay đổi rate → update database → có hiệu lực ngay |
| Ra sản phẩm mới → code mới | Ra sản phẩm mới → tạo tariff config mới |
| Audit trail của rate change? | Tariff versioning với validFrom/validTo |
| A/B test rate khác nhau? | Hai tariff version song song |
| Lỗi → rollback cả hệ thống | Lỗi → deactivate tariff version |

### Cấu trúc Tariff trong VLP

Tariff system trong VLP có 4 thành phần. Để dễ hiểu, ta giới thiệu từ nhỏ đến lớn (từ chi tiết đến tổng hợp):

*(Chú ý về containment: Tariff **chứa** TariffItems, FeeComponent **tham chiếu** FeeComponentType. Thứ tự giới thiệu dưới đây là từ building block nhỏ nhất lên, không phải thứ tự ownership.)*

**Lớp 1: FeeComponentType - Phân Loại Loại Phí**

> `FeeComponentType` định nghĩa *loại* phí/lãi. Nó không chứa số liệu - chỉ chứa metadata về loại đó.

```text
FeeComponentType Examples:
  Code: INTEREST_CASH
  Description: "Lãi suất cho khoản vay tiền mặt"
  useLatestTariff: false (dùng tariff tại thời điểm tạo khoản vay)

  Code: LATEFEE1
  Description: "Phí phạt trả trễ lần đầu"
  manualCancel: true (có thể cancel thủ công — ví dụ: khiếu nại hợp lệ)

  Code: GENFEE_CO
  Description: "Phí overrun — Collection Order scenario (khi account đang formal collection)"
  authAccBlockCheck: true (chỉ tính khi account không bị block)
```

**FeeComponentType vs TransactionType - Điểm Hay Nhầm Lẫn:**

| | FeeComponentType | TransactionType |
|--|---------------|-----------------|
| Định nghĩa | *Loại phí/lãi* được tạo ra | *Loại giao dịch* nguồn gốc |
| Ví dụ | INTEREST_CASH, LATEFEE1, GENFEE_CO | PURDISB (purchase), PAYIN (payment), BNPLPOS (BNPL) |
| Cardinality | Một giao dịch → tạo nhiều loại phí | Một giao dịch → một TransactionType |
| Tồn tại ở | Trong tariff config (DB) | Trong giao dịch (transaction record) |

*Mối quan hệ:* Một TransactionType `PURDISB` (Repeated Purchase Disbursement - mua hàng trả góp) sẽ trigger việc tạo FeeComponentType `INTEREST_CASH` và có thể `GENFEE_CO` nếu vượt hạn mức.

**Lớp 2: FeeComponent - Chi Tiết Tính Toán**

> `FeeComponent` là một rule tính toán cụ thể - chứa đầy đủ thông tin để tính ra số tiền.

Hãy nhìn vào một FeeComponent cụ thể:

```text
FeeComponent: INTEREST_CASH_STANDARD
  feeComponentType: INTEREST_CASH
  group: "standard"

  [Điều kiện áp dụng]
  limitAmountBasedOn: PRINCIPAL_AMOUNT
  limitAmountFrom: 1,000,000          ← Chỉ áp dụng nếu khoản vay ≥ 1 triệu
  limitAmountTo: 50,000,000           ← Chỉ áp dụng nếu khoản vay ≤ 50 triệu
  limitNumberBasedOn: TERMS
  limitNumberFrom: 6                  ← Chỉ áp dụng nếu kỳ hạn ≥ 6 tháng
  limitNumberTo: 36                   ← Chỉ áp dụng nếu kỳ hạn ≤ 36 tháng

  [Cách tính]
  calculationMethod: PERCENTAGE
  percentage: 0.018                   ← 1.8%/tháng = 21.6%/năm
  percentageBasedOn: OUTSTANDING_DEBT ← Tính trên số dư nợ

  [Rounding]
  rounding: HALF_UP
  roundingScale: 0                    ← Làm tròn về VNĐ nguyên

  [Giới hạn kết quả]
  minAmount: 5,000                    ← Tối thiểu 5,000 VNĐ (tránh phí nhỏ vô nghĩa)
  maxAmount: null                     ← Không có giới hạn trên

  [Thuế]
  taxPercentage: null                 ← Không có VAT trên lãi suất

  [Day count]
  annualRateProjection: DAYS_365
```

**Đọc FeeComponent này:** "Với khoản vay tiền mặt *(INTEREST_CASH)* từ 1 triệu đến 50 triệu, kỳ hạn 6-36 tháng, tính lãi 1.8%/tháng trên số dư nợ thực tế, làm tròn lên về VNĐ nguyên, tối thiểu 5,000 VNĐ."

**Lớp 3: Tariff - Nhóm Các FeeComponent Theo Hiệu Lực**

> `Tariff` là một bundle các FeeComponent với validity period - xác định khi nào áp dụng.

```text
Tariff: STANDARD_2024
  code: "STANDARD"
  version: 3
  validFrom: 2024-01-01
  validTo: 2024-12-31           ← half-open: validTo là exclusive
  tariffItems: [
    INTEREST_CASH_STANDARD,
    INTEREST_CASHLESS_STANDARD,
    LATEFEE1_STANDARD,
    GENFEE_CO_STANDARD,
    ...
  ]

Tariff: STANDARD_2025  // illustrative — actual codes are short (e.g., "SVCFEE", "ORIGFEE")
  code: "STANDARD"  // actual: 2-6 char abbreviation
  version: 4
  validFrom: 2025-01-01
  validTo: null  ← null trong DB → Java convert sang sentinel date
                   (3000-01-01 cho AccountParameter, tùy entity — xem Phụ lục B)
                   Ý nghĩa: tariff này còn hiệu lực không xác định
  tariffItems: [
    INTEREST_CASH_STANDARD_V2,  ← Rate có thể đã thay đổi
    ...
  ]
```

**Tại sao có versioning?**

Khi regulatory thay đổi rate cap từ 20% xuống 18%, công ty phải:
1. Tạo Tariff version mới với rate mới
2. Set validFrom = ngày effective của regulatory change
3. Không động đến Tariff cũ - các khoản vay đang chạy vẫn dùng Tariff cũ

Điều này đảm bảo: khoản vay ký trước ngày thay đổi vẫn theo điều khoản hợp đồng cũ; khoản vay mới tuân theo rate mới.

**Lớp 4: AccountFeeComponentType - Behavior Mapping**

Đây là lớp quan trọng nhất và thường bị underestimate. Nó map giữa `(AccountType, FeeComponentType)` và một tập hợp các hành vi billing.

> `AccountFeeComponentType` *(hay `LAS_FEE_COMPONENT_TO_ACCOUNT)* là "nerve center" của billing - nó quyết định **cách** một loại phí được xử lý trong context của một loại tài khoản cụ thể.

**Các trường behavioral quan trọng:**

```text
AccountFeeComponentType (FLEXI_LIMIT_ACCOUNT, INTEREST_CASH):
  prescribeImmediately: false
  ← Lãi suất KHÔNG tạo EXTRA instalment ngay
  ← Thay vào đó: chờ đến EOM → tạo REGULAR instalment

  applyIr: false
  ← Lãi suất KHÔNG tính lãi trên lãi (không compound)
  ← Đây là điều khoản pháp lý quan trọng

  updatingAvailableAmount: false
  ← Lãi phát sinh KHÔNG làm giảm available credit
  ← Chỉ outstanding debt giảm available credit

  updatingPrincipalAmount: false
  ← Lãi không được cộng vào gốc

AccountFeeComponentType (FLEXI_LIMIT_ACCOUNT, LATEFEE1):
  prescribeImmediately: true
  ← Phí trả trễ TẠO EXTRA instalment ngay lập tức
  ← Không chờ đến EOM

  applyIr: true
  ← Phí trả trễ nếu không được trả → tính lãi trên nó
  ← Incentive để trả phí sớm

  updatingAvailableAmount: true
  ← Phí trả trễ GIẢM available credit
  ← Khách hàng thấy hạn mức giảm → động lực trả sớm
```

**Ý nghĩa kinh tế của từng field:**

| Field | Khi true | Khi false | Mechanism design intent |
|-------|----------|-----------|------------------------|
| `prescribeImmediately` | Tạo EXTRA instalment ngay | Chờ EOM → REGULAR | Phí phạt cần được "visible" ngay để tạo urgency |
| `applyIr` | Lãi tính trên khoản này | Không tính lãi | Compound interest trên phí phạt → incentive trả sớm mạnh hơn |
| `updatingAvailableAmount` | Giảm credit ngay | Không giảm credit | Giảm hạn mức → user nhận ra hậu quả ngay |
| `updatingPrincipalAmount` | Cộng vào gốc | Không cộng vào gốc | Ảnh hưởng đến tính toán lãi tương lai |

**Ví dụ số - Tại sao LATEFEE1 có prescribeImmediately = true:**

Chị Lan trả trễ tháng 3, phát sinh phí LATEFEE1 = 200,000 VNĐ.

Kịch bản A (prescribeImmediately = false - chờ EOM):
- Tháng 3: phí phạt được tạo nhưng chưa có instalment
- Cuối tháng 3 (EOM): mới tạo REGULAR instalment
- Chị Lan thấy phí lần đầu khi nhận sao kê cuối tháng → 3-4 tuần sau khi trả trễ
- Ít "đau" → cure rate thấp hơn

Kịch bản B (prescribeImmediately = true - ngay lập tức):
- Chị Lan trả trễ ngày 5 → ngày 5 có ngay EXTRA instalment 200,000 VNĐ
- App thông báo: "Bạn có khoản phí trả trễ 200,000 VNĐ cần thanh toán ngay"
- Hạn mức giảm 200,000 VNĐ → chị Lan thấy ngay
- "Đau" ngay → cure rate cao hơn

Đây là mechanism design được hiện thực hóa thành một field boolean.

### Từ Business Decision đến Tariff Config: Quy trình

Hãy xem một business decision thực tế được dịch thành tariff config như thế nào:

**Business decision:** "Ra sản phẩm vay tiêu dùng cho giáo viên công lập. Lãi suất 15%/năm (thấp hơn standard 18% vì PD thấp hơn). Phí trả trễ: 150,000 VNĐ (thấp hơn vì segment ít rủi ro). Không phí trả trước (để thu hút segment này)."

**Dịch thành tariff config:**

```text
Bước 1: Tạo FeeComponentType mới (nếu chưa có)
  INTEREST_TEACHER: "Lãi suất dành cho giáo viên"
  LATEFEE1_TEACHER: "Phí trả trễ dành cho giáo viên"
  → Không cần: PREPAYMENT_FEE (sản phẩm này không có)

Bước 2: Tạo FeeComponent với số liệu cụ thể
  INTEREST_TEACHER_ITEM:
    feeComponentType: INTEREST_TEACHER
    percentage: 0.0125  ← 1.25%/tháng = 15%/năm
    ...

  LATEFEE1_TEACHER_ITEM:
    feeComponentType: LATEFEE1_TEACHER
    calculationMethod: FIXED_AMOUNT
    fixedAmount: 150,000
    ...

Bước 3: Tạo Tariff với validity
  TEACHER_PRODUCT_2025:
    validFrom: 2025-03-01
    validTo: null
    items: [INTEREST_TEACHER_ITEM, LATEFEE1_TEACHER_ITEM, ...]

Bước 4: Set AccountFeeComponentType cho AccountType mới
  (TEACHER_ACCOUNT, INTEREST_TEACHER):
    prescribeImmediately: false
    applyIr: false
    ...

Bước 5: Associate Tariff với AccountService của product này
  → ACCMAINT service của tài khoản giáo viên → tariffCode: "TEACHER_PRODUCT_2025"
```

**Không cần deploy code mới.** Toàn bộ sản phẩm mới được tạo ra qua database operations. Đây là tariff-driven design trong thực tế.

:::summary[Tariff-Driven Design]
4 lớp: FeeComponentType → FeeComponent → Tariff →
AccountFeeComponentType
FeeComponentType: loại phí (không có số liệu)
FeeComponent: recipe tính toán (có số liệu)
Tariff: bundle với validity period
AccountFeeComponentType: behavioral mapping
(prescribeImmediately, applyIr, updatingAvail)
→ Ra sản phẩm mới = tạo config, không phải code
:::

## 3.4 Unit Economics của một khoản vay

### Tình huống: Khi Revenue không nói lên tất cả

::::story
Cuối quý, Anh Minh nhận báo cáo từ Finance: "Doanh thu mảng BNPL tăng 40% so với quý trước. Tuyệt vời!"

Nhưng Anh Minh nhìn kỹ hơn và lo lắng. Tăng trưởng doanh thu 40%, nhưng:
- Số lượng khoản vay tăng 80%
- Chi phí origination tăng 75%
- Tỷ lệ vỡ nợ tăng từ 3% lên 5.5%
- NPS *(Net Promoter Score)* giảm 15 điểm

"Chúng ta đang tăng trưởng hay đang chạy nhanh hơn về phía vách đá?" - Anh Minh hỏi thẳng trong meeting.
::::

### P&L của một khoản vay: Revenue

**Ví dụ cụ thể:** Khoản vay của chị Lan - 18,500,000 VNĐ, 18%/năm, 12 tháng.

```text
REVENUE (trong 12 tháng):

Lãi thu được:
  Tổng trả - Gốc = 20,352,960 - 18,500,000 = 1,852,960 VNĐ

Phí định kỳ:
  Phí ACCMAINT: 50,000 × 12 = 600,000 VNĐ
  Phí bảo hiểm: 90,000 × 12 = 1,080,000 VNĐ (nếu có)

Phí một lần:
  Phí thẩm định: 200,000 VNĐ

TOTAL REVENUE: 1,852,960 + 600,000 + 1,080,000 + 200,000 = 3,732,960 VNĐ
Revenue as % of loan: 3,732,960 / 18,500,000 = 20.2%/năm
```

### P&L của một khoản vay: Cost

```text
COST:

Chi phí vốn:
  Cost of funds: 8.5%/năm × 18,500,000 = 1,572,500 VNĐ
  (Nhân với thời gian nắm giữ trung bình ≈ 6 tháng → 786,250 VNĐ)
  Chi phí vốn thực: ≈ 786,250 VNĐ

Chi phí origination (một lần):
  Credit check: 50,000 VNĐ
  Processing: 80,000 VNĐ
  Agent commission (nếu có): 300,000 VNĐ
  System cost: 20,000 VNĐ
  Total origination: 450,000 VNĐ

Chi phí servicing (12 tháng):
  Billing và payment processing: 50,000 VNĐ
  Customer service: 30,000 VNĐ
  System maintenance: 20,000 VNĐ
  Total servicing: 100,000 VNĐ

Expected credit loss:
  EL = PD × LGD × EAD
  EL = 5% × 60% × 18,500,000 = 555,000 VNĐ

Provision cost (accounting):
  Dự phòng rủi ro tín dụng: ≈ 555,000 VNĐ

TOTAL COST: 786,250 + 450,000 + 100,000 + 555,000 = 1,891,250 VNĐ
```

### P&L Summary

```text
REVENUE:   3,732,960 VNĐ  (20.2% of loan)
COST:      1,891,250 VNĐ  (10.2% of loan)
─────────────────────────────────────────
NET MARGIN:  1,841,710 VNĐ  (10.0% of loan)
```

*Margin 10% nghe có vẻ tốt. Nhưng đây là per-loan margin - cần nhân với portfolio size và điều chỉnh cho Unexpected Loss và overhead.*

### Customer Lifetime Value *(CLV)*: Tại sao Retention quan trọng hơn Acquisition

::::story
Bà Hương đối mặt với quyết định ngân sách: tăng chi phí marketing để có thêm 1,000 khách hàng mới, hay đầu tư vào retention program để giữ 1,000 khách hàng hiện có tái vay?

Marketing team báo cáo: "Chi phí acquisition mỗi khách hàng mới là 800,000 VNĐ. Chi phí retention chương trình đề xuất là 200,000 VNĐ/khách hàng."

Nhìn bề ngoài: retention rẻ hơn 4 lần. Nhưng bà Hương cần phân tích CLV để quyết định.
::::

**Khái niệm:**

:::key
**Customer Lifetime Value** *(CLV - Giá trị vòng đời khách hàng)* là tổng lợi nhuận ròng mà một khách hàng tạo ra trong toàn bộ thời gian họ là khách hàng.
:::

```text
CLV = Σ [Net Margin_t / (1+r)^t] cho t = 1 đến T

Trong đó:
  Net Margin_t = lợi nhuận ròng từ khách hàng này tại năm t
  r = discount rate (cost of capital)
  T = thời gian khách hàng ở lại
```

**Ví dụ số:**

Hai profile khách hàng:

*Profile A - Khách hàng mới (thin-file):*
```text
Năm 1: Khoản vay đầu tiên 10 triệu, 12 tháng, net margin 800,000 VNĐ
Năm 2: Tái vay 15 triệu, net margin 1,100,000 VNĐ (xác suất 40%)
Năm 3: Tái vay 20 triệu, net margin 1,400,000 VNĐ (xác suất 25%)

CLV (discount rate 10%):
= 800,000/1.1 + (0.4 × 1,100,000)/1.1² + (0.25 × 1,400,000)/1.1³
= 800,000/1.1 + 440,000/1.21 + 350,000/1.331
= 727,273 + 363,636 + 262,960
= 1,353,869 VNĐ
```

*Profile B - Khách hàng cũ (loyal, 3 năm lịch sử):*
```text
Năm 1: Khoản vay 25 triệu, 18 tháng, net margin 2,500,000 VNĐ
Năm 2: Tái vay 30 triệu, net margin 2,800,000 VNĐ (xác suất 70%)
Năm 3: Tái vay 35 triệu, net margin 3,000,000 VNĐ (xác suất 60%)

CLV (discount rate 10%):
= 2,500,000/1.1 + (0.7 × 2,800,000)/1.1² + (0.6 × 3,000,000)/1.1³
= 2,500,000/1.1 + 1,960,000/1.21 + 1,800,000/1.331
= 2,272,727 + 1,619,835 + 1,352,367
= 5,244,929 VNĐ
```

**So sánh investment:**

```text
Acquisition (Profile A):
  Chi phí marketing: 800,000 VNĐ
  CLV: 1,353,869 VNĐ
  ROI: (1,353,869 - 800,000) / 800,000 = 69%

Retention (Profile B):
  Chi phí retention: 200,000 VNĐ
  CLV: 5,244,929 VNĐ
  ROI: (5,244,929 - 200,000) / 200,000 = 2,522%
```

**Kết luận của bà Hương:** Đầu tư vào retention tạo ra ROI cao hơn gần 40 lần so với acquisition. Đây là lý do tại sao các công ty tài chính trưởng thành chi nhiều hơn cho loyalty programs và cross-sell, ít hơn cho cold acquisition.

### Hệ quả với thiết kế hệ thống

CLV thinking thay đổi cách nhìn về nhiều quyết định kỹ thuật:

**1. Collections strategy:**
Thay vì: "Thu hồi tối đa tiền từ account này"
Nên: "Giúp customer thoát khỏi khó khăn để họ tiếp tục là khách hàng"

→ Ảnh hưởng đến thiết kế collections workflow và hardship program

**2. Prepayment fee:**
Thay vì: "Phí trả trước để bù interest income bị mất"
Nên: "Phí trả trước thấp/không có để khuyến khích tái vay nhanh hơn"

→ Ảnh hưởng đến tariff config: có prepayment fee hay không?

**3. Account closure:**
Thay vì: "Close account ngay khi tất toán"
Nên: "Giữ account active với offer tái vay ngay"

→ Ảnh hưởng đến AccountStatus state machine và workflow sau payoff

**4. Data architecture:**
CLV calculation cần full history của customer - không chỉ current account.
→ Cần customer-level data store, không chỉ account-level.

:::summary[Unit Economics Và CLV]
Revenue = Interest + Recurring fees + One-time fees
Cost = CoF + Origination + Servicing + EL
Net margin per loan: thường 8-12% của loan amount
CLV: tổng NPV của lợi nhuận trong lifetime
Retention ROI >> Acquisition ROI trong mọi case
→ Ảnh hưởng đến collections, closure, data arch
:::

## Tóm tắt chương 3

```text
Từ hai yêu cầu của Sales (cùng 20 triệu, 12 tháng):

Yêu cầu 1 (Cash loan):
→ Product type: Unsecured instalment
→ Tariff: standard rate, standard fees
→ Origination: full credit check
→ Revenue model: interest + fees từ borrower

Yêu cầu 2 (BNPL tủ lạnh, 0% lãi):
→ Product type: BNPL_ECOM, merchant-subsidized
→ Tariff: promo rate, subvention từ merchant
→ Origination: simplified (amount nhỏ, POS flow)
→ Revenue model: merchant fee + potential late fees

Hai sản phẩm khác nhau hoàn toàn —
cần tariff config khác, billing logic khác,
origination flow khác, risk model khác.
Nhưng cùng chạy trên một engine: VLP.
Đây là sức mạnh của tariff-driven design.
```

**Khái niệm cốt lõi đã học:**

| Khái niệm | Ý nghĩa | Ứng dụng |
|-----------|---------|---------|
| Revolving vs Instalment | Hai mô hình tín dụng khác nhau căn bản | Billing logic trong LAS |
| BNPL | Instalment + merchant subsidy + regulatory gap | TransactionType BNPL_ECOM |
| Subvention | Merchant trả lãi thay khách hàng | Flow tiền phức tạp hơn standard |
| Tariff-driven design | Config thay code → agility | 4-lớp tariff structure |
| AccountFeeComponentType | Behavioral mapping | prescribeImmediately, applyIr |
| CLV | Giá trị vòng đời > giá trị một giao dịch | Ảnh hưởng toàn bộ product strategy |

## Câu hỏi tự kiểm tra

**Loại 1 - Nhớ lại:**
1. Revolving credit khác instalment loan ở điểm cơ bản nào? Kể tên hai đặc điểm.
2. Subvention là gì? Trong "0% lãi suất", ai thực sự trả lãi?
3. Tariff system trong VLP có bao nhiêu lớp? Kể tên và chức năng mỗi lớp.
4. `prescribeImmediately = true` có nghĩa là gì trong bối cảnh AccountFeeComponentType?

**Loại 2 - Hiểu:**
5. Tại sao phân loại Revolving vs Instalment quan trọng với kiến trúc hệ thống? Cho ví dụ một khác biệt cụ thể trong billing logic.
6. Minimum payment trap hoạt động như thế nào? Tính toán: với thẻ tín dụng 30 triệu, lãi 24%/năm, MMI = 2% số dư - sẽ mất bao nhiêu tháng để tất toán nếu không chi tiêu thêm?
7. Tại sao tariff-driven design tốt hơn hardcode trong context của regulatory changes? Cho ví dụ cụ thể.
8. Tại sao CLV của khách hàng cũ thường cao hơn nhiều so với khách hàng mới, ngay cả khi loan size tương đương?

**Loại 3 - Áp dụng:**
9. Công ty tài chính muốn ra sản phẩm "Vay sinh viên": 5,000,000 VNĐ, 12%/năm, kỳ hạn 12 tháng, phí thẩm định 100,000 VNĐ, không phí trả trước, phí trả trễ 100,000 VNĐ (cố định).
   - (a) Tính revenue dự kiến per loan (lãi + phí, giả sử không ai trả trễ)
   - (b) Tính APR thực tế
   - (c) Thiết kế FeeComponent cho lãi suất và phí trả trễ sản phẩm này
   - (d) Nên set `prescribeImmediately` cho phí trả trễ là true hay false? Tại sao?

10. Anh Minh đang phân tích hai kịch bản:
    - Kịch bản A: Giữ nguyên phí trả trước 2% (= 370,000 VNĐ với khoản vay 18.5 triệu)
    - Kịch bản B: Bỏ phí trả trước, kỳ vọng tái vay rate tăng từ 35% lên 55%

    Với portfolio 100,000 khoản vay, net margin per loan 1,800,000 VNĐ:
    - (a) Tính revenue từ prepayment fee trong kịch bản A (giả sử 20% trả trước)
    - (b) Tính CLV tăng thêm trong kịch bản B (chỉ tính year 1 tái vay)
    - (c) Khuyến nghị của bạn?

**Loại 4 - Phân tích:**
11. BNPL đang bị regulatory nhiều nước xem xét chặt hơn. Phân tích: nếu Việt Nam yêu cầu BNPL providers phải báo cáo lên credit bureau như các khoản vay thông thường, điều này ảnh hưởng như thế nào đến:
    - (a) Business model của BNPL providers
    - (b) Behavior của người vay
    - (c) Hệ thống VLP cần thay đổi gì?

12. Một công ty tài chính đang cân nhắc chuyển từ tariff-driven sang microservices approach - mỗi sản phẩm là một service riêng với logic riêng. Phân tích trade-offs về: flexibility, maintainability, time-to-market, và risk. Bạn khuyến nghị gì?

## Bài tập áp dụng

**Bài 1 - Thiết Kế Sản Phẩm Và Tariff Config:**

Công ty tài chính Y muốn ra ba sản phẩm mới:
- **Product A:** Vay tiền mặt standard - 5-50 triệu, 12-36 tháng, lãi 18%/năm, phí trả trễ 200,000 VNĐ
- **Product B:** Vay POS điện máy - 2-30 triệu, 6-24 tháng, lãi 15%/năm, phí trả trễ 150,000 VNĐ
- **Product C:** BNPL partner (merchant subsidy) - 1-10 triệu, 3-6 tháng, "0% lãi", merchant trả subvention 10% loan amount

Yêu cầu:
- (a) Xác định điểm khác biệt trong billing logic của ba sản phẩm
- (b) Thiết kế FeeComponentType cần tạo (không cần số liệu cụ thể)
- (c) Thiết kế AccountFeeComponentType behavioral fields cho sản phẩm C
- (d) Với Product C, dòng tiền subvention flow như thế nào trong hệ thống?

**Bài 2 - CLV Analysis:**

Bà Hương có data lịch sử về hai kênh acquisition:
- **Kênh Online (App):** Acquisition cost 400,000 VNĐ, tỷ lệ tái vay năm 2: 45%, năm 3: 30%
- **Kênh POS Merchant:** Acquisition cost 700,000 VNĐ, tỷ lệ tái vay năm 2: 65%, năm 3: 50%

Net margin mỗi khoản vay: năm 1: 1,200,000 VNĐ, năm 2: 1,500,000 VNĐ, năm 3: 1,800,000 VNĐ. Discount rate: 12%/năm.

- (a) Tính CLV 3 năm cho mỗi kênh
- (b) Tính ROI của investment vào mỗi kênh
- (c) Nếu budget chỉ có 2 tỷ VNĐ, nên phân bổ thế nào giữa hai kênh?
- (d) Dữ liệu nào trong VLP cần để track và tính CLV này theo thời gian thực?

**Bài 3 - Phân Tích Cơ Chế Tariff:**

Kỹ sư Tuấn nhận được yêu cầu: "Thêm sản phẩm vay giáo viên vào hệ thống. Bắt đầu từ tuần sau. Không được deploy code."

Tuấn cần:
- (a) Liệt kê đầy đủ các bước cần thực hiện trong database để tạo sản phẩm mới
- (b) Xác định các test case cần kiểm tra sau khi config
- (c) Xác định rủi ro nếu config sai - loại lỗi nào có thể xảy ra?
- (d) Thiết kế rollback plan nếu phát hiện lỗi sau khi đã có khách hàng vay

## Đọc thêm

**Thiết kế sản phẩm tài chính:**
- Fabozzi, F. J. (Ed.). (2012). *Encyclopedia of Financial Models.* Wiley. - Reference comprehensive về các loại sản phẩm tài chính và cấu trúc của chúng.

**BNPL và embedded finance:**
- Philippon, T. (2019). "On Fintech and Financial Inclusion." *NBER Working Paper 26330.* - Phân tích academic về tác động của fintech lên financial inclusion, available free tại nber.org.

**Customer economics:**
- Gupta, S., & Lehmann, D. R. (2005). *Managing Customers as Investments.* Wharton School Publishing. - Book kinh điển về CLV và customer equity.

*Chương 4 sẽ đi theo chân chị Lan xuyên suốt hành trình từ khi cô bắt đầu tìm kiếm khoản vay đến khi trả xong - không chỉ từ góc nhìn quy trình mà còn từ góc nhìn kinh tế học hành vi: tại sao người vay ra quyết định như họ đã ra quyết định, và hệ thống có thể được thiết kế như thế nào để hỗ trợ - chứ không phải khai thác - những quyết định đó.*
