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
| Lời mở đầu | mechanical | Cập nhật đoạn "Tại sao..." theo hệ sinh thái hư cấu, bỏ emoji ba lớp |
| Ch.1 | **edited** | Phiên 2. Số liệu đã kiểm lại bằng script (TVM, adverse selection, EL, bảng chi phí); làm rõ hai cách phân tách 18%; nhận định 2015-2018 chuyển thành nhận định chưa xác minh; sửa tham chiếu BIS |
| Ch.2 | **edited** | Pilot. Đã sửa 6 lỗi (xem PROJECT_AUDIT §4). Còn 1 điểm cần xác minh: `PRIORITY_ONLY` |
| Ch.3 | **edited** | Phiên 4. Sửa APR khoản vay có phí (28.5% → 35.7%), cơ chế subvention (chiết khấu khi giải ngân, 1,365,618 VNĐ), phân tích lợi ích của người bán theo lợi nhuận gộp, bẫy trả tối thiểu (85 tháng, không phải 10+ năm), lãi lỗ khoản vay (bỏ phí bảo hiểm thu hộ khỏi doanh thu, chi phí vốn theo dư nợ bình quân, biên 3.6%), cảnh báo về phép so sánh ROI retention. Nghĩa `SVCFEE` = phí dịch vụ của ACCMAINT. Hình 3.1 |
| Ch.4 | **edited** | Phiên 4. Sửa PMT các đề nghị 12/36 tháng, câu chuyện sofa (bỏ "0%" mâu thuẫn), chi phí của thiên kiến hiện tại (gồm cả lãi tiết kiệm bỏ lỡ), thêm giai đoạn 8 vào sơ đồ, câu hỏi 10 (APR 18%), bỏ các con số "nghiên cứu cho thấy" không nguồn |
| Ch.5 | **edited** | Phiên 4. Dựng lại báo cáo lãi lỗ cho nhất quán (lợi suất 28%, chi phí vốn khớp nguồn vốn ALM, NIM 20.2%, ROA 3.95%, ROE 19.75%), đối chiếu chi phí dự phòng với số dư dự phòng, sửa số liệu vintage và roll rate (tổng 10,530 tài khoản, hàng 91+), duration 11.9 tháng, kỳ hạn nguồn vốn 17.8 tháng, ví dụ trả trước. Hình 5.1 (SeriesLineChart) thay biểu đồ ASCII |
| Ch.6 | mechanical | Số cụm PostgreSQL cần đối chiếu |
| Ch.7 | mechanical | |
| Ch.8 | **edited** | Phiên 5. Sửa fence của thuật toán prescribing và pairing (code giữ nguyên, chỉ gộp vào một khối `java`), đưa đoạn lịch sử bất biến vào khối `text` và sửa mâu thuẫn "mọi thay đổi là INSERT", số dư ví dụ theo lịch trả nợ thật (gốc còn 14,180,104 sau 3 kỳ), thời gian EOM nhất quán (300 ms/tài khoản, 16 partition, khoảng 6.25 giờ), sơ đồ Mermaid cho BillingRun (Hình 8.2) và các bước EOM (Hình 8.3), nhãn write-off trong máy trạng thái theo tín hiệu DRG, sửa tài liệu đọc thêm (Minella 2019, Vernon chương 10) |
| Ch.9 | **edited** | Phiên 5. Dựng lại toàn bộ ví dụ chu kỳ billing cho nhất quán: kỳ 3 (20/2-19/3) của tài khoản hạn mức 18%/năm, 30/360, lãi 207,850, phí 140,000, MMI 1,800,000 (phí → lãi → gốc), số dư có 1,200,000, sao kê và mục "chỉ trả tối thiểu" (8 tháng, lãi 742,000) tính bằng script; bỏ ghi chú sửa 15%/365; sửa số dư khả dụng ở kịch bản trả đúng hạn; đổi tên "chị Minh" thành chị Thu |
| Ch.10 | mechanical | Lỗi fence đã sửa tự động |
| Ch.11 | mechanical | |
| Ch.12 | mechanical | Lỗi fence đã sửa tự động |
| Ch.13 | mechanical | Xung đột vai trò anh Minh; tiền USD |
| Ch.14 | mechanical | Nhiều tên doanh nghiệp đã thay; tài liệu đọc thêm cần xác minh |
| Ch.15 | mechanical | |
| Ch.16 | mechanical | |
| Thuật ngữ | mechanical + sửa APR | Định dạng mới (H3 cho từng thuật ngữ, link chương) |
| Phụ lục A | mechanical | |
| Phụ lục C | mechanical + sửa ví dụ PMT | Phần còn lại chưa kiểm tra |
| Phụ lục D | mechanical | Văn bản pháp luật cần xác minh hiệu lực |
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
2. **Nghĩa của mã phí `SVCFEE`**: Ch.3 và Ch.9 dùng nghĩa phí dịch vụ của ACCMAINT (phí quản lý tài khoản). Ch.12 bản thảo gọi là "interest fee"; sửa khi biên tập Ch.12.
3. **Ghi tên tác giả**: `TOC.md` ghi tên tác giả bản thảo; website hiện không ghi tên. Cần chủ sở hữu quyết định.
4. **Mức ẩn danh còn lại**: tên method/field (`sourceTxCode`, `pairInstalments`...) vẫn giữ nguyên. Tên file tài liệu nội bộ trong comment (`verified: ...`) đã được lọc bỏ.
5. **`PRIORITY_ONLY`**: Ch.2 và Ch.8 bản thảo mâu thuẫn; Ch.2 hiện viết theo mô tả của Ch.8 (trừ phí phạt trước). Nếu cấu hình thật khác, sửa khung `:::key` trong Ch.2 mục 2.4.
6. Bản thảo không có lời giải bài tập.

## Bước tiếp theo (theo thứ tự)

1. ~~Biên tập Ch.3, Ch.4, Ch.5~~ (xong ở phiên 4).
2. ~~Biên tập Ch.8 và Ch.9~~ (xong ở phiên 5). Ghi chú: ví dụ Ch.9 giả định khoản trả khi chưa có kỳ trả nợ chỉ giảm dư nợ chịu lãi khi được ghép ở EOM (theo mô tả bản thảo); nếu cấu hình thật khác, sửa mục 9.2 và bước 3.3.
3. ~~Thêm công cụ "số tiền tất toán / trả trước hạn"~~ (xong ở phiên 5): `src/components/Loan/EarlySettlementCalculator.tsx`, hàm `earlySettlement()` trong `src/lib/loan.ts` (lãi phát sinh 30/360, phí % dư nợ gốc, so sánh với trả theo lịch), mục `#early-settlement` ở trang Công cụ (vi, en), liên kết từ Ch.2 Bài 1, Ch.3, Ch.5 mục 5.3, Ch.9. Heading id trong file `.mdx` dùng cú pháp `{/* #id */}`.
4. Tiếp tục Ch.6, 7, 10, rồi 11-16, rồi Phụ lục A, D, Thuật ngữ, Lời mở đầu.
5. Sau mỗi chương: chạy `docs-internal/quality-checklist.md`, cập nhật bảng trên.
6. Dịch tiếng Anh các chương đã biên tập (Ch.1, Ch.2), đặt `lang: en`.
7. Phase 8: đọc lại toàn bộ theo thứ tự.
