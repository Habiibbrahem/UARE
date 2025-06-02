// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    CircularProgress,
    Grid,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import { getProductById } from '../services/productService';
import useCartStore from '../store/useCartStore';

export default function ProductPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        setLoading(true);
        getProductById(productId)
            .then((res) => setProduct(res.data))
            .finally(() => setLoading(false));
    }, [productId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return <Typography color="error">Product not found.</Typography>;
    }

    // Suppose your Product schema supplies something like `product.colors`
    const colors = product.colors || ['Default'];

    const handleAddToCart = () => {
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: Number(quantity),
            color: selectedColor || colors[0],

            // ◀️ Include storeId so checkout knows where to send the order
            storeId: product.storeId,
        });
    };

    return (
        <Box p={3}>
            <Grid container spacing={4}>
                {/* Left: Product Image */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ maxWidth: 600 }}>
                        {product.image && (
                            <CardMedia
                                component="img"
                                image={`${axiosInstance.defaults.baseURL}${product.image}`}
                                alt={product.name}
                                sx={{ objectFit: 'contain', maxHeight: 400 }}
                            />
                        )}
                    </Card>
                </Grid>

                {/* Right: Details */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product.name}
                    </Typography>

                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        ${product.price.toFixed(2)}
                    </Typography>

                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>

                    {/* Variant selector, e.g. colors */}
                    {colors.length > 0 && (
                        <Box mb={2}>
                            <TextField
                                select
                                label="Color"
                                value={selectedColor || colors[0]}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                fullWidth
                            >
                                {colors.map((c) => (
                                    <MenuItem key={c} value={c}>
                                        {c}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    )}

                    {/* Quantity selector */}
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            inputProps={{ min: 1 }}
                        />
                    </Box>

                    <CardActions sx={{ p: 0 }}>
                        <Button variant="contained" size="large" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </CardActions>
                </Grid>
            </Grid>
        </Box>
    );
}
