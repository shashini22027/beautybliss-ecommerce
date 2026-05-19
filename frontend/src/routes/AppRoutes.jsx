import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const DummyPage = ({ title }) => (
  <div className="py-20 text-center">
    <h2 className="text-3xl font-serif text-nude-800 font-bold mb-2">{title} Page</h2>
    <p className="text-stone-500">Coming soon.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DummyPage title="Home" />} />
          <Route path="/products" element={<DummyPage title="Products" />} />
          <Route path="/product/:id" element={<DummyPage title="Product Details" />} />
          <Route path="/category/:id" element={<DummyPage title="Category" />} />
          <Route path="/cart" element={<DummyPage title="Cart" />} />
          <Route path="/wishlist" element={<DummyPage title="Wishlist" />} />
          <Route path="/checkout" element={<DummyPage title="Checkout" />} />
          <Route path="/orders" element={<DummyPage title="Orders" />} />
          <Route path="/login" element={<DummyPage title="Login" />} />
          <Route path="/register" element={<DummyPage title="Register" />} />
          <Route path="/profile" element={<DummyPage title="User Profile" />} />
          <Route path="/search" element={<DummyPage title="Search Results" />} />
          <Route path="/admin" element={<DummyPage title="Admin Dashboard" />} />
          <Route path="*" element={<DummyPage title="Error 404" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
