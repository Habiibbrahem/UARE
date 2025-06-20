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
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    getCurrentUser,
    updateCurrentUser,
    deleteCurrentUser,
} from '../api/userService';
import './AccountPage.css';

export default function AccountPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

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
            return setSnackbar({ open: true, message: 'Current password is required', severity: 'error' });
        }
        if (newPassword && newPassword !== confirmPassword) {
            return setSnackbar({ open: true, message: 'New passwords do not match', severity: 'error' });
        }

        try {
            await updateCurrentUser({ email, currentPassword, newPassword, confirmPassword });
            setSnackbar({ open: true, message: 'Account updated!', severity: 'success' });
            setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Update failed', severity: 'error' });
        }
    };

    const handleDelete = async () => {
        if (!form.currentPassword) {
            return setSnackbar({ open: true, message: 'Current password is required to delete account', severity: 'error' });
        }
        if (!window.confirm('Really delete your account?')) return;

        try {
            await deleteCurrentUser(form.currentPassword);
            localStorage.removeItem('token');
            navigate('/');
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Deletion failed', severity: 'error' });
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
                        My Account
                    </Typography>
                    <Divider className="account-divider" />
                </Box>

                <Box component="form" onSubmit={handleSubmit} className="account-form">
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={form.currentPassword}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="New Password"
                            name="newPassword"
                            type="password"
                            helperText="Leave blank to keep current password"
                            value={form.newPassword}
                            onChange={handleChange}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                    </Stack>

                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" className="primary-button">
                            Update Profile
                        </Button>
                        <Button variant="outlined" color="error" className="danger-button" onClick={handleDelete}>
                            Delete Account
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
