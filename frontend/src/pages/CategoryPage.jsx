// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory } from '../services/productService';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProductsByCategory(categoryId)
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false));
    }, [categoryId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={2}>
                Products in this Category
            </Typography>
            {products.length ? (
                <Grid container spacing={3}>
                    {products.map(p => (
                        <Grid item key={p._id} xs={12} sm={6} md={4} lg={3}>
                            <ProductCard product={p} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography>No products found for this category.</Typography>
            )}
        </Box>
    );
}
