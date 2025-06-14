// src/pages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    Button,
    Box,
    Divider,
    Paper
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import useCartStore from '../store/useCartStore';

export default function CartPage() {
    const navigate = useNavigate();
    const cartItems = useCartStore((s) => s.cartItems);
    const subtotal = useCartStore((s) => s.getTotalPrice());
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeFromCart = useCartStore((s) => s.removeFromCart);

    const getImageUrl = (img) =>
        img.startsWith('http')
            ? img
            : `${axiosInstance.defaults.baseURL}${img}`;

    return (
        <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Mon Panier
            </Typography>

            {cartItems.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Votre panier est vide</Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/')}
                    >
                        Retour à l’accueil
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {/* Items list */}
                    <Grid item xs={12} md={8}>
                        <Grid container direction="column" spacing={2}>
                            {cartItems.map((item) => (
                                <Grid item key={item.productId}>
                                    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                                        <CardMedia
                                            component="img"
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                objectFit: 'cover',
                                                borderRadius: 1
                                            }}
                                        />
                                        <CardContent sx={{ flex: 1, ml: 2 }}>
                                            <Typography variant="h6">{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Prix unitaire : {item.price.toFixed(2)} DT
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <Remove />
                                                </IconButton>
                                                <Typography sx={{ mx: 1 }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                        <Box sx={{ textAlign: 'right', pr: 2 }}>
                                            <Typography variant="subtitle1">
                                                Total : {(item.price * item.quantity).toFixed(2)} DT
                                            </Typography>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeFromCart(item.productId)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 3,
                                position: { md: 'sticky' },
                                top: { md: 100 }
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Récapitulatif
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 2
                                }}
                            >
                                <Typography variant="body1">Sous-total</Typography>
                                <Typography variant="body1">
                                    {subtotal.toFixed(2)} DT
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<ShoppingCart />}
                                onClick={() => navigate('/checkout')}
                            >
                                Passer à la caisse
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}
