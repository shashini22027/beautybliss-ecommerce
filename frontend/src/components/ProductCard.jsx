import React from 'react';
import { getImageUrl } from '../utils/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, toggleWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { formatPrice } from '../utils/currency';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const navigate = useNavigate();
  const productId = product._id || product.id || product.name;

  const isWishlisted = wishlistItems.some((x) => (x._id || x.id || x.name) === productId);
  const rating = product.rating || product.reviews?.average || 0;
  const discount = product.discount || '';
  const oldPrice = product.oldPrice || '';

  return (
    <div className="flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.08)] transition duration-300 hover:border-gray-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
      {/* Image Container */}
      <div className="group relative aspect-square overflow-hidden bg-white">
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
            src={getImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
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
            <ShoppingCart size={22} strokeWidth={2} />
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
      <div className="flex flex-grow flex-col justify-between p-5">
        <div className="space-y-2">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">{product.brand || product.category}</span>
          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-950">
            <Link 
              to={productId ? `/product/${productId}` : '#'}
              className="transition hover:text-pink-600"
            >
              {product.name}
            </Link>
          </h3>

          {/* Rating Stars */}
          {rating > 0 && (
            <div className="mt-2 flex items-center gap-1">
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
              <span className="text-sm font-extrabold text-gray-950">{typeof product.price === 'number' ? formatPrice(product.price) : product.price}</span>
              {oldPrice && (
                <span className="text-xs text-gray-400 line-through">{typeof oldPrice === 'number' ? formatPrice(oldPrice) : oldPrice}</span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => dispatch(addToCart({ product, qty: 1 }))}
            className="flex w-full items-center justify-center gap-2 bg-[#2b2b2b] p-2 text-sm font-bold uppercase text-white transition hover:bg-pink-600"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
