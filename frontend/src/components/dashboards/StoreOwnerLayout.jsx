// src/components/dashboards/StoreOwnerLayout.jsx
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

export default function StoreOwnerLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Manage Members', key: 'members' },
        { label: 'Manage Orders', key: 'orders' },
        // Additional menu items can be added here
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
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        position: 'fixed', // Fixed positioning
                        top: '70px', // Start below the navbar
                        height: 'calc(100vh - 70px)', // Make it the full height minus the navbar
                    },
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

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: `${drawerWidth}px`, // Add margin to the left of the content
                    marginTop: '70px', // Make sure content starts below the navbar
                }}
            >
                {typeof children === 'function' ? children(menuItems[selectedIndex].key) : children}
            </Box>
        </Box>
    );
}
