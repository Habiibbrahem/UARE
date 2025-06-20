// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchResultsPage from './pages/SearchResultsPage';
import CategoryPage from './pages/CategoryPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AccountPage from './pages/AccountPage';    // ← make sure this exists

import Navbar from './components/Navbar';

import AdminDashboard from './components/dashboards/AdminDashboard';
import AssignStoreOwner from './components/dashboards/AssignStoreOwner';
import StoreOwnerLayout from './components/dashboards/StoreOwnerLayout';
import MembersManagement from './components/dashboards/MembersManagement';
import OrdersManagement from './components/dashboards/OrdersManagement';
import StoreMemberDashboard from './components/dashboards/StoreMemberDashboard';
import Unauthorized from './components/dashboards/Unauthorized';

import './styles/pages.css';

function RequireAuth({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  try {
    const { role } = JSON.parse(atob(token.split('.')[1]));
    if (allowedRoles.includes(role.toLowerCase())) {
      return children;
    }
    return <Navigate to="/unauthorized" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/categories/:categoryId" element={<CategoryPage />} />
            <Route path="/store/:storeId" element={<StorePage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-confirmation/:storeId" element={<OrderConfirmationPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Account */}
            <Route
              path="/account"
              element={
                <RequireAuth allowedRoles={['customer', 'admin', 'store_owner', 'store_member']}>
                  <AccountPage />
                </RequireAuth>
              }
            />

            {/* Protected checkout */}
            <Route
              path="/checkout"
              element={
                <RequireAuth allowedRoles={['customer', 'admin', 'store_owner', 'store_member']}>
                  <CheckoutPage />
                </RequireAuth>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/*"
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/assign-store-owner"
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <AssignStoreOwner />
                </RequireAuth>
              }
            />

            {/* Store Owner */}
            <Route
              path="/store-owner/*"
              element={
                <RequireAuth allowedRoles={['store_owner']}>
                  <StoreOwnerLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="members" replace />} />
              <Route path="members" element={<MembersManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
            </Route>

            {/* Store Member */}
            <Route
              path="/store-member"
              element={
                <RequireAuth allowedRoles={['store_member']}>
                  <StoreMemberDashboard />
                </RequireAuth>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}
