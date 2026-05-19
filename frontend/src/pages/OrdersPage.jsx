import React, { useState, useEffect } from 'react';
import API from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif text-stone-900 font-bold text-center">My Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-stone-400">You have no placed orders yet.</div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-pink-100 rounded-2xl p-6 shadow-xxs">
              <div className="flex justify-between items-center border-b border-pink-50 pb-4 mb-4">
                <div>
                  <span className="text-xs text-stone-400 uppercase font-semibold">Order ID</span>
                  <p className="font-mono text-sm text-stone-850 font-bold">{order._id}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 uppercase font-semibold">Total Price</span>
                  <p className="text-lg font-bold text-stone-900">${order.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-between text-xs">
                <span className={`px-3 py-1 rounded-full font-semibold ${order.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
                <span className={`px-3 py-1 rounded-full font-semibold ${order.isDelivered ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {order.isDelivered ? 'Delivered' : 'Pending Delivery'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
