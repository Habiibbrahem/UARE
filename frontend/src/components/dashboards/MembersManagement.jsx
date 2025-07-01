import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createUser } from '../../api/userService';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    TextField,
    List,
    ListItem,
    ListItemText,
    Card,
    Divider,
    styled,
    Stack,
} from '@mui/material';

const API_BASE = 'http://localhost:3000';

// Carte de section pour uniformiser le style
const SectionCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(4),
}));

// Élément de liste de membre
const MemberItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    '&:not(:last-child)': {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

// Champ de formulaire stylé
const InputField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius,
    },
}));

export default function GestionMembres() {
    const [store, setStore] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMember, setNewMember] = useState({ name: '', email: '', password: '' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Vous devez être connecté');

                const res = await axios.get(`${API_BASE}/stores/owner`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.data.length) throw new Error('Aucun magasin assigné');

                const ownerStore = res.data[0];
                setStore(ownerStore);
                setMembers(ownerStore.members || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const authHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleInput = (e) => setNewMember({ ...newMember, [e.target.name]: e.target.value });

    const handleCreate = async () => {
        const { name, email, password } = newMember;
        if (!name || !email || !password) {
            alert('Nom, email et mot de passe requis');
            return;
        }
        setCreating(true);
        try {
            const { data: user } = await createUser(
                { name, email, password, role: 'store_member' },
                localStorage.getItem('token')
            );
            await axios.post(
                `${API_BASE}/stores/${store._id}/members`,
                { userId: user._id },
                { headers: authHeader() }
            );
            setMembers((prev) => [...prev, user]);
            setNewMember({ name: '', email: '', password: '' });
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(err.response?.data?.message || 'Échec de la création');
        } finally {
            setCreating(false);
        }
    };

    const handleRemove = async (userId) => {
        if (!window.confirm('Supprimer ce membre ?')) return;
        try {
            await axios.delete(
                `${API_BASE}/stores/${store._id}/members/${userId}`,
                { headers: authHeader() }
            );
            setMembers((prev) => prev.filter((m) => m._id !== userId));
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('Échec de la suppression');
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <Typography color="error">{error}</Typography>;
    if (!store) return null;

    return (
        <Box sx={{ px: 3, py: 2, maxWidth: 800, mx: 'auto' }}>
            <Typography
                variant="h4"
                sx={{
                    mb: 4,
                    fontWeight: 700,
                    pb: 1,
                    borderBottom: 2,
                    borderColor: 'divider',
                }}
            >
                Gestion des membres — « {store.name} »
            </Typography>

            <SectionCard>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Membres actuels
                </Typography>
                {members.length === 0 ? (
                    <Typography color="text.secondary">Aucun membre pour le moment.</Typography>
                ) : (
                    <List disablePadding>
                        {members.map((m) => (
                            <MemberItem key={m._id}>
                                <ListItemText
                                    primary={m.name}
                                    secondary={m.email}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleRemove(m._id)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Supprimer
                                </Button>
                            </MemberItem>
                        ))}
                    </List>
                )}
            </SectionCard>

            <Divider sx={{ my: 2 }} />

            <SectionCard>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Ajouter un nouveau membre
                </Typography>
                <Stack spacing={2}>
                    <InputField
                        label="Nom"
                        name="name"
                        value={newMember.name}
                        onChange={handleInput}
                        fullWidth
                    />
                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={newMember.email}
                        onChange={handleInput}
                        fullWidth
                    />
                    <InputField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={newMember.password}
                        onChange={handleInput}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        disabled={creating}
                        sx={{
                            alignSelf: 'flex-start',
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                        }}
                    >
                        {creating ? 'Création…' : 'Créer et ajouter'}
                    </Button>
                </Stack>
            </SectionCard>
        </Box>
    );
}
