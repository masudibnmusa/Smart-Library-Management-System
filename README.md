# 📚 Library Management System

A secure, role-based Library Management System with a **Node.js/Express backend API** and a **vanilla JavaScript frontend**.

---

## 🏗️ Architecture

```text
┌─────────────┐      REST API (JSON)      ┌─────────────┐
│  Frontend   │  ←────────────────────→  │   Backend   │
│ (HTML/CSS/  │     JWT Bearer Token      │ (Node.js/   │
│    JS)      │                          │  Express)   │
└─────────────┘                          └─────────────┘
        │
        ▼
┌─────────────┐
│ PostgreSQL  │
│   (Prisma)  │
└─────────────┘
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 User Authentication | Register/login with JWT tokens and bcrypt password hashing |
| 👥 Role-Based Access Control | Admin and Member roles with different permissions |
| 📚 Book Management | Add, search, borrow, return, and delete books |
| 🛡️ Ownership Protection | Only borrower or admin can return a book |
| 🔒 Admin Protection | Server-side enforcement for sensitive actions |
| 💾 Persistent Storage | PostgreSQL database with Prisma ORM |
| 👨‍👩‍👧‍👦 Concurrent Users | Multiple users supported simultaneously |
| 📱 Responsive Design | Works across desktop and mobile devices |

---

## 👤 User Roles

### 🛡️ Administrator

- **Email:** `admin@lib.com`
- **Password:** `1234` (set via `.env` or seed script)

#### Permissions
- Add new books
- Delete books permanently
- View all books
- Borrow/return any book

---

### 👨‍🎓 Member

#### Registration
Users can register via the sign-up form.

#### Permissions
- View all books
- Search books
- Borrow available books
- Return only their borrowed books
- View book status

#### Restrictions
❌ Cannot add books  
❌ Cannot delete books  
❌ Cannot return others' books  

---

## 🧰 Tech Stack

| Layer | Technology |
|------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript, FontAwesome |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcryptjs |
| Validation | express-validator |

---

## 📁 Project Structure

```text
library-system/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── bookController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── bookRoutes.js
│   │   ├── utils/
│   │   │   └── asyncHandler.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## 🚀 Quick Start

### 📌 Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

---

## 1️⃣ Backend Setup

```bash
cd backend
npm install

cp .env.example .env
# Configure database credentials in .env

npx prisma migrate dev --name init

npm run db:seed

npm run dev
```

Backend runs at:
```text
http://localhost:5000
```

---

## 2️⃣ Frontend Setup

```bash
cd frontend
```

### Option 1: Open directly
```text
open index.html
```

### Option 2: Live Server
```bash
npx serve .
```

Frontend runs at:
```text
http://localhost:3000
```

---

## 🔗 API Configuration

In `frontend/script.js`:

```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## ⚙️ Environment Variables

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://user:password@localhost:5432/library_db?schema=public"

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@lib.com
ADMIN_PASSWORD=1234
```

---

## 🔌 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Create account |
| POST | /api/auth/login | Public | Login user |
| GET | /api/auth/me | Private | Get current user |

---

### 📚 Books

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/books | Private | Get all books |
| POST | /api/books | Admin | Add book |
| DELETE | /api/books/:id | Admin | Delete book |
| POST | /api/books/:id/borrow | Private | Borrow book |
| POST | /api/books/:id/return | Owner/Admin | Return book |
| GET | /api/books/my-borrows | Private | My borrow history |

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt (10 rounds) |
| Authentication | JWT tokens |
| Authorization | Role-based middleware |
| Ownership Check | Server-side validation |
| Input Validation | express-validator |
| SQL Protection | Prisma ORM |
| CORS | Configured for frontend |

---

## 🗄️ Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  borrows   BorrowRecord[]
  createdAt DateTime @default(now())
}

model Book {
  id        Int      @id @default(autoincrement())
  title     String
  author    String
  year      String
  isbn      String   @unique
  status    Status   @default(AVAILABLE)
  borrows   BorrowRecord[]
}

model BorrowRecord {
  id         Int      @id @default(autoincrement())
  userId     Int
  bookId     Int
  borrowedAt DateTime @default(now())
  returnedAt DateTime?
}
```

---

## 🎨 Frontend Features

- Auto-login using JWT (localStorage)
- Role-based UI rendering
- Admin-only controls
- Real-time API search
- Borrower visibility system
- Conditional button rendering

---

## 🚀 Deployment

### Backend (Railway / Render / Heroku)

```bash
npm install && npx prisma migrate deploy && npm run db:seed
npm start
```

### Frontend (Vercel / Netlify / GitHub Pages)

- Static deployment supported
- Update `API_URL`
- Enable backend CORS

---

## 🧯 Troubleshooting

| Issue | Fix |
|------|-----|
| Cannot load books | Check backend is running |
| CORS error | Fix CLIENT_URL in .env |
| DB not found | Run Prisma migration |
| Admin login fails | Run seed script |
| Token expired | Re-login |

---

## 📜 License

Open source — free to use, modify, and distribute.

---

## 👨‍💻 Author

**Masud Ibn Musa**

Built with Node.js, Express, PostgreSQL, and Vanilla JavaScript.
```