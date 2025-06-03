// src/components/dashboards/MembersManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createUser } from '../../api/userService';

const API_BASE = 'http://localhost:3000';

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

                // Backend route is GET /stores/owner (no ownerId in URL)
                const res = await axios.get(`${API_BASE}/stores/owner`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // res.data should be an array; pick the first store
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

    const handleInput = (e) =>
        setNewMember({ ...newMember, [e.target.name]: e.target.value });

    const handleCreateMember = async () => {
        const { name, email, password } = newMember;
        if (!name || !email || !password) {
            return alert('Name, email & password are required');
        }

        setCreating(true);
        try {
            // 1) Create the user with role "store_member"
            const { data: user } = await createUser(
                { name, email, password, role: 'store_member' },
                token
            );

            // 2) Add them to this store
            await axios.post(
                `${API_BASE}/stores/${store._id}/members`,
                { userId: user._id },
                { headers: authHeader }
            );

            // 3) Update UI
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

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!store) return null;

    return (
        <div>
            <h2>Manage Members for “{store.name}”</h2>

            <section>
                <h3>Current Members</h3>
                {members.length === 0 ? (
                    <p>No members yet.</p>
                ) : (
                    <ul>
                        {members.map((m) => (
                            <li key={m._id}>
                                {m.name} ({m.email}){' '}
                                <button onClick={() => handleRemoveMember(m._id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h3>Add New Member</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={handleInput}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newMember.email}
                    onChange={handleInput}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newMember.password}
                    onChange={handleInput}
                />
                <button onClick={handleCreateMember} disabled={creating}>
                    {creating ? 'Creating…' : 'Create & Add Member'}
                </button>
            </section>
        </div>
    );
}
