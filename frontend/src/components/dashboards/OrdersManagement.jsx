// src/components/dashboards/OrdersManagement.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    getStoreByOwner,
    getOrdersByStore,
    updateOrderStatus,
    confirmOrderDelivery,
    cancelOrder,
} from '../../services/storeOwnerService';

const ORDER_STATUS_OPTIONS = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
];

// Helper to decode JWT token payload
function decodeToken(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        return payload;
    } catch {
        return null;
    }
}

export default function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        orderId: null,
        action: null,
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = decodeToken(token);
        if (user && user.sub) {
            getStoreByOwner(user.sub)
                .then((res) => {
                    if (res.data.length > 0) {
                        setStoreId(res.data[0]._id);
                    } else {
                        setError('No store found for the current user.');
                    }
                })
                .catch(() => setError('Failed to load store'));
        } else {
            setError('User not authenticated');
        }
    }, []);

    useEffect(() => {
        if (storeId) {
            fetchOrders();
        }
    }, [storeId]);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getOrdersByStore(storeId);
            setOrders(res.data);
        } catch {
            setError('Failed to load orders');
        }
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setActionLoading(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            setSnackbar({ open: true, message: 'Order status updated', severity: 'success' });
            fetchOrders();
        } catch {
            setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
        }
        setActionLoading(false);
    };

    const handleConfirmDelivery = (orderId) => {
        setConfirmDialog({ open: true, orderId, action: 'confirmDelivery' });
    };

    const handleCancelOrder = (orderId) => {
        setConfirmDialog({ open: true, orderId, action: 'cancelOrder' });
    };

    const handleConfirmDialogClose = () => {
        setConfirmDialog({ open: false, orderId: null, action: null });
    };

    const handleConfirmDialogSubmit = async () => {
        setActionLoading(true);
        try {
            if (confirmDialog.action === 'confirmDelivery') {
                await confirmOrderDelivery(confirmDialog.orderId);
                setSnackbar({ open: true, message: 'Delivery confirmed', severity: 'success' });
            } else if (confirmDialog.action === 'cancelOrder') {
                await cancelOrder(confirmDialog.orderId);
                setSnackbar({ open: true, message: 'Order cancelled', severity: 'success' });
            }
            fetchOrders();
        } catch {
            setSnackbar({ open: true, message: 'Failed to perform action', severity: 'error' });
        }
        setActionLoading(false);
        handleConfirmDialogClose();
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Manage Orders
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order Number</TableCell>
                                <TableCell>Customer ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order.orderNumber}</TableCell>
                                        <TableCell>{order.customerId}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                disabled={
                                                    actionLoading ||
                                                    order.status === 'cancelled' ||
                                                    order.status === 'delivered'
                                                }
                                                size="small"
                                            >
                                                {ORDER_STATUS_OPTIONS.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>{order.paymentMethod}</TableCell>
                                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                disabled={actionLoading || order.status !== 'shipped'}
                                                onClick={() => handleConfirmDelivery(order._id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Confirm Delivery
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                disabled={
                                                    actionLoading || !['pending', 'processing'].includes(order.status)
                                                }
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                Cancel
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={confirmDialog.open} onClose={handleConfirmDialogClose}>
                <DialogTitle>
                    {confirmDialog.action === 'confirmDelivery' ? 'Confirm Delivery' : 'Cancel Order'}
                </DialogTitle>
                <DialogContent>
                    Are you sure you want to{' '}
                    {confirmDialog.action === 'confirmDelivery'
                        ? 'confirm delivery of this order?'
                        : 'cancel this order?'}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} disabled={actionLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDialogSubmit}
                        disabled={actionLoading}
                        variant="contained"
                        color="primary"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
