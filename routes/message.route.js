import express from 'express'
const router = express.Router();
import {sendFeedback, getMessagesForTrack, markAsRead} from '../controllers/message.controller.js'
import { auth, requireRole } from '../middleware/auth.middleware.js'

router.post('/feedback', auth, requireRole('dj'), sendFeedback);
router.get('/track/:trackId', auth, getMessagesForTrack);
router.patch('/read/:messageId', auth, markAsRead);

export default router;