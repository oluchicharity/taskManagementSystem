import express from 'express';
import { loginUser, logout, registerUser } from '../controllers/userController';
import { authenticateUser } from '../middleware/authentication';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',authenticateUser, logout)

export default router;
