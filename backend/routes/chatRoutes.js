import express from 'express';
import rateLimit from 'express-rate-limit';
import { chat } from '../controllers/chatController.js';

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'You have sent too many messages. Please try again in a little while.' },
});

router.post('/', chatLimiter, chat);

export default router;
