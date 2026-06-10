// ============================================
// API CONFIGURATION
// ============================================
const API_URL = 'http://localhost:5000/api';

// Store JWT token
let authToken = localStorage.getItem('libraryToken') || null;
let currentUser = null;

// ============================================
// UI ELEMENTS
// ============================================
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

// ============================================
// API HELPER
// ============================================
async function apiCall(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        ...options
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

function switchToRegister() {
    loginView.style.display = 'none';
    registerView.style.display = 'block';
}

function switchToLogin() {
    registerView.style.display = 'none';
    loginView.style.display = 'block';
}

async function attemptRegister() {
    const name = regName.value.trim();
    const email = regEmail.value.trim().toLowerCase();
    const password = regPassword.value;

    if (!name || !email || !password) {
        showError(regError, "Please fill in all fields.");
        return;
    }

    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: { name, email, password }
        });

        alert("Registration Successful! Please login.");
        regName.value = '';
        regEmail.value = '';
        regPassword.value = '';
        switchToLogin();
    } catch (error) {
        showError(regError, error.message);
    }
}

async function attemptLogin() {
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    if (!email || !password) {
        showError(loginError, "Please fill in all fields.");
        return;
    }

    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        // Save token
        authToken = data.data.token;
        localStorage.setItem('libraryToken', authToken);
        currentUser = data.data.user;

        alert(data.message);
        loginUser(currentUser);
    } catch (error) {
        showError(loginError, error.message);
    }
}

function showError(element, message) {
    element.innerText = message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 3000);
}

// ============================================
// LOGIN & ROLE MANAGEMENT
// ============================================

async function loginUser(userObj) {
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

    await fetchBooks();
}

function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('libraryToken');
    
    loginEmail.value = '';
    loginPassword.value = '';
    authScreen.style.display = 'flex';
    systemInterface.style.display = 'none';
}

// ============================================
// BOOK SYSTEM LOGIC (API CONNECTED)
// ============================================

async function addBook() {
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

    try {
        await apiCall('/books', {
            method: 'POST',
            body: { title, author, year, isbn }
        });

        alert('Book added successfully!');
        titleInput.value = ''; 
        authorInput.value = ''; 
        yearInput.value = ''; 
        isbnInput.value = '';
        
        await fetchBooks();
    } catch (error) {
        alert(error.message);
    }
}

async function borrowBook(id) {
    if (!currentUser) {
        alert('Please log in to borrow books.');
        return;
    }

    try {
        await apiCall(`/books/${id}/borrow`, {
            method: 'POST'
        });
        await fetchBooks();
    } catch (error) {
        alert(error.message);
    }
}

async function returnBook(id) {
    if (!currentUser) {
        alert('Please log in to return books.');
        return;
    }

    try {
        await apiCall(`/books/${id}/return`, {
            method: 'POST'
        });
        await fetchBooks();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteBook(id) {
    if (!currentUser || currentUser.role !== 'Admin') {
        alert('Access denied: Only administrators can delete books.');
        return;
    }

    if (!confirm('Delete this book permanently?')) return;

    try {
        await apiCall(`/books/${id}`, {
            method: 'DELETE'
        });
        await fetchBooks();
    } catch (error) {
        alert(error.message);
    }
}

async function searchBooks() {
    const keyword = searchInput.value.trim();
    await fetchBooks(keyword);
}

async function fetchBooks(search = '') {
    try {
        const endpoint = search ? `/books?search=${encodeURIComponent(search)}` : '/books';
        const data = await apiCall(endpoint);
        renderBooks(data.data);
    } catch (error) {
        console.error('Failed to fetch books:', error);
        bookList.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#e74c3c;">Failed to load books. Is the server running?</p>';
    }
}

function renderBooks(bookArray) {
    bookList.innerHTML = ''; 
    
    if (!bookArray || bookArray.length === 0) {
        bookList.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#7f8c8d;">No books found.</p>';
        return;
    }

    bookArray.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('book-card');

        const statusClass = book.status === 'AVAILABLE' || book.status === 'Available' ? 'status-available' : 'status-issued';
        const statusText = book.status === 'AVAILABLE' || book.status === 'Available' ? 'Available' : 'Issued';

        let actionButtonsHTML = '';
        
        // BORROW: Show only if available
        if (book.status === 'AVAILABLE' || book.status === 'Available') {
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

// ============================================
// AUTO-LOGIN ON PAGE LOAD
// ============================================
async function checkAuth() {
    if (!authToken) return;
    
    try {
        const data = await apiCall('/auth/me');
        currentUser = data.data;
        loginUser(currentUser);
    } catch (error) {
        // Token invalid, clear it
        localStorage.removeItem('libraryToken');
        authToken = null;
    }
}

// Check if already logged in
checkAuth();