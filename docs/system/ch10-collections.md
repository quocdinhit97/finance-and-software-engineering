---
title: "Chương 10. Quản lý nợ và thu hồi"
sidebar_label: "10. Quản lý nợ và thu hồi"
sidebar_position: 4
chapter: 10
subtitle: "Debt Management & Collections"
reading_time: 35
description: "Collections từ ba góc độ: kinh tế học của cure rate và DPD bucket, ràng buộc pháp lý và đạo đức khi nhắc nợ, và kiến trúc của DRG module (DebtRegister theo SCD Type 2, cập nhật theo sự kiện và theo lịch). Kèm hardship program, write-off và recovery."
source_file: "phan-2-chuong-10.md"
editorial_status: "edited"
---

> *"Collections không phải là cuộc chiến giữa bên cho vay và người vay. Đó là cuộc thương lượng giữa một người có khoản phải trả và một người muốn được trả, trong bối cảnh cả hai đều muốn vấn đề kết thúc tốt đẹp nhất có thể."*

## Dẫn nhập: hai cuộc điện thoại

::::story
**Cuộc điện thoại thứ nhất, sáng 7/4:**

"Xin chào anh Tùng, em gọi từ Vela Finance. Khoản thanh toán đến hạn ngày 5/4 của anh hiện chưa được ghi nhận. Anh có cần em gửi lại đường dẫn thanh toán không ạ?"

Anh Tùng trả lời: "À, anh quên mất. Chiều nay anh chuyển." Anh cúp máy và chuyển khoản ngay. DPD 2, không có vấn đề gì.

**Cuộc điện thoại thứ hai, cũng sáng 7/4, từ một công ty tài chính khác:**

"Tài khoản của anh đang nợ 1,800,000 VNĐ. Nếu anh không thanh toán NGAY HÔM NAY, chúng tôi sẽ báo lên cơ quan tín dụng, liên hệ người thân của anh và khởi kiện."

Anh Khoa vốn định trả trong ngày nhưng chưa kịp. Nghe xong, anh tức giận. Thay vì chuyển khoản, anh viết đánh giá xấu, gửi khiếu nại và quyết định không bao giờ vay ở đó nữa.

Hai khách hàng giống nhau: cùng DPD 2, cùng có tiền để trả. Hai cách tiếp cận khác nhau. Hai kết quả hoàn toàn khác nhau, không chỉ cho khách hàng mà cho cả doanh nghiệp.
::::

Chương này nhìn collections từ ba góc độ: kinh tế học (tối đa hóa khoản thu hồi mà vẫn giữ được giá trị vòng đời khách hàng, CLV), pháp lý (những ràng buộc về cách nhắc nợ và thu hồi nợ), và kỹ thuật (DRG module, luồng sự kiện, ranh giới giữa VLP và hệ thống collections bên ngoài).

## 10.1 Collections là một chức năng kinh doanh

### DPD bucket: vì sao phân loại theo ngày

::::story
Bà Hương yêu cầu Risk team: "Cho tôi biết tình trạng portfolio." Risk team có thể trả lời theo nhiều cách, nhưng cách hữu ích nhất là phân bố theo DPD bucket.
::::

**Các DPD (Days Past Due) bucket tiêu chuẩn:**

```text
DPD 0    : CURRENT, trả đúng hạn
DPD 1-30 : BUCKET 1, trễ sớm
DPD 31-60: BUCKET 2, trễ trung bình
DPD 61-90: BUCKET 3, trễ nghiêm trọng
DPD 91+  : BUCKET 4, nợ xấu (NPL, Non-Performing Loan)
           Stage 3 theo IFRS 9
           Ứng viên write-off
```

Các mốc 30 ngày không tùy tiện. Chúng bám theo chu kỳ thanh toán hằng tháng: mỗi bucket tương ứng với số kỳ khách hàng đã bỏ lỡ.

| Bucket | Ý nghĩa thường gặp | Cure rate điển hình |
|---|---|---|
| DPD 1-30 | Bỏ lỡ một kỳ: sơ suất, thiếu tiền ngắn hạn | 40-60% |
| DPD 31-60 | Bỏ lỡ hai kỳ: vấn đề tài chính rõ rệt hơn | 15-30% |
| DPD 61-90 | Bỏ lỡ ba kỳ: khả năng cao là không thể trả | 5-10% |
| DPD 91+ | Mốc vỡ nợ theo chuẩn Basel, Stage 3 theo IFRS 9 | Rất thấp |

Mốc 90 ngày cũng khớp với cách phân loại nợ tại Việt Nam: theo quy định phân loại nợ của Ngân hàng Nhà nước, khoản nợ quá hạn từ 91 ngày trở lên rơi vào nhóm 3 đến nhóm 5, tức nợ xấu. Khoản quá hạn từ 10 đến 90 ngày là nhóm 2, nợ cần chú ý. Vì vậy DPD 10 cũng là một mốc mà hệ thống báo cáo phải nhìn thấy, dù nó không trùng ranh giới bucket.

### Kinh tế học của cure rate

:::key
**Cure rate** là tỷ lệ tài khoản trong một DPD bucket quay về trạng thái current trong vòng một tháng.
:::

Ví dụ dưới đây cho thấy vì sao can thiệp sớm đáng tiền đến vậy.

```text
Portfolio: 100,000 tài khoản ở DPD 1-30
Dư nợ bình quân: 8,000,000 VNĐ/tài khoản
LGD: 62%

Không can thiệp:
  Cure rate DPD 1-30 (tự nhiên): 35%
  → 35,000 tài khoản tự quay về current
  → 65,000 tài khoản chuyển sang DPD 31-60

  Cure rate DPD 31-60 (tự nhiên): 15%
  → 9,750 tài khoản cure ở bucket này
  → 55,250 tài khoản chuyển tiếp sang DPD 61-90 và xa hơn

  Cuối cùng vỡ nợ: khoảng 45,000 tài khoản
  → Tỷ lệ vỡ nợ của nhóm đã chuyển bucket: 45,000 / 65,000 ≈ 69.2%
  Tổn thất: 45,000 × 8,000,000 × 62% = 223,200,000,000 VNĐ
          = 223.2 tỷ VNĐ

Can thiệp ở DPD 1-30 (SMS + gọi điện):
  Chi phí: 200,000 VNĐ/tài khoản × 100,000 = 20 tỷ VNĐ
  Cure rate: 35% → 55% (+20 điểm phần trăm)
  → Chỉ còn 45,000 tài khoản chuyển sang DPD 31-60 (thay vì 65,000)
  → Vỡ nợ: 45,000 × 69.2% ≈ 31,154 tài khoản
  → Số vụ vỡ nợ tránh được: 45,000 − 31,154 ≈ 13,846

  Tổn thất tránh được: 13,846 × 8,000,000 × 62% ≈ 68.7 tỷ VNĐ

ROI: (68.7 − 20) / 20 ≈ 243%
```

Một lỗi tính thường gặp là nhân toàn bộ 20,000 tài khoản cure thêm với LGD, ra 99.2 tỷ và ROI 396%. Cách tính đó ngầm giả định rằng mọi tài khoản không cure ở bucket đầu đều vỡ nợ. Thực tế một phần trong số đó vẫn tự cure ở các bucket sau, nên chỉ khoảng 69% số tài khoản cure thêm thực sự là tổn thất tránh được. Ngay cả với con số thận trọng hơn, can thiệp sớm vẫn hoàn vốn hơn ba lần.

Quy luật chung qua các bucket:

| Bucket | Chi phí thu hồi/tài khoản | Mức cải thiện cure rate nhờ can thiệp |
|---|---|---|
| DPD 1-30 | Thấp nhất | Cao nhất (20-30 điểm phần trăm) |
| DPD 31-60 | Trung bình | Trung bình (10-15 điểm) |
| DPD 61-90 | Cao | Thấp (3-8 điểm) |
| DPD 91+ | Cao nhất | Rất thấp (1-3 điểm) |

Hệ quả là nên đầu tư mạnh vào tự động hóa ở DPD 1-30. Ở DPD 91+, chi phí pháp lý thường vượt xa số tiền thu hồi được.

### Kim tự tháp chiến lược collections

```text
                     ▲
                    /|\
                   / | \
                  /  |  \
                 / LEGAL \        ← DPD 90+: Khởi kiện, bán nợ
                /─────────\
               / FIELD     \      ← DPD 60-90: Nhân viên hiện trường, thu hồi tài sản
              /─────────────\
             /  LATE DIGITAL  \   ← DPD 30-60: Gọi điện chủ động, SMS dày hơn
            /─────────────────\
           /   EARLY DIGITAL   \  ← DPD 1-30: SMS tự động, nhắc trong app
          /─────────────────────\
         /     SELF-CURE         \ ← DPD 0 có tín hiệu rủi ro: chủ động liên hệ
        /─────────────────────────\

Nguyên tắc:
  Càng lên cao: chi phí/tài khoản tăng, cure rate giảm
  → Đầu tư ở đáy trước, chỉ leo lên khi cần
  → Tránh nhảy sớm sang pháp lý (phá hủy CLV)
```

:::summary[Mục 10.1]
DPD bucket chia theo số kỳ khách hàng đã bỏ lỡ: 1-30, 31-60, 61-90 và 91+, trong đó mốc 90 ngày trùng với ngưỡng nợ xấu. Cure rate giảm nhanh qua từng bucket, nên can thiệp sớm có ROI cao nhất. Khi tính tổn thất tránh được, chỉ những tài khoản lẽ ra sẽ vỡ nợ mới được tính. Chiến lược collections đi từ đáy kim tự tháp lên: rẻ và nhẹ nhàng trước, tốn kém và cứng rắn sau.
:::

## 10.2 Collections giai đoạn sớm: tự cure và kênh số

### Thời điểm liên hệ

::::story
Job cập nhật DPD chạy lúc 00:01 mỗi ngày. Tài khoản của anh Tùng vừa chuyển thành DPD 1. Hệ thống có nên gửi SMS ngay lúc 00:01 không?

Câu trả lời rõ ràng là không. Một tin nhắn đòi nợ lúc nửa đêm là quấy rối, không phải collections. Ở Việt Nam đó còn là vi phạm: công ty tài chính chỉ được nhắc nợ trong khung 7 giờ đến 21 giờ.
::::

**Lịch liên hệ dựa trên hành vi khách hàng:**

```text
Trước ngày đến hạn (DPD 0):
  D-7:  Nhắc nhẹ qua thông báo trong app
  D-3:  "Sao kê tháng X: thanh toán trước ngày Y"
  D-1:  "Hạn thanh toán là ngày mai"
  D-0:  "Hôm nay là hạn thanh toán"

DPD 1:
  09:00: Push notification "Thanh toán chưa được ghi nhận"
  (Không gửi lúc 00:01)

DPD 2:
  10:00: SMS kèm đường dẫn thanh toán
  Buổi tối (trước 21:00): pop-up khi khách mở app

DPD 3:
  Khung gọi điện: 9-11 giờ hoặc 15-18 giờ

DPD 7-14:
  SMS/push mỗi ngày
  Chuyển sang gọi thủ công nếu chưa có phản hồi

DPD 15-29:
  Tối đa hai cuộc gọi chủ động mỗi ngày, trong khung giờ cho phép
  Đề xuất thỏa thuận trả theo đợt nếu khách không trả đủ được

Ràng buộc chung cho mọi kênh:
  Tổng số lần nhắc nợ ≤ 5 lần/ngày, chỉ trong khung 7:00-21:00
```

**Tối ưu thời điểm gửi bằng dữ liệu:**

```text
Tỷ lệ phản hồi SMS theo giờ gửi (dữ liệu lịch sử):

08:00-09:00: 12%
09:00-10:00: 18% ← cao nhất
12:00-13:00: 15%
17:00-18:00: 16%
20:00-21:00:  8% ← thấp

Cá nhân hóa: khách hàng thường phản hồi sớm
  → Gửi lúc 08:30 thay vì mốc chung 09:00

A/B test: "Hạn thanh toán của bạn đã qua 1 ngày" (nêu sự thật)
     vs:  "Tài khoản của bạn đang bị ảnh hưởng" (nhấn vào mất mát)
  → Thông điệp nhấn vào mất mát thường tăng tỷ lệ phản hồi 20-30%
  → Nhưng phải đúng sự thật: tài khoản thực sự bị ảnh hưởng
    (DPD được ghi nhận và ảnh hưởng đến lịch sử tín dụng)
```

### Pipeline liên lạc tự động

```text
Cập nhật DPD (00:01 hằng ngày)
    │
    ▼
DRG module: sự kiện DPD → Kafka (debt.events)
    │
    ▼
Collections workflow engine bên ngoài (không thuộc DRG)
  (DRG publish debt.events, engine bên ngoài subscribe)
    │
    ├─ Đánh giá rule:
    │   Mức DPD + phân khúc khách hàng + lịch sử liên hệ
    │   → Chọn hành động phù hợp
    │
    ├─ Lên lịch:
    │   → Xếp SMS gửi lúc 09:00
    │   → Đặt cuộc gọi trong khung 10:00-11:00
    │   → Bật cờ hiển thị trong app
    │
    └─ Thực thi:
        SMS  → API nhà cung cấp SMS
        Push → Mobile push service
        Gọi  → Auto-dialer (giai đoạn sớm) hoặc hàng đợi nhân viên (giai đoạn sau)
```

**Cá nhân hóa thông điệp:**

```text
Template: "Xin chào {customer_name}, tài khoản {account_number}
           có khoản thanh toán {amount} VNĐ đến hạn {due_date}.
           Thanh toán ngay tại: {payment_link}"

Sau khi điền: "Xin chào anh Tùng, tài khoản ACC-2025-456789
               có khoản thanh toán 1,800,000 VNĐ đến hạn 05/04.
               Thanh toán ngay tại: pay.vela.vn/q8x3"

Deep link: payment_link mở thẳng màn hình thanh toán một chạm trong app
           → Giảm ma sát → tăng cure rate
```

### Thỏa thuận thanh toán

::::story
Anh Hùng (DPD 15) gọi lên tổng đài: "Tháng này tôi không trả đủ 1,800,000 được vì vừa mất việc. Hôm nay tôi trả được 600,000, tuần sau trả nốt 1,200,000."

Nhân viên collections có thể làm gì?
::::

```text
Quyết định: chấp nhận 600,000 hôm nay + 1,200,000 sau 7 ngày

Hành động trong hệ thống:
  1. Tạo bản ghi PaymentArrangement:
     accountId: ACC-xxx
     agentId: agent-007
     date_created: hôm nay
     arrangement_type: SPLIT_PAYMENT
     installment_1: 600,000 VNĐ, due = hôm nay
     installment_2: 1,200,000 VNĐ, due = hôm nay + 7
     notes: "Khách mất việc, đồng ý trả làm hai đợt"

  2. Collections: tạm dừng liên hệ trong thời gian thỏa thuận còn hiệu lực
     (DPD vẫn được tính theo hợp đồng; thỏa thuận chỉ điều chỉnh
      cách collections đối xử với tài khoản)

  3. Cảnh báo: nếu đến hạn + 1 ngày chưa nhận installment_1
     → nối lại quy trình collections

Thẩm quyền của nhân viên:
  Cấp 1 (tổng đài): thỏa thuận tối đa 30 ngày
  Cấp 2 (giám sát): tối đa 60 ngày
  Cấp 3 (quản lý): tái cơ cấu (cần thay đổi trong LAS)
```

Phân biệt ở bước 2 rất quan trọng. DPD là sự thật kế toán: nó đo khoảng cách từ kỳ quá hạn sớm nhất chưa được thanh toán, và DRG tính nó từ dữ liệu LAS. Một thỏa thuận qua điện thoại không làm thay đổi lịch trả nợ trong hợp đồng, nên không làm DPD đứng yên. Muốn dời ngày đến hạn thì phải dùng payment holiday hoặc tái cơ cấu (mục 10.5), là những thay đổi thực sự trong LAS.

Vì sao thỏa thuận phải nằm trong hệ thống chứ không chỉ trong ghi chú của nhân viên? Nếu không được ghi lại, anh Hùng trả 600,000 xong vẫn nhận cuộc gọi đòi nợ vào ngày hôm sau, dù anh đã thỏa thuận. Khi thỏa thuận có trong hệ thống, collections engine biết để không liên hệ trong thời gian thỏa thuận, biết lúc nào thỏa thuận bị vi phạm để nối lại quy trình, và để lại dấu vết kiểm toán: ai đồng ý, với điều kiện gì.

:::summary[Mục 10.2]
Thời điểm liên hệ dựa trên dữ liệu hành vi và luôn nằm trong khung 7 giờ đến 21 giờ, tối đa 5 lần nhắc nợ mỗi ngày. Sự kiện DPD đi từ DRG qua Kafka đến collections engine bên ngoài, nơi chọn thông điệp, kênh và giờ gửi. Thỏa thuận thanh toán được ghi trong hệ thống để tránh quấy rối khách hàng đã hợp tác, nhưng không làm thay đổi cách tính DPD.
:::

## 10.3 Collections giai đoạn muộn

### DPD 30-60: gọi điện chủ động và liên hệ dày hơn

Khi DPD vượt 30 ngày, collections chuyển sang đội ngũ chuyên trách:

```text
Cơ cấu đội collections:
  Giai đoạn sớm (DPD 1-30): tự động + liên hệ nhẹ
  Giai đoạn giữa (DPD 30-60): collector chuyên trách, gọi điện chủ động
  Giai đoạn muộn (DPD 60-90): collector cấp cao + chuẩn bị hồ sơ pháp lý
  Pháp lý và thu hồi (DPD 90+): đội chuyên biệt
```

**Skip tracing, khi không liên lạc được khách hàng:**

Khách hàng đổi số điện thoại hoặc không nghe máy. Đội collections cần tìm kênh liên hệ mới, nhưng ranh giới về những gì được phép là rất rõ.

| Được phép | Không được phép |
|---|---|
| Kiểm tra thông tin liên hệ khách đã tự cập nhật trong app | Liên hệ người thân, bạn bè để nhắc nợ hoặc nhờ chuyển lời |
| Gửi email (có khách phản hồi email dù không nghe máy) | Gây áp lực công khai trên mạng xã hội |
| Thông tin liên hệ mới hơn từ trung tâm thông tin tín dụng, trong phạm vi được phép | Liên hệ nơi làm việc của khách hàng |
| | Mua dữ liệu cá nhân của khách hàng từ bên thứ ba |

Ở Việt Nam, công ty tài chính không được nhắc nợ, đòi nợ hoặc gửi thông tin về việc thu hồi nợ cho tổ chức, cá nhân không có nghĩa vụ trả nợ (Thông tư 18/2019/TT-NHNN sửa đổi Thông tư 43/2016/TT-NHNN). Người thân, đồng nghiệp hay người quản lý của khách hàng đều thuộc nhóm này, trừ khi họ là người bảo lãnh. Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, có hiệu lực từ 1/1/2026, cấm mua bán dữ liệu cá nhân, nên việc mua thông tin liên lạc của khách hàng từ bên thứ ba không còn là vùng xám.

### DPD 60-90: gần ngưỡng pháp lý

**Chuẩn bị cho khả năng khởi kiện:**

```text
Hồ sơ cần chuẩn bị:
  1. Toàn bộ lịch sử giao dịch (từ LAS)
  2. Nhật ký mọi lần liên hệ (từ hệ thống collections)
  3. Các thỏa thuận thanh toán đã có
  4. Bằng chứng khoản nợ (hợp đồng đã ký, từ DMS)
  5. Mọi trao đổi liên quan đến khó khăn tài chính của khách

Kèm theo là thông báo trước khi xử lý pháp lý:
  "Kính gửi [khách hàng],
   Tài khoản của bạn hiện đang nợ X VNĐ, quá hạn 65 ngày.
   Chúng tôi muốn cùng bạn giải quyết trước khi chuyển sang
   xử lý pháp lý. Vui lòng liên hệ trong vòng 15 ngày.

   Các lựa chọn của bạn:
   1. Thanh toán toàn bộ
   2. Thỏa thuận trả theo đợt
   3. Trao đổi về phương án tái cơ cấu"
```

**Vì sao thông báo trước khi khởi kiện quan trọng:**

```text
Lý do kinh tế: khởi kiện rất tốn kém (số liệu minh họa)
  Án phí và chi phí tố tụng: vài phần trăm giá trị tranh chấp
  Chi phí luật sư, thi hành án: 5-15% số tiền thu được
  Thời gian: 6-18 tháng

Sau khi trừ chi phí: thường chỉ thu được 40-60% dư nợ
→ Chỉ cần 10% khách hàng cure nhờ thông báo, ROI đã tốt hơn khởi kiện

Lý do CLV: khởi kiện là chấm dứt quan hệ vĩnh viễn
  Kiện và thắng: khách hàng không bao giờ quay lại
  Kiện và thua: tệ hơn không kiện

  Thông báo trước: một số khách hàng sẽ trả, quan hệ được giữ lại
```

### DPD 90+: bán nợ hay giữ lại

::::story
Portfolio của bà Hương có 2,000 tài khoản DPD 90+, tổng dư nợ 80 tỷ VNĐ. Có hai lựa chọn.
::::

**Lựa chọn A: giữ lại và tiếp tục thu hồi**

```text
Ước tính:
  Chi phí đội thu hồi pháp lý: 3% dư nợ/năm = 2.4 tỷ/năm
  Tỷ lệ thu hồi nội bộ (DPD 90+): khoảng 25% trong 2 năm
  Số tiền thu hồi: 80 tỷ × 25% = 20 tỷ VNĐ
  Ròng sau chi phí: 20 − (2.4 × 2) = 15.2 tỷ VNĐ
  Thời gian thu hồi: từ 2 năm trở lên
```

**Lựa chọn B: bán cho bên mua nợ**

```text
Giá chào mua: 15% giá trị danh nghĩa
  Giá bán: 80 tỷ × 15% = 12 tỷ VNĐ
  Thời điểm: nhận ngay
  Chi phí: thấp (thẩm định + chuyển giao)
  Ròng: 12 tỷ VNĐ ngay lập tức

So sánh danh nghĩa:
  A: 15.2 tỷ VNĐ trong 2 năm
  B: 12 tỷ VNĐ ngay

So sánh theo giá trị hiện tại (lãi chiết khấu 12%/năm):
  A: PV = 15.2 / 1.12^1.5 ≈ 12.82 tỷ (giả định dòng tiền bình quân sau 1.5 năm)
  B: PV = 12 tỷ

Kết luận: A nhỉnh hơn khoảng 0.8 tỷ, nhưng:
  + A: gánh nặng vận hành, rủi ro pháp lý, rủi ro thương hiệu
  + B: làm sạch sổ sách, tập trung nguồn lực cho portfolio đang sống
```

Chênh lệch 0.8 tỷ trên 80 tỷ dư nợ chỉ khoảng 1%, nhỏ hơn sai số của chính giả định "thu hồi 25% trong 2 năm". Khi hai lựa chọn gần nhau đến vậy, các yếu tố phi tài chính thường là thứ quyết định.

**Các yêu cầu khi bán nợ:**

```text
Yêu cầu pháp lý:
  1. Thông báo cho khách hàng về việc chuyển giao khoản nợ
  2. Bên mua nợ phải là tổ chức đủ điều kiện theo quy định về mua bán nợ
  3. Bên mua phải tuân thủ cùng các chuẩn mực thu hồi nợ công bằng
  4. Quyền của khách hàng (khiếu nại, điều khoản thanh toán) đi theo khoản nợ

Tác động hệ thống:
  Tài khoản trong LAS: status → WRITTEN_OFF (sau khi bán)
  Dữ liệu vẫn được lưu để phục vụ kiểm toán
  Bên mua nhận: dữ liệu tài khoản, lịch sử giao dịch, nhật ký liên hệ
  LAS gắn cờ để khách hàng không nhận đề nghị vay mới
      (một số bên cho vay cho phép lại sau thời gian phục hồi)
```

Ở Việt Nam còn một lưu ý: từ 1/1/2021, Luật Đầu tư 2020 đưa kinh doanh dịch vụ đòi nợ vào danh mục cấm. Bên cho vay vẫn tự thu hồi nợ của mình, và vẫn có thể bán khoản nợ theo quy định về mua bán nợ, nhưng không thể thuê một "công ty đòi nợ" làm thay.

:::summary[Mục 10.3]
Ở DPD 30-60, liên hệ dày hơn và có thể cần skip tracing, nhưng không được liên hệ người không có nghĩa vụ trả nợ và không được mua dữ liệu cá nhân. Ở DPD 60-90, hồ sơ pháp lý được chuẩn bị song song với một thông báo cho khách hàng cơ hội cure cuối cùng. Ở DPD 90+, quyết định giữ hay bán nợ dựa trên giá trị hiện tại của từng lựa chọn, cộng với gánh nặng vận hành và rủi ro thương hiệu.
:::

## 10.4 DRG module: kiến trúc Debt Register

### Vì sao tách khỏi LAS

::::story
Kỹ sư Tuấn hỏi: "Sao phải có DRG module riêng? LAS đã có đủ dữ liệu quá hạn rồi. Như vậy không phải là trùng lặp dữ liệu sao?"
::::

Có ba lý do.

**Thứ nhất, hai bên tối ưu cho hai việc khác nhau.** LAS xử lý giao dịch theo thời gian thực: ghi nhiều, cần ACID, schema chuẩn hóa để cập nhật nhanh. DRG theo dõi tình trạng nợ theo thời gian và cung cấp dữ liệu cho collections: đọc nhiều, cần lịch sử, schema phi chuẩn hóa để truy vấn nhanh. Gộp lại thì các cập nhật thời gian thực của LAS phải tranh tài nguyên với các truy vấn phân tích của DRG, và schema phải thỏa hiệp đến mức không tối ưu cho bên nào.

**Thứ hai, vòng đời khác nhau.** Dữ liệu tài khoản trong LAS sống cùng tài khoản, cộng thời gian lưu trữ phục vụ kiểm toán. Dữ liệu nợ trong DRG phải sống lâu hơn, kể cả sau khi tài khoản đóng, để phục vụ báo cáo tín dụng, pháp lý và thu hồi. Sau write-off, tài khoản trong LAS gần như đóng băng ở trạng thái `WRITTEN_OFF`, còn DRG vẫn tiếp tục theo dõi các khoản thu hồi.

**Thứ ba, kiểu truy cập khác nhau.** LAS nhận các lời gọi REST từ LOS, BFF và các trigger collections: truy vấn từng tài khoản, tần suất cao. DRG phục vụ truy vấn theo lô cho portfolio collections, tính roll rate, tính dự phòng IFRS 9 và báo cáo cơ quan quản lý: truy vấn tổng hợp, tần suất vừa phải nhưng phức tạp. Vì vậy hai bên có thể chọn công nghệ lưu trữ khác nhau: LAS dùng PostgreSQL cho giao dịch, DRG có thể bổ sung kho dạng cột cho phân tích.

### Đồng bộ từ LAS theo sự kiện

```text
LAS → Kafka (CloudEvents, Avro) → DRG

Sự kiện DRG subscribe:
  transaction.confirmed (từ LAS):
    → DRG nhận qua Kafka (topic transaction.confirmed, Avro)
    → DebtRegisterServiceFacade tính lại toàn bộ trạng thái nợ
    → Tạo bản ghi DebtRegister mới (SCD Type 2)

DRG → Kafka (CloudEvents) → LAS, SRT và các hệ thống khác:
  debt.events:
    → Khi DPD vượt các ngưỡng
    → LAS subscribe: nhận tín hiệu để xử lý tiếp (ví dụ write-off)

DRG ↔ CTM: gọi REST (tra cứu dữ liệu hợp đồng)

Kiến trúc:
  LAS ──(transaction.confirmed)──→ DRG ──(debt.events)──→ LAS, SRT, ...
                                    ↑
                                CTM (REST)
```

**Thực thể trung tâm của DRG: DebtRegister theo SCD Type 2**

Đây là điểm mấu chốt để hiểu DRG. Thay vì cập nhật một dòng cho mỗi tài khoản, DRG tạo một **bản ghi lịch sử mới** mỗi khi trạng thái nợ thay đổi, theo mô hình Slowly Changing Dimension Type 2. Mỗi bản ghi DebtRegister có `validFrom` và `validTo`, nên có thể biết trạng thái nợ của một tài khoản tại bất kỳ thời điểm nào trong quá khứ.

```text
Table: V_DEBT_CATALOGUE (view trên base table)

Key fields:
  contractCode          → Link đến Account
  validFrom, validTo    → SCD Type 2 temporal validity
  previousDebtRegisterId → Chain to previous version

Debt breakdown:
  totalPrincipalDebt, overduePrincipalDebt
  totalInterestDebt, overdueInterestDebt
  totalDebtOnFees, overdueDebtOnFees
  totalDebtOnPenalties, overdueDebtOnPenalties
  totalDebt, totalOverdueDebt
  generalDebt, generalDebtWithPenalties
  creditLimit

DPD & Timing:
  daysPastDue          → DateUtil.dateDifferenceInDays(today, firstOverdueDueDate)
  firstOverdueInstallmentDueDate
  nextInstallmentAmount, dueDateOfNextInstallment
  countOfOverdueInstallments
  dateOfFirstPayment, dateOfLatestPayment, latestPaymentAmount
```

**Vì sao SCD Type 2:**

```text
Tình huống: DPD của một tài khoản tăng từ 0 → 5 → 10 → 15

Một dòng cho mỗi tài khoản:
  UPDATE drg_account SET dpd=5 ...  (mất lịch sử)
  UPDATE drg_account SET dpd=10 ... (mất lịch sử)
  UPDATE drg_account SET dpd=15 ... (mất lịch sử)

  Câu hỏi "DPD của tài khoản này ngày 15/3 là bao nhiêu?" → không trả lời được

SCD Type 2:
  INSERT (validFrom=10/3, validTo=14/3, dpd=5, prevId=null)
  INSERT (validFrom=15/3, validTo=19/3, dpd=10, prevId=bản ghi trước)
  INSERT (validFrom=20/3, validTo=UNREACHABLE_DATE, dpd=15, prevId=bản ghi trước)

  "DPD ngày 15/3?" → SELECT WHERE validFrom <= 15/3 AND validTo >= 15/3 → 10
  → Đầy đủ lịch sử, không mất dữ liệu
```

**DebtRegisterStatistics: giá trị lớn nhất trong lịch sử**

```text
Gắn với DebtRegister, lưu các giá trị lớn nhất từ trước đến nay:
  maxHistoricalDPD         → DPD cao nhất từng có (không bao giờ giảm)
  maxHistoricalOverdueDebt → Số tiền quá hạn cao nhất từng có

Ứng dụng: thẩm định rủi ro tín dụng, phân stage theo IFRS 9
  "Kể cả khi hôm nay tài khoản đang current, nếu DPD cao nhất
   từng là 90+ thì vẫn gắn cờ rủi ro cao hơn khi phân stage"
```

**DebtRegister đầu tiên được tạo khi nào:**

DRG không tạo DebtRegister khi hợp đồng được ký. Bản ghi đầu tiên chỉ xuất hiện khi một giao dịch làm phát sinh kỳ trả nợ quá hạn, tức lần đầu DPD lớn hơn 0. Với những tài khoản luôn trả đúng hạn, không có DebtRegister nào. DRG thực sự là hệ thống tập trung vào khoản nợ, không phải vào tài khoản.

### Tần suất cập nhật DRG: hai cơ chế song song

DRG không chỉ cập nhật khi có sự kiện từ LAS. Nó còn có một job chạy theo lịch:

```text
Cơ chế 1: theo sự kiện (mỗi giao dịch)
  LAS xác nhận giao dịch → publish transaction.confirmed
  → DRG nhận → DebtRegisterServiceFacade tính lại
  → Đóng bản ghi DebtRegister cũ (validTo = now)
  → Tạo bản ghi DebtRegister mới (validFrom = now)
  Độ trễ: từ mili giây đến vài giây

Cơ chế 2: tính lại DPD theo lịch (cron hằng ngày)
  OverdueDebtJobLauncher (@Scheduled cron)
  → Bảo đảm DPD tăng mỗi ngày kể cả khi LAS không có sự kiện mới
  → Cập nhật daysPastDue cho mọi tài khoản đang quá hạn

Hệ quả với tài khoản quá hạn nhưng không có giao dịch nào:
  → Cơ chế 1: không cập nhật gì
  → Cơ chế 2: DPD tăng mỗi ngày
  → DebtRegister được cập nhật một lần mỗi ngày bởi cron
```

Nếu chỉ có cơ chế thứ nhất, một khách hàng ngừng trả hoàn toàn sẽ đứng yên ở DPD của lần giao dịch cuối cùng mãi mãi, đúng loại tài khoản mà collections cần thấy nhất.

### Collections workflow nằm ngoài VLP

DRG **không có** collections workflow engine. DRG là danh mục dữ liệu nợ: nó tính và lưu DebtRegister, theo dõi DPD, publish `debt.events` và cung cấp trạng thái nợ qua REST API. Những gì thuộc về nghiệp vụ collections hằng ngày nằm ở một hệ thống CRM/collections bên ngoài.

| DRG làm | Hệ thống collections bên ngoài làm |
|---|---|
| Tính DebtRegister, lưu theo SCD Type 2 | Phân công collector |
| Theo dõi DPD (theo sự kiện + cron hằng ngày) | Lịch sử cuộc gọi và kết quả |
| Publish `debt.events` lên Kafka | Theo dõi cam kết thanh toán (promise-to-pay), thỏa thuận thanh toán |
| Cung cấp trạng thái nợ qua REST API | Quy trình leo thang theo bucket (sớm → chuyên trách → pháp lý) |
| | Áp dụng rule liên hệ: tần suất, khung giờ, kênh |

Các nguyên tắc về DPD bucket, tần suất liên hệ, ranh giới đạo đức và hardship trong chương này đều là nghiệp vụ thật. Chúng được thực thi ở hệ thống bên ngoài, không phải trong DRG hay LAS. Với người đọc muốn hiểu nghiệp vụ, điều đó không thay đổi gì. Với kỹ sư, nó xác định rõ trách nhiệm: nếu khách hàng bị gọi lúc 22 giờ, lỗi nằm ở rule engine của hệ thống collections, còn nếu khách hàng bị gọi khi đã trả đủ, cần kiểm tra DRG có nhận được `transaction.confirmed` hay không.

:::summary[Mục 10.4]
DRG tách khỏi LAS vì khác nhau về kiểu tối ưu, vòng đời dữ liệu và kiểu truy cập. DRG lưu trạng thái nợ theo SCD Type 2 để trả lời được câu hỏi "tại thời điểm X, khoản nợ thế nào", được cập nhật theo từng giao dịch và bởi một cron hằng ngày để DPD luôn tăng đúng. DRG cung cấp dữ liệu; hệ thống collections bên ngoài quyết định hành động.
:::

## 10.5 Hardship program

### Khi khách hàng thực sự không thể trả

::::story
Anh Hùng mất việc từ tháng 4 (mục 10.2). Hai đợt trả theo thỏa thuận đã không thực hiện được, tài khoản đã ở DPD 25 và nhân viên collections biết rõ hoàn cảnh của anh.

Công ty có hai cách xử lý.
::::

Cách thứ nhất là tiếp tục thúc ép. Anh Hùng có thể bán đồ đạc hoặc vay chỗ khác để trả, hoặc không trả được và đi đến vỡ nợ. Dù kết quả nào, quan hệ cũng chấm dứt.

Cách thứ hai là đề nghị một hardship program. Nếu anh tìm được việc trong vài tháng, anh có thể trả tiếp, và khách hàng được giữ lại.

### Payment holiday

:::key
**Payment holiday** *(hoãn thanh toán)* cho phép khách hàng không phải thanh toán trong một số kỳ (thường 1-3 tháng) mà không bị tính phí trễ hạn. Lãi có thể vẫn tiếp tục tích lũy, tùy chính sách của sản phẩm.
:::

**Tính kinh tế của payment holiday** (số liệu minh họa, từ góc nhìn của Vela Finance):

```text
Giả định:
  Dư nợ của anh Hùng: 15,000,000 VNĐ, lãi suất 18%/năm, LGD 62%
  Nếu không hoãn: khoản vay đi đến write-off
  Lãi tích lũy trong 3 tháng hoãn: 15,000,000 × 1.5% × 3 = 675,000 VNĐ
  Chi phí quản lý chương trình hoãn: 200,000 VNĐ

Không hoãn thanh toán:
  DPD 25 → 60 → 90 → write-off
  Tổn thất: 15,000,000 × 62% = 9,300,000 VNĐ
  Chi phí collections: 1,000,000 VNĐ
  Tổng chi phí: 10,300,000 VNĐ

Hoãn thanh toán 3 tháng:
  Kịch bản A (thuận lợi): anh Hùng có việc lại
    → Trả tiếp, trả cả phần lãi tích lũy
    → Chi phí: 200,000 VNĐ (chỉ chi phí quản lý)

  Kịch bản B (không thuận lợi): không có việc lại
    → Quá hạn tiếp sau khi hết hoãn, collections như cũ nhưng trễ 3 tháng
    → Dư nợ lúc vỡ nợ đã gồm cả lãi tích lũy: 15,675,000 VNĐ
    → Tổn thất: 15,675,000 × 62% = 9,718,500 VNĐ
    → Tổng chi phí: 200,000 + 9,718,500 + 1,000,000 = 10,918,500 VNĐ

Nếu P(thuận lợi) = 40%:
  Chi phí kỳ vọng khi không hoãn: 10,300,000
  Chi phí kỳ vọng khi hoãn: 0.4 × 200,000 + 0.6 × 10,918,500
                          = 80,000 + 6,551,100 = 6,631,100

Điểm hòa vốn: hoãn có lợi khi P(thuận lợi) > khoảng 6%
```

Kết quả nghe có vẻ ngược trực giác: chỉ cần khoảng một trong mười bảy khách hàng như anh Hùng phục hồi, chương trình đã có lãi. Lý do là kịch bản B gần như không làm tình hình tệ hơn so với việc không hoãn, chỉ thêm chi phí quản lý và phần tổn thất trên lãi tích lũy. Kịch bản A thì tiết kiệm gần như toàn bộ khoản tổn thất. Lưu ý rằng lãi tích lũy không phải là chi phí của bên cho vay: trong kịch bản A, khách hàng trả cả phần lãi đó.

**Cài đặt payment holiday trong hệ thống:**

```text
Ai khởi tạo? Một bên gọi API từ bên ngoài (Operations team qua UI/BFF).
DRG và LAS không tự khởi tạo: đây là quyết định của con người, được thực thi qua API.

Luồng:
  API caller → RepaymentPauseManager.createRepaymentPauseRequest()
    → RepaymentPauseService tạo thực thể RepaymentPauseRequest
    → EventReplayManager.reprocessOnwardEvents(..., PAYMENT_HOLIDAY)
    → Ngày đến hạn của các kỳ trả nợ được DỜI VỀ SAU

RepaymentPauseRequest (LAS_REPAYMENT_PAUSE_REQUEST):
  account → Account
  deferredPeriodsNumber: N tháng (ví dụ: 3)
  firstDeferredDueDate: ngày đến hạn đầu tiên bị hoãn
  expectedLastDeferredDueDate: ngày kết thúc hoãn
  billingPeriodNumberFrom: số thứ tự kỳ billing bắt đầu hoãn
  payholAccountBlockage: có khóa tài khoản không
  payholInterestWaiving: có miễn lãi không
  payholIPInterestCharging: lãi của instalment plan có tiếp tục tính không
  status: PENDING → RUNNING → EXPIRED | CANCELLED
  Gắn với contract service RELPAYHOL (kiểm tra điều kiện được hoãn)

Hành vi của EOM trong thời gian hoãn:
  Điều kiện: currentBP >= billingPeriodFrom AND < billingPeriodFrom + deferredPeriods
  Nếu đang hoãn:
    Ngày đến hạn: dời về sau đúng số tháng hoãn
    DPD: tính từ ngày đến hạn MỚI (không phải ngày gốc)
    Lãi: tùy cờ payholInterestWaiving (miễn hoặc tiếp tục tích lũy)
    Phí trễ hạn: thường được miễn

Sau khi hết hoãn:
  Các kỳ bị hoãn đến hạn vào ngày mới (ngày gốc + số tháng hoãn)
  Không tính hồi tố: số tiền đã được xác định tại thời điểm tạo yêu cầu
  DPD tính từ ngày đến hạn mới

Phân biệt với tái cơ cấu (kéo dài kỳ hạn, đổi lãi suất):
  KHÔNG dùng RepaymentPause: đó chỉ là hoãn thanh toán
  Tái cơ cấu = tạo InstalmentPlan mới (gọi REST sang LPS)
  → API bên ngoài → LAS InstalmentPlanCreationService → LPS → kế hoạch mới
```

Sau khi kích hoạt, hệ thống collections bên ngoài vẫn nên theo dõi định kỳ tình hình của khách hàng trong thời gian hoãn, ví dụ mỗi tuần một lần.

**Lãi trong thời gian hoãn:**

Câu hỏi thường gặp: "Không phải trả thì không phát sinh lãi chứ?" Không hẳn. Với chính sách tích lũy lãi, lãi vẫn chạy vì anh Hùng vẫn đang sử dụng khoản vốn, và Vela Finance vẫn phải trả chi phí vốn cho khoản tiền đó. Miễn lãi nghĩa là bên cho vay trợ cấp cho khách hàng. Đó là lựa chọn có thể làm có chủ đích (cờ `payholInterestWaiving` tồn tại cho trường hợp này), nhưng không thể là mặc định.

```text
Yêu cầu công bố (ở nhiều nước, và là thực hành tốt ở mọi nơi):
  Phải nói rõ trước khi khách đồng ý hoãn:
  "Lãi vẫn tích lũy trong thời gian hoãn.
   Sau 3 tháng, bạn sẽ nợ thêm 675,000 VNĐ."

Yếu tố hành vi:
  Khách hàng thường đánh giá thấp lãi tích lũy
  → Công bố minh bạch giảm bất ngờ và tranh chấp về sau
```

### Tái cơ cấu nợ: thay đổi điều khoản hợp đồng

Payment holiday không đủ khi khó khăn kéo dài: anh Hùng tìm được việc nhưng lương thấp hơn trước 40%, khách hàng mất khả năng lao động lâu dài, hoặc người vay tự kinh doanh bị phá sản.

**Các phương án tái cơ cấu:**

```text
Phương án 1: Kéo dài kỳ hạn
  Hiện tại: dư nợ 12,000,000 VNĐ, còn 12 tháng, 18%/năm
            → trả 1,100,160 VNĐ/tháng, tổng lãi còn lại 1,201,920
  Tái cơ cấu: 12,000,000 VNĐ, 24 tháng, 18%/năm
            → trả 599,089 VNĐ/tháng, tổng lãi 2,378,145
  Đánh đổi: khoản trả hằng tháng giảm gần một nửa;
            bên cho vay thu thêm lãi nhưng chịu rủi ro lâu hơn

Phương án 2: Giảm lãi suất tạm thời
  Hiện tại: 18%/năm
  Tái cơ cấu: 10%/năm trong 6 tháng, sau đó trở lại 18%
  Đánh đổi: giảm doanh thu ngắn hạn, giữ được quan hệ

Phương án 3: Giảm gốc (giải pháp cuối cùng)
  Bên cho vay xóa một phần gốc
  Chỉ khi: NPV phương án tái cơ cấu > NPV của write-off
  Đánh đổi: mất doanh thu, nhưng còn hơn mất cả

Phương án 4: Dồn gốc cuối kỳ (balloon)
  Trả ít hằng tháng, khoản trả cuối kỳ lớn
  Rủi ro: khoản cuối có thể cũng không trả được
```

**Tác động IFRS 9 của tái cơ cấu:**

```text
Trước tái cơ cấu: tài khoản có thể đã ở Stage 2 (DPD 30+)
Sau tái cơ cấu: tài khoản được gắn cờ forbearance
  Nhiều cơ quan quản lý yêu cầu một thời gian thử thách
  (ví dụ tối thiểu 12 tháng) trước khi được đưa về Stage 1,
  kể cả khi khách hàng đang trả tốt theo điều khoản mới.
  Chính sách của Vela Finance dùng mốc 12 tháng.

Tác động dự phòng:
  Stage 2: dự phòng ECL cho toàn bộ thời hạn
  → Dự phòng giữ ở mức cao trong thời gian thử thách → ảnh hưởng P&L
```

Đây là "chi phí IFRS 9 của hardship": khoản vay đã tái cơ cấu đòi hỏi dự phòng cao hơn ngay cả khi đang được trả đều, và nhà đầu tư nhìn thấy điều đó trên báo cáo tài chính.

## 10.6 Write-off và thu hồi

### Quyết định write-off

Chính sách write-off khác nhau giữa các công ty. Một chính sách điển hình: DPD 180 là ứng viên write-off tự động, còn trong khoảng DPD 90-180 thì xét từng trường hợp, dựa trên triển vọng thu hồi (có tài sản bảo đảm, người bảo lãnh, việc làm không), chi phí tiếp tục thu hồi so với số tiền kỳ vọng thu được, và hướng dẫn của cơ quan quản lý.

Write-off không có nghĩa là tha nợ. Về kế toán, khoản vay được đưa ra khỏi bảng cân đối kế toán. Về pháp lý, nghĩa vụ trả nợ vẫn còn nguyên: khách hàng vẫn nợ, và bên cho vay vẫn tiếp tục thu hồi. Write-off chỉ có nghĩa là "không còn kỳ vọng được trả trong tương lai gần".

**Hạch toán write-off:**

```text
Trước write-off (trên bảng cân đối):
  Khoản vay: 10,000,000 VNĐ
  Dự phòng: (6,200,000 VNĐ), tương ứng LGD 62%
  Giá trị ghi sổ ròng: 3,800,000 VNĐ

Bút toán write-off:
  Nợ  Dự phòng                    6,200,000
  Nợ  P&L (lỗ do write-off)       3,800,000
  Có  Khoản vay                  10,000,000
  → Khoản vay ra khỏi bảng cân đối
  → P&L ghi nhận thêm 3,800,000 VNĐ (phần chưa được trích lập)

Vì sao P&L không ghi nhận cả 10,000,000:
  6,200,000 đã đi vào P&L khi trích lập dự phòng
  Write-off chỉ hiện thực hóa tổn thất; dự phòng đã phản ánh nó từ trước
```

**Luồng write-off: DRG phát hiện, LAS thực thi**

DRG không tự khởi tạo write-off. DRG phát hiện và phát tín hiệu, LAS thực thi.

```text
1. DRG theo dõi DPD. Khi DPD >= writeOffThreshold (cấu hình được, ví dụ 90):
     DRG cung cấp: getDebtRegisterDPDByThresholds(writeOffThreshold=90)
     DRG publish: debt.events (Kafka CloudEvents)

2. Kích hoạt write-off:
     Do quy trình vận hành quyết định dựa trên tín hiệu từ DRG
     Account.status: ACTIVE → WRITTEN_OFF

3. Sau khi WRITTEN_OFF:
     LAS ngừng tích lũy lãi và tính phí theo kỳ (không phát sinh lãi, phí mới)
     Giao dịch thanh toán: VẪN ĐƯỢC CHẤP NHẬN (thu hồi ngoại bảng)
     Các LedgerEntry còn dư nợ: giữ nguyên (không bị hủy)
     Lịch sử giao dịch: được lưu để kiểm toán

4. Thu hồi ngoại bảng tiếp tục:
     Hệ thống bên ngoài hoặc DRG theo dõi các nỗ lực thu hồi
     Báo cáo trạng thái WRITTEN_OFF lên CIC
```

```text
Ngưỡng cấu hình được:
  writeOffThreshold: truyền vào DRG như tham số API
  (không hardcode, cho phép quy tắc khác nhau theo sản phẩm hoặc phân khúc)
  Thường gặp: DPD 90 với vay tiêu dùng không bảo đảm, DPD 180 với vay có bảo đảm
```

### Thu hồi sau write-off

```text
Thu hồi nội bộ (12 tháng đầu sau write-off):
  Đội collections tiếp tục liên hệ
  Đề nghị tất toán: "Chúng tôi chấp nhận 40% để đóng khoản nợ"
  → Một số khách hàng sẽ đồng ý tất toán với số tiền thấp hơn nhiều

Bán nợ (thường sau 12-24 tháng):
  Bán cho tổ chức đủ điều kiện mua nợ
  Giá: 5-15% giá trị danh nghĩa với nợ đã write-off lâu
  Chuyển giao: quyền đòi nợ và dữ liệu cho bên mua

Thu hồi tài sản (nếu có):
  Vay tiêu dùng: thường không có bảo đảm → gần như không có tài sản để thu hồi
  Nếu có bảo đảm (vay mua xe): thu hồi xe → bán đấu giá

Thời hiệu khởi kiện:
  Việt Nam: 3 năm đối với tranh chấp hợp đồng (Bộ luật Dân sự 2015, Điều 429),
  tính từ ngày bên cho vay biết hoặc phải biết quyền lợi của mình bị xâm phạm
  Hết thời hiệu: khoản nợ không mất đi, nhưng không còn khởi kiện được
```

**Thanh toán sau write-off thực sự được xử lý thế nào:**

```text
Tài khoản WRITTEN_OFF vẫn nhận thanh toán bình thường:
  → Không có chặn nào trên giao dịch thanh toán với trạng thái WRITTEN_OFF
  → Tạo Transaction + EventRecord + LedgerEntry (CREDIT) như thường lệ
  → MatchingService ghép với các kỳ còn dư nợ như thường lệ
  → CurrentBalance.outstandingDebt giảm, customerCredit tăng

KHÔNG có loại giao dịch riêng cho khoản thu hồi.
KHÔNG có cờ kế toán đặc biệt trong LAS.
Theo dõi thu hồi qua LedgerEntry và CurrentBalance như mọi tài khoản khác.

Hệ thống tài chính/GL bên ngoài (không phải LAS hay DRG) xử lý:
  → Ghi nhận khoản thu hồi vào P&L
  → Thông báo cập nhật lên trung tâm thông tin tín dụng
  → Theo dõi ngoại bảng từ góc độ kế toán
```

:::summary[Mục 10.5 và 10.6]
Payment holiday có lợi về kinh tế ngay cả khi xác suất khách hàng phục hồi khá thấp, vì kịch bản xấu gần như không tệ hơn việc không hoãn. Nếu lãi vẫn tích lũy, khách hàng phải được thông báo rõ số tiền trước khi đồng ý. Tái cơ cấu thay đổi kế hoạch trả nợ thật sự và kéo theo cờ forbearance cùng thời gian thử thách trước khi giảm dự phòng. Write-off là bút toán kế toán, không phải tha nợ: DRG phát tín hiệu, LAS chuyển trạng thái, và thanh toán sau write-off vẫn được ghi nhận như mọi thanh toán khác.
:::

## 10.7 Khung pháp lý và ranh giới đạo đức

### Thu hồi nợ công bằng

::::story
Anh Minh (Product Owner) đang review kịch bản gọi điện mới của đội collections. Kịch bản có câu: "Nếu anh không trả trong 24 giờ, chúng tôi sẽ liên hệ sếp của anh."

Anh Minh dừng lại và hỏi Legal team: "Câu này có hợp pháp không?"
::::

**Khung pháp lý tham chiếu:**

```text
Tại Việt Nam:
  Bộ luật Dân sự 2015: quyền và nghĩa vụ của các bên trong hợp đồng vay
  Luật Các tổ chức tín dụng 2024 (32/2024/QH15)
  Thông tư 43/2016/TT-NHNN về cho vay tiêu dùng của công ty tài chính,
    sửa đổi bởi Thông tư 18/2019/TT-NHNN: quy định về nhắc nợ, thu hồi nợ
  Luật Bảo vệ quyền lợi người tiêu dùng 2023 (19/2023/QH15)
  Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15)
  Luật Đầu tư 2020: cấm kinh doanh dịch vụ đòi nợ từ 1/1/2021

Tham chiếu quốc tế:
  Mỹ: Fair Debt Collection Practices Act (FDCPA) và Regulation F
  EU: Consumer Credit Directive
  Anh: quy định của Financial Conduct Authority (FCA)
```

Quy định cụ thể nhất cho công ty tài chính là các yêu cầu về nhắc nợ trong Thông tư 18/2019/TT-NHNN: biện pháp thu hồi nợ không được bao gồm biện pháp đe dọa khách hàng, nhắc nợ tối đa 5 lần mỗi ngày, chỉ trong khoảng 7 giờ đến 21 giờ, và không được nhắc nợ hay gửi thông tin thu hồi nợ cho người không có nghĩa vụ trả nợ. Các văn bản này có thể tiếp tục được sửa đổi, nên đội Legal của Vela Finance rà soát lại rule của hệ thống collections mỗi khi có văn bản mới.

**Những hành vi bị cấm:**

| Nhóm | Hành vi |
|---|---|
| Quấy rối | Nhắc nợ ngoài khung 7:00-21:00; nhắc nợ quá 5 lần/ngày; ngôn ngữ đe dọa, xúc phạm; gọi liên tục để gây áp lực |
| Lừa dối | Giả danh luật sư hoặc cơ quan nhà nước; dọa khởi kiện khi không có ý định thực hiện; nói sai số tiền nợ; dọa bắt giữ (không tồn tại trong tranh chấp dân sự) |
| Xâm phạm riêng tư | Liên hệ nơi làm việc của khách hàng; thông báo khoản nợ cho người thân (trừ người bảo lãnh); bêu xấu trên mạng xã hội; dùng dữ liệu vượt mục đích khách hàng đã đồng ý |
| Không công bằng | Thu các khoản không có trong hợp đồng; dọa làm xấu lịch sử tín dụng khi thực tế không báo cáo; ép đến mức khách hàng trả bằng mọi giá bất kể khả năng |

Ngược lại, đội collections hoàn toàn được phép liên hệ khách hàng trong khung giờ cho phép, thông báo chính xác về khoản nợ, báo cáo đúng sự thật lên trung tâm thông tin tín dụng, khởi kiện theo đúng thủ tục, đề nghị tất toán hoặc thỏa thuận trả theo đợt, liên hệ người bảo lãnh, và tìm kênh liên lạc mới trong phạm vi pháp luật về dữ liệu cá nhân cho phép.

### Giải quyết tranh chấp

**Khách hàng có quyền khiếu nại:**

```text
Các tranh chấp thường gặp:
  "Tôi không thực hiện giao dịch này" (gian lận)
  "Số tiền không đúng" (số tiền)
  "Tôi đã trả nhưng không được ghi nhận" (thanh toán)
  "Phí này không có trong hợp đồng" (phí)

Hệ thống hỗ trợ:
  Gắn cờ "đang tranh chấp" cho tài khoản
  Collections: TẠM DỪNG khi tranh chấp chưa được giải quyết
  LAS: điều tra giao dịch dựa trên dấu vết kiểm toán
  DMS: lấy hợp đồng để đối chiếu điều khoản

Mốc thời gian thường gặp:
  Xác nhận đã nhận khiếu nại: trong 5-7 ngày làm việc
  Giải quyết: 30-60 ngày làm việc
  Nếu khách hàng đúng: đảo các khoản đã tính sai

Trong thời gian tranh chấp:
  Collections: tạm dừng
  Phí trễ hạn trên khoản đang tranh chấp: tạm ngừng
  Trung tâm thông tin tín dụng: có thể cần đánh dấu "đang tranh chấp"
```

Trong VLP hiện tại, LAS và DRG không có thực thể `Dispute` hay trường đánh dấu tranh chấp. Việc xử lý tranh chấp nằm ở hệ thống bên ngoài (CRM hoặc hệ thống chăm sóc khách hàng). Nếu thiết kế lại, luồng lý tưởng sẽ như sau:

```text
// Luồng xử lý tranh chấp (minh họa thiết kế)
// 1. Tạo bản ghi tranh chấp (trong CRM hoặc hệ thống chăm sóc khách hàng)
// 2. Gắn cờ tài khoản → tạm ngừng phí trễ hạn trên khoản đang tranh chấp
// 3. Tạm dừng các hoạt động collections đang chạy
// 4. Tạo hồ sơ điều tra
// 5. Gửi xác nhận đã nhận khiếu nại cho khách hàng
//
// Cài đặt cụ thể phụ thuộc vào phạm vi của từng hệ thống
```

### Ranh giới đạo đức: những câu hỏi khó

Quay lại câu trong kịch bản: "Nếu anh không trả trong 24 giờ, chúng tôi sẽ liên hệ sếp của anh." Câu trả lời của Legal team rất ngắn: không được. Người quản lý của khách hàng là người không có nghĩa vụ trả nợ, nên liên hệ họ là vi phạm quy định nhắc nợ. Thêm vào đó, hạn chót 24 giờ kèm lời đe dọa là một hình thức gây áp lực không công bằng. Câu này phải bỏ.

Nhưng có những trường hợp không rõ ràng như vậy:

| Tình huống | Hợp pháp? | Có đạo đức? | Kết luận |
|---|---|---|---|
| "Điểm tín dụng của anh sẽ bị ảnh hưởng" | Có, nếu đúng sự thật | Có, nêu rõ hệ quả | Chấp nhận |
| "Gia đình anh sẽ biết về khoản nợ" | Không: người thân không có nghĩa vụ trả nợ | Không: dùng quan hệ gia đình làm đòn bẩy | Không chấp nhận |
| Gọi lúc 22:45 | Không: ngoài khung 7:00-21:00 | | Không chấp nhận |
| "Sau 30 ngày nếu chưa trả, chúng tôi sẽ báo cáo lên trung tâm thông tin tín dụng" | Có, nếu đúng như vậy | Có, minh bạch về hệ quả | Chấp nhận |
| Cố tình gọi đúng lúc biết khách đang họp quan trọng | Chưa có quy định cấm trực tiếp | Không: quấy rối về bản chất | Không chấp nhận, chính sách công ty nên cấm |

**Bốn câu hỏi cho đội collections:**

1. **Pháp lý:** có quy định nào cấm không?
2. **Mặt báo:** nếu hành động này lên báo, công ty có xấu hổ không?
3. **Đổi vai:** nếu mình là khách hàng, mình có chấp nhận không?
4. **CLV:** hành động này giữ gìn hay phá hủy quan hệ với khách hàng?

Qua được cả bốn thì chấp nhận được. Trượt bất kỳ câu nào thì cân nhắc lại hoặc chuyển lên cấp trên.

:::summary[Mục 10.7]
Tại Việt Nam, nhắc nợ của công ty tài chính bị giới hạn ở 5 lần mỗi ngày, trong khung 7 giờ đến 21 giờ, không đe dọa và không liên hệ người không có nghĩa vụ trả nợ; dịch vụ đòi nợ thuê đã bị cấm từ 2021. Các hành vi bị cấm chia thành bốn nhóm: quấy rối, lừa dối, xâm phạm riêng tư và không công bằng. Tranh chấp được xử lý ở hệ thống bên ngoài, với collections tạm dừng cho đến khi có kết luận. Bốn câu hỏi pháp lý, mặt báo, đổi vai và CLV giúp xử lý những trường hợp quy định chưa nói rõ.
:::

## Tóm tắt chương 10

Hành trình collections của một tài khoản từ DPD 1 đến khi được giải quyết:

```text
DPD 1-7: Kênh số giai đoạn sớm
  SMS lúc 09:00, push notification, đường dẫn thanh toán một chạm
  Hệ thống: tự động, giới hạn tần suất, tối ưu theo hành vi
  Mục tiêu: khách tự cure, ít ma sát nhất

DPD 8-29: Tăng cường
  Gọi điện trong khung giờ cho phép, đề xuất thỏa thuận thanh toán
  Hệ thống: rule engine của collections bên ngoài + hàng đợi nhân viên
  (DRG là danh mục dữ liệu, không phải rule engine)
  Mục tiêu: cure trước DPD 30

DPD 30: Chuyển sang Stage 2 theo IFRS 9
  Dự phòng ECL toàn thời hạn → ảnh hưởng P&L
  Giao cho collector chuyên trách

DPD 30-59: Collections giai đoạn giữa
  Liên hệ dày hơn, skip tracing trong giới hạn pháp luật
  Đánh giá khó khăn: tạm thời hay lâu dài?
  Hardship program nếu phù hợp

DPD 60-89: Trước pháp lý
  Chuẩn bị hồ sơ, thông báo kèm thời hạn
  Cơ hội cure cuối cùng
  Bắt đầu đánh giá phương án bán nợ

DPD 90+: Pháp lý và write-off
  Stage 3 theo IFRS 9
  Quyết định write-off (kế toán)
  Khởi kiện HOẶC bán nợ
  Theo dõi thu hồi sau write-off

Xuyên suốt:
  Đối xử công bằng (pháp lý + đạo đức)
  Xử lý tranh chấp (quyền của khách hàng được bảo vệ)
  Lưu vết (mọi hành động đều được kiểm toán)
  Tư duy CLV (giữ quan hệ khi còn có thể)

Kết quả collections tốt nhất:
  Không phải "chúng ta đã thu được tiền"
  Mà là "khách hàng đã phục hồi, trả hết nợ và có thể vay lại"
```

## Câu hỏi tự kiểm tra

**Loại 1: Nhớ lại**
1. Các DPD bucket tiêu chuẩn là gì? Vì sao chọn mốc 30, 60, 90 ngày?
2. Cure rate là gì? Vì sao nó giảm dần qua các bucket?
3. Payment holiday có miễn lãi không? Về mặt tài chính, điều gì vẫn xảy ra?
4. Write-off về mặt kế toán khác gì với tha nợ?

**Loại 2: Hiểu**
5. Vì sao ROI của collections sớm (DPD 1-30) cao hơn nhiều so với giai đoạn muộn (DPD 90+)? Hãy tính bằng số liệu cụ thể, và giải thích vì sao không được nhân toàn bộ số tài khoản cure thêm với LGD.
6. Vì sao DRG tồn tại tách khỏi LAS, khi LAS đã có đủ dữ liệu quá hạn?
7. Cờ forbearance nghĩa là gì? Vì sao khoản vay đã tái cơ cấu phải qua một thời gian thử thách trước khi giảm dự phòng, dù khách hàng đang trả tốt?
8. Vì sao thỏa thuận thanh toán phải được ghi trong hệ thống, không chỉ trong ghi chú của nhân viên? Vì sao thỏa thuận đó không làm DPD đứng yên?

**Loại 3: Áp dụng**

9. Portfolio có 50,000 tài khoản ở DPD 1-30, tổng dư nợ 400 tỷ, LGD 60%. Giả định 69% số tài khoản không cure ở bucket này cuối cùng sẽ vỡ nợ.
   - Kịch bản A: không can thiệp, cure rate tự nhiên 35%
   - Kịch bản B: SMS và gọi điện, chi phí 250,000/tài khoản, cure rate 55%
   - Kịch bản C: can thiệp tích cực, chi phí 600,000/tài khoản, cure rate 65%

   (a) Tính tổn thất kỳ vọng của từng kịch bản.
   (b) Tính lợi ích ròng (tổn thất tránh được trừ chi phí) của B và C so với A.
   (c) Đề xuất chiến lược tối ưu.

10. Khách hàng ở DPD 45, dư nợ 12,000,000 VNĐ, LGD 60%, lãi suất 18%/năm. Bạn đề nghị hoãn thanh toán 2 tháng, lãi vẫn tích lũy. P(khách phục hồi sau thời gian hoãn) = 35%.

    (a) Tính lãi tích lũy trong 2 tháng hoãn.
    (b) Tính chi phí kỳ vọng khi có hoãn thanh toán.
    (c) Tính chi phí kỳ vọng khi không hoãn.
    (d) Có nên đề nghị hoãn không? Xác suất hòa vốn là bao nhiêu?

**Loại 4: Phân tích**

11. Đội collections đề xuất theo dõi mạng xã hội để phát hiện khách hàng chi tiêu xa xỉ trong khi nói rằng không trả được nợ. Phân tích:
    (a) Giá trị tiềm năng: thông tin này cho biết điều gì?
    (b) Rủi ro pháp lý: xử lý dữ liệu cá nhân không có sự đồng ý, theo Luật Bảo vệ dữ liệu cá nhân 2025 và GDPR
    (c) Rủi ro đạo đức: dùng mạng xã hội trong thu hồi nợ
    (d) Rủi ro vận hành: nhận diện nhầm người
    (e) Đề xuất của bạn

12. Thiết kế chiến lược collections cho một sản phẩm BNPL mới:
    - Khoản vay bình quân: 3,000,000 VNĐ
    - Kỳ hạn: 3 tháng
    - Phần lớn khách hàng không có dữ liệu tín dụng (thin-file)
    - Khách hàng dùng app là chính
    - Tỷ lệ rơi vào DPD 1-30 dự kiến: 8% (so với 4% của sản phẩm thông thường)

    Thiết kế: (a) chiến lược và thời điểm liên hệ, (b) chọn kênh, (c) mục tiêu cure rate, (d) thời điểm write-off, (e) thin-file ảnh hưởng thế nào đến chiến lược collections?

## Bài tập áp dụng

**Bài 1: Mô hình ROI cho collections**

Xây dựng mô hình ROI cho portfolio 200,000 tài khoản, dư nợ bình quân 10,000,000 VNĐ, LGD 62%.

Phân bố DPD:

| Bucket | Số tài khoản | Chi phí can thiệp/tài khoản | Cure rate tự nhiên | Cure rate khi can thiệp |
|---|---|---|---|---|
| DPD 1-30 | 8,000 | SMS/push 100,000; thêm gọi điện +200,000 | 35% | 55% |
| DPD 31-60 | 3,200 | Tổng đài 400,000 | 15% | 28% |
| DPD 61-90 | 1,500 | Collector chuyên trách 800,000 | 7% | 12% |
| DPD 91+ | 800 | Pháp lý 2,000,000 | 2% | 4% |

(a) Tính tổn thất kỳ vọng có và không có can thiệp cho từng bucket. Nêu rõ giả định về tỷ lệ vỡ nợ của các tài khoản không cure.
(b) Tính ROI ròng của can thiệp ở từng bucket.
(c) Nếu tổng ngân sách collections là 5 tỷ VNĐ, phân bổ thế nào giữa các bucket?
(d) Những tài khoản DPD 91+ nào nên khởi kiện, những tài khoản nào nên bán nợ?

**Bài 2: Thiết kế DRG module**

Thiết kế mô hình dữ liệu và xử lý sự kiện của DRG cho portfolio 1.2 triệu tài khoản.

Yêu cầu:
- Theo dõi DPD gần thời gian thực (trong vòng 5 phút sau sự kiện từ LAS)
- Cung cấp dữ liệu cho tự động hóa collections
- Tính stage theo IFRS 9
- Báo cáo cơ quan quản lý (phân bố DPD hằng tháng)
- Phân tích hiệu quả collections

Kết quả cần có:
(a) Schema cơ sở dữ liệu (các bảng chính)
(b) Các Kafka subscription: sự kiện nào, hành động gì
(c) Rule engine collections cho DPD 1-30: thiết kế cây quyết định (đặt ở đâu, trong hay ngoài DRG?)
(d) Logic chuyển stage theo IFRS 9
(e) Hiệu năng: xử lý 1.2 triệu tài khoản với SLA 5 phút thế nào?

**Bài 3: Thiết kế chương trình collections có đạo đức**

Bạn là Head of Collections của một công ty tài chính tiêu dùng. Hãy thiết kế một chương trình collections hoàn chỉnh, gồm đào tạo nhân viên và hướng dẫn đạo đức, mẫu thông điệp, kiểm soát bằng công nghệ (giới hạn tần suất, chặn ngoài khung giờ), quyền của khách hàng và xử lý tranh chấp.

(a) Bộ quy tắc ứng xử cho nhân viên: 10 quy tắc cụ thể
(b) Kiểm soát bằng công nghệ: 5 cơ chế tự động bảo đảm tuân thủ
(c) Quyền của khách hàng: những thông tin bắt buộc trong lần liên hệ đầu tiên
(d) SLA và quy trình xử lý tranh chấp
(e) Giám sát chất lượng: làm sao kiểm chứng nhân viên tuân thủ hướng dẫn đạo đức?

## Đọc thêm

**Quy định:**
- Consumer Financial Protection Bureau. (2020). *Debt Collection Practices (Regulation F), Final Rule.* Có tại consumerfinance.gov. Khung quy định hiện đại về thu hồi nợ công bằng, gồm cả giới hạn tần suất gọi điện và quy tắc cho kênh điện tử.
- Thông tư 18/2019/TT-NHNN sửa đổi, bổ sung Thông tư 43/2016/TT-NHNN quy định cho vay tiêu dùng của công ty tài chính. Các yêu cầu về nhắc nợ được trích trong mục 10.7.

**Kinh tế học hành vi:**
- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness.* Yale University Press. Nền tảng cho việc thiết kế thông điệp và thời điểm liên hệ trong collections.

*Chương 10 khép lại Phần III. Chúng ta đã đi từ kiến trúc tổng thể (Chương 6), qua origination (Chương 7), quản lý tài khoản và billing (Chương 8, 9), đến collections. Phần IV chuyển sang tầng "trí tuệ": credit scoring, định giá theo rủi ro và kinh tế học hành vi trong thực tế, nơi dữ liệu và thuật toán gặp hiểu biết nghiệp vụ để tạo ra lợi thế cạnh tranh thực sự.*
