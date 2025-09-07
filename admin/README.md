# TOEIC Admin Dashboard

Hệ thống quản lý đề thi TOEIC được xây dựng bằng React + Vite + TypeScript với TailwindCSS và shadcn/ui.

## 🚀 Tính năng

### ✅ Đã hoàn thành
- **Xác thực người dùng**: Đăng nhập, đăng ký với form validation
- **Dashboard**: Hiển thị thống kê cơ bản về đề thi và thí sinh
- **Quản lý đề thi**:
  - Danh sách đề thi với tìm kiếm và lọc
  - Tạo đề thi mới với giao diện trực quan
  - Cào đề thi từ website (UI demo)
- **Layout responsive**: Sidebar thu gọn trên mobile
- **UI Components**: Sử dụng shadcn/ui với theme tùy chỉnh
- **State management**: Zustand với persist storage
- **Routing**: React Router v6 với layout nested

### 🔄 Đang phát triển
- API integration với backend
- Upload file audio/hình ảnh
- Rich text editor cho nội dung câu hỏi
- Export đề thi ra PDF/Word
- Quản lý thí sinh và kết quả thi

## 🛠 Công nghệ sử dụng

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📁 Cấu trúc thư mục

```
src/
├── components/         # Component tái sử dụng
│   └── ui/            # shadcn/ui components
├── layouts/           # Layout components
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
├── pages/             # Các trang chính
│   ├── auth/          # Đăng nhập, đăng ký
│   ├── dashboard/     # Trang chủ admin
│   └── exams/         # Quản lý đề thi
│       ├── list/      # Danh sách đề thi
│       ├── create/    # Tạo đề thi
│       └── crawl/     # Cào đề thi
├── store/             # Zustand stores
├── types/             # TypeScript interfaces
├── constants/         # Hằng số (colors, data mẫu)
├── utils/             # Helper functions
├── lib/               # Utility libraries
└── router/            # React Router config
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- pnpm (hoặc npm/yarn)

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd admin

# Cài đặt dependencies
pnpm install

# Chạy development server
pnpm run dev

# Build production
pnpm run build

# Preview build
pnpm run preview
```

### Development server
```bash
pnpm run dev
```
Truy cập http://localhost:5173

## 🎨 Theme và Colors

Project sử dụng color scheme được định nghĩa trong `src/constants/Colors.ts`:

- **Primary**: Brand Coral (#ff776f)
- **Secondary**: Warm Gray palette
- **Success**: #10b981
- **Warning**: #f59e0b  
- **Error**: #ef4444
- **Info**: #3b82f6

Theme colors được tích hợp vào TailwindCSS config và có thể sử dụng như:
```tsx
<div className="bg-brand-coral-500 text-white">
<Button variant="default">Primary Button</Button>
```

## 📝 Sử dụng

### 1. Đăng nhập
- Truy cập `/auth/login`
- Sử dụng email/password bất kỳ (mock authentication)
- Hoặc đăng ký tài khoản mới tại `/auth/register`

### 2. Dashboard
- Xem thống kê tổng quan
- Quick actions để tạo đề thi mới

### 3. Quản lý đề thi
- **Danh sách**: `/exams/list` - Xem, tìm kiếm, lọc đề thi
- **Tạo mới**: `/exams/create` - Tạo đề thi với 7 phần TOEIC
- **Cào đề**: `/exams/crawl` - UI demo cho tính năng cào đề thi

### 4. Tạo đề thi
- Form wizard với 7 phần TOEIC chuẩn
- Dynamic form với thêm/xóa nhóm câu hỏi
- Validation và preview câu hỏi
- Upload audio/hình ảnh (UI ready)

## 🔧 Customization

### Thêm component mới
```bash
# Tạo component trong src/components/ui/
# Follow shadcn/ui pattern
```

### Thêm page mới
```bash
# 1. Tạo component trong src/pages/
# 2. Thêm route trong src/router/index.tsx
# 3. Thêm navigation trong src/layouts/DashboardLayout.tsx
```

### Thêm store mới
```bash
# Tạo store trong src/store/ theo pattern Zustand
```

## 🐛 Troubleshooting

### Lỗi build
```bash
# Clear cache và reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Lỗi TailwindCSS
```bash
# Restart dev server
pnpm run dev
```

### TypeScript errors
```bash
# Check tsconfig và path aliases
pnpm run type-check
```

## 📄 License

MIT License

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes  
4. Push to branch
5. Create Pull Request

## 📞 Hỗ trợ

- Email: support@example.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]