import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

export default function AdminLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Categories', key: 'categories' }, // <-- Added Categories here
        { label: 'Store Owners', key: 'storeOwners' },
        { label: 'Stores', key: 'stores' },
        { label: 'Assign Store Owner', key: 'assignStoreOwner' },
        { label: 'Subcategories', key: 'subcategories' },
        { label: 'Sub-subcategories', key: 'subsubcategories' },
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
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
                {typeof children === 'function' ? children(menuItems[selectedIndex].key) : children}
            </Box>
        </Box>
    );
}
