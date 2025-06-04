// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Divider,
    Grid,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import { Add, Remove, Delete as DeleteIcon } from '@mui/icons-material';
import useCartStore from '../store/useCartStore';

export default function CartPage() {
    const navigate = useNavigate();
    const cartItems = useCartStore((state) => state.cartItems);
    const totalPrice = useCartStore((state) => state.getTotalPrice());
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    if (!cartItems.length) {
        return (
            <Box p={3}>
                <Typography variant="h5">Your Cart is Empty</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                MANTEAUX & DOUDOUNES
            </Typography>

            <Grid container spacing={4}>
                {/* Left Column - Products & Filters */}
                <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        DISPONIBILITE: {cartItems.length} items
                    </Typography>

                    {/* Filters */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                        <Button variant="outlined" size="small">RISK</Button>
                        <Button variant="outlined" size="small">TAILLE</Button>
                        <Button variant="outlined" size="small">MARQUE</Button>
                        <Button variant="outlined" size="small">GENRE</Button>
                        <Button variant="outlined" size="small">TYPE</Button>
                    </Box>

                    {/* Cart Items List */}
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                        <List>
                            {cartItems.map((item) => (
                                <React.Fragment key={item.productId}>
                                    <ListItem>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1">{item.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.options?.color || 'Couleur WSON'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Taille: {item.options?.size || 'L'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                                <IconButton
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    size="small"
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                <IconButton
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    size="small"
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ minWidth: 100, textAlign: 'right' }}>
                                                {item.price.toFixed(2)} DT
                                            </Typography>
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => removeFromCart(item.productId)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Right Column - Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom>PANIER</Typography>

                        {/* Example cart item in summary */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Blouson / Anouck</Typography>
                            <Typography variant="body2" color="text.secondary">Couleur WSON</Typography>
                            <Typography variant="body2" color="text.secondary">Taille: L</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>259-900 DT</Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>
                            INSTRUCTIONS SPECIALES POUR LA COMMANDE
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>SOUS-TOTAL</span>
                                <span>{totalPrice.toFixed(2)} DT</span>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Les codes presse, les frais d'ensel et les taxes seront ajoutés à la coûte.
                            </Typography>
                        </Box>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                            }
                            label="JE SUIS D'ACCORD AVEC LES TERMES ET CONDITIONS"
                            sx={{ mb: 2 }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={!agreeTerms}
                            onClick={() => navigate('/checkout')}
                        >
                            FINALISEZ VOTRE COMMANDE
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}