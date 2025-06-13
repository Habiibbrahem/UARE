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
    styled
} from '@mui/material';

const API_BASE = 'http://localhost:3000';

const MemberCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
}));

const MemberListItem = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const FormInput = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius,
    },
}));

export default function MembersManagement() {
    const [store, setStore] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) throw new Error('You must be logged in');

                const res = await axios.get(`${API_BASE}/stores/owner`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!Array.isArray(res.data) || res.data.length === 0) {
                    throw new Error('No store assigned to this owner');
                }

                const ownerStore = res.data[0];
                setStore(ownerStore);
                setMembers(ownerStore.members || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load store');
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, []);

    const token = localStorage.getItem('token');
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const handleInput = (e) => {
        setNewMember({ ...newMember, [e.target.name]: e.target.value });
    };

    const handleCreateMember = async () => {
        const { name, email, password } = newMember;
        if (!name || !email || !password) {
            alert('Name, email & password are required');
            return;
        }

        setCreating(true);
        try {
            const { data: user } = await createUser(
                { name, email, password, role: 'store_member' },
                token
            );

            await axios.post(
                `${API_BASE}/stores/${store._id}/members`,
                { userId: user._id },
                { headers: authHeader }
            );

            setMembers((prev) => [...prev, user]);
            setNewMember({ name: '', email: '', password: '' });
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(
                err.response?.data?.message ||
                err.message ||
                'Failed to create & add member'
            );
        } finally {
            setCreating(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('Remove this member?')) return;
        try {
            await axios.delete(
                `${API_BASE}/stores/${store._id}/members/${userId}`,
                { headers: authHeader }
            );
            setMembers((prev) => prev.filter((m) => m._id !== userId));
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(err.response?.data?.message || err.message || 'Failed to remove');
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center">
            <CircularProgress />
        </Box>
    );

    if (error) return <Typography color="error">{error}</Typography>;
    if (!store) return null;

    return (
        <Box>
            <Typography variant="h5" sx={{
                mb: 3,
                fontWeight: 600,
                pb: 1,
                borderBottom: '2px solid',
                borderColor: 'divider'
            }}>
                Manage Members for "{store.name}"
            </Typography>

            <MemberCard>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    Current Members
                </Typography>

                {members.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                        No members yet.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {members.map((m) => (
                            <MemberListItem key={m._id}>
                                <ListItemText
                                    primary={m.name}
                                    secondary={m.email}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => handleRemoveMember(m._id)}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Remove
                                </Button>
                            </MemberListItem>
                        ))}
                    </List>
                )}
            </MemberCard>

            <MemberCard>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    Add New Member
                </Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormInput
                        label="Name"
                        name="name"
                        value={newMember.name}
                        onChange={handleInput}
                        fullWidth
                        variant="outlined"
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        value={newMember.email}
                        onChange={handleInput}
                        fullWidth
                        variant="outlined"
                    />
                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={newMember.password}
                        onChange={handleInput}
                        fullWidth
                        variant="outlined"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateMember}
                        disabled={creating}
                        sx={{
                            alignSelf: 'flex-start',
                            textTransform: 'none',
                            px: 3,
                            py: 1
                        }}
                    >
                        {creating ? 'Creating...' : 'Create & Add Member'}
                    </Button>
                </Box>
            </MemberCard>
        </Box>
    );
}