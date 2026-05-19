import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="text-center py-20">Loading admin operations dashboard...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-serif text-stone-900 font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Sales</span>
          <p className="text-3xl font-bold text-primary-700 mt-2">${stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Total Orders</span>
          <p className="text-3xl font-bold text-stone-900 mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Registered Users</span>
          <p className="text-3xl font-bold text-stone-900 mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white border border-pink-100 p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Active Products</span>
          <p className="text-3xl font-bold text-stone-900 mt-2">{stats.totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
