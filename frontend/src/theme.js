// src/theme.js
import { createTheme } from '@mui/material';

export default createTheme({
    palette: {
        mode: 'light',           // or 'dark'
        primary: { main: '#2c3e50' },
        secondary: { main: '#e74c3c' },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});
