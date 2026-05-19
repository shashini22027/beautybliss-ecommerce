import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif text-stone-900 font-bold text-center">My Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-20">Your cart is empty. <a href="/products" className="text-primary-700 underline font-semibold">Start Shopping</a></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex gap-4 p-4 bg-white rounded-2xl border border-pink-100 items-center">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="flex-grow">
                  <h4 className="text-sm font-semibold text-stone-800">{item.product.name}</h4>
                  <p className="text-xs text-stone-400 mt-1">Price per item: ${item.product.price.toFixed(2)}</p>
                  <p className="text-xs text-stone-500 mt-1">Quantity: {item.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-950">${(item.product.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.product._id)} className="text-stone-400 hover:text-red-500 mt-2"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 border border-pink-100 rounded-2xl h-fit space-y-4">
            <h3 className="text-lg font-serif text-stone-900 font-bold">Summary</h3>
            <div className="flex justify-between text-sm text-stone-600">
              <span>Items Total</span>
              <span>${cartItems.reduce((acc, x) => acc + x.product.price * x.qty, 0).toFixed(2)}</span>
            </div>
            <div className="border-t border-pink-50 pt-4 flex justify-between font-serif font-bold text-stone-900">
              <span>Subtotal</span>
              <span>${cartItems.reduce((acc, x) => acc + x.product.price * x.qty, 0).toFixed(2)}</span>
            </div>
            <a href="/checkout" className="block text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-full uppercase tracking-wider text-xs transition">Proceed to Checkout</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
