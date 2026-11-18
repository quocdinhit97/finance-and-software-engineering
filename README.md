# Kiến trúc tín dụng: website

Website Docusaurus 3.10.2 của cuốn sách *Kiến trúc tín dụng: hệ thống tài chính tiêu dùng, từ kinh tế học đến mã nguồn*.

## Chạy local

Yêu cầu Node.js 20 trở lên.

```bash
cd website
npm install
npm start              # tiếng Việt, http://localhost:3000/
npm run start:en       # bản tiếng Anh
```

`npm start` chỉ chạy một locale và không có ô tìm kiếm (chỉ mục tìm kiếm được tạo khi build). Lần chạy đầu cần `npm install` (khoảng 1-2 phút). Nếu cổng 3000 bận, dùng `npm start -- --port 3001`. Để xem cả hai locale và bộ chuyển ngôn ngữ, dùng `npm run build && npm run serve`.

## Build và kiểm tra

```bash
npm run typecheck      # TypeScript strict
npm run build          # build tĩnh cả hai locale vào ./build
npm run serve          # xem bản build
```

## Cấu trúc

```text
website/
├── docs/                   nội dung tiếng Việt (ngôn ngữ mặc định)
│   ├── introduction/       lời mở đầu, cách đọc, về cuốn sách
│   ├── foundations/        Phần I  (Ch.1-2)
│   ├── products/           Phần II (Ch.3-5)
│   ├── system/             Phần III (Ch.6-10)
│   ├── intelligence/       Phần IV (Ch.11-13)
│   ├── future/             Phần V  (Ch.14-16)
│   ├── glossary/           thuật ngữ
│   ├── appendices/         phụ lục A, C, D
│   ├── tools/              công cụ tính
├── i18n/en/                bản dịch tiếng Anh (giao diện, trang mở đầu, công cụ)
├── src/lib/loan.ts         toán khoản vay dùng chung cho mọi bảng, biểu đồ, công cụ
├── src/components/Loan/    biểu đồ và công cụ tính
├── src/theme/              wrapper hiển thị số chương, thời gian đọc, thông báo chưa dịch
├── scripts/                pipeline chuyển đổi và kiểm tra
├── docs-internal/          tài liệu quản lý dự án (không xuất bản)
└── PROGRESS.md             tiến độ, nguồn sự thật cho các phiên làm việc (không xuất bản)
```
