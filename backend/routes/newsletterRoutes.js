import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import Message from '../models/Message.js';

const router = express.Router();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      res.status(400);
      throw new Error('Please enter a valid email address.');
    }

    const subscriptionMessage = await Message.create({
      name: 'Newsletter Subscriber',
      email,
      company: 'Newsletter subscription',
      message: `A customer subscribed to the newsletter with this email: ${email}`,
    });

    res.status(201).json({
      message: 'Thank you for subscribing!',
      subscription: subscriptionMessage,
    });
  })
);

export default router;
