import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getCurrentUser } from '../features/auth/services/AuthService';

const MainLayout = () => {
  const user = getCurrentUser();

  // لو مفيش مستخدم مسجل دخول، مش هيظهر السايد بار
  if (!user) return <Outlet />;

  return (
    <div className="app-container" style={{ display: 'flex' }}>
      <Sidebar userRole={user.role} />
      <main className="main-content" style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
