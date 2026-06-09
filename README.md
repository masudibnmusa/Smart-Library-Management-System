# 📚 Library Management System

A secure, role-based Library Management System built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. The system provides user authentication, role-based access control, book management, and persistent browser storage using `localStorage`.

---

## ✨ Features

| Feature | Description |
|----------|-------------|
| 🔐 User Authentication | Login and registration with email/password validation |
| 👥 Role-Based Access Control | Separate permissions for Admin and Member users |
| 📚 Book Management | Add, search, borrow, return, and delete books |
| 🛡️ Admin Protection | Add/Delete operations restricted to administrators |
| 💾 Persistent Storage | Books and users saved using LocalStorage |
| 📱 Responsive Design | Optimized for desktop, tablet, and mobile devices |

---

## 👤 User Roles

### 🛡️ Administrator

**Default Credentials**

```text
Email: admin@lib.com
Password: 1234
```

#### Permissions

- Add new books
- Delete books permanently
- View all books
- Search books
- Borrow books
- Return books

---

### 👨‍🎓 Member (Normal User)

#### Registration

Create an account using the registration form.

#### Permissions

- View all books
- Search books by title or author
- Borrow available books
- Return issued books

#### Restrictions

❌ Cannot add books

❌ Cannot delete books

---

## 📁 Project Structure

```text
library-system/
│
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive layout
├── script.js       # Application logic and data handling
└── README.md       # Project documentation
```

---

## 🚀 How to Run

1. Download the following files:

   - `index.html`
   - `style.css`
   - `script.js`

2. Place all files in the same folder.

3. Open:

```text
index.html
```

4. Start using the application.

> No server, package manager, or build process required.

---

## 🎮 Usage Guide

### First-Time Setup

1. Launch the application.
2. Log in using the administrator account:

```text
Email: admin@lib.com
Password: 1234
```

3. Begin adding books to the library.

---

### 👤 Registering Members

1. Click **Create Account**.
2. Enter:
   - Full Name
   - Email Address
   - Password
3. Click **Register Account**.
4. Log in using the newly created credentials.

---

## 📚 Managing Books

| Action | Instructions |
|---------|-------------|
| ➕ Add Book | Fill out the book form and click **Add Book** (Admin only) |
| 🔍 Search | Enter a title or author name in the search field |
| 📖 Borrow | Click **Borrow** on an available book |
| 🔄 Return | Click **Return** on an issued book |
| 🗑️ Delete | Click **Delete** on a book (Admin only) |

---

## 🛡️ Security Improvements

This version includes several security and usability enhancements:

| Issue | Improvement |
|---------|-------------|
| Missing user tracking | Added `currentUser` global state |
| Missing user display | Added user information display in header |
| Hidden admin actions | Delete button only visible to admins |
| Weak authorization | Function-level role checks in `addBook()` and `deleteBook()` |
| Logout issues | Clears `currentUser` on logout |
| Invalid input handling | Added `.trim()` validation on all user inputs |

---

## 💾 Data Storage

The application uses **LocalStorage** for data persistence.

### Storage Keys

| Key | Purpose |
|------|---------|
| `libraryBooks` | Stores all book records |
| `libraryUsers` | Stores registered user accounts |

### Book Object Example

```javascript
{
  id: 1699999999999,
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  year: "1925",
  isbn: "9780743273565",
  status: "Available"
}
```

### User Object Example

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "member"
}
```

> **Note:** Data persists between browser sessions but will be removed if LocalStorage or browser data is cleared.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 | Styling, Flexbox, Grid Layout, Variables |
| JavaScript (ES6) | Application logic and event handling |
| LocalStorage API | Persistent client-side storage |
| Font Awesome 6 | Icons and visual enhancements |

---

## 🌐 Browser Compatibility

Supported on all modern browsers:

- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari

### Requirements

- ES6 JavaScript support
- LocalStorage support

---

## ⚠️ Limitations

- Frontend-only application
- Passwords are stored in LocalStorage (not encrypted)
- No backend database
- No password recovery system
- No multi-device synchronization
- No activity or borrowing history

---

## 🔮 Future Enhancements

- [ ] Password hashing and encryption
- [ ] Backend database integration
- [ ] User profile management
- [ ] Borrowing history tracking
- [ ] Book cover image support
- [ ] Due dates and overdue notifications
- [ ] Export/Import data
- [ ] Multi-library support
- [ ] Dark mode theme
- [ ] Advanced filtering and sorting

---

## 👨‍💻 Author

**Masud Ibn Musa**

Developed using HTML, CSS, JavaScript, and LocalStorage.

---

## 📜 License

This project is open-source and available for personal, educational, and commercial use.

Feel free to use, modify, and distribute it as needed.