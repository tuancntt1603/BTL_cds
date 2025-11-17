# Ứng dụng Đổi đồ cũ – Tái sử dụng

Ứng dụng web trao đổi đồ cũ, tái sử dụng và bảo vệ môi trường với đầy đủ tính năng hiện đại.

## ✨ Tính năng đã hoàn thành

### 🟢 1. Đăng & Quản lý món đồ cũ (Marketplace)
- ✅ Đăng món đồ mới với tiêu đề, mô tả, tình trạng, danh mục, nhiều hình ảnh, vị trí
- ✅ Sửa / Xóa món đồ đã đăng
- ✅ Quản lý các món đồ đã đăng
- ✅ Hỗ trợ nhiều hình ảnh (lưu dưới dạng JSON array)

### 🟡 2. Tìm kiếm & Lọc thông minh
- ✅ Tìm kiếm theo từ khóa (tiêu đề, mô tả)
- ✅ Lọc theo danh mục (quần áo, nội thất, điện tử, sách…)
- ✅ Lọc theo khu vực / thành phố
- ✅ Lọc theo hình thức giao dịch (đổi/tặng/bán)
- ✅ Sắp xếp theo: mới nhất, cũ nhất, lượt xem, giá

### 🟣 3. Đổi – Tặng – Mua (3 hình thức giao dịch)
- ✅ Đổi đồ 1-1: yêu cầu đổi đồ với người khác
- ✅ Tặng đồ miễn phí: người dùng đăng đồ để tặng
- ✅ Bán giá rẻ: giống chợ đồ cũ giá rẻ

### 🔵 4. Chat trực tiếp giữa người dùng
- ✅ Chat riêng khi muốn đổi đồ
- ✅ Gửi hình ảnh món đồ trong chat
- ✅ Trạng thái tin nhắn: đã gửi / đã xem
- ✅ Danh sách cuộc trò chuyện

### 🟢 5. Quét mã QR khi giao dịch
- ✅ Mỗi món đồ có 1 QR code unique
- ✅ Quét QR để xem thông tin đồ
- ✅ QR code cho giao dịch để xác nhận
- ✅ Lưu lịch sử giao dịch tự động

### 🟤 6. Đánh giá – Bình luận người dùng
- ✅ Sau mỗi giao dịch, người dùng đánh giá uy tín (1-5 sao)
- ✅ Điểm uy tín được hiển thị trong hồ sơ
- ✅ Xem đánh giá của người dùng khác
- ✅ Hệ thống tính điểm uy tín tự động

### 🟠 7. Quản lý tài khoản người dùng
- ✅ Đăng nhập bằng Email / Mật khẩu
- ✅ Hồ sơ cá nhân với thông tin đầy đủ
- ✅ Lịch sử món đã đăng
- ✅ Lịch sử giao dịch đã hoàn thành
- ✅ Quản lý đồ yêu thích

### 🟢 8. Yêu thích (Bookmark)
- ✅ Lưu lại món đồ yêu thích
- ✅ Xem danh sách đồ yêu thích
- ✅ Nút yêu thích trên mỗi card đồ

### 🔵 9. Thông báo (Notification)
- ✅ Thông báo khi có người muốn đổi đồ
- ✅ Thông báo chat mới
- ✅ Thông báo giao dịch được xác nhận
- ✅ Hiển thị số lượng thông báo chưa đọc

## 🚀 Công nghệ sử dụng

- **Next.js 14** - Framework React với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling hiện đại
- **Prisma** - ORM cho database
- **SQLite** - Database (có thể chuyển sang PostgreSQL/MySQL cho production)
- **Lucide React** - Icon library

## 📦 Cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Tạo database và generate Prisma client:**
```bash
npx prisma generate
npx prisma db push
```

3. **Chạy ứng dụng:**
```bash
npm run dev
```

4. **Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)**

## 📁 Cấu trúc dự án

```
app/
  ├── api/              # API routes
  │   ├── auth/         # Đăng nhập/đăng ký
  │   ├── items/        # CRUD đồ
  │   ├── favorites/    # Yêu thích
  │   ├── reviews/      # Đánh giá
  │   ├── messages/     # Chat
  │   ├── transactions/ # Giao dịch
  │   ├── notifications/# Thông báo
  │   └── qr/           # QR code
  ├── auth/             # Trang đăng nhập/đăng ký
  ├── items/            # Trang danh sách, chi tiết, đăng, sửa đồ
  ├── chat/             # Trang chat
  ├── favorites/        # Trang yêu thích
  ├── transactions/     # Trang giao dịch
  ├── profile/          # Trang hồ sơ
  └── qr/               # Trang xem QR code
components/              # React components
  ├── Header.tsx        # Header với navigation
  ├── Footer.tsx        # Footer
  ├── ItemCard.tsx     # Card hiển thị đồ
  ├── QRCodeDisplay.tsx # Hiển thị QR code
  └── NotificationBell.tsx # Thông báo
lib/                    # Utilities
  └── prisma.ts         # Prisma client
prisma/                 # Database schema
  └── schema.prisma     # Schema định nghĩa models
```

## 🗄️ Database Schema

- **User**: Người dùng với thông tin đầy đủ, điểm uy tín
- **Item**: Đồ với nhiều hình ảnh, QR code, vị trí
- **Exchange**: Yêu cầu đổi đồ
- **Transaction**: Giao dịch với QR code
- **Favorite**: Đồ yêu thích
- **Review**: Đánh giá người dùng
- **Message**: Tin nhắn chat
- **Notification**: Thông báo

## 🎯 Tính năng chuyển đổi số nổi bật

- ✅ **Số hóa đồ cũ**: Đăng online thay vì chợ truyền thống
- ✅ **Kết nối người dân**: Bằng chat và QR Code
- ✅ **Lưu trữ dữ liệu**: Trên database với Prisma
- ✅ **QR Code**: Mỗi đồ có QR code để quét và xác nhận

## 📝 Lưu ý

- Ứng dụng sử dụng localStorage để lưu thông tin đăng nhập (có thể nâng cấp lên session management sau)
- Hình ảnh hiện tại sử dụng link URL (có thể tích hợp upload file với Firebase/Cloud Storage sau)
- Database SQLite phù hợp cho development, nên chuyển sang PostgreSQL cho production
- QR Code được tạo tự động khi đăng đồ mới
- Thông báo tự động được tạo khi có giao dịch mới, chat mới

## 🔮 Tính năng có thể mở rộng

- [ ] Upload hình ảnh trực tiếp (Firebase Storage)
- [ ] Đăng nhập bằng Google/Facebook
- [ ] Bản đồ Google Maps để hiển thị vị trí
- [ ] AI Recommender để gợi ý đồ phù hợp
- [ ] Admin Dashboard để quản lý người dùng và bài đăng
- [ ] Thanh toán online (nếu mở rộng)
- [ ] WebSocket cho chat real-time
- [ ] Push notifications

## 👨‍💻 Phát triển

Để phát triển thêm tính năng:

1. Cập nhật Prisma schema nếu cần thêm model
2. Chạy `npx prisma db push` để cập nhật database
3. Tạo API routes trong `app/api/`
4. Tạo UI components và pages

## 📄 License

MIT
