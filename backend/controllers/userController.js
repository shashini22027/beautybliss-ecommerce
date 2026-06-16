import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const isAdmin = role === 'admin';
  const user = await User.create({ name, email, password, isAdmin });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(res, user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
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
      token: generateToken(res, user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
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
    res.status(404).json({ message: 'User not found' });
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

// @desc    Forgot password — send reset email
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find by email OR by name (username)
  const user = await User.findOne({
    $or: [{ email }, { name: email }],
  });

  // Always respond success to prevent user enumeration
  if (!user) {
    return res.json({ message: 'If that account exists, a reset link has been sent.' });
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#fff;border:1px solid #eee;border-radius:8px;">
      <p style="color:#9f234f;font-weight:bold;font-size:16px;margin-bottom:16px;">BeautyBliss</p>
      <h2 style="font-size:24px;font-weight:bold;color:#111;margin-bottom:16px;">Reset your password</h2>
      <p style="color:#444;margin-bottom:8px;">Hi <strong>${user.name}</strong>,</p>
      <p style="color:#555;line-height:1.7;margin-bottom:24px;">
        Someone has requested a new password for the following account on BeautyBliss:
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin-bottom:16px;">
      <p style="color:#444;margin-bottom:24px;">Username: <strong>${user.name}</strong></p>
      <hr style="border:none;border-top:1px solid #eee;margin-bottom:16px;">
      <p style="color:#555;line-height:1.7;margin-bottom:12px;">
        If you didn't make this request, just ignore this email. If you'd like to proceed, reset your password via the link below:
      </p>
      <a href="${resetUrl}" style="color:#9f234f;font-weight:500;text-decoration:underline;">Reset your password</a>
      <p style="color:#555;margin-top:32px;">Thanks for reading.</p>
      <hr style="border:none;border-top:1px solid #eee;margin-top:24px;">
      <p style="color:#aaa;font-size:12px;">BeautyBliss · This is an automated email, please do not reply.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset — BeautyBliss',
      html,
    });
    res.json({ message: 'If that account exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Email sending error:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
  }
});

// @desc    Reset password using token
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Return the same payload as login so the frontend can auto-login
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(res, user._id),
    message: 'Password has been reset successfully.',
  });
});

// @desc    Refresh access token
// @route   POST /api/users/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshsecret123');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '15m',
    });

    res.json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, refresh token failed' });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export {
  registerUser,
  authUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
};