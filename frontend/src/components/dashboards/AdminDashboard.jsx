import React from 'react';
import AdminLayout from './AdminLayout';
import StoreOwnersManagement from './StoreOwnersManagement';
import StoresManagement from './StoresManagement';
import AssignStoreOwner from './AssignStoreOwner';
import SubcategoriesManagement from './SubcategoriesManagement';
import SubSubcategoriesManagement from './SubSubcategoriesManagement';
import CategoriesManagement from './CategoriesManagement'; // <-- Import CategoriesManagement

export default function AdminDashboard() {
    return (
        <AdminLayout>
            {(selectedKey) => {
                switch (selectedKey) {
                    case 'categories': // <-- Handle categories key
                        return <CategoriesManagement />;
                    case 'storeOwners':
                        return <StoreOwnersManagement />;
                    case 'stores':
                        return <StoresManagement />;
                    case 'assignStoreOwner':
                        return <AssignStoreOwner />;
                    case 'subcategories':
                        return <SubcategoriesManagement />;
                    case 'subsubcategories':
                        return <SubSubcategoriesManagement />;
                    default:
                        return <div>Select a section from the sidebar</div>;
                }
            }}
        </AdminLayout>
    );
}
