// src/pages/OrderConfirmationPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

export default function OrderConfirmationPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const orderDetails = state?.orderDetails;

    if (!orderDetails) {
        navigate('/');
        return null;
    }

    return (
        <Box p={3} maxWidth={600} mx="auto" textAlign="center">
            <Typography variant="h3" gutterBottom>
                Order Confirmed!
            </Typography>
            <Typography variant="h5" gutterBottom>
                Thank you for your purchase!
            </Typography>

            <Box mt={4} textAlign="left">
                <Typography variant="h6">Order Summary:</Typography>
                <Typography>Total: ${orderDetails.totalAmount.toFixed(2)}</Typography>
                <Typography>Shipping to: {orderDetails.shippingAddress}</Typography>

                <Typography variant="h6" mt={2}>Items:</Typography>
                {orderDetails.items.map((item, index) => (
                    <Typography key={index}>
                        {item.quantity}x {item.name} - ${item.price.toFixed(2)} each
                    </Typography>
                ))}
            </Box>

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/')}
                sx={{ mt: 4 }}
            >
                Continue Shopping
            </Button>
        </Box>
    );
}