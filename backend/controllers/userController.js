import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {

  // Receive role from frontend
  const { name, email, password, role } = req.body;

  // Check existing user
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: 'User already exists',
    });
  }

  // Convert role to boolean
  const isAdmin = role === 'admin';

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
  });

  // Response
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });

  } else {
    res.status(400).json({
      message: 'Invalid user data',
    });
  }
});


// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });

  } else {

    res.status(401).json({
      message: 'Invalid email or password',
    });
  }
});


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id);

  if (user) {

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

  } else {

    res.status(404).json({
      message: 'User not found',
    });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export {
  registerUser,
  authUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
};