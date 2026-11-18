---
title: "Chương 3. Thiết kế sản phẩm tài chính"
sidebar_label: "3. Thiết kế sản phẩm tài chính"
sidebar_position: 1
chapter: 3
subtitle: "Financial Product Design"
reading_time: 32
description: "Phân loại sản phẩm tín dụng tiêu dùng, cấu trúc phí và lãi, cơ chế trả góp 0%, thiết kế dựa trên biểu phí (tariff-driven) trong VLP và kinh tế học đơn vị của một khoản vay."
source_file: "phan-1-chuong-3.md"
editorial_status: "edited"
mdx:
  format: mdx
---

import CostStackChart from '@site/src/components/Charts/CostStackChart';

> *"Một sản phẩm tài chính không chỉ là một hợp đồng. Nó là một cấu trúc khuyến khích, một cơ chế phân bổ rủi ro và một lời hứa về tương lai."*

## Dẫn nhập: hai khoản vay giống nhau, hai sản phẩm khác nhau

::::story
Anh Minh là Product Owner ở Vela Finance. Tuần này anh nhận hai yêu cầu từ bộ phận kinh doanh.

**Yêu cầu 1.** "Khách hàng muốn vay 20 triệu, lãi suất thấp nhất có thể, kỳ hạn 12 tháng. Đây là nhân viên văn phòng có lương ổn định."

**Yêu cầu 2.** "Khách hàng muốn vay 20 triệu để mua tủ lạnh tại cửa hàng điện máy đối tác, trả góp 0% lãi suất trong 12 tháng."

Cả hai đều là 20 triệu trong 12 tháng. Nhưng anh Minh biết đây là hai sản phẩm khác nhau, với rủi ro, chi phí và cơ chế vận hành khác nhau. Nếu dùng chung một thiết kế cho cả hai, ít nhất một sản phẩm sẽ không bền vững.

Vì sao? Và hệ thống phải được thiết kế thế nào để hỗ trợ sự đa dạng này mà không trở thành một mớ điều kiện rẽ nhánh?
::::

Chương này trả lời hai câu hỏi đó. Mục 3.1 phân loại sản phẩm tín dụng tiêu dùng. Mục 3.2 phân tích cấu trúc phí và lãi, trong đó có cơ chế "trả góp 0%". Mục 3.3 trình bày thiết kế dựa trên biểu phí *(tariff-driven design)*, cách VLP cho phép hàng chục sản phẩm chạy trên cùng một engine. Mục 3.4 tính lãi lỗ của một khoản vay và giá trị vòng đời của khách hàng.

## 3.1 Phân loại sản phẩm tín dụng tiêu dùng

### Tình huống: phân loại quá đơn giản là phân loại sai

::::story
Bà Hương phỏng vấn ứng viên cho vị trí Product Manager với câu hỏi: "Tài chính tiêu dùng có những loại sản phẩm nào?"

Ứng viên A trả lời: "Vay có tài sản đảm bảo và vay không có tài sản đảm bảo."

Ứng viên B trả lời: "Tín dụng quay vòng và vay trả góp. Nhưng thực tế phức tạp hơn: một tài khoản quay vòng có thể sinh ra các kế hoạch trả góp con, BNPL là một dạng trả góp đặc biệt có trợ cấp từ người bán, và có sản phẩm lai cho phép chuyển qua lại giữa hai chế độ."

Bà Hương chọn ứng viên B. Không phải vì B nói nhiều hơn, mà vì B hiểu rằng một cách phân loại quá đơn giản sẽ tạo ra điểm mù trong thiết kế sản phẩm và hệ thống.
::::

### Chiều phân loại thứ nhất: quay vòng và trả góp

Đây là cách phân loại quan trọng nhất, vì nó quyết định cách hệ thống tính lãi, lập hóa đơn và đo rủi ro.

#### Tín dụng quay vòng (revolving credit)

Người vay được cấp một hạn mức *(credit limit)*. Trong giới hạn đó, họ có thể rút tiền hoặc chi tiêu bất cứ lúc nào, trả lại, rồi rút tiếp. Hạn mức "quay vòng" liên tục. Thẻ tín dụng và hạn mức tín dụng linh hoạt *(flexi limit)* là hai ví dụ điển hình.

Về kỹ thuật, tín dụng quay vòng có bốn đặc điểm:

- Dư nợ thay đổi liên tục theo từng giao dịch.
- Mỗi tháng người vay phải trả tối thiểu một khoản MMI *(minimum monthly instalment)*, thường là một tỷ lệ phần trăm dư nợ hoặc một số tiền tối thiểu cố định.
- Lãi tính trên dư nợ hằng ngày *(daily balance method)*.
- Không có ngày kết thúc cố định; tài khoản tồn tại cho đến khi bị đóng.

Rủi ro đặc thù của sản phẩm này cũng đến từ chính sự linh hoạt đó. EAD khó dự đoán, vì người vay thường rút hết hạn mức trước khi vỡ nợ. Khách hàng có thể tích lũy nợ dần dần mà không nhận ra. Và nếu chỉ trả mức tối thiểu, nợ gốc giảm rất chậm.

::::story
**Bẫy trả tối thiểu.** Chị Lan có một thẻ tín dụng hạn mức 50,000,000 VNĐ và đã dùng hết. Lãi suất 24%/năm, tức 2%/tháng. Ngân hàng phát hành đặt MMI bằng 2% dư nợ, tức 1,000,000 VNĐ.

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

Với MMI đúng bằng tiền lãi, chị Lan trả đều mỗi tháng nhưng dư nợ không bao giờ giảm.
::::

Vì vậy, MMI thường được thiết kế để luôn trả được một phần gốc, ví dụ toàn bộ lãi cộng với max(2% dư nợ, 500,000 VNĐ). Nhưng ngay cả với quy tắc này, nếu chị Lan chỉ trả mức tối thiểu và không chi tiêu thêm, khoản nợ 50 triệu cần 85 tháng, tức hơn bảy năm, mới trả hết, và tổng tiền lãi lên tới khoảng 37.8 triệu đồng, gần bằng ba phần tư số nợ ban đầu.

Đây chính là vấn đề kinh tế học hành vi mà [Chương 13](/docs/intelligence/ch13-behavioral-economics) phân tích, và là lý do nhiều nước yêu cầu sao kê hằng tháng phải ghi rõ "thời gian trả hết nợ nếu chỉ trả mức tối thiểu".

#### Vay trả góp (instalment loan)

Người vay nhận một khoản tiền cố định *(lump sum)* và cam kết trả theo một lịch định sẵn, với số tiền và ngày đến hạn cụ thể, cho đến khi tất toán. Vay mua hàng tại điểm bán (POS loan, ví dụ mua điện thoại, tivi), vay tiền mặt (cash loan) và PHONELOAN (vay trả góp điện thoại) là các ví dụ.

Về kỹ thuật, lịch trả nợ *(amortization schedule)* được xác định từ đầu; khoản trả mỗi kỳ (PMT) cố định theo công thức niên kim ở [Chương 2](/docs/foundations/ch02-mathematics-of-lending); tài khoản đóng khi trả hết; và người vay không thể rút thêm phần gốc đã trả, trừ khi mở khoản vay mới.

| Yếu tố | Quay vòng | Trả góp |
|---|---|---|
| Khả năng dự đoán EAD | Thấp, biến động | Cao, theo lịch trả nợ |
| Mẫu hình PD | Tăng chậm rồi đột biến | Thường đột biến sớm |
| Rủi ro trả trước | Cao, có thể trả bất cứ lúc nào | Thường có phí trả trước |
| Rủi ro hành vi | Cao (tích lũy nợ, bẫy trả tối thiểu) | Thấp hơn |
| Khả năng dự đoán doanh thu | Thấp | Cao |
| Phù hợp với | Khách hàng ổn định, cần linh hoạt | Mua sắm có mục đích cụ thể |

#### Vì sao phân biệt này quan trọng với kiến trúc VLP

Hai loại sản phẩm đòi hỏi logic lập hóa đơn khác nhau:

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

Trong VLP, module quản lý tài khoản LAS phải xử lý cả hai chế độ. Một tài khoản quay vòng còn có thể chứa các kế hoạch trả góp con *(instalment sub-plan)* khi khách hàng chuyển một phần dư nợ sang trả góp cố định. Đây là một trong những điểm phức tạp nhất của hệ thống lõi cho vay tiêu dùng, và [Chương 8](/docs/system/ch08-account-management) sẽ đi sâu vào nó.

### Chiều phân loại thứ hai: có và không có tài sản đảm bảo

Khoản vay **có tài sản đảm bảo** *(secured loan)* gắn với một tài sản cụ thể; nếu người vay không trả, bên cho vay có quyền xử lý tài sản đó. Trong tài chính tiêu dùng thuần túy, loại này tương đối hiếm, chủ yếu là vay mua ô tô hoặc thiết bị có thế chấp.

Phần lớn sản phẩm tài chính tiêu dùng là khoản vay **không có tài sản đảm bảo** *(unsecured loan)*. Bên cho vay chỉ dựa vào khả năng và ý chí trả nợ của người vay. Vì vậy VLP không có module quản lý tài sản đảm bảo. Đó là một quyết định thiết kế có chủ ý, phản ánh mô hình kinh doanh cho vay tín chấp; như [Chương 1](/docs/foundations/ch01-credit-economics) đã phân tích, cái giá của lựa chọn này nằm ở LGD cao hơn và phần bù rủi ro trong lãi suất.

### BNPL: kiến trúc mới, rủi ro cũ

::::story
Kỹ sư Tuấn đọc báo về Nordlane, Kiwipay và làn sóng BNPL *(buy now, pay later)*. Anh hỏi anh Minh: "BNPL là sản phẩm mới hoàn toàn, hay chỉ là vay POS đổi tên?"

Anh Minh trả lời: "Cả hai. Về bản chất kinh tế, BNPL là khoản vay trả góp ngắn hạn. Nhưng mô hình kinh doanh và rủi ro của nó khác đáng kể."
::::

:::key[BNPL]
**BNPL** *(buy now, pay later)* là sản phẩm tín dụng cho phép người mua thanh toán một món hàng thành nhiều đợt, thường 3 đến 4 lần trong 6 đến 8 tuần, và thường không tính lãi nếu trả đúng hạn.
:::

Nếu người mua không trả lãi, nhà cung cấp BNPL kiếm tiền từ đâu? Có ba nguồn:

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

Nguồn thứ nhất là cốt lõi: người bán trả tiền cho nhà cung cấp BNPL vì sản phẩm này giúp họ bán được nhiều hơn. Nguồn thứ hai và thứ ba cho thấy mặt trái: một phần doanh thu đến từ chính những người vay gặp khó khăn.

Rủi ro của BNPL phần lớn là rủi ro cũ trong hình thức mới, nhưng có ba rủi ro thực sự mới:

| Rủi ro | Mới hay cũ | Giải thích |
|---|---|---|
| Lựa chọn bất lợi | Cũ | Người vay rủi ro cao bị thu hút bởi "0% lãi" |
| Rủi ro đạo đức | Cũ | Mua dễ, nên mua thêm, dẫn đến vay quá khả năng |
| Vay BNPL ở nhiều nơi | **Mới** | Không báo cáo lên trung tâm thông tin tín dụng, nên khách hàng vay nhiều nơi cùng lúc mà không bên nào biết |
| Hồ sơ tín dụng mỏng | **Mới** | Nhắm vào phân khúc chưa có lịch sử tín dụng, ít dữ liệu để chấm điểm |
| Khoảng trống pháp lý | **Mới** | Nhiều nước chưa có quy định riêng cho BNPL |

::::story
Chị Lan dùng cùng lúc ba dịch vụ BNPL: 5 triệu mua điện thoại trả 4 lần, 3 triệu mua quần áo trả 3 lần, và 8 triệu mua laptop trả 6 lần.

Tổng nghĩa vụ của chị là 16 triệu, nhưng mỗi nhà cung cấp chỉ thấy khoản của mình. Ở nhiều thị trường, trung tâm thông tin tín dụng chưa nhận dữ liệu BNPL. Không ai biết tổng dư nợ thực sự của chị Lan cho đến khi chị bắt đầu trễ hạn ở tất cả các nơi cùng một lúc.
::::

**BNPL trong VLP.** Giao dịch BNPL thương mại điện tử được xử lý bằng loại giao dịch (TransactionType) `BNPL_ECOM`, thuộc hai nhóm `OUTER_DEBT_TRANSACTION_TYPES` và `DISBURSEMENT_TRANSACTION_TYPES`. Khác với vay POS vốn có quy trình khởi tạo riêng, `BNPL_ECOM` đi theo luồng giao dịch: nó tạo ra một giao dịch nợ ngoài *(outer-debt transaction)* chứ không trực tiếp tạo kế hoạch trả góp. Kế hoạch trả góp (IP, instalment plan) được tạo sau đó qua một luồng đối soát IP riêng, nếu sản phẩm được cấu hình như vậy. Phần trợ cấp từ người bán đi theo luồng ở mục 3.2.

:::summary[Mục 3.1]
Tín dụng quay vòng có hạn mức, lãi tính trên dư nợ hằng ngày, khoản trả tối thiểu và rủi ro hành vi cao. Vay trả góp có lịch trả cố định, PMT đều và rủi ro dễ dự đoán hơn. BNPL là trả góp ngắn hạn có trợ cấp từ người bán, kèm rủi ro vay ở nhiều nơi cùng lúc. Cách phân loại này quyết định logic lập hóa đơn và mô hình rủi ro, không chỉ là một cái nhãn.
:::

## 3.2 Cấu trúc phí và lãi

### Tình huống: "0% lãi suất" không có nghĩa là miễn phí

::::story
Anh Minh vào cửa hàng điện máy và thấy tấm băng rôn lớn: "Trả góp 0% lãi suất, 12 tháng, không phí!" Anh biết thông điệp này không đầy đủ, nhưng cũng không phải lừa đảo. Đằng sau nó là một cấu trúc kinh tế khá tinh vi.

Vậy ai thực sự trả 12 tháng tiền lãi đó?
::::

### Bốn nhóm phí và lãi

Trước khi trả lời câu hỏi trên, cần nhìn toàn bộ "bảng giá" của một khoản vay tiêu dùng.

**Nhóm 1. Lãi suất *(interest)***

| Loại lãi | Khi áp dụng | Đặc điểm |
|---|---|---|
| Lãi thường *(regular interest)* | Trong kỳ bình thường | Tính trên dư nợ, hằng ngày hoặc hằng tháng |
| Lãi phạt *(penalty interest)* | Khi quá hạn | Cao hơn lãi thường, tính trên dư nợ quá hạn |
| Lãi khuyến mãi *(promo rate)* | Trong kỳ khuyến mãi | Thấp hơn lãi thường, có thể bằng 0% |
| Lãi sau khuyến mãi *(post-promo)* | Sau kỳ khuyến mãi | Thường bằng lãi thường, đôi khi tính hồi tố |

**Nhóm 2. Phí một lần *(one-time fees)***

| Loại phí | Thời điểm thu | Ghi chú |
|---|---|---|
| Phí thẩm định *(origination fee)* | Khi giải ngân | Thường trừ thẳng vào số tiền giải ngân |
| Phí tất toán trước hạn *(prepayment fee)* | Khi trả sớm | Bù phần thu nhập lãi bên cho vay bị mất |
| Phí gia hạn *(renewal fee)* | Khi gia hạn khoản vay | Ít phổ biến |

**Nhóm 3. Phí định kỳ *(recurring fees)***

| Loại phí | Tần suất | Ghi chú |
|---|---|---|
| Phí quản lý tài khoản *(maintenance fee)* | Hằng tháng | Dịch vụ tài khoản ACCMAINT, tariff item SVCFEE |
| Phí sao kê *(statement fee)* | Hằng tháng | Nhiều nơi miễn nếu dùng sao kê điện tử |
| Phí bảo hiểm khoản vay | Hằng tháng | Không bắt buộc nhưng thường được bán kèm |
| Phí SMS thông báo | Hằng tháng | Nhỏ, nhưng nhân với số tài khoản thì đáng kể |

Trong VLP, phí quản lý tài khoản là một dịch vụ tài khoản *(account service)* có mã `ACCMAINT`. Số tiền phí được đọc từ tariff item `SVCFEE` (service fee) trong biểu phí gắn với dịch vụ đó; [Chương 9](/docs/system/ch09-billing-cycle) mô tả cách phí này được ghi nhận mỗi kỳ.

**Nhóm 4. Phí phạt *(penalty fees)***

| Loại phí | Khi áp dụng | Đặc điểm |
|---|---|---|
| Phí trả trễ *(late fee)* | DPD ≥ 1 | Cố định hoặc theo % dư nợ |
| Phí vượt hạn mức *(over-limit fee)* | Khi vượt hạn mức | Chỉ với sản phẩm quay vòng |
| Phí thanh toán bị từ chối *(returned payment fee)* | Khi thanh toán thất bại | Ít phổ biến hơn |

### Chi phí thật của khoản vay khi có đủ các loại phí

Quay lại khoản vay của chị Lan: 18,500,000 VNĐ, 18%/năm, 12 tháng. Giả sử khoản vay có thêm phí thẩm định 200,000 VNĐ trừ vào tiền giải ngân, phí bảo hiểm 90,000 VNĐ/tháng và phí quản lý tài khoản 50,000 VNĐ/tháng.

```text
Tiền giải ngân thực nhận: 18,500,000 - 200,000 = 18,300,000 VNĐ
PMT hằng tháng: 1,696,080 VNĐ (kỳ 12: 1,696,077 VNĐ)
Phí bảo hiểm: 90,000 VNĐ/tháng
Phí quản lý tài khoản (ACCMAINT): 50,000 VNĐ/tháng

Tổng phải trả mỗi tháng: 1,696,080 + 90,000 + 50,000 = 1,836,080 VNĐ
Tổng phải trả 12 tháng: 22,032,957 VNĐ
Chi phí tín dụng: 22,032,957 - 18,300,000 = 3,732,957 VNĐ

IRR của dòng tiền: 2.978%/tháng
APR (IRR × 12): ≈ 35.7%/năm
EIR ((1 + IRR)^12 - 1): ≈ 42.2%/năm
Lãi suất danh nghĩa trên hợp đồng: 18%/năm
```

APR cao gần gấp đôi lãi suất danh nghĩa, chênh lệch khoảng 17.7 điểm phần trăm. Phí định kỳ 140,000 VNĐ/tháng nghe nhỏ, nhưng so với dư nợ bình quân chỉ khoảng 10.3 triệu đồng thì nó tương đương hơn 16% mỗi năm. Đó là lý do luật về công bố thông tin tín dụng ở nhiều nước yêu cầu APR phải gồm mọi khoản phí bắt buộc. Phương pháp tính IRR, APR và EIR được trình bày ở [Chương 2, mục 2.2](/docs/foundations/ch02-mathematics-of-lending#22-irr-apr-và-eir-lãi-suất-thật-là-gì); có thể kiểm tra lại bằng [công cụ tính chi phí tín dụng](/docs/tools).

### Giải phẫu "trả góp 0%"

Quay lại tình huống của anh Minh. Cửa hàng bán tủ lạnh giá 15,000,000 VNĐ với "0% lãi suất, 12 tháng". Người mua trả 1,250,000 VNĐ/tháng trong 12 tháng, tổng cộng đúng 15,000,000 VNĐ, không một đồng lãi. Vậy công ty tài chính sống bằng gì?

:::key[Trợ cấp lãi suất (subvention)]
**Subvention** là cơ chế trong đó một bên thứ ba, thường là người bán hoặc nhà sản xuất, trả phần lãi thay cho người mua.
:::

Cách làm phổ biến là chiết khấu khi giải ngân: công ty tài chính không trả cho người bán đủ 15 triệu, mà chỉ trả giá trị hiện tại của 12 khoản 1,250,000 VNĐ, chiết khấu theo lãi suất mà công ty cần đạt được. Phần chênh lệch chính là tiền trợ cấp.

```text
Nếu là khoản vay thường (18%/năm, 12 tháng):
  PMT: 1,375,200 VNĐ/tháng
  Tổng lãi khách hàng trả: 1,502,399 VNĐ

Với trả góp 0% có subvention:
  Khách hàng trả: 1,250,000 VNĐ/tháng × 12 = 15,000,000 VNĐ
  Giá trị hiện tại của 12 khoản đó, chiết khấu 1.5%/tháng: 13,634,382 VNĐ
  Công ty tài chính trả cho cửa hàng: 13,634,382 VNĐ
  Tiền subvention cửa hàng chịu: 15,000,000 - 13,634,382 = 1,365,618 VNĐ
```

Với cùng dòng tiền đó, công ty tài chính đạt đúng lợi suất 18%/năm, như một khoản vay thường. Tiền subvention (1,365,618 VNĐ) thấp hơn tổng lãi của khoản vay thường (1,502,399 VNĐ), vì người bán trả ngay từ đầu chứ không trả dần trong 12 tháng.

**Vì sao người bán chấp nhận trả khoảng 9% giá bán?** Người bán kỳ vọng hai hiệu ứng: nhiều người mua hơn (tỷ lệ chuyển đổi tăng), và người mua chọn mẫu đắt hơn vì "chỉ thêm vài trăm nghìn mỗi tháng" (giá trị đơn hàng bình quân tăng). Nhưng hai hiệu ứng đó có đủ lớn hay không phải được kiểm tra bằng con số:

```text
Giả định: biên lợi nhuận gộp của cửa hàng là 25%

Không có trả góp 0%:
  100 tủ lạnh × 15 triệu = 1.5 tỷ doanh thu
  Lợi nhuận gộp: 1.5 tỷ × 25% = 375 triệu

Có trả góp 0%:
  150 tủ lạnh × 17 triệu (mẫu cao hơn) = 2.55 tỷ doanh thu
  Lợi nhuận gộp: 2.55 tỷ × 25% = 637.5 triệu
  Subvention: 150 × 1,547,701 = 232.2 triệu
  Lợi nhuận sau subvention: 405.3 triệu

Chênh lệch: +30.3 triệu
Nếu biên lợi nhuận gộp chỉ 20%: 510 - 232.2 = 277.8 triệu, thấp hơn 300 triệu
```

Với biên lợi nhuận gộp 25% và giả định doanh số tăng 50%, giá bán bình quân tăng 13%, chương trình chỉ mang lại thêm khoảng 30 triệu đồng. Với biên 20%, chương trình làm người bán lỗ so với không làm gì.

:::key[Trả góp 0% là một bài toán ba bên]
Trả góp 0% có thể là trò chơi tổng dương: người bán bán được nhiều hơn, người mua được trả chậm, bên cho vay đạt lợi suất mong muốn. Nhưng điều đó chỉ đúng khi doanh số tăng thêm đủ bù tiền subvention. Bên cho vay vẫn nhận đủ 18%/năm; câu hỏi chỉ là ai trả.
:::

### Lãi hồi tố: cái bẫy tinh vi

::::story
Chị Lan mua điện thoại với chương trình "0% lãi trong 6 tháng, nếu trả hết trước tháng thứ 6". Tháng thứ 5, chị cần tiền cho việc khác và chỉ trả được một nửa.

Tháng thứ 7, chị nhận hóa đơn với một con số bất ngờ. Hóa ra lãi suất 0% chỉ áp dụng **nếu** trả hết đúng hạn. Nếu không, lãi 24%/năm được tính **hồi tố từ đầu**, tức tính lại lãi cho cả sáu tháng đã qua.
::::

```text
Retroactive interest calculation:
  Tháng 1-6: số dư trung bình ≈ 8,000,000 VNĐ (đơn giản hóa)
  Lãi retroactive: 8,000,000 × 24% × 6/12 = 960,000 VNĐ
  → Xuất hiện trong hóa đơn tháng 7 như một khoản phí bất ngờ
```

Đây là mô hình **lãi hoãn** *(deferred interest)*, phổ biến ở Mỹ và đang bị nhiều nước hạn chế vì gây nhầm lẫn cho người tiêu dùng. Nếu được áp dụng, điều kiện hồi tố phải được công bố rõ ràng ngay từ đầu.

Vì vậy VLP phải phân biệt hai mô hình. Ở mô hình **0% thật**, lãi suất thực sự bằng 0 và người bán trả subvention. Ở mô hình **lãi hoãn**, lãi vẫn được tính nhưng tạm hoãn, và chỉ được miễn nếu khách hàng trả đủ đúng hạn. Hai mô hình có logic lập hóa đơn khác nhau trong LAS; nhầm lẫn giữa chúng khi triển khai là nguồn gốc của nhiều lỗi lập hóa đơn nghiêm trọng.

:::summary[Mục 3.2]
Một khoản vay có bốn nhóm chi phí: lãi, phí một lần, phí định kỳ và phí phạt. APR phải gồm mọi khoản phí bắt buộc; với khoản vay của chị Lan, phí làm APR tăng từ 18% lên khoảng 35.7%. Trả góp 0% không phải phép màu: người bán trả phần lãi qua subvention, và chương trình chỉ có lợi cho người bán khi doanh số tăng đủ để bù khoản đó. Lãi hoãn khác 0% thật và phải được hệ thống phân biệt rõ.
:::

## 3.3 Thiết kế dựa trên biểu phí: vì sao không viết cứng trong code

### Tình huống: cái giá của việc viết cứng

::::story
Năm 2019, một công ty tài chính có năm sản phẩm. Đội phát triển viết logic riêng cho từng sản phẩm ngay trong code.
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

Năm 2020, cần ra thêm ba sản phẩm, nên có thêm ba nhánh `if`. Năm 2021, cần tăng phí trả trễ của `POS_LOAN` từ 200,000 lên 250,000 VNĐ: phải sửa code, chờ hai tuần cho chu trình review và triển khai lại toàn bộ hệ thống. Năm 2022, một quy định mới có hiệu lực từ 0 giờ ngày 1/1, nên đội phải triển khai đúng thời điểm đó, ngoài giờ hành chính; sự cố xảy ra, phải rollback, và công ty trễ hạn tuân thủ.

Nhiều hệ thống tài chính xây theo cách viết cứng đều đi qua đúng con đường này.

### Triết lý của thiết kế dựa trên biểu phí

:::key[Tariff-driven design]
**Thiết kế dựa trên biểu phí** *(tariff-driven design)* là kiến trúc trong đó toàn bộ quy tắc tính phí, tính lãi và hành vi lập hóa đơn được **cấu hình trong cơ sở dữ liệu**, không nằm trong code. Code chỉ biết đọc cấu hình và thực thi; nó không biết bất kỳ con số cụ thể nào.
:::

| Vấn đề khi viết cứng | Giải pháp với biểu phí |
|---|---|
| Đổi lãi suất phải triển khai code | Đổi lãi suất bằng cách cập nhật cấu hình, có hiệu lực theo ngày định sẵn |
| Sản phẩm mới cần code mới | Sản phẩm mới là một bộ cấu hình biểu phí mới |
| Không có lịch sử thay đổi lãi suất | Mỗi biểu phí có phiên bản với `validFrom` và `validTo` |
| Khó thử nghiệm hai mức giá | Hai phiên bản biểu phí chạy song song |
| Lỗi phải rollback cả hệ thống | Lỗi chỉ cần ngừng một phiên bản biểu phí |

### Cấu trúc biểu phí trong VLP

Hệ thống biểu phí của VLP có bốn thành phần. Mục này giới thiệu từ khối nhỏ nhất lên. Cần lưu ý đây không phải thứ tự sở hữu: `Tariff` **chứa** các tariff item, còn `FeeComponent` **tham chiếu** tới `FeeComponentType`.

#### Lớp 1. FeeComponentType: loại phí

`FeeComponentType` định nghĩa *loại* phí hoặc lãi. Nó không chứa con số nào, chỉ chứa thông tin mô tả và một số cờ hành vi.

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

Người mới thường nhầm `FeeComponentType` với `TransactionType`. Hai khái niệm này khác nhau:

| | FeeComponentType | TransactionType |
|---|---|---|
| Định nghĩa | *Loại phí, lãi* được tạo ra | *Loại giao dịch* gốc |
| Ví dụ | `INTEREST_CASH`, `LATEFEE1`, `GENFEE_CO` | `PURDISB` (giải ngân mua hàng), `PAYIN` (thanh toán), `BNPLPOS` (BNPL tại điểm bán) |
| Số lượng | Một giao dịch có thể sinh ra nhiều loại phí | Mỗi giao dịch có đúng một TransactionType |
| Nằm ở đâu | Trong cấu hình biểu phí | Trong bản ghi giao dịch |

Ví dụ, một giao dịch `PURDISB` (giải ngân mua hàng trả góp lặp lại) sẽ sinh ra lãi loại `INTEREST_CASH`, và có thể thêm `GENFEE_CO` nếu vượt hạn mức.

#### Lớp 2. FeeComponent: công thức tính

`FeeComponent` là một quy tắc tính toán cụ thể, chứa đủ thông tin để tính ra số tiền.

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

Đọc thành lời, cấu hình này nói: "Với khoản vay tiền mặt từ 1 triệu đến 50 triệu đồng, kỳ hạn 6 đến 36 tháng, tính lãi 1.8%/tháng trên dư nợ, làm tròn nửa lên *(HALF_UP)* về đồng, tối thiểu 5,000 VNĐ mỗi lần tính." Quy tắc làm tròn được khai báo trong cấu hình chứ không để mặc định của ngôn ngữ lập trình, vì lý do đã phân tích ở [Chương 2, mục 2.5](/docs/foundations/ch02-mathematics-of-lending#25-tại-sao-tài-chính-không-dùng-số-thực-dấu-phẩy-động).

#### Lớp 3. Tariff: nhóm các khoản phí theo thời gian hiệu lực

`Tariff` gom các khoản phí thành một bộ có thời hạn hiệu lực, cho biết bộ phí nào áp dụng vào lúc nào.

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

Trong VLP, mã biểu phí thật là các viết tắt ngắn hai đến sáu ký tự như `SVCFEE` hay `ORIGFEE`; các tên dài như `STANDARD_2025` ở đây chỉ giúp ví dụ dễ đọc.

Khoảng hiệu lực là nửa mở: `validFrom` được tính, `validTo` không được tính. Vì vậy phiên bản sau phải bắt đầu đúng vào ngày `validTo` của phiên bản trước. Nếu `validTo` của phiên bản 3 là 2024-12-31 và phiên bản 4 bắt đầu từ 2025-01-01, ngày 31/12/2024 sẽ không có biểu phí nào hiệu lực; cấu hình đúng phải đặt `validTo` của phiên bản 3 là 2025-01-01. Đây là loại lỗi cấu hình mà bước kiểm tra trước khi kích hoạt biểu phí cần bắt được.

**Vì sao cần phiên bản?** Khi quy định hạ trần lãi suất từ 20% xuống 18%, công ty phải tạo một phiên bản biểu phí mới với lãi suất mới, đặt `validFrom` bằng ngày quy định có hiệu lực, và không động đến phiên bản cũ. Các khoản vay đang chạy tiếp tục dùng biểu phí tại thời điểm ký hợp đồng (cờ `useLatestTariff: false` ở lớp 1), còn khoản vay mới theo lãi suất mới. Hợp đồng cũ được tôn trọng, và quy định mới được tuân thủ.

#### Lớp 4. AccountFeeComponentType: hành vi theo loại tài khoản

Lớp này thường bị đánh giá thấp nhưng lại quan trọng nhất. Nó ánh xạ mỗi cặp `(AccountType, FeeComponentType)` tới một tập hành vi lập hóa đơn. Bảng tương ứng trong cơ sở dữ liệu là `LAS_FEE_COMPONENT_TO_ACCOUNT`. Có thể coi đây là "trung khu thần kinh" của billing: nó quyết định **cách** một loại phí được xử lý trên một loại tài khoản cụ thể.

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

Mỗi cờ là một quyết định thiết kế cơ chế:

| Cờ | Khi `true` | Khi `false` | Ý đồ thiết kế cơ chế |
|---|---|---|---|
| `prescribeImmediately` | Tạo kỳ trả thêm (EXTRA) ngay | Chờ cuối tháng (EOM), gộp vào kỳ thường (REGULAR) | Phí phạt cần hiện ra ngay để tạo cảm giác cấp bách |
| `applyIr` | Khoản này bị tính lãi | Không tính lãi | Tính lãi trên phí phạt chưa trả tạo động lực trả sớm mạnh hơn |
| `updatingAvailableAmount` | Giảm hạn mức khả dụng ngay | Không giảm hạn mức | Hạn mức giảm giúp khách hàng nhận ra hậu quả ngay |
| `updatingPrincipalAmount` | Cộng vào gốc | Không cộng vào gốc | Ảnh hưởng tới cơ sở tính lãi các kỳ sau |

Với lãi thường, `applyIr` và `updatingPrincipalAmount` đều là `false`: lãi không được nhập gốc, nên không phát sinh lãi chồng lãi. Đây là ràng buộc pháp lý, không phải lựa chọn kinh doanh. Với phí trả trễ, cờ `applyIr` là `true` có nghĩa phí phạt chưa trả sẽ bị tính lãi; mức độ được phép của cơ chế này phụ thuộc quy định từng thị trường, nên cần được bộ phận pháp chế xác nhận khi cấu hình.

::::story
**Vì sao `LATEFEE1` có `prescribeImmediately = true`?** Chị Lan trễ hạn kỳ tháng 3 và phát sinh phí trả trễ 200,000 VNĐ.

Nếu `prescribeImmediately = false`, phí được ghi nhận nhưng chưa thành một khoản phải trả. Chỉ đến cuối tháng, bước EOM mới gộp nó vào kỳ thường. Chị Lan thấy khoản phí lần đầu trên sao kê, ba đến bốn tuần sau ngày trễ hạn. Hậu quả đến muộn và mờ nhạt, nên tỷ lệ khách hàng quay lại trả đúng hạn *(cure rate)* thấp hơn.

Nếu `prescribeImmediately = true`, ngay ngày chị trễ hạn đã có một kỳ trả thêm 200,000 VNĐ. Ứng dụng báo: "Bạn có khoản phí trả trễ 200,000 VNĐ cần thanh toán". Hạn mức khả dụng giảm 200,000 VNĐ. Hậu quả hiện ra ngay, và cure rate cao hơn.
::::

Một cơ chế khuyến khích, được hiện thực hóa thành một trường boolean.

### Từ quyết định kinh doanh đến cấu hình biểu phí

Xem một quyết định kinh doanh được dịch thành cấu hình như thế nào. Quyết định: "Ra sản phẩm vay tiêu dùng cho giáo viên công lập. Lãi suất 15%/năm, thấp hơn mức chuẩn 18% vì PD thấp hơn. Phí trả trễ 150,000 VNĐ vì phân khúc ít rủi ro. Không thu phí trả trước để thu hút phân khúc này."

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

Không cần triển khai code mới. Toàn bộ sản phẩm được tạo bằng thao tác trên dữ liệu cấu hình. Điều đó không có nghĩa là không có rủi ro: một con số cấu hình sai cũng nguy hiểm như một dòng code sai, nên cấu hình biểu phí cũng cần review, kiểm thử và phê duyệt như code (xem Bài tập 3).

:::summary[Mục 3.3]
Biểu phí trong VLP có bốn lớp. `FeeComponentType` định nghĩa loại phí, không chứa con số. `FeeComponent` là công thức tính với số liệu cụ thể. `Tariff` gom các khoản phí theo thời gian hiệu lực, có phiên bản để hợp đồng cũ giữ điều khoản cũ. `AccountFeeComponentType` quyết định hành vi của từng loại phí trên từng loại tài khoản qua các cờ như `prescribeImmediately` và `applyIr`. Ra sản phẩm mới là tạo cấu hình, không phải viết code, nhưng cấu hình vẫn cần được kiểm soát chặt như code.
:::

## 3.4 Kinh tế học đơn vị của một khoản vay

### Tình huống: khi doanh thu không nói lên tất cả

::::story
Cuối quý, anh Minh nhận báo cáo từ phòng tài chính: "Doanh thu mảng BNPL tăng 40% so với quý trước."

Anh Minh đọc kỹ hơn và bắt đầu lo. Doanh thu tăng 40%, nhưng số khoản vay tăng 80%, chi phí khởi tạo tăng 75%, tỷ lệ vỡ nợ tăng từ 3% lên 5.5%, và chỉ số NPS *(net promoter score)* giảm 15 điểm.

"Chúng ta đang tăng trưởng, hay đang chạy nhanh hơn về phía vách đá?", anh hỏi thẳng trong cuộc họp.
::::

Doanh thu tăng chậm hơn số khoản vay nghĩa là doanh thu trên mỗi khoản vay đang giảm, trong khi chi phí và tổn thất trên mỗi khoản vay đang tăng. Để thấy điều đó, cần nhìn lãi lỗ của từng khoản vay, tức kinh tế học đơn vị *(unit economics)*.

### Doanh thu của một khoản vay

Lấy khoản vay của chị Lan: 18,500,000 VNĐ, 18%/năm, 12 tháng, phí thẩm định 200,000 VNĐ và phí quản lý tài khoản 50,000 VNĐ/tháng.

```text
REVENUE (12 tháng):

Lãi thu được:
  Tổng trả - Gốc = 20,352,957 - 18,500,000 = 1,852,957 VNĐ

Phí định kỳ:
  Phí quản lý tài khoản (ACCMAINT): 50,000 × 12 = 600,000 VNĐ

Phí một lần:
  Phí thẩm định: 200,000 VNĐ

TOTAL REVENUE: 1,852,957 + 600,000 + 200,000 = 2,652,957 VNĐ
Revenue / số tiền vay: 2,652,957 / 18,500,000 = 14.3%
```

Phí bảo hiểm 90,000 VNĐ/tháng ở mục 3.2 không nằm trong doanh thu này. Khách hàng trả phí đó, nhưng phần lớn được chuyển cho công ty bảo hiểm; bên cho vay thường chỉ nhận hoa hồng. Gộp toàn bộ phí bảo hiểm vào doanh thu là một lỗi phổ biến làm lãi lỗ trông đẹp hơn thực tế.

### Chi phí của một khoản vay

```text
COST:

Chi phí vốn:
  Dư nợ bình quân trong 12 tháng: ≈ 10,294,212 VNĐ
  Cost of funds: 8.5%/năm × 10,294,212 = 875,008 VNĐ

Chi phí khởi tạo (một lần):
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

Expected credit loss (dự phòng):
  EL = PD × LGD × EAD = 5% × 60% × 18,500,000 = 555,000 VNĐ

TOTAL COST: 875,008 + 450,000 + 100,000 + 555,000 = 1,980,008 VNĐ
```

Chi phí vốn tính trên dư nợ bình quân chứ không trên số tiền vay ban đầu, vì khoản vay trả góp giảm dần: bên cho vay chỉ phải huy động vốn cho phần dư nợ còn lại. Ngược lại, EL ở đây dùng EAD bằng toàn bộ số tiền vay, một giả định thận trọng; nếu khách hàng vỡ nợ giữa kỳ, EAD thực tế thấp hơn. Khoản dự phòng EL là một chi phí kế toán, đúng bằng tổn thất dự kiến, không cộng thêm lần nữa.

### Lãi lỗ tổng hợp

```text
REVENUE:     2,652,957 VNĐ  (14.3% số tiền vay)
COST:        1,980,008 VNĐ  (10.7% số tiền vay)
─────────────────────────────────────────
NET MARGIN:    672,949 VNĐ  (3.6% số tiền vay)
```

<CostStackChart
  title="Hình 3.1. Doanh thu và chi phí của khoản vay 18.5 triệu đồng trong 12 tháng"
  categoryKey="side"
  unit=" nghìn"
  data={[
    {side: 'Doanh thu', interest: 1853, maint: 600, orig: 200},
    {side: 'Chi phí', cof: 875, acq: 450, serv: 100, el: 555},
  ]}
  series={[
    {key: 'interest', label: 'Lãi', color: '#0b8a66'},
    {key: 'maint', label: 'Phí quản lý tài khoản', color: '#5fb89a'},
    {key: 'orig', label: 'Phí thẩm định', color: '#a8dcc8'},
    {key: 'cof', label: 'Chi phí vốn', color: '#2f6f9f'},
    {key: 'acq', label: 'Chi phí khởi tạo', color: '#9b6a9e'},
    {key: 'serv', label: 'Chi phí vận hành', color: '#6b8f71'},
    {key: 'el', label: 'Tổn thất dự kiến', color: '#c98a2b'},
  ]}
  caption="Đơn vị: nghìn VNĐ, làm tròn. Biên lợi nhuận trước thuế và chi phí chung khoảng 673 nghìn đồng, tức 3.6% số tiền vay."
/>

Biên lợi nhuận 3.6% số tiền vay, trước thuế và trước chi phí chung của doanh nghiệp (trụ sở, công nghệ, marketing thương hiệu). Con số này mỏng hơn nhiều so với ấn tượng "lãi suất 18%" gợi ra, và cho thấy ba điều. Thứ nhất, chi phí khởi tạo là chi phí cố định cho mỗi khoản vay, nên khoản vay nhỏ hoặc kỳ hạn ngắn rất khó có lãi. Thứ hai, chỉ cần PD tăng từ 5% lên 8%, EL tăng thêm 333,000 VNĐ và biên lợi nhuận giảm gần một nửa; đó chính là nỗi lo của anh Minh trong tình huống đầu mục. Thứ ba, khách hàng vay lại lần hai không phải trả lại chi phí khởi tạo đầy đủ, nên giữ chân khách hàng có giá trị rất lớn.

### Giá trị vòng đời khách hàng

::::story
Bà Hương phải quyết định ngân sách: tăng chi marketing để có thêm 1,000 khách hàng mới, hay đầu tư chương trình giữ chân để 1,000 khách hàng hiện có vay lại?

Phòng marketing báo cáo: chi phí có một khách hàng mới là 800,000 VNĐ, còn chương trình giữ chân tốn 200,000 VNĐ mỗi khách hàng.

Nhìn qua thì giữ chân rẻ hơn bốn lần. Nhưng bà Hương cần phân tích giá trị vòng đời khách hàng trước khi quyết định.
::::

:::key[Giá trị vòng đời khách hàng (CLV)]
**Customer lifetime value** *(CLV)* là tổng giá trị hiện tại của lợi nhuận ròng mà một khách hàng tạo ra trong suốt thời gian họ còn là khách hàng.
:::

$$
CLV = \sum_{t=1}^{T} \frac{p_t \times M_t}{(1+r)^t}
$$

trong đó $M_t$ là lợi nhuận ròng từ khách hàng ở năm $t$, $p_t$ là xác suất khách hàng còn vay ở năm $t$, $r$ là suất chiết khấu (chi phí vốn chủ sở hữu) và $T$ là số năm xem xét.

**Khách hàng A, khách hàng mới, hồ sơ tín dụng mỏng.** Năm 1 vay 10 triệu, lợi nhuận ròng 800,000 VNĐ. Năm 2 vay lại 15 triệu với xác suất 40%, lợi nhuận 1,100,000 VNĐ. Năm 3 vay lại 20 triệu với xác suất 25%, lợi nhuận 1,400,000 VNĐ.

```text
CLV (discount rate 10%):
= 800,000/1.1 + (0.4 × 1,100,000)/1.1² + (0.25 × 1,400,000)/1.1³
= 727,273 + 363,636 + 262,960
= 1,353,869 VNĐ
```

**Khách hàng B, khách hàng lâu năm, ba năm lịch sử tốt.** Năm 1 vay 25 triệu trong 18 tháng, lợi nhuận 2,500,000 VNĐ. Năm 2 vay lại 30 triệu với xác suất 70%, lợi nhuận 2,800,000 VNĐ. Năm 3 vay lại 35 triệu với xác suất 60%, lợi nhuận 3,000,000 VNĐ.

```text
CLV (discount rate 10%):
= 2,500,000/1.1 + (0.7 × 2,800,000)/1.1² + (0.6 × 3,000,000)/1.1³
= 2,272,727 + 1,619,835 + 1,352,367
= 5,244,929 VNĐ
```

Một cách so sánh hay gặp là chia CLV cho chi phí:

```text
Acquisition (khách hàng A):
  ROI = (1,353,869 - 800,000) / 800,000 = 69%

Retention (khách hàng B):
  ROI = (5,244,929 - 200,000) / 200,000 = 2,522%
```

:::caution[Phép so sánh này phóng đại lợi ích của giữ chân khách hàng]
Khách hàng B có CLV cao vì họ đã là khách hàng tốt, không phải vì chương trình giữ chân. Chi 200,000 VNĐ chỉ tạo ra phần CLV **tăng thêm** nhờ chương trình. Nếu chương trình nâng xác suất vay lại năm 2 của khách hàng B từ 70% lên 80%, phần tăng thêm là $0.1 \times 2,800,000 / 1.1^2 \approx 231,405$ VNĐ, tức ROI khoảng 16%, chứ không phải 2,522%. Với khách hàng mới, toàn bộ CLV là phần tăng thêm, vì không chi thì không có khách hàng đó.
:::

Kết luận đúng của bà Hương vì vậy tinh tế hơn: giữ chân khách hàng tốt thường đáng đầu tư, vì khách hàng cũ có PD thấp hơn, không mất lại chi phí khởi tạo đầy đủ và vay khoản lớn hơn. Nhưng mỗi chương trình phải được đo bằng phần CLV tăng thêm mà nó thực sự tạo ra, thường qua thử nghiệm có nhóm đối chứng. Đây là lý do các công ty tài chính trưởng thành đầu tư vào dữ liệu để đo hiệu quả giữ chân, chứ không chỉ chi tiền cho nó.

### Hệ quả với thiết kế hệ thống

Tư duy CLV thay đổi nhiều quyết định kỹ thuật.

**Chiến lược thu hồi nợ.** Thay vì "thu tối đa từ tài khoản này", mục tiêu trở thành "giúp khách hàng vượt qua khó khăn để họ tiếp tục là khách hàng". Điều này ảnh hưởng tới thiết kế quy trình thu hồi nợ và chương trình hỗ trợ khách hàng gặp khó khăn ([Chương 10](/docs/system/ch10-collections)).

**Phí trả trước.** Thay vì "thu phí trả trước để bù thu nhập lãi bị mất", có thể chọn "phí thấp hoặc không thu, để khách hàng sớm vay lại". Quyết định này nằm trong cấu hình biểu phí.

**Đóng tài khoản.** Thay vì đóng tài khoản ngay khi tất toán, có thể giữ tài khoản hoạt động kèm một đề nghị vay lại. Điều này ảnh hưởng tới máy trạng thái `AccountStatus` và quy trình sau tất toán.

**Kiến trúc dữ liệu.** Tính CLV cần toàn bộ lịch sử của khách hàng, không chỉ tài khoản hiện tại. Hệ thống vì vậy cần kho dữ liệu ở cấp khách hàng, không chỉ ở cấp tài khoản.

:::summary[Mục 3.4]
Doanh thu của một khoản vay gồm lãi, phí định kỳ và phí một lần; phí bảo hiểm thu hộ không phải doanh thu. Chi phí gồm chi phí vốn tính trên dư nợ bình quân, chi phí khởi tạo, chi phí vận hành và tổn thất dự kiến. Với khoản vay của chị Lan, biên lợi nhuận chỉ khoảng 3.6% số tiền vay, rất nhạy với PD và chi phí khởi tạo. CLV giải thích vì sao giữ chân khách hàng tốt có giá trị, nhưng hiệu quả của chương trình giữ chân phải được đo bằng phần CLV tăng thêm.
:::

## Tổng kết chương 3

Quay lại hai yêu cầu của bộ phận kinh doanh, cùng 20 triệu đồng trong 12 tháng:

| | Yêu cầu 1: vay tiền mặt | Yêu cầu 2: tủ lạnh trả góp 0% |
|---|---|---|
| Loại sản phẩm | Trả góp, không tài sản đảm bảo | Trả góp có trợ cấp từ người bán (POS hoặc `BNPL_ECOM`) |
| Biểu phí | Lãi suất và phí chuẩn | Lãi suất khuyến mãi, subvention từ người bán |
| Khởi tạo | Thẩm định tín dụng đầy đủ | Rút gọn, số tiền nhỏ, luồng tại điểm bán |
| Nguồn doanh thu | Lãi và phí từ người vay | Subvention từ người bán, có thể thêm phí trả trễ |

Hai sản phẩm khác nhau từ biểu phí, logic lập hóa đơn, quy trình khởi tạo đến mô hình rủi ro. Nhưng cả hai chạy trên cùng một engine. Đó là sức mạnh của thiết kế dựa trên biểu phí.

### Những điểm cần ghi nhớ

| Khái niệm | Ý nghĩa | Liên hệ với VLP |
|---|---|---|
| Quay vòng và trả góp | Hai mô hình tín dụng khác nhau căn bản | Hai logic lập hóa đơn trong LAS |
| BNPL | Trả góp ngắn hạn, trợ cấp từ người bán, khoảng trống pháp lý | TransactionType `BNPL_ECOM` |
| Subvention | Người bán trả phần lãi thay khách hàng, qua chiết khấu khi giải ngân | Luồng tiền khác khoản vay chuẩn |
| APR | Chi phí tín dụng gồm mọi khoản phí bắt buộc | Phí làm APR khoản vay mẫu tăng từ 18% lên khoảng 35.7% |
| Thiết kế dựa trên biểu phí | Cấu hình thay cho code | Bốn lớp biểu phí, có phiên bản |
| AccountFeeComponentType | Hành vi của từng loại phí trên từng loại tài khoản | `prescribeImmediately`, `applyIr` |
| Kinh tế học đơn vị | Lãi lỗ của từng khoản vay | Biên lợi nhuận mỏng, nhạy với PD |
| CLV | Giá trị vòng đời lớn hơn giá trị một giao dịch | Cần dữ liệu ở cấp khách hàng |

### Thuật ngữ quan trọng

Tín dụng quay vòng (revolving credit), vay trả góp (instalment loan), khoản trả tối thiểu (MMI), BNPL, trợ cấp lãi suất (subvention), lãi hoãn (deferred interest), APR, thiết kế dựa trên biểu phí (tariff-driven design), FeeComponentType, FeeComponent, Tariff, kinh tế học đơn vị (unit economics), giá trị vòng đời khách hàng (CLV). Xem định nghĩa trong trang [Thuật ngữ](/docs/glossary).

## Câu hỏi tự kiểm tra

**Nhớ lại**

1. Tín dụng quay vòng khác vay trả góp ở điểm cơ bản nào? Kể hai đặc điểm kỹ thuật.
2. Subvention là gì? Trong chương trình "trả góp 0%", ai thực sự trả lãi?
3. Hệ thống biểu phí trong VLP có bao nhiêu lớp? Kể tên và chức năng của từng lớp.
4. `prescribeImmediately = true` có nghĩa gì trong `AccountFeeComponentType`?

**Hiểu**

5. Vì sao phân loại quay vòng và trả góp quan trọng với kiến trúc hệ thống? Cho một ví dụ khác biệt cụ thể trong logic lập hóa đơn.
6. Bẫy trả tối thiểu hoạt động như thế nào? Với thẻ tín dụng dư nợ 30 triệu, lãi 24%/năm, MMI bằng 2% dư nợ và không chi tiêu thêm, cần bao nhiêu tháng để trả hết? Nếu MMI đổi thành toàn bộ lãi cộng max(2% dư nợ, 500,000 VNĐ) thì sao?
7. Vì sao thiết kế dựa trên biểu phí xử lý thay đổi quy định tốt hơn cách viết cứng trong code? Cho một ví dụ.
8. Vì sao CLV của khách hàng lâu năm thường cao hơn nhiều so với khách hàng mới, ngay cả khi số tiền vay tương đương?

**Áp dụng**

9. Công ty muốn ra sản phẩm "vay sinh viên": 5,000,000 VNĐ, 12%/năm, kỳ hạn 12 tháng, phí thẩm định 100,000 VNĐ trừ vào tiền giải ngân, không thu phí trả trước, phí trả trễ cố định 100,000 VNĐ.
   (a) Tính doanh thu dự kiến trên mỗi khoản vay (lãi và phí, giả sử không ai trả trễ).
   (b) Tính APR và EIR.
   (c) Thiết kế `FeeComponent` cho lãi suất và phí trả trễ của sản phẩm này.
   (d) Nên đặt `prescribeImmediately` cho phí trả trễ là `true` hay `false`? Vì sao?
10. Anh Minh phân tích hai kịch bản cho danh mục 100,000 khoản vay, mỗi khoản 18.5 triệu đồng, lợi nhuận ròng 700,000 VNĐ mỗi khoản. Kịch bản A giữ phí trả trước 2% (370,000 VNĐ mỗi khoản). Kịch bản B bỏ phí trả trước, kỳ vọng tỷ lệ vay lại tăng từ 35% lên 55%.
    (a) Tính doanh thu từ phí trả trước trong kịch bản A, giả sử 20% khách hàng trả trước.
    (b) Tính lợi nhuận tăng thêm trong kịch bản B, chỉ tính khoản vay lại trong năm đầu.
    (c) Bạn khuyến nghị kịch bản nào? Còn cần thêm dữ liệu gì?

**Phân tích**

11. Nếu Việt Nam yêu cầu nhà cung cấp BNPL báo cáo lên trung tâm thông tin tín dụng như khoản vay thông thường, điều này ảnh hưởng thế nào tới (a) mô hình kinh doanh của nhà cung cấp BNPL, (b) hành vi người vay, và (c) những gì VLP cần thay đổi?
12. Một công ty tài chính cân nhắc bỏ thiết kế dựa trên biểu phí, chuyển sang mô hình mỗi sản phẩm là một microservice với logic riêng. Phân tích đánh đổi về tính linh hoạt, khả năng bảo trì, thời gian ra thị trường và rủi ro. Bạn khuyến nghị gì?

## Bài tập áp dụng

**Bài 1. Thiết kế sản phẩm và cấu hình biểu phí.** Một công ty tài chính muốn ra ba sản phẩm: (A) vay tiền mặt chuẩn, 5 đến 50 triệu, 12 đến 36 tháng, lãi 18%/năm, phí trả trễ 200,000 VNĐ; (B) vay POS điện máy, 2 đến 30 triệu, 6 đến 24 tháng, lãi 15%/năm, phí trả trễ 150,000 VNĐ; (C) BNPL với đối tác, 1 đến 10 triệu, 3 đến 6 tháng, "0% lãi", người bán trả subvention. (a) Xác định khác biệt trong logic lập hóa đơn của ba sản phẩm. (b) Liệt kê các `FeeComponentType` cần tạo, không cần số liệu. (c) Thiết kế các cờ hành vi của `AccountFeeComponentType` cho sản phẩm C. (d) Với sản phẩm C kỳ hạn 6 tháng và lợi suất mục tiêu 18%/năm, tính tỷ lệ subvention trên giá bán, và mô tả luồng tiền subvention trong hệ thống.

**Bài 2. Phân tích CLV theo kênh.** Bà Hương có dữ liệu về hai kênh. Kênh ứng dụng: chi phí có khách hàng 400,000 VNĐ, tỷ lệ vay lại năm 2 là 45%, năm 3 là 30%. Kênh đối tác bán lẻ: chi phí có khách hàng 700,000 VNĐ, tỷ lệ vay lại năm 2 là 65%, năm 3 là 50%. Lợi nhuận ròng mỗi khoản vay: năm 1 là 1,200,000 VNĐ, năm 2 là 1,500,000 VNĐ, năm 3 là 1,800,000 VNĐ. Suất chiết khấu 12%/năm. (a) Tính CLV ba năm của mỗi kênh. (b) Tính ROI của mỗi kênh. (c) Với ngân sách 2 tỷ đồng, nên phân bổ thế nào? Cần giả định gì về khả năng mở rộng của từng kênh? (d) VLP cần lưu dữ liệu gì để theo dõi CLV theo thời gian thực?

**Bài 3. Rủi ro của cấu hình.** Kỹ sư Tuấn nhận yêu cầu: "Thêm sản phẩm vay giáo viên vào hệ thống, bắt đầu từ tuần sau, không được triển khai code." (a) Liệt kê đầy đủ các bước cấu hình cần thực hiện. (b) Xác định các ca kiểm thử cần chạy sau khi cấu hình, trong đó có kiểm tra khoảng hiệu lực `validFrom`/`validTo` giữa các phiên bản. (c) Nếu cấu hình sai, những loại lỗi nào có thể xảy ra? (d) Thiết kế kế hoạch khắc phục nếu phát hiện lỗi sau khi đã có khách hàng vay.

## Đọc thêm

**Thiết kế sản phẩm tài chính**

- Fabozzi, F. J. (Ed.) (2012). *Encyclopedia of Financial Models.* Wiley. Tài liệu tham khảo tổng quát về các loại sản phẩm tài chính và cấu trúc của chúng.

**Fintech và BNPL**

- Philippon, T. (2019). "On Fintech and Financial Inclusion." *NBER Working Paper 26330.* Phân tích học thuật về tác động của fintech tới tài chính toàn diện, đọc miễn phí tại nber.org.

**Kinh tế học khách hàng**

- Gupta, S. & Lehmann, D. R. (2005). *Managing Customers as Investments.* Wharton School Publishing. Sách kinh điển về CLV và giá trị tài sản khách hàng.

Chương 4 đi theo chị Lan trong suốt hành trình, từ lúc bắt đầu tìm khoản vay đến khi trả xong, không chỉ dưới góc nhìn quy trình mà cả kinh tế học hành vi: vì sao người vay quyết định như vậy, và hệ thống nên được thiết kế để hỗ trợ, chứ không khai thác, những quyết định đó. [Chương 4. Hành trình khách hàng](/docs/products/ch04-customer-journey).
