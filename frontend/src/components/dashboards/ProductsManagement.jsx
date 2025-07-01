import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
    Select,
    styled
} from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import {
    getProductsByStore,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../../services/productService';
import '../../styles/dashboard.css';

// Boutons stylisés

const PrimaryButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    padding: '10px 24px',
    borderRadius: theme.shape.borderRadius * 2,
    fontWeight: 600,
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    color: '#fff',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    transition: 'background 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
        boxShadow: '0 6px 10px 4px rgba(25, 118, 210, .4)',
    },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    padding: '10px 24px',
    borderRadius: theme.shape.borderRadius * 2,
    fontWeight: 600,
    border: `2px solid ${theme.palette.grey[400]}`,
    color: theme.palette.grey[700],
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: theme.palette.grey[600],
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[900],
    },
}));

const EditButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    padding: '6px 16px',
    borderRadius: theme.shape.borderRadius * 1.5,
    fontWeight: 600,
    backgroundColor: '#4caf50',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.4)',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: '#388e3c',
        boxShadow: '0 4px 8px rgba(56, 142, 60, 0.5)',
    },
}));

const DeleteButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    padding: '6px 16px',
    borderRadius: theme.shape.borderRadius * 1.5,
    fontWeight: 600,
    backgroundColor: '#f44336',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(244, 67, 54, 0.4)',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: '#d32f2f',
        boxShadow: '0 4px 8px rgba(211, 47, 47, 0.5)',
    },
}));

export default function GestionProduits() {
    const [storeId, setStoreId] = useState(undefined);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, msg: '', sev: 'success' });
    const [breadcrumbs, setBreadcrumbs] = useState({});

    useEffect(() => {
        let cancelled = false;

        async function lookupStore() {
            try {
                const member = await axiosInstance.get('/stores/member');
                if (!cancelled && Array.isArray(member.data) && member.data.length > 0) {
                    const id = member.data[0]._id;
                    setStoreId(id);
                    return loadProducts(id);
                }
            } catch { }

            try {
                const owner = await axiosInstance.get('/stores/owner');
                if (!cancelled && Array.isArray(owner.data) && owner.data.length > 0) {
                    const id = owner.data[0]._id;
                    setStoreId(id);
                    return loadProducts(id);
                }
            } catch { }

            if (!cancelled) setStoreId(null);
        }

        lookupStore();
        axiosInstance.get('/categories').then(res => {
            setCategories(res.data);
            setBreadcrumbs(computeBreadcrumbs(res.data));
        });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line
    }, []);

    const computeBreadcrumbs = (categories) => {
        const lookup = {};
        categories.forEach(cat => {
            lookup[cat._id] = cat;
        });

        const memo = {};

        const buildPath = (id) => {
            if (!id) return '';
            if (memo[id]) return memo[id];

            const node = lookup[id];
            if (!node) return '';

            if (!node.parent) {
                memo[id] = node.name;
                return memo[id];
            }

            const parentPath = buildPath(node.parent);
            memo[id] = parentPath ? `${parentPath} › ${node.name}` : node.name;
            return memo[id];
        };

        categories.forEach(cat => buildPath(cat._id));
        return memo;
    };

    function loadProducts(id) {
        setLoading(true);
        getProductsByStore(id)
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false));
    }

    if (storeId === undefined) {
        return (
            <Box sx={{
                width: '100%',
                maxWidth: 1200,
                minHeight: '100vh',
                bgcolor: '#f9f9f9',
                px: 3,
                py: 4,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (storeId === null) {
        return (
            <Box sx={{
                width: '100%',
                maxWidth: 1200,
                minHeight: '100vh',
                bgcolor: '#f9f9f9',
                px: 3,
                py: 4,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography align="center">
                    Vous n'avez pas accès à une boutique.
                </Typography>
            </Box>
        );
    }

    const openForm = prod => {
        setCurrent({
            _id: prod?._id,
            name: prod?.name || '',
            description: prod?.description || '',
            price: prod?.price || 0,
            quantity: prod?.quantity || 0,
            categoryId: prod?.categoryId?._id || prod?.categoryId || '',
            storeId,
            imageFile: null,
            existingImage: prod?.image,
        });
        setDialogOpen(true);
    };

    const closeForm = () => {
        setDialogOpen(false);
        setCurrent(null);
    };

    const onFile = e => setCurrent(c => ({ ...c, imageFile: e.target.files[0] }));

    const saveProduct = async () => {
        const fd = new FormData();
        fd.append('name', current.name);
        fd.append('description', current.description);
        fd.append('price', current.price.toString());
        fd.append('quantity', current.quantity.toString());
        fd.append('categoryId', current.categoryId);
        fd.append('storeId', current.storeId);
        if (current.imageFile) fd.append('image', current.imageFile);

        try {
            let res;
            if (current._id) {
                res = await updateProduct(current._id, fd);
                setProducts(ps => ps.map(p => (p._id === current._id ? res.data : p)));
            } else {
                res = await createProduct(fd);
                setProducts(ps => [...ps, res.data]);
            }
            setSnackbar({ open: true, msg: 'Enregistré !', sev: 'success' });
            closeForm();
        } catch {
            setSnackbar({ open: true, msg: 'Échec de l\'enregistrement', sev: 'error' });
        }
    };

    const remove = async id => {
        if (!window.confirm('Supprimer ce produit ?')) return;
        try {
            await deleteProduct(id);
            setProducts(ps => ps.filter(p => p._id !== id));
            setSnackbar({ open: true, msg: 'Supprimé !', sev: 'success' });
        } catch {
            setSnackbar({ open: true, msg: 'Échec de la suppression', sev: 'error' });
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1200,
                minHeight: '100vh',
                bgcolor: '#f9f9f9',
                px: 3,
                py: 4,
                mx: 'auto',
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
            }}>
                <Typography variant="h5">Gestion des produits</Typography>
                <PrimaryButton onClick={() => openForm()}>
                    Ajouter un produit
                </PrimaryButton>
            </Box>

            {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        width: '100%',
                        minWidth: 900,
                        maxWidth: '100%',
                        borderRadius: 2,
                        boxShadow: 2,
                        mx: 'auto',
                        overflowX: 'auto',
                    }}
                >
                    <Table className="dashboard-table" sx={{ minWidth: 1000 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Prix</TableCell>
                                <TableCell>Quantité</TableCell>
                                <TableCell>Catégorie</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" className="dashboard-no-data">
                                        Aucun produit trouvé
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map(p => (
                                    <TableRow key={p._id} className="dashboard-category-row">
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>{p.description || '-'}</TableCell>
                                        <TableCell>
                                            {p.image ? (
                                                <img
                                                    src={`${axiosInstance.defaults.baseURL}${p.image}`}
                                                    alt={p.name}
                                                    className="dashboard-image-preview"
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>{`${p.price.toFixed(2)} TND`}</TableCell>
                                        <TableCell>{p.quantity}</TableCell>
                                        <TableCell>
                                            {breadcrumbs[p.categoryId?._id || p.categoryId] || '-'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <EditButton size="small" onClick={() => openForm(p)}>
                                                Modifier
                                            </EditButton>
                                            <DeleteButton size="small" onClick={() => remove(p._id)}>
                                                Supprimer
                                            </DeleteButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={dialogOpen} onClose={closeForm}>
                <DialogTitle>
                    {current?._id ? 'Modifier le produit' : 'Ajouter un produit'}
                </DialogTitle>
                <DialogContent>
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Nom"
                            value={current?.name || ''}
                            onChange={e => setCurrent(c => ({ ...c, name: e.target.value }))}
                        />
                    </Box>
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Description"
                            value={current?.description || ''}
                            onChange={e => setCurrent(c => ({ ...c, description: e.target.value }))}
                        />
                    </Box>
                    {current?.existingImage && (
                        <Box mb={1}>
                            <img
                                src={`${axiosInstance.defaults.baseURL}${current.existingImage}`}
                                alt="current"
                                className="dashboard-image-preview"
                            />
                        </Box>
                    )}
                    <Box className="dashboard-file-upload">
                        <Button variant="outlined" component="label" className="dashboard-file-upload-button">
                            Télécharger une image
                            <input type="file" hidden accept="image/*" onChange={onFile} />
                        </Button>
                        {current?.imageFile && <Typography>{current.imageFile.name}</Typography>}
                    </Box>
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth
                            margin="dense"
                            type="number"
                            label="Prix"
                            value={current?.price || 0}
                            onChange={e => setCurrent(c => ({ ...c, price: +e.target.value }))}
                        />
                    </Box>
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth
                            margin="dense"
                            type="number"
                            label="Quantité"
                            value={current?.quantity || 0}
                            onChange={e => setCurrent(c => ({ ...c, quantity: +e.target.value }))}
                        />
                    </Box>
                    <Box className="dashboard-form-input">
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                label="Catégorie"
                                value={current?.categoryId || ''}
                                onChange={e => setCurrent(c => ({ ...c, categoryId: e.target.value }))}
                            >
                                <MenuItem value="">— aucune —</MenuItem>
                                {categories.map(c => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {breadcrumbs[c._id] || c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions className="dashboard-dialog-actions">
                    <SecondaryButton onClick={closeForm}>
                        Annuler
                    </SecondaryButton>
                    <PrimaryButton onClick={saveProduct}>
                        Enregistrer
                    </PrimaryButton>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.sev}>{snackbar.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
