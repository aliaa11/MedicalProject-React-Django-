import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = ({ userRole }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // العناصر المشتركة بين كلا الدورين
  const commonItems = [
    { 
      path: userRole === 'doctor' ? '/doctor/users' : '/patient/profile', 
      label: userRole === 'doctor' ? 'Patients' : 'My Profile', 
      icon: userRole === 'doctor' ? 'fa-users' : 'fa-user' 
    }
  ];

  // عناصر خاصة بالطبيب
  const doctorItems = [
    { 
      path: '/doctor/profile',
      label: 'My Profile',
      icon: 'fa-user-md'
    },
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
  

  // عناصر خاصة بالمريض
  const patientItems = [
    { 
      path: '/patient/available-doctors', 
      label: 'Available Doctors', 
      icon: 'fa-user-doctor' 
    },
    { 
      path: '/doctors/:doctorId', 
      label: 'Doctor Profile', 
      icon: 'fa-user-md' 
    },
    { 
      path: '/book-appointment', 
      label: 'Book Appointment', 
      icon: 'fa-calendar-plus' 
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
        className="mobile-menu-button"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay" 
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        <button 
          className="mobile-close-button"
          onClick={closeMobileSidebar}
          aria-label="Close menu"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="sidebar-header">
          <h1 className='font-bold'>
            {userRole === 'doctor' ? 'DOCTOR PORTAL' : 'PATIENT PORTAL'}
            <i className="fa-solid fa-truck-medical"></i>
          </h1>
        </div>

        <div className="sidebar-section">
          <ul className="sidebar-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMobileSidebar}
                >
                  <i className={`fa-solid ${item.icon} icon`}></i>
                  <span className="link-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-divider"></div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span> Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;