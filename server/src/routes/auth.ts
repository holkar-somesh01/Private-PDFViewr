import express from 'express';
import { login, logout, refreshToken, getProfile, loginStep1, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login-step-1', loginStep1);
router.post('/verify-otp', verifyOtp);
router.post('/login-password', login); // Alias for step 3
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/profile', protect, getProfile);

export default router;
