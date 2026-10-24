import React from 'react';
import { getImageUrl } from '../utils/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, toggleWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/currency';

const getProductImageValue = (image) => {
  if (!image) return '';
  return typeof image === 'string' ? image : image.url || image.src || '';
};

const getProductImages = (product) => {
  const images = [
    getProductImageValue(product.image),
    ...(Array.isArray(product.images) ? product.images.map(getProductImageValue) : []),
  ].filter(Boolean);

  return [...new Set(images)];
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const navigate = useNavigate();
  const productId = product._id || product.id || product.name;
  const productImages = getProductImages(product);
  const primaryImage = getImageUrl(productImages[0]);
  const hoverImage = getImageUrl(productImages[1]);

  const isWishlisted = wishlistItems.some((x) => (x._id || x.id || x.name) === productId);
  const rating = product.rating || product.reviews?.average || 0;
  const discount = product.discount || '';
  const oldPrice = product.oldPrice || '';

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-[#eee5e1] bg-white transition duration-300 hover:border-[#dfc5c5] hover:shadow-[0_10px_28px_rgba(66,40,43,0.10)]">
      {/* Image Container */}
      <div className="group relative aspect-[4/4.2] overflow-hidden bg-[#fbf8f5]">
        {/* Discount Badge */}
        {discount && (
          <div className="absolute left-3 top-3 z-20 bg-gray-950 px-3 py-1 text-xs font-bold uppercase text-white">
            {discount}
          </div>
        )}

        <div
          onClick={() => productId && navigate(`/product/${productId}`)}
          className="absolute inset-0 cursor-pointer"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className={`h-full w-full object-cover transition duration-500 ${
              hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-4 bg-black/35 opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => dispatch(addToCart({ product, qty: 1 }))}
            className="bg-white p-3 text-gray-950 shadow-lg transition-transform hover:scale-110 hover:text-pink-600 active:scale-95"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingCart size={22} strokeWidth={1.7} />
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleWishlist(product));
            }}
            className="bg-white p-3 shadow-lg transition-transform hover:scale-110 active:scale-95"
            aria-label="Toggle wishlist"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={22} 
              strokeWidth={2}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-400'}
            />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-grow flex-col justify-between p-4 sm:p-5">
        <div className="space-y-2.5">
          <span className="block min-h-4 text-[10px] font-medium uppercase tracking-[0.14em] text-[#a17c7d]">{product.brand || product.category}</span>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-900">
            <Link 
              to={productId ? `/product/${productId}` : '#'}
              className="transition hover:text-pink-600"
            >
              {product.name}
            </Link>
          </h3>

          {/* Rating Stars */}
          {rating > 0 && (
            <div className="mt-2 flex min-h-5 items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="ml-1 text-xs text-gray-500">({rating})</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-col gap-3">
          {/* Price Display */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-950">{typeof product.price === 'number' ? formatPrice(product.price) : product.price}</span>
              {oldPrice && (
                <span className="text-xs text-gray-400 line-through">{typeof oldPrice === 'number' ? formatPrice(oldPrice) : oldPrice}</span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => dispatch(addToCart({ product, qty: 1 }))}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-[#292526] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#a94f61] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingCart size={18} strokeWidth={1.7} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
