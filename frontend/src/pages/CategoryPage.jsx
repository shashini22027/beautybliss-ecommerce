import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { fetchProducts, selectAllProducts, selectProductsStatus } from '../redux/slices/productsSlice';
import categoryGroups from '../data/categoryGroups';
import { formatPrice, parsePrice } from '../utils/currency';

const fallbackImages = [
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=85',
];

const getCategorySlug = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const normalize = (value = '') => value.toString().trim().toLowerCase();

const getProductCategoryText = (product) => {
  const categoryName = typeof product.category === 'object'
    ? product.category?.name || ''
    : product.category || '';

  return [
    categoryName,
    product.subcategory,
    product.subCategory,
    product.type,
    ...(Array.isArray(product.categories) ? product.categories : []),
  ]
    .filter(Boolean)
    .join(' ');
};

const buildFallbackProducts = (category) =>
  category.items.flatMap((item, itemIndex) =>
    [1, 2, 3].map((number) => ({
      id: `${getCategorySlug(category.title)}-${getCategorySlug(item)}-${number}`,
      name: `${item} Essential ${number}`,
      category: category.title,
      subcategory: item,
      price: Math.round(((itemIndex + number) * 12 + 21.8) * 30),
      oldPrice: number === 2 ? Math.round(((itemIndex + number) * 13.5 + 24.8) * 30) : '',
      rating: 5 - ((itemIndex + number) % 2),
      discount: number === 2 ? '-15%' : '',
      soldOut: number === 3 && itemIndex === 0,
      image: fallbackImages[(itemIndex + number - 1) % fallbackImages.length],
    }))
  );

const getProductImage = (product) => {
  if (typeof product.image === 'string') return product.image;
  if (Array.isArray(product.images) && product.images.length > 0) {
    return typeof product.images[0] === 'string'
      ? product.images[0]
      : product.images[0]?.url;
  }
  return product.image?.url || fallbackImages[0];
};

const formatProductPrice = (product) => {
  const price = product.price || product.currentPrice || product.salePrice;

  if (typeof price === 'number') {
    return formatPrice(price);
  }

  return price || 'View Product';
};

const getDiscountLabel = (product) => {
  if (product.discountLabel || product.discount) {
    return product.discountLabel || product.discount;
  }
  const price = Number(product.price || product.currentPrice || product.salePrice || 0);
  const compareAtPrice = Number(product.compareAtPrice || product.oldPrice || 0);
  if (compareAtPrice > price && compareAtPrice > 0) {
    const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    return `-${discount}%`;
  }
  return '';
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const id = product._id || product.id;
  const productPath = `/product/${id}`;

  return (
    <Link
      to={productPath}
      state={{ product }}
      className="group relative block text-center"
    >
      <div className="relative mx-auto mb-5 flex h-[330px] w-full max-w-[330px] items-center justify-center overflow-hidden bg-white">
        {getDiscountLabel(product) && (
          <span className="absolute left-5 top-3 z-10 rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
            {getDiscountLabel(product)}
          </span>
        )}

        {product.soldOut && (
          <span className="absolute left-5 top-14 z-10 text-sm font-bold uppercase tracking-wide text-black">
            SOLD OUT
          </span>
        )}

        <img
          src={getProductImage(product)}
          alt={product.name}
          className="h-[300px] w-[300px] object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              dispatch(addToCart({ product, qty: 1 }));
            }}
            className="flex h-14 w-14 items-center justify-center border-r border-gray-100 text-gray-700 transition hover:bg-gray-950 hover:text-white"
            aria-label="Add to cart"
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
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              dispatch(toggleWishlist(product));
            }}
            className="flex h-14 w-14 items-center justify-center text-gray-700 transition hover:bg-gray-950 hover:text-white"
            aria-label="Add to wishlist"
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

      <h3 className="mx-auto min-h-[48px] max-w-[320px] text-lg font-bold leading-snug text-gray-800 transition group-hover:text-pink-600">
        {product.name}
      </h3>

      <p className="mt-2 min-h-[24px] text-base text-gray-400">
        {product.subcategory || (typeof product.category === 'object' ? product.category?.name : product.category)}
      </p>

      <div className="mt-3 flex justify-center text-xl leading-none">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= (product.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-lg font-bold">
        {(product.oldPrice || (product.compareAtPrice && product.compareAtPrice > product.price)) ? (
          <>
            <span className="text-base font-normal text-gray-400 line-through">
              {formatPrice(product.oldPrice || product.compareAtPrice)}
            </span>
            <span className="text-gray-950">
              {formatProductPrice(product)}
            </span>
          </>
        ) : (
          <span className="text-gray-950">
            {formatProductPrice(product)}
          </span>
        )}
      </div>
    </Link>
  );
};

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const dispatch = useDispatch();
  const apiProducts = useSelector(selectAllProducts);
  const productsStatus = useSelector(selectProductsStatus);
  const loading = productsStatus === 'loading';

  const category = categoryGroups.find(
    (group) => getCategorySlug(group.title) === categorySlug
  );

  useEffect(() => {
    setSelectedSubcategory('All');
  }, [categorySlug]);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);

  const categoryProducts = useMemo(() => {
    if (!category) return [];

    const products = apiProducts;
    const categoryTitle = normalize(category.title);
    const subcategoryNames = category.items.map(normalize);

    const filtered = products.filter((product) => {
      const categoryText = normalize(getProductCategoryText(product));
      const belongsToCategory =
        categoryText.includes(categoryTitle) ||
        subcategoryNames.some((subcategory) => categoryText.includes(subcategory));

      if (selectedSubcategory === 'All') {
        return belongsToCategory;
      }

      return (
        belongsToCategory &&
        categoryText.includes(normalize(selectedSubcategory))
      );
    });

    switch (sortOrder) {
      case 'popular':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.reverse();
        break;
      case 'price-low':
        filtered.sort((a, b) => parsePrice(a.price || a.currentPrice || a.salePrice) - parsePrice(b.price || b.currentPrice || b.salePrice));
        break;
      case 'price-high':
        filtered.sort((a, b) => parsePrice(b.price || b.currentPrice || b.salePrice) - parsePrice(a.price || a.currentPrice || a.salePrice));
        break;
      default:
        break;
    }

    return filtered;
  }, [apiProducts, category, selectedSubcategory, sortOrder]);

  if (!category) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">
          Category
        </p>
        <h1 className="mt-4 text-4xl font-bold text-gray-950">
          Category not found
        </h1>
        <Link
          to="/"
          className="mt-8 inline-block bg-[#3a2430] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5b2c45]"
        >
          Back Home
        </Link>
      </main>
    );
  }

  const filters = ['All', ...category.items];

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="border-b border-gray-200 pb-5 text-lg font-bold uppercase tracking-tight text-gray-950">
                Subcategories
              </h2>

              <div className="mt-6 flex flex-col gap-2">
                {filters.map((filter) => {
                  const isActive = selectedSubcategory === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedSubcategory(filter)}
                      className={`w-full rounded-md border px-4 py-3 text-left text-sm font-semibold transition ${
                        isActive
                          ? 'border-gray-950 bg-gray-950 text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-950 hover:text-gray-950'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="min-w-0 lg:col-span-3">
            <div className="mb-8 rounded-lg border border-gray-200 bg-white px-5 py-4">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <nav className="text-sm text-gray-500">
                  <Link to="/" className="transition hover:text-gray-950">
                    Home
                  </Link>
                  <span className="mx-2">/</span>
                  <span className="font-bold text-gray-950">{category.title}</span>
                </nav>

                <div className="flex flex-wrap items-center gap-5">
                  <p className="text-sm text-gray-500">
                    Products:{' '}
                    <span className="font-bold text-gray-950">
                      {categoryProducts.length}
                    </span>
                  </p>

                  <label className="flex items-center gap-3 text-sm font-bold text-gray-950">
                    Sort
                    <select
                      className="min-w-[170px] rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 outline-none transition focus:border-gray-950"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="default">Default sorting</option>
                      <option value="popular">Most popular</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: low to high</option>
                      <option value="price-high">Price: high to low</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
                {category.title} Products
              </h1>
              {selectedSubcategory !== 'All' && (
                <p className="mt-3 text-base font-medium text-gray-500">
                  Showing {selectedSubcategory}
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    key={item}
                    className="h-[470px] animate-pulse bg-gray-50"
                  />
                ))}
              </div>
            ) : categoryProducts.length > 0 ? (
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryProducts.map((product) => (
                  <ProductCard
                    key={product.id || product._id || product.name}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
                <h3 className="text-2xl font-bold text-gray-950">
                  No products found
                </h3>
                <p className="mx-auto mt-3 max-w-lg text-gray-500">
                  Try another subcategory or check back after products are added.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
