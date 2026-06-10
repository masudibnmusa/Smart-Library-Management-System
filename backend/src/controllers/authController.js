const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields.'
    });
  }

  if (password.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 4 characters.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (userExists) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists.'
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'USER' // Force normal user role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      user,
      token: generateToken(user.id)
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  res.json({
    success: true,
    message: `Welcome, ${user.name}!`,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user.id)
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      borrows: {
        where: { returnedAt: null },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              status: true
            }
          }
        }
      }
    }
  });

  res.json({
    success: true,
    data: user
  });
});

module.exports = {
  register,
  login,
  getMe
};