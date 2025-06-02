// src/pages/StorePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';         // ← import Link
import axiosInstance from '../services/axiosInstance';
import {
    Box,
    CircularProgress,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
} from '@mui/material';
import { getStoreById } from '../services/storeService';

export default function StorePage() {
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getStoreById(storeId)
            .then((res) => setStore(res.data))
            .finally(() => setLoading(false));
    }, [storeId]);

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
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                {store.name}
            </Typography>
            <Grid container spacing={3}>
                {!store.products.length ? (
                    <Grid item xs={12}>
                        <Typography>No products in this store.</Typography>
                    </Grid>
                ) : (
                    store.products.map((prod) => (
                        <Grid item key={prod._id} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                {prod.image && (
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={`${axiosInstance.defaults.baseURL}${prod.image}`}  // prefix with baseURL
                                        alt={prod.name}
                                    />
                                )}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{prod.name}</Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph noWrap>
                                        {prod.description}
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary">
                                        ${prod.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {/* Link to Product Detail page instead of plain href */}
                                    <Button
                                        size="small"
                                        component={Link}
                                        to={`/product/${prod._id}`}
                                    >
                                        View
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}
