// src/components/dashboards/StoreMemberLayout.jsx
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
} from '@mui/material';

const drawerWidth = 240;

export default function StoreMemberLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Manage Categories', key: 'categories' },
        { label: 'Manage Products', key: 'products' },
        // add more sections here
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Store Member Panel
                    </Typography>
                </Toolbar>
                <List>
                    {menuItems.map((item, idx) => (
                        <ListItem
                            key={item.key}
                            disablePadding
                            selected={selectedIndex === idx}
                            onClick={() => setSelectedIndex(idx)}
                        >
                            <ListItemButton>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
                {typeof children === 'function'
                    ? children(menuItems[selectedIndex].key)
                    : children}
            </Box>
        </Box>
    );
}
