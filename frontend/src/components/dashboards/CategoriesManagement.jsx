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
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import '../../styles/admin/dashboardadmin.css';

// Gestion des catégories : Gère les catégories avec un tableau imbriqué et une boîte de dialogue pour ajouter/modifier
export default function GestionCategories() {
    const [categories, setCategories] = useState([]);
    const [tree, setTree] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [expandedIds, setExpandedIds] = useState(new Set());

    const API_BASE = 'http://localhost:3000';

    // Récupère les catégories depuis l'API
    const fetchCategories = async () => {
        setFetching(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Utilisateur non authentifié');
                setCategories([]);
                setFetching(false);
                return;
            }
            const res = await axios.get(`${API_BASE}/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const catsWithParent = res.data.map((cat) => ({
                ...cat,
                parentId: cat.parent || null,
            }));
            setCategories(catsWithParent);
        } catch (err) {
            setError('Échec de la récupération des catégories');
            setCategories([]);
        }
        setFetching(false);
    };

    // Construit la table de correspondance pour la génération du fil d'Ariane
    const buildLookup = (list) => {
        const lookup = {};
        list.forEach((cat) => {
            lookup[cat._id] = cat;
        });
        return lookup;
    };

    // Calcule les chaînes de fil d'Ariane pour chaque catégorie
    const computeBreadcrumbs = (list) => {
        const lookup = buildLookup(list);
        const memo = {};

        const buildForId = (id) => {
            if (!id) return '';
            if (memo[id]) return memo[id];
            const node = lookup[id];
            if (!node) return '';
            if (!node.parentId) {
                memo[id] = node.name;
                return memo[id];
            }
            const parentPath = buildForId(node.parentId);
            memo[id] = parentPath ? `${parentPath} › ${node.name}` : node.name;
            return memo[id];
        };

        list.forEach((cat) => {
            buildForId(cat._id);
        });
        return memo;
    };

    // Construit l'arborescence imbriquée pour l'affichage du tableau
    const buildTree = (list) => {
        const map = {};
        const roots = [];

        list.forEach((cat) => {
            map[cat._id] = { ...cat, children: [] };
        });

        list.forEach((cat) => {
            if (cat.parentId && map[cat.parentId]) {
                map[cat.parentId].children.push(map[cat._id]);
            } else {
                roots.push(map[cat._id]);
            }
        });

        return roots;
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setTree(buildTree(categories));
        setBreadcrumbs(computeBreadcrumbs(categories));
    }, [categories]);

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    // Affiche les lignes imbriquées du tableau
    const renderRows = (nodes, level = 0) =>
        nodes.map((cat) => (
            <React.Fragment key={cat._id}>
                <TableRow sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell sx={{ pl: `${20 * level + 16}px` }}>
                        {cat.children.length > 0 && (
                            <IconButton
                                size="small"
                                onClick={() => toggleExpand(cat._id)}
                                sx={{ mr: 1 }}
                            >
                                {expandedIds.has(cat._id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        )}
                        {!cat.children.length && <Box component="span" sx={{ display: 'inline-block', width: 32 }} />}
                        {cat.name}
                    </TableCell>
                    <TableCell>{cat.description || '-'}</TableCell>
                    <TableCell>
                        {cat.parentId
                            ? categories.find((c) => c._id === cat.parentId)?.name || '-'
                            : 'Racine'}
                    </TableCell>
                    <TableCell align="right">
                        <IconButton
                            onClick={() => handleOpenDialog(cat)}
                            sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleDelete(cat._id)}
                            sx={{ '&:hover': { color: 'error.dark' } }}
                        >
                            <Delete />
                        </IconButton>
                    </TableCell>
                </TableRow>
                {cat.children.length > 0 && expandedIds.has(cat._id) && renderRows(cat.children, level + 1)}
            </React.Fragment>
        ));

    const handleOpenDialog = (category = null) => {
        if (category) {
            setSelectedCategory({
                _id: category._id,
                name: category.name,
                description: category.description || '',
                parentId: category.parentId || '',
            });
        } else {
            setSelectedCategory({ name: '', description: '', parentId: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
    };

    const handleInputChange = (e) => {
        setSelectedCategory({ ...selectedCategory, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!selectedCategory.name || selectedCategory.name.trim() === '') {
            alert('Le nom de la catégorie est requis');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Utilisateur non authentifié');
                setLoading(false);
                return;
            }
            const payload = {
                name: selectedCategory.name.trim(),
                description: selectedCategory.description,
                parentId: selectedCategory.parentId || null,
            };
            if (selectedCategory._id) {
                await axios.put(`${API_BASE}/categories/${selectedCategory._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${API_BASE}/categories`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            await fetchCategories();
            handleCloseDialog();
        } catch (err) {
            alert('Échec de l\'enregistrement de la catégorie');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Utilisateur non authentifié');
                return;
            }
            await axios.delete(`${API_BASE}/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchCategories();
        } catch (err) {
            alert('Échec de la suppression de la catégorie');
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 1200,      // << Large mais pas trop. Ajustez ici (1100/1300/1400 etc)
                minHeight: '100vh',
                bgcolor: '#f9f9f9',
                px: 3,               // << Un peu de padding horizontal
                py: 4,
                mx: 'auto',          // << Centrer horizontalement
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                    Gestion des catégories
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
                    Ajouter une catégorie
                </Button>
            </Box>

            {fetching ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" sx={{ textAlign: 'center' }}>
                    {error}
                </Typography>
            ) : categories.length === 0 ? (
                <Typography sx={{ textAlign: 'center', color: 'grey.600' }}>
                    Aucune catégorie disponible.
                </Typography>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        width: '100%',
                        minWidth: 900,
                        maxWidth: '100%',
                        borderRadius: 2,
                        boxShadow: 2,
                        mx: 'auto',
                        overflowX: 'auto',
                    }}
                >
                    <Table className="dashboard-table" sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell>Nom</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Catégorie parente</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{renderRows(tree)}</TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                classes={{ paper: 'dashboard-dialog' }}
                sx={{ '& .MuiDialog-paper': { borderRadius: 2, p: 2 } }}
            >
                <DialogTitle sx={{ fontWeight: 'medium' }}>
                    {selectedCategory?._id ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nom"
                        name="name"
                        value={selectedCategory?.name || ''}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={selectedCategory?.description || ''}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="parent-category-label">Catégorie parente</InputLabel>
                        <Select
                            labelId="parent-category-label"
                            label="Catégorie parente"
                            name="parentId"
                            value={selectedCategory?.parentId || ''}
                            onChange={handleInputChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': { borderColor: 'primary.main' },
                                },
                            }}
                        >
                            <MenuItem value="">Aucune (Catégorie racine)</MenuItem>
                            {categories
                                .filter((cat) => cat._id !== selectedCategory?._id)
                                .map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {breadcrumbs[cat._id] || cat.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
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
