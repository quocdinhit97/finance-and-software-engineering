---
title: "Chương 16. Những nguyên tắc thiết kế bất biến"
sidebar_label: "16. Những nguyên tắc thiết kế bất biến"
sidebar_position: 3
chapter: 16
subtitle: "Timeless Design Principles"
reading_time: 25
description: "Mười chín nguyên tắc đúc kết từ cả cuốn sách, chia năm nhóm: toán học và dữ liệu, kiến trúc hệ thống, quản trị rủi ro, sản phẩm và khách hàng, tổ chức và văn hóa; kèm lá thư gửi người đọc."
source_file: "phan-4-chuong-16.md"
editorial_status: "edited"
---

> *"Công nghệ thay đổi mỗi năm năm. Quy định thay đổi mỗi mười năm. Nhưng những nguyên tắc tốt, về toán học tài chính, về thiết kế hệ thống, về đạo đức kinh doanh, thì không thay đổi. Học một lần, dùng mãi mãi."*

## Dẫn nhập: cuộc trò chuyện cuối năm

::::story
Cuối năm, bà Hương gọi cả đội vào họp. Không xem số liệu, không lập kế hoạch. Bà chỉ hỏi một câu:

*"Nếu ngày mai công ty này đóng cửa, và tất cả chúng ta đi xây một hệ thống tín dụng mới từ trang giấy trắng, chúng ta sẽ làm gì khác đi?"*

Phòng im lặng. Rồi câu trả lời bắt đầu đến. Anh Minh: "Tôi sẽ thiết kế dựa trên biểu phí ngay từ đầu, không viết cứng gì cả." Kỹ sư Tuấn: "Tôi sẽ không dùng `double` cho bất kỳ con số tài chính nào." Chị Nga ở đội collections: "Tôi sẽ gọi cho khách hàng trước khi họ quá hạn, không phải sau."

Chị Lan không có mặt trong phòng. Nhưng cả cuộc trò chuyện, về thiết kế đúng, hệ thống đúng, cách đối xử đúng, là về những người như chị.
::::

Chương này là phần tổng kết. Không có khái niệm mới, chỉ có những nguyên tắc được chưng cất từ mười lăm chương trước, trình bày sao cho bạn mang theo được: vào công việc hằng ngày, vào các quyết định thiết kế, và vào những lúc bị áp lực phải đi tắt.

## 16.1 Nguyên tắc về toán học và dữ liệu

### Nguyên tắc 1: tiền là số chính xác

:::key
**Không bao giờ dùng `float` hay `double` cho số tiền.**
:::

Sai số của số thực dấu phẩy động ở mỗi phép tính rất nhỏ, nhưng hệ thống tài chính thực hiện hàng trăm triệu phép tính mỗi năm. Giả sử cách làm tròn sai khiến mỗi giao dịch lệch trung bình 0.4 đồng: với 300 triệu giao dịch mỗi năm, đó là 120 triệu đồng không thuộc về ai, phân tán trên hàng triệu khách hàng mà không ai nhận ra, cho đến khi một lần kiểm toán hay đối soát phát hiện sổ sách không khớp.

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

**Chiến lược làm tròn:**

Làm tròn ở đúng ranh giới nơi một số tiền trở thành nghĩa vụ thật, và chỉ ở đó. Tiền lãi của mỗi kỳ là một nghĩa vụ thật mà khách hàng phải trả bằng đồng, nên nó được làm tròn về đồng ngay khi tính. Các bước trung gian của một phép tính (lãi suất tháng, hệ số chiết khấu) thì không được làm tròn sớm. Quy tắc làm tròn phải thống nhất và được khai báo trong cấu hình, như VLP dùng HALF_UP về đồng cho tiền lãi mỗi kỳ (Chương 2, Chương 3). Kỳ cuối hấp thụ toàn bộ chênh lệch tích lũy để dư nợ về đúng 0: khoản vay của chị Lan có 11 kỳ 1,696,080 VNĐ và kỳ cuối 1,696,077 VNĐ.

### Nguyên tắc 2: thời gian là một chiều dữ liệu phải tôn trọng

:::key
**Mọi sự kiện tài chính phải được ghi với đúng ngày nó xảy ra, không phải ngày nó được xử lý, và hệ thống phải phân biệt rõ hai loại ngày đó.**
:::

::::story[Một lỗi có thật trong VLP: VLP-706]
Một giao dịch được ghi nhận vào quá khứ (`chargeTransactionInPast=true`): ngày giao dịch đã qua, nhưng hôm nay mới được xử lý. Giao dịch bị từ chối với lỗi "Contract service not found", dù khách hàng hoàn toàn đủ điều kiện.
::::

```text
Nguyên nhân: TransactionService.checkContractService() dùng billingDate
             (ngày trong quá khứ) làm effectiveDate để tra contract service.

Hệ quả: Hôm nay contract service đang ACTIVE, nhưng tại billingDate nó chưa tồn tại
        → Tra cứu thất bại → giao dịch bị từ chối

Gốc rễ: nhầm "ngày dùng để kiểm tra quyền được tính phí"
        với "ngày hiệu lực của giao dịch"

Sửa: khi chargeTransactionInPast=true, dùng timeService.getCurrentDate()
     thay vì billingDate. Bước này kiểm tra quyền tính phí HIỆN TẠI,
     không phải quyền trong quá khứ: dịch vụ phải đang hoạt động HÔM NAY.

Bài học: luôn phân biệt rõ
  billingDate    = ngày của giao dịch (thuộc về quá khứ)
  currentDate    = ngày việc kiểm tra đang diễn ra (hôm nay)
  effectiveDate  = ngày dùng để lọc thực thể (tùy ngữ cảnh)
```

Bốn quy tắc toàn vẹn thời gian rút ra từ cả cuốn sách. Một, nhật ký sự kiện bất biến: sự kiện đã ghi thì không sửa; cần điều chỉnh thì ghi một sự kiện đảo ngược với thời điểm mới, sự kiện gốc vẫn còn đó (Chương 6, Chương 8). Hai, mô hình hai chiều thời gian cho các thực thể quan trọng: ngày trạng thái có hiệu lực trong thực tế và ngày hệ thống biết về nó, vì câu hỏi "tài khoản này thế nào vào ngày 1/1/2023?" cần cả hai (DebtRegister ở Chương 10 là một ví dụ). Ba, kỷ luật múi giờ: lưu UTC, hiển thị giờ địa phương (Việt Nam là UTC+7), không bao giờ lưu giờ địa phương vào cơ sở dữ liệu. Bốn, số học ngày tháng phải dùng thư viện đúng: "31/1 cộng một tháng" là 28/2 hoặc 29/2, không phải 3/3; ngày làm việc phải tính theo lịch nghỉ.

### Nguyên tắc 3: chất lượng dữ liệu là nền móng

:::key
**Một mô hình tín dụng tốt chạy trên dữ liệu xấu cho kết quả tệ hơn một quy tắc đơn giản chạy trên dữ liệu tốt.**
:::

| Chiều chất lượng | Câu hỏi | Ví dụ lỗi | Cách kiểm soát |
|---|---|---|---|
| Đầy đủ | Có đủ dữ liệu cần thiết không? | Thiếu thu nhập, chất lượng quyết định giảm | SLA chất lượng theo từng trường: "trường này phải có ở 99.5% số đơn" |
| Chính xác | Dữ liệu có đúng không? | Gõ nhầm thu nhập 25,000 thay vì 25,000,000 | Kiểm tra khoảng giá trị, định dạng, nhất quán giữa các trường |
| Nhất quán | Cùng khái niệm có cùng định nghĩa ở mọi nơi không? | "Vỡ nợ" là DPD 30+ trong mô hình nhưng DPD 90+ trong báo cáo | Một nguồn sự thật, từ điển dữ liệu |
| Kịp thời | Dữ liệu có đủ mới cho mục đích không? | Dữ liệu tín dụng 90 ngày tuổi cho quyết định thời gian thực | Yêu cầu độ mới theo từng mục đích sử dụng |
| Truy vết | Có lần ngược được về nguồn không? | "Con số thu nhập này từ đâu ra?" | Mỗi biến: hệ thống nguồn + thời điểm + nhật ký biến đổi |

Giám sát cả năm chiều hằng ngày, cảnh báo khi chất lượng tụt dưới ngưỡng, và chặn mô hình chạy nếu chất lượng của một trường then chốt dưới 95%.

:::summary[Mục 16.1]
Tiền dùng số thập phân chính xác, làm tròn ở ranh giới nơi số tiền trở thành nghĩa vụ thật, theo một quy tắc thống nhất, và kỳ cuối hấp thụ chênh lệch. Ngày xảy ra và ngày xử lý là hai chiều khác nhau; sự kiện bất biến, lưu UTC, tính ngày bằng thư viện đúng. Chất lượng dữ liệu được đo theo năm chiều: đầy đủ, chính xác, nhất quán, kịp thời và truy vết được.
:::

## 16.2 Nguyên tắc về kiến trúc hệ thống

### Nguyên tắc 4: thiết kế dựa trên biểu phí

:::key
**Quy tắc kinh doanh thuộc về cơ sở dữ liệu, không thuộc về code. Không bao giờ viết cứng lãi suất, hạn mức hay mức phí vào mã nguồn.**
:::

Giả sử ngày 1/3, cơ quan quản lý thông báo một trần lãi suất mới có hiệu lực từ ngày 1/4. Nếu trần được viết cứng (`if (rate > 0.24) throw ...`), mỗi thay đổi là một vòng sửa code, kiểm thử, triển khai, mất khoảng hai tuần, và nếu triển khai trễ thì công ty vi phạm trong nhiều ngày. Nếu trần nằm trong một bảng cấu hình có ngày hiệu lực, thay đổi là thêm một dòng với `validFrom = 2024-04-01`, mất vài phút, không có rủi ro triển khai, và hệ thống tự áp dụng đúng ngày. (VLP chưa có bước kiểm tra trần lãi suất, như Chương 12 đã chỉ ra; khi bổ sung, nó nên được thiết kế theo cách thứ hai.)

| Luôn là cấu hình | Có thể là cấu hình (tùy tần suất thay đổi) | Nên là code |
|---|---|---|
| Lãi suất (danh nghĩa, phạt), mức phí, giới hạn pháp lý (trần lãi suất, DTI, số tiền tối đa), ngưỡng điểm của các hạng, ngưỡng DPD, độ dài thời gian ân hạn, số lần hoãn thanh toán tối đa, mẫu thông báo | Logic phê duyệt (nếu đổi hằng quý), chiến lược collections (nếu đổi theo mùa), tham số chiến dịch marketing | Thuật toán tính toán (công thức tích lũy lãi), logic kiểm tra định dạng, giao thức tích hợp |

### Nguyên tắc 5: mọi thứ phải truy vết được

:::key
**Nếu không dựng lại được một quyết định từ ba năm trước, bạn sẽ thua trong bất kỳ tranh chấp nào.**
:::

Mọi hệ thống tài chính phải trả lời được ba câu hỏi. **Chuyện gì đã xảy ra?** Nhật ký sự kiện bất biến ghi mọi thay đổi trạng thái của tài khoản, với ai, cái gì, khi nào, vì sao. **Vì sao nó xảy ra?** Nhật ký quyết định ghi mọi đầu vào tại thời điểm quyết định (biến đầu vào, phiên bản mô hình, điểm, quy tắc chính sách đã áp dụng), không dựng lại sau. **Ai quyết định?** Nhật ký phân quyền ghi mọi thao tác ghi kèm định danh người thực hiện, thời điểm và lý do; không có định danh thì không được cập nhật.

Nhật ký kiểm toán chỉ được ghi thêm, không bao giờ sửa hay xóa, và nên lưu tách khỏi cơ sở dữ liệu vận hành. Thời hạn lưu trữ do pháp luật quyết định: ở Việt Nam, chứng từ kế toán dùng trực tiếp để ghi sổ phải lưu tối thiểu 10 năm theo pháp luật kế toán, hồ sơ tín dụng được lưu theo quy định của Luật Các tổ chức tín dụng 2024, còn thay đổi cấu hình nên được giữ suốt vòng đời hệ thống.

### Nguyên tắc 6: tính lũy đẳng và độ bền

:::key
**Mọi API thanh toán phải lũy đẳng. Mọi job EOM phải chạy lại được an toàn. Thiết kế cho giao nhận ít nhất một lần, nhưng hiện thực hóa tính lũy đẳng để hiệu ứng chỉ xảy ra đúng một lần.**
:::

::::story[Một lỗi có thật trong VLP: VLP-670]
Sau EOM, hệ thống ghép kỳ trả nợ vừa được tạo với một khoản thanh toán cũ. Kết quả: `paidAmount` trên InstalmentSummary sai, kéo theo `outstandingDebt` trên CurrentBalance sai, và số dư hiển thị cho khách hàng sai.
::::

```text
Gốc rễ: trạng thái cũ của JPA PersistentBag.
  InstalmentSummary có collection @OneToMany instalments.
  Khi kỳ trả nợ mới được lưu bằng InstalmentDAO.save() (riêng rẽ),
  PersistentBag của InstalmentSummary KHÔNG tự cập nhật.
  → refreshInstalmentSummary() đọc collection cũ
  → tổng sai (thiếu kỳ mới)

Sửa:
  1. InstalmentSummaryService dùng addInstalmentAmountsToHeader()
     thay vì làm mới dựa trên collection (cập nhật cộng dồn,
     không phụ thuộc độ mới của PersistentBag)
  2. refreshInstalmentSummary() được gọi vô điều kiện trong luồng ghép
     (bảo đảm phần header luôn nhất quán sau mỗi lần ghép)

Bài học: với JPA @OneToMany, cẩn thận với PersistentBag cũ
  - Nếu thực thể con được lưu qua DAO riêng, không qua collection của cha,
    collection của cha có thể cũ cho đến khi session được làm mới
  - Dùng thao tác cộng dồn thay vì tổng suy ra từ collection
```

**Lũy đẳng cho API thanh toán:**

```text
Khách bấm "Thanh toán" → mạng chập chờn, hết thời gian chờ → bấm lại
Không có lũy đẳng: trừ tiền hai lần → khách bị thu thừa

Có lũy đẳng:
  Lần 1: idempotency_key = "PAYMENT_C123_20241115_102347_abc123"
         Máy chủ xử lý thanh toán, lưu khóa → trả SUCCESS
  Lần 2 (cùng khóa vì thử lại):
         Máy chủ thấy khóa đã tồn tại → trả CÙNG phản hồi (cùng payment_id)
         → Không thu trùng

  Khóa: UUID do phía gửi sinh ra cho mỗi ý định thanh toán
  Thời gian sống: 24 giờ (cửa sổ thử lại)
  Lưu trữ: cache phân tán (Redis) để tra nhanh
```

### Nguyên tắc 7: thiết kế an toàn khi hỏng

:::key
**Hệ thống sẽ hỏng. Câu hỏi không phải "có hỏng không" mà là "khi nào" và "hỏng thế nào". Thiết kế sao cho kiểu hỏng gây ít hại nhất.**
:::

Khi API trung tâm tín dụng hết thời gian chờ, có bốn lựa chọn: báo lỗi cho khách, vẫn duyệt (không an toàn), xếp hàng chờ xem xét thủ công, hoặc dùng điểm đã cache kèm cờ xem xét. Với khách hàng cũ có lịch sử, điểm cache là đại diện hợp lý; với khách hàng mới, không có kiểm tra tín dụng là rủi ro chưa biết, nên xếp hàng chờ xem xét.

Khi mạng bị chia cắt lúc giải ngân, khách đã ký và lệnh giải ngân đã gửi nhưng không nhận được xác nhận: gửi lại thì có thể giải ngân hai lần, không gửi thì khách không nhận được tiền. Lời giải là trạng thái trung gian cộng lũy đẳng: đánh dấu giải ngân là PENDING, gửi sang ngân hàng kèm khóa lũy đẳng, nhận xác nhận bất đồng bộ rồi chuyển sang COMPLETED. Khi khởi động lại, khóa lũy đẳng ngăn gửi trùng, còn trạng thái PENDING kích hoạt bước đối soát.

:::summary[Mục 16.2]
Quy tắc kinh doanh nằm trong cấu hình có ngày hiệu lực, không nằm trong code. Mọi quyết định phải dựng lại được: chuyện gì, vì sao, ai quyết định, với nhật ký chỉ ghi thêm. API thanh toán và job EOM phải lũy đẳng; lỗi PersistentBag ở VLP-670 cho thấy tổng suy ra từ collection có thể sai âm thầm. Thiết kế cho kiểu hỏng ít hại nhất, với trạng thái trung gian và đối soát.
:::

## 16.3 Nguyên tắc về quản trị rủi ro

### Nguyên tắc 8: tổn thất dự kiến là chi phí, không phải rủi ro

:::key
**Tổn thất dự kiến (EL) đã được tính vào giá. Điều đáng lo là tổn thất ngoài dự kiến (UL): khi thực tế lệch xa kỳ vọng.**
:::

Cách nghĩ sai: "tỷ lệ vỡ nợ 3% của hạng Standard nguy hiểm quá!". Cách nghĩ đúng: "3% đã nằm trong lãi suất 18%; EL = 3% × 62% đã được bù, như mục 12.2 đã tính. Rủi ro thật là khi tỷ lệ vỡ nợ nhảy lên 6%."

Vì vậy thứ cần giám sát là tín hiệu của UL: tỷ lệ vỡ nợ thực tế lệch khỏi dự báo hơn 20%; vỡ nợ có tập trung theo ngành hay vùng không (vỡ nợ cụm là rủi ro hệ thống, tệ hơn nhiều so với vỡ nợ riêng lẻ); LGD có ổn định không; các vintage mới có tệ dần so với vintage cũ không (dấu hiệu drift của mô hình). Dự phòng theo IFRS 9 là phần tổn thất dự kiến được để sẵn: Stage 1 dự phòng EL 12 tháng, Stage 2 dự phòng EL toàn thời hạn khi chất lượng tín dụng suy giảm, Stage 3 dự phòng EL toàn thời hạn cho khoản vay đã suy giảm giá trị. Vốn là tấm đệm cho tổn thất ngoài dự kiến. Cả hai phải đủ, nhưng cho hai loại rủi ro khác nhau (Chương 5).

### Nguyên tắc 9: rủi ro đuôi giết chết công ty

:::key
**Tối ưu cho trường hợp trung bình là không đủ. Hệ thống phải sống sót qua trường hợp xấu nhất.**
:::

Long-Term Capital Management (LTCM) năm 1998 là quỹ định lượng tinh vi nhất thời đó, và các mô hình của họ coi tổn thất cỡ lớn là gần như không thể xảy ra. Khi Nga vỡ nợ, các vị thế vốn bình thường không tương quan với nhau cùng lúc đi ngược chiều LTCM, và quỹ chỉ được cứu nhờ một nhóm ngân hàng do Fed New York điều phối. Bài học: tương quan lịch sử là tương quan của thời bình. Tương quan trong khủng hoảng mới là thứ giết chết bạn.

Trong cho vay tiêu dùng cũng vậy. Thời bình, vỡ nợ là chuyện riêng lẻ của từng người. Khủng hoảng làm vỡ nợ tương quan với nhau vì cú sốc kinh tế chạm vào tất cả. Một danh mục có tỷ lệ vỡ nợ 3% thời bình có thể lên 8% khi khủng hoảng. Kiểm tra sức chịu đựng phải trả lời những câu như: thất nghiệp tăng từ 5% lên 15% thì tỷ lệ vỡ nợ của danh mục là bao nhiêu? Lãi suất huy động tăng 3 điểm phần trăm thì biên lãi còn bao nhiêu? GDP giảm 5% thì tổn thất hai năm là bao nhiêu? Kết quả của những câu hỏi đó, không phải EL thời bình, mới quyết định kế hoạch vốn.

### Nguyên tắc 10: hiệu chuẩn mô hình, tin nhưng phải kiểm

:::key
**Mọi mô hình đều sai. Câu hỏi là sai thế nào, và sai bao nhiêu thì chấp nhận được.**
:::

Nhà thống kê George Box nói: "Mọi mô hình đều sai, nhưng một số hữu ích." Một mô hình có Gini 0.61 là tốt, nhưng Gini đo khả năng xếp hạng khách hàng theo rủi ro, không phải phần trăm vỡ nợ được "giải thích". Ngay cả mô hình tốt nhất cũng không biết ai trong số những người cùng điểm sẽ mất việc vì công ty đóng cửa, ai đang nộp hồ sơ giả mà nó chưa từng thấy, hay khi nào giả định của nó gãy ở một trường hợp biên. Đừng chỉ tối ưu phần mô hình nắm bắt được; hãy quản trị phần nó không nắm bắt được.

Lịch hiệu chuẩn tối thiểu: PSI hằng tháng, Gini trên dữ liệu kết quả tích lũy hằng quý, thẩm định lại toàn bộ hằng năm, và thẩm định theo sự kiện khi có cú sốc kinh tế, thay đổi quy định hay thay đổi sản phẩm (Chương 11). Nếu hiệu chuẩn thất bại, thay mô hình bằng quy tắc thận trọng cho đến khi mô hình huấn luyện lại vượt qua thẩm định.

### Nguyên tắc 11: tập trung là nguy hiểm

:::key
**Một danh mục có 30% rủi ro dồn vào một ngành, một chủ lao động hay một vùng là một danh mục đang chờ phát nổ.**
:::

Hãy hình dung hai bên cho vay trên cùng một thị trường khi một cú sốc như COVID ập đến. Bên thứ nhất tập trung vào một sản phẩm, vào công nhân một ngành sản xuất và vào một vùng; ngành đó bị ảnh hưởng nặng nhất, vùng đó phong tỏa lâu nhất, và tỷ lệ nợ xấu của họ tăng vọt. Bên thứ hai đa dạng hóa, cũng chịu cú sốc nhưng nợ xấu chỉ tăng ở mức bên thứ nhất không thể so được. Cùng thị trường, khác cấu trúc danh mục, khác kết cục.

```text
Hạn mức tập trung (chính sách ví dụ):
  Một chủ lao động: tối đa 3% danh mục
  Một ngành (ví dụ: sản xuất): tối đa 20%
  Một tỉnh: tối đa 25%
  Một sản phẩm (ví dụ: vay mua xe): tối đa 40%

  Giám sát hằng tháng. Cảnh báo ở 80% hạn mức. Chặn cứng ở 100%.

  "Nhưng khách hàng của công ty X thật sự rất tốt!"
  → Đúng, cho đến khi không còn đúng. Tương quan của cả một ngành
    chỉ lộ ra trong khủng hoảng. Hãy phòng trước.
```

:::summary[Mục 16.3]
EL là chi phí đã nằm trong giá; thứ cần giám sát là các tín hiệu của tổn thất ngoài dự kiến. Tương quan trong khủng hoảng khác hẳn thời bình, nên kiểm tra sức chịu đựng mới quyết định kế hoạch vốn. Mọi mô hình đều sai: hiệu chuẩn theo lịch và có phương án thận trọng khi hiệu chuẩn thất bại. Đặt hạn mức tập trung trước khi cần đến.
:::

## 16.4 Nguyên tắc về sản phẩm và khách hàng

### Nguyên tắc 12: đúng sản phẩm, đúng khách hàng, đúng thời điểm

:::key
**Bán sai sản phẩm cho đúng khách hàng cũng tệ như bán đúng sản phẩm cho sai khách hàng.**
:::

::::story
Bà Hạnh, 58 tuổi, hai năm nữa nghỉ hưu, đến chi nhánh hỏi vay 5 triệu trong 6 tháng để sửa nhà. Nhân viên mời: "Cô vay hẳn 50 triệu trong 36 tháng, sửa luôn cả nhà!"

Khoản vay 50 triệu mang lại hoa hồng gấp mười lần. Nhu cầu của bà Hạnh là 5 triệu, ngắn hạn. Thực tế của bà là thu nhập cố định khi nghỉ hưu, không gánh được khoản vay 36 tháng. Nhân viên nhận hoa hồng; bà Hạnh vỡ nợ và lâm vào khó khăn; công ty gánh tổn thất, rủi ro pháp lý và một CLV âm.
::::

Trước khi chào một sản phẩm, kiểm tra ba điều. **Đúng khách hàng:** hồ sơ tài chính (điểm, DTI, độ ổn định thu nhập, nghĩa vụ hiện có) có hỗ trợ sản phẩm này không? Nếu không, đừng chào; gợi ý sản phẩm nhỏ hơn hoặc chờ. **Đúng sản phẩm:** sản phẩm có giải quyết đúng nhu cầu khách nói ra không? "Tôi cần 5 triệu sửa nhà" thì chào 5 triệu, không phải 50. **Đúng thời điểm:** đây có phải giai đoạn cuộc đời phù hợp không? "Tôi 58 tuổi, hai năm nữa nghỉ hưu" thì khoản vay 36 tháng nhiều khả năng sai thời điểm.

Việc của nhân viên là giúp khách có được thứ họ cần, không phải tối đa hóa số tiền vay mỗi khách. Nghe có vẻ cao thượng, và đúng là cao thượng. Nhưng nó cũng có lãi: khách nhận đúng sản phẩm thì ít vỡ nợ hơn, khách cảm thấy được hiểu thì trung thành và giới thiệu người khác.

### Nguyên tắc 13: minh bạch là lợi thế cạnh tranh

:::key
**Khách hàng biết khi nào họ bị dẫn dắt sai. Họ có thể không nói ra. Nhưng họ sẽ không quay lại.**
:::

Khách hàng hiểu rõ điều khoản trước khi ký ít bất ngờ hơn, nên ít khiếu nại hơn; cảm thấy được tôn trọng, nên trung thành hơn; và tin tưởng, nên sẵn lòng giới thiệu. Chương 13 đã cho thấy cơ chế đó qua thí nghiệm của Vela Finance với số tiền khuyến nghị.

| Thực hành xây niềm tin | Thực hành phá niềm tin |
|---|---|
| APR hiển thị nổi bật, không giấu | Điều khoản quan trọng chôn trong tài liệu 40 trang |
| "Đây là tổng số bạn thực sự phải trả", trước khi ký | "Miễn lãi" khi phí thực chất tương đương lãi |
| So sánh với các lựa chọn khác để khách chọn có hiểu biết | Lãi suất thay đổi mà không thông báo rõ ràng |
| Lý do từ chối thực sự hữu ích | Tự động gia hạn khi chưa có đồng ý rõ ràng |
| "Điểm của bạn đã tăng, đây là lãi suất tốt hơn", một cách chủ động | |

### Nguyên tắc 14: tư duy giá trị vòng đời

:::key
**Mọi quyết định với khách hàng nên được cân bằng giá trị cả vòng đời của họ, không chỉ giao dịch hôm nay.**
:::

```text
Tư duy ngắn hạn:
  "Khách này DPD 3, thu thật gắt vào!"
  Kết quả: khách trả dưới áp lực, cảm thấy tệ, rời đi.
  Mất: giả sử khách lẽ ra vay thêm 5 khoản trong tương lai,
       mỗi khoản lãi khoảng 400,000 VNĐ (hạng Standard, mục 12.2)
       → khoảng 2,000,000 VNĐ, chưa kể giá trị giới thiệu

Tư duy dài hạn:
  "Khách này ở với mình 18 tháng, trước đây luôn đúng hạn.
   Đây nhiều khả năng chỉ là trục trặc. Liên hệ theo hướng hỗ trợ."
  Kết quả: khách cure, ở lại, giới thiệu bạn bè.

Quyết định: khi xác suất khó khăn tạm thời cao, chọn cách hỗ trợ.
Khi phân vân, phép tính CLV (Chương 3) thường ủng hộ cách tiếp cận thiện chí.
```

Hệ quả cho tổ chức: chỉ số phải có CLV, không chỉ khối lượng, NIM và tỷ lệ vỡ nợ; mọi thay đổi chính sách nên trả lời "tác động đến CLV là gì?"; và lương thưởng nên có thành phần giữ chân khách hàng.

### Nguyên tắc 15: cho vay có trách nhiệm là cho vay bền vững

:::key
**Cho vay có trách nhiệm không chỉ đúng về đạo đức. Cho vay vô trách nhiệm thường kết thúc bằng tổn thất, chế tài, hoặc cả hai.**
:::

Bằng chứng rõ nhất đến từ phía ngược lại. Năm 2010, ngành tài chính vi mô ở bang Andhra Pradesh, Ấn Độ, sụp đổ sau một thời kỳ tăng trưởng nóng: nhiều người vay mắc nợ chồng nợ từ nhiều tổ chức, các phương thức thu nợ gay gắt bị phản đối dữ dội, chính quyền bang ban hành sắc lệnh siết chặt hoạt động cho vay, và tỷ lệ hoàn trả của cả ngành ở bang này sụp đổ. Những tổ chức tăng trưởng bằng cách bỏ qua khả năng chi trả không chỉ chịu tổn thất tín dụng mà còn mất luôn cả thị trường.

Lý do cho vay có trách nhiệm bền vững hơn rất đơn giản: vỡ nợ thấp hơn thì dự phòng thấp hơn; khách ở lại lâu hơn thì chi phí thu hút được phân bổ trên nhiều khoản vay hơn; niềm tin mang lại giới thiệu, nên chi phí marketing thấp hơn; và tuân thủ tốt thì không bị phạt, không bị hạn chế, được phép tăng trưởng. Căng thẳng duy nhất là khối lượng ngắn hạn có thể thấp hơn.

Giám đốc tài chính: "Tôi cần con số bây giờ, không phải ba năm nữa." Giám đốc rủi ro: "Con số ba năm nữa quyết định chúng ta có còn công ty hay không." Cả hai đều đúng. Mục tiêu là tìm điểm cân bằng.

:::summary[Mục 16.4]
Đúng sản phẩm, đúng khách hàng, đúng thời điểm vừa là đạo đức vừa là mô hình kinh doanh bền vững. Minh bạch xây niềm tin, niềm tin mang lại lòng trung thành và giá trị vòng đời. Quyết định với khách hàng nên được cân bằng CLV, không chỉ giao dịch hôm nay. Cho vay vô trách nhiệm có thể tăng trưởng nhanh, nhưng như Andhra Pradesh năm 2010 cho thấy, nó có thể kéo cả thị trường sụp đổ.
:::

## 16.5 Nguyên tắc về tổ chức và văn hóa

### Nguyên tắc 16: đo đúng điều quan trọng

:::key
**Người ta tối ưu cho những gì được đo. Đo sai thì tối ưu sai, và phá hủy giá trị.**
:::

| Đội | Đo bằng | Hành vi được khuyến khích | Đo tốt hơn bằng |
|---|---|---|---|
| Bán hàng | Chỉ khối lượng | Đẩy khách vay nhiều hơn cần, bỏ qua dấu hiệu về khả năng chi trả | Khối lượng điều chỉnh theo chất lượng (hoa hồng nhân hệ số chất lượng, Chương 13) |
| Collections | Số tiền thu được | Thu tối đa ngắn hạn bằng mọi cách, phá hỏng quan hệ, nhiều khiếu nại | Cure rate và mức hài lòng của khách hàng |
| Sản phẩm | Số tính năng ra mắt | Vội vàng, thiếu kiểm thử, nợ kỹ thuật, gây hại cho khách | Hiệu quả vintage 12 tháng |

Trước khi đặt bất kỳ chỉ số nào, hãy hỏi: nếu tối ưu cho chỉ số này, nó khuyến khích hành vi gì? Đó có phải hành vi mình thực sự muốn không? Nếu không, sửa chỉ số.

### Nguyên tắc 17: dữ liệu soi đường, con người quyết định

:::key
**Dữ liệu không ra quyết định. Dữ liệu cung cấp thông tin cho quyết định. Con người ra quyết định, và con người chịu trách nhiệm về quyết định đó.**
:::

"Mô hình nói từ chối, còn gì để bàn nữa?" là cách nghĩ sai: mô hình là công cụ, bạn mới là người quyết định. "Dữ liệu cho thấy việc này có lãi, làm thôi" cũng sai: dữ liệu có cho thấy mọi tác động không, rủi ro pháp lý, rủi ro danh tiếng, tổn hại dài hạn cho khách hàng? Dữ liệu không bao giờ cho thấy hết.

Một ví dụ: dữ liệu cho thấy đơn nộp gấp có tỷ lệ vỡ nợ cao hơn 15%. Có nên tính lãi cao hơn cho đơn "gấp" không? Dữ liệu không trả lời được, vì đó là câu hỏi chuẩn tắc; con người phải quyết định, cùng Pháp chế, đạo đức và kinh doanh (Chương 12 đã trả lời là không).

Quy trình dựa trên dữ liệu có bảy bước: con người đặt câu hỏi, hệ thống thu thập dữ liệu, nhà khoa học dữ liệu phân tích và mô hình hóa, chuyên viên phân tích cùng chuyên gia nghiệp vụ diễn giải, lãnh đạo kinh doanh ra quyết định và chịu trách nhiệm, hệ thống và con người triển khai và giám sát, con người xem lại kết quả rồi quay lại bước đầu. Trách nhiệm không bao giờ chuyển sang "mô hình" hay "dữ liệu". Người ra quyết định chịu trách nhiệm. Hết.

### Nguyên tắc 18: nhanh và an toàn không phải là đánh đổi

:::key
**"Đi nhanh và phá vỡ mọi thứ" là lời khuyên cho mạng xã hội. Trong tài chính tiêu dùng, thứ bị phá vỡ là đời sống tài chính của con người.**
:::

::::story
Một fintech ra mắt "vay tức thì, không cần chứng minh thu nhập": duyệt trong 30 giây, không giấy tờ. Tỷ lệ chuyển đổi rất cao, tăng trưởng nhanh, số liệu quý rất đẹp.

Một năm sau, nhóm khoản vay đầu tiên đến hạn. Tỷ lệ vỡ nợ cao gấp ba mặt bằng ngành. Cơ quan quản lý hỏi: "Các anh có đánh giá khả năng chi trả không?" Câu trả lời "AI của chúng tôi tự làm" hóa ra không đúng. Kết cục: bị chế tài, buộc giảm tốc, và khách hàng bị tổn hại.
::::

Nhanh mà không an toàn là thất bại nhanh, không phải thành công nhanh. Cách nhìn đúng: "nhanh VÀ an toàn" là một bài toán thiết kế, không phải một sự đánh đổi. Quyết định tín dụng hai giây có tra cứu tín dụng đầy đủ; giải ngân trong ngày khi kiểm tra gian lận đã xong; xử lý hồ sơ trong 24 giờ có kiểm tra chất lượng. Những thứ đó đòi hỏi đầu tư vào **tự động hóa**, không phải bỏ bớt bước. Bỏ bớt bước không phải là nhanh, mà là nợ: nợ kỹ thuật, nợ pháp lý, nợ đạo đức.

### Nguyên tắc 19: văn hóa rút kinh nghiệm không đổ lỗi

:::key
**Khi có lỗi, câu hỏi không phải "ai làm sai?" mà là "hệ thống có lỗ hổng nào để điều này xảy ra?"**
:::

Quay lại lỗi VLP-670 ở nguyên tắc 6. Một lập trình viên thay đổi code, và thay đổi đó gây ra lỗi. Văn hóa đổ lỗi hỏi "ai viết đoạn này?", và kết quả là lập trình viên sợ thay đổi, lỗi bị giấu thay vì báo, chất lượng phần mềm tệ dần. Văn hóa không đổ lỗi hỏi: "Vì sao hệ thống để lỗi này lên được môi trường thật? Lẽ ra phải có kiểm thử nào? Quy trình review hỏng ở đâu? Làm sao để loại lỗi này không thể xảy ra nữa?" Kết quả là kiểm thử tốt hơn, review tốt hơn, kiến trúc tốt hơn, và người sau không lặp lại lỗi cũ.

Một bản rút kinh nghiệm không đổ lỗi gồm bảy phần: chuyện gì đã xảy ra (dòng thời gian, chỉ sự thật); tác động (bao nhiêu khách hàng, bao nhiêu tiền, kéo dài bao lâu); nguyên nhân gốc (kỹ thuật 5 lần hỏi vì sao); các yếu tố góp phần; những gì đã làm tốt; hành động khắc phục (cụ thể, có người chịu trách nhiệm, có hạn); và bài học cho thiết kế về sau. Không có phần "ai làm" hay "ai bị phạt". Sai phạm cố ý là chuyện của quy trình nhân sự riêng; lỗi kỹ thuật luôn được rút kinh nghiệm không đổ lỗi.

:::summary[Mục 16.5]
Người ta tối ưu cho những gì được đo, nên chỉ số phải khuyến khích đúng hành vi. Dữ liệu soi đường nhưng con người quyết định và chịu trách nhiệm. Nhanh và an toàn đạt được cùng lúc bằng tự động hóa, không phải bằng bỏ bớt bước. Khi có lỗi, sửa hệ thống chứ không trừng phạt con người.
:::

## Tổng hợp: 19 nguyên tắc

| Nhóm | # | Nguyên tắc |
|---|---:|---|
| Toán học và dữ liệu | 1 | Số thập phân chính xác cho tiền; làm tròn ở ranh giới nghĩa vụ, theo một quy tắc thống nhất |
| | 2 | Ngày xảy ra khác ngày xử lý; sự kiện bất biến; lưu UTC |
| | 3 | Chất lượng dữ liệu theo năm chiều: đầy đủ, chính xác, nhất quán, kịp thời, truy vết |
| Kiến trúc hệ thống | 4 | Quy tắc kinh doanh nằm trong cấu hình có ngày hiệu lực, không trong code |
| | 5 | Nhật ký kiểm toán bất biến: chuyện gì, vì sao, ai quyết định |
| | 6 | Lũy đẳng: chạy lại an toàn, không có hiệu ứng kép |
| | 7 | Thiết kế cho kiểu hỏng ít hại nhất |
| Quản trị rủi ro | 8 | EL là chi phí đã nằm trong giá; giám sát tổn thất ngoài dự kiến |
| | 9 | Kiểm tra sức chịu đựng cho rủi ro đuôi; tối ưu để sống sót, không chỉ cho trung bình |
| | 10 | Hiệu chuẩn mọi mô hình; có phương án thận trọng khi hiệu chuẩn thất bại |
| | 11 | Đặt hạn mức tập trung trước khi cần |
| Sản phẩm và khách hàng | 12 | Đúng sản phẩm, đúng khách hàng, đúng thời điểm |
| | 13 | Minh bạch xây niềm tin, niềm tin tạo giá trị vòng đời |
| | 14 | Cân bằng quyết định bằng giá trị vòng đời của khách hàng |
| | 15 | Cho vay có trách nhiệm là cho vay bền vững |
| Tổ chức và văn hóa | 16 | Đo những gì muốn khuyến khích, không chỉ những gì dễ đo |
| | 17 | Dữ liệu soi đường, con người quyết định và chịu trách nhiệm |
| | 18 | Nhanh và an toàn là bài toán thiết kế, không phải đánh đổi |
| | 19 | Rút kinh nghiệm không đổ lỗi: sửa hệ thống, không phạt con người |

## 16.6 Lá thư gửi người đọc

*Bạn đã đọc đến đây, và nếu bạn đọc đúng cách, bạn đã làm việc thật sự.*

*Bạn đã tính khoản trả hằng tháng của chị Lan bằng tay. Bạn đã lần theo các bước của EOM. Bạn đã thiết kế một khung kiểm toán công bằng, gỡ một vụ gian lận vận tốc, viết một chatbot không bịa số liệu.*

*Đó là điểm khác biệt của cuốn sách này: không chỉ để đọc, mà để làm.*

**Nhưng còn một điều tôi muốn nói, và điều đó không nói được bằng công thức hay code.**

Tài chính tiêu dùng không chỉ là toán học. Không chỉ là hệ thống. Không chỉ là mô hình kinh doanh.

Đằng sau mỗi `loan_id` là một con người.

Chị Lan, 28 tuổi, nhân viên kế toán, vay để mua một chiếc laptop cho công việc, để tiến xa hơn. Khoản vay 18.5 triệu không lớn trên bảng tính. Nhưng với chị, đó là mười hai tháng tiết kiệm được rút ngắn thành bốn phút. Khi hệ thống của chúng ta duyệt trong bốn phút, đó không chỉ là một giao dịch, đó là một cơ hội.

Khi hệ thống tính lãi suất phù hợp và không giấu phí, đó là sự tôn trọng.

Khi hệ thống liên hệ trước khi khách hàng quá hạn chứ không phải sau, đó là sự quan tâm.

Khi hệ thống giúp chị tất toán sớm một tháng và tiết kiệm được 116,422 đồng, con số đó nhỏ trong bảng tổng kết. Với chị, đó là một bữa tối với gia đình.

**Những nguyên tắc trong chương này**, từ số thập phân chính xác đến thiết kế dựa trên biểu phí đến cho vay có trách nhiệm, không chỉ là thực hành tốt về kỹ thuật. Chúng là cách bảo đảm hệ thống bạn xây phục vụ đúng mục đích: giúp những người như chị Lan tiếp cận vốn một cách công bằng, minh bạch và bền vững.

Bất kỳ hệ thống nào vi phạm những nguyên tắc này, vì bất kỳ lý do hay áp lực nào, đang gây hại cho những con người cụ thể.

**Về tương lai.**

BNPL sẽ tiếp tục phát triển. AI sẽ chấm điểm ngày càng chính xác. Tài chính nhúng sẽ làm tín dụng trở nên vô hình. Quy định sẽ siết lại ở những nơi cần thiết.

Nhưng những điều căn bản không đổi. Người ta vẫn cần vốn để nắm bắt cơ hội. Bên cho vay vẫn cần tiền lãi để bền vững. Rủi ro vẫn cần được đo, định giá và quản trị. Khách hàng vẫn cần được đối xử công bằng và minh bạch. Những điều đó không thay đổi theo công nghệ.

**Về bạn.**

Bạn đọc cuốn sách này vì muốn hiểu, không chỉ muốn biết. Bạn muốn làm được, không chỉ mô tả được.

Giờ thì bạn làm được.

Bạn có thể ngồi với bà Hương và giải thích vì sao lãi suất 21% cho hạng Sub-prime là hợp lý, và vì sao biên của nó mỏng đến vậy. Bạn có thể giải thích với kỹ sư Tuấn vì sao thiết kế dựa trên biểu phí quan trọng hơn viết cứng. Bạn có thể thiết kế một quy trình collections biết phân biệt ai cần sự thấu cảm và ai chỉ cần một lời nhắc.

Và quan trọng hơn, bạn có thể nhận ra khi nào hệ thống đang đi sai hướng, và lên tiếng.

**Lời cuối.**

Năm 1950, anh Bình ngồi đối diện ông Phúc, nhân viên tín dụng. Ông Phúc quyết định bằng cảm tính: đôi khi đúng, đôi khi sai, không nhất quán, không mở rộng được.

Hôm nay, hệ thống của chúng ta quyết định trong bốn phút: nhất quán, mở rộng được, dựa trên dữ liệu. Gini 0.61. PSI dưới 0.10. 82% khách hàng dùng trích nợ tự động.

Nhưng mục tiêu chưa bao giờ là một con số. Mục tiêu là: người như anh Bình, xứng đáng được vay, có được cơ hội. Người chưa thể gánh thêm nợ được bảo vệ khỏi vòng xoáy nợ. Và cả hệ sinh thái, bên cho vay, người vay và xã hội, cùng bền vững.

Đó là lý do ngành này tồn tại. Đó là lý do những gì bạn xây dựng tồn tại.

**Hãy xây dựng tốt.**

## Phụ lục của chương: 19 nguyên tắc, mỗi nguyên tắc một câu

```text
1.  Số thập phân chính xác, không double. Làm tròn ở ranh giới nghĩa vụ.
2.  Ngày xảy ra khác ngày xử lý. Lưu UTC, hiển thị giờ địa phương.
3.  Chất lượng dữ liệu: đo và giám sát, đủ năm chiều.
4.  Cấu hình trong cơ sở dữ liệu. Code cho thuật toán, cấu hình cho quy tắc kinh doanh.
5.  Nhật ký kiểm toán bất biến: chuyện gì, vì sao, ai quyết định.
6.  Khóa lũy đẳng trên mọi thao tác ghi quan trọng.
7.  Thiết kế cho kiểu hỏng, không chỉ cho đường đi thuận lợi.
8.  EL là chi phí, đã nằm trong giá. Giám sát tổn thất ngoài dự kiến.
9.  Kiểm tra sức chịu đựng cho rủi ro đuôi, không tối ưu cho trung bình.
10. Hiệu chuẩn mọi mô hình. Không tin dự báo chưa được kiểm chứng.
11. Hạn mức tập trung đặt trước khi cần, không phải sau.
12. Đúng sản phẩm, đúng khách hàng, đúng thời điểm.
13. Minh bạch → niềm tin → lòng trung thành. Không giấu phí.
14. Cân quyết định bằng giá trị vòng đời của khách hàng.
15. Cho vay có trách nhiệm là cho vay bền vững.
16. Đo những gì muốn khuyến khích, không phải những gì dễ đo.
17. Dữ liệu soi đường, con người quyết định và chịu trách nhiệm.
18. Nhanh và an toàn là bài toán thiết kế, không phải đánh đổi.
19. Rút kinh nghiệm: sửa hệ thống, không phạt con người.
```

*Kiến trúc tín dụng kết thúc ở đây. Không phải vì đã nói hết mọi điều, mà vì nền móng đã đủ để bạn tự đi tiếp.*

*Câu chuyện tiếp theo là của bạn.*
