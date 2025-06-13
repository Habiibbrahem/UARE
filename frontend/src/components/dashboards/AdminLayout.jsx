import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

export default function AdminLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Categories', key: 'categories' },
        { label: 'Store Owners', key: 'storeOwners' },
        { label: 'Stores', key: 'stores' },
        { label: 'Assign Store Owner', key: 'assignStoreOwner' },
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
                        position: 'fixed',
                        top: '70px', // Ensures that the sidebar doesn't cover the navbar
                        height: 'calc(100vh - 70px)', // Adjusting the height for the sidebar
                        zIndex: 1000
                    },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Admin Panel
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
                    ml: `${drawerWidth}px`, // Add margin for sidebar width
                    marginTop: '70px', // Ensure main content starts below the navbar
                }}
            >
                {typeof children === 'function' ? children(menuItems[selectedIndex].key) : children}
            </Box>
        </Box>
    );
}
