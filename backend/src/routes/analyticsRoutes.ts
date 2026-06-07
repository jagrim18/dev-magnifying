import express from 'express';
import { logVisit, logInquiry, getStats } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/visit', logVisit);
router.post('/inquiry', logInquiry);
router.get('/stats', protect, getStats);

export default router;
