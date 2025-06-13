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
} from '@mui/material';
import axiosInstance from '../../services/axiosInstance';
import {
    getProductsByStore,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../../services/productService';
import '../../styles/dashboard.css';

export default function ProductsManagement() {
    const [storeId, setStoreId] = useState(undefined);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, msg: '', sev: 'success' });
    const [breadcrumbs, setBreadcrumbs] = useState({});

    // On mount: figure out which store this user belongs to (member → owner)
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

        return () => { cancelled = true; };
    }, []);

    // Compute breadcrumb paths for all categories
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

            if (!node.parentId) {
                memo[id] = node.name;
                return memo[id];
            }

            const parentPath = buildPath(node.parentId);
            memo[id] = parentPath ? `${parentPath} › ${node.name}` : node.name;
            return memo[id];
        };

        categories.forEach(cat => {
            buildPath(cat._id);
        });

        return memo;
    };

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
            <Box className="dashboard-loading">
                <CircularProgress />
            </Box>
        );
    }

    // No access
    if (storeId === null) {
        return (
            <Typography className="dashboard-error-message" align="center">
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
        <Box className="dashboard-card">
            <Box className="dashboard-title">
                <Typography variant="h5">Products Management</Typography>
                <Button variant="contained" onClick={() => openForm()} className="dashboard-primary-button">
                    Add Product
                </Button>
            </Box>

            {loading ? (
                <Box className="dashboard-loading">
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table className="dashboard-table">
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
                                    <TableCell colSpan={7} align="center" className="dashboard-no-data">
                                        No products found
                                    </TableCell>
                                </TableRow>
                            ) : products.map(p => (
                                <TableRow key={p._id} className="dashboard-category-row">
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.description || '-'}</TableCell>
                                    <TableCell>
                                        {p.image
                                            ? <img
                                                src={`${axiosInstance.defaults.baseURL}${p.image}`}
                                                alt={p.name}
                                                className="dashboard-image-preview"
                                            />
                                            : '-'}
                                    </TableCell>
                                    <TableCell>${p.price.toFixed(2)}</TableCell>
                                    <TableCell>{p.quantity}</TableCell>
                                    <TableCell>{breadcrumbs[p.categoryId?._id || p.categoryId] || '-'}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            onClick={() => openForm(p)}
                                            className="dashboard-action-button edit"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => remove(p._id)}
                                            className="dashboard-action-button delete"
                                        >
                                            Delete
                                        </Button>
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
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth margin="dense" label="Name"
                            value={current?.name || ''}
                            onChange={e => setCurrent(c => ({ ...c, name: e.target.value }))}
                        />
                    </Box>
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth margin="dense" label="Description"
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
                            Upload Image
                            <input type="file" hidden accept="image/*" onChange={onFile} />
                        </Button>
                        {current?.imageFile && <Typography>{current.imageFile.name}</Typography>}
                    </Box>
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth margin="dense" type="number" label="Price"
                            value={current?.price || 0}
                            onChange={e => setCurrent(c => ({ ...c, price: +e.target.value }))}
                        />
                    </Box>
                    <Box className="dashboard-form-input">
                        <TextField
                            fullWidth margin="dense" type="number" label="Quantity"
                            value={current?.quantity || 0}
                            onChange={e => setCurrent(c => ({ ...c, quantity: +e.target.value }))}
                        />
                    </Box>
                    <Box className="dashboard-form-input">
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={current?.categoryId || ''}
                                onChange={e => setCurrent(c => ({ ...c, categoryId: e.target.value }))}
                            >
                                <MenuItem value="">— none —</MenuItem>
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
                    <Button onClick={closeForm} className="dashboard-secondary-button">Cancel</Button>
                    <Button onClick={saveProduct} className="dashboard-primary-button">Save</Button>
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