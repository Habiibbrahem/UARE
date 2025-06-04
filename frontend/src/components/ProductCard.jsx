import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    IconButton,
    Badge,
    Chip
} from '@mui/material';
import { Favorite, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import useCartStore from '../store/useCartStore';

export default function ProductCard({ product, store }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [isFavorite, setIsFavorite] = React.useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            storeId: store._id
        });
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }
        }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={`${axiosInstance.defaults.baseURL}${product.image}`}
                    alt={product.name}
                    sx={{ objectFit: 'contain', p: 1 }}
                />
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)'
                        }
                    }}
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    <Favorite color={isFavorite ? 'error' : 'action'} />
                </IconButton>
                {product.discount && (
                    <Chip
                        label={`-${product.discount}%`}
                        color="error"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1
                }}>
                    {product.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        ${product.price.toFixed(2)}
                    </Typography>
                    {product.originalPrice && (
                        <Typography variant="body2" color="text.disabled" sx={{
                            textDecoration: 'line-through',
                            ml: 1
                        }}>
                            ${product.originalPrice.toFixed(2)}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    size="small"
                    component={Link}
                    to={`/product/${product._id}`}
                    sx={{ mr: 1 }}
                >
                    View
                </Button>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={handleAddToCart}
                    sx={{ ml: 'auto' }}
                >
                    <ShoppingCart />
                </IconButton>
            </CardActions>
        </Card>
    );
}