import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import API from '../services/api';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = cartItems.reduce((acc, x) => acc + x.product.price * x.qty, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = subtotal * (appliedCoupon.discountAmount / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountAmount;
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const { data } = await API.post('/coupons/validate', { code: couponCode.trim() });
      setAppliedCoupon(data);
      setCouponSuccess(`Coupon "${data.code}" applied! Saved $${(data.discountType === 'percentage' ? subtotal * (data.discountAmount / 100) : data.discountAmount).toFixed(2)}`);
    } catch (err) {
      console.error(err);
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        qty: item.qty
      }));

      const shippingAddress = { address, city, postalCode, country };

      await API.post('/orders', {
        orderItems,
        shippingAddress,
        totalPrice: finalTotal
      });

      alert('Order placed successfully!');
      clearCart();
      window.location.href = '/orders';
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place order. Make sure you are logged in!');
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-0">
      <h2 className="text-3xl font-serif text-stone-900 font-bold text-center">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 border border-pink-100 rounded-2xl space-y-6">
            <h3 className="text-xl font-serif text-stone-900 font-bold">Shipping Information</h3>
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
          
          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-full uppercase tracking-wider text-xs transition">
            Place Order (${finalTotal.toFixed(2)})
          </button>
        </form>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-8 border border-pink-100 rounded-2xl space-y-4">
            <h3 className="text-lg font-serif text-stone-900 font-bold">Your Order</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between text-xs text-stone-600">
                  <span>{item.product.name} x {item.qty}</span>
                  <span>${(item.product.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-pink-50 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-serif font-bold text-stone-900 border-t border-pink-50 pt-2">
                <span>Total to Pay:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Coupon Code Panel */}
          <div className="bg-white p-6 border border-pink-100 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-stone-850 uppercase tracking-wider">Apply Promo Coupon</h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. BEAUTY10"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="flex-grow border border-stone-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400 uppercase"
              />
              <button type="submit" className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold px-4 py-1.5 rounded-lg text-xs border border-primary-100 transition">
                Apply
              </button>
            </form>
            {couponError && <p className="text-[10px] text-red-500 font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-green-600 font-semibold">{couponSuccess}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
