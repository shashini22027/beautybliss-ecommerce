import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const TrackOrderPage = lazy(() => import('../pages/TrackOrderPage'));
const OrderDetailsPage = lazy(() => import('../pages/OrderDetailsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SearchResultsPage = lazy(() => import('../pages/SearchResultsPage'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const OffersPage = lazy(() => import('../pages/OffersPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const Blog = lazy(() => import('../pages/Blog'));
const BlogPostDetail = lazy(() => import('../pages/BlogPostDetail'));
const ContactScreen = lazy(() => import('../pages/ContactScreen'));
const SkinConsultationPage = lazy(() => import('../pages/SkinConsultationPage'));
const AppointmentManagePage = lazy(() => import('../pages/AppointmentManagePage'));
const AppointmentAdminScreen = lazy(() => import('../pages/admin/AppointmentAdminScreen'));
const AdminAuditLogScreen = lazy(() => import('../pages/admin/AdminAuditLogScreen'));
const InventoryScreen = lazy(() => import('../pages/admin/InventoryScreen'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const AccountSupportPage = lazy(() => import('../pages/AccountSupportPage'));
const PrivacyPolicyScreen = lazy(() => import('../pages/PrivacyPolicyScreen'));
const ShippingDeliveryScreen = lazy(() => import('../pages/ShippingDeliveryScreen'));
const ReturnRefundPolicyScreen = lazy(() => import('../pages/ReturnRefundPolicyScreen'));
const TermsConditionsScreen = lazy(() => import('../pages/TermsConditionsScreen'));
const OrderListScreen = lazy(() => import('../pages/admin/OrderListScreen'));
const ProductEditScreen = lazy(() => import('../pages/admin/ProductEditScreen'));
const ProductListScreen = lazy(() => import('../pages/admin/ProductListScreen'));
const HomepageMerchandisingScreen = lazy(() => import('../pages/admin/HomepageMerchandisingScreen'));
const ReviewListScreen = lazy(() => import('../pages/admin/ReviewListScreen'));
const SalesReportScreen = lazy(() => import('../pages/admin/SalesReportScreen'));
const UserListScreen = lazy(() => import('../pages/admin/UserListScreen'));
const BlogListScreen = lazy(() => import('../pages/admin/BlogListScreen'));
const BlogEditScreen = lazy(() => import('../pages/admin/BlogEditScreen'));
const MessageListScreen = lazy(() => import('../pages/admin/MessageListScreen'));
const PaymentPage = lazy(() => import('../pages/PaymentPage'));
const OrderCompletePage = lazy(() => import('../pages/OrderCompletePage'));
import ScrollToTop from '../components/ScrollToTop';

const AppRoutes = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <MainLayout>
        <Suspense fallback={<div role="status" className="mx-auto max-w-7xl px-6 py-16 text-center text-sm text-gray-500">Loading page…</div>}>
        <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shipping-delivery" element={<ShippingDeliveryScreen />} />
          <Route path="/return-refund-policy" element={<ReturnRefundPolicyScreen />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/orderlist" element={<OrderListScreen />} />
          <Route path="/admin/appointments" element={<AppointmentAdminScreen />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogScreen />} />
          <Route path="/admin/inventory" element={<InventoryScreen />} />
          <Route path="/admin/sales" element={<SalesReportScreen />} />
          <Route path="/admin/productlist" element={<ProductListScreen />} />
          <Route path="/admin/homepage-merchandising" element={<HomepageMerchandisingScreen />} />
          <Route path="/admin/product/create" element={<ProductEditScreen />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
          <Route path="/admin/reviews" element={<ReviewListScreen />} />
          <Route path="/admin/userlist" element={<UserListScreen />} />
          <Route path="/admin/bloglist" element={<BlogListScreen />} />
          <Route path="/admin/blog/create" element={<BlogEditScreen />} />
          <Route path="/admin/blog/:id/edit" element={<BlogEditScreen />} />
          <Route path="/admin/messages" element={<MessageListScreen />} />
          <Route path="/adminDashboard" element={<Navigate to="/admin-dashboard" replace />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/skin-consultation" element={<SkinConsultationPage />} />
          <Route path="/appointment/manage/:token" element={<AppointmentManagePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-complete" element={<OrderCompletePage />} />
          <Route path='/account-support' element={<AccountSupportPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
          <Route path="/terms-conditions" element={<TermsConditionsScreen />} />
        </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
