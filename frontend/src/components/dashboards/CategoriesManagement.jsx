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
    Tooltip,
    CircularProgress,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { Add, Edit, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export default function CategoriesManagement() {
    const [categories, setCategories] = useState([]);
    const [tree, setTree] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [expandedIds, setExpandedIds] = useState(new Set());

    // Fetch categories
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
            setCategories(res.data);
        } catch (error) {
            setError('Failed to fetch categories');
            setCategories([]);
        }
        setFetching(false);
    };

    // Convert flat categories list to tree using parentId
    const buildTree = (list) => {
        const map = {};
        const roots = [];

        list.forEach((cat) => {
            map[cat._id] = { ...cat, children: [] };
        });

        list.forEach((cat) => {
            if (cat.parentId) {
                if (map[cat.parentId]) {
                    map[cat.parentId].children.push(map[cat._id]);
                } else {
                    // parentId missing (orphan), treat as root
                    roots.push(map[cat._id]);
                }
            } else {
                // no parentId => root category
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

    // Recursive rendering of categories tree
    const renderRows = (nodes, level = 0) =>
        nodes.map((cat) => (
            <React.Fragment key={cat._id}>
                <TableRow>
                    <TableCell style={{ paddingLeft: 20 * level }}>
                        {cat.children.length > 0 && (
                            <IconButton size="small" onClick={() => toggleExpand(cat._id)}>
                                {expandedIds.has(cat._id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        )}
                        {!cat.children.length && <span style={{ width: 40, display: 'inline-block' }}></span>}
                        {cat.name}
                    </TableCell>
                    <TableCell>{cat.description || '-'}</TableCell>
                    <TableCell>{cat.parentId ? categories.find(c => c._id === cat.parentId)?.name || '-' : 'Root'}</TableCell>
                    <TableCell align="right">
                        <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenDialog(cat)}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => handleDelete(cat._id)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
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
                name: selectedCategory.name,
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
        } catch (error) {
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
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h5" mb={2}>
                Categories Management
            </Typography>

            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                Add Category
            </Button>

            {fetching ? (
                <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" variant="body1">
                    {error}
                </Typography>
            ) : categories.length === 0 ? (
                <Typography variant="body1">No categories available.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
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

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedCategory?._id ? 'Edit' : 'Add'} Category</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={selectedCategory?.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={selectedCategory?.description || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="parent-category-label">Parent Category</InputLabel>
                        <Select
                            labelId="parent-category-label"
                            label="Parent Category"
                            name="parentId"
                            value={selectedCategory?.parentId || ''}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="">None (Root category)</MenuItem>
                            {categories
                                .filter((cat) => cat._id !== selectedCategory?._id) // exclude self to prevent loops
                                .map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
