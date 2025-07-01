import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    useTheme
} from '@mui/material';
import { People as MembersIcon, ListAlt as OrdersIcon, Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material';
import Navbar from '../Navbar';

const drawerWidthOwner = 240;
const ownerItems = [
    { key: 'members', label: 'Gérer Membres', path: '/store-owner/members', icon: <MembersIcon /> },
    { key: 'orders', label: 'Gérer Commandes', path: '/store-owner/orders', icon: <OrdersIcon /> },
];

export default function StoreOwnerLayout() {
    const theme = useTheme();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(true);
    const idx = ownerItems.findIndex(i => pathname.startsWith(i.path));
    const selectedKey = idx >= 0 ? ownerItems[idx].key : ownerItems[0].key;

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar sx={{ zIndex: theme.zIndex.drawer + 1 }} />
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidthOwner : theme.spacing(9),
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidthOwner : theme.spacing(9),
                        top: '106px',                  // espace pour annonce + navbar
                        height: 'calc(100vh - 106px)',
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        border: 'none',
                        transition: theme.transitions.create('width'),
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                    {open && <Typography variant="h6">Propriétaire Boutique</Typography>}
                    <IconButton onClick={() => setOpen(o => !o)} sx={{ color: 'common.white' }}>
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>
                <List>
                    {ownerItems.map(item => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={item.key === selectedKey}
                                sx={{
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.dark',
                                        borderLeft: `4px solid ${theme.palette.secondary.main}`
                                    },
                                    '&:hover': { bgcolor: 'primary.light' }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'common.white', minWidth: open ? 56 : 'auto' }}>
                                    {item.icon}
                                </ListItemIcon>
                                {open && <ListItemText primary={item.label} />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '106px', bgcolor: 'grey.100' }}>
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
