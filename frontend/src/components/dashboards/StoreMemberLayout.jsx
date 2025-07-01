import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    IconButton,
    useTheme
} from '@mui/material';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from '@mui/icons-material';

const drawerWidthMember = 240;
const memberItems = [
    { key: 'categories', label: 'Gérer Catégories' },
    { key: 'products', label: 'Gérer Produits' },
];

export default function StoreMemberLayout({ children }) {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: open ? drawerWidthMember : theme.spacing(9),
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidthMember : theme.spacing(9),
                        mt: '106px',
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        border: 'none',
                        transition: theme.transitions.create('width'),
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                    {open && <Typography variant="h6">Panel Membre</Typography>}
                    <IconButton onClick={() => setOpen(o => !o)} sx={{ color: 'common.white' }}>
                        {open ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>
                <List>
                    {memberItems.map((item, idx) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                selected={selectedIndex === idx}
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
                                {open && <ListItemText primary={item.label} />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '106px', bgcolor: 'grey.100' }}>
                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: 3 }}>
                    {typeof children === 'function' ? children(memberItems[selectedIndex].key) : children}
                </Box>
            </Box>
        </Box>
    );
}