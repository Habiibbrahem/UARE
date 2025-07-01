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
    CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import '../../styles/admin/dashboardadmin.css';

// GestionProprietairesMagasin : Gère les propriétaires de magasins avec un tableau et une boîte de dialogue pour ajouter/modifier
export default function GestionProprietairesMagasin() {
    const [owners, setOwners] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [loading, setLoading] = useState(false);

    // Récupérer les propriétaires de magasins
    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/users/store-owners-with-stores', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOwners(res.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des propriétaires :', error);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    const handleOpenDialog = (owner = null) => {
        if (owner) {
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
            alert('Le nom et l\'email sont requis');
            return;
        }
        if (!selectedOwner._id && !selectedOwner.password) {
            alert('Le mot de passe est requis pour un nouveau propriétaire');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (selectedOwner._id) {
                const updateData = { ...selectedOwner };
                if (!updateData.password) delete updateData.password;
                await axios.put(
                    `http://localhost:3000/users/${selectedOwner._id}`,
                    updateData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    'http://localhost:3000/users',
                    {
                        name: selectedOwner.name,
                        email: selectedOwner.email,
                        password: selectedOwner.password,
                        role: 'store_owner',
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            await fetchOwners();
            handleCloseDialog();
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du propriétaire :', error);
            alert('Échec de l\'enregistrement');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchOwners();
        } catch (error) {
            console.error('Erreur lors de la suppression du propriétaire :', error);
            alert('Échec de la suppression');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                    Gestion des propriétaires de magasins
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
                    Ajouter un propriétaire
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>Nom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Magasins assignés</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {owners.length > 0 ? (
                            owners.map((owner) => (
                                <TableRow key={owner._id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
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
                                            <Typography variant="body2" color="text.secondary">
                                                <em>Aucun magasin assigné</em>
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleOpenDialog(owner)}
                                            sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(owner._id)}
                                            sx={{ '&:hover': { color: 'error.dark' } }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'grey.600' }}>
                                    Aucun propriétaire trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                classes={{ paper: 'dashboard-dialog' }}
                sx={{ '& .MuiDialog-paper': { borderRadius: 2, p: 2 } }}
            >
                <DialogTitle sx={{ fontWeight: 'medium' }}>
                    {selectedOwner && selectedOwner._id ? 'Modifier un propriétaire' : 'Ajouter un propriétaire'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nom"
                        name="name"
                        value={selectedOwner?.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={selectedOwner?.email || ''}
                        onChange={handleInputChange}
                        fullWidth
                        type="email"
                        sx={{ mb: 2 }}
                    />
                    {!selectedOwner?._id && (
                        <TextField
                            margin="dense"
                            label="Mot de passe"
                            name="password"
                            value={selectedOwner?.password || ''}
                            onChange={handleInputChange}
                            fullWidth
                            type="password"
                            sx={{ mb: 2 }}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{ textTransform: 'none', color: 'grey.600' }}
                    >
                        Annuler
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
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
