import express from 'express';
import { register, login, refreshToken, logout, googleAuth, getGoogleClientId } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.get('/google-client-id', getGoogleClientId);

export default router;