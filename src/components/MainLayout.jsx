import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getCurrentUser } from '../features/auth/services/AuthService';
import Navbar from './Navbar';
const MainLayout = () => {
  const user = getCurrentUser();

  if (!user) return <Outlet />;

  return (
    // <div className="app-container" style={{ display: 'flex' }}>
    //   <Sidebar userRole={user.role} />
    //   <Navbar userRole={user.role} />
    //   <main className="main-content" style={{margin:"50px auto", padding:"20px", width: "70%"}}>
    //     <Outlet />
    //   </main>
    <div className='flex main-layout-container'>
      <Sidebar userRole={user.role}/>
      <div className="flex-1 main-content-area">
        <Navbar  userRole={user.role}/>
        <div className="bg-gray-50 content content-wrapper">
           <Outlet />
        </div>
      </div> 
    </div>
  );
};

export default MainLayout;
