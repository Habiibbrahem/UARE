// src/components/CartIcon.jsx
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Badge, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

export default function CartIcon() {
    const totalCount = useCartStore((state) => state.getTotalCount());
    const navigate = useNavigate();

    return (
        <IconButton
            component={Link}
            to="/cart"
            size="large"
            sx={{ color: 'inherit', position: 'relative' }}
            aria-label="Cart"
        >
            <Badge badgeContent={totalCount} color="error">
                <FaShoppingCart style={{ fontSize: '1.4rem' }} />
            </Badge>
        </IconButton>
    );
}
