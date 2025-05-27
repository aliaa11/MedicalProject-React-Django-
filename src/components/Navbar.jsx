// Navbar.jsx - Enhanced Version
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/home',
      label: 'Home',
      icon: 'fa-house'
    },
    {
      path: '/dashboard',
      label: 'Dashboard', 
      icon: 'fa-chart-line'
    }
  ];

  const pageRoutes = [
    { 
      pattern: '/dashboard', 
      title: 'Dashboard',
      exact: true 
    },
    { 
      pattern: '/profile', 
      title: 'My Profile',
      exact: true 
    },
    { 
      pattern: '/credits', 
      title: 'Credits Account',
      exact: true 
    },
    { 
      pattern: '/edit-profile', 
      title: 'Edit Profile',
      exact: false 
    },
    { 
      pattern: '/create-profile', 
      title: 'Create Profile',
      exact: true 
    },
    { 
      pattern: '/home', 
      title: 'Home',
      exact: true 
    },
    { 
      pattern: '/appointments', 
      title: 'Appointments',
      exact: true 
    },
    { 
      pattern: '/patients', 
      title: 'Patients',
      exact: false 
    },
    { 
      pattern: '/doctors', 
      title: 'Doctors',
      exact: false 
    },
    { 
      pattern: '/settings', 
      title: 'Settings',
      exact: true 
    }
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    
    const matchedRoute = pageRoutes.find(route => {
      if (route.exact) {
        return currentPath === route.pattern;
      } else {
        return currentPath.startsWith(route.pattern);
      }
    });

    // Return matched title or default
    return matchedRoute ? matchedRoute.title : 'Hospital Management';
  };

  // Get breadcrumb or subtitle if needed
  const getSubtitle = () => {
    const currentPath = location.pathname;
    
    // Add custom logic for subtitles
    if (currentPath.includes('/edit-profile/')) {
      const id = currentPath.split('/').pop();
      return `Patient ID: ${id}`;
    }
    
    if (currentPath.includes('/patients/')) {
      const id = currentPath.split('/').pop();
      if (id !== 'patients') {
        return `Patient Details - ID: ${id}`;
      }
    }
    
    return null;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left side - Dynamic page title */}
        <div className="navbar-left">
          <h1 className="page-title">{getPageTitle()}</h1>
          {getSubtitle() && (
            <p className="page-subtitle">{getSubtitle()}</p>
          )}
        </div>

        {/* Center - Navigation Links */}
        <div className="navbar-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right side - User info and actions */}
        <div className="navbar-right">
          <button className="print-button" onClick={handlePrint} title="Print">
            <i className="fa-solid fa-print"></i>
          </button>
          
          <div className="user-profile">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
              alt="User Avatar" 
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">ROBERT</span>
              <span className="user-role">ADMIN</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;