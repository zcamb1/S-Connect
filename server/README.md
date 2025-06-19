# WebDemo Server

Backend server cho ứng dụng WebDemo, sử dụng Node.js, Express và SQLite.

## 🚀 Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Tái tạo database từ đầu

Nếu bạn muốn tạo database mới (hoặc database bị mất):

```bash
# Bước 1: Khởi tạo database và tạo bảng + dữ liệu mẫu
node initDatabase.js

# Bước 2: Thêm comment mẫu 
node seedComments.js

# Bước 3: Kiểm tra database đã được tạo đúng chưa
node checkSchema.js
```

### 3. Chạy server
```bash
npm start
# hoặc với nodemon (development)
npm run dev
```

## 📁 Cấu trúc file

- `index.js` - Main server file
- `database.sqlite` - SQLite database file
- `initDatabase.js` - Script khởi tạo database từ đầu
- `seedComments.js` - Script thêm dữ liệu comment mẫu  
- `checkSchema.js` - Script kiểm tra cấu trúc database
- `deleteComments.js` - Script xóa comments (utility)
- `testAPI.js` - Script test các API endpoints
- `uploads/` - Thư mục chứa file upload

## 🗄️ Database Schema

### Tables:
- `users` - Thông tin người dùng
- `posts` - Bài viết
- `comments` - Bình luận (hỗ trợ nested comments)
- `mentions` - Thông tin tag người dùng trong comment

## 🔧 Scripts hữu ích

```bash
# Kiểm tra cấu trúc database
node checkSchema.js

# Reset toàn bộ database 
node initDatabase.js && node seedComments.js

# Xóa tất cả comments
node deleteComments.js

# Test API endpoints
node testAPI.js
```

## 📝 API Endpoints

- `GET /api/posts/:postId/comments` - Lấy comments của post
- `POST /api/posts/:postId/comments` - Tạo comment mới
- `GET /api/posts/comment-counts` - Lấy số lượng comment của posts
- `POST /api/posts/:postId/comments/:commentId/reply` - Reply comment

## 🛠️ Development

Database file `database.sqlite` được commit trong repo để tiện development. 
Trong production, nên tạo database mới bằng scripts provided. 