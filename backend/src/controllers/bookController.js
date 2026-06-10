const prisma = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all books
// @route   GET /api/books
// @access  Public (any authenticated user)
const getAllBooks = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } }
        ]
      }
    : {};

  const books = await prisma.book.findMany({
    where,
    include: {
      borrows: {
        where: { returnedAt: null },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Format response to match frontend expectations
  const formattedBooks = books.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    year: book.year,
    isbn: book.isbn,
    status: book.status,
    borrowedBy: book.borrows[0]?.user?.email || null,
    borrowedAt: book.borrows[0]?.borrowedAt || null,
    borrowerName: book.borrows[0]?.user?.name || null
  }));

  res.json({
    success: true,
    count: books.length,
    data: formattedBooks
  });
});

// @desc    Add new book
// @route   POST /api/books
// @access  Admin only
const addBook = asyncHandler(async (req, res) => {
  const { title, author, year, isbn } = req.body;

  // Validation
  if (!title?.trim() || !author?.trim() || !year?.trim() || !isbn?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields.'
    });
  }

  const book = await prisma.book.create({
    data: {
      title: title.trim(),
      author: author.trim(),
      year: year.trim(),
      isbn: isbn.trim(),
      status: 'AVAILABLE'
    }
  });

  res.status(201).json({
    success: true,
    message: 'Book added successfully.',
    data: book
  });
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Admin only
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const bookId = parseInt(id);
  if (isNaN(bookId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid book ID.'
    });
  }

  // Check if book exists and has active borrows
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      borrows: {
        where: { returnedAt: null }
      }
    }
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found.'
    });
  }

  if (book.borrows.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete a book that is currently issued.'
    });
  }

  await prisma.book.delete({
    where: { id: bookId }
  });

  res.json({
    success: true,
    message: 'Book deleted successfully.'
  });
});

// @desc    Borrow a book
// @route   POST /api/books/:id/borrow
// @access  Authenticated users
const borrowBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const bookId = parseInt(id);
  if (isNaN(bookId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid book ID.'
    });
  }

  // Check if book exists and is available
  const book = await prisma.book.findUnique({
    where: { id: bookId }
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found.'
    });
  }

  if (book.status === 'ISSUED') {
    return res.status(400).json({
      success: false,
      message: 'This book is already issued.'
    });
  }

  // Check if user already borrowed this book
  const existingBorrow = await prisma.borrowRecord.findFirst({
    where: {
      userId,
      bookId,
      returnedAt: null
    }
  });

  if (existingBorrow) {
    return res.status(400).json({
      success: false,
      message: 'You have already borrowed this book.'
    });
  }

  // Transaction: update book status + create borrow record
  const [updatedBook, borrowRecord] = await prisma.$transaction([
    prisma.book.update({
      where: { id: bookId },
      data: { status: 'ISSUED' }
    }),
    prisma.borrowRecord.create({
      data: {
        userId,
        bookId
      }
    })
  ]);

  res.json({
    success: true,
    message: 'Book borrowed successfully.',
    data: {
      book: updatedBook,
      borrowedAt: borrowRecord.borrowedAt
    }
  });
});

// @desc    Return a book
// @route   POST /api/books/:id/return
// @access  Borrower or Admin
const returnBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'ADMIN';

  const bookId = parseInt(id);
  if (isNaN(bookId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid book ID.'
    });
  }

  // Find active borrow record
  const borrowRecord = await prisma.borrowRecord.findFirst({
    where: {
      bookId,
      returnedAt: null
    },
    include: {
      user: {
        select: { id: true, email: true, name: true }
      },
      book: true
    }
  });

  if (!borrowRecord) {
    return res.status(400).json({
      success: false,
      message: 'This book is not currently issued.'
    });
  }

  // Check if user is the borrower or admin
  if (borrowRecord.userId !== userId && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the borrower or an admin can return this book.'
    });
  }

  // Transaction: update book status + update borrow record
  const [updatedBook, updatedBorrow] = await prisma.$transaction([
    prisma.book.update({
      where: { id: bookId },
      data: { status: 'AVAILABLE' }
    }),
    prisma.borrowRecord.update({
      where: { id: borrowRecord.id },
      data: { returnedAt: new Date() }
    })
  ]);

  res.json({
    success: true,
    message: 'Book returned successfully.',
    data: {
      book: updatedBook,
      returnedAt: updatedBorrow.returnedAt
    }
  });
});

// @desc    Get user's borrow history
// @route   GET /api/books/my-borrows
// @access  Authenticated
const getMyBorrows = asyncHandler(async (req, res) => {
  const borrows = await prisma.borrowRecord.findMany({
    where: { userId: req.user.id },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          isbn: true,
          year: true
        }
      }
    },
    orderBy: { borrowedAt: 'desc' }
  });

  res.json({
    success: true,
    count: borrows.length,
    data: borrows
  });
});

module.exports = {
  getAllBooks,
  addBook,
  deleteBook,
  borrowBook,
  returnBook,
  getMyBorrows
};