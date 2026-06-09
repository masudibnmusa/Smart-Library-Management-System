// --- DATA STORAGE (LocalStorage) ---
let books = JSON.parse(localStorage.getItem('libraryBooks')) || [];
let users = JSON.parse(localStorage.getItem('libraryUsers')) || [];

// Migrate old books to new format (add borrowedBy/borrowedAt if missing)
books = books.map(book => ({
    ...book,
    borrowedBy: book.borrowedBy || null,
    borrowedAt: book.borrowedAt || null
}));

let currentUser = null;

// --- UI ELEMENTS ---
const authScreen = document.getElementById('auth-screen');
const loginView = document.getElementById('login-view');
const registerView = document.getElementById('register-view');
const systemInterface = document.getElementById('system-interface');

const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');

const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regError = document.getElementById('regError');

const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const yearInput = document.getElementById('yearInput');
const isbnInput = document.getElementById('isbnInput');
const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');

const roleBadge = document.getElementById('roleBadge');
const adminForm = document.getElementById('admin-form');

// ======================= 
// AUTHENTICATION FUNCTIONS 
// ======================= 

function switchToRegister() {
    loginView.style.display = 'none';
    registerView.style.display = 'block';
}

function switchToLogin() {
    registerView.style.display = 'none';
    loginView.style.display = 'block';
}

function attemptRegister() {
    const name = regName.value.trim();
    const email = regEmail.value.trim().toLowerCase();
    const password = regPassword.value;

    if (!name || !email || !password) {
        showError(regError, "Please fill in all fields.");
        return;
    }

    if (users.find(u => u.email === email)) {
        showError(regError, "Account with this email already exists!");
        return;
    }

    const newUser = { id: Date.now(), name, email, password, role: 'User' };
    users.push(newUser);
    localStorage.setItem('libraryUsers', JSON.stringify(users));

    alert("Registration Successful!");
    regName.value = '';
    regEmail.value = '';
    regPassword.value = '';
    switchToLogin();
}

function attemptLogin() {
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    if (email === "admin@lib.com" && password === "1234") {
        alert("Welcome, Administrator! You have full access.");
        loginUser({ name: "Administrator", email: "admin@lib.com", role: "Admin" });
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        alert("Welcome, " + user.name + "!");
        loginUser({ name: user.name, email: user.email, role: user.role });
    } else {
        showError(loginError, "Invalid Email or Password.");
    }
}

function showError(element, message) {
    element.innerText = message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 3000);
}

// ======================= 
// LOGIN & ROLE MANAGEMENT
// ======================= 

function loginUser(userObj) {
    currentUser = userObj;
    
    authScreen.style.display = 'none';
    systemInterface.style.display = 'block';
    
    const userDisplay = document.getElementById('userInfoDisplay');
    userDisplay.innerHTML = `
        <div class="user-avatar"><i class="fas fa-user"></i></div>
        <div>
            <strong>${userObj.name}</strong><br>
            <small style="color:var(--primary-color)">${userObj.role} Account</small>
        </div>
    `;

    if (userObj.role === 'Admin') {
        roleBadge.innerText = "Administrator";
        roleBadge.style.backgroundColor = "#e74c3c";
        adminForm.style.display = "grid";
    } else {
        roleBadge.innerText = "Member";
        roleBadge.style.backgroundColor = "#27ae60";
        adminForm.style.display = "none";
    }

    renderBooks(books); 
}

function logout() {
    currentUser = null;
    
    loginEmail.value = '';
    loginPassword.value = '';
    authScreen.style.display = 'flex';
    systemInterface.style.display = 'none';
}

// ======================= 
// BOOK SYSTEM LOGIC
// ======================= 

function addBook() {
    if (!currentUser || currentUser.role !== 'Admin') {
        alert('Access denied: Only administrators can add books.');
        return;
    }

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = yearInput.value.trim();
    const isbn = isbnInput.value.trim();

    if (title === '' || author === '' || year === '' || isbn === '') {
        alert('Please fill in all fields!');
        return;
    }

    const newBook = {
        id: Date.now(), 
        title, 
        author, 
        year, 
        isbn,
        status: 'Available',
        borrowedBy: null,
        borrowedAt: null
    };

    books.push(newBook);
    saveAndRender();
    
    titleInput.value = ''; 
    authorInput.value = ''; 
    yearInput.value = ''; 
    isbnInput.value = '';
}

function borrowBook(id) {
    if (!currentUser) {
        alert('Please log in to borrow books.');
        return;
    }
    
    const book = books.find(b => b.id === id);
    if (!book) return;
    
    if (book.status === 'Available') {
        book.status = 'Issued';
        book.borrowedBy = currentUser.email;
        book.borrowedAt = new Date().toLocaleString();
        saveAndRender();
    } else {
        alert('This book is already issued to someone else.');
    }
}

function returnBook(id) {
    if (!currentUser) {
        alert('Please log in to return books.');
        return;
    }
    
    const book = books.find(b => b.id === id);
    if (!book) return;
    
    // CRITICAL: Only borrower or admin can return
    if (book.borrowedBy !== currentUser.email && currentUser.role !== 'Admin') {
        alert('Access denied: Only the borrower or an admin can return this book.');
        return;
    }
    
    book.status = 'Available';
    book.borrowedBy = null;
    book.borrowedAt = null;
    saveAndRender();
}

function deleteBook(id) {
    if (!currentUser || currentUser.role !== 'Admin') {
        alert('Access denied: Only administrators can delete books.');
        return;
    }

    if (confirm('Delete this book permanently?')) {
        books = books.filter(b => b.id !== id);
        saveAndRender();
    }
}

function searchBooks() {
    const keyword = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(keyword) || 
        book.author.toLowerCase().includes(keyword)
    );
    renderBooks(filteredBooks);
}

function saveAndRender() {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
    if (searchInput.value) searchBooks();
    else renderBooks(books);
}

function renderBooks(bookArray) {
    bookList.innerHTML = ''; 
    
    if (bookArray.length === 0) {
        bookList.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#7f8c8d;">No books found.</p>';
        return;
    }

    bookArray.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('book-card');

        const statusClass = book.status === 'Available' ? 'status-available' : 'status-issued';
        const statusText = book.status === 'Available' ? 'Available' : 'Issued';

        let actionButtonsHTML = '';
        
        // BORROW: Show only if available
        if (book.status === 'Available') {
            actionButtonsHTML += `<button onclick="borrowBook(${book.id})" class="btn-warning"><i class="fas fa-hand-holding"></i> Borrow</button>`;
        } 
        // RETURN: Show only if current user is the borrower OR is admin
        else if (book.borrowedBy === currentUser?.email || currentUser?.role === 'Admin') {
            actionButtonsHTML += `<button onclick="returnBook(${book.id})" style="background-color:var(--success-color)"><i class="fas fa-check"></i> Return</button>`;
        } 
        // ISSUED TO SOMEONE ELSE: Show disabled button
        else {
            actionButtonsHTML += `<button disabled style="background-color:#95a5a6; cursor:not-allowed"><i class="fas fa-lock"></i> Issued</button>`;
        }

        // DELETE: Admin only
        if (currentUser && currentUser.role === 'Admin') {
            actionButtonsHTML += `<button onclick="deleteBook(${book.id})" class="btn-danger"><i class="fas fa-trash"></i> Delete</button>`;
        }

        // Borrower info for issued books
        const borrowerInfo = book.borrowedBy 
            ? `<small style="color:#e74c3c; display:block; margin-top:5px;"><i class="fas fa-user"></i> Issued to: ${book.borrowedBy}</small>` 
            : '';

        card.innerHTML = `
            <span class="status-badge ${statusClass}">${statusText}</span>
            <h2>${book.title}</h2>
            <p><i class="fas fa-user"></i> ${book.author}</p>
            <small><i class="fas fa-calendar-alt"></i> ${book.year}</small>
            <br>
            <strong>ISBN: </strong> <span style="font-family: monospace;">${book.isbn}</span>
            ${borrowerInfo}

            <div class="action-btns">
                ${actionButtonsHTML}
            </div>
        `;
        
        bookList.appendChild(card);
    });
}