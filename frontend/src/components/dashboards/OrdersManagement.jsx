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
    Card,
    styled
} from '@mui/material';
import {
    getStoreByOwner,
    getOrdersByStore,
    updateOrderStatus,
    confirmOrderDelivery,
    cancelOrder,
} from '../../services/storeOwnerService';

const ORDER_STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const StatusSelect = styled(Select)(({ theme }) => ({
    '& .MuiSelect-select': {
        padding: '8px 32px 8px 12px !important',
        borderRadius: theme.shape.borderRadius,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
    padding: '8px 16px',
    fontWeight: 500,
    marginRight: theme.spacing(1),
}));

const ContentCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: theme.palette.grey[100],
}));

function decodeToken(token) {
    try {
        const base64Payload = token.split('.')[1];
        return JSON.parse(atob(base64Payload));
    } catch {
        return null;
    }
}

export default function GestionCommandes() {
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
        if (!user || !user.sub) {
            setError("Utilisateur non authentifié");
            return;
        }

        getStoreByOwner()
            .then((res) => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setStoreId(res.data[0]._id);
                } else {
                    setError("Aucune boutique trouvée pour cet utilisateur.");
                }
            })
            .catch(() => {
                setError("Échec du chargement de la boutique");
            });
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
            setError("Échec du chargement des commandes");
        }
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setActionLoading(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            setSnackbar({ open: true, message: "Statut mis à jour", severity: 'success' });
            await fetchOrders();
        } catch {
            setSnackbar({ open: true, message: "Échec de la mise à jour du statut", severity: 'error' });
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
                setSnackbar({ open: true, message: "Livraison confirmée", severity: 'success' });
            } else if (confirmDialog.action === 'cancelOrder') {
                await cancelOrder(confirmDialog.orderId);
                setSnackbar({ open: true, message: "Commande annulée", severity: 'success' });
            }
            await fetchOrders();
        } catch {
            setSnackbar({ open: true, message: "Échec de l'action", severity: 'error' });
        }
        setActionLoading(false);
        handleConfirmDialogClose();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{
                mb: 3,
                fontWeight: 600,
                pb: 1,
                borderBottom: '2px solid',
                borderColor: 'divider'
            }}>
                Gestion des commandes
            </Typography>

            <ContentCard>
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small" aria-label="table des commandes">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>N° Commande</StyledTableCell>
                                    <StyledTableCell>ID Client</StyledTableCell>
                                    <StyledTableCell>Adresse</StyledTableCell>
                                    <StyledTableCell>Téléphone</StyledTableCell>
                                    <StyledTableCell>Statut</StyledTableCell>
                                    <StyledTableCell>Paiement</StyledTableCell>
                                    <StyledTableCell>Total</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            Aucune commande trouvée.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow
                                            key={order._id}
                                            hover
                                            sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                                        >
                                            <TableCell>{order.orderNumber}</TableCell>
                                            <TableCell>{order.customerId}</TableCell>
                                            <TableCell>{order.shippingAddress}</TableCell>
                                            <TableCell>{order.phoneNumber}</TableCell>
                                            <TableCell>
                                                <StatusSelect
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
                                                </StatusSelect>
                                            </TableCell>
                                            <TableCell>{order.paymentMethod}</TableCell>
                                            <TableCell>{`${order.totalAmount.toFixed(2)} TND`}</TableCell>
                                            <TableCell>
                                                <ActionButton
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={actionLoading || order.status !== 'shipped'}
                                                    onClick={() => handleConfirmDelivery(order._id)}
                                                >
                                                    Confirmer la livraison
                                                </ActionButton>
                                                <ActionButton
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={
                                                        actionLoading || !['pending', 'processing'].includes(order.status)
                                                    }
                                                    onClick={() => handleCancelOrder(order._id)}
                                                >
                                                    Annuler
                                                </ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </ContentCard>

            <Dialog open={confirmDialog.open} onClose={handleConfirmDialogClose}>
                <DialogTitle>
                    {confirmDialog.action === 'confirmDelivery' ? 'Confirmer la livraison' : 'Annuler la commande'}
                </DialogTitle>
                <DialogContent>
                    Êtes-vous sûr de vouloir {confirmDialog.action === 'confirmDelivery' ? 'confirmer la livraison de cette commande ?' : 'annuler cette commande ?'}
                </DialogContent>
                <DialogActions>
                    <ActionButton
                        onClick={handleConfirmDialogClose}
                        disabled={actionLoading}
                        variant="outlined"
                    >
                        Annuler
                    </ActionButton>
                    <ActionButton
                        onClick={handleConfirmDialogSubmit}
                        disabled={actionLoading}
                        variant="contained"
                        color="primary"
                    >
                        Oui
                    </ActionButton>
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
