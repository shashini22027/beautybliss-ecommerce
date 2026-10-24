import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { selectUser } from '../redux/slices/authSlice';
import { formatPrice, parsePrice } from '../utils/currency';
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
const routineSteps = {
  cleanser: { label: 'Cleanser', terms: ['cleanser', 'face wash', 'cleansing'] },
  serum: { label: 'Treatment serum', terms: ['serum', 'niacinamide', 'vitamin c', 'hyaluronic'] },
  moisturizer: { label: 'Moisturiser', terms: ['moistur', 'cream', 'lotion', 'hydrating'] },
  sunscreen: { label: 'Sunscreen', terms: ['sunscreen', 'sun screen', 'spf', 'sunblock'] },
};
const concernStepOrder = {
  acne: ['cleanser', 'serum', 'moisturizer', 'sunscreen'],
  dryness: ['cleanser', 'serum', 'moisturizer', 'sunscreen'],
  'dark-spots': ['cleanser', 'serum', 'moisturizer', 'sunscreen'],
  sensitive: ['cleanser', 'moisturizer', 'sunscreen'],
};
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
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const products = useSelector((state) => state.products?.items || []);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedConcern, setSelectedConcern] = useState(concerns[0].id);
  const [skinType, setSkinType] = useState(skinTypes[0]);
  const [sensitivity, setSensitivity] = useState('Not sure');
  const [fragrancePreference, setFragrancePreference] = useState('No preference');
  const [savedRoutine, setSavedRoutine] = useState(false);
  const [routineNotice, setRoutineNotice] = useState('');
  const [savedRoutineData, setSavedRoutineData] = useState(null);
  const [savedRoutines, setSavedRoutines] = useState([]);
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
  const [submitError, setSubmitError] = useState('');
  const [appointmentConfig, setAppointmentConfig] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [submittedAppointment, setSubmittedAppointment] = useState(null);

  useEffect(() => {
    api.get('/appointments/config').then(({ data }) => setAppointmentConfig(data)).catch(() => setAvailabilityError('Appointment availability is temporarily unavailable. Please contact the consultant.'));
  }, []);

  const loadAppointmentSlots = async (date) => {
    setAvailableSlots([]);
    setAvailabilityError('');
    if (!date) return;
    setAvailabilityLoading(true);
    try {
      const { data } = await api.get('/appointments/availability', { params: { date } });
      setAvailableSlots(data.slots || []);
      if (!data.slots?.some((slot) => slot.available)) setAvailabilityError('No appointment slots are available on this date. Choose another working day.');
    } catch (error) {
      setAvailabilityError(error.response?.data?.message || 'Could not load appointment availability. Please try again.');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api.get('/products')
      .then(({ data }) => {
        if (active && Array.isArray(data)) setCatalogProducts(data);
      })
      .catch((error) => console.error('Could not load consultation product matches', error));
    return () => { active = false; };
  }, []);

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

  const productRecommendations = useMemo(() => {
    const order = concernStepOrder[activeConcern.id] || concernStepOrder.acne;
    const productCatalog = products.length ? products : catalogProducts;
    return order.map((stepKey) => {
      const stepInfo = routineSteps[stepKey];
      const matches = productCatalog.map((product) => {
        const searchable = [
          product.name, product.description, product.ingredients,
          ...(Array.isArray(product.keyIngredients) ? product.keyIngredients : []),
          product.category?.name || product.category, product.subcategory, product.brand,
        ].filter(Boolean).join(' ').toLowerCase();
        const matchedTerm = stepInfo.terms.some((term) => searchable.includes(term));
        const listedSkinTypes = Array.isArray(product.skinTypes) ? product.skinTypes : [];
        const listedConcerns = Array.isArray(product.skinConcerns) ? product.skinConcerns : [];
        const skinTypeMatch = skinType === 'Not sure' || listedSkinTypes.length === 0 || listedSkinTypes.includes(skinType);
        const sensitivityMatch = sensitivity !== 'Sensitive' || listedSkinTypes.length === 0 || listedSkinTypes.includes('Sensitive');
        const concernMatch = listedConcerns.length === 0 || listedConcerns.includes(activeConcern.id);
        const fragranceMatch = fragrancePreference !== 'Fragrance-free preferred' || product.fragranceFree !== false;
        const score = (listedSkinTypes.includes(skinType) ? 3 : 0)
          + (listedConcerns.includes(activeConcern.id) ? 3 : 0)
          + (product.fragranceFree === true && fragrancePreference === 'Fragrance-free preferred' ? 2 : 0)
          + (Number(product.rating || 0) > 0 ? Number(product.rating) / 5 : 0);
        return { product, matchedTerm: stepInfo.terms.some((term) => searchable.includes(term)), skinTypeMatch, sensitivityMatch, concernMatch, fragranceMatch, score };
      }).filter((match) => match.matchedTerm && match.skinTypeMatch && match.sensitivityMatch && match.concernMatch && match.fragranceMatch)
        .sort((first, second) => {
          const firstAvailable = Number(first.product.countInStock ?? 0) > 0;
          const secondAvailable = Number(second.product.countInStock ?? 0) > 0;
          return Number(secondAvailable) - Number(firstAvailable) || second.score - first.score;
        });
      const match = matches[0];
      const product = match?.product || null;
      const hasSkinTypeTag = product?.skinTypes?.includes(skinType);
      const hasConcernTag = product?.skinConcerns?.includes(activeConcern.id);
      const whyRecommended = hasSkinTypeTag && hasConcernTag
        ? `Catalog tags list this for ${skinType.toLowerCase()} skin and ${activeConcern.title.toLowerCase()}.`
        : hasConcernTag
          ? `Catalog tags list this for ${activeConcern.title.toLowerCase()}; skin type suitability is not specified.`
          : hasSkinTypeTag
            ? `Catalog tags list this for ${skinType.toLowerCase()} skin; this concern match is based on the product text.`
            : 'Matched by product name or description for this routine step; suitability tags are not provided.';
      return {
        key: stepKey,
        label: stepInfo.label,
        product,
        whyRecommended,
        fragranceVerified: !product || fragrancePreference !== 'Fragrance-free preferred' || product.fragranceFree === true,
      };
    });
  }, [activeConcern, catalogProducts, fragrancePreference, products, sensitivity, skinType]);

  const routineStorageKey = `beautybliss-routine-${user?._id || user?.id || user?.email || 'guest'}`;

  useEffect(() => {
    if (user?._id || user?.id) {
      api.get('/users/profile').then(({ data }) => {
        const routines = data.savedRoutines || [];
        setSavedRoutines(routines);
        const latest = [...routines].sort((left, right) => new Date(right.savedAt) - new Date(left.savedAt))[0] || null;
        setSavedRoutineData(latest);
        setSavedRoutine(Boolean(latest));
      }).catch(() => {
        setSavedRoutines([]);
        setSavedRoutineData(null);
        setSavedRoutine(false);
      });
      return;
    }
    try {
      const storedRoutine = JSON.parse(localStorage.getItem(routineStorageKey) || 'null');
      setSavedRoutineData(storedRoutine);
      setSavedRoutines(storedRoutine ? [storedRoutine] : []);
      setSavedRoutine(Boolean(storedRoutine));
    } catch {
      setSavedRoutineData(null);
      setSavedRoutines([]);
      setSavedRoutine(false);
    }
  }, [routineStorageKey, user?._id, user?.id]);

  const saveCurrentRoutine = async () => {
    const routine = {
      concernId: activeConcern.id,
      concernTitle: activeConcern.title,
      skinType,
      sensitivity,
      fragrancePreference,
      savedAt: new Date().toISOString(),
    };
    try {
      if (user?._id || user?.id) {
        const { data } = await api.post('/users/profile/routines', routine);
        const routines = data.savedRoutines || [];
        setSavedRoutines(routines);
        setSavedRoutineData(routines.find((item) => item.concernId === routine.concernId && item.skinType === routine.skinType) || routine);
        setRoutineNotice('Routine saved to your account.');
      } else {
        localStorage.setItem(routineStorageKey, JSON.stringify(routine));
        setSavedRoutines([routine]);
        setSavedRoutineData(routine);
        setRoutineNotice('Routine saved in this browser. Sign in to keep it with your account.');
      }
      setSavedRoutine(true);
    } catch (error) {
      setRoutineNotice(error.response?.data?.message || 'Could not save this routine. Please try again.');
    }
  };

  const loadSavedRoutine = () => {
    if (!savedRoutineData) return;
    setSelectedConcern(savedRoutineData.concernId);
    setSkinType(savedRoutineData.skinType);
    setSensitivity(savedRoutineData.sensitivity || 'Not sure');
    setFragrancePreference(savedRoutineData.fragrancePreference || 'No preference');
    setStep(2);
    setRoutineNotice('Your saved routine is loaded.');
  };

  const addRoutineToCart = () => {
    const available = productRecommendations.filter(({ product }) => product && Number(product.countInStock ?? 1) > 0);
    available.forEach(({ product }) => dispatch(addToCart({ product, qty: 1 })));
    setRoutineNotice(available.length ? `${available.length} recommended ${available.length === 1 ? 'product added' : 'products added'} to your cart.` : 'No matching in-stock products are available for this routine yet.');
  };

  const addProductToCart = (product) => {
    dispatch(addToCart({ product, qty: 1 }));
    setRoutineNotice(`${product.name} added to your cart.`);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'date') {
      setFormData((prev) => ({ ...prev, date: value, time: '' }));
      loadAppointmentSlots(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('sending');
    setSubmitError('');
    setSubmittedAppointment(null);

    try {
      const { data } = await api.post('/appointments', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        mode: formData.mode,
        concern: activeConcern.title,
        skinType,
        sensitivity,
        fragrancePreference,
        notes: formData.notes,
      });

      setSubmittedAppointment(data);
      setSubmitStatus('success');
      setAvailableSlots((slots) => slots.map((slot) => slot.time === formData.time ? { ...slot, available: false } : slot));
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
      setSubmitError(error.response?.data?.message || 'We could not send the request. Please try again or call the consultant directly.');
      if (error.response?.status === 409) loadAppointmentSlots(formData.date);
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
              ? (submittedAppointment?.customerEmailSent ? 'Your appointment request is pending. We will email you when the consultant confirms it.' : 'Your request is pending. Use the secure management link below to manage it.')
              : submitError || 'We could not send the request. Please try again or call the consultant directly.'}
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
            <p className="text-sm font-semibold text-gray-950">3. Product preferences</p>
            <label className="mt-3 block text-xs font-medium text-gray-600" htmlFor="sensitivity">Sensitivity</label>
            <select id="sensitivity" value={sensitivity} onChange={(event) => setSensitivity(event.target.value)} className="mt-1 h-10 w-full border border-gray-200 bg-white px-3 text-sm"><option>Not sure</option><option>Not sensitive</option><option>Sensitive</option></select>
            <label className="mt-3 block text-xs font-medium text-gray-600" htmlFor="fragrancePreference">Fragrance preference</label>
            <select id="fragrancePreference" value={fragrancePreference} onChange={(event) => setFragrancePreference(event.target.value)} className="mt-1 h-10 w-full border border-gray-200 bg-white px-3 text-sm"><option>No preference</option><option>Fragrance-free preferred</option></select>
            {savedRoutine && <button type="button" onClick={loadSavedRoutine} className="mt-4 text-sm font-medium text-[#884252] underline">Load my saved routine</button>}
          </div>
        </div>
        <button type="button" onClick={() => setStep(2)} className="mt-6 min-h-12 rounded-sm bg-[#292526] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a94f61]">See my routine</button>
        </>}

        {step === 2 && <div className="rounded-sm border border-[#eee5e1] bg-[#fdfaf8] p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a94f61]">Suggested for {skinType.toLowerCase()} skin · {sensitivity.toLowerCase()} sensitivity</p><h3 className="mt-2 text-xl font-semibold text-gray-950">{activeConcern.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{activeConcern.description} These are general cosmetic suggestions, not treatment or diagnosis. Review each product label for full ingredients and allergens before use.</p></div><Link to={`/products?skinConcern=${activeConcern.id}`} className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#292526] px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#a94f61]">Browse matching products</Link></div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {[['Morning routine', activeConcern.morning], ['Evening routine', activeConcern.evening]].map(([title, routine]) => <div key={title} className="rounded-sm border border-[#eee5e1] bg-white p-5"><h4 className="font-semibold text-gray-900">{title}</h4><ol className="mt-4 space-y-3">{routine.map((item, index) => <li key={`${title}-${item}`} className="flex gap-3 text-sm text-gray-700"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8e8e9] text-xs font-semibold text-[#884252]">{index + 1}</span><span className="pt-0.5">{item}</span></li>)}</ol></div>)}
          </div>
          <div className="mt-5 rounded-sm border border-[#eee5e1] bg-white p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h4 className="font-semibold text-gray-900">Products for your routine</h4><p className="mt-1 text-xs text-gray-500">Matched from current catalog names and descriptions. Ingredient details are shown only where supplied by the product listing.</p></div><button type="button" onClick={addRoutineToCart} disabled={!productRecommendations.some(({ product }) => product && Number(product.countInStock ?? 1) > 0)} className="min-h-10 rounded-sm bg-[#292526] px-4 text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#a94f61] disabled:cursor-not-allowed disabled:opacity-50">Add available set to cart</button></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{productRecommendations.map(({ key, label, product, fragranceVerified, whyRecommended }) => <article key={key} className="rounded border border-[#eee5e1] bg-[#fdfaf8] p-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#a94f61]">{label}</p>{product ? <><h5 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold text-gray-900">{product.name}</h5><p className="mt-2 text-sm font-semibold text-gray-900">{typeof product.price === 'number' ? formatPrice(product.price) : product.price || 'See product page'}</p><p className="mt-2 line-clamp-3 min-h-[3.75rem] text-xs leading-5 text-gray-600">{product.description || 'Review the product page and packaging for ingredients and suitability.'}</p><p className="mt-2 text-xs leading-5 text-[#884252]">Why this match: {whyRecommended}</p>{product.keyIngredients?.length > 0 && <p className="mt-2 text-[11px] leading-4 text-gray-600">Key ingredients: {product.keyIngredients.join(', ')}</p>}<p className="mt-2 text-[11px] font-medium text-gray-500">{Number(product.countInStock ?? 1) > 0 ? 'Available' : 'Currently out of stock'}</p>{!fragranceVerified && <p className="mt-2 text-[11px] leading-4 text-amber-800">Fragrance-free status is not verified. Check the package before use.</p>}{product.allergyWarnings && <p className="mt-2 text-[11px] leading-4 text-amber-900">Label warning: {product.allergyWarnings}</p>}<div className="mt-3 flex flex-wrap gap-2"><Link to={`/product/${product._id || product.id}`} state={{ product }} className="text-xs font-medium text-[#884252] underline">Details</Link>{Number(product.countInStock ?? 1) > 0 && <button type="button" onClick={() => addProductToCart(product)} className="text-xs font-semibold text-gray-800 underline">Add to cart</button>}</div></> : <p className="mt-3 text-xs leading-5 text-gray-500">No catalog match found for this routine step. Browse the store or ask our consultant for help.</p>}</article>)}</div>
            <p className="mt-4 border-t border-[#eee5e1] pt-3 text-xs leading-5 text-amber-800">Ingredient lists and allergy information may be incomplete in online listings. Always check the package for full ingredients and avoid known allergens. Stop use if irritation occurs.</p>
            <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={saveCurrentRoutine} className="min-h-10 rounded border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:border-gray-500">{savedRoutine ? 'Update saved routine' : 'Save this routine'}</button>{savedRoutine && <button type="button" onClick={loadSavedRoutine} className="min-h-10 rounded border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:border-gray-500">Reopen saved routine</button>}</div>
            {routineNotice && <p className="mt-3 text-sm font-medium text-[#884252]" role="status">{routineNotice}</p>}
          </div>
          <div className="mt-5 rounded-sm border border-[#eee5e1] bg-white p-5"><h4 className="text-sm font-semibold text-gray-900">Ingredients to explore</h4><div className="mt-3 flex flex-wrap gap-2">{activeConcern.ingredients.map((ingredient) => <span key={ingredient} className="rounded-full bg-[#fbf3f1] px-3 py-1.5 text-xs font-medium text-[#884252]">{ingredient}</span>)}</div><p className="mt-3 text-xs leading-5 text-gray-500">Recommendations are educational and cosmetic, not a diagnosis. Product availability and ingredient lists vary by item.</p></div>
          <button type="button" onClick={() => setStep(1)} className="mt-5 min-h-10 rounded border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:border-gray-500">Back to skin profile</button>
        </div>}
      </section>

      <VirtualMakeupTryOn />

      <section id="appointment" className="border-t border-[#eee5e1] bg-[#fbf8f5] py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-9">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-pink-600">Step 3 · Optional</p>
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
                <p className="flex items-center gap-3"><CalendarDays size={18} /> {appointmentConfig ? 'Monday–Saturday, 10:00 AM–6:00 PM · 30-minute slots · Sri Lanka time' : consultant.hours}</p>
                <p className="text-xs leading-5 text-gray-500">Appointments remain requests until confirmed by the consultant. Cancel or reschedule at least 12 hours before your slot.</p>
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
                  {(appointmentConfig?.modes || appointmentModes).map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Preferred date</label>
                <input type="date" name="date" min={new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())} value={formData.date} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">Preferred time</label>
                <select name="time" value={formData.time} onChange={handleChange} required disabled={!formData.date || availabilityLoading || availableSlots.length === 0} className="w-full border border-gray-200 px-4 py-3 text-sm focus:border-gray-950 focus:outline-none disabled:bg-gray-50">
                  <option value="">{availabilityLoading ? 'Loading available times…' : 'Select an available time'}</option>
                  {availableSlots.filter((slot) => slot.available).map((slot) => <option key={slot.time} value={slot.time}>{slot.time}</option>)}
                </select>
              </div>
            </div>
            {availabilityError && <p className="mt-3 text-sm text-amber-800" role="status">{availabilityError}</p>}

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
          {submittedAppointment && <div className="mt-4 border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"><p className="font-semibold">Request received · Pending confirmation</p><p className="mt-1">{submittedAppointment.appointment?.date} at {submittedAppointment.appointment?.time} · {submittedAppointment.appointment?.mode}</p><p className="mt-2">{submittedAppointment.customerEmailSent ? 'We emailed your secure appointment management link.' : 'We could not send the email, so save this secure management link to make changes later.'}</p><a href={submittedAppointment.manageUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold underline">Manage this appointment</a><p className="mt-2 text-xs">Changes are available until 12 hours before your appointment.</p></div>}
        </div>
      </section>

    </main>
  );
};

export default SkinConsultationPage;
