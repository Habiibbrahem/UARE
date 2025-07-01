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
    Divider,
    Stack,
    Chip,
    Badge,
    useTheme
} from '@mui/material';
import { ArrowBack, LocalShipping, Payment, Receipt } from '@mui/icons-material';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const cartItems = useCartStore(s => s.cartItems);
    const subtotal = useCartStore(s => s.getTotalPrice());
    const shippingCost = useCartStore(s => s.getShippingCost());
    const clearCart = useCartStore(s => s.clearCart);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/cart')}
                sx={{ mb: 2 }}
            >
                Retour au panier
            </Button>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                <Badge badgeContent={cartItems.length} color="primary" sx={{ mr: 2 }}>
                    <Payment />
                </Badge>
                Finaliser la commande
            </Typography>

            <Grid container spacing={3}>
                {/* Delivery Information */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: theme.shadows[2]
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Informations de livraison
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={3}>
                            <TextField
                                label="Adresse de livraison"
                                fullWidth
                                required
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                variant="outlined"
                                size="medium"
                            />
                            <TextField
                                label="Numéro de téléphone"
                                fullWidth
                                required
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                variant="outlined"
                                size="medium"
                            />

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    Méthode de paiement
                                </Typography>
                                <Chip
                                    label="Paiement à la livraison"
                                    color="primary"
                                    icon={<Receipt />}
                                    sx={{ p: 2 }}
                                />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            boxShadow: theme.shadows[2],
                            position: { md: 'sticky' },
                            top: { md: 100 }
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Récapitulatif de commande
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <List dense sx={{ mb: 2 }}>
                            {cartItems.map(i => (
                                <React.Fragment key={i.productId}>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={`${i.name}`}
                                            secondary={`${i.quantity} × ${i.price.toFixed(2)} DT`}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                        <Typography variant="body1" fontWeight={500}>
                                            {(i.price * i.quantity).toFixed(2)} DT
                                        </Typography>
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>

                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Sous-total</Typography>
                                <Typography>{subtotal.toFixed(2)} DT</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>
                                    Livraison
                                    {shippingCost === 0 && (
                                        <Chip
                                            label="Gratuite"
                                            size="small"
                                            color="success"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </Typography>
                                <Typography>
                                    {shippingCost === 0 ? (
                                        <Typography component="span" color="success.main">
                                            Gratuite
                                        </Typography>
                                    ) : (
                                        `${shippingCost.toFixed(2)} DT`
                                    )}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Taxe (10%)</Typography>
                                <Typography>{taxAmount.toFixed(2)} DT</Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 3
                        }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {totalAmount.toFixed(2)} DT
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleSubmit}
                            disabled={!address || !phone}
                            sx={{ py: 1.5 }}
                        >
                            Confirmer la commande
                        </Button>

                        {shippingCost > 0 && subtotal < 100 && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Livraison gratuite pour les commandes supérieures à 100 DT
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}