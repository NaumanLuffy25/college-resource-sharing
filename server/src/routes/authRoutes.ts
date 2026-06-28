import { Router } from 'express';
import { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword, logout, getAllUsers, updateUserRole, deleteUser } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/admin/users', protect, authorize('admin'), getAllUsers);
router.put('/admin/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/admin/users/:id', protect, authorize('admin'), deleteUser);

export default router;
