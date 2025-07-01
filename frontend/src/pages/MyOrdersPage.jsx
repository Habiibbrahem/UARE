// 📄 src/pages/MyOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import jwt_decode from 'jwt-decode';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Button,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const { sub: customerId } = jwt_decode(token);

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get('/orders');
            const userOrders = res.data.filter(o => o.customerId === customerId);
            setOrders(userOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm('Confirmer l\'annulation de cette commande ?')) return;
        try {
            await axiosInstance.patch(`/orders/${orderId}/cancel`);
            fetchOrders();
        } catch (error) {
            alert('Échec de l\'annulation');
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container sx={{ mt: 12, mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Mes Commandes
            </Typography>

            {loading ? (
                <Typography>Chargement...</Typography>
            ) : orders.length === 0 ? (
                <Typography>Vous n'avez aucune commande.</Typography>
            ) : (
                orders.map(order => (
                    <Accordion key={order._id} sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ backgroundColor: 'grey.100', px: 2, py: 1 }}
                        >
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        Commande n° {order.orderNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body2">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="body2">
                                        Total: {order.totalAmount.toFixed(2)} DT
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Chip
                                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        color={
                                            order.status === 'cancelled'
                                                ? 'error'
                                                : order.status === 'delivered'
                                                    ? 'success'
                                                    : 'primary'
                                        }
                                        sx={{ textTransform: 'capitalize' }}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionSummary>

                        <AccordionDetails sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Détails des produits :</Typography>
                            <List disablePadding>
                                {order.items.map(item => (
                                    <React.Fragment key={item.productId}>
                                        <ListItem sx={{ py: 1 }}>
                                            <ListItemText
                                                primary={`${item.name} x${item.quantity}`}
                                                secondary={`${(item.price * item.quantity).toFixed(2)} DT`}
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>

                            <Box sx={{ textAlign: 'right', mt: 2 }}>
                                {['pending', 'processing'].includes(order.status) && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleCancel(order._id)}
                                    >
                                        Annuler la commande
                                    </Button>
                                )}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Container>
    );
}
