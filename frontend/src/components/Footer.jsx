import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-850 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <span className="text-2xl font-serif font-bold tracking-widest text-primary-300">BEAUTYBLISS</span>
          <p className="mt-4 text-sm text-stone-400">Your premier destination for curation of fine luxury cosmetics and skincare, inspired by pure elegance.</p>
        </div>
        <div>
          <h3 className="text-white font-medium text-sm tracking-wider uppercase mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm text-stone-400">
            <li><a href="/products" className="hover:text-primary-400 transition">Shop All</a></li>
            <li><a href="/wishlist" className="hover:text-primary-400 transition">My Wishlist</a></li>
            <li><a href="/cart" className="hover:text-primary-400 transition">Shopping Cart</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-medium text-sm tracking-wider uppercase mb-4">Customer Care</h3>
          <ul className="space-y-3 text-sm text-stone-400">
            <li><a href="/profile" className="hover:text-primary-400 transition">Account Profile</a></li>
            <li><a href="/orders" className="hover:text-primary-400 transition">Track Orders</a></li>
            <li><span className="text-stone-500">Support Hours: 9 AM - 6 PM</span></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-medium text-sm tracking-wider uppercase mb-4">Newsletter</h3>
          <p className="text-sm text-stone-400 mb-4">Subscribe to receive exclusive beauty alerts.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Email address" className="bg-stone-900 border border-stone-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-400 w-full" />
            <button className="bg-primary-600 hover:bg-primary-700 text-white rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider transition">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-900 pt-8 text-center text-xs text-stone-500">
        &copy; {new Date().getFullYear()} BeautyBliss Cosmetics. All rights reserved. Made for portfolio presentation.
      </div>
    </footer>
  );
};

export default Footer;
