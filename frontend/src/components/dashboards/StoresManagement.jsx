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
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import axios from 'axios';

export default function StoresManagement() {
    const [stores, setStores] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const fetchStores = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/stores', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStores(res.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleOpenDialog = (store = null) => {
        if (store) {
            setSelectedStore(store);
            setImagePreview(store.image || '');
            setImageFile(null);
        } else {
            setSelectedStore({ name: '', address: '', phoneNumber: '', email: '', image: '' });
            setImagePreview('');
            setImageFile(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStore(null);
        setImageFile(null);
        setImagePreview('');
    };

    const handleInputChange = (e) => {
        setSelectedStore({ ...selectedStore, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/stores/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.imageUrl; // assuming backend returns { imageUrl: "..." }
    };

    const handleSave = async () => {
        if (!selectedStore.name) {
            alert('Store name is required');
            return;
        }
        if (!selectedStore.image && !imageFile) {
            alert('Store image is required');
            return;
        }

        setLoading(true);
        try {
            let imageUrl = selectedStore.image;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const token = localStorage.getItem('token');

            const storeData = {
                ...selectedStore,
                image: imageUrl,
            };

            if (selectedStore._id) {
                // Update existing store
                await axios.put(
                    `http://localhost:3000/stores/${selectedStore._id}`,
                    storeData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Create new store
                await axios.post(
                    'http://localhost:3000/stores',
                    storeData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            await fetchStores();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving store:', error);
            alert('Failed to save store');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this store?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/stores/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStores();
        } catch (error) {
            console.error('Error deleting store:', error);
        }
    };

    return (
        <Box p={2}>
            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
                Add Store
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store._id}>
                                <TableCell>{store.name}</TableCell>
                                <TableCell>{store.ownerId ? (store.ownerId.name || store.ownerId.email) : 'No owner assigned'}</TableCell>
                                <TableCell>
                                    {store.image ? (
                                        <img
                                            src={store.image}
                                            alt={store.name}
                                            style={{ width: 80, height: 60, objectFit: 'cover' }}
                                        />
                                    ) : (
                                        'No image'
                                    )}
                                </TableCell>
                                <TableCell>{store.address}</TableCell>
                                <TableCell>{store.phoneNumber}</TableCell>
                                <TableCell>{store.email}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpenDialog(store)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(store._id)}
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

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedStore && selectedStore._id ? 'Edit Store' : 'Add Store'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={selectedStore?.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <Box mt={2} mb={2}>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <Box mt={1}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ width: 100, height: 80, objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                    </Box>
                    <TextField
                        margin="dense"
                        label="Address"
                        name="address"
                        value={selectedStore?.address || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        name="phoneNumber"
                        value={selectedStore?.phoneNumber || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        value={selectedStore?.email || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
