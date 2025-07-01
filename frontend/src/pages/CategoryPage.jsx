// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Box,
    Grid,
    Typography,
    CircularProgress,
    Paper
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory } from '../services/productService';
import { getCategoryById } from '../services/categoryService';

export default function CategoryPage() {
    const { categoryId } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getCategoryById(categoryId),
            getProductsByCategory(categoryId)
        ])
            .then(([catRes, prodRes]) => {
                setCategoryName(catRes.data.name);
                setProducts(prodRes.data);
            })
            .finally(() => setLoading(false));
    }, [categoryId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={12}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: 'grey.100', minHeight: '100vh', pt: 12, pb: 8 }}>
            <Container maxWidth="md" sx={{ textAlign: 'center', mb: 6 }}>
                {/* Stylish Category Title */}
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        mb: 1
                    }}
                >
                    {categoryName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Explorez notre sélection exclusive de <Box component="span" sx={{ fontWeight: 700 }}>{categoryName}</Box>.
                </Typography>
            </Container>

            <Container maxWidth="lg">
                {products.length ? (
                    <Grid container spacing={4}>
                        {products.map((p) => (
                            <Grid item key={p._id} xs={12} sm={6} md={4} lg={3}>
                                <ProductCard product={p} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            mt: 4,
                            borderRadius: 2,
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Aucun produit disponible
                        </Typography>
                        <Typography color="text.secondary">
                            Revenez bientôt pour découvrir de nouveaux <Box component="span" sx={{ fontWeight: 700 }}>{categoryName}</Box>.
                        </Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
}
