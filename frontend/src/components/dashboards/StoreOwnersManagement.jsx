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
    Typography,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import axios from 'axios';

export default function StoreOwnersManagement() {
    const [owners, setOwners] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch store owners with their stores populated
    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/users/store-owners-with-stores', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOwners(res.data);
        } catch (error) {
            console.error('Error fetching store owners:', error);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    const handleOpenDialog = (owner = null) => {
        if (owner) {
            // When editing, don't allow clearing password field
            setSelectedOwner({ ...owner, password: '' });
        } else {
            setSelectedOwner({ name: '', email: '', password: '', role: 'store_owner' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOwner(null);
    };

    const handleInputChange = (e) => {
        setSelectedOwner({ ...selectedOwner, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!selectedOwner?.name || !selectedOwner?.email) {
            alert('Name and Email are required');
            return;
        }
        if (!selectedOwner._id && !selectedOwner.password) {
            alert('Password is required for new store owners');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (selectedOwner._id) {
                // Update existing owner (don't send empty password)
                const updateData = { ...selectedOwner };
                if (!updateData.password) delete updateData.password;

                await axios.put(
                    `http://localhost:3000/users/${selectedOwner._id}`,
                    updateData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Create new owner, enforce role to store_owner
                await axios.post(
                    'http://localhost:3000/users',
                    { name: selectedOwner.name, email: selectedOwner.email, password: selectedOwner.password, role: 'store_owner' },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            await fetchOwners();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving store owner:', error);
            alert('Failed to save store owner');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this store owner?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchOwners();
        } catch (error) {
            console.error('Error deleting store owner:', error);
            alert('Failed to delete store owner');
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>
                Store Owners Management
            </Typography>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{ mb: 2 }}
            >
                Add Store Owner
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Owner Name</TableCell>
                            <TableCell>Owner Email</TableCell>
                            <TableCell>Assigned Stores</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {owners.length > 0 ? owners.map((owner) => (
                            <TableRow key={owner._id}>
                                <TableCell>{owner.name}</TableCell>
                                <TableCell>{owner.email}</TableCell>
                                <TableCell>
                                    {owner.stores && owner.stores.length > 0 ? (
                                        owner.stores.map((store) => (
                                            <Typography key={store._id} variant="body2" sx={{ mb: 0.5 }}>
                                                {store.name} — {store.address}
                                            </Typography>
                                        ))
                                    ) : (
                                        <em>No assigned stores</em>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpenDialog(owner)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(owner._id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No store owners found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedOwner && selectedOwner._id ? 'Edit' : 'Add'} Store Owner</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={selectedOwner?.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={selectedOwner?.email || ''}
                        onChange={handleInputChange}
                        fullWidth
                        type="email"
                    />
                    {!selectedOwner?._id && (
                        <TextField
                            margin="dense"
                            label="Password"
                            name="password"
                            value={selectedOwner?.password || ''}
                            onChange={handleInputChange}
                            fullWidth
                            type="password"
                        />
                    )}
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
