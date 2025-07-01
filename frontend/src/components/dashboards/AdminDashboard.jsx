// src/components/AdminDashboard.jsx
import React from 'react';
import AdminLayout from './AdminLayout';
import StoreOwnersManagement from './StoreOwnersManagement';
import StoresManagement from './StoresManagement';
import AssignStoreOwner from './AssignStoreOwner';
import CategoriesManagement from './CategoriesManagement';

// AdminDashboard : composant principal qui affiche le panneau d'administration avec le layout et le contenu dynamique
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
                                Sélectionnez une section dans la barre latérale
                            </div>
                        );
                }
            }}
        </AdminLayout>
    );
}
