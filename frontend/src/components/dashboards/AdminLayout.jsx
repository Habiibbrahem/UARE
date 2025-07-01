import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    IconButton,
    useTheme
} from '@mui/material';
import {
    Category,
    People,
    Store,
    AssignmentInd,
    Menu as MenuIcon,
    MenuOpen as MenuOpenIcon,
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';

const drawerWidth = 240;

// AdminLayout : sidebar unifiée positionnée sous la Navbar complète (barre annonce + nav)
export default function AdminLayout({ children }) {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Catégories', key: 'categories', icon: <Category /> },
        { label: 'Propriétaires', key: 'storeOwners', icon: <People /> },
        { label: 'Boutiques', key: 'stores', icon: <Store /> },
        { label: 'Attribuer Proprio', key: 'assignStoreOwner', icon: <AssignmentInd /> },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar isAdmin sx={{ zIndex: theme.zIndex.drawer + 1 }} />
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidth : theme.spacing(9),
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : theme.spacing(9),
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
                    {open && <Typography variant="h6" noWrap>Panneau Admin</Typography>}
                    <IconButton onClick={() => setOpen(o => !o)} sx={{ color: 'common.white' }}>
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>
                <List>
                    {menuItems.map((item, idx) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                selected={idx === selectedIndex}
                                onClick={() => setSelectedIndex(idx)}
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
                <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 3, p: 3 }}>
                    {typeof children === 'function'
                        ? children(menuItems[selectedIndex].key)
                        : children}
                </Box>
            </Box>
        </Box>
    );
}