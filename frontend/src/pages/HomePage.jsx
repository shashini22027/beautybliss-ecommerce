import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import FeaturedProducts from '../components/FeaturedProducts';
import ShopByCategories from '../components/ShopByCategories';
import ProductSection from '../components/ProductSection';
import Testimonials from '../components/Testimonials';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const StatBadge = ({ value, label }) => (
  <div className="text-center">
    <p
      className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text"
      style={{ backgroundImage: 'linear-gradient(90deg, #d8a7b1, #f4d6cc)' }}
    >
      {value}
    </p>
    <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b6674] font-bold mt-1">
      {label}
    </p>
  </div>
);

const CategoryCard = ({ title, subtitle, to, image, video, accent }) => (
  <Link
    to={to}
    className="group relative block min-h-[280px] overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    style={{ background: 'linear-gradient(135deg, #fff7f2 0%, #f7dce3 100%)' }}
  >
    {video && (
      <video
        src={video}
        poster={image}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
      />
    )}
    {!video && (
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-95"
      />
    )}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to top, rgba(255,247,242,0.94) 0%, rgba(255,247,242,0.62) 48%, rgba(255,247,242,0.12) 100%)',
      }}
    />
    <div className="relative z-10 flex min-h-[280px] flex-col items-start justify-end gap-4 p-10">
      <div>
        <p
          className="mb-1 text-xs font-bold uppercase tracking-[0.35em]"
          style={{ color: accent }}
        >
          {subtitle}
        </p>
        <h3 className="font-serif text-2xl font-bold text-[#3a2430] drop-shadow-sm transition-colors group-hover:text-[#8f4d63]">
          {title}
        </h3>
      </div>
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8b6674] transition-colors group-hover:text-[#8f4d63]">
        Explore Collection
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </span>
    </div>
    <div
      className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
      style={{ background: `linear-gradient(90deg, ${accent}, #fff1e8)` }}
    />
  </Link>
);

const HomeCategoryTile = ({ title, to, image, objectPosition = 'center' }) => (
  <Link
    to={to}
    className="group relative block aspect-[5/4] overflow-hidden rounded-xl bg-gray-100"
  >
    <img
      src={image}
      alt={title}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      style={{ objectPosition }}
    />
    <div className="absolute inset-0 bg-black/10 transition duration-300 group-hover:bg-black/25" />
    <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
      <h3 className="text-2xl font-extrabold uppercase tracking-tight text-white drop-shadow-md md:text-[26px]">
        {title}
      </h3>
    </div>
  </Link>
);

const ServicePill = ({ text }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white px-6 py-4 shadow-sm">
    <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
    <span className="text-sm font-bold uppercase tracking-widest text-gray-600">
      {text}
    </span>
  </div>
);

const getProductImage = (product) =>
  product.image ||
  (Array.isArray(product.images) ? product.images[0] : '') ||
  '/images/banner.jpg';

const getProductCategoryLabel = (product) => {
  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name || ''
      : product.category || '';
  const subcategory = product.subcategory || '';

  if (categoryName && subcategory) {
    return `${categoryName}, ${subcategory}`;
  }

  return categoryName || subcategory || '';
};

const getDiscountLabel = (product) => {
  if (product.discountLabel) {
    return product.discountLabel;
  }

  const price = Number(product.price || 0);
  const compareAtPrice = Number(product.compareAtPrice || 0);

  if (compareAtPrice > price && compareAtPrice > 0) {
    const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    return `-${discount}%`;
  }

  return '';
};

const getDisplayPrice = (value) =>
  typeof value === 'number' ? formatPrice(value) : value || 'View Product';

const mapHomepageProduct = (product, section) => ({
  _id: product._id,
  name: product.name,
  category: getProductCategoryLabel(product),
  price: getDisplayPrice(product.price),
  oldPrice:
    product.compareAtPrice && product.compareAtPrice > product.price
      ? getDisplayPrice(product.compareAtPrice)
      : '',
  rating: Math.round(Number(product.rating || 0)),
  discount:
    section === 'newArrival'
      ? 'New'
      : section === 'hotDeal'
        ? getDiscountLabel(product)
        : product.discountLabel || getDiscountLabel(product),
  soldOut: Number(product.countInStock || 0) === 0,
  image: getProductImage(product),
  originalProduct: product,
});

const HomePage = () => {
  const dispatch = useDispatch();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = ['/images/banner.jpg'];

  const featuredProducts = [
    {
      name: 'Hydra Glow Serum',
      category: 'Skincare, Serums',
      price: 'Rs. 2,970.00',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Rose Quartz Face Roller',
      category: 'Beauty Tools, Rollers',
      price: 'Rs. 1,200.00',
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Argan Oil Hair Mask',
      category: 'Haircare, Treatments',
      price: 'Rs. 1,850.00',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Midnight Orchid Perfume',
      category: 'Fragrances, Perfumes',
      price: 'Rs. 4,520.00',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85',
    },
  ];

  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestSellerPage, setBestSellerPage] = useState(0);
  const productsPerPage = 4;
  const bestSellerPageCount = Math.ceil(bestSellingProducts.length / productsPerPage);
  const visibleBestSellers = bestSellingProducts.slice(
    bestSellerPage * productsPerPage,
    bestSellerPage * productsPerPage + productsPerPage
  );

  const goToPrevBestSellers = () => {
    setBestSellerPage((page) =>
      page === 0 ? bestSellerPageCount - 1 : page - 1
    );
  };

  const goToNextBestSellers = () => {
    setBestSellerPage((page) =>
      page === bestSellerPageCount - 1 ? 0 : page + 1
    );
  };

const [newArrivalProducts, setNewArrivalProducts] = useState([]);
const [hotDealProducts, setHotDealProducts] = useState([]);
const [newArrivalPage, setNewArrivalPage] = useState(0);
const [hotDealPage, setHotDealPage] = useState(0);
const promoProductsPerPage = 4;
const newArrivalPageCount = Math.ceil(newArrivalProducts.length / promoProductsPerPage);
const hotDealPageCount = Math.ceil(hotDealProducts.length / promoProductsPerPage);
const visibleNewArrivals = newArrivalProducts.slice(
  newArrivalPage * promoProductsPerPage,
  newArrivalPage * promoProductsPerPage + promoProductsPerPage
);
const visibleHotDeals = hotDealProducts.slice(
  hotDealPage * promoProductsPerPage,
  hotDealPage * promoProductsPerPage + promoProductsPerPage
);

const goToPrevNewArrivals = () => {
  setNewArrivalPage((page) => (page === 0 ? newArrivalPageCount - 1 : page - 1));
};

const goToNextNewArrivals = () => {
  setNewArrivalPage((page) => (page === newArrivalPageCount - 1 ? 0 : page + 1));
};

const goToPrevHotDeals = () => {
  setHotDealPage((page) => (page === 0 ? hotDealPageCount - 1 : page - 1));
};

const goToNextHotDeals = () => {
  setHotDealPage((page) => (page === hotDealPageCount - 1 ? 0 : page + 1));
};

  useEffect(() => {
    let isMounted = true;

    const loadHomepageSections = async () => {
      try {
        const [bestSellerRes, newArrivalRes, hotDealRes] = await Promise.all([
          api.get('/products?section=bestSeller&limit=8'),
          api.get('/products?section=newArrival&limit=8'),
          api.get('/products?section=hotDeal&limit=8'),
        ]);

        if (!isMounted) {
          return;
        }

        const bestSellerItems = Array.isArray(bestSellerRes.data) ? bestSellerRes.data : [];
        const newArrivalItems = Array.isArray(newArrivalRes.data) ? newArrivalRes.data : [];
        const hotDealItems = Array.isArray(hotDealRes.data) ? hotDealRes.data : [];

        if (bestSellerItems.length > 0) {
          setBestSellingProducts(bestSellerItems.map((product) => mapHomepageProduct(product, 'bestSeller')));
        }

        if (newArrivalItems.length > 0) {
          setNewArrivalProducts(newArrivalItems.map((product) => mapHomepageProduct(product, 'newArrival')));
        }

        if (hotDealItems.length > 0) {
          setHotDealProducts(hotDealItems.map((product) => mapHomepageProduct(product, 'hotDeal')));
        }
      } catch (error) {
        console.error('Failed to load homepage sections', error);
      }
    };

    loadHomepageSections();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-white">
        {/* Background Image Container - Full Width */}
        <div className="absolute inset-0 h-full w-full select-none z-0">
          {heroImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt="BeautyBliss skincare ritual"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'z-0 opacity-100' : '-z-10 opacity-0'
              }`}
              style={{ filter: 'brightness(1.02) contrast(1.02)' }}
            />
          ))}

          {/* Gradient Overlay for Text Readability */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 40%, transparent 100%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-10 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #ffffff 0%, transparent 100%)',
            }}
          />
        </div>

        {/* Text Content */}
        <div className="relative z-20 flex w-full flex-col justify-center px-8 py-24 md:w-1/2 md:px-16 lg:px-24">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-rose-300" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#9d5f72]">
              BeautyBliss Luxury Skincare
            </span>
          </div>

          <h1
            className="mb-6 font-serif font-bold leading-[1.05] tracking-tight text-[#2f2029]"
            style={{ fontSize: 'clamp(2.7rem, 5vw, 5rem)' }}
          >
            Glow That
            <br />
            <span className="whitespace-nowrap">Feels Effortless</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #d8a7b1, #f4d6cc)',
              }}
            >
              Every Day
            </span>
          </h1>

          <p className="mb-10 max-w-sm text-sm leading-relaxed text-[#785d68] md:text-base">
            Discover skin-loving formulas made for hydrated, radiant, confident
            beauty routines.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/products"
              className="inline-block bg-[#3a2430] px-11 py-[18px] text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#5b2c45] active:scale-95"
            >
              Shop Products
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-10 border-t border-rose-300/40 pt-8">
            <StatBadge value="50+" label="Glow Essentials" />
            <StatBadge value="24H" label="Hydration Care" />
            <StatBadge value="4.9" label="Client Rating" />
            <StatBadge value="100%" label="Cruelty Free" />
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-3 w-3 rounded-full border transition-all duration-300 ${
                idx === currentImageIndex
                  ? 'scale-125 border-transparent bg-rose-400 shadow-[0_0_10px_rgba(244,214,204,0.65)]'
                  : 'border-rose-400/60 bg-transparent hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="overflow-hidden border-y border-rose-100 bg-[#fffafa] py-5">
        <div className="flex gap-16 whitespace-nowrap animate-marquee">
          {[
            'Free Delivery On Selected Orders',
            'Dermatology-Inspired Formulas',
            'Cruelty-Free Beauty',
            'Glow Routine Essentials',
            'Secure Online Checkout',
            'Easy Returns',
            'Free Delivery On Selected Orders',
            'Dermatology-Inspired Formulas',
          ].map((text, index) => (
            <span
              key={`${text}-${index}`}
              className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

    <section className="mx-auto max-w-[1490px] px-6 py-20">
  <div className="mb-10 text-center">
    <h2 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
      Shop by Categories
    </h2>
    <p className="mx-auto mt-6 max-w-3xl text-lg leading-7 text-gray-500">
      Browse our curated categories to find exactly what you need, from skincare to beauty tools.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <HomeCategoryTile
      title="Skincare"
      to="/category/skincare"
      image="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Haircare"
      to="/category/haircare"
      image="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Makeup"
      to="/category/makeup"
      image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Fragrances"
      to="/category/fragrances"
      image="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Bath & Body"
      to="/category/bath-body"
      image="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Beauty Tools"
      to="/category/beauty-tools"
      image="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=85"
    />
  </div>
</section>

{bestSellingProducts.length > 0 && (
<section className="bg-white py-20">
  <div className="mx-auto max-w-[1540px] px-6">
    <div className="mb-14 text-center">
      <h2 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
        Best Selling Products
      </h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-7 text-gray-500">
        Shop our top-rated bestsellers, trusted by customers for their quality and effectiveness.
      </p>
    </div>

    <div className="relative">
      <button
        type="button"
        onClick={goToPrevBestSellers}
        className="absolute left-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-500 transition hover:text-gray-950 lg:flex"
        aria-label="Previous products"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={goToNextBestSellers}
        className="absolute right-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-400 transition hover:text-gray-950 lg:flex"
        aria-label="Next products"
      >
        ›
      </button>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-14">
        {visibleBestSellers.map((product) => (
          <div
            key={product._id}
            className="group relative block text-center"
          >
            <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
              {product.discount && (
                <span className="absolute left-5 top-3 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                  {product.discount}
                </span>
              )}

              {product.soldOut && (
                <span className="absolute left-5 top-16 z-10 text-sm font-bold uppercase tracking-wide text-black">
                  SOLD OUT
                </span>
              )}

              <Link
                to={`/product/${product._id}`}
                state={{ product: product.originalProduct || product }}
                className="relative z-0 block h-full w-full"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white opacity-0 shadow-lg transition duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(addToCart({ product: product.originalProduct || product, qty: 1 }));
                  }}
                  className="flex h-14 w-14 items-center justify-center border-r border-gray-100 text-gray-700 transition hover:bg-gray-950 hover:text-white"
                  aria-label="View cart"
                  title="View cart"
                >
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 7h12l-1 13H7L6 7Z" />
                    <path d="M9 7a3 3 0 0 1 6 0" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(toggleWishlist(product.originalProduct || product));
                  }}
                  className="flex h-14 w-14 items-center justify-center text-gray-700 transition hover:bg-gray-950 hover:text-white"
                  aria-label="View wishlist"
                  title="View wishlist"
                >
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                </button>
              </div>
            </div>

            <Link
              to={`/product/${product._id}`}
              state={{ product: product.originalProduct || product }}
              className="block"
            >
              <h3 className="mx-auto min-h-[48px] max-w-[320px] text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
                {product.name}
              </h3>

              <p className="mt-2 min-h-[24px] text-base text-gray-400">
                {product.category}
              </p>

              <div className="mt-3 flex justify-center text-xl leading-none">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 text-lg font-bold">
                {product.oldPrice && (
                  <span className="text-base font-normal text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                )}
                <span className="text-gray-950">{product.price}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {Array.from({ length: bestSellerPageCount }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setBestSellerPage(index)}
            className={`h-3 w-3 rounded-full transition ${
              index === bestSellerPage
                ? 'bg-gray-700'
                : 'border-2 border-gray-300 bg-white hover:border-gray-500'
            }`}
            aria-label={`Go to best seller page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>
)}

{newArrivalProducts.length > 0 && (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1540px] px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              New Arrival
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-7 text-gray-500">
              Discover the latest beauty essentials added to our curated collection.
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={goToPrevNewArrivals}
              className="absolute left-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-500 transition hover:text-gray-950 lg:flex"
              aria-label="Previous new arrivals"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNextNewArrivals}
              className="absolute right-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-400 transition hover:text-gray-950 lg:flex"
              aria-label="Next new arrivals"
            >
              ›
            </button>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-14">
              {visibleNewArrivals.map((product) => (
                <div
                  key={product._id}
                  className="group relative block text-center"
                >
                  <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
                    {product.discount && (
                      <span className="absolute left-5 top-3 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                        {product.discount}
                      </span>
                    )}

                    <Link
                      to={`/product/${product._id}`}
                      state={{ product: product.originalProduct || product }}
                      className="relative z-0 block h-full w-full"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white opacity-0 shadow-lg transition duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(addToCart({ product: product.originalProduct || product, qty: 1 }));
                        }}
                        className="flex h-14 w-14 items-center justify-center border-r border-gray-100 text-gray-700 transition hover:bg-gray-950 hover:text-white"
                        aria-label="View cart"
                        title="View cart"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 7h12l-1 13H7L6 7Z" />
                          <path d="M9 7a3 3 0 0 1 6 0" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(toggleWishlist(product.originalProduct || product));
                        }}
                        className="flex h-14 w-14 items-center justify-center text-gray-700 transition hover:bg-gray-950 hover:text-white"
                        aria-label="View wishlist"
                        title="View wishlist"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    state={{ product: product.originalProduct || product }}
                    className="block"
                  >
                    <h3 className="mx-auto min-h-[48px] max-w-[320px] text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
                      {product.name}
                    </h3>

                    <p className="mt-2 min-h-[24px] text-base text-gray-400">
                      {product.category}
                    </p>

                    <div className="mt-3 flex justify-center text-xl leading-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2 text-lg font-bold">
                      {product.oldPrice && (
                        <span className="text-base font-normal text-gray-400 line-through">
                          {product.oldPrice}
                        </span>
                      )}
                      <span className="text-gray-950">{product.price}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-3">
              {Array.from({ length: newArrivalPageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setNewArrivalPage(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    index === newArrivalPage
                      ? 'bg-gray-700'
                      : 'border-2 border-gray-300 bg-white hover:border-gray-500'
                  }`}
                  aria-label={`Go to new arrival page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
)}

{hotDealProducts.length > 0 && (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1540px] px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              Hot Deals
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-7 text-gray-500">
              Save more on selected beauty favorites before these offers disappear.
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={goToPrevHotDeals}
              className="absolute left-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-500 transition hover:text-gray-950 lg:flex"
              aria-label="Previous hot deals"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNextHotDeals}
              className="absolute right-0 top-[38%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-5xl font-light text-gray-400 transition hover:text-gray-950 lg:flex"
              aria-label="Next hot deals"
            >
              ›
            </button>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-14">
              {visibleHotDeals.map((product) => (
                <div
                  key={product._id}
                  className="group relative block text-center"
                >
                  <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
                    {product.discount && (
                      <span className="absolute left-5 top-3 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                        {product.discount}
                      </span>
                    )}

                    <Link
                      to={`/product/${product._id}`}
                      state={{ product: product.originalProduct || product }}
                      className="relative z-0 block h-full w-full"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white opacity-0 shadow-lg transition duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(addToCart({ product: product.originalProduct || product, qty: 1 }));
                        }}
                        className="flex h-14 w-14 items-center justify-center border-r border-gray-100 text-gray-700 transition hover:bg-gray-950 hover:text-white"
                        aria-label="View cart"
                        title="View cart"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 7h12l-1 13H7L6 7Z" />
                          <path d="M9 7a3 3 0 0 1 6 0" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(toggleWishlist(product.originalProduct || product));
                        }}
                        className="flex h-14 w-14 items-center justify-center text-gray-700 transition hover:bg-gray-950 hover:text-white"
                        aria-label="View wishlist"
                        title="View wishlist"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    state={{ product: product.originalProduct || product }}
                    className="block"
                  >
                    <h3 className="mx-auto min-h-[48px] max-w-[320px] text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
                      {product.name}
                    </h3>

                    <p className="mt-2 min-h-[24px] text-base text-gray-400">
                      {product.category}
                    </p>

                    <div className="mt-3 flex justify-center text-xl leading-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= product.rating ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-center gap-2 text-lg font-bold">
                      {product.oldPrice && (
                        <span className="text-base font-normal text-gray-400 line-through">
                          {product.oldPrice}
                        </span>
                      )}
                      <span className="text-gray-950">{product.price}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-3">
              {Array.from({ length: hotDealPageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setHotDealPage(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    index === hotDealPage
                      ? 'bg-gray-700'
                      : 'border-2 border-gray-300 bg-white hover:border-gray-500'
                  }`}
                  aria-label={`Go to hot deals page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
)}



      {/* Testimonials Section */}
      <Testimonials />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;


