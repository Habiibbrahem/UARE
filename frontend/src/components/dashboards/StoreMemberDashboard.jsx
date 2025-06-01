// src/components/dashboards/StoreMemberDashboard.jsx
import React from 'react';
import StoreMemberLayout from './StoreMemberLayout';
import CategoriesManagement from './CategoriesManagement';
import ProductsManagement from './ProductsManagement';

export default function StoreMemberDashboard() {
    return (
        <StoreMemberLayout>
            {(selectedKey) => {
                switch (selectedKey) {
                    case 'categories':
                        return <CategoriesManagement />;
                    case 'products':
                        return <ProductsManagement />;
                    default:
                        return <div>Select a section from the sidebar</div>;
                }
            }}
        </StoreMemberLayout>
    );
}
