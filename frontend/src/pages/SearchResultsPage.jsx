// src/pages/SearchResultsPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    CircularProgress,
    Paper
} from '@mui/material';
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
            <Box display="flex" justifyContent="center" mt={12}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: 'grey.100', minHeight: '100vh', pt: 12, pb: 8 }}>
            {/* Hero Section */}
            <Container maxWidth="md" sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #ff8e53 30%, #fe6b8b 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        mb: 1,
                        fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                >
                    Résultats de recherche
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontStyle: 'italic',
                        opacity: 0.8
                    }}
                >
                    Vous recherchez :{' '}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(90deg, #42a5f5 0%, #478ed1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        « {q} »
                    </Box>
                </Typography>
            </Container>

            <Container maxWidth="lg">
                {products.length ? (
                    <Grid container spacing={4}>
                        {products.map(p => (
                            <Grid item key={p._id} xs={12} sm={6} md={4} lg={3}>
                                <ProductCard product={p} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h6">
                            Aucun produit trouvé pour « {q} ».
                        </Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
}