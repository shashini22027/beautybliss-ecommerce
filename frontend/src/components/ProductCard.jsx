import React, { useContext } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const productId = product._id || product.id || product.name;

  const isWishlisted = wishlistItems.some((x) => (x._id || x.id || x.name) === productId);
  const rating = product.rating || product.reviews?.average || 0;
  const discount = product.discount || '';
  const oldPrice = product.oldPrice || '';

  return (
    <div className="bg-white border border-pink-100/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative bg-[#faf7f5] aspect-square overflow-hidden group">
        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-3 left-3 z-20 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {discount}
          </div>
        )}

        <div
          onClick={() => productId && navigate(`/product/${productId}`)}
          className="absolute inset-0 cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-6 z-10">
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="p-3 bg-white rounded-full text-rose-600 shadow-lg hover:scale-110 active:scale-95 transition-transform"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingCart size={22} strokeWidth={2} />
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="p-3 bg-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
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
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">{product.brand || product.category}</span>
          <h3 className="text-stone-900 font-serif font-medium text-sm leading-tight line-clamp-2">
            <Link 
              to={productId ? `/product/${productId}` : '#'}
              className="hover:text-rose-600 transition"
            >
              {product.name}
            </Link>
          </h3>

          {/* Rating Stars */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className="text-xs text-stone-500 ml-1">({rating})</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          {/* Price Display */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-stone-900 font-bold text-sm">{product.price}</span>
              {oldPrice && (
                <span className="text-xs text-stone-400 line-through">{oldPrice}</span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="w-full p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2"
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
