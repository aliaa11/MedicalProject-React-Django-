import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar1.css';

const Sidebar = ({ userRole }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // العناصر المشتركة بين كلا الدورين
  const commonItems = [
    { 
      path: userRole === 'doctor' ? '/doctor/profile' : '/patient/profile', 
      label: userRole === 'doctor' ? 'My Profile' : 'My Profile', 
      icon: userRole === 'doctor' ? 'fa-user-md' : 'fa-user' 
    }
  ];

  // عناصر خاصة بالطبيب
  const doctorItems = [

    { 
      path: '/doctor/availability', 
      label: 'Availability', 
      icon: 'fa-calendar-plus' 
    },
    { 
      path: '/doctor/appointments', 
      label: 'Appointments', 
      icon: 'fa-calendar-check' 
    }
  ];
  

  const patientItems = [
    { 
      path: '/patient/available-doctors', 
      label: 'Available Doctors', 
      icon: 'fa-user-doctor' 
    }
  ];

  // دمج العناصر حسب الدور
  const navItems = [
    ...commonItems,
    ...(userRole === 'doctor' ? doctorItems : []),
    ...(userRole === 'patient' ? patientItems : [])
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="doctor-mobile-menu-button"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="doctor-mobile-overlay" 
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`doctor-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        <button 
          className="doctor-mobile-close-button"
          onClick={closeMobileSidebar}
          aria-label="Close menu"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="doctor-sidebar-header">
          <h1 className='font-bold'>
            {userRole === 'doctor' ? 'DOCTOR PORTAL' : 'PATIENT PORTAL'}
            <i className="fa-solid fa-truck-medical"></i>
          </h1>
        </div>

        <div className="doctor-sidebar-section">
          <ul className="doctor-sidebar-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `doctor-sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMobileSidebar}
                >
                  <i className={`fa-solid ${item.icon} doctor-icon`}></i>
                  <span className="doctor-link-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="doctor-sidebar-divider"></div>

        <div className="doctor-sidebar-footer">
          <button onClick={handleLogout} className="doctor-logout-button">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span> Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default Sidebar;