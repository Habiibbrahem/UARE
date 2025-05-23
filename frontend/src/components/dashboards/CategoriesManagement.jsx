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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

export default function CategoriesManagement() {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);

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
            const res = await axios.get('http://localhost:3000/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Categories fetched:', res.data);
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories');
            setCategories([]);
        }
        setFetching(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenDialog = (category = null) => {
        if (category) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory({ name: '', description: '' });
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
            if (selectedCategory._id) {
                await axios.put(
                    `http://localhost:3000/categories/${selectedCategory._id}`,
                    selectedCategory,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    'http://localhost:3000/categories',
                    selectedCategory,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            await fetchCategories();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving category:', error);
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
            await axios.delete(`http://localhost:3000/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h5" mb={2}>
                Categories Management
            </Typography>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
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
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat._id}>
                                    <TableCell>{cat.name}</TableCell>
                                    <TableCell>{cat.description}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleOpenDialog(cat)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(cat._id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
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
