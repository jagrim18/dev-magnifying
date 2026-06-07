import express from 'express';
import { authAdmin, getAdminProfile } from '../controllers/adminController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', authAdmin);
router.get('/profile', protect, getAdminProfile);

export default router;
