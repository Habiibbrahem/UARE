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
    Paper,
    Chip,
    Stack,
    Tooltip,
    Badge
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart, ArrowBack, LocalShipping } from '@mui/icons-material';
import useCartStore from '../store/useCartStore';
import { useTheme } from '@mui/material/styles';

export default function CartPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const cartItems = useCartStore((s) => s.cartItems);
    const subtotal = useCartStore((s) => s.getTotalPrice());
    const shippingCost = useCartStore((s) => s.getShippingCost());
    const total = useCartStore((s) => s.getTotalWithShipping());
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeFromCart = useCartStore((s) => s.removeFromCart);

    const getImageUrl = (img) =>
        img.startsWith('http')
            ? img
            : `${axiosInstance.defaults.baseURL}${img}`;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Retour
            </Button>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                <Badge badgeContent={cartItems.length} color="primary" sx={{ mr: 2 }}>
                    <ShoppingCart />
                </Badge>
                Mon Panier
            </Typography>

            {cartItems.length === 0 ? (
                <Paper
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: theme.shadows[3]
                    }}
                >
                    <ShoppingCart sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Votre panier est vide
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Explorez nos produits et trouvez quelque chose à votre goût
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/')}
                        sx={{ px: 4 }}
                    >
                        Commencer vos achats
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {/* Items list */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[2] }}>
                            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Articles ({cartItems.length})
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ p: 0 }}>
                                {cartItems.map((item) => (
                                    <React.Fragment key={item.productId}>
                                        <Box sx={{
                                            display: 'flex',
                                            p: 2,
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            }
                                        }}>
                                            <CardMedia
                                                component="img"
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    objectFit: 'contain',
                                                    borderRadius: 1,
                                                    mr: 3
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            color: 'primary.main'
                                                        }
                                                    }}
                                                    onClick={() => navigate(`/product/${item.productId}`)}
                                                >
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    Prix unitaire : {item.price.toFixed(2)} DT
                                                </Typography>

                                                <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 1
                                                    }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Remove fontSize="small" />
                                                        </IconButton>
                                                        <Typography sx={{ px: 1.5 }}>
                                                            {item.quantity}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        >
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                    </Box>

                                                    <Tooltip title="Supprimer">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeFromCart(item.productId)}
                                                            sx={{ ml: 'auto' }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </Box>
                                            <Box sx={{
                                                minWidth: 120,
                                                textAlign: 'right',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {(item.price * item.quantity).toFixed(2)} DT
                                                </Typography>
                                                {item.quantity > 1 && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.price.toFixed(2)} DT × {item.quantity}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </Box>
                        </Card>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
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

                            <Stack spacing={1.5} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">Sous-total</Typography>
                                    <Typography variant="body1">{subtotal.toFixed(2)} DT</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">
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
                                    <Typography variant="body1">
                                        {shippingCost === 0 ? (
                                            <Typography component="span" color="success.main">
                                                Gratuite
                                            </Typography>
                                        ) : (
                                            `${shippingCost.toFixed(2)} DT`
                                        )}
                                    </Typography>
                                </Box>

                                {shippingCost > 0 && subtotal < 100 && (
                                    <Typography variant="caption" color="text.secondary">
                                        Livraison gratuite pour les commandes supérieures à 100 DT
                                    </Typography>
                                )}
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 3
                            }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {total.toFixed(2)} DT
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<ShoppingCart />}
                                onClick={() => navigate('/checkout')}
                                sx={{ py: 1.5, mb: 2 }}
                            >
                                Passer la commande
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                size="large"
                                startIcon={<LocalShipping />}
                                onClick={() => navigate('/')}
                            >
                                Continuer vos achats
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}