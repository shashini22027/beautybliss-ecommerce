import express from 'express';
import { registerUser, authUser, getUserProfile, getAllUsers, deleteUser, forgotPassword, resetPassword } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
