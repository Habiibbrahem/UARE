import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../services/productService';

export default function SearchResultsPage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const q = params.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (q) {
            setLoading(true);
            searchProducts(q)
                .then(res => setProducts(res.data))
                .finally(() => setLoading(false));
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [q]);

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
                Results for “{q}”
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
                <Typography>No products found.</Typography>
            )}
        </Box>
    );
}
