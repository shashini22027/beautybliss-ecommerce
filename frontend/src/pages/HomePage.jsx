import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-gray-100"
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

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1400&q=85',
  ];

  const featuredProducts = [
    {
      name: 'Hydra Glow Serum',
      category: 'Serums',
      price: 'Rs. 4,950',
      image:
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Velvet Repair Cream',
      category: 'Moisturizers',
      price: 'Rs. 5,750',
      image:
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Rose Cloud Cleanser',
      category: 'Cleansers',
      price: 'Rs. 3,250',
      image:
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85',
    },
    {
      name: 'Daily Silk Sunscreen',
      category: 'Sun Care',
      price: 'Rs. 4,200',
      image:
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=85',
    },
  ];

  const bestSellingProducts = [
  {
    name: 'Aliver Pumpkin Seed Oil 60ml',
    category: 'Skin Care, Body Care, Hair Care, Nourishing Oils',
    price: 'රු2,390.00',
    oldPrice: '',
    rating: 5,
    discount: '',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Aliver Luscious Lips Shimmer Lip Oil',
    category: 'Lips',
    price: 'From රු1,390.00',
    oldPrice: '',
    rating: 4,
    discount: '-34%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Aliver Teeth Whitening Foam Toothpaste Mint Flavour',
    category: 'Oral Care',
    price: 'රු1,090.00',
    oldPrice: 'රු1,650.00',
    rating: 3,
    discount: '-34%',
    soldOut: true,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Aliver Lip Plumper Lip Gloss for Fuller & Hydrated 2Pcs/Set',
    category: 'Lips, Lip glow',
    price: 'රු1,650.00',
    oldPrice: 'රු2,190.00',
    rating: 4,
    discount: '-25%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Brightening Vitamin C Serum',
    category: 'Skin Care',
    price: 'රු2,850.00',
    oldPrice: 'රු3,250.00',
    rating: 5,
    discount: '-12%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Rose Cloud Cleanser',
    category: 'Cleansers',
    price: 'රු3,250.00',
    oldPrice: '',
    rating: 4,
    discount: '',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Daily Silk Sunscreen',
    category: 'Sun Care',
    price: 'රු4,200.00',
    oldPrice: 'රු4,900.00',
    rating: 5,
    discount: '-14%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Velvet Repair Cream',
    category: 'Moisturizers',
    price: 'රු5,750.00',
    oldPrice: '',
    rating: 4,
    discount: '',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
  },
];

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

const newArrivalProducts = [
  {
    name: 'Glow Boost Vitamin C Drops',
    category: 'Skin Care',
    price: 'රු2,950.00',
    oldPrice: '',
    rating: 5,
    discount: 'New',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Soft Matte Lip Tint',
    category: 'Cosmetics',
    price: 'රු1,750.00',
    oldPrice: '',
    rating: 4,
    discount: 'New',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Hydra Dew Face Cream',
    category: 'Moisturizers',
    price: 'රු3,650.00',
    oldPrice: '',
    rating: 5,
    discount: 'New',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Fresh Bloom Body Mist',
    category: 'Fragrances',
    price: 'රු2,490.00',
    oldPrice: '',
    rating: 4,
    discount: 'New',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Rose Cloud Gentle Cleanser',
    category: 'Cleansers',
    price: 'රු2,850.00',
    oldPrice: '',
    rating: 4,
    discount: 'New',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Silk Repair Hair Serum',
    category: 'Hair Care',
    price: 'රු3,150.00',
    oldPrice: '',
    rating: 5,
    discount: 'New',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=700&q=85',
  },
];

const hotDealProducts = [
  {
    name: 'Daily Silk Sunscreen',
    category: 'Sun Care',
    price: 'රු4,200.00',
    oldPrice: 'රු4,900.00',
    rating: 5,
    discount: '-14%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Velvet Repair Cream',
    category: 'Moisturizers',
    price: 'රු4,990.00',
    oldPrice: 'රු5,750.00',
    rating: 4,
    discount: '-13%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Brightening Vitamin C Serum',
    category: 'Skin Care',
    price: 'රු2,850.00',
    oldPrice: 'රු3,250.00',
    rating: 5,
    discount: '-12%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Lip Plumper Gloss Set',
    category: 'Lips',
    price: 'රු1,650.00',
    oldPrice: 'රු2,190.00',
    rating: 4,
    discount: '-25%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Glow Routine Bundle',
    category: 'Beauty Sets',
    price: 'රු6,990.00',
    oldPrice: 'රු8,200.00',
    rating: 5,
    discount: '-15%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85',
  },
  {
    name: 'Luscious Lip Oil',
    category: 'Lips',
    price: 'රු1,390.00',
    oldPrice: 'රු1,980.00',
    rating: 4,
    discount: '-30%',
    soldOut: false,
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85',
  },
];

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
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <section
        className="relative flex min-h-[92vh] items-center overflow-hidden"
        style={{
          background:
            'linear-gradient(120deg, #fff9f4 0%, #fdecef 52%, #f6d7df 100%)',
        }}
      >
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

        <div className="absolute right-0 top-0 h-full w-full select-none md:w-[58%]">
          <div className="absolute inset-0 h-full w-full bg-[radial-gradient(circle_at_top,right,_rgba(250,215,227,0.45),_transparent_35%)]" />
          <div className="absolute inset-0">
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
          </div>

          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, #fff9f4 0%, rgba(255,249,244,0.72) 28%, transparent 44%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-10 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #fff9f4 0%, transparent 100%)',
            }}
          />

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-3 w-3 rounded-full border transition-all duration-300 ${
                  idx === currentImageIndex
                    ? 'scale-125 border-transparent bg-rose-200 shadow-[0_0_10px_rgba(244,214,204,0.65)]'
                    : 'border-rose-200/60 bg-transparent hover:bg-white/10'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
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
      Browse our curated categories to find exactly what you need, from skincare to cosmetics.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <HomeCategoryTile
      title="Skin Care"
      to="/category/skincare"
      image="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Cosmetics"
      to="/category/cosmetics"
      image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Fragrances"
      to="/category/fragrances"
      image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85"
    />
    <HomeCategoryTile
      title="Hair Care"
      to="/category/haircare"
      image="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85"
    />
  </div>
</section>

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
          <Link
            key={product.name}
            to="/products"
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

              <img
                src={product.image}
                alt={product.name}
                className="h-[300px] w-[300px] object-contain transition duration-500 group-hover:scale-105"
              />
            </div>

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
                <Link
                  key={product.name}
                  to="/products"
                  className="group relative block text-center"
                >
                  <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
                    <span className="absolute left-5 top-3 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                      {product.discount}
                    </span>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-[300px] w-[300px] object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>

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
                    <span className="text-gray-950">{product.price}</span>
                  </div>
                </Link>
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
                <Link
                  key={product.name}
                  to="/products"
                  className="group relative block text-center"
                >
                  <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
                    <span className="absolute left-5 top-3 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
                      {product.discount}
                    </span>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-[300px] w-[300px] object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>

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
                    <span className="text-base font-normal text-gray-400 line-through">
                      {product.oldPrice}
                    </span>
                    <span className="text-gray-950">{product.price}</span>
                  </div>
                </Link>
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
