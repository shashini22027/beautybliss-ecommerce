import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import { getJwtSecret, validateJwtSecrets } from '../utils/jwtSecrets.js';

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (normalizedName.length < 2 || normalizedName.length > 120
    || !/^\S+@\S+\.\S+$/.test(normalizedEmail)
    || typeof password !== 'string' || password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: 'Enter a name, valid email address, and password between 8 and 128 characters.' });
  }
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name: normalizedName, email: normalizedEmail, password, isAdmin: false });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      message: 'Registration successful. Please log in to continue.',
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
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const user = await User.findOne({ email: normalizedEmail }).select('+tokenVersion');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(res, user),
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
      addresses: user.addresses || { billing: null, shipping: null },
      savedRoutines: user.savedRoutines || [],
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+tokenVersion');
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { name, email, addresses, currentPassword, newPassword } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : user.email;
  const changesSensitiveData = normalizedEmail !== user.email || Boolean(newPassword);

  if (changesSensitiveData && (!currentPassword || !(await user.matchPassword(currentPassword)))) {
    return res.status(400).json({ message: 'Enter your current password to change your email or password.' });
  }
  if (typeof name === 'string' && name.trim()) user.name = name.trim();
  if (typeof email === 'string' && /^\S+@\S+\.\S+$/.test(normalizedEmail)) user.email = normalizedEmail;
  else if (typeof email === 'string') return res.status(400).json({ message: 'Enter a valid email address.' });
  if (addresses && typeof addresses === 'object') {
    if (Object.hasOwn(addresses, 'billing')) user.addresses.billing = addresses.billing;
    if (Object.hasOwn(addresses, 'shipping')) user.addresses.shipping = addresses.shipping;
    user.markModified('addresses');
  }
  if (newPassword) {
    if (typeof newPassword !== 'string' || newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    user.password = newPassword;
  }
  if (changesSensitiveData) user.tokenVersion = Number(user.tokenVersion || 0) + 1;

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'That email address is already registered.' });
    throw error;
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    addresses: user.addresses,
    savedRoutines: user.savedRoutines,
    ...(changesSensitiveData ? { token: generateToken(res, user) } : {}),
  });
});

const saveUserRoutine = asyncHandler(async (req, res) => {
  const { concernId, concernTitle, skinType, sensitivity, fragrancePreference } = req.body;
  if (![concernId, concernTitle, skinType].every((value) => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ message: 'Routine details are incomplete.' });
  }
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.savedRoutines = user.savedRoutines.filter((routine) => !(routine.concernId === concernId && routine.skinType === skinType));
  user.savedRoutines.push({ concernId, concernTitle, skinType, sensitivity, fragrancePreference, savedAt: new Date() });
  if (user.savedRoutines.length > 20) user.savedRoutines.shift();
  await user.save();
  res.status(201).json({ savedRoutines: user.savedRoutines });
});

const deleteUserRoutine = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.savedRoutines = user.savedRoutines.filter((routine) => String(routine._id) !== req.params.routineId);
  await user.save();
  res.json({ savedRoutines: user.savedRoutines });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordExpire');
  res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { isAdmin } = req.body;
  if (typeof isAdmin !== 'boolean') {
    return res.status(400).json({ message: 'Choose a valid account role.' });
  }
  if (String(req.user._id) === req.params.id) {
    return res.status(400).json({ message: 'You cannot change your own administrator role.' });
  }

  const user = await User.findById(req.params.id).select('+tokenVersion');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (user.isAdmin && !isAdmin && await User.countDocuments({ isAdmin: true }) <= 1) {
    return res.status(409).json({ message: 'At least one administrator account must remain.' });
  }
  user.isAdmin = isAdmin;
  user.tokenVersion = Number(user.tokenVersion || 0) + 1;
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
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
  if (typeof req.body.password !== 'string' || req.body.password.length < 8 || req.body.password.length > 128) {
    return res.status(400).json({ message: 'Password must be between 8 and 128 characters.' });
  }
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+tokenVersion');

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.tokenVersion = Number(user.tokenVersion || 0) + 1;
  await user.save();

  // Return the same payload as login so the frontend can auto-login
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(res, user),
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
    validateJwtSecrets();
    const decoded = jwt.verify(token, getJwtSecret('JWT_REFRESH_SECRET'));
    const user = await User.findById(decoded.id).select('-password +tokenVersion');

    if (!user || Number(decoded.version || 0) !== Number(user.tokenVersion || 0)) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    user.tokenVersion = Number(user.tokenVersion || 0) + 1;
    await user.save({ validateBeforeSave: false });
    res.json({ token: generateToken(res, user) });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, refresh token failed' });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  req.user.tokenVersion = Number(req.user.tokenVersion || 0) + 1;
  await req.user.save({ validateBeforeSave: false });
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  saveUserRoutine,
  deleteUserRoutine,
  getAllUsers,
  updateUserRole,
  deleteUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
};
