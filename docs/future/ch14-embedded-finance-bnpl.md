---
title: "Chương 14. BNPL và tài chính nhúng: tín dụng vô hình"
sidebar_label: "14. BNPL và tài chính nhúng"
sidebar_position: 1
chapter: 14
subtitle: "BNPL and Embedded Finance: Invisible Credit"
reading_time: 22
description: "Mô hình kinh doanh và kinh tế đơn vị của BNPL, kiến trúc tài chính nhúng năm tầng, rủi ro thin-file, gian lận vận tốc và chồng nợ, quyết định tín dụng dưới ba giây, các mẫu tích hợp với người bán, xu hướng quản lý BNPL và tương lai của tài chính theo ngữ cảnh."
source_file: "phan-4-chuong-14.md"
editorial_status: "edited"
---

> *"Khoản vay tốt nhất là khoản vay bạn không cảm thấy mình đang vay."*
>
> *Nhận xét của một nhà thiết kế sản phẩm sau khi thử nghiệm A/B giữa giao diện BNPL và giao diện vay truyền thống*

## Dẫn nhập: khi tín dụng biến mất

::::story
Tháng 11/2023, chị Thu mua một chiếc máy lọc không khí 6,000,000 VNĐ trên Chợ Sao. Ở bước thanh toán cuối cùng, một lựa chọn xuất hiện: "Trả góp 0%, 6 tháng × 1,000,000 VNĐ."

Chị bấm chọn, nhập OTP, xong.

Không có biểu mẫu dài, không có nhân viên tín dụng, không có "đang xét duyệt", không có cảm giác "đang vay tiền".

Nhưng trong ba giây đó, một quyết định tín dụng đã diễn ra: trung tâm thông tin tín dụng được tra cứu, điểm được tính, hạng rủi ro được gán, mức trợ giá của người bán được xác định, và một khoản vay 6 triệu đồng đã được khởi tạo.

Đó là **tài chính nhúng** *(embedded finance)*: tài chính được nhúng vào luồng mua sắm, vô hình với người dùng.
::::

Chương này phân tích BNPL và tài chính nhúng từ bốn góc độ: mô hình kinh doanh (ai kiếm tiền, từ đâu), công nghệ (làm sao để mọi thứ xảy ra trong ba giây), rủi ro (điều gì có thể sai), và tương lai (ngành đang đi về đâu).

## 14.1 Giải phẫu mô hình BNPL

### Người bán trả hay người mua trả

::::story
Kỹ sư Tuấn được giao tìm hiểu BNPL để trình bày với bà Hương. Câu đầu tiên bà hỏi: "Nếu khách hàng không trả lãi, chúng ta kiếm tiền từ đâu?"
::::

**Mô hình 1: người bán trả (BNPL thuần, kiểu Nordlane, Kiwipay)**

```text
                 Bên cung cấp BNPL
                 ┌───────────┐
    Phí người bán│           │ Giá mua
    (3-8%)       │           │ (trả đủ, ngay)
                 │           │
Người bán ───────┤           ├──────── Khách hàng
                 │           │
                 │           │ 4 kỳ trả
                 │           │ (0% lãi)
                 └───────────┘

Luồng:
1. Khách mua món hàng 1,200,000 VNĐ
2. Bên BNPL trả người bán: 1,200,000 − phí 4% = 1,152,000 VNĐ, ngay lập tức
3. Khách trả bên BNPL: 4 × 300,000 VNĐ trong 6 tuần
4. Doanh thu BNPL: 48,000 VNĐ mỗi giao dịch (phí người bán)
5. Chi phí BNPL: vốn + rủi ro + vận hành

Khách hàng trả 0%. Người bán trả cho sự tiện lợi.
Lý do người bán chấp nhận: phí 3-8% có thể rẻ hơn chi phí thu hút khách hàng
để đạt cùng mức tăng tỷ lệ chuyển đổi.
```

Mô hình này chỉ sống được với kỳ hạn rất ngắn. Với 4 kỳ trong 6 tuần, dư nợ bình quân nhỏ và thời gian ngắn, nên chi phí vốn chỉ khoảng 10,000 VNĐ trên khoản 1.2 triệu, nhỏ so với phí 48,000. Kéo dài kỳ hạn lên vài tháng thì phép tính thay đổi hoàn toàn, như ví dụ dưới đây cho thấy.

**Mô hình 2: kết hợp phí người bán và phí người dùng (phổ biến ở Việt Nam)**

"Trả góp 0% lãi suất" ở Việt Nam thường không miễn phí hoàn toàn. Người bán trả phí chiết khấu khoảng 3-5% giá trị giao dịch, còn khách hàng trả một "phí xử lý" hay "phí chuyển đổi" tính theo tháng trên số tiền ban đầu. Gọi là phí, không gọi là lãi, nhưng về kinh tế nó là lãi:

| Phí xử lý mỗi tháng (trên số tiền ban đầu, kỳ hạn 6 tháng) | APR tương đương |
|---|---|
| 0.5% | 10.21% |
| 0.7% | 14.26% |
| 1.0% | 20.29% |

APR gần gấp đôi con số "nhân 12" vì phí tính trên số tiền ban đầu trong khi dư nợ giảm dần. Mục 2.2 của Chương 2 giải thích vì sao APR, không phải mức phí danh nghĩa, mới là chi phí thật. Một số chương trình khác giữ "0%" danh nghĩa nhưng bán kèm bảo hiểm hay gói bảo vệ: tổng chi phí không bằng 0, chỉ được đóng gói lại. BNPL 0% thật sự, khi khách hàng không trả gì thêm, thường chỉ có ở những người bán biên lợi nhuận cao, chấp nhận phí chiết khấu 5-8% để đủ bù mọi chi phí.

### Kinh tế đơn vị của một bên cung cấp BNPL

**Ví dụ: kỳ hạn 6 tháng, giao dịch bình quân 5,000,000 VNĐ, mô hình kết hợp**

```text
Giả định:
  Trả gốc đều 6 kỳ (833,333 VNĐ/kỳ)
  Phí người bán: 3%; phí xử lý của khách hàng: 0.7%/tháng
  Chi phí vốn: 9%/năm trên dư nợ
  PD: 6%; khoản vỡ nợ trả được 3 kỳ; LGD: 58%
  Phí trễ hạn 200,000 VNĐ, áp dụng cho 8% giao dịch

DOANH THU MỖI GIAO DỊCH:
  Phí người bán: 5,000,000 × 3% = 150,000
  Phí xử lý: 94% × 210,000 + 6% × 105,000 = 203,700
  Phí trễ hạn: 200,000 × 8% = 16,000
  ──────────────────────────────────────────────
  Tổng doanh thu: 369,700 VNĐ

CHI PHÍ MỖI GIAO DỊCH:
  Chi phí vốn: dư nợ bình quân 1,458,333 VNĐ-năm × 9% = 131,250
    (không phải 5,000,000 × 9% × 0.5 năm: dư nợ giảm dần mỗi kỳ)
  Tổn thất dự kiến: 6% × 58% × EAD 2,500,000 = 87,000
  Xử lý, công nghệ (tra cứu tín dụng, API, hệ thống): 30,000
  Collections (8% trễ hạn × 50,000): 4,000
  Chi phí chung phân bổ: 20,000
  ──────────────────────────────────────────────
  Tổng chi phí: 272,250 VNĐ

KINH TẾ ĐƠN VỊ: 369,700 − 272,250 = +97,450 VNĐ mỗi giao dịch
Điểm hòa vốn: PD ≈ 12.3%

Cùng giao dịch đó theo mô hình 1 (chỉ có phí người bán 3%, không phí xử lý):
  Doanh thu: 150,000 + 16,000 = 166,000
  Chi phí: 272,250
  Kinh tế đơn vị: −106,250 VNĐ
  Ngay cả khi PD = 0, vẫn lỗ 19,250 VNĐ
```

Hai mô hình cho hai kết luận ngược nhau. Với kỳ hạn 6 tháng, phí người bán 3% không đủ bù chi phí vốn và vận hành ngay cả khi không ai vỡ nợ, nên BNPL thuần phải hoặc giữ kỳ hạn rất ngắn, hoặc thu phí người bán rất cao. Mô hình kết hợp có lãi và chịu được PD đến khoảng 12%, nhưng nó sống nhờ phí xử lý, tức nhờ chính khoản lãi được gọi bằng tên khác. Đó là lý do cơ quan quản lý ở nhiều nơi ngày càng chú ý đến cách gọi tên chi phí.

**Con đường đến lợi nhuận của một bên BNPL mới:**

Ở giai đoạn đầu, dữ liệu chấm điểm mỏng nên PD cao, chi phí công nghệ cố định phân bổ trên ít giao dịch, và khoản lỗ được tài trợ bằng vốn nhà đầu tư. Khi quy mô tăng, chi phí cố định trên mỗi giao dịch giảm, mô hình chấm điểm học được từ dữ liệu của chính mình nên PD giảm, và quy mô giao dịch lớn giúp đàm phán phí tốt hơn với người bán. Những bên sống sót thường không chỉ là bên cho vay: họ bán chéo sản phẩm có lãi (thẻ tín dụng, bảo hiểm) cho tập khách hàng BNPL và trở thành nền tảng. Phần lớn không đi được đến đó.

:::summary[Mục 14.1]
BNPL thuần sống bằng phí người bán và chỉ có lãi với kỳ hạn rất ngắn. Mô hình kết hợp phổ biến ở Việt Nam thu thêm "phí xử lý" từ khách hàng; phí 0.7%/tháng tương đương APR 14.26%. Với kỳ hạn 6 tháng, chi phí vốn phải tính trên dư nợ bình quân: mô hình kết hợp lãi khoảng 97,000 VNĐ mỗi giao dịch và hòa vốn ở PD khoảng 12%, còn mô hình chỉ thu phí người bán 3% lỗ ngay cả khi không ai vỡ nợ.
:::

## 14.2 Tài chính nhúng: tín dụng trong mọi ngữ cảnh

### Hạ tầng ngân hàng như một dịch vụ

:::key
**Tài chính nhúng** *(embedded finance)*: tích hợp sản phẩm tài chính (tín dụng, thanh toán, bảo hiểm) vào sản phẩm và trải nghiệm phi tài chính, để người dùng tiếp cận tài chính ngay trong ngữ cảnh họ đang dùng, không phải chuyển sang ứng dụng hay trang web tài chính riêng.
:::

**Kiến trúc năm tầng:**

```text
TẦNG 1: Hạ tầng (ngân hàng bảo trợ / tổ chức có giấy phép)
  ─ Nắm giấy phép ngân hàng
  ─ Cung cấp bảng cân đối cho khoản vay
  ─ Điểm neo pháp lý: chịu giám sát của NHNN
  ─ Ví dụ: Ngân hàng Đông Hải, Ngân hàng Tây Đô, Ngân hàng Bắc Sơn

TẦNG 2: Nền tảng công nghệ (nhà cung cấp BaaS)
  ─ Lớp API nối hạ tầng với các chương trình
  ─ Chức năng core banking dưới dạng API
  ─ Tự động hóa tuân thủ (KYC, AML, báo cáo)
  ─ Ví dụ: Mambu, Thought Machine, hoặc nền tảng tự xây

TẦNG 3: Đơn vị quản lý chương trình (công ty tài chính, fintech)
  ─ Thiết kế sản phẩm (BNPL, trả góp, hạn mức tín dụng)
  ─ Sở hữu quan hệ khách hàng
  ─ Quản lý rủi ro (chấm điểm, đặt hạn mức)
  ─ Ví dụ: Bình Minh Finance, Phương Nam Finance, Ví Mây Pay Later

TẦNG 4: Đối tác phân phối (nền tảng phi tài chính)
  ─ Cung cấp ngữ cảnh: thương mại điện tử, gọi xe, tiện ích
  ─ Sở hữu trải nghiệm người dùng
  ─ Chuyển dữ liệu khách hàng (có đồng ý) để đánh giá tín dụng
  ─ Ví dụ: Chợ Sao, Kệ Hàng, DiCùng, đại lý Lạc Hồng Motors

TẦNG 5: Người dùng cuối
  ─ Dùng tín dụng liền mạch trong ngữ cảnh quen thuộc
  ─ Có thể không biết ngân hàng hay bên cho vay nào đứng sau
```

**Luồng thông tin:**

```text
Khách hàng ở bước thanh toán của Chợ Sao:
  ↓
Chợ Sao (tầng 4) gửi cho đơn vị quản lý chương trình (tầng 3):
  - Mã khách hàng, mã thiết bị
  - Số tiền mua, người bán
  - Lịch sử mua sắm trên Chợ Sao (có đồng ý)
  ↓
Đơn vị quản lý chương trình chấm điểm theo thời gian thực:
  - Tra cứu trung tâm thông tin tín dụng
  - Điểm hành vi từ dữ liệu Chợ Sao
  - Mô hình nội bộ → duyệt/từ chối, hạn mức, giá
  ↓
Đơn vị quản lý chương trình gọi API của BaaS (tầng 2):
  POST /loans/originate { amount, customerId, termMonths, rate }
  ↓
BaaS tạo khoản vay trên core của ngân hàng bảo trợ (tầng 1):
  Trả về: loan_id, tài khoản giải ngân, lịch trả nợ
  ↓
Đơn vị quản lý chương trình trả kết quả cho Chợ Sao:
  "Đã duyệt: 6 kỳ × 1,000,000 VNĐ"
  ↓
Khách hàng thấy kết quả. Tổng thời gian: 2-4 giây.
```

### Tình huống: DiCùng PayLater

Một siêu ứng dụng gọi xe và giao đồ ăn như DiCùng có lợi thế cạnh tranh mà một bên BNPL độc lập khó có được:

| Lợi thế | Nội dung |
|---|---|
| Phân phối | Hàng chục triệu người dùng hoạt động hằng ngày; chi phí thu hút khách hàng cho sản phẩm tài chính gần như bằng 0 |
| Dữ liệu | Tần suất đi xe (đại diện cho độ đều đặn của thu nhập), thói quen đặt đồ ăn, lịch sử giao dịch ví DiCùng Pay: một điểm hành vi mà trung tâm tín dụng không tính được |
| Đánh giá tín dụng | Khách hàng thin-file, vốn bị từ chối hết nếu chỉ dựa vào dữ liệu tín dụng truyền thống, giờ có thể được chấm điểm |
| Thu nợ | Trích tự động từ ví DiCùng Pay hoặc từ thu nhập của tài xế; ma sát trả nợ gần bằng 0 |
| Kinh tế đơn vị | Chi phí phân phối và thu nợ gần bằng 0 phá vỡ bài toán kinh tế đơn vị của BNPL độc lập |

Những lợi thế này cũng là rủi ro: dùng dữ liệu hành vi để chấm điểm cần sự đồng ý rõ ràng theo Luật Bảo vệ dữ liệu cá nhân, và trích nợ từ thu nhập của tài xế đặt ra câu hỏi về sự phụ thuộc của họ vào nền tảng.

**Bức tranh tài chính nhúng ở Việt Nam:**

| Bên | Ngữ cảnh | Sản phẩm | Thế mạnh |
|---|---|---|---|
| Ví Mây | Siêu ví | PayLater, Ví Mây Credit | Quy mô người dùng |
| Chợ Sao PayLater | Thương mại điện tử | Trả góp 6 tháng | Dữ liệu mua sắm |
| DiCùng PayLater | Gọi xe, giao đồ ăn | Hạn mức tín dụng | Dữ liệu hành vi |
| Lạc Hồng Motors | Đại lý ô tô | Tích hợp vay mua xe | Ngữ cảnh khép kín |
| QuetPay | Cổng thanh toán | Tín dụng cho người bán | Góc độ B2B |
| Phương Nam Finance | Điểm bán | Trả góp tiêu dùng | Độ phủ điểm bán |
| Ví Lam | Nhắn tin, thanh toán | Hạn mức tín dụng | Mạng quan hệ xã hội |

## 14.3 Rủi ro tín dụng trong BNPL

### Nghịch lý thin-file

BNPL được giới thiệu như giải pháp cho người vay thin-file. Nhưng nó cũng đang tạo ra một **thế hệ thin-file mới**: những người có nhiều khoản BNPL mà trung tâm thông tin tín dụng không theo dõi hết.

Vấn đề thứ nhất là độ trễ: không phải mọi bên BNPL đều báo cáo cho trung tâm tín dụng, và bên có báo cáo thường cập nhật theo tháng. Một khách hàng có năm khoản BNPL có thể chỉ hiện hai khoản, nên đơn BNPL tiếp theo nhìn thấy một bức tranh thiếu. Thứ hai, khách hàng nộp đơn cho Chợ Sao PayLater, DiCùng PayLater và Ví Mây Credit trong cùng một ngày; mỗi bên thấy "chưa có khoản BNPL nào", trong khi thực tế đã có ba khoản mới trong một tuần. Thứ ba, chuẩn báo cáo không thống nhất: bên báo cáo như thẻ tín dụng quay vòng, bên báo cáo như khoản vay trả góp, bên không báo cáo gì. Hướng giải quyết của ngành là chuẩn báo cáo riêng cho BNPL, chia sẻ dữ liệu giữa các bên BNPL gần thời gian thực (trong giới hạn về quyền riêng tư), và danh sách đen dùng chung.

### Gian lận vận tốc

:::key
**Gian lận vận tốc** *(velocity fraud)*: kẻ gian nộp nhiều đơn vay cho nhiều bên cho vay trong thời gian ngắn, trước khi các bên kịp thấy phê duyệt của nhau và trước khi trung tâm tín dụng được cập nhật.
:::

```text
Hồ sơ kẻ tấn công:
  Danh tính hợp lệ (bị đánh cắp hoặc tổng hợp)
  Lịch sử tín dụng sạch (thin-file thật hoặc lịch sử đẹp)

Chuỗi tấn công (trong vòng 4 giờ):
  10:00: Chợ Sao PayLater, 5 triệu → Duyệt
  10:15: Phố Mua BNPL, 4 triệu → Duyệt
  10:30: Ví Mây Credit, 3 triệu → Duyệt
  11:00: DiCùng PayLater, 2 triệu → Duyệt
  11:15: Phương Nam Finance (kênh số), 8 triệu → Duyệt

  Tổng được duyệt: 22,000,000 VNĐ
  Số tiền dự định trả: 0

  Mỗi bên thấy: "Lịch sử tín dụng tốt, chưa có BNPL"
  Thực tế: 4 khoản khác vừa mở trong một giờ qua

Cách phòng thủ:
  1. Danh sách đen dùng chung theo thời gian thực (liên minh ngành)
  2. Kiểm tra số lần tra cứu tín dụng gần đây, không chỉ lịch sử:
     "N lần tra cứu trong 24 giờ" → đáng ngờ nếu N > 3
  3. Bất thường hành vi: tài khoản mới + mua ngay ở mức tối đa
  4. Dấu vân tay thiết bị: cùng thiết bị, nhiều danh tính khác nhau
  5. Giới hạn vận tốc: tối đa 1 tài khoản mới mỗi thiết bị mỗi 7 ngày
  6. Bất thường địa lý: nộp đơn từ vị trí bất thường
```

### Chồng nợ

::::story
Chị Mai có thu nhập 12 triệu/tháng. Trong 6 tháng, chị đã dùng:
- Chợ Sao PayLater: 3 triệu đang trả góp
- DiCùng PayLater: 1.5 triệu đang trả góp
- Ví Mây Credit: 2 triệu đang trả góp
- Kệ Hàng BNPL: 1 triệu đang trả góp
- Phương Nam Finance (điểm bán): 5 triệu đang trả góp

Tổng nghĩa vụ hằng tháng khoảng 2,500,000 VNĐ, tức DTI 21%. Có vẻ ổn.

Nhưng không bên nào trong năm bên biết về bốn khoản còn lại.
::::

Mỗi bên cho vay thấy "khách có một nghĩa vụ, DTI 8%, rủi ro thấp", còn bức tranh thật là năm nghĩa vụ, DTI 21%, rủi ro trung bình. Một khoản chi bất ngờ (ốm đau, sửa nhà) là đủ để chị Mai không trả nổi cả năm khoản cùng lúc. Chị ưu tiên khoản lớn nhất, các khoản nhỏ vỡ nợ trước, năm đội collections cùng liên hệ, và áp lực tài chính lẫn tâm lý dẫn đến vỡ nợ dây chuyền. Hướng xử lý của ngành gồm sổ đăng ký BNPL tập trung, nghĩa vụ báo cáo tín dụng gần thời gian thực, hạn mức BNPL tổng cho mỗi khách hàng, và tính DTI gồm mọi nghĩa vụ BNPL.

:::summary[Mục 14.3]
BNPL giúp người thin-file tiếp cận tín dụng nhưng cũng tạo ra một lớp người vay mà trung tâm tín dụng không nhìn thấy đầy đủ. Gian lận vận tốc khai thác độ trễ giữa các bên: 22 triệu được duyệt trong bốn giờ. Phòng thủ bằng danh sách đen chung, kiểm tra số lần tra cứu gần đây và dấu vân tay thiết bị. Chồng nợ xảy ra vì mỗi bên chỉ thấy một phần; lời giải nằm ở báo cáo tín dụng gần thời gian thực.
:::

## 14.4 Kiến trúc kỹ thuật của BNPL

### Quyết định dưới ba giây

```text
Tổng độ trễ cho phép: 3,000 ms (khách đang chờ ở bước thanh toán)

Phân rã:
  Mạng (khách → người bán → BNPL): 50 ms
  Xác thực + kiểm tra gian lận: 200 ms
  API trung tâm tín dụng: 600 ms ← nút thắt
  Tính điểm hành vi: 150 ms
  Mô hình quyết định tín dụng: 50 ms
  Tính hạn mức và giá: 30 ms
  Khởi tạo khoản vay (ghi cơ sở dữ liệu): 100 ms
  Trả kết quả cho người bán: 50 ms
  Mạng chiều về: 50 ms
  ─────────────────────────────────────
  Tổng: 1,280 ms (còn dư 57% ngân sách)

  P99: 2,800 ms (độ trễ đuôi do trung tâm tín dụng chậm đột biến)

Cách tối ưu:
  Gọi song song nhiều trung tâm tín dụng (không tuần tự)
  Chấm điểm trước: khách cũ + cùng thiết bị → dùng điểm đã cache (TTL 1 giờ)
  Làm giàu bất đồng bộ: duyệt trước, bổ sung dữ liệu hành vi sau
  Dự phòng khi quá thời gian: trung tâm tín dụng > 800 ms → chỉ dùng lịch sử nội bộ
                              (chấp nhận rủi ro cao hơn để giữ SLA)
```

**Quyết định BNPL trong VLP:**

VLP không có một service quyết định riêng cho BNPL. BNPL_ECOM là một giá trị của enum TransactionType, và việc chấm điểm BNPL đi qua cùng BPMN process "PreTransactionRiskCheck" trên Zeebe như các sản phẩm khác: LOS gửi mã khách hàng và dữ liệu yêu cầu, nhận về POSITIVE hoặc NEGATIVE. Một service quyết định BNPL chuyên biệt theo thực hành của ngành thường có bốn bước: kiểm tra gian lận (dừng cứng, khoảng 100 ms), làm giàu dữ liệu song song (trung tâm tín dụng khoảng 700 ms, điểm hành vi khoảng 200 ms), suy luận mô hình, rồi quy tắc chính sách để ra quyết định duyệt hay từ chối. Trong VLP, các bước đó nằm bên trong process trên Zeebe.

### Các mẫu tích hợp

**Mẫu 1: tích hợp API trực tiếp**

```text
Backend người bán → REST API của BNPL
  POST /api/v2/checkout/initiate
  {
    "merchantId": "CHOSAO_VN",
    "orderId": "ORD-2024-xxxxx",
    "amount": 6000000,
    "currency": "VND",
    "customer": {
      "phone": "+84901234567",
      "nationalId": "0123456789",
      "email": "customer@email.com"
    },
    "items": [...],
    "returnUrl": "https://chosao.vn/order/complete"
  }

  Phản hồi: { "approvalToken": "...", "redirectUrl": "...", "status": "APPROVED" }

Dùng khi: người bán có đội kỹ thuật riêng, muốn trải nghiệm tùy biến
Ưu: toàn quyền kiểm soát, không bị giới hạn của iframe
Nhược: nhiều việc tích hợp hơn, phạm vi tuân thủ rộng hơn
```

**Mẫu 2: JavaScript SDK (iframe)**

```html
<!-- Merchant inserts in checkout page -->
<div id="bnpl-widget"></div>
<script src="https://js.bnpl-provider.vn/v2/widget.js"></script>
<script>
  BNPLWidget.render({
    containerId: 'bnpl-widget',
    amount: 18500000,
    merchantId: 'CHOSAO_VN',
    onApproved: (result) => { /* handle approval */ },
    onDeclined: (result) => { /* handle decline */ }
  });
</script>

Use when: Merchant wants fast integration, minimal backend work
Pros: Merchant doesn't handle sensitive data, easy update
Cons: Less control over UX, iframe restrictions
```

**Mẫu 3: nhãn trắng** *(white-label)*

Người bán bán sản phẩm dưới thương hiệu của mình ("Chợ Sao Trả Góp", không phải "Trả góp của bên BNPL X"), còn hạ tầng do bên BNPL cung cấp và vận hành phía sau. Khách hàng chỉ thấy thương hiệu Chợ Sao. Cách này hợp với người bán đủ lớn và muốn kiểm soát thương hiệu hoàn toàn; trải nghiệm tốt nhất, nhưng phức tạp nhất, tốn kém nhất và phức tạp nhất về pháp lý.

### Đối soát với hệ sinh thái người bán

::::story
10,000 giao dịch BNPL mỗi ngày trên 500 người bán. Cuối ngày phải đối soát: ai nhận bao nhiêu, ai nợ ai, phí tính thế nào.
::::

```text
Luồng đối soát hằng ngày:

1. Hệ thống BNPL tạo file quyết toán cho từng người bán:
     Số giao dịch: N
     Tổng giá trị: X VNĐ
     Phí người bán: X × tỷ lệ phí
     Thực trả người bán: X − phí

2. Chuyển khoản thực trả cho người bán (trong ngày hoặc T+1 theo hợp đồng)

3. Xử lý ngoại lệ:
   Hoàn hàng: khách trả lại sản phẩm
   → Người bán hoàn tiền cho bên BNPL → bên BNPL hoàn cho khách trong kế hoạch trả góp
   → hoặc: hủy các kỳ còn lại, người bán trả lại số đã nhận

   Tranh chấp: khách khiếu nại giao dịch
   → Điều tra (thường 30-45 ngày)
   → Nếu khiếu nại đúng: đảo giao dịch + thu hồi phí

4. Sao kê tháng cho người bán:
   Khối lượng, phí, hoàn tiền, thực trả, so sánh với tháng trước

5. Báo cáo cơ quan quản lý:
   Hằng tháng: dư nợ danh mục
   Hằng quý: chỉ số rủi ro, tỷ lệ vỡ nợ
```

## 14.5 Khung pháp lý cho BNPL

### Xu hướng toàn cầu: siết chặt dần

| Giai đoạn | Diễn biến |
|---|---|
| 2015-2019 | Thời kỳ "chênh lệch quản lý": BNPL được cấu trúc để không bị coi là tín dụng, tránh yêu cầu giấy phép, không công bố APR, không bắt buộc đánh giá khả năng chi trả; tăng trưởng nhanh, bảo vệ người tiêu dùng ít |
| 2020-2023 | Phản ứng bắt đầu: Anh có báo cáo Woolard (2/2021) khuyến nghị đưa BNPL vào quản lý; CFPB ở Mỹ mở điều tra (12/2021); EU thông qua Chỉ thị Tín dụng Tiêu dùng sửa đổi (2023) bao gồm cả BNPL |
| 2024-2026 | Siết chặt: Úc đưa BNPL vào Đạo luật Tín dụng Quốc gia từ 6/2025; Anh: FCA bắt đầu quản lý BNPL (deferred payment credit) từ 15/7/2026; Singapore dựa vào bộ quy tắc ứng xử của ngành thay vì cấp phép riêng; ở Mỹ, CFPB ban hành rồi rút lại cách diễn giải coi bên BNPL như bên phát hành thẻ tín dụng |

Các chủ đề quản lý lặp lại ở mọi nơi: kiểm tra khả năng chi trả, công bố tổng chi phí, cơ chế hỗ trợ khi khách hàng gặp khó khăn, quy trình khiếu nại chính thức, và báo cáo cho trung tâm thông tin tín dụng.

### Bối cảnh Việt Nam

Việt Nam chưa có quy định riêng cho BNPL. Hoạt động cho vay tiêu dùng của công ty tài chính chịu điều chỉnh của Luật Các tổ chức tín dụng 2024 và Thông tư 43/2016/TT-NHNN (sửa đổi bởi Thông tư 18/2019/TT-NHNN); cách gọi "phí xử lý" thay cho lãi là vùng mà cơ quan quản lý và người tiêu dùng ngày càng chú ý. Có hai con đường để làm BNPL:

| Con đường | Nội dung |
|---|---|
| Tự có giấy phép công ty tài chính | Vốn pháp định 500 tỷ đồng, chịu giám sát đầy đủ của NHNN, được cung cấp mọi sản phẩm tín dụng tiêu dùng |
| Hợp tác với tổ chức có giấy phép (phần lớn fintech) | Mô hình quản lý chương trình: fintech sở hữu trải nghiệm và có thể tham gia quản lý rủi ro, tổ chức có giấy phép cung cấp bảng cân đối, hai bên chia sẻ doanh thu |

### Nghĩa vụ bảo vệ người tiêu dùng có thể đến

Dựa trên xu hướng quốc tế, một khung quản lý BNPL ở Việt Nam nhiều khả năng sẽ có các yêu cầu sau. Thiết kế hệ thống cho chúng ngay từ bây giờ rẻ hơn nhiều so với sửa lại sau:

| Yêu cầu | Nội dung có thể có |
|---|---|
| Đánh giá khả năng chi trả | Xác minh thu nhập và nghĩa vụ hiện có; ngưỡng khoản trả hằng tháng so với thu nhập ròng |
| Công bố chi phí | Hiện APR, không chỉ "phí xử lý", trước khi khách chấp nhận, với cỡ chữ ngang dòng quảng cáo |
| Thời gian cân nhắc | Quyền hủy trong một khoảng thời gian ngắn mà không mất phí |
| Hỗ trợ khó khăn | Chương trình hỗ trợ chính thức; tạm dừng liên hệ thu nợ sau khi khách nộp yêu cầu hỗ trợ |
| Báo cáo tín dụng | Mọi khoản BNPL được báo cáo cho CIC; sự kiện vỡ nợ được báo cáo trong thời hạn ngắn |
| Khiếu nại | Quy trình chính thức, thời hạn phản hồi, đường lên cơ quan quản lý khi chưa được giải quyết |
| Quảng cáo | Không được nói "miễn lãi" nếu có phí; "0%" chỉ khi thật sự không có phí |

:::summary[Mục 14.5]
Trên thế giới, BNPL đang chuyển từ "không phải tín dụng" sang "là tín dụng": Úc từ 6/2025, Anh từ 15/7/2026, EU qua Chỉ thị Tín dụng Tiêu dùng sửa đổi. Việt Nam chưa có quy định riêng, nhưng các yêu cầu về khả năng chi trả, công bố APR, báo cáo tín dụng và hỗ trợ khó khăn gần như chắc chắn sẽ đến. Con đường cấp phép là tự xin giấy phép công ty tài chính (vốn 500 tỷ) hoặc hợp tác với tổ chức có giấy phép.
:::

## 14.6 Tương lai của tài chính nhúng

### Mô hình siêu ứng dụng

::::story
Các nền tảng như DiCùng đang xây "siêu ứng dụng": một ứng dụng cho mọi thứ, từ gọi xe, đồ ăn, mua sắm, thanh toán đến bảo hiểm, đầu tư và tín dụng. Không cần rời ứng dụng để dùng bất kỳ dịch vụ tài chính nào.
::::

Siêu ứng dụng có bốn lợi thế trong tín dụng. Lợi thế dữ liệu: nó biết bạn đi làm ở đâu, ăn gì, mua gì, có đều đặn không, tức một lịch sử tín dụng hành vi dự báo tốt hơn dữ liệu trung tâm tín dụng với người vay mới. Lợi thế phân phối: đã nằm trong điện thoại, đã được tin dùng mỗi ngày, nên chi phí thu hút khách hàng cho sản phẩm tín dụng gần bằng 0. Lợi thế thu nợ: trích tự động từ ví của siêu ứng dụng. Và tín dụng theo ngữ cảnh: đặt vé máy bay thì được mời bảo hiểm du lịch, tài xế đến kỳ bảo dưỡng xe thì được mời vay bảo dưỡng; tín dụng được chào đúng lúc có nhu cầu nên tỷ lệ chuyển đổi cao nhất.

Ở Việt Nam, Ví Mây đang đi theo hướng siêu ứng dụng (đã có bảo hiểm, đầu tư), Ví Lam tận dụng mạng nhắn tin đi kèm, QuetPay dựa trên mạng lưới người bán để mở rộng sang tín dụng tiêu dùng. Bên thắng sẽ là bên xây được dịch vụ được dùng hằng ngày và khó rời bỏ nhất.

### Ngân hàng mở và dữ liệu di động

:::key
**Ngân hàng mở** *(open banking)*: khung cho phép khách hàng chia sẻ dữ liệu tài chính của mình với bên thứ ba, có sự đồng ý, để được đánh giá tín dụng tốt hơn, được cá nhân hóa, và để thúc đẩy cạnh tranh.
:::

Dữ liệu trung tâm tín dụng (lịch sử DPD, dư nợ, số lần tra cứu) là chỉ báo trễ 30-90 ngày và không cho thấy hành vi chi tiêu hay dòng tiền thật. Với ngân hàng mở, khi khách hàng đồng ý, bên cho vay có thể xem sao kê 12 tháng, số dư theo thời gian thực, thu nhập đều đặn (lương về tài khoản), chi phí cố định (tiền nhà, điện nước) và chi tiêu bất thường. Chấm điểm dựa trên dòng tiền chính xác hơn cho người thin-file và cập nhật theo thời gian thực.

```text
Ví dụ:
  Khách hàng xin vay 20 triệu VNĐ
  Điểm truyền thống: 385 (hạng Standard, sát ngưỡng dưới)

  Sau khi phân tích dữ liệu ngân hàng mở (có đồng ý):
  → Lương đều 25 triệu/tháng (xác minh được, không chỉ khai báo)
  → Trả tiền nhà đều đặn 8 triệu/tháng
  → Chuyển tiết kiệm đều 3 triệu/tháng
  → Không trễ hóa đơn nào trong 24 tháng

  Đánh giá lại: tương đương hạng Prime
  → Khách hàng xứng đáng được giá tốt hơn
  → Chấm điểm truyền thống đã định giá quá cao cho người vay này
```

Ở Việt Nam, Thông tư 64/2024/TT-NHNN về triển khai giao diện lập trình ứng dụng mở (Open API) trong ngành ngân hàng có hiệu lực từ 1/3/2025, tạo khung pháp lý đầu tiên cho việc ngân hàng chia sẻ dữ liệu qua API với bên thứ ba khi khách hàng đồng ý. Cùng với việc hiện đại hóa CIC, đây là nền móng để chấm điểm theo dòng tiền trở thành thực tế trong vài năm tới.

### Tài chính theo ngữ cảnh: có khi cần, vô hình khi không

Hiện nay tài chính là một **điểm đến**: người dùng nghĩ đến nhu cầu, mở ứng dụng tài chính, nộp đơn, chờ, nhận. Tương lai, tài chính trở nên **có mặt sẵn** *(ambient)*: người dùng làm việc của mình, hệ thống nhận ra nhu cầu và đưa giải pháp ngay trong ngữ cảnh. Bốn kịch bản:

| Kịch bản | Tình huống | Giải pháp nhúng |
|---|---|---|
| Lệch ngày lương | Lương về ngày 15, tiền nhà hạn ngày 5 | Ứng dụng tính lương của công ty đề nghị ứng trước lương đã làm với một khoản phí nhỏ; bấm "Đồng ý" là xong |
| Dòng tiền của hộ kinh doanh | Phần mềm kế toán thấy hóa đơn đã gửi 60 ngày chưa được thanh toán | Đề nghị ứng trước 80% giá trị hóa đơn, tiền về trong ngày |
| Y tế | Ca điều trị 15 triệu, bảo hiểm chi trả 10 triệu | "Chúng tôi có thể chi trả 5 triệu còn lại trong 6 tháng, xác nhận?" |
| Giáo dục | Học viên đăng ký khóa học 8 triệu | "Trả theo tháng? 4 × 2 triệu, không lãi" |

Yêu cầu công nghệ cho tương lai này là dữ liệu thời gian thực dựa trên đồng ý, quyết định dưới một giây, xác thực danh tính không ma sát (sinh trắc học), và tự động hóa tuân thủ. Hạ tầng đó chưa hoàn chỉnh, và đó chính là cơ hội. Cũng vì tín dụng trở nên vô hình, các yêu cầu về khả năng chi trả và minh bạch ở mục 14.5 càng quan trọng hơn.

## Tóm tắt chương 14

```text
Hành trình của tín dụng, từ bàn nhân viên tín dụng đến bước thanh toán ba giây:

Thập niên 1950: cho vay theo phán đoán, chậm, thiếu nhất quán
Thập niên 1990: chấm điểm thống kê, nhất quán, mở rộng được, phụ thuộc dữ liệu tín dụng
Thập niên 2010: cho vay số, nhanh hơn, ưu tiên di động, vẫn xoay quanh ứng dụng
Thập niên 2020: BNPL nhúng, tín dụng trong thương mại, quyết định ba giây
Tương lai: tài chính có mặt sẵn, tín dụng xuất hiện đúng lúc cần

Điều cốt lõi:
  Sản phẩm tài chính tốt nhất giúp bạn đúng lúc cần,
  với ít ma sát nhất và lợi ích lớn nhất.

  "0% lãi" không phải là một mức giá mà là một mô hình kinh doanh:
  người bán trả tiền để biến sự do dự của bạn thành một đơn hàng.
  Và khi kỳ hạn dài, "phí xử lý" thường là khoản lãi được gọi bằng tên khác.

  Khi Chợ Sao PayLater duyệt chị Thu trong ba giây:
  - Nhiều nguồn dữ liệu được truy vấn song song
  - Một mô hình chấm điểm chị trong khoảng 50 ms
  - Các quy tắc chính sách được đánh giá
  - Một khoản vay được khởi tạo trên core của ngân hàng bảo trợ
  - Người bán nhận tiền trong ngày
  - Chị Thu chỉ thấy: bấm, OTP, xong.

Sự vô hình là sản phẩm.
Hạ tầng là hào phòng thủ.
Dữ liệu là lợi thế cạnh tranh.
```

## Câu hỏi tự kiểm tra

**Loại 1: Nhớ lại**
1. Mô hình BNPL người bán trả là gì? Ai trả cho "0% lãi", và vì sao họ chấp nhận?
2. Kể năm tầng của kiến trúc tài chính nhúng. Tầng nào là điểm neo pháp lý?
3. Gian lận vận tốc là gì? Kể ba cách phát hiện.
4. Chồng nợ là gì? Vì sao BNPL làm vấn đề này tệ hơn?

**Loại 2: Hiểu**
5. Vì sao BNPL thuần chỉ thu phí người bán có lãi với kỳ hạn 6 tuần nhưng lỗ với kỳ hạn 6 tháng? Thành phần chi phí nào thay đổi theo kỳ hạn?
6. Vì sao một siêu ứng dụng như DiCùng có lợi thế đáng kể trong BNPL so với một bên BNPL độc lập?
7. Ngân hàng mở giúp người vay thin-file thế nào? Vì sao dữ liệu trung tâm tín dụng không đủ?
8. "Sự vô hình là sản phẩm": giải thích câu này trong bối cảnh tài chính nhúng. Nó tạo ra rủi ro gì?

**Loại 3: Áp dụng**
9. Thiết kế sản phẩm BNPL cho một nhà thuốc trực tuyến:
   - Đơn hàng bình quân: 500,000 VNĐ
   - Khách hàng mua lại hằng tháng: 70%
   - Khách hàng thin-file: 60% (người cao tuổi, nông thôn)

   (a) Mô hình người bán trả hay kết hợp?
   (b) Nhà thuốc có thể cung cấp dữ liệu thay thế nào cho chấm điểm, và cần lưu ý gì về dữ liệu sức khỏe?
   (c) Kỳ hạn và cấu trúc trả nào hợp lý?
   (d) Rủi ro gian lận lớn nhất của BNPL cho nhà thuốc là gì?
   (e) Những yêu cầu pháp lý nào áp dụng?

10. Một bên BNPL cân nhắc hệ thống phát hiện gian lận vận tốc:
    - Phương án A: kiểm tra một trung tâm tín dụng theo thời gian thực (800 ms, độ phủ 60%)
    - Phương án B: kiểm tra song song hai trung tâm (1,200 ms, độ phủ 85%)
    - Phương án C: danh sách đen dùng chung của ngành (200 ms, độ phủ 40%, thời gian thực)

    (a) Phân tích đánh đổi của từng phương án
    (b) Triển khai phương án nào trước, vì sao?
    (c) Kết hợp cả ba thế nào để bảo vệ tối đa?
    (d) Rủi ro dương tính giả của việc phát hiện gian lận quá gắt là gì?

**Loại 4: Phân tích**
11. Lạc Hồng Motors muốn nhúng vay mua xe trực tiếp vào luồng mua xe trên ứng dụng: chọn xe → được chào vay ngay trong ứng dụng → duyệt trong ứng dụng → ký số → lái xe về.

    Phân tích:
    (a) Lạc Hồng Motors có dữ liệu gì mà bên cho vay mua xe truyền thống không có?
    (b) Yêu cầu pháp lý với khoản vay mua xe nhúng trong ứng dụng của nhà sản xuất
    (c) Quản trị rủi ro khác BNPL tiêu dùng ở điểm nào?
    (d) Kiến trúc kỹ thuật: những hệ thống nào cần tích hợp?
    (e) Nghĩa vụ bảo vệ người tiêu dùng

12. Cơ quan quản lý lo ngại: "BNPL đang tạo ra nợ vô hình cho người tiêu dùng trẻ." Hãy thiết kế một khung quản lý:
    (a) Bảo vệ người tiêu dùng mà không bóp chết đổi mới
    (b) Xử lý chồng nợ mà không đòi hỏi chia sẻ dữ liệu thời gian thực (vì quyền riêng tư)
    (c) Bảo đảm đánh giá khả năng chi trả mà không phá vỡ quyết định ba giây
    (d) Minh bạch với người tiêu dùng mà không làm giao diện quá tải
    Khung bạn đề xuất là gì? Đánh đổi ở đâu?

## Đọc thêm

**Tài chính nhúng:**
- Sieber, S., & Guibaud, S. (2022). *Embedded Finance: When Payments Become An Experience.* Wiley. Tổng quan về chiến lược, các bên tham gia và hạ tầng của tài chính nhúng.

**Quản lý BNPL:**
- Woolard, C. (2021). *The Woolard Review: A review of change and innovation in the unsecured credit market.* Financial Conduct Authority. Báo cáo đặt nền cho việc đưa BNPL vào quản lý ở Anh.
- Financial Conduct Authority. *Regulating Buy Now Pay Later.* fca.org.uk. Các quy định áp dụng từ 15/7/2026.

**Ngân hàng mở:**
- Open Banking Limited. *Open Banking Standards.* standards.openbanking.org.uk. Các chuẩn kỹ thuật định nghĩa cách ngân hàng mở vận hành ở Anh.
- Ngân hàng Nhà nước Việt Nam. Thông tư 64/2024/TT-NHNN quy định về triển khai giao diện lập trình ứng dụng mở trong ngành ngân hàng.

*Chương 15 nhìn xa hơn: AI đang thay đổi không chỉ chấm điểm tín dụng mà cả vòng đời khoản vay, từ thu hút khách hàng, thẩm định, phục vụ đến collections. Mô hình ngôn ngữ lớn, AI tạo sinh và các tác tử tự động sẽ tác động thế nào đến tài chính tiêu dùng? Và những gì không thể tự động hóa, như phán đoán của con người, giám sát đạo đức và quan hệ khách hàng, sẽ vẫn quan trọng ra sao?*
