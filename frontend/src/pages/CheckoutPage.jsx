import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    alert('Order placed successfully!');
    clearCart();
    window.location.href = '/orders';
  };

  const total = cartItems.reduce((acc, x) => acc + x.product.price * x.qty, 0);

  return (
    <div className="space-y-8 px-4 sm:px-0">
      <h2 className="text-3xl font-serif text-stone-900 font-bold text-center">Checkout</h2>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 border border-pink-100 rounded-2xl space-y-4">
          <h3 className="text-xl font-serif text-stone-900 font-bold mb-4">Shipping Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Street Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-400" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-400" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Postal Code</label>
              <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-400" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Country</label>
              <input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-400" required />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 border border-pink-100 rounded-2xl h-fit space-y-4">
          <h3 className="text-lg font-serif text-stone-900 font-bold">Your Order</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex justify-between text-xs text-stone-600">
                <span>{item.product.name} x {item.qty}</span>
                <span>${(item.product.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-pink-50 pt-4 flex justify-between font-serif font-bold text-stone-900">
            <span>Total to Pay:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-full uppercase tracking-wider text-xs transition">Place Order</button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
