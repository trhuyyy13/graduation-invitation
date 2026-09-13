# Thiệp mời tốt nghiệp — Huy Trần 🎓

Website thiệp mời tốt nghiệp cá nhân hoá, xây cho lễ tốt nghiệp của **Trần Quang Huy**, sinh viên Đại học Bách khoa Hà Nội (HUST), diễn ra ngày **26/09/2026**.

Mỗi khách mời có một đường link riêng (`/ten-khach-moi`), hiển thị lời mời được cá nhân hoá theo tên và cách xưng hô với từng người.

## ✨ Tính năng

- **Thiệp mời cá nhân hoá** theo từng khách, kèm hiệu ứng cuộn mượt.
- **Đếm ngược thời gian tốt nghiệp** — tự động cập nhật theo giờ/ngày được set trong trang quản trị.
- **Thông tin thời gian – địa điểm – liên hệ**, có nút chỉ đường Google Maps.
- **Lưu bút** — khách mời có thể để lại lời nhắn, lưu vào database.
- **Trang quản trị (`/admin`)** — quản lý danh sách khách mời, xem/xoá lưu bút, chỉnh sửa thời gian/địa điểm sự kiện, bảo vệ bằng mật khẩu riêng.

## 🛠️ Công nghệ sử dụng

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) — giao diện
- [Framer Motion](https://www.framer.com/motion/) — hiệu ứng chuyển động
- [Supabase](https://supabase.com/) — cơ sở dữ liệu (Postgres) lưu khách mời, lưu bút, cấu hình sự kiện
- Triển khai trên [Vercel](https://vercel.com/)

## 🚀 Chạy thử ở máy local

**Cách 1 — dùng Docker (khuyến nghị, không cần cài Node):**

```bash
docker compose up
```

Truy cập `http://localhost:3100`.

**Cách 2 — chạy trực tiếp bằng npm:**

```bash
npm install
npm run dev
```

Truy cập `http://localhost:3000`.

Cần tạo file `.env.local` với các biến môi trường: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_PASSWORD` (lấy từ Vercel project qua `vercel env pull`).

## 📦 Triển khai

Dự án được deploy tự động qua Vercel, gắn với domain `graduation-invitation.huytrn13.id.vn`.

## 📄 Bản quyền

© 2026 **Trần Quang Huy (Huy Trần)**. Mọi quyền được bảo lưu.

Đây là dự án cá nhân, phục vụ cho lễ tốt nghiệp của tác giả. Mã nguồn được chia sẻ công khai để tham khảo; vui lòng liên hệ tác giả trước khi sao chép, chỉnh sửa để dùng cho mục đích thương mại hoặc phát tán lại dưới tên khác.
