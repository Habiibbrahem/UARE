// src/pages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    TextField,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import useCartStore from '../store/useCartStore';
import axiosInstance from '../services/axiosInstance';

export default function CartPage() {
    const navigate = useNavigate();
    const cartItems = useCartStore((state) => state.cartItems);
    const totalPrice = useCartStore((state) => state.getTotalPrice());
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);

    if (!cartItems.length) {
        return (
            <Box p={3}>
                <Typography variant="h5">Your Cart is Empty</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Shopping Cart
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell align="center">Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.map((item) => (
                            <TableRow key={item.productId}>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <img
                                            src={
                                                item.image.startsWith('/')
                                                    ? `${axiosInstance.defaults.baseURL}${item.image}`
                                                    : item.image
                                            }
                                            alt={item.name}
                                            style={{ width: 60, marginRight: 12 }}
                                        />
                                        <Typography>{item.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateQuantity(item.productId, Math.max(1, Number(e.target.value)))
                                        }
                                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                        sx={{ width: 80 }}
                                    />
                                </TableCell>
                                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => removeFromCart(item.productId)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={clearCart}
                        sx={{ mr: 2 }}
                    >
                        Clear Cart
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
