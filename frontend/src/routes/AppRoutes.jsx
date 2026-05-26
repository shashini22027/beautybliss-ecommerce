import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CategoryPage from '../pages/CategoryPage';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import AdminDashboard from '../pages/AdminDashboard';
import ErrorPage from '../pages/ErrorPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import OffersPage from '../pages/OffersPage';
import AboutPage from '../pages/AboutPage';
import ContactScreen from "../pages/ContactScreen";
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import AccountSupportPage from '../pages/AccountSupportPage';

const AppRoutes = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/adminDashboard" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path='/account-support' element={<AccountSupportPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
