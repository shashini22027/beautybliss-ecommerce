import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import VirtualMakeupTryOn from '../components/VirtualMakeupTryOn';

const concerns = [
  {
    id: 'acne',
    title: 'Acne & Breakouts',
    description: 'Support for clogged pores, recurring pimples, and post-blemish marks.',
    morning: ['Gentle cleanser', 'Niacinamide serum', 'Oil-free moisturiser', 'Daily sunscreen'],
    evening: ['Gentle cleanser', 'Niacinamide serum', 'Oil-free moisturiser'],
    ingredients: ['Niacinamide', 'Salicylic acid', 'Ceramides'],
  },
  {
    id: 'dryness',
    title: 'Dryness & Barrier Care',
    description: 'Comfort-focused care for tight, flaky, or easily irritated skin.',
    morning: ['Cream cleanser', 'Hyaluronic acid', 'Ceramide moisturiser', 'Daily sunscreen'],
    evening: ['Cream cleanser', 'Hyaluronic acid', 'Ceramide moisturiser', 'Nourishing night cream'],
    ingredients: ['Hyaluronic acid', 'Ceramides', 'Glycerin'],
  },
  {
    id: 'dark-spots',
    title: 'Dark Spots & Uneven Tone',
    description: 'Brightening routines for pigmentation, dullness, and uneven texture.',
    morning: ['Gentle cleanser', 'Vitamin C serum', 'Moisturiser', 'Broad-spectrum sunscreen'],
    evening: ['Gentle cleanser', 'Exfoliating toner (as directed)', 'Spot corrector', 'Moisturiser'],
    ingredients: ['Vitamin C', 'Azelaic acid', 'Broad-spectrum SPF'],
  },
  {
    id: 'sensitive',
    title: 'Sensitive Skin',
    description: 'Simple, low-fragrance routines for redness, stinging, or reactive skin.',
    morning: ['Mild cleanser', 'Soothing toner', 'Barrier repair cream', 'Mineral sunscreen'],
    evening: ['Mild cleanser', 'Soothing toner', 'Barrier repair cream'],
    ingredients: ['Colloidal oat', 'Panthenol', 'Ceramides'],
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
  const [step, setStep] = useState(1);
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

  useEffect(() => {
    if (submitStatus !== 'success' && submitStatus !== 'error') {
      return undefined;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timeout = window.setTimeout(() => setSubmitStatus('idle'), 6000);
    return () => window.clearTimeout(timeout);
  }, [submitStatus]);

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
      {(submitStatus === 'success' || submitStatus === 'error') && (
        <div
          className={`fixed left-1/2 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 items-start gap-3 border px-5 py-4 shadow-lg ${
            submitStatus === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
          role={submitStatus === 'error' ? 'alert' : 'status'}
          aria-live={submitStatus === 'error' ? 'assertive' : 'polite'}
        >
          {submitStatus === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <p className="flex-1 text-sm font-semibold leading-6">
            {submitStatus === 'success'
              ? 'Appointment request sent. Our consultant will contact you to confirm.'
              : 'We could not send the request. Please try again or call the consultant directly.'}
          </p>
          <button
            type="button"
            onClick={() => setSubmitStatus('idle')}
            className="shrink-0 p-1 transition hover:opacity-70"
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <section className="relative min-h-[340px] overflow-hidden sm:min-h-[380px]">
        <img
          src="/images/banner.jpg"
          alt="Skin Consultation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto flex min-h-[340px] max-w-7xl flex-col items-center justify-center px-5 py-12 text-center text-white sm:min-h-[380px] sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Skin Consultation
          </h1>
          <p className="mt-6 max-w-3xl text-base font-medium leading-7 text-white/90 md:text-lg">
            Choose your concern, review a starter routine, and book a one-to-one session with our beauty consultant.
          </p>
        </div>
      </section>

      <section id="concerns" className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
        <div className="mb-8 border-b border-[#eee5e1] pb-5">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a94f61]">Skin profile · Step {step} of 2</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">{step === 1 ? 'Tell us about your skin' : 'Your routine guide'}</h2></div>
            <span className="text-sm font-medium text-gray-500">{step * 50}%</span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f1e8e4]"><div className="h-full rounded-full bg-[#b85f70] transition-all" style={{ width: `${step * 50}%` }} /></div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600">
            This is a general cosmetic routine guide, not a medical assessment. Introduce new products gradually and patch test when appropriate.
          </p>
        </div>

        {step === 1 && <>
        <p className="mb-3 text-sm font-semibold text-gray-800">1. What would you like help with?</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {concerns.map((concern) => (
            <button
              key={concern.id}
              type="button"
              onClick={() => setSelectedConcern(concern.id)}
              aria-pressed={selectedConcern === concern.id}
              className={`min-h-[160px] rounded-sm border p-5 text-left transition ${
                selectedConcern === concern.id
                  ? 'border-gray-950 bg-gray-950 text-white'
                  : 'border-gray-200 bg-white text-gray-950 hover:border-gray-950'
              }`}
            >
              <h3 className="text-lg font-semibold leading-tight">{concern.title}</h3>
              <p className={`mt-3 text-sm leading-6 ${selectedConcern === concern.id ? 'text-gray-200' : 'text-gray-600'}`}>
                {concern.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="h-fit rounded-sm border border-[#eee5e1] bg-white px-5 py-6 sm:px-6">
            <label className="block pb-1 text-sm font-semibold text-gray-950" htmlFor="skinType">
              2. How would you describe your skin?
            </label>
            <select
              id="skinType"
              value={skinType}
              onChange={(event) => setSkinType(event.target.value)}
              className="mt-3 h-11 w-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 focus:border-gray-950 focus:outline-none"
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

          <div className="rounded-sm border border-[#eee5e1] bg-white p-5 sm:p-6">
            <p className="text-sm font-semibold text-gray-950">3. Optional: choose your focus</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">Your answers shape a general routine suggestion and stay in this session.</p>
            <div className="mt-4 flex flex-wrap gap-2">{activeConcern.ingredients.map((ingredient) => <span key={ingredient} className="rounded-full bg-[#fbf3f1] px-3 py-1.5 text-xs font-medium text-[#884252]">{ingredient}</span>)}</div>
          </div>
        </div>
        <button type="button" onClick={() => setStep(2)} className="mt-6 min-h-12 rounded-sm bg-[#292526] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a94f61]">See my routine</button>
        </>}

        {step === 2 && <div className="rounded-sm border border-[#eee5e1] bg-[#fdfaf8] p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a94f61]">Suggested for {skinType.toLowerCase()} skin</p><h3 className="mt-2 text-xl font-semibold text-gray-950">{activeConcern.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{activeConcern.description} These are general suggestions; check each product label and patch test if you have sensitivities.</p></div><Link to={`/products?skinConcern=${activeConcern.id}`} className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#292526] px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#a94f61]">Browse matching products</Link></div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {[['Morning routine', activeConcern.morning], ['Evening routine', activeConcern.evening]].map(([title, routine]) => <div key={title} className="rounded-sm border border-[#eee5e1] bg-white p-5"><h4 className="font-semibold text-gray-900">{title}</h4><ol className="mt-4 space-y-3">{routine.map((item, index) => <li key={`${title}-${item}`} className="flex gap-3 text-sm text-gray-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8e8e9] text-xs font-semibold text-[#884252]">{index + 1}</span><span className="pt-0.5">{item}</span></li>)}</ol></div>)}
          </div>
          <div className="mt-5 rounded-sm border border-[#eee5e1] bg-white p-5"><h4 className="text-sm font-semibold text-gray-900">Ingredients to explore</h4><div className="mt-3 flex flex-wrap gap-2">{activeConcern.ingredients.map((ingredient) => <span key={ingredient} className="rounded-full bg-[#fbf3f1] px-3 py-1.5 text-xs font-medium text-[#884252]">{ingredient}</span>)}</div><p className="mt-3 text-xs leading-5 text-gray-500">Recommendations are educational and cosmetic, not a diagnosis. Product availability and ingredient lists vary by item.</p></div>
          <button type="button" onClick={() => setStep(1)} className="mt-5 min-h-10 rounded border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:border-gray-500">Back to skin profile</button>
        </div>}
      </section>

      <section id="appointment" className="border-t border-[#eee5e1] bg-[#fbf8f5] py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-9">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-pink-600">Step 2</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">Book a beauty consultation</h2>
            <p className="mt-5 text-sm leading-7 text-gray-600">
              Share your skin concern and preferred time. The consultant can confirm the appointment and recommend products before checkout.
            </p>

            <div className="mt-6 space-y-4 rounded-sm border border-[#eee5e1] bg-white p-5 sm:p-6">
              <h3 className="text-xl font-semibold text-gray-950">{consultant.name}</h3>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-pink-600">{consultant.role}</p>
              <div className="space-y-3 pt-2 text-sm text-gray-600">
                <a
                  href={`tel:${consultant.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 transition hover:text-pink-600"
                >
                  <Phone size={18} className="shrink-0" />
                  <span>{consultant.phone}</span>
                </a>
                <a
                  href={`mailto:${consultant.email}`}
                  className="flex items-center gap-3 transition hover:text-pink-600"
                >
                  <Mail size={18} className="shrink-0" />
                  <span>{consultant.email}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consultant.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition hover:text-pink-600"
                >
                  <MapPin size={18} className="shrink-0" />
                  <span>{consultant.location}</span>
                </a>
                <p className="flex items-center gap-3"><CalendarDays size={18} /> {consultant.hours}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-sm border border-[#eee5e1] bg-white p-5 shadow-[0_3px_16px_rgba(45,31,33,0.04)] sm:p-7">
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

            <button
              type="submit"
              disabled={submitStatus === 'sending'}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-sm bg-[#292526] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#a94f61] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={18} />
              {submitStatus === 'sending' ? 'Sending Request...' : 'Request Appointment'}
            </button>
          </form>
        </div>
      </section>

      <VirtualMakeupTryOn />
    </main>
  );
};

export default SkinConsultationPage;
