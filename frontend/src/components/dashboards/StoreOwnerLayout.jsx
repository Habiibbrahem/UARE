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
    styled
} from '@mui/material';

const drawerWidth = 240;

const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: `${drawerWidth}px`,
    marginTop: '70px',
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 70px)'
}));

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        position: 'fixed',
        top: '70px',
        height: 'calc(100vh - 70px)',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
}));

const SidebarListItem = styled(ListItemButton)(({ theme, selected }) => ({
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1),
    paddingLeft: theme.spacing(2),
    backgroundColor: selected ? theme.palette.primary.main : 'transparent',
    '&:hover': {
        backgroundColor: selected ? theme.palette.primary.light : theme.palette.primary.light,
    },
    transition: 'background-color 0.3s ease',
}));

export default function StoreOwnerLayout({ children }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const menuItems = [
        { label: 'Manage Members', key: 'members' },
        { label: 'Manage Orders', key: 'orders' },
    ];

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    return (
        <Box sx={{ display: 'flex', backgroundColor: 'background.default' }}>
            <SidebarDrawer variant="permanent">
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Store Owner Panel
                    </Typography>
                </Toolbar>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={item.key} disablePadding>
                            <SidebarListItem
                                selected={selectedIndex === index}
                                onClick={() => handleListItemClick(index)}
                            >
                                <ListItemText primary={item.label} />
                            </SidebarListItem>
                        </ListItem>
                    ))}
                </List>
            </SidebarDrawer>

            <MainContent component="main">
                {typeof children === 'function' ? children(menuItems[selectedIndex].key) : children}
            </MainContent>
        </Box>
    );
}