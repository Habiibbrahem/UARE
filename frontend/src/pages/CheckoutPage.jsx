// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import useCartStore from '../store/useCartStore';
import { createOrder } from '../services/orderService';
import jwt_decode from 'jwt-decode';

export default function CheckoutPage() {
    const navigate = useNavigate();

    // Grab the cart items array from Zustand
    const cartItems = useCartStore((s) => s.cartItems);
    const subtotal = useCartStore((s) => s.getTotalPrice());
    const clearCart = useCartStore((s) => s.clearCart);

    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    // Check authentication and cart status
    useEffect(() => {
        if (!cartItems.length) {
            navigate('/cart');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login with return URL
            navigate('/login', { state: { from: '/checkout' } });
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

    // Double-check token again—if missing, redirect to home
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" />;
    }

    // Double-check cart once more—if somehow empty, go back to /cart
    if (!cartItems.length) {
        return <Navigate to="/cart" />;
    }

    // Build order totals
    const shippingCost = 5;
    const taxAmount = parseFloat((subtotal * 0.1).toFixed(2));
    const totalAmount = parseFloat((subtotal + shippingCost + taxAmount).toFixed(2));

    // "Confirm Order" click handler
    const handleSubmit = async () => {
        setError('');
        const tokenInside = localStorage.getItem('token');
        if (!tokenInside) {
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        let decoded;
        try {
            decoded = jwt_decode(tokenInside);
        } catch {
            setError('Invalid token. Please log in again.');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        const customerId = decoded.sub;
        const storeId = cartItems[0]?.storeId;
        if (!storeId) {
            setError('Missing store information.');
            return;
        }

        // Build the "items" array
        const items = cartItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            ...(item.color ? { color: item.color } : {}),
        }));

        const createOrderDto = {
            customerId,
            storeId,
            paymentMethod: 'cash_on_delivery',
            items,
            shippingAddress,
            phoneNumber,
            shippingCost,
            subtotal,
            taxAmount,
            totalAmount,
        };

        try {
            await createOrder(createOrderDto);
            clearCart();
            navigate(`/order-confirmation/${storeId}`, {
                state: {
                    orderDetails: {
                        totalAmount,
                        shippingAddress,
                        items,
                    }
                }
            });
        } catch (e) {
            console.error(e);
            setError('Failed to place order. Please try again.');
        }
    };

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
                required
            />
            <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
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