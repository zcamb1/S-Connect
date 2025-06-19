# S-Connect - Company Internal Social Platform

Nền tảng mạng xã hội nội bộ công ty được xây dựng với React.js, Node.js và SQLite.

## 🚀 Tính năng

- ✅ **Đăng nhập an toàn** với JWT authentication
- ✅ **Giao diện hiện đại** thiết kế theo chuẩn Facebook
- ✅ **Đăng bài viết** với text và hình ảnh
- ✅ **Tương tác xã hội** - Like, Comment, Share
- ✅ **Tin tức công ty** hàng ngày
- ✅ **Sách hay nên đọc** và giới thiệu
- ✅ **Sự kiện công ty** - 8/3, 20/10, hoạt động bộ phận
- ✅ **Quản lý hồ sơ** cá nhân
- ✅ **Responsive design** cho mọi thiết bị

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** với TypeScript
- **Tailwind CSS** cho styling
- **Axios** cho API calls
- **React Router** cho navigation

### Backend
- **Node.js** với Express
- **SQLite** database
- **JWT** authentication
- **bcryptjs** cho password hashing

## 📦 Cài đặt và Chạy ứng dụng

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd s-connect
```

### Bước 2: Cài đặt dependencies
```bash
# Cài đặt dependencies cho root project
npm install

# Cài đặt dependencies cho backend
cd server
npm install

# Cài đặt dependencies cho frontend
cd ../client
npm install
```

### Bước 3: Cấu hình environment (tùy chọn)
Tạo file `.env` trong thư mục `server`:
```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
```

### Bước 4: Chạy ứng dụng

#### Chạy cả Frontend và Backend cùng lúc (Khuyến nghị):
```bash
# Từ thư mục root
npm run dev
```

#### Hoặc chạy riêng biệt:

**Backend:**
```bash
cd server
npm run dev
# Server sẽ chạy tại http://localhost:3001
```

**Frontend:**
```bash
cd client
npm start
# React app sẽ chạy tại http://localhost:3000
```

## 👤 Tài khoản Demo

Ứng dụng đã được tạo sẵn các tài khoản demo:

| Username | Password | Vai trò |
|----------|----------|---------|
| `admin` | `123456` | Quản trị viên |
| `john.doe` | `123456` | Marketing Manager |
| `jane.smith` | `123456` | HR Director |

## 📱 Hướng dẫn sử dụng

### 1. Đăng nhập
- Mở trình duyệt và truy cập `http://localhost:3000`
- Sử dụng một trong các tài khoản demo ở trên
- Nhấn **"Đăng nhập"**

### 2. Tạo bài viết
- Nhấp vào ô **"Bạn đang nghĩ gì?"**
- Nhập nội dung bài viết
- Nhấn **"Đăng"** để xuất bản

### 3. Tương tác với bài viết
- **Like**: Nhấp biểu tượng ❤️
- **Comment**: Nhấp "Bình luận" (đang phát triển)
- **Share**: Nhấp "Chia sẻ" (đang phát triển)

### 4. Điều hướng
- **Sidebar trái**: Điều hướng chính (Trang chủ, Hồ sơ, Sự kiện...)
- **Sidebar phải**: Sự kiện sắp tới, bạn bè online, sinh nhật

## 🔧 Cấu trúc thư mục

```
s-connect/
├── client/                 # Frontend React app
│   ├── public/
│   │   ├── components/     # React components
│   │   ├── index.css       # Tailwind CSS
│   │   ├── index.tsx       # Entry point
│   │   └── App.tsx         # Main app component
│   └── package.json
├── server/                 # Backend Node.js
│   ├── index.js           # Express server
│   ├── database.sqlite    # SQLite database (auto-generated)
│   └── package.json
└── package.json           # Root package with scripts
```

## 🗄️ Database Schema

### Users Table
```sql
- id (INTEGER PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT)
- full_name (TEXT)
- avatar (TEXT)
- bio (TEXT)
- created_at (DATETIME)
```

### Posts Table
```sql
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER)
- content (TEXT)
- image_url (TEXT)
- created_at (DATETIME)
```

### Likes Table
```sql
- id (INTEGER PRIMARY KEY)
- post_id (INTEGER)
- user_id (INTEGER)
- created_at (DATETIME)
```

### Comments Table
```sql
- id (INTEGER PRIMARY KEY)
- post_id (INTEGER)
- user_id (INTEGER)
- content (TEXT)
- created_at (DATETIME)
```

## 🚀 Triển khai Production

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Upload thư mục build/ lên hosting
```

### Backend (Heroku/Railway)
```bash
cd server
# Cấu hình environment variables
# Deploy theo hướng dẫn của platform
```

## 🛡️ Bảo mật

- JWT tokens với thời hạn 24h
- Password được hash với bcryptjs
- CORS được cấu hình cho cross-origin requests
- Input validation cho tất cả API endpoints

## 🔄 API Endpoints

### Authentication
- `POST /api/login` - Đăng nhập
- `GET /api/me` - Lấy thông tin user hiện tại

### Posts
- `GET /api/posts` - Lấy danh sách bài viết
- `POST /api/posts` - Tạo bài viết mới
- `POST /api/posts/:id/like` - Like/Unlike bài viết

### Comments
- `GET /api/posts/:id/comments` - Lấy comments của bài viết
- `POST /api/posts/:id/comments` - Thêm comment

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Liên hệ

Nếu có vấn đề gì, vui lòng tạo issue hoặc liên hệ team phát triển.

---

**Happy Connecting! 🎉** 