import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  const location = useLocation();
  
  // Basic title mapping based on route
  const pathMap = {
    '/dashboard': 'Dashboard Overview',
    '/dashboard/prescriptions': 'My Prescriptions',
    '/dashboard/documents': 'Medical Documents',
    '/dashboard/medicines': 'My Medicines',
    '/dashboard/reminders': 'Reminders',
    '/dashboard/profile': 'My Profile',
    '/dashboard/settings': 'Settings'
  };

  const title = pathMap[location.pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
