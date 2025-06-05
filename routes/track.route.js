import express from 'express'
const router = express.Router();
import {submitTrack, getDJSubmissions, getProducerSubmissions} from '../controllers/track.controller.js'
import { auth, requireRole } from '../middleware/auth.middleware.js'

router.post('/submit', auth, requireRole('producer'), submitTrack);
router.get('/dj/review-tracks', auth, requireRole('dj'), getDJSubmissions);
router.get('/producer/submitted-tracks', auth, requireRole('producer'), getProducerSubmissions);

export default router;