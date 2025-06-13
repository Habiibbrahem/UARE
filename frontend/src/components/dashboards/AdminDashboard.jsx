import React from 'react';
import AdminLayout from './AdminLayout';
import StoreOwnersManagement from './StoreOwnersManagement';
import StoresManagement from './StoresManagement';
import AssignStoreOwner from './AssignStoreOwner';
import CategoriesManagement from './CategoriesManagement';

// AdminDashboard: Main component that renders the admin panel with a layout and section switching
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
                        return (
                            <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                                Select a section from the sidebar
                            </div>
                        );
                }
            }}
        </AdminLayout>
    );
}