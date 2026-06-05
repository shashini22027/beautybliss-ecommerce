import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { X, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/currency';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-xxs" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-pink-100 flex items-center justify-between">
          <h2 className="text-xl font-serif text-stone-900 font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="p-1 hover:bg-stone-50 rounded"><X size={20} /></button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-20">Your cart is currently empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.product._id} className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-pink-50">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h4 className="text-xs font-semibold text-stone-850">{item.product.name}</h4>
                  <p className="text-xs text-stone-400 mt-1">Qty: {item.qty}</p>
                  <p className="text-xs text-stone-900 font-bold mt-1">{formatPrice(item.product.price * item.qty)}</p>
                </div>
                <button onClick={() => removeFromCart(item.product._id)} className="text-stone-400 hover:text-red-500 self-center"><Trash2 size={16} /></button>
              </div>
            ))
          )}
        </div>
        <div className="p-6 border-t border-pink-100 space-y-4">
          <div className="flex justify-between font-serif font-bold text-stone-900">
            <span>Total Amount:</span>
            <span>{formatPrice(cartItems.reduce((acc, x) => acc + x.product.price * x.qty, 0))}</span>
          </div>
          <a href="/checkout" className="block text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-full uppercase tracking-wider text-xs transition">Proceed to Checkout</a>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
