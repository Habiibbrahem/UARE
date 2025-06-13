import React from 'react';
import AdminLayout from './AdminLayout';
import StoreOwnersManagement from './StoreOwnersManagement';
import StoresManagement from './StoresManagement';
import AssignStoreOwner from './AssignStoreOwner';
import CategoriesManagement from './CategoriesManagement'; // <-- Import CategoriesManagement

export default function AdminDashboard() {
    return (
        <AdminLayout>
            {(selectedKey) => {
                switch (selectedKey) {
                    case 'categories':
                        return <CategoriesManagement />;
                    case 'storeOwners':
                        return <StoreOwnersManagement />;
                    case 'stores':
                        return <StoresManagement />;
                    case 'assignStoreOwner':
                        return <AssignStoreOwner />;
                    default:
                        return <div>Select a section from the sidebar</div>;
                }
            }}
        </AdminLayout>
    );
}
