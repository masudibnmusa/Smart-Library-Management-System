# 📚 Library Management System

A simple, browser-based Library Management System that allows users to add, search, borrow, and return books. All data is persisted locally using `localStorage`.

---

## ✨ Features

### ➕ Add Books
Register new books with:
- Title
- Author
- Publication Year
- ISBN Number

### 🔍 Search Books
Quickly find books by:
- Title
- Author

### 📖 Borrow & Return
Manage book availability:
- Borrow available books
- Return issued books
- View current status instantly

### 🗑️ Delete Books
Remove books from the collection with a confirmation prompt.

### 💾 Persistent Storage
All data is saved in the browser using `localStorage`, so your library remains available after refreshing the page.

### 📱 Responsive Design
Optimized for:
- Desktop
- Tablet
- Mobile Devices

---

## 🚀 Getting Started

### Prerequisites

- Google Chrome, Firefox, Safari, Edge, or any modern browser
- No installation or server setup required

### Installation

1. Clone or download the repository.
2. Open `index.html` in your browser.
3. Start managing your library.

```bash
git clone https://github.com/yourusername/library-management-system.git
cd library-management-system
```

Then simply open:

```text
index.html
```

---

## 🖼️ Application Features

| Feature | Description |
|----------|-------------|
| Add Book | Add a new book with title, author, year, and ISBN |
| Search | Search books instantly by title or author |
| Borrow | Mark a book as issued |
| Return | Mark a book as available again |
| Delete | Permanently remove a book from the collection |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure and semantic markup |
| CSS3 | Styling with Flexbox and Grid |
| Vanilla JavaScript | Application logic and DOM manipulation |
| localStorage | Persistent browser storage |
| Font Awesome 6 | Icons and UI enhancements |

---

## 📁 Project Structure

```text
library-management-system/
│
├── index.html      # Main application file
└── README.md       # Project documentation
```

> **Note:** This is a single-file application. All HTML, CSS, and JavaScript are embedded within `index.html` for simplicity and portability.

---

## 🔧 How It Works

### Data Model

Each book is stored as a JavaScript object:

```javascript
{
  id: 1699999999999,
  title: "Book Title",
  author: "Author Name",
  year: "2023",
  isbn: "1234567890",
  status: "Available"
}
```

### Local Storage

All books are stored under the following key:

```javascript
libraryBooks
```

Data is automatically loaded whenever the application starts.

---

## 🎮 Usage Guide

### ➕ Adding a Book

1. Fill in:
   - Title
   - Author
   - Publication Year
   - ISBN

2. Click **Add Book**

3. The book appears in the collection with an **Available** status.

---

### 🔍 Searching for Books

1. Enter a keyword in the search bar.
2. Press **Enter** or click **Search**.
3. Matching books will be displayed instantly.

---

### 📖 Borrowing a Book

1. Locate an available book.
2. Click the **Borrow** button.
3. The status changes to **Issued**.

---

### 🔄 Returning a Book

1. Locate an issued book.
2. Click the **Return** button.
3. The status changes back to **Available**.

---

### 🗑️ Deleting a Book

1. Click the **Delete** icon.
2. Confirm the deletion.
3. The book is permanently removed.

---

## 🎨 UI Design

| Element | Color | Hex Code |
|----------|--------|----------|
| Primary Header | Dark Blue | `#2c3e50` |
| Secondary Buttons | Blue | `#3498db` |
| Delete / Danger | Red | `#e74c3c` |
| Success / Available | Green | `#27ae60` |
| Borrow Button | Orange | `#f39c12` |
| Background | Light Gray | `#f4f4f4` |

---

## ⚠️ Limitations

- No backend database
- Storage limited by browser `localStorage` (~5–10 MB)
- No user authentication
- No data backup or synchronization
- No ISBN validation
- Single-user application
- No borrowing history

---

## 🔮 Future Enhancements

- [ ] Export library data as JSON
- [ ] Import library data from JSON
- [ ] ISBN-10 and ISBN-13 validation
- [ ] Book cover integration via APIs
- [ ] Due dates and overdue reminders
- [ ] User authentication system
- [ ] Multi-user support
- [ ] Sorting and filtering options
- [ ] Pagination for large collections
- [ ] Dark mode support

---

## 👨‍💻 Author

**Masud Ibn Musa**

Built using HTML, CSS, JavaScript, and localStorage.

---

## 📜 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this software for personal and commercial purposes.