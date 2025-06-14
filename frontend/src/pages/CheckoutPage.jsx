// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import useCartStore from '../store/useCartStore';
import { createOrder } from '../services/orderService';
import {
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import '../styles/pages.css';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const cartItems = useCartStore(s => s.cartItems);
    const subtotal = useCartStore(s => s.getTotalPrice());
    const clearCart = useCartStore(s => s.clearCart);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const shippingCost = 5;
    const taxAmount = +(subtotal * 0.1).toFixed(2);
    const totalAmount = +(subtotal + shippingCost + taxAmount).toFixed(2);

    useEffect(() => {
        if (!cartItems.length) navigate('/cart');
    }, [cartItems, navigate]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login', { state: { from: '/checkout' } });

        const { sub: customerId } = jwt_decode(token);
        const storeId = cartItems[0]?.storeId;
        if (!storeId) return alert('Store ID manquant.');

        const items = cartItems.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
            image: i.image
        }));

        const payload = {
            customerId,
            storeId,
            paymentMethod: 'cash_on_delivery',
            items,
            shippingAddress: address,
            phoneNumber: phone,
            shippingCost,
            subtotal,
            taxAmount,
            totalAmount
        };

        try {
            await createOrder(payload);
            clearCart();
            navigate('/order-confirmation');
        } catch {
            alert('Échec de la commande, réessayez.');
        }
    };

    return (
        <Container className="checkout-container">
            <Typography variant="h4" className="checkout-title">
                Paiement
            </Typography>

            <Grid container className="checkout-grid">
                <Grid item xs={12} md={6}>
                    <Paper className="checkout-form">
                        <Typography variant="h6">Informations de livraison</Typography>
                        <TextField
                            label="Adresse"
                            fullWidth
                            required
                            margin="normal"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        />
                        <TextField
                            label="Téléphone"
                            fullWidth
                            required
                            margin="normal"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!address || !phone}
                            className="checkout-button"
                        >
                            Confirmer la commande
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper className="checkout-summary">
                        <Typography variant="h6">Récapitulatif</Typography>
                        <List>
                            {cartItems.map(i => (
                                <ListItem key={i.productId}>
                                    <ListItemText
                                        primary={`${i.name} x${i.quantity}`}
                                        secondary={`${(i.price * i.quantity).toFixed(2)} DT`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Divider sx={{ margin: '16px 0' }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography>Sous-total</Typography>
                            <Typography>{subtotal.toFixed(2)} DT</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography>Livraison</Typography>
                            <Typography>{shippingCost.toFixed(2)} DT</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography>Taxe (10%)</Typography>
                            <Typography>{taxAmount.toFixed(2)} DT</Typography>
                        </Box>
                        <Divider sx={{ margin: '16px 0' }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6">{totalAmount.toFixed(2)} DT</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
