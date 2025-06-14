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
    CardActions,
    Typography,
    IconButton,
    Button,
    Box,
    Divider
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import useCartStore from '../store/useCartStore';
import '../styles/pages.css';

export default function CartPage() {
    const navigate = useNavigate();
    const cartItems = useCartStore(s => s.cartItems);
    const subtotal = useCartStore(s => s.getTotalPrice());
    const updateQuantity = useCartStore(s => s.updateQuantity);
    const removeFromCart = useCartStore(s => s.removeFromCart);

    const getImageUrl = img =>
        img.startsWith('http') ? img : `${axiosInstance.defaults.baseURL}${img}`;

    if (!cartItems.length) {
        return (
            <Container className="cart-container">
                <Typography variant="h5" className="cart-title">
                    Votre panier est vide
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    className="cart-summary-button"
                >
                    Retour à l’accueil
                </Button>
            </Container>
        );
    }

    return (
        <Container className="cart-container">
            <Typography variant="h4" className="cart-title">
                Panier
            </Typography>

            <Grid container className="cart-grid">
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        {cartItems.map(item => (
                            <Grid key={item.productId} item xs={12}>
                                <Card className="cart-item-card">
                                    <CardMedia
                                        component="img"
                                        image={getImageUrl(item.image)}
                                        alt={item.name}
                                        className="cart-item-image"
                                    />
                                    <CardContent className="cart-item-details">
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantité : {item.quantity}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Prix unitaire : {item.price.toFixed(2)} DT
                                        </Typography>
                                    </CardContent>
                                    <CardActions className="cart-item-details">
                                        <IconButton
                                            onClick={() =>
                                                updateQuantity(item.productId, item.quantity - 1)
                                            }
                                            size="small"
                                        >
                                            <Remove />
                                        </IconButton>
                                        <Typography>{item.quantity}</Typography>
                                        <IconButton
                                            onClick={() =>
                                                updateQuantity(item.productId, item.quantity + 1)
                                            }
                                            size="small"
                                        >
                                            <Add />
                                        </IconButton>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <IconButton
                                            onClick={() => removeFromCart(item.productId)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="cart-summary-card">
                        <Typography variant="h6">Récapitulatif</Typography>
                        <Divider sx={{ margin: '16px 0' }} />
                        <Typography variant="body1">
                            Sous-total : <strong>{subtotal.toFixed(2)} DT</strong>
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/checkout')}
                            className="cart-summary-button"
                        >
                            Passer à la caisse
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
