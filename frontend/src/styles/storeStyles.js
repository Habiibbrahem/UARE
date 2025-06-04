// src/styles/storeStyles.js
import { makeStyles } from '@mui/styles';

export const useStoreStyles = makeStyles((theme) => ({
    productCard: {
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: theme.shadows[4]
        }
    },
    priceContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    originalPrice: {
        textDecoration: 'line-through',
        color: theme.palette.text.disabled
    },
    discountBadge: {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(1),
        fontWeight: 'bold'
    },
    filterSection: {
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper
    }
}));