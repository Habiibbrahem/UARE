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
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Tooltip,
    Typography,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import axios from 'axios';

const hardcodedCategories = [
    { id: 'category1-id', name: 'Category 1' },
    { id: 'category2-id', name: 'Category 2' },
    // Add your actual hardcoded categories here with _id values matching backend
];

export default function SubcategoriesManagement() {
    const [subcategories, setSubcategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSubcategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/subcategories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubcategories(res.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    useEffect(() => {
        fetchSubcategories();
    }, []);

    const handleOpenDialog = (subcategory = null) => {
        if (subcategory) {
            setSelectedSubcategory(subcategory);
        } else {
            setSelectedSubcategory({ name: '', description: '', categoryId: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSubcategory(null);
    };

    const handleInputChange = (e) => {
        setSelectedSubcategory({ ...selectedSubcategory, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!selectedSubcategory.name || !selectedSubcategory.categoryId) {
            alert('Name and Category are required');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            if (selectedSubcategory._id) {
                // Update
                await axios.put(
                    `http://localhost:3000/subcategories/${selectedSubcategory._id}`,
                    selectedSubcategory,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Create
                await axios.post(
                    'http://localhost:3000/subcategories',
                    selectedSubcategory,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            await fetchSubcategories();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving subcategory:', error);
            alert('Failed to save subcategory');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/subcategories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchSubcategories();
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                Subcategories Management
            </Typography>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
                Add Subcategory
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subcategories.map((subcat) => (
                            <TableRow key={subcat._id}>
                                <TableCell>{subcat.name}</TableCell>
                                <TableCell>{subcat.description || '-'}</TableCell>
                                <TableCell>{subcat.category?.name || '-'}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpenDialog(subcat)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton color="error" onClick={() => handleDelete(subcat._id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedSubcategory && selectedSubcategory._id ? 'Edit' : 'Add'} Subcategory</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={selectedSubcategory?.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={selectedSubcategory?.description || ''}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={3}
                    />
                    <FormControl fullWidth margin="dense" required>
                        <InputLabel id="category-select-label">Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            name="categoryId"
                            value={selectedSubcategory?.categoryId || ''}
                            label="Category"
                            onChange={handleInputChange}
                        >
                            {hardcodedCategories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
