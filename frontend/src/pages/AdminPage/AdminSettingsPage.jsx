import React, { useState } from 'react'
import '../../CSS/AdminCSS/AdminSettings.css';
import AdminOrderingComponent from '../../components/AdminComponents/AdminSettings/AdminOrderingComponent';
import AdminGeneralComponent from '../../components/AdminComponents/AdminSettings/AdminGeneralComponent';
import AdminNotificationsComponent from '../../components/AdminComponents/AdminSettings/AdminNotificationsComponent';
import AdminPromotionsComponent from '../../components/AdminComponents/AdminSettings/AdminPromotionsComponent';
import AdminInventoryComponent from '../../components/AdminComponents/AdminSettings/AdminInventoryComponent';
import AdminUserRolesComponent from '../../components/AdminComponents/AdminSettings/AdminUserRolesComponent';


function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('Ordering');

    const tabs = ['General', 'Notifications', 'Promotions', 'Inventory', 'User Roles', 'Ordering'];

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'General':
                return <AdminGeneralComponent />;
            case 'Notifications':
                return <AdminNotificationsComponent />;
            case 'Promotions':
                return <AdminPromotionsComponent />;
            case 'Inventory':
                return <AdminInventoryComponent />;
            case 'User Roles':
                return <AdminUserRolesComponent />;
            case 'Ordering':
                return <AdminOrderingComponent />;
            default:
                return <div>Select a tab to view its content</div>;
        }
    };

  return (
    <div className='admin-settings-container'>
        <div className='settings-sidebar'>
            <ul>
            {
                tabs.map((tab) => (
                    <li
                    key={tab}
                    className={activeTab === tab ? 'active-tab' : ''}
                    onClick={() => setActiveTab(tab)}
                    >
                    {tab}
                    </li>
                ))
            }
            </ul>
        </div>

        <div className='settings-content'>
            <h2>{activeTab} Settings</h2>
            {renderActiveTab()}
        </div>
    </div>
  )
}

export default AdminSettingsPage
