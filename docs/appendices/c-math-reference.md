---
title: "Phụ lục C. Công thức toán tài chính"
sidebar_label: "Phụ lục C. Công thức toán tài chính"
sidebar_position: 2
reading_time: 12
description: "Tập hợp công thức dùng trong sách: giá trị thời gian của tiền, PMT và bảng khấu hao, IRR, APR, EIR, lãi phát sinh theo 30/360, tổn thất dự kiến và VaR, lãi suất hòa vốn, WOE, IV, quy đổi điểm, Gini, KS, PSI, CLV và chỉ số thu hồi nợ, mỗi công thức kèm một ví dụ tính sẵn."
source_file: "phu-luc-c-math-reference.md"
editorial_status: "edited"
---

Phụ lục này tập hợp các công thức được dùng trong sách, mỗi công thức kèm một ví dụ đã tính sẵn. Phần lớn ví dụ dùng khoản vay của chị Lan (18,500,000 VNĐ, 18%/năm, 12 tháng, trả cuối kỳ), nên con số ở đây khớp với các chương. Quy ước chung: lãi suất kỳ $r$ bằng lãi suất năm chia 12; PMT và lãi từng kỳ làm tròn HALF_UP đến đồng; kỳ cuối khép dư nợ về đúng 0. Có thể kiểm tra các ví dụ bằng [công cụ tính](/docs/tools).

## C.1 Giá trị thời gian của tiền

### Giá trị hiện tại và giá trị tương lai

$$
PV = \frac{FV}{(1+r)^n}, \qquad FV = PV \cdot (1+r)^n
$$

```text
Ví dụ: 1,000,000 VNĐ nhận sau 12 tháng, chiết khấu 1%/tháng
  (1.01)^12 = 1.126825
  PV = 1,000,000 / 1.126825 = 887,449 VNĐ

Ngược lại: gửi 887,449 VNĐ ở 1%/tháng trong 12 tháng
  FV = 887,449 × 1.126825 = 1,000,000 VNĐ
```

### Giá trị hiện tại ròng (NPV)

$$
NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}
$$

$CF_t$ là dòng tiền ở kỳ $t$, dương khi nhận vào, âm khi chi ra. NPV bằng 0 khi $r$ đúng bằng IRR của dòng tiền (mục C.3).

```text
Ví dụ: khoản vay của chị Lan nhìn từ phía Vela Finance
  t = 0:        −18,300,000   (giải ngân 18,500,000, đã giữ lại phí thẩm định 200,000)
  t = 1 … 11:   +1,696,080
  t = 12:       +1,696,077

  Chiết khấu ở 1.5%/tháng (đúng lãi suất hợp đồng):  NPV ≈ +199,999 VNĐ
  Chiết khấu ở 8.5%/12 (chi phí nợ, Chương 12):      NPV ≈ +1,146,044 VNĐ
```

Ở lãi suất hợp đồng, NPV xấp xỉ đúng bằng phí thẩm định (lệch 1 đồng do làm tròn): phần lãi chỉ bù cho giá trị thời gian của tiền ở mức 18%/năm. NPV ở chi phí nợ lớn hơn nhiều, nhưng chưa trừ tổn thất dự kiến, chi phí vận hành và lợi nhuận vốn chủ; mục C.4 trình bày đủ các thành phần đó.

## C.2 Khoản trả góp

### Khoản trả định kỳ (PMT)

$$
PMT = PV \cdot \frac{r\,(1+r)^n}{(1+r)^n - 1}
$$

```text
Khoản vay của chị Lan: PV = 18,500,000, r = 0.015, n = 12
  (1.015)^12 = 1.195618
  PMT = 18,500,000 × (0.015 × 1.195618) / (1.195618 − 1)
      = 18,500,000 × 0.017934 / 0.195618
      = 1,696,079.87  →  1,696,080 VNĐ/tháng (HALF_UP)
```

Dẫn xuất công thức ở [Chương 2, mục 2.1](/docs/foundations/ch02-mathematics-of-lending#21-niên-kim-nền-tảng-của-mọi-tính-toán-trả-góp).

### Bảng khấu hao

$$
I_t = B_t \cdot r, \qquad P_t = PMT - I_t, \qquad B_{t+1} = B_t - P_t
$$

```text
Kỳ 1:   Lãi = 18,500,000 × 0.015 = 277,500    Gốc = 1,418,580    Dư nợ = 17,081,420
Kỳ 2:   Lãi = 17,081,420 × 0.015 = 256,221    Gốc = 1,439,859    Dư nợ = 15,641,561
…
Kỳ 12:  Lãi =  1,671,012 × 0.015 =  25,065    Gốc = 1,671,012    Dư nợ = 0
        Khoản trả kỳ cuối = 1,671,012 + 25,065 = 1,696,077 VNĐ
```

Lãi giảm dần, gốc tăng dần. Kỳ cuối trả đúng dư nợ còn lại cộng lãi, nên khoản trả kỳ 12 thấp hơn PMT 3 đồng.

### Tổng lãi

```text
Ước tính:            12 × 1,696,080 − 18,500,000 = 1,852,960 VNĐ
Theo bảng khấu hao:  1,852,957 VNĐ (kỳ cuối đã điều chỉnh)

Tỷ lệ trên số tiền vay: 1,852,957 / 18,500,000 ≈ 10.0%
```

Tỷ lệ 10% thấp hơn 18% vì dư nợ giảm dần: dư nợ bình quân trong 12 tháng chỉ khoảng 10.3 triệu đồng. Con số 10% không phải một lãi suất.

### Niên kim đầu kỳ

$$
PMT_{due} = \frac{PMT_{ordinary}}{1 + r}
$$

```text
Khoản vay của chị Lan, trả đầu kỳ: 1,696,079.87 / 1.015 = 1,671,015 VNĐ
```

### Khoản trả cuối lớn (balloon)

Khi một phần gốc $B$ được trả gộp ở kỳ cuối, chỉ phần còn lại được khấu hao đều:

$$
PMT = \left(PV - \frac{B}{(1+r)^n}\right) \cdot \frac{r\,(1+r)^n}{(1+r)^n - 1}
$$

```text
Ví dụ: 18,500,000 VNĐ, 18%/năm, 12 tháng, balloon 3,000,000 ở kỳ 12
  Giá trị hiện tại của balloon = 3,000,000 / 1.195618 = 2,509,162
  Phần khấu hao đều            = 18,500,000 − 2,509,162 = 15,990,838
  PMT = 15,990,838 × 0.091680 = 1,466,040 VNĐ/tháng
  Kỳ 12: 1,466,040 + 3,000,000 balloon
```

### Trả trước một phần

Khi khách hàng trả thêm gốc và giữ nguyên PMT, kỳ hạn rút ngắn và tổng lãi giảm.

```text
Ví dụ: chị Lan trả thêm 2,000,000 VNĐ ngay sau kỳ 8, giữ PMT 1,696,080
  Dư nợ sau kỳ 8: 6,537,342 → 4,537,342
  Khoản vay kết thúc ở kỳ 11 (kỳ cuối 1,275,735 VNĐ) thay vì kỳ 12
  Tổng lãi giảm 116,422 VNĐ
```

Số tiền tất toán toàn bộ tại một thời điểm là dư nợ gốc cộng lãi phát sinh đến ngày tất toán và phí trả trước hạn nếu có; xem [công cụ tất toán trước hạn](/docs/tools#early-settlement).

## C.3 Lãi suất và chi phí tín dụng

### Quy đổi giữa lãi suất tháng và năm

$$
r_{tháng} = \frac{i_{năm}}{12}, \qquad EIR = (1 + r_{tháng})^{12} - 1
$$

```text
Lãi suất danh nghĩa 18%/năm → 1.5%/tháng
Lãi suất thực tế năm:  (1.015)^12 − 1 = 19.56%
```

Lãi suất ghi trên hợp đồng ở Việt Nam là lãi suất năm danh nghĩa; con số 19.56% chỉ khác vì tính lãi kép theo tháng.

### IRR, APR và EIR

IRR theo kỳ là nghiệm của:

$$
0 = \sum_{t=0}^{n} \frac{CF_t}{(1 + IRR)^t}
$$

$$
APR = IRR_m \times 12, \qquad EIR = (1 + IRR_m)^{12} - 1
$$

IRR không có nghiệm đóng; tìm bằng chia đôi khoảng hoặc Newton-Raphson ($r_{k+1} = r_k - NPV(r_k)/NPV'(r_k)$), dừng khi bước nhảy nhỏ hơn khoảng $10^{-8}$, rồi thay nghiệm ngược vào phương trình để kiểm tra.

```text
Dòng tiền của chị Lan:
  CF_0 = +18,300,000 (đã trừ phí thẩm định 200,000)

                                IRR tháng    APR       EIR
  Không phí                      1.500%     18.00%    19.56%
  Phí thẩm định 200,000          1.675%     20.10%    22.06%
  Thêm bảo hiểm 100,000/tháng    2.611%     31.34%    36.25%
```

Chi tiết ở [Chương 2, mục 2.2](/docs/foundations/ch02-mathematics-of-lending#22-irr-apr-và-eir-lãi-suất-thật-là-gì). Trần chi phí tín dụng, nếu có, phải được kiểm tra trên APR hoặc EIR theo đúng định nghĩa của văn bản áp dụng, không phải trên lãi suất danh nghĩa.

### Lãi phát sinh theo ngày

$$
I = B \times \frac{i_{năm}}{D} \times d
$$

$B$ là dư nợ gốc, $d$ là số ngày tính lãi, $D$ là mẫu số của quy ước tính ngày: 360 với 30/360 (VLP dùng `D30_360`, mỗi tháng tính 30 ngày), 365 với actual/365 (số ngày thực).

```text
Dư nợ 17,081,420 VNĐ (sau kỳ 1 của chị Lan), 18%/năm

  30/360, một tháng bất kỳ:      17,081,420 × 0.18 / 360 × 30 = 256,221 VNĐ
  Actual/365, tháng 31 ngày:     17,081,420 × 0.18 / 365 × 31 = 261,135 VNĐ
  Actual/365, tháng 28 ngày:     17,081,420 × 0.18 / 365 × 28 = 235,864 VNĐ
```

Theo 30/360, lãi mỗi tháng bằng đúng lãi trong bảng khấu hao. Theo actual/365, lãi dao động theo độ dài tháng, nên lịch trả nợ niên kim phải dùng một quy ước riêng cho kỳ hoặc chấp nhận kỳ cuối lệch nhiều hơn.

## C.4 Rủi ro tín dụng và định giá

### Tổn thất dự kiến

$$
EL = PD \times LGD \times EAD
$$

```text
Một khoản vay:  PD 5%, LGD 60%, EAD 15,000,000
  EL = 0.05 × 0.60 × 15,000,000 = 450,000 VNĐ/năm (3.0% dư nợ)

Danh mục (Chương 2):  100,000 khoản vay × 15,000,000
  EAD tổng = 1,500 tỷ VNĐ
  EL       = 5% × 60% × 1,500 tỷ = 45 tỷ VNĐ
```

### VaR và vốn đệm

$$
C \approx VaR_{99\%} - EL
$$

```text
Giả định đơn giản hóa: tổn thất phân phối chuẩn, σ = 12 tỷ VNĐ
  VaR 99% ≈ EL + 2.33σ = 45 + 2.33 × 12 = 72.96 tỷ VNĐ
  Vốn đệm ≈ 72.96 − 45 = 27.96 tỷ VNĐ
```

Phân phối tổn thất tín dụng thực tế lệch phải và có đuôi dày, nên giả định phân phối chuẩn đánh giá thấp VaR.

### Lãi suất hòa vốn

$$
i_{hòa\ vốn} = CoF + EL\% + OpEx\% + ROE\% - Phí\%
$$

Mọi thành phần quy về phần trăm dư nợ bình quân mỗi năm. Với cấu trúc vốn 85% nợ, 15% vốn chủ: $CoF = 85\% \times$ chi phí nợ, $ROE\% = 15\% \times$ ROE mục tiêu.

```text
Hạng Sub-prime của Vela Finance (Chương 12):
  Chi phí vốn         85% × 8.5%                  7.23%
  Tổn thất dự kiến    6.5% × 62% × EAD             3.86%
  Chi phí vận hành    khởi tạo 550,000 + phục vụ   8.28%
  Lợi nhuận vốn chủ   15% × 18%                    2.70%
  Trừ phí thẩm định   200,000                     −1.97%
  ────────────────────────────────────────────────────────
  Lãi suất hòa vốn                                20.10%

  Prime: 12.46%    Standard: 14.12%    Sub-prime: 20.10%
```

### Độ co giãn theo giá

$$
\varepsilon = \frac{\%\Delta Q}{\%\Delta P}
$$

```text
Ví dụ: lãi suất tăng từ 15% lên 16% (giá tăng 6.67%), số đơn giảm 1.8%
  ε = −1.8% / 6.67% = −0.27 (kém co giãn)

  Thu nhập lãi gộp theo năm, 5,000 khoản × 15,000,000:
    Trước: 5,000 × 15,000,000 × 15% = 11.25 tỷ VNĐ
    Sau:   4,910 × 15,000,000 × 16% = 11.78 tỷ VNĐ (+4.7%)
```

Thu nhập gộp tăng không đủ để kết luận việc tăng giá có lợi: cần kiểm tra khách hàng nào rời đi. Nếu người rời đi chủ yếu là khách hàng tốt, PD của danh mục còn lại tăng (lựa chọn bất lợi, [Chương 1](/docs/foundations/ch01-credit-economics#12-thông-tin-bất-cân-xứng-vấn-đề-gốc-rễ)).

## C.5 Chấm điểm tín dụng

### WOE và Information Value

$$
WOE_i = \ln\frac{\%Vỡ\ nợ_i}{\%Tốt_i}, \qquad IV = \sum_i (\%Vỡ\ nợ_i - \%Tốt_i) \times WOE_i
$$

```text
Biến cb_max_dpd_12m, bin DPD = 0 (Chương 11):
  6,000 tài khoản, 240 vỡ nợ, 5,760 tốt; tổng 800 vỡ nợ, 9,200 tốt
  %Vỡ nợ = 240 / 800 = 30.0%      %Tốt = 5,760 / 9,200 = 62.6%
  WOE = ln(30.0% / 62.6%) = −0.736
  Đóng góp IV = (30.0% − 62.6%) × (−0.736) = 0.240

  IV của cả biến (5 bin) = 0.509
```

WOE âm nghĩa là bin nghiêng về khách hàng tốt. Thang đọc IV: dưới 0.02 không có giá trị, 0.02 đến 0.10 yếu, 0.10 đến 0.30 trung bình, trên 0.30 mạnh, trên 0.50 cần kiểm tra rò rỉ dữ liệu.

### Hồi quy logistic và quy đổi điểm

$$
z = \beta_0 + \sum_i \beta_i \cdot WOE_i, \qquad P(vỡ\ nợ) = \frac{1}{1 + e^{-z}}
$$

$$
Điểm = Offset + Factor \times \ln(odds_{tốt/xấu}), \qquad Factor = \frac{PDO}{\ln 2}
$$

```text
Thang điểm của sách: 380 điểm ở odds 20 : 1, PDO = 40
  Factor = 40 / 0.6931 = 57.71
  Offset = 380 − 57.71 × ln(20) = 207.1

Chị Lan: z = −3.688
  P(vỡ nợ) = 1 / (1 + e^3.688) = 2.4%       odds tốt/xấu = 40 : 1
  Điểm = 207.1 + 57.71 × 3.688 = 420         → hạng Standard (380 đến 439)

Các mốc khác: 340 điểm ↔ odds 10 : 1 (P ≈ 9.1%); 440 điểm ↔ odds ≈ 57 : 1 (P ≈ 1.7%)
```

Ngưỡng hạng ở [Chương 7](/docs/system/ch07-origination): Prime từ 440, Standard 380 đến 439, Sub-prime 340 đến 379, dưới 340 từ chối.

### Gini, KS và PSI

$$
Gini = 2 \times AUROC - 1, \qquad KS = \max_s \left| F_{xấu}(s) - F_{tốt}(s) \right|
$$

$$
PSI = \sum_i (\%Thực\ tế_i - \%Kỳ\ vọng_i) \times \ln\frac{\%Thực\ tế_i}{\%Kỳ\ vọng_i}
$$

```text
Gini:  AUROC 0.72 → Gini 0.44;  AUROC 0.80 → Gini 0.60
KS:    hiệu lớn nhất giữa tỷ lệ lũy kế khách hàng xấu và tốt theo điểm
PSI:   %Kỳ vọng là phân bố lúc huấn luyện, %Thực tế là phân bố hiện tại
```

| Chỉ số | Mốc thường dùng |
|---|---|
| Gini | trên 0.45 chấp nhận được, trên 0.60 tốt |
| KS | trên 30% tốt, trên 40% rất tốt |
| PSI | dưới 0.10 ổn định; 0.10 đến 0.25 theo dõi; trên 0.25 cần huấn luyện lại |

Các mốc này là quy ước ngành, không phải quy định; mỗi tổ chức đặt ngưỡng riêng trong chính sách quản trị rủi ro mô hình.

## C.6 Giá trị vòng đời khách hàng

$$
CLV = \sum_{t=1}^{T} \frac{p_t \times M_t}{(1+r)^t}
$$

$M_t$ là lợi nhuận ròng ở năm $t$, $p_t$ là xác suất khách hàng còn vay ở năm $t$, $r$ là suất chiết khấu.

```text
Khách hàng A (Chương 3), r = 10%:
  Năm 1: 800,000, chắc chắn
  Năm 2: 1,100,000, xác suất 40%
  Năm 3: 1,400,000, xác suất 25%

  CLV = 800,000/1.1 + 0.4 × 1,100,000/1.1² + 0.25 × 1,400,000/1.1³
      = 727,273 + 363,636 + 262,960
      = 1,353,869 VNĐ
```

Khi đánh giá một chương trình giữ chân khách hàng, chỉ phần CLV tăng thêm nhờ chương trình mới được so với chi phí của nó.

## C.7 Thu hồi nợ

### Roll rate và cure rate

$$
Roll\ rate_{a \to b} = \frac{\text{Số tài khoản ở nhóm } a \text{ tháng này chuyển sang nhóm } b \text{ tháng sau}}{\text{Số tài khoản ở nhóm } a \text{ tháng này}}
$$

```text
Ví dụ: 1,200 tài khoản DPD 1-30 tháng này; tháng sau:
  Về đúng hạn (DPD 0):        720   → cure rate 60%
  Vẫn ở DPD 1-30:             180   → 15%
  Chuyển sang DPD 31-60:      300   → roll rate 25%
```

Nhân các roll rate dọc chuỗi nhóm cho xác suất của một đường đi. Với ma trận ở [Chương 2, mục 2.3](/docs/foundations/ch02-mathematics-of-lending#23-mô-hình-rủi-ro-tín-dụng-định-lượng), xác suất một tài khoản đang đúng hạn đi thẳng đến nhóm trên 90 ngày trong bốn tháng liên tiếp là 6% × 40% × 60% × 65% ≈ 0.94%. Xác suất vỡ nợ đầy đủ phải cộng thêm các đường đi có quay lui, nên thường được tính bằng cách nhân ma trận.

### Tỷ lệ thu hồi kỳ vọng và LGD

$$
LGD = 1 - \sum_k p_k \times \text{tỷ lệ thu hồi}_k
$$

```text
Ví dụ, chưa chiết khấu và chưa trừ chi phí thu hồi:
  Trả đủ             40% × 100% = 40%
  Thỏa thuận một phần 35% ×  60% = 21%
  Thu hồi qua tòa     15% ×  40% =  6%
  Bán nợ              10% ×  10% =  1%
  ─────────────────────────────────────
  Tỷ lệ thu hồi kỳ vọng          = 68%
  LGD = 1 − 68% = 32%
```

LGD dùng để định giá phải tính trên giá trị hiện tại của khoản thu hồi, sau chi phí thu hồi và pháp lý, nên thường cao hơn con số chưa chiết khấu. Sách dùng LGD 60% đến 62% cho cho vay tiêu dùng không tài sản bảo đảm.

## C.8 Tham chiếu nhanh

**Phân loại nợ theo số ngày quá hạn** (Thông tư 31/2024/TT-NHNN) và **tỷ lệ trích lập dự phòng cụ thể** (Nghị định 86/2024/NĐ-CP):

| Nhóm nợ | Số ngày quá hạn | Dự phòng cụ thể |
|---|---|---:|
| Nhóm 1, đủ tiêu chuẩn | dưới 10 ngày | 0% |
| Nhóm 2, cần chú ý | 10 đến 90 ngày | 5% |
| Nhóm 3, dưới tiêu chuẩn | 91 đến 180 ngày | 20% |
| Nhóm 4, nghi ngờ | 181 đến 360 ngày | 50% |
| Nhóm 5, có khả năng mất vốn | trên 360 ngày | 100% |

Nợ xấu là nợ nhóm 3 đến nhóm 5. Bảng chỉ tóm tắt tiêu chí số ngày quá hạn; điều kiện phân loại đầy đủ và cách tính dự phòng xem [Phụ lục D](/docs/appendices/d-regulatory-reference).

**Số liệu của các ví dụ trong sách:**

| Đại lượng | Giá trị |
|---|---|
| Khoản vay của chị Lan | 18,500,000 VNĐ, 18%/năm, 12 tháng |
| PMT, kỳ cuối, tổng lãi | 1,696,080; 1,696,077; 1,852,957 VNĐ |
| Phí thẩm định, APR | 200,000 VNĐ; 20.10% |
| Điểm, PD, hạng | 420 điểm; 2.4%; Standard |
| Chi phí nợ, cấu trúc vốn, ROE mục tiêu | 8.5%/năm; 85% nợ, 15% vốn chủ; 18% |
| LGD cho vay không bảo đảm | 60% đến 62% |

**Quy tắc 72.** Số năm để một khoản tiền tăng gấp đôi ở lãi suất $i$%/năm, ghép lãi hằng năm, xấp xỉ $72 / i$. Ở 18%: khoảng 4 năm (chính xác là $\ln 2 / \ln 1.18 \approx 4.19$ năm).
