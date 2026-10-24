import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getConfig, getAvailability, createAppointment, getManagedAppointment,
  cancelManagedAppointment, rescheduleManagedAppointment, listAppointments, updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();
router.get('/config', getConfig);
router.get('/availability', asyncHandler(getAvailability));
router.post('/', asyncHandler(createAppointment));
router.get('/manage/:token', asyncHandler(getManagedAppointment));
router.post('/manage/:token/cancel', asyncHandler(cancelManagedAppointment));
router.post('/manage/:token/reschedule', asyncHandler(rescheduleManagedAppointment));
router.get('/', protect, admin, asyncHandler(listAppointments));
router.put('/:id/status', protect, admin, asyncHandler(updateAppointmentStatus));

export default router;
