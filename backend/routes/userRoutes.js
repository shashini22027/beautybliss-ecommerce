import express from 'express';
import { registerUser, authUser, getUserProfile, updateUserProfile, saveUserRoutine, deleteUserRoutine, getAllUsers, updateUserRole, deleteUser, forgotPassword, resetPassword, refreshToken, logoutUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.route('/').get(protect, admin, getAllUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);
router.route('/profile/routines').post(protect, saveUserRoutine);
router.route('/profile/routines/:routineId').delete(protect, deleteUserRoutine);

export default router;
