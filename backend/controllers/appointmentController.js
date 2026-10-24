import crypto from 'crypto';
import Appointment from '../models/Appointment.js';
import sendEmail from '../utils/sendEmail.js';

export const appointmentConfig = {
  consultant: { name: 'Nethmi Perera', role: 'Beauty Consultant', email: 'consultant@beautybliss.com', phone: '+94 70 198 4663', location: 'BeautyBliss Studio, Colombo 03' },
  weekdays: [1, 2, 3, 4, 5, 6],
  start: '10:00',
  end: '18:00',
  slotMinutes: 30,
  timeZone: 'Asia/Colombo',
  modes: ['In-store consultation', 'Phone call', 'Video consultation'],
  changeCutoffHours: 12,
};

const getColomboToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const validDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date || '') && !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
const appointmentMoment = (date, time) => Date.parse(`${date}T${time}:00+05:30`);
const withinCutoff = (appointment) => appointmentMoment(appointment.appointmentDate, appointment.time) - Date.now() < appointmentConfig.changeCutoffHours * 60 * 60 * 1000;
const buildSlots = () => {
  const slots = [];
  for (let minutes = 10 * 60; minutes < 18 * 60; minutes += appointmentConfig.slotMinutes) {
    slots.push(`${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`);
  }
  return slots;
};
const isValidSlot = (date, time) => {
  if (typeof date !== 'string' || typeof time !== 'string') return false;
  if (!validDate(date) || date < getColomboToday()) return false;
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  return appointmentConfig.weekdays.includes(weekday) && buildSlots().includes(time) && appointmentMoment(date, time) > Date.now();
};
const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const managementUrl = (token) => `${process.env.CLIENT_URL || 'http://localhost:3000'}/appointment/manage/${token}`;

export const getConfig = (req, res) => res.json(appointmentConfig);

export const getAvailability = async (req, res) => {
  const { date } = req.query;
  if (!validDate(date)) return res.status(400).json({ message: 'Choose a valid appointment date.' });
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  const booked = await Appointment.find({ appointmentDate: date, slotReserved: true }).select('time -_id').lean();
  const reserved = new Set(booked.map((item) => item.time));
  const slots = appointmentConfig.weekdays.includes(weekday) && date >= getColomboToday()
    ? buildSlots().map((time) => ({ time, available: !reserved.has(time) && appointmentMoment(date, time) > Date.now() }))
    : [];
  res.json({ date, slots, modes: appointmentConfig.modes });
};

export const createAppointment = async (req, res) => {
  const { name, email, phone, date, time, mode, concern, skinType, sensitivity, fragrancePreference, notes } = req.body;
  if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string' || typeof date !== 'string' || typeof time !== 'string' || typeof mode !== 'string' || !name.trim() || !email.trim() || !phone.trim()) return res.status(400).json({ message: 'Complete the required contact and appointment details.' });
  if (!/^\S+@\S+\.\S+$/.test(email) || name.trim().length > 120 || String(notes || '').length > 2000) return res.status(400).json({ message: 'Check the name, email, and notes fields.' });
  if (!appointmentConfig.modes.includes(mode)) return res.status(400).json({ message: 'Choose a supported consultation mode.' });
  if (!isValidSlot(date, time)) return res.status(400).json({ message: 'Choose an available future slot during consultant hours.' });
  if (await Appointment.exists({ appointmentDate: date, time, slotReserved: true })) return res.status(409).json({ message: 'That appointment slot is no longer available. Please choose another time.' });

  const token = crypto.randomBytes(32).toString('hex');
  try {
    const appointment = await Appointment.create({
      name, email, phone, appointmentDate: date, time, mode, concern, skinType, sensitivity, fragrancePreference, notes,
      status: 'pending', slotReserved: true, manageTokenHash: tokenHash(token), user: req.user?._id || null,
    });
    let customerEmailSent = false;
    try {
      await sendEmail({
        to: email,
        subject: 'We received your BeautyBliss consultation request',
        html: `<p>Hi ${escapeHtml(name)},</p><p>We received your consultation request for <strong>${escapeHtml(date)} at ${escapeHtml(time)}</strong> (${escapeHtml(mode)}).</p><p>Your request is <strong>pending</strong>. It is not confirmed until our consultant contacts you.</p><p>You can cancel or reschedule up to 12 hours before the requested time using <a href="${managementUrl(token)}">this secure appointment link</a>.</p>`,
      });
      customerEmailSent = true;
    } catch (emailError) { console.error('Appointment request email failed:', emailError.message); }
    let consultantNotified = false;
    try {
      await sendEmail({
        to: appointmentConfig.consultant.email,
        subject: 'New BeautyBliss consultation request',
        html: `<p>A consultation request is waiting for review.</p><p><strong>${escapeHtml(name)}</strong> requested ${escapeHtml(date)} at ${escapeHtml(time)} (${escapeHtml(mode)}).</p><p>Concern: ${escapeHtml(concern || 'Not specified')} · Skin type: ${escapeHtml(skinType || 'Not specified')}</p><p>Customer: ${escapeHtml(email)} · ${escapeHtml(phone)}</p>`,
      });
      consultantNotified = true;
    } catch (emailError) { console.error('Consultant appointment notification failed:', emailError.message); }
    return res.status(201).json({ message: 'Request received and pending consultant confirmation.', appointment: { _id: appointment._id, date, time, mode, status: appointment.status }, manageUrl: managementUrl(token), customerEmailSent, consultantNotified });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'That appointment slot was just taken. Please choose another available time.' });
    throw error;
  }
};

const findByManageToken = (token) => Appointment.findOne({ manageTokenHash: tokenHash(token) }).select('+manageTokenHash');

export const getManagedAppointment = async (req, res) => {
  const appointment = await findByManageToken(req.params.token);
  if (!appointment) return res.status(404).json({ message: 'This appointment link is invalid or has expired.' });
  const { _id, appointmentDate, time, mode, status } = appointment;
  res.json({ appointment: { _id, date: appointmentDate, time, mode, status, canChange: ['pending', 'confirmed'].includes(status) && !withinCutoff(appointment) } });
};

export const cancelManagedAppointment = async (req, res) => {
  const appointment = await findByManageToken(req.params.token);
  if (!appointment) return res.status(404).json({ message: 'This appointment link is invalid or has expired.' });
  if (!['pending', 'confirmed'].includes(appointment.status) || withinCutoff(appointment)) return res.status(400).json({ message: 'This appointment can no longer be cancelled online. Please contact the consultant.' });
  appointment.status = 'cancelled';
  appointment.slotReserved = false;
  await appointment.save();
  try {
    await sendEmail({ to: appointment.email, subject: 'Your BeautyBliss appointment was cancelled', html: `<p>Hi ${escapeHtml(appointment.name)},</p><p>Your appointment for <strong>${escapeHtml(appointment.appointmentDate)} at ${escapeHtml(appointment.time)}</strong> has been cancelled.</p>` });
    await sendEmail({ to: appointmentConfig.consultant.email, subject: 'BeautyBliss appointment cancellation', html: `<p>${escapeHtml(appointment.name)} cancelled the appointment for ${escapeHtml(appointment.appointmentDate)} at ${escapeHtml(appointment.time)}.</p>` });
  } catch (emailError) { console.error('Appointment cancellation email failed:', emailError.message); }
  res.json({ message: 'Appointment cancelled.', appointment: { status: appointment.status } });
};

export const rescheduleManagedAppointment = async (req, res) => {
  const appointment = await findByManageToken(req.params.token);
  if (!appointment) return res.status(404).json({ message: 'This appointment link is invalid or has expired.' });
  const { date, time } = req.body;
  if (!['pending', 'confirmed'].includes(appointment.status) || withinCutoff(appointment)) return res.status(400).json({ message: 'This appointment can no longer be rescheduled online. Please contact the consultant.' });
  if (!isValidSlot(date, time)) return res.status(400).json({ message: 'Choose an available future slot during consultant hours.' });
  try {
    appointment.appointmentDate = date;
    appointment.time = time;
    appointment.reminderSentAt = null;
    appointment.reminderClaimedAt = null;
    await appointment.save();
    try {
      await sendEmail({ to: appointment.email, subject: 'Your BeautyBliss appointment was rescheduled', html: `<p>Hi ${escapeHtml(appointment.name)},</p><p>Your consultation is now scheduled for <strong>${escapeHtml(date)} at ${escapeHtml(time)}</strong>. Its status is <strong>${escapeHtml(appointment.status)}</strong>.</p><p>Manage it here: <a href="${managementUrl(req.params.token)}">appointment management link</a>.</p>` });
      await sendEmail({ to: appointmentConfig.consultant.email, subject: 'BeautyBliss appointment rescheduled', html: `<p>${escapeHtml(appointment.name)} rescheduled to ${escapeHtml(date)} at ${escapeHtml(time)} (${escapeHtml(appointment.mode)}).</p>` });
    } catch (emailError) { console.error('Appointment reschedule email failed:', emailError.message); }
    res.json({ message: 'Appointment rescheduled.', appointment: { date, time, status: appointment.status } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'That appointment slot was just taken. Please choose another time.' });
    throw error;
  }
};

export const listAppointments = async (req, res) => {
  const appointments = await Appointment.find().sort({ appointmentDate: 1, time: 1, createdAt: -1 }).lean();
  res.json(appointments);
};

export const listMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }] })
    .select('-manageTokenHash')
    .sort({ appointmentDate: -1, time: -1 })
    .lean();
  res.json(appointments);
};

export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = { pending: ['confirmed', 'cancelled'], confirmed: ['completed', 'cancelled'] };
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
  if (!allowed[appointment.status]?.includes(status)) return res.status(400).json({ message: 'That appointment status change is not allowed.' });
  const startsAt = appointmentMoment(appointment.appointmentDate, appointment.time);
  if (status === 'confirmed' && startsAt <= Date.now()) return res.status(400).json({ message: 'A past appointment cannot be confirmed.' });
  if (status === 'completed' && startsAt > Date.now()) return res.status(400).json({ message: 'An upcoming appointment cannot be marked completed.' });
  const managementToken = status === 'confirmed' ? crypto.randomBytes(32).toString('hex') : null;
  appointment.status = status;
  if (status === 'cancelled') appointment.slotReserved = false;
  if (managementToken) appointment.manageTokenHash = tokenHash(managementToken);
  await appointment.save();
  const statusText = status === 'confirmed' ? 'confirmed' : status;
  try {
    await sendEmail({ to: appointment.email, subject: `Your BeautyBliss appointment is ${statusText}`, html: `<p>Hi ${escapeHtml(appointment.name)},</p><p>Your consultation request for <strong>${escapeHtml(appointment.appointmentDate)} at ${escapeHtml(appointment.time)}</strong> is now <strong>${statusText}</strong>.</p>${status === 'confirmed' ? `<p>Mode: ${escapeHtml(appointment.mode)}.</p><p>To cancel or reschedule up to 12 hours before the appointment, use <a href="${managementUrl(managementToken)}">this secure appointment link</a>.</p>` : `<p>Contact ${escapeHtml(appointmentConfig.consultant.phone)} if you need assistance.</p>`}`, });
  } catch (emailError) { console.error('Appointment status email failed:', emailError.message); }
  res.json(appointment);
};

export const sendAppointmentReminders = async () => {
  const now = new Date();
  const until = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const today = getColomboToday();
  const tomorrow = new Date(Date.parse(`${today}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
  const candidates = await Appointment.find({ status: 'confirmed', reminderSentAt: null, appointmentDate: { $in: [today, tomorrow] } }).select('_id appointmentDate time');
  for (const candidate of candidates) {
    const startsAt = appointmentMoment(candidate.appointmentDate, candidate.time);
    if (startsAt <= now.getTime() || startsAt > until.getTime()) continue;
    const claim = await Appointment.findOneAndUpdate({ _id: candidate._id, reminderSentAt: null, $or: [{ reminderClaimedAt: null }, { reminderClaimedAt: { $lt: new Date(now.getTime() - 30 * 60 * 1000) } }] }, { $set: { reminderClaimedAt: now } }, { new: true });
    if (!claim) continue;
    try {
      await sendEmail({ to: claim.email, subject: 'Reminder: your BeautyBliss consultation is coming up', html: `<p>Hi ${escapeHtml(claim.name)},</p><p>This is a reminder for your confirmed consultation on <strong>${escapeHtml(claim.appointmentDate)} at ${escapeHtml(claim.time)}</strong> (${escapeHtml(claim.mode)}).</p>` });
      await Appointment.updateOne({ _id: claim._id }, { $set: { reminderSentAt: new Date() }, $unset: { reminderClaimedAt: 1 } });
    } catch (error) {
      console.error('Appointment reminder failed:', error.message);
      await Appointment.updateOne({ _id: claim._id }, { $unset: { reminderClaimedAt: 1 } });
    }
  }
};
