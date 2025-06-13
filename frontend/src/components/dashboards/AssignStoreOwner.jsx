import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import '../../styles/admin/dashboardadmin.css';

// AssignStoreOwner: Form to assign a store owner to a store
export default function AssignStoreOwner() {
    const [stores, setStores] = useState([]);
    const [storeOwners, setStoreOwners] = useState([]);
    const [selectedStoreId, setSelectedStoreId] = useState('');
    const [selectedOwnerId, setSelectedOwnerId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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

        const fetchStoreOwners = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/users/store-owners-with-stores', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStoreOwners(res.data);
            } catch (error) {
                console.error('Error fetching store owners:', error);
            }
        };

        fetchStores();
        fetchStoreOwners();
    }, []);

    const handleAssign = async () => {
        if (!selectedStoreId || !selectedOwnerId) {
            alert('Please select both a store and a store owner');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:3000/admin/stores/${selectedStoreId}/assign/${selectedOwnerId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Store owner assigned successfully!');
            setSelectedStoreId('');
            setSelectedOwnerId('');
        } catch (error) {
            console.error('Error assigning store owner:', error);
            alert('Failed to assign store owner. See console for details.');
        }
        setLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Assign Store Owner to Store
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="store-select-label">Select Store</InputLabel>
                    <Select
                        labelId="store-select-label"
                        value={selectedStoreId}
                        label="Select Store"
                        onChange={(e) => setSelectedStoreId(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: 'primary.main' },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select a store</em>
                        </MenuItem>
                        {stores.map((store) => (
                            <MenuItem key={store._id} value={store._id}>
                                {store.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="owner-select-label">Select Store Owner</InputLabel>
                    <Select
                        labelId="owner-select-label"
                        value={selectedOwnerId}
                        label="Select Store Owner"
                        onChange={(e) => setSelectedOwnerId(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: 'primary.main' },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Select an owner</em>
                        </MenuItem>
                        {storeOwners.map((owner) => (
                            <MenuItem key={owner._id} value={owner._id}>
                                {owner.name || owner.email}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAssign}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 1,
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'primary.dark' },
                        }}
                    >
                        {loading ? 'Assigning...' : 'Assign Store Owner'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}