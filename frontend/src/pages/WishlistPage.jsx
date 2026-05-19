import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif text-stone-900 font-bold text-center">My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 text-stone-400">Your wishlist is currently empty.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlistItems.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
