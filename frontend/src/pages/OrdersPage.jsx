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
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-pink-50 pb-4 mb-4">
                <div>
                  <span className="text-xs text-stone-400 uppercase font-semibold">Order ID</span>
                  <p className="font-mono text-xs text-stone-800 font-bold">{order._id}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 uppercase font-semibold">Date Placed</span>
                  <p className="text-xs text-stone-800 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.orderItems && order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-xs">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-pink-50" />
                    <div className="flex-grow">
                      <p className="font-semibold text-stone-800">{item.name}</p>
                      <p className="text-stone-400">Qty: {item.qty} x ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-800">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-pink-50 pt-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-3 text-xs">
                  <span className={`px-3 py-1 rounded-full font-semibold ${order.isPaid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-semibold ${order.isDelivered ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {order.isDelivered ? 'Delivered' : 'Pending Delivery'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-450 uppercase block">Grand Total</span>
                  <span className="font-serif font-bold text-base text-primary-700">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
