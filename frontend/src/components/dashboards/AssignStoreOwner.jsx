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

// AssignationProprietaireMagasin : Formulaire pour assigner un propriétaire à un magasin
export default function AssignationProprietaireMagasin() {
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
                console.error('Erreur lors de la récupération des magasins :', error);
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
                console.error('Erreur lors de la récupération des propriétaires :', error);
            }
        };

        fetchStores();
        fetchStoreOwners();
    }, []);

    const handleAssign = async () => {
        if (!selectedStoreId || !selectedOwnerId) {
            alert('Veuillez sélectionner un magasin et un propriétaire');
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
            alert('Propriétaire assigné avec succès !');
            setSelectedStoreId('');
            setSelectedOwnerId('');
        } catch (error) {
            console.error('Erreur lors de l\'assignation du propriétaire :', error);
            alert('Échec de l\'assignation. Vérifiez la console pour plus de détails.');
        }
        setLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Assigner un propriétaire à un magasin
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="store-select-label">Choisir un magasin</InputLabel>
                    <Select
                        labelId="store-select-label"
                        value={selectedStoreId}
                        label="Choisir un magasin"
                        onChange={(e) => setSelectedStoreId(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: 'primary.main' },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Sélectionner un magasin</em>
                        </MenuItem>
                        {stores.map((store) => (
                            <MenuItem key={store._id} value={store._id}>
                                {store.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="owner-select-label">Choisir un propriétaire</InputLabel>
                    <Select
                        labelId="owner-select-label"
                        value={selectedOwnerId}
                        label="Choisir un propriétaire"
                        onChange={(e) => setSelectedOwnerId(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: 'primary.main' },
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Sélectionner un propriétaire</em>
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
                        {loading ? 'Assignation...' : 'Assigner'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
