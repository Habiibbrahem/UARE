// src/pages/AccountPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    CircularProgress,
    Snackbar,
    Alert,
    Paper,
    Stack,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    getCurrentUser,
    updateCurrentUser,
    deleteCurrentUser
} from '../api/userService';
import './AccountPage.css';

export default function AccountPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        (async () => {
            try {
                const res = await getCurrentUser();
                setForm(f => ({ ...f, email: res.data.email }));
            } catch {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const { email, currentPassword, newPassword, confirmPassword } = form;

        if (!currentPassword) {
            return setSnackbar({ open: true, message: 'Le mot de passe actuel est requis', severity: 'error' });
        }
        if (newPassword && newPassword !== confirmPassword) {
            return setSnackbar({ open: true, message: 'Les nouveaux mots de passe ne correspondent pas', severity: 'error' });
        }

        try {
            await updateCurrentUser({ email, currentPassword, newPassword, confirmPassword });
            setSnackbar({ open: true, message: 'Profil mis à jour !', severity: 'success' });
            setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Échec de la mise à jour', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!form.currentPassword) {
            return setSnackbar({ open: true, message: 'Le mot de passe actuel est requis pour supprimer le compte', severity: 'error' });
        }
        if (!window.confirm('Voulez-vous vraiment supprimer votre compte ?')) return;

        try {
            await deleteCurrentUser(form.currentPassword);
            localStorage.removeItem('token');
            navigate('/');
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Échec de la suppression', severity: 'error' });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" className="account-page">
            <Paper elevation={3} className="account-card">
                <Box className="account-header">
                    <Typography variant="h5" className="account-title">
                        Mon compte
                    </Typography>
                    <Divider className="account-divider" />
                </Box>

                <Box component="form" onSubmit={handleSubmit} className="account-form">
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Adresse e-mail"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Mot de passe actuel"
                            name="currentPassword"
                            type="password"
                            value={form.currentPassword}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Nouveau mot de passe"
                            name="newPassword"
                            type="password"
                            helperText="Laisser vide pour conserver l'actuel"
                            value={form.newPassword}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                    </Stack>

                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" className="primary-button">
                            Mettre à jour
                        </Button>
                        <Button variant="outlined" color="error" className="danger-button" onClick={handleDelete}>
                            Supprimer le compte
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}