import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Sidebar from './Sidebar';
import Navbar from './Navbar';   // Adjust path if necessary

export default function MainLayout() {
  return (
    <div className='flex main-layout-container'>
      <Sidebar />
      <div className="flex-1 main-content-area">
        <Navbar />
        <div className="bg-gray-50 content p-4 content-wrapper">
           <Outlet />
        </div>
      </div>
    </div>
  );
}