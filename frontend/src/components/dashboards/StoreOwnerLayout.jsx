// src/components/dashboards/StoreOwnerLayout.jsx
import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    Box, Drawer, Toolbar, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Typography, IconButton
} from '@mui/material';
import {
    People as MembersIcon,
    ListAlt as OrdersIcon,
    Menu as MenuIcon,
    MenuOpen as MenuOpenIcon
} from '@mui/icons-material';
import Navbar from '../Navbar';

const drawerWidth = 240;
const menuItems = [
    { key: 'members', label: 'Manage Members', path: '/store-owner/members', icon: <MembersIcon /> },
    { key: 'orders', label: 'Manage Orders', path: '/store-owner/orders', icon: <OrdersIcon /> },
];

export default function StoreOwnerLayout() {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(true);

    // determine which menu item is active
    const idx = menuItems.findIndex(item => pathname.startsWith(item.path));
    const selectedKey = idx >= 0 ? menuItems[idx].key : menuItems[0].key;

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Top Navbar */}
            <Navbar sx={{ zIndex: 1200 }} />

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: open ? drawerWidth : 72,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : 72,
                        boxSizing: 'border-box',
                        mt: '64px',                        // push below Navbar
                        height: 'calc(100vh - 64px)',
                        bgcolor: 'grey.900',
                        color: 'white',
                        transition: 'width 0.3s',
                    },
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        bgcolor: 'grey.800',
                        px: 2
                    }}
                >
                    {open && <Typography variant="h6">Store Owner</Typography>}
                    <IconButton onClick={() => setOpen(!open)} sx={{ color: 'white' }}>
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>

                <List>
                    {menuItems.map(item => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={item.key === selectedKey}
                                sx={{
                                    justifyContent: open ? 'initial' : 'center',
                                    px: open ? 2.5 : 1,
                                    '&.Mui-selected': { bgcolor: 'grey.700' },
                                    '&:hover': { bgcolor: 'grey.700' },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: open ? 56 : 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                {open && <ListItemText primary={item.label} sx={{ color: 'white' }} />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: open ? `${drawerWidth}px` : '72px',
                    mt: '64px',
                    p: 3,
                    bgcolor: 'grey.100',
                    transition: 'margin-left 0.3s',
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'white',
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        minHeight: 'calc(100vh - 100px)',
                    }}
                >
                    {/* This is where <Route path="members|orders"> will render */}
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
