// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

import AdminDashboard from './components/dashboards/AdminDashboard';
import AssignStoreOwner from './components/dashboards/AssignStoreOwner';
import StoreOwnerDashboard from './components/dashboards/StoreOwnerDashboard';
import StoreMemberDashboard from './components/dashboards/StoreMemberDashboard';
import Unauthorized from './components/dashboards/Unauthorized';

function RequireAuth({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;

  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    const role = payload.role.toLowerCase();
    if (allowedRoles.includes(role)) return children;
    return <Navigate to="/unauthorized" />;
  } catch (e) {
    console.error('RequireAuth error:', e);
    return <Navigate to="/" />;
  }
}

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Home */}
        <Route path="/" element={<HomePage />} />

        {/* Store front (listing) */}
        <Route path="/store/:storeId" element={<StorePage />} />

        {/* Individual product detail */}
        <Route path="/product/:productId" element={<ProductPage />} />

        {/* Cart page */}
        <Route path="/cart" element={<CartPage />} />

        {/* Checkout page */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={['admin']}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        {/* Admin → Assign owner */}
        <Route
          path="/admin/assign-store-owner"
          element={
            <RequireAuth allowedRoles={['admin']}>
              <AssignStoreOwner />
            </RequireAuth>
          }
        />

        {/* Store owner */}
        <Route
          path="/store-owner"
          element={
            <RequireAuth allowedRoles={['store_owner']}>
              <StoreOwnerDashboard />
            </RequireAuth>
          }
        />

        {/* Store member */}
        <Route
          path="/store-member"
          element={
            <RequireAuth allowedRoles={['store_member']}>
              <StoreMemberDashboard />
            </RequireAuth>
          }
        />

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}
