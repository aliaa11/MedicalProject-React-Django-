import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Sidebar from './Sidebar';
import Navbar from './Navbar';   // Adjust path if necessary

export default function MainLayout() {
  return (
    <div className='flex'>
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="bg-gray-50 content p-4"> 
          <Outlet />
        </div>
      </div>
    </div>
  );
}