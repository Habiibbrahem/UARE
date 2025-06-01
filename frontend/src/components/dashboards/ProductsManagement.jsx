// src/components/dashboards/ProductsManagement.jsx
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
} from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import {
    getProductsByStore,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../../services/productService';

export default function ProductsManagement() {
    const [storeId, setStoreId] = useState(undefined);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, msg: '', sev: 'success' });

    // On mount: figure out which store this user belongs to (member → owner)
    useEffect(() => {
        let cancelled = false;

        async function lookupStore() {
            // 1) try member endpoint
            try {
                const member = await axiosInstance.get('/stores/member');
                if (!cancelled && Array.isArray(member.data) && member.data.length > 0) {
                    const id = member.data[0]._id;
                    setStoreId(id);
                    return loadProducts(id);
                }
            } catch {
                // ignore
            }

            // 2) fallback to owner endpoint
            try {
                const owner = await axiosInstance.get('/stores/owner');
                if (!cancelled && Array.isArray(owner.data) && owner.data.length > 0) {
                    const id = owner.data[0]._id;
                    setStoreId(id);
                    return loadProducts(id);
                }
            } catch {
                // ignore
            }

            // 3) no store
            if (!cancelled) setStoreId(null);
        }

        lookupStore();
        axiosInstance.get('/categories').then(res => setCategories(res.data));

        return () => { cancelled = true; };
    }, []);

    // Fetch products for a given store
    function loadProducts(id) {
        setLoading(true);
        getProductsByStore(id)
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false));
    }

    // While figuring out storeId
    if (storeId === undefined) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    // No access
    if (storeId === null) {
        return (
            <Typography color="error" align="center" mt={4}>
                You do not have access to a store.
            </Typography>
        );
    }

    // Open create/edit dialog
    const openForm = prod => {
        setCurrent({
            _id: prod?._id,
            name: prod?.name || '',
            description: prod?.description || '',
            price: prod?.price || 0,
            quantity: prod?.quantity || 0,
            categoryId: prod?.categoryId?._id || '',
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

    // Handle file input
    const onFile = e => setCurrent(c => ({ ...c, imageFile: e.target.files[0] }));

    // Save (create or update)
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
                setProducts(ps => ps.map(p => p._id === current._id ? res.data : p));
            } else {
                res = await createProduct(fd);
                setProducts(ps => [...ps, res.data]);
            }
            setSnackbar({ open: true, msg: 'Saved!', sev: 'success' });
            closeForm();
        } catch {
            setSnackbar({ open: true, msg: 'Failed to save', sev: 'error' });
        }
    };

    // Delete product
    const remove = async id => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            setProducts(ps => ps.filter(p => p._id !== id));
            setSnackbar({ open: true, msg: 'Deleted!', sev: 'success' });
        } catch {
            setSnackbar({ open: true, msg: 'Failed to delete', sev: 'error' });
        }
    };

    return (
        <Box p={2}>
            <Button variant="contained" onClick={() => openForm()} sx={{ mb: 2 }}>
                Add Product
            </Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No products</TableCell>
                                </TableRow>
                            ) : products.map(p => (
                                <TableRow key={p._id}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.description || '-'}</TableCell>
                                    <TableCell>
                                        {p.image
                                            ? <img src={`${axiosInstance.defaults.baseURL}${p.image}`} alt={p.name} width={50} />
                                            : '-'}
                                    </TableCell>
                                    <TableCell>${p.price.toFixed(2)}</TableCell>
                                    <TableCell>{p.quantity}</TableCell>
                                    <TableCell>{p.categoryId?.name || '-'}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" onClick={() => openForm(p)}>Edit</Button>{' '}
                                        <Button size="small" color="error" onClick={() => remove(p._id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={dialogOpen} onClose={closeForm}>
                <DialogTitle>{current?._id ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth margin="dense" label="Name"
                        value={current?.name || ''}
                        onChange={e => setCurrent(c => ({ ...c, name: e.target.value }))}
                    />
                    <TextField
                        fullWidth margin="dense" label="Description"
                        value={current?.description || ''}
                        onChange={e => setCurrent(c => ({ ...c, description: e.target.value }))}
                    />
                    {current?.existingImage && (
                        <Box mb={1}>
                            <img
                                src={`${axiosInstance.defaults.baseURL}${current.existingImage}`}
                                alt="current"
                                width={100}
                            />
                        </Box>
                    )}
                    <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                        Upload Image
                        <input type="file" hidden accept="image/*" onChange={onFile} />
                    </Button>
                    {current?.imageFile && <Typography>{current.imageFile.name}</Typography>}
                    <TextField
                        fullWidth margin="dense" type="number" label="Price"
                        value={current?.price || 0}
                        onChange={e => setCurrent(c => ({ ...c, price: +e.target.value }))}
                    />
                    <TextField
                        fullWidth margin="dense" type="number" label="Quantity"
                        value={current?.quantity || 0}
                        onChange={e => setCurrent(c => ({ ...c, quantity: +e.target.value }))}
                    />
                    <TextField
                        select fullWidth margin="dense" label="Category"
                        value={current?.categoryId || ''}
                        onChange={e => setCurrent(c => ({ ...c, categoryId: e.target.value }))}
                    >
                        <MenuItem value="">— none —</MenuItem>
                        {categories.map(c => (
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm}>Cancel</Button>
                    <Button onClick={saveProduct} variant="contained">Save</Button>
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
