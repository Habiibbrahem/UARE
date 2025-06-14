// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

import AdminDashboard from './components/dashboards/AdminDashboard';
import AssignStoreOwner from './components/dashboards/AssignStoreOwner';
import StoreMemberDashboard from './components/dashboards/StoreMemberDashboard';
import Unauthorized from './components/dashboards/Unauthorized';

// **Import your dashboard layout** from dashboards
import StoreOwnerLayout from './components/dashboards/StoreOwnerLayout';
import MembersManagement from './components/dashboards/MembersManagement';
import OrdersManagement from './components/dashboards/OrdersManagement';

import './styles/pages.css';

function RequireAuth({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  try {
    const base64 = token.split('.')[1];
    const { role } = JSON.parse(atob(base64));
    if (allowedRoles.includes(role.toLowerCase())) return children;
    return <Navigate to="/unauthorized" />;
  } catch {
    return <Navigate to="/login" />;
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
            <Route path="/store/:storeId" element={<StorePage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-confirmation/:storeId" element={<OrderConfirmationPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

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
              {/* default to members */}
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
