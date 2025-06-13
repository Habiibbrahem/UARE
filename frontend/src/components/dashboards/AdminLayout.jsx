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
} from '@mui/material';
import {
    Category,
    People,
    Store,
    AssignmentInd,
    Menu as MenuIcon,
    MenuOpen as MenuOpenIcon,
} from '@mui/icons-material';
import Navbar from '../../components/Navbar'; // Path to homepage Navbar

const drawerWidth = 240;

// AdminLayout: Provides the sidebar and main content layout for the admin dashboard
export default function AdminLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { label: 'Categories', key: 'categories', icon: <Category /> },
        { label: 'Store Owners', key: 'storeOwners', icon: <People /> },
        { label: 'Stores', key: 'stores', icon: <Store /> },
        { label: 'Assign Store Owner', key: 'assignStoreOwner', icon: <AssignmentInd /> },
    ];

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Homepage Navbar */}
            <Navbar isAdmin={true} sx={{ zIndex: 900 }} /> {/* Lower z-index for navbar base */}

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: isSidebarOpen ? drawerWidth : 72,
                    flexShrink: 0,
                    transition: 'width 0.3s ease',
                    zIndex: 950, // Above navbar (900), below dropdowns (1000)
                    '& .MuiDrawer-paper': {
                        width: isSidebarOpen ? drawerWidth : 72,
                        boxSizing: 'border-box',
                        position: 'fixed',
                        top: 0, // Overlap navbar
                        height: '100vh',
                        bgcolor: 'grey.900',
                        color: 'white',
                        overflowX: 'hidden',
                        transition: 'width 0.3s ease',
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', bgcolor: 'grey.800' }}>
                    {isSidebarOpen && (
                        <Typography variant="h6" noWrap>
                            Admin Panel
                        </Typography>
                    )}
                    <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
                        {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Toolbar>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton
                                selected={selectedIndex === index}
                                onClick={() => handleListItemClick(index)}
                                sx={{
                                    justifyContent: isSidebarOpen ? 'initial' : 'center',
                                    px: isSidebarOpen ? 2.5 : 1,
                                    bgcolor: selectedIndex === index ? 'grey.700' : 'transparent',
                                    '&:hover': { bgcolor: 'grey.700' },
                                    borderLeft: selectedIndex === index ? '4px solid' : 'none',
                                    borderColor: 'primary.main',
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: isSidebarOpen ? 56 : 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                {isSidebarOpen && <ListItemText primary={item.label} />}
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
                    p: 3,
                    ml: isSidebarOpen ? `${drawerWidth}px` : '72px',
                    mt: '106px', // Navbar (70px) + announcement bar (36px)
                    transition: 'margin-left 0.3s ease',
                    bgcolor: 'grey.100',
                }}
            >
                <Box
                    sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 3,
                        minHeight: 'calc(100vh - 154px)', // Adjust for navbar + padding
                    }}
                >
                    {typeof children === 'function' ? children(menuItems[selectedIndex].key) : children}
                </Box>
            </Box>
        </Box>
    );
}