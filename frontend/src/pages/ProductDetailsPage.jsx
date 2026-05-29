import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import ReviewSection from '../components/ReviewSection';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const getTextValue = (value, fallback = '') => {
  if (!value) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return value.name || value.title || value._id || fallback;
};

const getNumberValue = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const getProductSlug = (product) =>
  String(product.name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isObjectId = (value) => /^[a-f\d]{24}$/i.test(value || '');

const DetailIcon = ({ name, className = 'h-6 w-6' }) => {
  const paths = {
    heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
    bag: 'M6 8h12l-1 13H7L6 8zm3 0a3 3 0 0 1 6 0',
    facebook: 'M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.4l.6-3h-3v-1.5c0-.8.2-1.5 1.4-1.5H17V8h-2z',
    whatsapp: 'M20 11.8a8 8 0 0 1-11.8 7L4 20l1.2-4A8 8 0 1 1 20 11.8zM9.5 8.5c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.1 1.1-1.1 2.6s1.1 3 1.2 3.2c.2.2 2.1 3.4 5.2 4.5 2.6.9 3.1.7 3.7.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.7-.4l-2.1-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.2-.2.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.6l-.9-2.2z',
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
};

const imageSet = [
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=85',
];

const localProducts = [
  ['Aliver Pumpkin Seed Oil 60ml', 'Skin Care, Body Care, Hair Care, Nourishing Oils', 'රු2,390.00', '', 5, '', false, 'A nourishing beauty oil made for soft, healthy-looking skin, body, and hair care routines.', imageSet[0]],
  ['Aliver Luscious Lips Shimmer Lip Oil', 'Lips', 'From රු1,390.00', '', 4, '-34%', false, 'A glossy shimmer lip oil that helps lips look hydrated, smooth, and naturally radiant.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85'],
  ['Aliver Teeth Whitening Foam Toothpaste Mint Flavour', 'Oral Care', 'රු1,090.00', 'රු1,650.00', 3, '-34%', true, 'A mint-flavoured foam toothpaste designed for a fresh, clean daily oral-care routine.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85'],
  ['Aliver Lip Plumper Lip Gloss for Fuller & Hydrated 2Pcs/Set', 'Lips, Lip glow', 'රු1,650.00', 'රු2,190.00', 4, '-25%', false, 'A two-piece lip gloss set made to give lips a fuller-looking, hydrated, high-shine finish.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85'],
  ['Brightening Vitamin C Serum', 'Skin Care', 'රු2,850.00', 'රු3,250.00', 5, '-12%', false, 'A brightening serum that supports a smoother, more radiant-looking daily skincare routine.', imageSet[1]],
  ['Rose Cloud Cleanser', 'Cleansers', 'රු3,250.00', '', 4, '', false, 'A gentle cleanser for a soft, refreshed feel without stripping the skin.', imageSet[2]],
  ['Daily Silk Sunscreen', 'Sun Care', 'රු4,200.00', 'රු4,900.00', 5, '-14%', false, 'A daily sunscreen made for lightweight, comfortable protection with a silky finish.', 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85'],
  ['Velvet Repair Cream', 'Moisturizers', 'රු5,750.00', '', 4, '', false, 'A rich repair cream that helps skin feel softer, smoother, and deeply moisturized.', imageSet[0]],
  ['Aliver Neem Oil 60ml', 'Nourishing Oils', 'රු2,290.00', '', 4, '', true, 'A cold-pressed neem oil for hair growth, scalp care, and skin nourishment.', 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?auto=format&fit=crop&w=900&q=85'],
  ['Aliver Organic Sunflower Oil For Skin 60ml', 'Skin Care, Body Care, Hair Care, Nourishing Oils', 'රු2,290.00', '', 4, '', false, 'A lightweight sunflower seed oil for soft, nourished skin and hair.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85'],
].map(([name, category, price, oldPrice, rating, discount, soldOut, description, image], index) => ({
  name,
  category,
  price,
  oldPrice,
  rating,
  discount,
  soldOut,
  description,
  image,
  countInStock: soldOut ? 0 : 10,
  sku: name.replace(/^Aliver\s+/i, ''),
  images: [image, imageSet[index % imageSet.length], imageSet[(index + 1) % imageSet.length]],
}));

const ProductDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [relatedPage, setRelatedPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProduct = async () => {
    if (!isObjectId(id)) return;

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
    const stateProduct = location.state?.product;
    const localProduct = localProducts.find((item) => getProductSlug(item) === id);
    const selectedProduct = stateProduct || localProduct;

    if (selectedProduct) {
      const productImages = selectedProduct.images?.length
        ? selectedProduct.images
        : [selectedProduct.image, ...imageSet.slice(0, 2)].filter(Boolean);

      setProduct({ ...selectedProduct, images: productImages });
      setActiveImage(selectedProduct.image || productImages[0] || '');
      setError('');
      setLoading(false);
      return;
    }

    if (isObjectId(id)) {
      fetchProduct();
      return;
    }

    setProduct(null);
    setError('Unable to load product details.');
    setLoading(false);
  }, [id, location.state]);

  if (loading) {
    return <div className="py-20 text-center font-serif text-stone-500">Loading beauty details...</div>;
  }

  if (error) {
    return (
      <div className="py-20 text-center font-serif text-stone-500">
        <p>{error}</p>
        <Link to="/products" className="mt-6 inline-flex bg-gray-950 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const allImages = [...new Set([product.image, ...(product.images || [])].filter(Boolean))].slice(0, 3);
  const price = getNumberValue(product.price);
  const oldPrice = getNumberValue(product.oldPrice, 0);
  const rating = getNumberValue(product.rating, 4.8);
  const reviewCount = getNumberValue(product.numReviews);
  const stockCount = product.soldOut ? 0 : getNumberValue(product.countInStock || product.stock, 10);
  const category = getTextValue(product.category);
  const sku = getTextValue(product.sku, product.name);
  const description = product.description || 'Discover the beauty essentials you need for an elevated daily routine.';
  const mainImage = activeImage || allImages[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80';
  const hasOldPrice = Boolean(product.oldPrice);
  const relatedProducts = localProducts.filter((item) => getProductSlug(item) !== id);
  const relatedPerPage = 4;
  const relatedPageCount = Math.max(1, Math.ceil(relatedProducts.length / relatedPerPage));
  const visibleRelatedProducts = relatedProducts.slice(
    relatedPage * relatedPerPage,
    relatedPage * relatedPerPage + relatedPerPage
  );

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <main className="min-h-screen bg-white text-gray-950">
      <section className="mx-auto grid max-w-[1540px] gap-10 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
        <div className="grid gap-7 md:grid-cols-[150px_1fr]">
          <div className="order-2 flex gap-4 overflow-x-auto md:order-1 md:flex-col md:items-center md:overflow-visible">
            {allImages.map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-white transition md:h-[150px] md:w-[150px] ${
                  activeImage === img ? 'border-gray-950' : 'border-gray-100 hover:border-pink-300'
                }`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}

            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => {
                  const currentIndex = allImages.indexOf(activeImage);
                  const previousIndex = currentIndex <= 0 ? allImages.length - 1 : currentIndex - 1;
                  setActiveImage(allImages[previousIndex]);
                }}
                className="inline-flex h-10 w-[70px] items-center justify-center rounded-lg bg-gray-50 text-2xl text-gray-500 transition hover:bg-pink-50 hover:text-pink-600"
                aria-label="Previous image"
              >
                ˄
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentIndex = allImages.indexOf(activeImage);
                  const nextIndex = currentIndex >= allImages.length - 1 ? 0 : currentIndex + 1;
                  setActiveImage(allImages[nextIndex]);
                }}
                className="inline-flex h-10 w-[70px] items-center justify-center rounded-lg bg-gray-50 text-2xl text-gray-500 transition hover:bg-pink-50 hover:text-pink-600"
                aria-label="Next image"
              >
                ˅
              </button>
            </div>
          </div>

          <div className="order-1 relative flex min-h-[560px] items-start justify-center bg-white pt-2 md:order-2">
            {product.soldOut && (
              <span className="absolute right-8 top-8 z-10 text-sm font-bold uppercase tracking-wide text-black">
                SOLD OUT
              </span>
            )}
            <img src={mainImage} alt={product.name} className="h-[540px] w-full max-w-[680px] object-contain" />
          </div>
        </div>

        <div className="lg:pt-10">
          <div className="mb-7 flex flex-wrap items-center gap-2 text-base text-gray-500">
            <Link to="/" className="transition hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="transition hover:text-pink-600">{category || 'Products'}</Link>
            <span>/</span>
            <span className="font-semibold text-gray-950">{product.name}</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-7 flex flex-wrap items-end gap-3">
            {hasOldPrice && (
              <span className="text-xl text-gray-400 line-through">
                {typeof product.oldPrice === 'string' ? product.oldPrice : `Rs. ${oldPrice.toFixed(2)}`}
              </span>
            )}
            <span className="text-3xl font-bold text-black">
              {typeof product.price === 'string' ? product.price : `Rs. ${price.toFixed(2)}`}
            </span>
          </div>

          <p className={`mt-6 text-lg font-bold ${product.soldOut ? 'text-red-600' : 'text-emerald-700'}`}>
            {product.soldOut ? 'Out of stock' : 'In stock'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-lg font-semibold text-gray-700">
            <button type="button" className="transition hover:text-pink-600">
              Compare
            </button>
            <button type="button" onClick={() => toggleWishlist(product)} className="transition hover:text-pink-600">
              Add to wishlist
            </button>
          </div>

          {!product.soldOut && (
            <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="h-12 w-full border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100 sm:w-28"
              >
                {[...Array(Math.max(stockCount, 1)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
              <button
                onClick={handleAddToCart}
                className="inline-flex h-12 flex-1 items-center justify-center bg-gray-950 px-8 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-pink-600"
              >
                Add to Cart
              </button>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-7 text-lg text-gray-500">
            <p><span className="font-bold text-gray-950">SKU:</span> {sku}</p>
            <p className="mt-4"><span className="font-bold text-gray-950">Category:</span> {category}</p>
            <p className="mt-4 flex items-center gap-3">
              <span className="font-bold text-gray-950">Share:</span>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Share on Facebook"
                className="inline-flex items-center justify-center text-gray-900 transition hover:text-pink-600"
              >
                <DetailIcon name="facebook" className="h-6 w-6" />
              </a>
              <a
                href="https://www.whatsapp.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Share on WhatsApp"
                className="inline-flex items-center justify-center text-gray-900 transition hover:text-pink-600"
              >
                <DetailIcon name="whatsapp" className="h-6 w-6" />
              </a>
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <RatingStars rating={rating} />
            <span>{rating.toFixed(1)} / 5</span>
            <span>{reviewCount} reviews</span>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-[1540px] px-6">
          <div className="flex justify-center gap-12">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`border-t-4 px-2 py-7 text-xl font-bold uppercase ${
                activeTab === 'description' ? 'border-black text-gray-950' : 'border-transparent text-gray-500'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`border-t-4 px-2 py-7 text-xl font-bold uppercase ${
                activeTab === 'reviews' ? 'border-black text-gray-950' : 'border-transparent text-gray-500'
              }`}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="pb-16">
            {activeTab === 'description' ? (
              <>
                <div className="mx-auto max-w-[1420px] py-8 text-left">
                  <h2 className="text-lg font-bold text-gray-600">{product.name}</h2>

                  <p className="mt-8 text-lg leading-8 text-gray-600">
                    Discover the natural beauty benefits of <strong>{product.name}</strong>, a
                    carefully selected essential for your skin, hair, and self-care routine.
                    {` ${description}`} Whether you are looking to refresh your daily care,
                    support a healthy glow, or add a nourishing step to your routine,
                    <strong> {product.name}</strong> offers a simple solution for everyday beauty needs.
                  </p>

                  <h3 className="mt-8 text-3xl font-bold text-gray-950">Key Benefits:</h3>

                  <div className="mt-7 space-y-2 text-lg leading-7 text-gray-600">
                    <p>
                      <span className="font-bold">✓ Nourishes & Softens</span> - Helps leave skin, hair, or lips feeling smooth, cared for, and refreshed.
                    </p>
                    <p>
                      <span className="font-bold">✓ Supports Daily Care</span> - Easy to include in your regular beauty routine for consistent results.
                    </p>
                    <p>
                      <span className="font-bold">✓ Promotes a Healthy Glow</span> - Helps improve the look of dullness and dryness for a more radiant finish.
                    </p>
                    <p>
                      <span className="font-bold">✓ Gentle Beauty Essential</span> - Suitable for everyday use as part of a simple self-care ritual.
                    </p>
                    <p>
                      <span className="font-bold">✓ Multi-Purpose Use</span> - Ideal for targeted care depending on your skin, hair, body, or lip needs.
                    </p>
                  </div>

                  <div className="mt-8 text-lg leading-8 text-gray-600">
                    <p className="font-bold">How to Use:</p>
                    <p>For skin: Apply a small amount to clean skin and gently massage until absorbed.</p>
                    <p>For hair: Apply to the scalp or hair lengths as needed, then style or rinse according to your routine.</p>
                    <p>For daily care: Use consistently as part of your morning or evening beauty routine.</p>
                  </div>

                  <p className="mt-8 text-lg leading-8 text-gray-600">
                    Embrace the beauty benefits of <strong>{product.name}</strong>, and enjoy a
                    refreshed, nourished, and confident routine every day.
                  </p>
                </div>

              </>
            ) : (
              <ReviewSection product={product} onReviewAdded={fetchProduct} />
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-[1540px] px-6">
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-gray-950">
            Related products
          </h2>

          <div className="relative">
            <button
              type="button"
              onClick={() => setRelatedPage((page) => (page === 0 ? relatedPageCount - 1 : page - 1))}
              className="absolute left-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-400 transition hover:text-gray-950 lg:flex"
              aria-label="Previous related products"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={() => setRelatedPage((page) => (page === relatedPageCount - 1 ? 0 : page + 1))}
              className="absolute right-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-400 transition hover:text-gray-950 lg:flex"
              aria-label="Next related products"
            >
              ›
            </button>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-14">
              {visibleRelatedProducts.map((relatedProduct) => {
                const relatedSlug = getProductSlug(relatedProduct);

                return (
                  <article key={relatedProduct.name} className="group relative text-center">
                    <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
                      <Link to={`/product/${relatedSlug}`} state={{ product: relatedProduct }} className="flex h-full w-full items-center justify-center">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="h-[300px] w-[300px] object-contain transition duration-500 group-hover:scale-105"
                        />
                      </Link>

                      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white opacity-0 shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition duration-300 group-hover:opacity-100">
                        <button
                          type="button"
                          aria-label="Add to cart"
                          onClick={() => addToCart(relatedProduct, 1)}
                          className="inline-flex h-14 w-14 items-center justify-center text-2xl text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
                        >
                          <DetailIcon name="bag" />
                        </button>
                        <button
                          type="button"
                          aria-label="Add to wishlist"
                          onClick={() => toggleWishlist(relatedProduct)}
                          className="inline-flex h-14 w-14 items-center justify-center text-2xl text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
                        >
                          <DetailIcon name="heart" />
                        </button>
                      </div>
                    </div>

                    <Link to={`/product/${relatedSlug}`} state={{ product: relatedProduct }}>
                      <h3 className="mx-auto min-h-[48px] max-w-[320px] text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
                        {relatedProduct.name}
                      </h3>
                    </Link>

                    <p className="mt-2 min-h-[24px] text-base text-gray-400">
                      {relatedProduct.category}
                    </p>

                    <div className="mt-3 flex justify-center text-xl leading-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= (relatedProduct.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2 text-lg font-bold">
                      {relatedProduct.oldPrice && (
                        <span className="text-base font-normal text-gray-400 line-through">
                          {relatedProduct.oldPrice}
                        </span>
                      )}
                      <span className="text-gray-950">{relatedProduct.price}</span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center gap-3">
              {Array.from({ length: relatedPageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setRelatedPage(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    index === relatedPage
                      ? 'bg-gray-700'
                      : 'border border-gray-300 bg-white hover:border-gray-500'
                  }`}
                  aria-label={`Go to related product page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default ProductDetailsPage;
