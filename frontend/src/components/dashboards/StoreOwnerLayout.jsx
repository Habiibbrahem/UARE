// src/components/dashboards/StoreOwnerLayout.jsx
import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

export default function StoreOwnerLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Manage Members', key: 'members' },
        { label: 'Manage Orders', key: 'orders' },
        // You can add more items here later (e.g. Store Info)
    ];

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

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
                        Store Owner Panel
                    </Typography>
                </Toolbar>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem
                            button
                            key={item.key}
                            selected={selectedIndex === index}
                            onClick={() => handleListItemClick(index)}
                        >
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
                {typeof children === 'function' ? children(menuItems[selectedIndex].key) : children}
            </Box>
        </Box>
    );
}
