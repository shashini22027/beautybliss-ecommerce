import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import ReviewSection from '../components/ReviewSection';
import { CartContext } from '../context/CartContext';

const getTextValue = (value, fallback = '') => {
  if (!value) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return value.name || value.title || value._id || fallback;
};

const getNumberValue = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Unable to load product details.');
      }

      const productData = data.product || data;
      setProduct(productData);
      setActiveImage(productData.image || productData.images?.[0] || '');
    } catch (err) {
      setError(err.message || 'Unable to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-stone-500 font-serif">Loading beauty details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-stone-500 font-serif">
        <p>{error}</p>
        <Link to="/products" className="mt-6 inline-flex rounded-full bg-gray-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const allImages = [...new Set([product.image, ...(product.images || [])].filter(Boolean))];
  const price = getNumberValue(product.price);
  const rating = getNumberValue(product.rating, 4.8);
  const reviewCount = getNumberValue(product.numReviews);
  const stockCount = getNumberValue(product.countInStock || product.stock);
  const category = getTextValue(product.category);
  const brand = getTextValue(product.brand, 'BeautyBliss');
  const size = getTextValue(product.size, 'Standard');
  const skinType = getTextValue(product.skinType, 'All skin types');
  const mainImage =
    activeImage ||
    allImages[0] ||
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80';

  const handleMainImageClick = () => {
    if (allImages.length <= 1) return;
    const currentIndex = allImages.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setActiveImage(allImages[nextIndex]);
  };

  return (
    <main className="min-h-screen bg-[#faf7f4] px-4 py-10 text-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] lg:p-10">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-pink-500">Product Details</p>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-gray-950 sm:text-5xl">{product.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">Discover the beauty essentials you need for an elevated daily routine.</p>
            </div>
            <Link to="/products" className="inline-flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-sm font-bold uppercase tracking-[0.18em] text-gray-950 transition hover:border-pink-300 hover:bg-pink-50">Continue shopping</Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-[#fff4f6] cursor-pointer" onClick={handleMainImageClick}>
                <div className="flex h-[520px] items-center justify-center">
                  <img src={mainImage} alt={product.name} className="h-full w-full object-cover transition duration-500" />
                </div>
                {allImages.length > 1 && (
                  <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-700 shadow-sm">Tap to cycle images</span>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-1">
                  {allImages.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(img)} className={`h-20 w-20 overflow-hidden rounded-3xl border-2 transition ${activeImage === img ? 'border-pink-500 shadow-lg' : 'border-pink-100 hover:border-pink-300'}`}>
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-pink-100 bg-[#fff4f6] p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-gray-500">
                  <span>{brand}</span>
                  {category && <span className="rounded-full bg-white px-3 py-1 text-pink-600">{category}</span>}
                  {stockCount > 0 ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">In stock</span> : <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">Out of stock</span>}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Price</p>
                    <p className="text-4xl font-bold text-gray-950">${price.toFixed(2)}</p>
                  </div>
                  <div className="rounded-3xl bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">{rating.toFixed(1)}<span className="ml-2 text-gray-400">/ 5</span></div>
                </div>

                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  <RatingStars rating={rating} />
                  <span>{reviewCount} reviews</span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-4 text-sm text-gray-600 shadow-sm"><span className="block text-xs uppercase tracking-[0.3em] text-gray-400">Size</span><span className="font-semibold text-gray-900">{size}</span></div>
                  <div className="rounded-3xl bg-white p-4 text-sm text-gray-600 shadow-sm"><span className="block text-xs uppercase tracking-[0.3em] text-gray-400">Skin type</span><span className="font-semibold text-gray-900">{skinType}</span></div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-950">About this product</h2>
                <p className="mt-4 text-sm leading-7 text-gray-600">{product.description}</p>
                <div className="mt-6 flex flex-wrap gap-3"><span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-pink-700">Cruelty free</span><span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-pink-700">Vegan formula</span><span className="rounded-full bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-pink-700">Dermatologist tested</span></div>
              </div>

              <div className="rounded-[2rem] border border-pink-100 bg-[#fff4f6] p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-pink-100 text-pink-700">+</span>
                    <div><p className="text-sm font-semibold text-gray-950">Ready to glow?</p><p className="text-sm text-gray-500">Add this product to your cart and continue exploring the collection.</p></div>
                  </div>
                  <div className="flex flex-1 gap-3">
                    <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-24 rounded-3xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100">
                      {[...Array(Math.max(stockCount, 1)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                    <button onClick={() => addToCart(product, qty)} className="inline-flex flex-1 items-center justify-center rounded-3xl bg-gray-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600">Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReviewSection product={product} onReviewAdded={fetchProduct} />
      </div>
    </main>
  );
};

export default ProductDetailsPage;
