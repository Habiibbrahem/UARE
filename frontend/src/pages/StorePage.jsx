// src/pages/StorePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    CircularProgress,
    Grid,
    Typography,
    Button,
    TextField,
    MenuItem,
    Paper,
    Divider,
    IconButton,
    Badge
} from '@mui/material';
import { FilterList, Search, Sort, ShoppingCart } from '@mui/icons-material';
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
    const [activeFilters, setActiveFilters] = useState({
        category: '',
        priceRange: '',
        availability: true
    });
    const totalItems = useCartStore((state) => state.getTotalCount());

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
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory = !activeFilters.category ||
            product.categoryId === activeFilters.category;

        // Price range filter (example)
        const matchesPrice = !activeFilters.priceRange || (
            activeFilters.priceRange === 'under50' && product.price < 50 ||
            activeFilters.priceRange === '50to100' && product.price >= 50 && product.price <= 100 ||
            activeFilters.priceRange === 'over100' && product.price > 100
        );

        return matchesSearch && matchesCategory && matchesPrice;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case 'priceLowHigh': return a.price - b.price;
            case 'priceHighLow': return b.price - a.price;
            case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
            case 'popular': return (b.views || 0) - (a.views || 0);
            default: return 0;
        }
    });

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!store) {
        return <Typography color="error">Store not found.</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Store Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Typography variant="h4">{store.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton component={Link} to="/cart" color="inherit">
                        <Badge badgeContent={totalItems} color="error">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                </Box>
            </Box>

            {/* Filters and Search */}
            <Paper elevation={0} sx={{
                p: 3,
                mb: 4,
                border: '1px solid #eee',
                borderRadius: '12px'
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search products..."
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
                            label="Sort by"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            InputProps={{
                                startAdornment: <Sort sx={{ mr: 1, color: 'text.disabled' }} />
                            }}
                        >
                            <MenuItem value="newest">Newest</MenuItem>
                            <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                            <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                            <MenuItem value="popular">Most Popular</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FilterList />}
                            sx={{ height: '56px' }}
                        >
                            Filters
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Products Grid */}
            {!sortedProducts.length ? (
                <Typography variant="h6" textAlign="center" my={4}>
                    No products found. Try adjusting your filters.
                </Typography>
            ) : (
                <Grid container spacing={3}>
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