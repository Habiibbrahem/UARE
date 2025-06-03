// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Dialog,
} from '@mui/material';
import useCartStore from '../store/useCartStore';
import { createOrder } from '../services/orderService';
import jwt_decode from 'jwt-decode';
import LoginModal from '../components/LoginModal';

export default function CheckoutPage() {
    const navigate = useNavigate();

    // Grab the cart items array from Zustand
    const cartItems = useCartStore((s) => s.cartItems);

    // Immediately invoke getTotalPrice() inside the selector so 'subtotal' is a number
    const subtotal = useCartStore((s) => s.getTotalPrice());

    const clearCart = useCartStore((s) => s.clearCart);

    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [showLogin, setShowLogin] = useState(false);

    // 1) If cart is empty → redirect to /cart
    // 2) If no token → pop up LoginModal
    useEffect(() => {
        if (!cartItems.length) {
            navigate('/cart');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setShowLogin(true);
            setLoading(false);
            return;
        }
        setLoading(false);
    }, [cartItems, navigate]);

    // Still checking cart & token?
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    // If not logged in, show the login modal
    if (showLogin) {
        return (
            <Dialog
                open
                onClose={() => {
                    // If they close the modal without logging in, send them back to /cart
                    navigate('/cart');
                }}
            >
                <LoginModal
                    onClose={() => {
                        const t = localStorage.getItem('token');
                        if (!t) {
                            // still not logged in → go back to cart
                            navigate('/cart');
                        } else {
                            // they just logged in → hide the modal and let the form render
                            setShowLogin(false);
                        }
                    }}
                />
            </Dialog>
        );
    }

    // Double‐check token again—if missing, redirect to “/”
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" />;
    }

    // Double‐check cart once more—if somehow empty, go back to /cart
    if (!cartItems.length) {
        return <Navigate to="/cart" />;
    }

    // Build order totals
    const shippingCost = 5;
    const taxAmount = parseFloat((subtotal * 0.1).toFixed(2));
    const totalAmount = parseFloat((subtotal + shippingCost + taxAmount).toFixed(2));

    // “Confirm Order” click handler
    const handleSubmit = async () => {
        setError('');
        const tokenInside = localStorage.getItem('token');
        if (!tokenInside) {
            setShowLogin(true);
            return;
        }

        let decoded;
        try {
            decoded = jwt_decode(tokenInside);
        } catch {
            setError('Invalid token. Please log in again.');
            setShowLogin(true);
            return;
        }

        const customerId = decoded.sub;
        const storeId = cartItems[0]?.storeId;
        if (!storeId) {
            setError('Missing store information.');
            return;
        }

        // Build the “items” array exactly as backend expects
        const items = cartItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            ...(item.color ? { color: item.color } : {}),
        }));

        // *** IMPORTANT: use lowercase "cash_on_delivery" ***
        const createOrderDto = {
            customerId,
            storeId,
            paymentMethod: 'cash_on_delivery',
            items,
            shippingAddress,
            phoneNumber,       // ← NEW
            shippingCost,
            subtotal,
            taxAmount,
            totalAmount,
        };

        try {
            await createOrder(createOrderDto);
            clearCart();
            navigate(`/store/${storeId}`);
        } catch (e) {
            console.error(e);
            setError('Failed to place order. Please try again.');
        }
    };

    // Finally render the address/phone form
    return (
        <Box p={3} maxWidth={600} mx="auto">
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>

            {error && (
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
            )}

            <TextField
                label="Shipping Address"
                fullWidth
                margin="normal"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
            />
            <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Box mt={4}>
                <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
                <Typography>Shipping: ${shippingCost.toFixed(2)}</Typography>
                <Typography>Tax (10%): ${taxAmount.toFixed(2)}</Typography>
                <Typography variant="h6" gutterBottom>
                    Total: ${totalAmount.toFixed(2)}
                </Typography>
            </Box>

            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={!shippingAddress || !phoneNumber}
                >
                    Confirm Order
                </Button>
            </Box>
        </Box>
    );
}
