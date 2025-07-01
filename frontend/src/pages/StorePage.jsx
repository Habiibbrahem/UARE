// src/pages/StorePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    CircularProgress,
    Grid,
    Typography,
    Button,
    TextField,
    MenuItem,
    Paper
} from '@mui/material';
import { FilterList, Search, Sort } from '@mui/icons-material';
import axiosInstance from '../services/axiosInstance';
import { getStoreById, getProductsByStore } from '../services/storeService';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/useCartStore';

export default function StorePage() {
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getStoreById(storeId),
            getProductsByStore(storeId)
        ])
            .then(([storeRes, productsRes]) => {
                setStore(storeRes.data);
                setProducts(productsRes.data);
            })
            .finally(() => setLoading(false));
    }, [storeId]);

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case 'priceLowHigh':
                return a.price - b.price;
            case 'priceHighLow':
                return b.price - a.price;
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'popular':
                return (b.views || 0) - (a.views || 0);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={12}>
                <CircularProgress />
            </Box>
        );
    }

    if (!store) {
        return (
            <Typography color="error" sx={{ mt: 12, textAlign: 'center' }}>
                Boutique introuvable.
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 3, pt: 12, backgroundColor: 'grey.100', minHeight: '100vh' }}>
            {/* En-tête de la boutique */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #ff8e53 30%, #fe6b8b 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                >
                    {store.name}
                </Typography>
            </Box>

            {/* Recherche et filtres */}
            <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Rechercher des produits"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <Search sx={{ mr: 1, color: 'text.disabled' }} />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Trier par"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            InputProps={{
                                startAdornment: <Sort sx={{ mr: 1, color: 'text.disabled' }} />
                            }}
                        >
                            <MenuItem value="newest">Plus récentes</MenuItem>
                            <MenuItem value="priceLowHigh">Prix : croissant</MenuItem>
                            <MenuItem value="priceHighLow">Prix : décroissant</MenuItem>
                            <MenuItem value="popular">Les plus populaires</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FilterList />}
                            sx={{ height: '56px' }}
                        >
                            Filtres
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Grille de produits */}
            {sortedProducts.length === 0 ? (
                <Typography variant="h6" textAlign="center" my={4}>
                    Aucun produit trouvé. Essayez d'ajuster vos filtres.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {sortedProducts.map((product) => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                            <ProductCard product={product} store={store} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
