import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const todayInColombo = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

const AppointmentManagePage = () => {
  const { token } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      const { data } = await api.get(`/appointments/manage/${token}`);
      setAppointment(data.appointment);
    } catch (err) {
      setError(err.response?.data?.message || 'This appointment link is invalid or expired.');
    }
  };

  useEffect(() => { refresh(); }, [token]);

  const changeDate = async (value) => {
    setDate(value);
    setTime('');
    setSlots([]);
    if (!value) return;
    try {
      const { data } = await api.get('/appointments/availability', { params: { date: value } });
      setSlots((data.slots || []).filter((slot) => slot.available));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load available appointment times.');
    }
  };

  const cancel = async () => {
    if (!window.confirm('Cancel this appointment request?')) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const { data } = await api.post(`/appointments/manage/${token}/cancel`);
      setMessage(data.message); await refresh();
    } catch (err) { setError(err.response?.data?.message || 'Could not cancel this appointment.'); }
    finally { setBusy(false); }
  };

  const reschedule = async (event) => {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const { data } = await api.post(`/appointments/manage/${token}/reschedule`, { date, time });
      setMessage(`${data.message} Your appointment remains ${data.appointment.status}.`);
      setAppointment((current) => ({ ...current, date, time }));
    } catch (err) { setError(err.response?.data?.message || 'Could not reschedule this appointment.'); }
    finally { setBusy(false); }
  };

  return <main className="min-h-[70vh] bg-[#faf7f5] px-5 py-14 text-gray-900 sm:py-20">
    <section className="mx-auto max-w-2xl rounded-xl border border-[#eee5e1] bg-white p-6 shadow-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a94f61]">BeautyBliss · Appointment</p>
      <h1 className="mt-3 text-3xl font-semibold">Manage your consultation</h1>
      {error && <p role="alert" className="mt-5 rounded bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="mt-5 rounded bg-green-50 p-3 text-sm text-green-800">{message}</p>}
      {appointment && <>
        <div className="mt-6 rounded-lg bg-[#faf7f5] p-5 text-sm leading-7">
          <p><strong>Date:</strong> {appointment.date}</p><p><strong>Time:</strong> {appointment.time} Sri Lanka time</p><p><strong>Mode:</strong> {appointment.mode}</p><p><strong>Status:</strong> <span className="capitalize">{appointment.status}</span></p>
        </div>
        {appointment.canChange ? <>
          <p className="mt-5 text-sm leading-6 text-gray-600">You can make changes up to 12 hours before the appointment. A rescheduled request remains pending if it has not yet been confirmed.</p>
          <form onSubmit={reschedule} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="text-sm font-medium">New date<input type="date" min={todayInColombo()} value={date} onChange={(event) => changeDate(event.target.value)} required className="mt-2 w-full border border-gray-300 px-3 py-2.5" /></label>
            <label className="text-sm font-medium">Available time<select value={time} onChange={(event) => setTime(event.target.value)} required disabled={!date || !slots.length} className="mt-2 w-full border border-gray-300 px-3 py-2.5 disabled:bg-gray-50"><option value="">Choose time</option>{slots.map((slot) => <option key={slot.time} value={slot.time}>{slot.time}</option>)}</select></label>
            <button disabled={busy || !time} className="bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Reschedule</button>
          </form>
          {date && !slots.length && <p className="mt-2 text-xs text-gray-500">No available slots for the selected date.</p>}
          <button type="button" onClick={cancel} disabled={busy} className="mt-5 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Cancel appointment</button>
        </> : <p className="mt-5 text-sm leading-6 text-gray-600">This appointment is no longer changeable online. For help, contact <a className="text-pink-700 underline" href="mailto:consultant@beautybliss.com">our consultant</a>.</p>}
      </>}
      <Link to="/skin-consultation" className="mt-8 inline-block text-sm font-semibold text-[#a94f61] hover:underline">Back to skin consultation</Link>
    </section>
  </main>;
};

export default AppointmentManagePage;
