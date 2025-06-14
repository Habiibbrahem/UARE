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
    useTheme,
    useMediaQuery,
} from '@mui/material';
import '../../styles/dashboard.css';

const drawerWidth = 240;

export default function StoreMemberLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { label: 'Manage Categories', key: 'categories' },
        { label: 'Manage Products', key: 'products' },
    ];

    return (
        <Box className="dashboard-container">
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        position: 'fixed',
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        top: '106px',
                        height: 'calc(100vh - 106px)',
                        [theme.breakpoints.down('md')]: {
                            top: '92px',
                            height: 'calc(100vh - 92px)',
                        }
                    },
                }}
                className="dashboard-sidebar"
            >
                <Toolbar className="dashboard-sidebar-header">
                    <Typography variant="h6" noWrap component="div">
                        Store Member Panel
                    </Typography>
                </Toolbar>
                <List className="dashboard-menu">
                    {menuItems.map((item, idx) => (
                        <ListItem
                            key={item.key}
                            disablePadding
                            selected={selectedIndex === idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`dashboard-menu-item ${selectedIndex === idx ? 'selected' : ''}`}
                        >
                            <ListItemButton className="dashboard-menu-button">
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        color: 'inherit',
                                        fontWeight: selectedIndex === idx ? '600' : '400'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
                component="main"
                className="dashboard-main-content"
                sx={{
                    marginLeft: isMobile ? 0 : `${drawerWidth}px`,
                    width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
                    overflowX: 'auto',
                    padding: '30px'
                }}
            >
                {typeof children === 'function'
                    ? children(menuItems[selectedIndex].key)
                    : children}
            </Box>
        </Box>
    );
}