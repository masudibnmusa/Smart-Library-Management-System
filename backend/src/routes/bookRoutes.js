const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  addBook,
  deleteBook,
  borrowBook,
  returnBook,
  getMyBorrows
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes (any authenticated user)
router.get('/', protect, getAllBooks);
router.get('/my-borrows', protect, getMyBorrows);

// Borrow/Return (protected, return checks ownership)
router.post('/:id/borrow', protect, borrowBook);
router.post('/:id/return', protect, returnBook);

// Admin only
router.post('/', protect, adminOnly, addBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;