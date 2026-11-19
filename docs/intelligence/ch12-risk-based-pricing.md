---
title: "Chương 12. Định giá dựa trên rủi ro"
sidebar_label: "12. Định giá dựa trên rủi ro"
sidebar_position: 2
chapter: 12
subtitle: "Risk-Based Pricing"
reading_time: 26
description: "Từ điểm tín dụng đến lãi suất: ranh giới hạng và hiệu chuẩn, mô hình chi phí cộng biên tính trên dư nợ bình quân, hòa vốn của từng hạng, độ co giãn giá và lựa chọn bất lợi, biểu phí như hạ tầng định giá, thử nghiệm A/B, định giá hành vi và quản trị định giá."
source_file: "phan-3-chuong-12.md"
editorial_status: "edited"
---

> *"Giá đúng không phải giá thấp nhất, cũng không phải giá cao nhất. Giá đúng phản ánh đúng rủi ro: đủ để bên cho vay bền vững, đủ để người vay trả được, và đủ để cả hai muốn giao dịch lại."*

## Dẫn nhập: vì sao một giá cho tất cả là sai

::::story
Một công ty tài chính tiêu dùng quyết định đơn giản hóa: một mức lãi suất 24%/năm cho mọi khoản vay tiêu dùng, không phân biệt mức rủi ro hay phân khúc.

Sau 18 tháng, tỷ lệ duyệt tăng vì không cần chấm điểm phức tạp, nhưng tỷ lệ vỡ nợ tăng từ 4% lên 8.5%. Khách hàng tốt rời đi vì họ vay được 18% ở nơi khác. Khách hàng rủi ro ở lại và vay nhiều hơn. Biên lãi ròng chuyển sang âm.

Đó chính là vòng xoáy lựa chọn bất lợi đã mô tả ở Chương 1, và nó xảy ra vì không có định giá dựa trên rủi ro.
::::

Chương này xây tiếp trên chấm điểm tín dụng (Chương 11) để trả lời câu hỏi: sau khi biết ai thuộc hạng Prime, Standard, Sub-prime, nên tính lãi bao nhiêu? Câu trả lời không đến từ cảm tính hay bám theo thị trường, mà từ một mô hình tài chính chặt chẽ, kết hợp với hiểu biết về hành vi khách hàng và cạnh tranh.

## 12.1 Từ điểm tín dụng đến hạng rủi ro

### Ranh giới hạng không tùy tiện

::::story
Đội khoa học dữ liệu vừa xây xong mô hình chấm điểm. Anh Minh hỏi: "Vậy ngưỡng là bao nhiêu? Bao nhiêu điểm thì duyệt, bao nhiêu thì từ chối?"

Đây không phải câu hỏi của nhà khoa học dữ liệu mà là câu hỏi kinh doanh, với hệ quả tài chính rất cụ thể.
::::

VLP dùng ba hạng, như đã thấy ở Chương 7. Thang điểm của Chương 11 (380 điểm ứng với odds 20 : 1, PDO 40) cho biết mỗi hạng tương ứng với khoảng xác suất vỡ nợ nào:

| Hạng | Khoảng điểm | Khoảng PD theo thang điểm | PD bình quân của hạng (lịch sử) | Lãi suất |
|---|---|---|---|---|
| Prime | ≥ 440 | dưới khoảng 1.7% | 1.0% | 15%/năm |
| Standard | 380-439 | 1.7% đến 4.8% | 3.0% | 18%/năm |
| Sub-prime | 340-379 | 4.8% đến 9.1% | 6.5% | 21%/năm |
| Từ chối | < 340 | trên 9.1% | | |

Mỗi ranh giới là điểm mà ở đó lãi suất của hạng không còn bù được chi phí của khách hàng tệ nhất trong hạng. Mục 12.2 tính các chi phí đó.

**Hiệu chuẩn là bắt buộc**

Mô hình cho ra điểm, nhưng điều quan trọng là: những người được 410 điểm có thực sự vỡ nợ với tỷ lệ mô hình dự báo không?

```text
Bảng hiệu chuẩn:
  Dải điểm   PD dự báo   PD thực tế   Tỷ số
  460-479:     1.0%        1.2%        1.20 ← đánh giá thấp rủi ro một chút
  440-459:     1.5%        1.6%        1.07 ← sát
  420-439:     2.1%        2.1%        1.00 ← hiệu chuẩn tốt
  400-419:     2.9%        2.8%        0.97 ← hiệu chuẩn tốt
  380-399:     4.0%        4.7%        1.18 ← đánh giá thấp rủi ro

Tỷ số liên tục > 1: mô hình đánh giá thấp rủi ro → điều chỉnh giá lên hoặc hiệu chuẩn lại
Tỷ số liên tục < 1: mô hình đánh giá quá cao rủi ro → có thể đang bỏ lỡ khách hàng tốt
```

Dải 380-399 đáng chú ý nhất: nó nằm sát ngưỡng dưới của hạng Standard. Nếu PD thật ở đây là 4.7% thay vì 4.0%, một phần khách hàng đang được định giá như Standard nhưng có rủi ro gần với Sub-prime.

### Ngưỡng cố định và ngưỡng động

Ngưỡng cố định đơn giản, nhất quán, dễ kiểm toán, và được xem lại hằng năm hoặc khi mô hình được huấn luyện lại. Ngưỡng động điều chỉnh theo mục tiêu danh mục:

| Tình huống | Điều chỉnh |
|---|---|
| Tỷ lệ vỡ nợ của danh mục đang tăng | Nâng ngưỡng duyệt (340 → 350), nâng ngưỡng Prime (440 → 450) |
| Không đạt mục tiêu giải ngân | Hạ ngưỡng duyệt (340 → 330) một cách thận trọng, có giám sát, kèm lãi suất phù hợp cho nhóm mới |
| Mất khách Prime vì cạnh tranh | Giữ ngưỡng Prime, hạ lãi suất Prime nếu kinh tế học cho phép |

Ngưỡng động đòi hỏi giám sát chất lượng danh mục hằng ngày, quy tắc điều chỉnh được định sẵn, phê duyệt của hội đồng rủi ro chứ không riêng đội mô hình, và dấu vết kiểm toán cho mọi lần thay đổi ngưỡng cùng lý do.

### Phân khúc nhiều chiều

Hai khách hàng cùng 425 điểm có thể rất khác nhau: một người thu nhập 10 triệu với tỷ lệ nợ trên thu nhập (DTI) cao, một người thu nhập 50 triệu với DTI thấp. Cùng điểm nhưng rủi ro khả năng chi trả khác hẳn. Vì vậy nhiều bên cho vay định giá theo ma trận điểm × DTI, cộng thêm các điều chỉnh hành vi. Dưới đây là một phương án Vela Finance đang cân nhắc để thay cho ba mức giá hiện tại:

```text
              DTI < 30%    DTI 30-50%   DTI > 50%
Điểm 440+       14.5%        15.5%        18.0%
Điểm 380-439    17.5%        18.5%        21.0%
Điểm 340-379    20.5%        21.5%        TỪ CHỐI
Điểm < 340      TỪ CHỐI      TỪ CHỐI      TỪ CHỐI

Điều chỉnh thêm:
  Khách hàng cũ, chưa từng trễ hạn: −0.5 điểm phần trăm
  Thu nhập SALARIED đã xác minh: −0.3 điểm phần trăm
  Kênh số (chi phí phục vụ thấp hơn): −0.3 điểm phần trăm
```

Ma trận chính xác hơn, khuyến khích hành vi tốt và giữ chân khách hàng trung thành, nhưng quản trị phức tạp hơn: mỗi ô là một mức giá phải được chứng minh bằng chi phí và được kiểm tra về công bằng.

:::summary[Mục 12.1]
Ranh giới hạng có cơ sở kinh tế: mỗi hạng tương ứng với một khoảng xác suất vỡ nợ mà lãi suất của hạng phải bù được. Hiệu chuẩn so PD dự báo với PD thực tế để biết mô hình có đang định giá sai không, đặc biệt ở sát các ngưỡng. Ngưỡng động cần quản trị của hội đồng rủi ro. Phân khúc theo điểm, DTI và hành vi chính xác hơn nhưng phức tạp hơn khi quản trị.
:::

## 12.2 Mô hình chi phí cộng biên

### Phân rã chi phí đầy đủ

::::story
Bà Hương trình đề xuất định giá lên Hội đồng quản trị. Hội đồng hỏi: "Vì sao Sub-prime là 21%? Cơ sở tính là gì?"

Câu trả lời phải dựa trên phân rã chi phí đầy đủ, không phải "vì thị trường tính vậy".
::::

Có một điểm kỹ thuật phải làm đúng trước khi tính: khoản vay trả góp giảm dần. Với khoản vay 12 tháng, dư nợ bình quân chỉ khoảng 55% số tiền vay. Lãi suất danh nghĩa được tính trên dư nợ, nên mọi chi phí cũng phải quy về **phần trăm dư nợ bình quân mỗi năm** thì mới so được với lãi suất. Chia chi phí cho số tiền vay ban đầu, rồi nhân lãi suất với cả số tiền vay trong suốt kỳ hạn, là lỗi phổ biến làm doanh thu lãi bị thổi phồng gần gấp đôi.

**Giả định chung cho cả ba hạng** (cùng khoản vay chuẩn của sách):

```text
Khoản vay: 18,500,000 VNĐ, 12 tháng, trả góp đều, phí thẩm định 200,000 VNĐ
Khoản vay vỡ nợ: trả được 6 kỳ rồi dừng; EAD = dư nợ sau kỳ 6
LGD: 62%

Nguồn vốn (cấu trúc 85% nợ, 15% vốn chủ sở hữu):
  Vay ngân hàng: 9.0%/năm, 65% phần nợ
  Trái phiếu: 7.6%/năm, 35% phần nợ
  Chi phí nợ bình quân: 65% × 9.0% + 35% × 7.6% = 8.5%/năm
  Vốn chủ sở hữu: 15% dư nợ, ROE mục tiêu 18%/năm

  Chi phí vốn trên dư nợ:     85% × 8.5% = 7.23%/năm
  Yêu cầu lợi nhuận vốn chủ:  15% × 18%  = 2.70%/năm
```

Vốn chủ sở hữu không phải nguồn vốn rẻ. Cổ đông kỳ vọng lợi nhuận cao hơn chủ nợ vì họ chịu tổn thất trước, nên 18% là chi phí cơ hội của họ, cao gấp đôi chi phí nợ.

**Phân rã chi phí, hạng Sub-prime:**

```text
PD: 6.5%, kênh POS (có hoa hồng đại lý)
Dư nợ bình quân của danh mục: 10.15 triệu VNĐ-năm mỗi khoản vay

                                  VNĐ/khoản vay   % dư nợ bình quân/năm
1. Chi phí vốn (phần nợ)              733,494            7.23%
2. Tổn thất dự kiến                   392,159            3.86%
   = 6.5% × 62% × EAD 9,731,000
3. Chi phí vận hành                   840,250            8.28%
   Khởi tạo một lần: 550,000
     (tra cứu tín dụng, xử lý hồ sơ, hoa hồng đại lý, hệ thống)
   Phục vụ: 300,000/năm
     (collections tích cực hơn, chăm sóc khách hàng nhiều hơn)
4. Lợi nhuận vốn chủ (ROE 18%)        274,109            2.70%
─────────────────────────────────────────────────────────────
Tổng chi phí cần bù                 2,240,012           22.07%
Trừ phí thẩm định                    −200,000           −1.97%
─────────────────────────────────────────────────────────────
Lãi suất hòa vốn (có ROE mục tiêu)                     20.10%
Lãi suất áp dụng                                       21.00%
Biên                                                   +0.90 điểm
```

Hai điều đáng chú ý. Chi phí vận hành, không phải tổn thất, là thành phần lớn nhất của Sub-prime: một khoản vay nhỏ, ngắn hạn phải gánh chi phí khởi tạo cố định trên một dư nợ bình quân nhỏ. Và biên của Sub-prime rất mỏng: nếu PD thật là 8% thay vì 6.5%, lãi suất hòa vốn lên 21.01%, tức hạng này lỗ nhẹ ở mức 21%.

### Hòa vốn cho từng hạng

Cùng một mô hình mô phỏng cho cả ba hạng, chỉ khác PD và chi phí vận hành:

| | Prime | Standard | Sub-prime |
|---|---:|---:|---:|
| PD bình quân | 1.0% | 3.0% | 6.5% |
| Chi phí khởi tạo | 300,000 | 300,000 | 550,000 |
| Chi phí phục vụ/năm | 100,000 | 150,000 | 300,000 |
| Chi phí vốn (% dư nợ bình quân) | 7.23% | 7.23% | 7.23% |
| Tổn thất dự kiến | 0.58% | 1.76% | 3.86% |
| Chi phí vận hành | 3.91% | 4.39% | 8.28% |
| Lợi nhuận vốn chủ | 2.70% | 2.70% | 2.70% |
| Phí thẩm định (giảm trừ) | −1.96% | −1.96% | −1.97% |
| **Lãi suất hòa vốn (có ROE 18%)** | **12.46%** | **14.12%** | **20.10%** |
| Lãi suất áp dụng | 15% | 18% | 21% |
| Biên vượt ROE mục tiêu | +2.54 | +3.88 | +0.90 |

Cả ba hạng đều có lãi ở mức giá hiện tại, và Standard có biên tốt nhất. Đây là điều thường gặp: Prime bị cạnh tranh ép giá, Sub-prime bị chi phí vận hành và tổn thất ép biên, còn Standard là phần thân khỏe của danh mục.

Bảng này cũng cho thấy vì sao phải tính ở cấp danh mục chứ không phải từng khoản vay. Một khoản vay riêng lẻ hoặc trả đủ (lời) hoặc vỡ nợ (lỗ nặng); chỉ khi tính trên cả danh mục, với tỷ lệ vỡ nợ kỳ vọng, mới thấy lãi từ 93.5% khoản vay tốt có bù được tổn thất từ 6.5% khoản vay xấu hay không.

**Khi nào chấp nhận một hạng có biên âm?** Nếu biên Sub-prime chuyển sang âm (ví dụ vì PD tăng), công ty có thể vẫn giữ hạng này với hai điều kiện: tổng danh mục vẫn có lãi nhờ Prime và Standard, và giá trị vòng đời của khách hàng Sub-prime dương vì một phần trong số họ sẽ trả tốt và "tốt nghiệp" lên Standard. Điều kiện thứ hai phải được đo, không phải giả định: theo dõi tỷ lệ tốt nghiệp, và tăng giá hoặc siết ngưỡng nếu nó thấp hơn mức đã đặt ra.

:::summary[Mục 12.2]
Lãi suất hòa vốn là tổng của chi phí vốn, tổn thất dự kiến, chi phí vận hành và lợi nhuận vốn chủ, trừ phần phí thu được, tất cả quy về phần trăm dư nợ bình quân mỗi năm. Với các giả định của Vela Finance, hòa vốn của Prime, Standard và Sub-prime lần lượt là 12.46%, 14.12% và 20.10%, nên các mức 15%, 18% và 21% đều có lãi, nhưng biên của Sub-prime rất mỏng và nhạy với PD. Tính ở cấp danh mục, và chỉ chấp nhận trợ giá chéo khi giá trị vòng đời được đo, không phải giả định.
:::

## 12.3 Cạnh tranh và độ co giãn giá

### Độ co giãn giá trong cho vay tiêu dùng

:::key
**Độ co giãn giá của cầu** *(price elasticity of demand)* là tỷ số giữa phần trăm thay đổi của lượng cầu và phần trăm thay đổi của giá. Với khoản vay, "giá" là lãi suất, và phần trăm thay đổi tính trên chính lãi suất: hạ từ 15% xuống 14% là giảm 6.67%, không phải giảm 1%.
:::

Trị tuyệt đối lớn hơn 1 là co giãn (lượng cầu nhạy với giá), nhỏ hơn 1 là kém co giãn. Khách hàng Prime thường co giãn mạnh vì họ chủ động so sánh và có nhiều lựa chọn. Khách hàng Sub-prime kém co giãn hơn vì ít lựa chọn, nhu cầu gấp hơn. Hệ quả: với Prime, lãi suất cạnh tranh là sống còn; với Sub-prime, tốc độ và khả năng tiếp cận quan trọng hơn lãi suất.

**Ví dụ: có nên đổi giá Prime?**

```text
Hiện tại: Prime 15%, giải ngân 5,000 khoản/tháng
Độ co giãn ước tính: −1.8
Lợi nhuận mỗi khoản vay (sau ROE mục tiêu, theo mô hình 12.2):
  ở 14%: 157,036   ở 15%: 259,714   ở 16%: 362,691 VNĐ

Phương án A: hạ xuống 14% (−6.67%)
  Lượng: 5,000 × (1 + 1.8 × 6.67%) = 5,600 khoản
  Lợi nhuận: 5,600 × 157,036 = 879 triệu VNĐ/tháng

Hiện tại: 15%
  Lợi nhuận: 5,000 × 259,714 = 1,299 triệu VNĐ/tháng

Phương án B: tăng lên 16% (+6.67%)
  Lượng: 5,000 × (1 − 1.8 × 6.67%) = 4,400 khoản
  Lợi nhuận: 4,400 × 362,691 = 1,596 triệu VNĐ/tháng
```

Trên giấy, tăng giá có lợi hơn dù mất 600 khoản mỗi tháng. Nhưng có ba lý do để thận trọng. Độ co giãn chỉ đúng quanh mức giá đã đo; xa hơn, khách hàng có thể bỏ đi hàng loạt khi đối thủ rẻ hơn rõ rệt. Những khách hàng ở lại sau khi tăng giá thường là những người ít lựa chọn hơn, tức rủi ro hơn, nên PD của Prime có thể tăng và xóa mất phần lợi. Và vị thế thị trường, hình ảnh thương hiệu là những chi phí không nằm trong bảng tính tháng này.

### Chiến lược định vị

| Chiến lược | Lãi suất | Mục tiêu | Rủi ro | Khi nào dùng |
|---|---|---|---|---|
| Dẫn đầu về giá | Thấp hơn thị trường 0.5-1 điểm | Thu hút khối lượng, nhất là Prime | Ép biên, thu hút chất lượng lẫn lộn | Người mới vào muốn giành thị phần |
| Ngang thị trường | Thị trường ± 0.2 điểm | Cạnh tranh ở mọi phân khúc | Không có khác biệt | Người chơi đã có vị thế |
| Cao hơn nhờ giá trị gia tăng | Cao hơn 0.5-1.5 điểm | Khách hàng coi trọng tốc độ, tiện lợi | Khách nhạy giá bỏ đi | Thương hiệu mạnh, lợi thế số |
| Theo phân khúc | Theo từng phân khúc | Phân khúc giá trị cao có nhu cầu riêng (giáo viên, nhân viên y tế) | Phức tạp, bị soi về cho vay công bằng | Có dữ liệu phân khúc tốt |

Vela Finance chọn ngang thị trường cho Prime (15%), cao hơn một chút cho Standard nhờ duyệt nhanh trên kênh số (18%), và thấp hơn mặt bằng Sub-prime của thị trường (21%) nhưng vẫn trên hòa vốn. Sản phẩm cho giáo viên có giá riêng vì dữ liệu cho thấy phân khúc này rủi ro thấp, và BNPL có lãi suất danh nghĩa 0% nhờ mô hình người bán trợ giá (Chương 3).

### Phòng tránh vòng xoáy lựa chọn bất lợi

Nếu lãi suất Prime cao hơn thị trường, khách Prime chuyển sang đối thủ vì họ có lựa chọn, còn khách Standard và Sub-prime ở lại. Chất lượng danh mục giảm, phải tăng giá để bù vỡ nợ, thêm khách Prime bỏ đi, và vòng xoáy tiếp diễn. Cách phòng tránh là theo dõi cơ cấu chất lượng của đơn vay mới hằng tháng:

```text
Bảng theo dõi hằng tháng: cơ cấu đơn vay mới

Phân khúc   Tháng này   Bình quân 6 tháng   Ngưỡng cảnh báo
Prime          38%            42%             < 35%
Standard       47%            46%             > 55%
Sub-prime      15%            12%             > 20%

Nếu Prime < 35%:
  → Kiểm tra lãi suất đối thủ (khảo sát như khách hàng thật)
  → Hỏi các khách Prime đã bỏ đi: vì sao họ chọn nơi khác?
  → Cân nhắc điều chỉnh giá hoặc cải thiện trải nghiệm (duyệt nhanh hơn)

Nếu Sub-prime > 20%:
  → Chiến dịch marketing có nhắm sai phân khúc không?
  → Ngưỡng chấm điểm có vô tình bị thay đổi không?
  → Tạm thời siết tiêu chí duyệt
```

:::summary[Mục 12.3]
Độ co giãn được tính trên phần trăm thay đổi của chính lãi suất. Khách Prime co giãn mạnh, khách Sub-prime kém co giãn. Một phép tính đơn giản có thể cho thấy tăng giá có lợi, nhưng độ co giãn chỉ đúng cục bộ và người ở lại sau khi tăng giá thường rủi ro hơn. Theo dõi cơ cấu chất lượng đơn vay mới là cách phát hiện sớm vòng xoáy lựa chọn bất lợi.
:::

## 12.4 Biểu phí là hạ tầng định giá

### Từ quyết định định giá đến cấu hình biểu phí

Chương 3 đã giải thích thiết kế dựa trên biểu phí: quyết định định giá nằm trong cơ sở dữ liệu, không nằm trong code. Ở đây ta nối mô hình định giá với cấu hình đó.

**Bước 1: quyết định của hội đồng rủi ro**

```text
Quyết định (tháng 3/2025):
  Prime: giảm lãi suất từ 15.0% xuống 14.5% vì áp lực cạnh tranh
  Hiệu lực: 1/4/2025
  Lý do: đối thủ ra mắt 14.8%, đơn Prime đang giảm
  Kiểm tra: hòa vốn của Prime 12.46% → vẫn còn biên ở 14.5%
```

**Bước 2: chuyển thành cấu hình biểu phí**

```text
Phiên bản hiện tại:
  Tariff code = "PRIME", version = 3
  validFrom: 2025-01-01, validTo: 2025-04-01 (nửa mở: validTo không được tính)
  FeeComponent lãi (INTEREST_CASH_PRIME):
    lãi suất tháng: 1.25% (= 15.0% / 12)

Phiên bản mới:
  Tariff code = "PRIME", version = 4
  validFrom: 2025-04-01, validTo: null
  FeeComponent lãi (INTEREST_CASH_PRIME_V2):
    lãi suất tháng: 1.2083% (= 14.5% / 12)

Không sửa code. Không sửa phiên bản cũ.
Phiên bản được chọn theo ngày, nhờ validFrom/validTo.
(Tên mã ở đây viết dài cho dễ đọc; mã thật trong VLP là viết tắt ngắn.)
```

Lưu ý `validTo` của phiên bản 3 là 2025-04-01, đúng ngày phiên bản 4 bắt đầu. Như Chương 3 đã phân tích, đặt `validTo` là 2025-03-31 sẽ tạo ra một ngày không có biểu phí nào hiệu lực.

**Bước 3: khách hàng cũ và khách hàng mới**

Khoản vay Prime ký trước 1/4/2025 vẫn gắn với phiên bản 3 và trả 15% đến hết kỳ hạn, vì điều khoản hợp đồng được khóa khi khởi tạo (cờ `useLatestTariff: false`). Khoản vay ký từ 1/4/2025 nhận phiên bản 4 và trả 14.5%. Khi khởi tạo, hệ thống xác định hạng lúc phê duyệt, tìm phiên bản biểu phí đang hiệu lực của hạng đó (validFrom ≤ hôm nay < validTo), rồi gắn mã và phiên bản vào hợp đồng của tài khoản mới.

### Thử nghiệm A/B cho giá

::::story
Anh Minh đề xuất: "Mình thử A/B nhé: một nửa khách Prime nhận 14.5%, nửa còn lại 15.0%. So sánh tỷ lệ chuyển đổi và tỷ lệ vỡ nợ."

Có hai vấn đề cần giải quyết trước khi chạy thử nghiệm.
::::

**Vấn đề 1: công bằng và pháp lý.** Hai khách hàng nộp đơn cùng ngày, cùng hồ sơ rủi ro, một người nhận 14.5% và người kia 15.0%. Ở Mỹ, cách này thường chấp nhận được nếu phân nhóm ngẫu nhiên và không tương quan với thuộc tính được bảo vệ. Ở EU, cần mục đích và thời hạn được ghi rõ. Ở Việt Nam chưa có quy định cấm trực tiếp, nhưng xu hướng là tăng minh bạch. Cách giảm thiểu: ghi rõ mục đích, thời hạn và phạm vi thử nghiệm; bảo đảm phân nhóm thật sự ngẫu nhiên; giới hạn thời gian; và có điều kiện dừng nếu tỷ lệ vỡ nợ của một nhóm lệch đáng kể.

**Vấn đề 2: ý nghĩa thống kê.**

```text
Với chênh lệch tỷ lệ chuyển đổi:
  Tỷ lệ chuyển đổi nền (15.0%): 65%
  Kỳ vọng (14.5%): 68% (+3 điểm phần trăm)

  α = 0.05, power 80% (β = 0.20)
  Hiệu ứng nhỏ nhất cần phát hiện: 3 điểm phần trăm

  n = 2 × (Z_α/2 + Z_β)² × p(1 − p) / Δ²
    = 2 × (1.96 + 0.84)² × 0.65 × 0.35 / 0.03²
    = 2 × 7.84 × 0.2275 / 0.0009
    ≈ 3,964 mỗi nhóm, tổng 7,928

  Với khoảng 5,000 đơn Prime mỗi tháng: cần khoảng 7 tuần

Với chênh lệch tỷ lệ vỡ nợ:
  Phải chờ vỡ nợ xảy ra → tối thiểu 6-12 tháng
  → Thử nghiệm A/B cho tỷ lệ vỡ nợ lâu hơn nhiều
  → Dùng champion/challenger với giám sát dài hạn
```

### Định giá động: cơ hội và rủi ro

Thay vì các hạng cố định, định giá động tính giá riêng cho từng người: lãi suất = f(điểm, DTI, kênh, thời điểm, bối cảnh cạnh tranh, CLV). Các hãng hàng không làm vậy với vé máy bay. Vì sao cho vay tiêu dùng khác?

Thứ nhất, những khách hàng "giống hệt nhau" phải được đối xử như nhau, và định giá theo dữ liệu hành vi dễ trở thành phân biệt qua biến đại diện. Thứ hai, vé máy bay dùng một lần rồi quên, còn khoản vay kéo dài 12-36 tháng; khách hàng nhìn thấy lãi suất mỗi tháng và sẽ khiếu nại khi biết bạn mình được giá thấp hơn. Thứ ba, có một vòng phản hồi lựa chọn bất lợi: người sẵn sàng chấp nhận lãi suất rất cao thường là người đang gấp, tức rủi ro hơn. Thứ tư là rủi ro danh tiếng: "công ty tính lãi khác nhau dựa trên lịch sử duyệt web của bạn" là một tiêu đề báo không ai muốn.

| Chấp nhận được | Không chấp nhận được |
|---|---|
| Giảm giá cho khách hàng cũ có lịch sử tốt | Dựa trên biến đại diện cho nhân khẩu học |
| Giá thấp hơn cho kênh số vì chi phí phục vụ thấp hơn | Dựa trên tín hiệu cấp bách (nộp đơn lúc 2 giờ sáng → lãi cao hơn) |
| Khuyến mãi có thời hạn | Tiêu chí mờ mà khách hàng không hiểu được |
| Đề nghị tiền duyệt dựa trên dữ liệu tín dụng | "Cá nhân hóa" nhưng thực chất là phân biệt đối xử |

:::summary[Mục 12.4]
Quyết định định giá đi vào hệ thống bằng một phiên bản biểu phí mới, không sửa code; khoản vay cũ giữ lãi suất lúc khởi tạo. Thử nghiệm A/B cho giá cần rà soát pháp lý, tính cỡ mẫu và giới hạn thời gian; tỷ lệ vỡ nợ cần thời gian quan sát dài hơn nhiều so với tỷ lệ chuyển đổi. Định giá động chấp nhận được cho lòng trung thành, kênh và khuyến mãi, không chấp nhận được khi dựa trên biến đại diện hay khai thác sự cấp bách.
:::

## 12.5 Định giá hành vi

### Hiệu ứng mỏ neo khi trình bày đề nghị vay

Chương 4 đã giới thiệu hiệu ứng mỏ neo: người đọc bám vào con số đầu tiên họ thấy. Trong định giá, đây là công cụ mạnh, nhưng phải dùng đúng.

Cùng một đề nghị: 30,000,000 VNĐ, 18 tháng, 18%/năm, phí khởi tạo 1%. Khoản trả hằng tháng 1,914,173 VNĐ, tổng tiền lãi 4,455,121 VNĐ, APR 19.35%. Có hai cách trình bày:

| | Cách A: neo vào khoản trả tháng | Cách B: cân bằng |
|---|---|---|
| Dòng chữ lớn nhất | "Chỉ 1,914,173 VNĐ/tháng" | Số tiền vay 30,000,000 VNĐ |
| Lãi suất và APR | Chữ nhỏ cuối trang | 18%/năm, APR 19.35%, cùng cỡ chữ |
| Tổng phải trả | Chữ nhỏ cuối trang | 34,455,121 VNĐ, cùng phí 300,000 VNĐ |
| Bối cảnh khả năng chi trả | Không có | "Bằng 13.7% thu nhập tháng của bạn" (thu nhập 14 triệu) |
| Hệ quả | Khách hàng bám vào số nhỏ, bỏ qua tổng chi phí | Khách hàng thấy nhiều con số và tự đánh giá |

Cách A khai thác sự chú ý; cách B giúp khách hàng quyết định có hiểu biết. Xu hướng quy định ở nhiều nơi là yêu cầu công bố đầy đủ tổng chi phí ngay từ đầu, như Chỉ thị Tín dụng Tiêu dùng của EU hay quy định của FCA ở Anh. Thiết kế hệ thống cho cách trình bày cân bằng ngay từ bây giờ rẻ hơn nhiều so với sửa lại khi quy định đến.

### Hiệu ứng mồi nhử

:::key
**Hiệu ứng mồi nhử** *(decoy effect)* xảy ra khi thêm một lựa chọn thứ ba kém hấp dẫn làm cho một trong hai lựa chọn ban đầu trông hấp dẫn hơn.
:::

Ví dụ kinh điển là thí nghiệm của Dan Ariely với gói đặt báo The Economist: bản điện tử 59 USD, bản in 125 USD, bản in kèm điện tử 125 USD. Khi có lựa chọn bản in đơn thuần (mồi nhử), 84% chọn gói in kèm điện tử và 16% chọn bản điện tử. Khi bỏ lựa chọn mồi nhử, tỷ lệ đảo lại: 68% chọn bản điện tử, 32% chọn gói kết hợp.

Trong cho vay, cách làm tương tự:

```text
Không có mồi nhử:
  A: 15,000,000 VNĐ, 12 tháng, 15%/năm → 1,353,875 VNĐ/tháng, tổng lãi 1,246,500
  B: 15,000,000 VNĐ, 24 tháng, 15%/năm →   727,300 VNĐ/tháng, tổng lãi 2,455,200

Thêm mồi nhử C, gần giống A nhưng kém hơn rõ rệt:
  C: 15,000,000 VNĐ, 12 tháng, 15%/năm, thêm phí khởi tạo 3%

  C làm A trông như "món hời", nên nhiều khách hàng chọn A hơn so với B.
```

Có đạo đức không? Nếu C là một sản phẩm thật, được định giá công bằng và có người thực sự cần nó, việc đặt nó cạnh A và B là chấp nhận được. Nếu C được tạo ra chỉ để thao túng lựa chọn, không ai được kỳ vọng sẽ chọn nó, hoặc có giá cao bất hợp lý chỉ để làm nền, thì không.

### Ranh giới đạo đức của định giá hành vi

| Chấp nhận được | Không chấp nhận được |
|---|---|
| Mọi chi phí được hiển thị rõ ràng | Phí ẩn chỉ xuất hiện sau khi đã cam kết |
| Khách hàng hiểu mình đang chọn gì | Cấp bách giả: "lãi suất này hết hạn sau 10 phút" khi không phải vậy |
| Khách hàng chủ động chọn sản phẩm | Phức tạp có chủ đích, khiến không thể so sánh |
| Mọi lựa chọn đều thật và công bằng | Lãi cao hơn cho khách hàng nộp đơn khi đang khủng hoảng |
| Giáo dục: "trả trong 12 tháng thay vì 24, bạn tiết kiệm X" | Mỏ neo lừa dối: gạch một con số lớn để "giảm giá" xuống số nhỏ hơn |

Phép thử: một người bình thường, có đầy đủ thông tin, có cảm thấy bị lừa không? Nếu có, đừng làm. Nếu không, có thể chấp nhận được, nhưng vẫn phải kiểm tra tuân thủ.

## 12.6 Quản trị định giá và tuân thủ

### Trần lãi suất

Ở Việt Nam, Bộ luật Dân sự 2015 (Điều 468) giới hạn lãi suất thỏa thuận ở mức không quá 20%/năm, trừ trường hợp luật khác có liên quan quy định khác; hoạt động cho vay của tổ chức tín dụng, gồm công ty tài chính, được điều chỉnh bởi pháp luật về các tổ chức tín dụng. Dù khung pháp lý hiện tại áp dụng cho Vela Finance thế nào, khả năng cơ quan quản lý đặt hoặc thay đổi một trần lãi suất là rủi ro mà hệ thống định giá phải sẵn sàng.

::::story
Giả sử cơ quan quản lý công bố: từ một ngày cụ thể, khoản vay tiêu dùng không có tài sản bảo đảm không được có APR vượt một mức trần.

Hệ thống phải tự động bảo đảm tuân thủ. VLP hiện chưa làm được điều đó.
::::

LPS đã tính XIRR (lãi suất thực tế) cho mỗi kế hoạch trả góp, nhưng không có bước nào so XIRR với một trần lãi suất. Không có validator, không có mã lỗi, không có tham số cấu hình nào cho trần. Nếu cần bổ sung, thiết kế tự nhiên là một bước kiểm tra trong luồng chọn đề nghị vay *(chooseOffer)*:

```text
// Thiết kế đề xuất (minh họa)
// 1. LPS tính XIRR sau khi tạo kế hoạch trả góp
// 2. Bước kiểm tra mới trong chooseOffer: so XIRR với trần đọc từ cấu hình
//    (trần theo loại sản phẩm, có validFrom như biểu phí)
// 3. Vượt trần → từ chối đề nghị, ghi lý do, không cho khách hàng ký
//
// if (calculatedXIRR.compareTo(regulatoryCapConfig.getConsumerUnsecured()) > 0) {
//     throw new ValidationException("APR exceeds regulatory cap");
// }
```

Điểm quan trọng là trần phải được kiểm tra trên APR (đã gồm phí), không phải lãi suất danh nghĩa. Khoản vay của chị Lan có lãi suất danh nghĩa 18% nhưng APR 20.10%; với một trần 20%, kiểm tra trên lãi suất danh nghĩa sẽ cho qua một khoản vay vi phạm.

### Dấu vết kiểm toán của định giá

Mọi quyết định định giá cần được ghi lại. Dưới đây là một schema minh họa:

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

```text
Tình huống: khách hàng khiếu nại 18 tháng sau
  "Các anh tính tôi nhiều hơn thỏa thuận"

  Có dấu vết kiểm toán:
    Tra quyết định định giá theo mã đơn vay
    Chứng minh: tại thời điểm phê duyệt, biểu phí nào đang hiệu lực
    Chứng minh: APR đã công bố là 20.10%
    → Chuỗi bằng chứng đầy đủ

  Không có dấu vết kiểm toán:
    "Chúng tôi không còn hồ sơ từ 18 tháng trước"
    → Mất uy tín, vi phạm quy định, bất lợi nếu ra tòa
```

VLP không có bảng nhật ký định giá riêng, nhưng hợp đồng trong CTM lưu mã và phiên bản biểu phí tại thời điểm khởi tạo. Kết hợp với dữ liệu phiên bản biểu phí, có thể dựng lại đầy đủ quyết định định giá của bất kỳ khoản vay nào.

:::summary[Mục 12.5 và 12.6]
Trình bày đề nghị vay phải cân bằng: lãi suất, APR và tổng phải trả cùng nổi bật như khoản trả hằng tháng. Hiệu ứng mồi nhử chỉ chấp nhận được khi mọi lựa chọn đều thật và công bằng. VLP hiện chưa kiểm tra trần lãi suất dù LPS đã tính XIRR; nếu bổ sung, phải kiểm tra trên APR chứ không phải lãi suất danh nghĩa. Quyết định định giá dựng lại được từ hợp đồng CTM và phiên bản biểu phí.
:::

## Tóm tắt chương 12

```text
Từ 420 điểm của chị Lan đến lãi suất 18%:

Điểm 420 → hạng Standard (380-439)
  PD theo thang điểm: odds 40 : 1 → khoảng 2.4%
  DTI sau khoản vay: 7.7% → khả năng chi trả tốt
  Kênh: DIGITAL → chi phí khởi tạo thấp
  Khách hàng lần đầu → chưa có ưu đãi khách hàng cũ

Kinh tế học của hạng Standard (mô hình 12.2):
  Chi phí vốn:             7.23%
  Tổn thất dự kiến:        1.76%
  Chi phí vận hành:        4.39%
  Lợi nhuận vốn chủ:       2.70%
  Trừ phí thẩm định:      −1.96%
  Hòa vốn:                14.12%
  Lãi suất áp dụng:       18.00% → biên 3.88 điểm phần trăm

Công bố cho khách hàng:
  Lãi suất danh nghĩa: 18%/năm
  APR: 20.10%/năm (gồm phí thẩm định 200,000 VNĐ)
  Khoản trả hằng tháng: 1,696,080 VNĐ (kỳ cuối 1,696,077)
  Tổng tiền lãi: 1,852,957 VNĐ
  Tổng phải trả: 20,352,957 VNĐ, cộng phí 200,000 VNĐ

Dấu vết: dựng lại được từ hợp đồng CTM + phiên bản biểu phí.
Trần lãi suất: VLP chưa kiểm tra; nếu bổ sung, kiểm tra trên APR 20.10%.

Định giá không phải phỏng đoán. Mỗi con số đều có lý do.
```

## Câu hỏi tự kiểm tra

**Loại 1: Nhớ lại**
1. Kể các thành phần của mô hình chi phí cộng biên. Thành phần nào lớn nhất ở hạng Sub-prime trong ví dụ của chương, và vì sao?
2. Độ co giãn giá là gì? Vì sao khách Prime thường co giãn mạnh hơn khách Sub-prime?
3. Biểu phí có validFrom/validTo. Vì sao khoản vay đang chạy không bị ảnh hưởng khi một phiên bản biểu phí mới được tạo?
4. APR khác lãi suất danh nghĩa ở điểm nào? Vì sao trần lãi suất phải được kiểm tra trên APR?

**Loại 2: Hiểu**
5. Giải thích vòng xoáy lựa chọn bất lợi trong định giá. Vì sao tăng lãi suất để bù vỡ nợ lại có thể làm vỡ nợ tăng thêm?
6. Vì sao chi phí phải quy về phần trăm dư nợ bình quân, không phải phần trăm số tiền vay ban đầu? Điều gì xảy ra với lãi suất hòa vốn nếu làm sai?
7. Định giá động chấp nhận được cho ưu đãi khách hàng trung thành nhưng không chấp nhận được khi dựa trên tín hiệu cấp bách. Vì sao?
8. Hiệu ứng mồi nhử là gì? Khi nào dùng mồi nhử trong thiết kế sản phẩm là có đạo đức?

**Loại 3: Áp dụng**
9. Sản phẩm mới cho Sub-prime: 10,000,000 VNĐ, 12 tháng, trả góp đều.
   - Chi phí nợ: 9%/năm, cấu trúc 85% nợ, 15% vốn chủ, ROE mục tiêu 20%
   - PD: 8%, LGD: 65%, khoản vỡ nợ trả được 6 kỳ
   - Chi phí khởi tạo: 500,000 VNĐ (một lần)
   - Chi phí phục vụ: 400,000 VNĐ/năm
   - Không có phí khởi tạo thu từ khách hàng

   (a) Tính lãi suất hòa vốn bằng mô phỏng danh mục 100 khoản vay
   (b) Lãi suất tối thiểu nên áp dụng là bao nhiêu?
   (c) Nếu đối thủ tính 26%, bạn nên định vị thế nào?

10. Thiết kế thử nghiệm A/B cho hạng Standard (18.0% so với 17.5%):
    - Số đơn nền: 3,000/tháng
    - Tỷ lệ duyệt nền: 70%
    - Tỷ lệ vỡ nợ nền: 3%
    - Độ co giãn kỳ vọng: −1.5

    (a) Lượng đơn kỳ vọng thay đổi thế nào nếu giảm xuống 17.5%?
    (b) Cỡ mẫu cần thiết để phát hiện chênh lệch tỷ lệ chuyển đổi 3 điểm phần trăm
    (c) Tác động ròng đến lợi nhuận của việc giảm giá
    (d) Cần chạy bao lâu trước khi đánh giá được tác động lên tỷ lệ vỡ nợ?

**Loại 4: Phân tích**
11. Công ty cân nhắc "định giá theo giờ": khách nộp đơn ngoài giờ hành chính (18-22 giờ) chịu lãi cao hơn 1.5 điểm phần trăm, với lý do "rủi ro hành vi cao hơn". Dữ liệu: tỷ lệ vỡ nợ của đơn ngoài giờ là 6.5% so với 4.5% trong giờ hành chính.

    Phân tích: (a) Dữ liệu có đủ để biện minh cho giá khác biệt không? (b) Có tuân thủ quy định không? (c) Có đạo đức không? (d) Cách nào khác đạt cùng mục tiêu quản trị rủi ro?

12. Hội đồng quản trị yêu cầu: "Tăng lãi suất Standard từ 18% lên 20% để cải thiện biên." Đội rủi ro phản đối: "Chúng ta sẽ mất khách Standard." Đội marketing nói: "Không sao, khách Standard ít nhạy giá." Ai đúng?

    Thiết kế phân tích: (a) Cần dữ liệu gì? (b) Ước lượng độ co giãn riêng cho Standard thế nào? (c) Tác động đến lãi lỗ? (d) Khuyến nghị của bạn với hội đồng?

## Bài tập áp dụng

**Bài 1: Mô hình định giá đầy đủ cho BNPL**

Xây dựng mô hình định giá cho ba phân khúc của sản phẩm BNPL: không phí khởi tạo, kỳ hạn 3 tháng, số tiền bình quân 5,000,000 VNĐ.

Giả định:
- Chi phí nợ: 9%/năm; cấu trúc 88% nợ, 12% vốn chủ; ROE mục tiêu 20%
- Chi phí vận hành: 250,000 VNĐ/khoản vay (cố định, kênh POS của người bán)
- Người bán có thể trợ giá cho ưu đãi "0% lãi suất": mức trợ giá tùy đàm phán

Phân khúc (khách BNPL khác khách vay thông thường):
- Thin-file: chỉ có dữ liệu thay thế; PD 18%, LGD 55%
- Standard: có ít dữ liệu tín dụng; PD 8%, LGD 58%
- Prime: dữ liệu tín dụng đầy đủ, lịch sử tốt; PD 3%, LGD 52%

Yêu cầu:
(a) Tính lãi suất hòa vốn cho từng phân khúc
(b) Thiết kế chiến lược giá: mỗi phân khúc nên tính bao nhiêu?
(c) Nếu chào "0% lãi", tính mức trợ giá cần thiết từ người bán
(d) Tính APR (gồm mọi khoản phí) và so với một trần giả định 20%/năm
(e) Cấu hình biểu phí: cần những FeeComponent nào?

**Bài 2: Phản ứng trước đối thủ**

Đối thủ vừa ra mắt sản phẩm với lãi suất Prime 13.8% (so với 15% của bạn). Anh Minh cần phân tích trong 48 giờ.

Dữ liệu hiện có:
- Số đơn Prime hằng tháng của bạn: 5,000
- Đối thủ công bố cách đây 2 tuần
- Số đơn từ khi đối thủ công bố: 4,200/tháng (giảm 800, tức −16%)
- Tỷ lệ tổn thất tín dụng (Prime): 1.0%
- Độ co giãn ước tính: −1.8

Yêu cầu:
(a) Mức giảm 16% có ý nghĩa thống kê không hay nằm trong biến động bình thường?
(b) Tác động doanh thu của tình hình hiện tại so với trước khi đối thủ ra mắt
(c) Ba phương án phản ứng, kèm phân tích lãi lỗ cho từng phương án (dùng hòa vốn Prime 12.46% làm sàn)
(d) Khuyến nghị của bạn kèm đánh giá rủi ro
(e) Dữ liệu nào giúp phân tích của bạn chắc chắn hơn?

**Bài 3: Hệ thống tuân thủ trần lãi suất**

Giả sử cơ quan quản lý thông báo: sau 6 tháng nữa, trần APR cho vay tiêu dùng không bảo đảm là 22%/năm.

Phân tích danh mục hiện tại:
- 15% khoản vay có APR từ 22% đến 24% (sẽ vượt trần mới)
- Tất cả là khoản vay Sub-prime khởi tạo trong năm nay

Thiết kế phương án tuân thủ:
(a) Thay đổi hệ thống ở khâu khởi tạo (logic kiểm tra)
(b) Khoản vay đang chạy có APR vượt trần mới xử lý thế nào? (không thể thay đổi hồi tố)
(c) Định giá lại sản phẩm Sub-prime để APR dưới 22% thế nào?
(d) Tác động kinh doanh: bao nhiêu khách Sub-prime sẽ bị từ chối?
(e) Giám sát: làm sao bảo đảm không khoản vay mới nào vượt trần sau khi triển khai?

## Đọc thêm

**Định giá dựa trên rủi ro:**
- Thomas, L. C., Crook, J. N., & Edelman, D. B. (2017). *Credit Scoring and Its Applications* (2nd ed.). SIAM. Các chương về định giá và mô hình lợi nhuận.

**Định giá hành vi:**
- Ariely, D. (2008). *Predictably Irrational: The Hidden Forces That Shape Our Decisions.* HarperCollins. Các chương đầu về hiệu ứng mồi nhử, mỏ neo và ứng dụng vào định giá.

**Quy định về công bố chi phí:**
- Consumer Financial Protection Bureau. *Truth in Lending Act (Regulation Z).* Có tại consumerfinance.gov. Hướng dẫn đầy đủ về cách tính và công bố APR.

*Chương 13 đưa kinh tế học hành vi vào thực tế, không chỉ là lý thuyết mà là các quyết định thiết kế sản phẩm và trải nghiệm cụ thể: từ những cú hích giúp khách hàng trả nợ đúng hạn, đến công cụ minh bạch giúp họ quyết định tốt hơn, đến những ranh giới đạo đức mà một hệ thống tài chính có trách nhiệm không nên vượt qua.*
