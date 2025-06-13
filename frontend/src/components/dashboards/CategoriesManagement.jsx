import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import '../../styles/admin/dashboardadmin.css';

// CategoriesManagement: Manages categories with a nested table and dialog for add/edit
export default function CategoriesManagement() {
    const [categories, setCategories] = useState([]);
    const [tree, setTree] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [expandedIds, setExpandedIds] = useState(new Set());

    const API_BASE = 'http://localhost:3000';

    // Fetch categories from API
    const fetchCategories = async () => {
        setFetching(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not authenticated');
                setCategories([]);
                setFetching(false);
                return;
            }
            const res = await axios.get(`${API_BASE}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const catsWithParent = res.data.map((cat) => ({
                ...cat,
                parentId: cat.parent || null,
            }));
            setCategories(catsWithParent);
        } catch (err) {
            setError('Failed to fetch categories');
            setCategories([]);
        }
        setFetching(false);
    };

    // Build lookup map for breadcrumb generation
    const buildLookup = (list) => {
        const lookup = {};
        list.forEach((cat) => {
            lookup[cat._id] = cat;
        });
        return lookup;
    };

    // Compute breadcrumb strings for each category
    const computeBreadcrumbs = (list) => {
        const lookup = buildLookup(list);
        const memo = {};

        const buildForId = (id) => {
            if (!id) return '';
            if (memo[id]) return memo[id];
            const node = lookup[id];
            if (!node) return '';
            if (!node.parentId) {
                memo[id] = node.name;
                return memo[id];
            }
            const parentPath = buildForId(node.parentId);
            memo[id] = parentPath ? `${parentPath} › ${node.name}` : node.name;
            return memo[id];
        };

        list.forEach((cat) => {
            buildForId(cat._id);
        });
        return memo;
    };

    // Build nested tree for table display
    const buildTree = (list) => {
        const map = {};
        const roots = [];

        list.forEach((cat) => {
            map[cat._id] = { ...cat, children: [] };
        });

        list.forEach((cat) => {
            if (cat.parentId && map[cat.parentId]) {
                map[cat.parentId].children.push(map[cat._id]);
            } else {
                roots.push(map[cat._id]);
            }
        });

        return roots;
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setTree(buildTree(categories));
        setBreadcrumbs(computeBreadcrumbs(categories));
    }, [categories]);

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    // Render nested table rows
    const renderRows = (nodes, level = 0) =>
        nodes.map((cat) => (
            <React.Fragment key={cat._id}>
                <TableRow sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell sx={{ pl: `${20 * level + 16}px` }}>
                        {cat.children.length > 0 && (
                            <IconButton
                                size="small"
                                onClick={() => toggleExpand(cat._id)}
                                sx={{ mr: 1 }}
                            >
                                {expandedIds.has(cat._id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        )}
                        {!cat.children.length && <Box component="span" sx={{ display: 'inline-block', width: 32 }} />}
                        {cat.name}
                    </TableCell>
                    <TableCell>{cat.description || '-'}</TableCell>
                    <TableCell>
                        {cat.parentId
                            ? categories.find((c) => c._id === cat.parentId)?.name || '-'
                            : 'Root'}
                    </TableCell>
                    <TableCell align="right">
                        <IconButton
                            onClick={() => handleOpenDialog(cat)}
                            sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleDelete(cat._id)}
                            sx={{ '&:hover': { color: 'error.dark' } }}
                        >
                            <Delete />
                        </IconButton>
                    </TableCell>
                </TableRow>
                {cat.children.length > 0 && expandedIds.has(cat._id) && renderRows(cat.children, level + 1)}
            </React.Fragment>
        ));

    const handleOpenDialog = (category = null) => {
        if (category) {
            setSelectedCategory({
                _id: category._id,
                name: category.name,
                description: category.description || '',
                parentId: category.parentId || '',
            });
        } else {
            setSelectedCategory({ name: '', description: '', parentId: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const handleInputChange = (e) => {
        setSelectedCategory({ ...selectedCategory, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!selectedCategory.name || selectedCategory.name.trim() === '') {
            alert('Category name is required');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('User not authenticated');
                setLoading(false);
                return;
            }
            const payload = {
                name: selectedCategory.name.trim(),
                description: selectedCategory.description,
                parentId: selectedCategory.parentId || null,
            };
            if (selectedCategory._id) {
                await axios.put(`${API_BASE}/categories/${selectedCategory._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${API_BASE}/categories`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            await fetchCategories();
            handleCloseDialog();
        } catch (err) {
            alert('Failed to save category');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('User not authenticated');
                return;
            }
            await axios.delete(`${API_BASE}/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchCategories();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    return (
        <Box sx={{ p: 3 }} className="dashboard-card">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                    Categories Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'primary.dark' },
                    }}
                >
                    Add Category
                </Button>
            </Box>

            {fetching ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" sx={{ textAlign: 'center' }}>
                    {error}
                </Typography>
            ) : categories.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
                    No categories available.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <Table className="dashboard-table">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Parent Category</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{renderRows(tree)}</TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                classes={{ paper: 'dashboard-dialog' }}
                sx={{ '& .MuiDialog-paper': { borderRadius: 2, p: 2 } }}
            >
                <DialogTitle sx={{ fontWeight: 'medium' }}>
                    {selectedCategory?._id ? 'Edit Category' : 'Add Category'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={selectedCategory?.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={selectedCategory?.description || ''}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="parent-category-label">Parent Category</InputLabel>
                        <Select
                            labelId="parent-category-label"
                            label="Parent Category"
                            name="parentId"
                            value={selectedCategory?.parentId || ''}
                            onChange={handleInputChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': { borderColor: 'primary.main' },
                                },
                            }}
                        >
                            <MenuItem value="">None (Root category)</MenuItem>
                            {categories
                                .filter((cat) => cat._id !== selectedCategory?._id)
                                .map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {breadcrumbs[cat._id] || cat.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{ textTransform: 'none', color: 'grey.600' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                            textTransform: 'none',
                            px: 3,
                            '&:hover': { bgcolor: 'primary.dark' },
                        }}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}