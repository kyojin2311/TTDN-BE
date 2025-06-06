# TodoBE - NestJS Todo API

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Kết nối MongoDB](#kết-nối-mongodb)
- [Cấu hình Firebase](#cấu-hình-firebase)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Tài liệu API & Swagger](#tài-liệu-api--swagger)
- [Import Postman](#import-postman)

---

## Giới thiệu

Đây là backend Todo List sử dụng NestJS, MongoDB và xác thực bằng Firebase (Google Login). Hỗ trợ quản lý Task, Label, xác thực bảo mật, phân quyền theo user.

## Yêu cầu hệ thống

- Node.js >= 16
- MongoDB >= 4.0 (local hoặc Atlas)
- Tài khoản Firebase (đã tạo project)

## Cài đặt

```bash
npm install
```

## Cấu hình môi trường

Tạo file `.env` ở thư mục gốc dự án, ví dụ:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/todo-app

# Firebase Config
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key

# App Config
PORT=3000
NODE_ENV=development
```

> **Lưu ý:**
>
> - Thông tin Firebase lấy từ file JSON khi tạo Service Account trên Firebase Console.
> - Private key phải giữ nguyên format, nếu copy vào `.env` cần thay dòng mới bằng `\n` hoặc dùng dấu nháy kép.

## Kết nối MongoDB

- Nếu dùng local: cài MongoDB Community, chạy service, dùng URI mặc định như trên.
- Nếu dùng MongoDB Atlas: thay `MONGODB_URI` bằng connection string của bạn.

## Cấu hình Firebase

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project → Project Settings → Service accounts
3. Nhấn "Generate new private key" để tải file JSON
4. Lấy các trường:
   - `project_id` → FIREBASE_PROJECT_ID
   - `client_email` → FIREBASE_CLIENT_EMAIL
   - `private_key` → FIREBASE_PRIVATE_KEY

## Chạy ứng dụng

```bash
npm run start:dev
```

Ứng dụng mặc định chạy ở: [http://localhost:3000](http://localhost:3000)

## Tài liệu API & Swagger

- Truy cập Swagger UI: [http://localhost:3000/api](http://localhost:3000/api)
- Lấy file OpenAPI JSON: [http://localhost:3000/api-json](http://localhost:3000/api-json)

## Import Postman

1. Truy cập [http://localhost:3000/api-json](http://localhost:3000/api-json) và lưu file JSON.
2. Mở Postman → Import → File → Chọn file JSON vừa lưu.
3. Postman sẽ tự động tạo collection với tất cả các endpoint.

## Liên hệ

- Nếu có vấn đề, vui lòng tạo issue hoặc liên hệ trực tiếp.

## Features

- Firebase Authentication integration
- CRUD operations for todo tasks
- MongoDB database integration
- Docker and Docker Compose support for deployment

## Tech Stack

- NestJS
- MongoDB
- Firebase Admin SDK
- Docker & Docker Compose

## Project Structure

```
todoBE/
├── src/
│   ├── auth/           # Firebase authentication
│   ├── tasks/          # Task management
│   ├── upload/         # File upload handling
│   └── common/         # Shared utilities
├── docker/            # Docker configuration
├── .env.example       # Environment variables template
└── docker-compose.yml # Docker compose configuration
```

## API Endpoints

### Authentication

- `POST /auth/login` - Login with Firebase token

### Tasks

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update task status

### File Upload

- `POST /upload` - Upload files to S3

## Task Schema

```typescript
{
  creator: string; // User ID from Firebase
  status: string; // DOING, DEMO, WAITING_REVIEW, DONE
  deadline: string; // ISO date string
  type: string; // BUG, FEATURE, IMPROVEMENT
  description: string;
  attachments: {
    // Array of uploaded files
    fileName: string;
    url: string;
  }
  [];
}
```

## License

MIT
