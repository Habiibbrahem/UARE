// src/pages/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    Divider,
    Chip,
    Breadcrumbs
} from '@mui/material';
import { ShoppingCart, Favorite, Share } from '@mui/icons-material';
import axiosInstance from '../services/axiosInstance';
import { getProductById } from '../services/productService';
import useCartStore from '../store/useCartStore';

export default function ProductPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        setLoading(true);
        getProductById(productId)
            .then((res) => {
                setProduct(res.data);
                if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
                if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
            })
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

    const handleAddToCart = () => {
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: Number(quantity),
            color: selectedColor,
            size: selectedSize,
            storeId: product.storeId,
        });
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link to="/">Home</Link>
                <Link to={`/store/${product.storeId}`}>Store</Link>
                <Typography color="text.primary">{product.name}</Typography>
            </Breadcrumbs>

            <Grid container spacing={4}>
                {/* Left: Product Image */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardMedia
                            component="img"
                            image={`${axiosInstance.defaults.baseURL}${product.image}`}
                            alt={product.name}
                            sx={{
                                objectFit: 'contain',
                                height: 400,
                                p: 2
                            }}
                        />
                    </Card>
                </Grid>

                {/* Right: Details */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product.name}
                    </Typography>

                    {product.discount ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mr: 2 }}>
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </Typography>
                            <Typography variant="body1" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                                ${product.price.toFixed(2)}
                            </Typography>
                            <Chip
                                label={`${product.discount}% OFF`}
                                color="error"
                                size="small"
                                sx={{ ml: 2 }}
                            />
                        </Box>
                    ) : (
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                            ${product.price.toFixed(2)}
                        </Typography>
                    )}

                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* Variant selectors */}
                    {product.colors?.length > 0 && (
                        <Box mb={2}>
                            <Typography variant="subtitle2" gutterBottom>Color</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {product.colors.map((color) => (
                                    <Chip
                                        key={color}
                                        label={color}
                                        onClick={() => setSelectedColor(color)}
                                        variant={selectedColor === color ? 'filled' : 'outlined'}
                                        color="primary"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {product.sizes?.length > 0 && (
                        <Box mb={3}>
                            <Typography variant="subtitle2" gutterBottom>Size</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {product.sizes.map((size) => (
                                    <Chip
                                        key={size}
                                        label={size}
                                        onClick={() => setSelectedSize(size)}
                                        variant={selectedSize === size ? 'filled' : 'outlined'}
                                        color="primary"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Quantity selector */}
                    <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom>Quantity</Typography>
                        <TextField
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            inputProps={{ min: 1 }}
                            sx={{ width: 100 }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCart />}
                            onClick={handleAddToCart}
                            sx={{ flexGrow: 1 }}
                        >
                            Add to Cart
                        </Button>
                        <IconButton size="large">
                            <Favorite />
                        </IconButton>
                        <IconButton size="large">
                            <Share />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}