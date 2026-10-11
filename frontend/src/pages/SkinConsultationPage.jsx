import { useMemo, useState } from 'react';
import { CalendarDays, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const concerns = [
  {
    id: 'acne',
    title: 'Acne & Breakouts',
    description: 'Support for clogged pores, recurring pimples, and post-blemish marks.',
    routine: ['Gentle cleanser', 'Niacinamide serum', 'Oil-free moisturiser', 'Daily sunscreen'],
    search: '/search?q=acne%20skincare',
  },
  {
    id: 'dryness',
    title: 'Dryness & Barrier Care',
    description: 'Comfort-focused care for tight, flaky, or easily irritated skin.',
    routine: ['Cream cleanser', 'Hyaluronic acid', 'Ceramide moisturiser', 'Nourishing night cream'],
    search: '/search?q=hydrating%20skincare',
  },
  {
    id: 'dark-spots',
    title: 'Dark Spots & Uneven Tone',
    description: 'Brightening routines for pigmentation, dullness, and uneven texture.',
    routine: ['Vitamin C serum', 'Exfoliating toner', 'Spot corrector', 'Broad-spectrum sunscreen'],
    search: '/search?q=brightening%20skincare',
  },
  {
    id: 'sensitive',
    title: 'Sensitive Skin',
    description: 'Simple, low-fragrance routines for redness, stinging, or reactive skin.',
    routine: ['Mild cleanser', 'Soothing toner', 'Barrier repair cream', 'Mineral sunscreen'],
    search: '/search?q=sensitive%20skin',
  },
];

const skinTypes = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Not sure'];
const appointmentModes = ['In-store consultation', 'Phone call', 'Video consultation'];

const consultant = {
  name: 'Nethmi Perera',
  role: 'Beauty Consultant',
  phone: '+94 70 198 4663',
  email: 'consultant@beautybliss.com',
  location: 'BeautyBliss Studio, Colombo 03',
  hours: 'Mon - Sat, 10.00 AM - 6.00 PM',
};

const SkinConsultationPage = () => {
  const [selectedConcern, setSelectedConcern] = useState(concerns[0].id);
  const [skinType, setSkinType] = useState(skinTypes[0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    mode: appointmentModes[0],
    notes: '',
  });
  const [submitStatus, setSubmitStatus] = useState('idle');

  const activeConcern = useMemo(
    () => concerns.find((concern) => concern.id === selectedConcern) || concerns[0],
    [selectedConcern]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('sending');

    const message = [
      'Appointment request',
      `Concern: ${activeConcern.title}`,
      `Skin type: ${skinType}`,
      `Preferred date: ${formData.date}`,
      `Preferred time: ${formData.time}`,
      `Consultation mode: ${formData.mode}`,
      `Notes: ${formData.notes || 'No extra notes provided.'}`,
    ].join('\n');

    try {
      await api.post('/messages', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: 'Skin consultation booking',
        message,
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        mode: appointmentModes[0],
        notes: '',
      });
    } catch (error) {
      console.error('Appointment request failed', error);
      setSubmitStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="relative min-h-[420px] overflow-hidden">
        <img
          src="/images/banner.jpg"
          alt="Skin Consultation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1540px] flex-col items-center justify-center px-6 py-16 text-center text-white">
          <h1 className="text-6xl font-bold uppercase tracking-tight md:text-7xl">
            Skin Consultation
          </h1>
          <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-white/90 md:text-lg">
            Choose your concern, review a starter routine, and book a one-to-one session with our beauty consultant.
          </p>
        </div>
      </section>

      <section id="concerns" className="mx-auto max-w-[1540px] px-6 py-16 lg:py-20">
        <div className="mb-10 border-b border-gray-200 pb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-pink-600">Step 1</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-950">Select your main skin concern</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600">
            This guide helps customers move from browsing products to choosing a routine with a clear goal.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {concerns.map((concern) => (
            <button
              key={concern.id}
              type="button"
              onClick={() => setSelectedConcern(concern.id)}
              className={`min-h-[190px] border p-6 text-left transition ${
                selectedConcern === concern.id
                  ? 'border-gray-950 bg-gray-950 text-white'
                  : 'border-gray-200 bg-white text-gray-950 hover:border-gray-950'
              }`}
            >
              <h3 className="text-xl font-extrabold leading-tight">{concern.title}</h3>
              <p className={`mt-3 text-sm leading-6 ${selectedConcern === concern.id ? 'text-gray-200' : 'text-gray-600'}`}>
                {concern.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="h-fit border border-gray-200 bg-white px-6 py-7">
            <label className="block border-b border-gray-200 pb-4 text-lg font-extrabold uppercase tracking-tight text-gray-950" htmlFor="skinType">
              Skin type
            </label>
            <select
              id="skinType"
              value={skinType}
              onChange={(event) => setSkinType(event.target.value)}
              className="mt-5 h-11 w-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 focus:border-gray-950 focus:outline-none"
            >
              {skinTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <p className="mt-5 text-sm leading-6 text-gray-600">
              Selected profile: {skinType} skin with a focus on {activeConcern.title.toLowerCase()}.
            </p>
          </div>

          <div className="border border-gray-200 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-pink-600">Recommended starter routine</p>
                <h3 className="mt-3 text-3xl font-extrabold text-gray-950">{activeConcern.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">{activeConcern.description}</p>
              </div>
              <Link
                to={activeConcern.search}
                className="shrink-0 bg-gray-950 px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600"
              >
                Shop Matches
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {activeConcern.routine.map((step, index) => (
                <div key={step} className="border border-gray-200 bg-white p-5">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-gray-400">Step {index + 1}</span>
                  <p className="mt-3 font-bold leading-snug text-gray-950">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="appointment" className="border-t border-gray-200 bg-[#f6f6f6] py-20">
        <div className="mx-auto grid max-w-[1540px] gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-pink-600">Step 2</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-950">Book a beauty consultation</h2>
            <p className="mt-5 text-sm leading-7 text-gray-600">
              Share your skin concern and preferred time. The consultant can confirm the appointment and recommend products before checkout.
            </p>

            <div className="mt-8 space-y-4 border border-gray-200 bg-white p-6">
              <h3 className="text-2xl font-extrabold text-gray-950">{consultant.name}</h3>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-pink-600">{consultant.role}</p>
              <div className="space-y-3 pt-2 text-sm text-gray-600">
                <p className="flex items-center gap-3"><Phone size={18} /> {consultant.phone}</p>
                <p className="flex items-center gap-3"><Mail size={18} /> {consultant.email}</p>
                <p className="flex items-center gap-3"><MapPin size={18} /> {consultant.location}</p>
                <p className="flex items-center gap-3"><CalendarDays size={18} /> {consultant.hours}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border border-gray-200 bg-white p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Full name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Consultation mode</label>
                <select name="mode" value={formData.mode} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none">
                  {appointmentModes.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Preferred date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Preferred time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none" />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-gray-700">Notes for consultant</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about current products, allergies, budget, or specific concerns."
                className="w-full resize-none border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none"
              />
            </div>

            {submitStatus === 'success' && (
              <div className="mt-5 border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                Appointment request sent. Our consultant will contact you to confirm.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                We could not send the request. Please try again or call the consultant directly.
              </div>
            )}

            <button
              type="submit"
              disabled={submitStatus === 'sending'}
              className="mt-6 flex w-full items-center justify-center gap-3 bg-gray-950 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={18} />
              {submitStatus === 'sending' ? 'Sending Request...' : 'Request Appointment'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SkinConsultationPage;
