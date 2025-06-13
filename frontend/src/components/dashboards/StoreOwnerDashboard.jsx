import React from 'react';
import StoreOwnerLayout from './StoreOwnerLayout';
import MembersManagement from './MembersManagement';
import OrdersManagement from './OrdersManagement';

export default function StoreOwnerDashboard() {
    return (
        <StoreOwnerLayout>
            {(selectedKey) => {
                switch (selectedKey) {
                    case 'members':
                        return <MembersManagement />;
                    case 'orders':
                        return <OrdersManagement />;
                    default:
                        return <div>Select a section from the sidebar</div>;
                }
            }}
        </StoreOwnerLayout>
    );
}