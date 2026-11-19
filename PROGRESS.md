# PROGRESS

Nguồn sự thật cho tiến độ dự án. Phiên mới: đọc file này, đối chiếu với repository, rồi bắt đầu từ mục "Bước tiếp theo".

Cập nhật lần cuối: 2026-11-18, phiên 4 (logo mới, giao diện kiểu tài liệu với tông mint, tìm kiếm).

## Tổng quan

Ước tính hoàn thành: **khoảng 40%**. Nền tảng website, pipeline, công cụ và ẩn danh hóa (kể cả định danh kỹ thuật) đã xong; nội dung toàn bộ chương đã lên website ở dạng chuyển đổi cơ học; 2/16 chương được biên tập đầy đủ (Ch.1, Ch.2). Phần việc lớn nhất còn lại là biên tập và kiểm tra tài chính từng chương (Phase 5, 6, 8).

| Phase | Trạng thái |
|---|---|
| 1. Audit | Xong: `docs-internal/PROJECT_AUDIT.md`, `CONTENT_INVENTORY.md`, `CONTENT_GAP_ANALYSIS.md` |
| 2. Book architecture | Xong: `BOOK_STRUCTURE.md`, `CONTENT_MAPPING.md` |
| 3. Anonymization | Xong cho mọi trang công khai (check:content = 0 lỗi). Phiên 2: đổi tên mã phí, module, bảng, class sang tên cùng nghĩa (160 mẫu, mục `technical` trong `scripts/entities.json`). Registry sinh bằng `scripts/build_registry.py`; báo cáo: `ANONYMIZATION_REPORT.md` |
| 4. Docusaurus foundation | Xong: 3.10.2, TypeScript strict, i18n vi/en, KaTeX tự host, Mermaid, theme editorial, light/dark, homepage, sidebar, mục lục tự sinh, GitHub Actions |
| 5. Content transformation | Đang làm. Cơ học: 18/21 file. Biên tập đầy đủ: Ch.1, Ch.2. Sửa lỗi có chọn lọc: Phụ lục C, Thuật ngữ (APR) |
| 6. Visualization & tools | Một phần: 3 công cụ tương tác; biểu đồ: 2 (Ch.2) + 1 (Ch.1, `CostStackChart`); Mermaid: 3 (Ch.2) + 2 (Ch.1). Các chương khác chưa có trực quan hóa mới |
| 7. QA | Một phần: build, typecheck, content check, kiểm tra hiển thị 1280px/390px trên Ch.2, Công cụ, Trang chủ, bản EN. Kiểm tra tài chính mới làm Ch.2 và một phần Phụ lục C |
| 8. Final editorial review | Chưa làm |
| Deploy | Workflow đã viết; **chưa deploy** (chưa có repository GitHub và quyền push) |

## Trạng thái từng chương

`edited` = đạt chuẩn prompt. `mechanical` = đã ẩn danh, sửa cấu trúc, typography, nhưng câu chữ còn nguyên bản thảo và số liệu chưa kiểm tra.

| Trang | Trạng thái | Ghi chú |
|---|---|---|
| Lời mở đầu | **edited** | Phiên 7. Tên các phần theo sidebar (Phần I-V, bản cũ ghi Phần 0-IV), bỏ dấu gạch ngắt câu, thuật ngữ tiếng Việt, liên kết trang Cách đọc và Thuật ngữ (thay "Phụ lục B") |
| Ch.1 | **edited** | Phiên 2. Số liệu đã kiểm lại bằng script (TVM, adverse selection, EL, bảng chi phí); làm rõ hai cách phân tách 18%; nhận định 2015-2018 chuyển thành nhận định chưa xác minh; sửa tham chiếu BIS |
| Ch.2 | **edited** | Pilot. Đã sửa 6 lỗi (xem PROJECT_AUDIT §4). Còn 1 điểm cần xác minh: `PRIORITY_ONLY` |
| Ch.3 | **edited** | Phiên 4. Sửa APR khoản vay có phí (28.5% → 35.7%), cơ chế subvention (chiết khấu khi giải ngân, 1,365,618 VNĐ), phân tích lợi ích của người bán theo lợi nhuận gộp, bẫy trả tối thiểu (85 tháng, không phải 10+ năm), lãi lỗ khoản vay (bỏ phí bảo hiểm thu hộ khỏi doanh thu, chi phí vốn theo dư nợ bình quân, biên 3.6%), cảnh báo về phép so sánh ROI retention. Nghĩa `SVCFEE` = phí dịch vụ của ACCMAINT. Hình 3.1 |
| Ch.4 | **edited** | Phiên 4. Sửa PMT các đề nghị 12/36 tháng, câu chuyện sofa (bỏ "0%" mâu thuẫn), chi phí của thiên kiến hiện tại (gồm cả lãi tiết kiệm bỏ lỡ), thêm giai đoạn 8 vào sơ đồ, câu hỏi 10 (APR 18%), bỏ các con số "nghiên cứu cho thấy" không nguồn |
| Ch.5 | **edited** | Phiên 4. Dựng lại báo cáo lãi lỗ cho nhất quán (lợi suất 28%, chi phí vốn khớp nguồn vốn ALM, NIM 20.2%, ROA 3.95%, ROE 19.75%), đối chiếu chi phí dự phòng với số dư dự phòng, sửa số liệu vintage và roll rate (tổng 10,530 tài khoản, hàng 91+), duration 11.9 tháng, kỳ hạn nguồn vốn 17.8 tháng, ví dụ trả trước. Hình 5.1 (SeriesLineChart) thay biểu đồ ASCII |
| Ch.6 | **edited** | Phiên 6. Sửa câu chuyện Knight Capital theo lệnh SEC 2013 (7/8 server, khoảng 440 triệu USD, gói cứu 400 triệu USD, sáp nhập Getco), bỏ tham chiếu "Helberg 2022" không tồn tại, ví dụ event sourcing theo khoản vay của chị Lan (dư nợ 15,641,561 sau 2 kỳ), quyền xóa dữ liệu theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, CIS = Customer Identity Service, danh sách chuyển thành bảng, chú thích Hình 6.1 |
| Ch.7 | **edited** | Phiên 6. Lan thuộc hạng Standard (420 điểm, 18%/năm, PMT 1,696,080, APR có phí thẩm định 200,000 là 20.10% (thống nhất với Ch.2 ở phiên 7), DTI 7.7%); PMT của khách Prime, Sub-prime và đề nghị thay thế 12 triệu ở 21% tính bằng script; bỏ kiểm tra "APR < rate_cap" mâu thuẫn với Ch.12; đánh số lại các bước Mermaid; Luật Giao dịch điện tử 20/2023/QH15 và Nghị định 23/2025/NĐ-CP; sửa tác giả *Practical Process Automation* (Ruecker 2021) |
| Ch.8 | **edited** | Phiên 5. Sửa fence của thuật toán prescribing và pairing (code giữ nguyên, chỉ gộp vào một khối `java`), đưa đoạn lịch sử bất biến vào khối `text` và sửa mâu thuẫn "mọi thay đổi là INSERT", số dư ví dụ theo lịch trả nợ thật (gốc còn 14,180,104 sau 3 kỳ), thời gian EOM nhất quán (300 ms/tài khoản, 16 partition, khoảng 6.25 giờ), sơ đồ Mermaid cho BillingRun (Hình 8.2) và các bước EOM (Hình 8.3), nhãn write-off trong máy trạng thái theo tín hiệu DRG, sửa tài liệu đọc thêm (Minella 2019, Vernon chương 10) |
| Ch.9 | **edited** | Phiên 5. Dựng lại toàn bộ ví dụ chu kỳ billing cho nhất quán: kỳ 3 (20/2-19/3) của tài khoản hạn mức 18%/năm, 30/360, lãi 207,850, phí 140,000, MMI 1,800,000 (phí → lãi → gốc), số dư có 1,200,000, sao kê và mục "chỉ trả tối thiểu" (8 tháng, lãi 742,000) tính bằng script; bỏ ghi chú sửa 15%/365; sửa số dư khả dụng ở kịch bản trả đúng hạn; đổi tên "chị Minh" thành chị Thu |
| Ch.10 | **edited** | Phiên 6. Tính lại ROI của can thiệp sớm (chỉ tính tài khoản lẽ ra vỡ nợ: tránh 68.7 tỷ, ROI 243%), PV phương án giữ nợ 12.82 tỷ, lãi 3 tháng hoãn thanh toán 675,000 và chi phí kỳ vọng theo góc nhìn bên cho vay (hòa vốn khoảng 6%), PMT tái cơ cấu 12 triệu (1,100,160 ở 12 tháng, 599,089 ở 24 tháng); quy định nhắc nợ theo Thông tư 18/2019/TT-NHNN (5 lần/ngày, 7-21 giờ, không liên hệ người không có nghĩa vụ trả nợ), cấm dịch vụ đòi nợ theo Luật Đầu tư 2020, thời hiệu 3 năm (BLDS 2015 Điều 429); bỏ "Nghị định 144/2021"; thỏa thuận thanh toán không làm DPD đứng yên; forbearance 12 tháng là chính sách, không phải yêu cầu của IFRS 9; sửa fence quanh luồng write-off; khách hàng "anh Minh" đổi thành anh Khoa, "Ngân hàng ABC" thành Vela Finance; Phần III (không phải Phần II); bỏ McKinsey 2018 không xác minh được, thay Sunstein 2014 bằng *Nudge* (2008) |
| Ch.11 | **edited** | Phiên 7. Sửa bảng WOE (%Tốt cũ cộng lại 113.9%; IV 0.509), hệ số logistic trên WOE phải dương, thang điểm thống nhất với Ch.7: neo 380 điểm ở odds 20 : 1, PDO 40, chị Lan PD 2.4% → đúng 420 điểm (hạng Standard; bản cũ ra 696 và ghi Prime 15%); Prime < 1.7%, Standard 1.7-4.8%, Sub-prime 4.8-9.1% PD; kết quả bất khả thi về công bằng theo Chouldechova 2017 và Kleinberg và cộng sự 2016; ECOA/Reg B/FCRA; số liệu tài khoản ngân hàng Việt Nam theo NHNN và Global Findex; bài tập 1 tổng 15,500 |
| Ch.12 | **edited** | Phiên 7. Hạng và giá theo Ch.7 (15/18/21%); mô hình chi phí cộng biên tính trên dư nợ bình quân bằng script `rbp.py` (chi phí vốn 85% nợ × 8.5%, ROE 18% trên 15% vốn chủ, LGD 62%, phí thẩm định 200,000 như Ch.2): hòa vốn Prime 12.46%, Standard 14.12%, Sub-prime 20.10%; độ co giãn tính trên % thay đổi lãi suất; cỡ mẫu A/B khoảng 7 tuần; cấu hình biểu phí dùng FeeComponent lãi (không còn gọi `SVCFEE` là phí lãi) và `validTo` nửa mở; trần lãi suất viết lại thành tình huống giả định, nêu BLDS 2015 Điều 468, kiểm tra trên APR; tóm tắt chương dùng khoản vay của chị Lan (18%, APR 20.10%) |
| Ch.13 | **edited** | Phiên 7. Cảnh mở đầu đổi sang chị Hoa, số liệu khoản vay điện thoại tính lại (36 tháng, 22%, 458,285/tháng, tiết kiệm 602,922 khi tất toán còn 12 kỳ); tham số λ, α theo Tversky và Kahneman 1992; bỏ các con số gán cho nghiên cứu không xác minh được (Beshears 2021, "India, Mexico"), mô tả đúng Bertrand và cộng sự 2010; số liệu thử nghiệm ghi là của Vela Finance; lịch trả nợ và máy tính trả trước theo khoản vay của chị Lan (trả thêm 2 triệu sau kỳ 8 tiết kiệm 116,422); thưởng đại lý bằng VNĐ và hệ số khớp ngưỡng; Phần IV (không phải Phần III); FCA Consumer Duty 2022 |
| Ch.14 | **edited** | Phiên 7. Câu chuyện mở đầu đổi sang chị Thu (6 triệu, 6 × 1,000,000); kinh tế đơn vị BNPL tính lại trên dư nợ bình quân: mô hình kết hợp lãi 97,450 VNĐ/giao dịch, hòa vốn ở PD khoảng 12.3%, mô hình chỉ thu phí người bán 3% lỗ cả khi PD = 0; APR của phí xử lý 0.5/0.7/1%/tháng là 10.21/14.26/20.29%; sửa rò rỉ tên thật (`SHOPEE_VN`, Gojek, Sea Group, Zalo Pay); lịch sử quản lý BNPL (Úc 6/2025, Anh 15/7/2026, EU CCD2, Singapore theo bộ quy tắc ngành, CFPB rút cách diễn giải); Thông tư 64/2024/TT-NHNN về Open API (hiệu lực 1/3/2025); bỏ "McRae 2022" không xác minh được, sửa tác giả *Embedded Finance* (Sieber và Guibaud 2022) |
| Ch.15 | **edited** | Phiên 7. Tác tử collections dùng khách anh Tùng (DPD 7, 1,800,000) và tuân theo giới hạn nhắc nợ của Ch.10; trích xuất phiếu lương khớp thu nhập 22 triệu của chị Lan; ngưỡng điểm theo Ch.7 (330 < 340); bỏ câu tiếng Anh, bảng tóm tắt thay cho emoji ✅⚠️❌; độ trễ feature store nhất quán; số liệu nội bộ ghi là của Vela Finance |
| Ch.16 | **edited** | Phiên 7. Nguyên tắc làm tròn sửa theo VLP (HALF_UP về đồng mỗi kỳ, kỳ cuối hấp thụ chênh lệch) thay cho "làm tròn một lần cuối, lãi làm tròn lên"; bỏ các giai thoại và nghiên cứu không xác minh được (ngân hàng Anh 1980, "Indonesia 2023", "Ấn Độ 2015-2023", "8-12 lần", LTCM "1/10^24"), thay bằng Andhra Pradesh 2010; Gini không phải phần trăm phương sai được giải thích; câu khung tiếng Indonesia ở nguyên tắc 17 viết lại bằng tiếng Việt; Sub-prime 21%; số liệu lá thư khớp Ch.13 (tất toán sớm 1 tháng, 116,422 VNĐ); ông Phúc theo Ch.11 |
| Thuật ngữ | **edited** | Phiên 7. Viết lại 102 định nghĩa bằng tiếng Việt, xếp lại theo thứ tự chữ cái (LOS, AOS, QST, CurrentBalance, Infinispan từng nằm sai mục); sửa tên tiếng Việt sai (Tariff-Driven Design là "thiết kế dựa trên biểu phí", không phải "thuế suất"); sửa trích nợ tự động 82% bật sẵn so với 45% tự đăng ký, công thức CLV, EIR, Stage 3 IFRS 9, nợ xấu theo Thông tư 31/2024, write-off theo ngưỡng cấu hình, hoãn thanh toán theo cờ miễn lãi; bỏ "DTI ≤ 50% theo quy định" và "ân hạn 3-7 ngày" không có nguồn |
| Phụ lục A | **edited** | Phiên 7. Nhãn module trong sơ đồ khớp bảng (LPS là Loan Pricing, DRG là Debt Register, cấu hình biểu phí ở PDC); ví dụ tính lãi theo 30/360 với khoản vay của chị Lan (kỳ 2: 256,221, bản cũ dùng /365 và sai số học); số liệu EOM khớp Ch.8 (300 ms/tài khoản, 16 partition, khoảng 6.25 giờ cho 1.2 triệu tài khoản); ngày canh gác `AccountParameter.validTo` là 3000-01-01 theo Ch.8 (bản cũ ghi 3333-01-01); bốn cụm PostgreSQL cộng testdb; bỏ tham chiếu `.claude/rules/` và chú thích `verified:` |
| Phụ lục C | mechanical + sửa ví dụ PMT | Phần còn lại chưa kiểm tra |
| Phụ lục D | **edited** | Phiên 7. Viết lại theo văn bản còn hiệu lực đến 11/2026: phân loại nợ theo Thông tư 31/2024/TT-NHNN (nhóm 2 là 10-90 ngày; bản cũ ghi 11-30) và dự phòng theo Nghị định 86/2024/NĐ-CP; tỷ lệ an toàn vốn 9% theo Thông tư 23/2020/TT-NHNN; Luật Bảo vệ dữ liệu cá nhân 2025 thay Nghị định 13/2023; Open API theo Thông tư 64/2024 (không phải 15/2022); nhắc nợ: không liên hệ người không có nghĩa vụ trả nợ (bản cũ ghi "tối đa 3 lần/ngày"); bỏ "trần APR 24% năm 2024" không có thật và "AWS/Azure/GCP có region Việt Nam"; khung quốc tế sửa theo Ch.14 |
| Cách đọc, Về cuốn sách, 5 trang giới thiệu phần, Phụ lục index, Công cụ | edited (mới) | Có bản EN |

Bản tiếng Anh: giao diện, trang chủ, Cách đọc, Về cuốn sách, 5 trang giới thiệu phần, trang phụ lục, Công cụ. Các chương hiển thị tiếng Việt kèm thông báo "chưa dịch".

## Quyết định quan trọng (không đảo ngược nếu không có lý do)

0. Chạy local ở gốc `http://localhost:3000/` (`baseUrl` mặc định `/`); GitHub Pages đặt `BASE_URL` qua workflow.
1. Website nằm trong `book-v1/website/`; bản thảo gốc không bị sửa. Git repo đặt trong `website/` và chỉ chứa thư mục này; workflow là `website/.github/workflows/deploy.yml` (bản sao ở `website/deploy/deploy.yml` nếu công cụ không ghi được vào `.github`). `docs-internal/` không commit (`.gitignore`). Nếu repo public, bỏ comment hai dòng `docs/reference/` và `scripts/entities.json` trong `.gitignore`.
2. Giữ thứ tự và số chương của bản thảo; gom thành 5 phần (lý do: `BOOK_STRUCTURE.md`).
3. Ví dụ trung tâm giữ số liệu bản thảo: 18,500,000 VNĐ, 18%/năm, 12 tháng (không dùng bộ 30 triệu gợi ý trong prompt).
4. Ký hiệu số quốc tế: `18,500,000` và `1.5%`, thống nhất với code.
5. Mọi bảng, biểu đồ, công cụ về khoản vay lấy số từ `src/lib/loan.ts` để không lệch nhau. Quy tắc: r = năm/12, PMT HALF_UP đến đồng, lãi kỳ HALF_UP đến đồng, kỳ cuối khép dư nợ.
6. `.md` parse CommonMark, `.mdx` parse MDX (`markdown.format: 'detect'`). Chương biên tập tay dùng `.mdx` khi cần component.
7. Link nội bộ dùng URL `/docs/...` (không dùng đường dẫn file) để chạy được cả khi trang ở locale khác chưa dịch.
8. Chương đã biên tập tay phải được thêm vào `scripts/hand-edited.txt` để pipeline không ghi đè.
9. Ẩn danh hóa: giữ cơ quan quản lý, luật, chuẩn mực, công nghệ, tác giả học thuật, sự cố công khai đã ghi nhận; thay mọi doanh nghiệp, đối tác, định danh hệ thống gốc. Chi tiết: registry.
10. Các lỗi tính toán của bản thảo được sửa công khai bằng admonition "Đính chính so với bản thảo gốc".
11. Chương biên tập tay giữ đuôi `.md` và thêm `mdx: format: mdx` vào front matter khi cần component (công cụ ghi file không xóa được file cũ trên máy, nên không đổi đuôi). Ch.2 là ngoại lệ, đã là `.mdx` từ phiên 1.
12. Định danh kỹ thuật (module, bảng, class, mã phí) đổi theo mục `technical` trong `scripts/entities.json`. Tên mới đang dùng, ví dụ: LAS (quản lý tài khoản), LOS (khởi tạo khoản vay), LPS (định giá), DRG (sổ nợ), STS (sao kê), bảng `LAS_*`, `CurrentBalance`, `PostingUnit`, `BillingRun`, `RepaymentAllocationOrder`, mã phí `SVCFEE`, `ACCMAINT`, `LATEFEE1`. Trang biên tập tay mới phải dùng tên mới; chạy `scripts/apply_technical.py` cho file viết tay. Giữ nguyên thuật ngữ miền chung (Account, Transaction, Instalment, Tariff, Money), enum chung và tên method/field.
13. Font: Inter (Inter Variable) cho toàn bộ chữ, JetBrains Mono cho code. File `.woff2` (latin, latin-ext, vietnamese) nằm trong `src/fonts/`, khai báo ở `src/css/fonts.css`; không cần gói npm hay Google Fonts. `src/clientModules/fonts.ts` là file rỗng còn sót, không dùng.
14. Không có mục "Bản đồ chương" trong chương (sidebar và mục lục trong trang đã thể hiện). Pipeline tự bỏ; chương viết tay không thêm lại.
15. Callout sách (định nghĩa ở `src/theme/Admonition/Types.tsx`): `:::summary[Mục x.y]` cho tóm tắt mục; `::::story` (4 dấu hai chấm, để lồng được admonition khác) cho đoạn tình huống, câu chuyện của nhân vật; `:::key[Tên]` cho định nghĩa, công thức, nguyên tắc trọng tâm. Admonition thường (`note`, `info`, `caution`, `warning`) dùng cho ghi chú, phạm vi VLP, đính chính. Pipeline tự chuyển "Tóm tắt", "Tình huống/Câu chuyện/Dẫn nhập" và blockquote định nghĩa sang các callout này.
16. File `.md` cần component phải có front matter `mdx:\n  format: mdx` (khóa `format` ở cấp gốc không có tác dụng).
17. `src/clientModules/mermaidFix.ts` nạp `d3-transition` để sửa lỗi "tooltipElem.transition is not a function" khi rê chuột lên sơ đồ Mermaid. Không xóa.
18. Giao diện: thanh trên (logo, ô tìm kiếm ở giữa, chọn ngôn ngữ, nút "Bắt đầu đọc", đổi sáng/tối) và hàng tab (Đọc sách, Mục lục, Thuật ngữ, Phụ lục, Công cụ tính) trong `src/theme/Navbar`; header trang (nhóm, tiêu đề, `description` làm đoạn dẫn, dòng meta) trong `src/theme/DocItem/Content`; cột "Trên trang này" trong `src/theme/TOC`. Màu chủ đạo mint `#0b8a66` (tối: `#5fd3a8`). Mỗi trang mới nên có `description` trong front matter vì nó hiển thị làm đoạn dẫn.
19. Sidebar khai báo tay trong `sidebars.ts`: nhóm cố định (Bắt đầu, Phần I-V, Tra cứu), không thu gọn; trang tổng quan của mỗi phần có `sidebar_position: 0` và nhãn "Tổng quan". Icon lucide-react theo doc id trong `src/theme/DocSidebarItem/icons.ts`; trang mới cần thêm icon ở đây.
20. Tìm kiếm offline bằng `@easyops-cn/docusaurus-search-local` (vi, en), chỉ hoạt động trên bản build (`npm run build && npm run serve`), không hoạt động ở `npm start`.
21. Logo và favicon lấy từ ảnh chủ sở hữu gửi: `static/img/logo.png`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `social-card.png`. Các file `.svg` cũ còn trên máy không còn được dùng.
22. `package.json` có `overrides` để vá lỗ hổng trong công cụ build: `serialize-javascript ^7.1.4`, `tinypool ^2.2.0`, `uuid ^11.1.1`, `katex ^0.19.1` (đã build và chạy thử dev, Mermaid, KaTeX đều ổn). `npm audit` còn báo picomatch (ReDoS) qua chuỗi phụ thuộc của Docusaurus; chưa có bản vá, chỉ ảnh hưởng lúc build với pattern do dự án tự định nghĩa, không ảnh hưởng website tĩnh. Không chạy `npm audit fix --force` (sẽ hạ/đổi phiên bản Docusaurus).
23. Giọng văn (chỉ áp dụng cho lời văn, không sửa code minh họa): sách nói về VLP như một hệ thống đang vận hành. Trong lời văn không viết "đã ẩn danh hóa", "thông tin độc quyền", "hư cấu", "không phải dữ liệu production", "(verified: x.md)", "bản thảo gốc", "biên tập viên". Được phép nói "dữ liệu mô phỏng". Mọi thứ trong khối code (comment `// verified`, `illustrative`...) giữ nguyên. Với chương sinh tự động, `narrative_cleanup()` trong `scripts/transform.py` chỉ xử lý phần ngoài code fence; chương sửa tay phải tự tuân theo.
24. Khi biên tập tay một chương: không sửa khối code Java/SQL/cấu hình (kể cả comment); được sửa khối `text` chứa phép tính và số liệu khi số sai, và sơ đồ Mermaid. Lỗi trong khối code được giải thích bằng lời văn bên cạnh (ví dụ khoảng hiệu lực `validTo` ở Ch.3). Biểu đồ dùng `src/components/Charts/CostStackChart.tsx` (cột chồng) và `SeriesLineChart.tsx` (đường, cho vintage và chuỗi thời gian), dữ liệu truyền từ trang.

## Ánh xạ ẩn danh (tóm tắt)

Bảng ánh xạ đầy đủ (tên gốc sang tên hư cấu) chỉ nằm trong `scripts/entities.json` và `docs/reference/fictional-entities.md`, không ghi ở file này vì repo có thể public. Tên hư cấu đang dùng: Vela Finance, nền tảng VLP (Vela Lending Platform), Ngân hàng Đông Hải/Tây Đô/Bắc Sơn, Chợ Sao, DiCùng, Ví Mây, Ví Lam, QuetPay, Phố Mua, Kệ Hàng, Bình Minh Finance, Phương Nam Finance, Nordlane, Kiwipay, Lạc Hồng Motors.

## Build, test, deploy

| Kiểm tra | Kết quả phiên 1 |
|---|---|
| `npm run typecheck` | Pass |
| `npm run check:content` | Pass, 0 lỗi (70 file), gồm kiểm tra 160 mẫu định danh kỹ thuật cũ |
| `npm start` | Chạy ở `http://localhost:3000/` (đã kiểm tra trang chủ và Ch.2 trả 200) |
| Lỗi Mermaid khi rê chuột | Đã tái hiện khi bỏ bản sửa và xác nhận hết lỗi khi có bản sửa (dev và build), Ch.1, Ch.2 |
| `npm run build` (vi + en) | Pass, không cảnh báo broken link/anchor |
| Lỗi runtime trên trang chủ, Ch.1 (EN), Ch.2, Công cụ, Thuật ngữ | Không có (kiểm tra bằng headless Chrome) |
| GitHub Pages | Chưa deploy |

Lưu ý: cảnh báo KaTeX "Unrecognized Unicode character" bị tắt (`strict: false`) vì chữ tiếng Việt trong `\text{}` vẫn hiển thị đúng.

## Blockers và câu hỏi mở

1. **Deploy**: cần repository GitHub và bật Pages với source = GitHub Actions. Chưa thể xác minh deployment.
2. ~~Nghĩa của mã phí `SVCFEE`~~: đã thống nhất là phí dịch vụ của ACCMAINT ở Ch.3, 9, 12.
3. **Ghi tên tác giả**: `TOC.md` ghi tên tác giả bản thảo; website hiện không ghi tên. Cần chủ sở hữu quyết định.
4. **Mức ẩn danh còn lại**: tên method/field (`sourceTxCode`, `pairInstalments`...) vẫn giữ nguyên. Tên file tài liệu nội bộ trong comment (`verified: ...`) đã được lọc bỏ.
5. **`PRIORITY_ONLY`**: Ch.2 và Ch.8 bản thảo mâu thuẫn; Ch.2 hiện viết theo mô tả của Ch.8 (trừ phí phạt trước). Nếu cấu hình thật khác, sửa khung `:::key` trong Ch.2 mục 2.4.
6. Bản thảo không có lời giải bài tập.

## Bước tiếp theo (theo thứ tự)

1. ~~Biên tập Ch.3, Ch.4, Ch.5~~ (xong ở phiên 4).
2. ~~Biên tập Ch.8 và Ch.9~~ (xong ở phiên 5). Ghi chú: ví dụ Ch.9 giả định khoản trả khi chưa có kỳ trả nợ chỉ giảm dư nợ chịu lãi khi được ghép ở EOM (theo mô tả bản thảo); nếu cấu hình thật khác, sửa mục 9.2 và bước 3.3.
3. ~~Thêm công cụ "số tiền tất toán / trả trước hạn"~~ (xong ở phiên 5): `src/components/Loan/EarlySettlementCalculator.tsx`, hàm `earlySettlement()` trong `src/lib/loan.ts` (lãi phát sinh 30/360, phí % dư nợ gốc, so sánh với trả theo lịch), mục `#early-settlement` ở trang Công cụ (vi, en), liên kết từ Ch.2 Bài 1, Ch.3, Ch.5 mục 5.3, Ch.9. Heading id trong file `.mdx` dùng cú pháp `{/* #id */}`.
4. ~~Biên tập Ch.6, 7, 10~~ (xong ở phiên 6). Cùng phiên: `transform.py` và `check-content.mjs` xử lý cả dạng số nhiều của định danh kỹ thuật (`AccountItems`, `TariffItems`), sửa các chỗ còn sót ở Ch.3, 8, 9, 12.
5. ~~Biên tập Ch.11-16, Phụ lục A, D, Thuật ngữ, Lời mở đầu~~ (xong ở phiên 7). Ghi chú: `scripts/entities.json` (chỉ có ở máy cục bộ) đã bổ sung `SHOPEE_VN → CHOSAO_VN` và các mẫu cấm `shopee` (không còn `\b`), `zalo\s*pay`, `gojek`, `sea group`, `zalo`.
6. Sau mỗi chương: chạy `docs-internal/quality-checklist.md`, cập nhật bảng trên.
7. Dịch tiếng Anh các chương đã biên tập (Ch.1, Ch.2), đặt `lang: en`.
8. Phase 8: đọc lại toàn bộ theo thứ tự.
