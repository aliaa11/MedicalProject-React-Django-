import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const mainItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard',
      icon: 'fa-gauge-high' 
    },
    { 
      path: '/patient/available-doctors', 
      label: 'Available Doctors',
      icon: 'fa-solid fa-user-doctor' 
    },
    {
      path:"/doctors/1",
      label: 'Doctor Profile',
      icon: 'fa-solid fa-user-doctor'
    },
    { 
      path: '/patient/profile', 
      label: 'My Profile',
      icon: 'fa-user' 
    }
  ];

  const handleLogout = () => {
    console.log('Logging out...');
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
            HOSPITAL <i className="fa-solid fa-truck-medical"></i>
          </h1>
        </div>

        <div className="sidebar-section">
          <ul className="sidebar-list">
            {mainItems.map((item) => (
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









//code to make sidebar dynamic 
// import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import './sidebar.css';

// const Sidebar = ({ userRole }) => { // Accept userRole as prop
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   // Define navigation items for each role
//   const getNavigationItems = (role) => {
//     const commonItems = [
//       {
//         path: '/dashboard',
//         label: 'Dashboard',
//         icon: 'fa-gauge-high'
//       },
//       {
//         path: '/profile',
//         label: 'My Profile',
//         icon: 'fa-user'
//       }
//     ];

//     switch (role) {
//       case 'patient':
//         return [
//           ...commonItems,
//           {
//             path: '/appointments',
//             label: 'My Appointments',
//             icon: 'fa-calendar-check'
//           },
//           {
//             path: '/medical-records',
//             label: 'Medical Records',
//             icon: 'fa-file-medical'
//           },
//           {
//             path: '/prescriptions',
//             label: 'Prescriptions',
//             icon: 'fa-prescription-bottle'
//           },
//           {
//             path: '/billing',
//             label: 'Billing & Insurance',
//             icon: 'fa-credit-card'
//           }
//         ];

//       case 'doctor':
//         return [
//           ...commonItems,
//           {
//             path: '/patients',
//             label: 'My Patients',
//             icon: 'fa-users'
//           },
//           {
//             path: '/appointments',
//             label: 'Appointments',
//             icon: 'fa-calendar-check'
//           },
//           {
//             path: '/schedule',
//             label: 'Schedule',
//             icon: 'fa-calendar-alt'
//           },
//           {
//             path: '/prescriptions',
//             label: 'Prescriptions',
//             icon: 'fa-prescription-bottle'
//           },
//           {
//             path: '/consultations',
//             label: 'Consultations',
//             icon: 'fa-stethoscope'
//           }
//         ];

//       case 'admin':
//         return [
//           ...commonItems,
//           {
//             path: '/users',
//             label: 'User Management',
//             icon: 'fa-users-cog'
//           },
//           {
//             path: '/doctors',
//             label: 'Doctors',
//             icon: 'fa-user-md'
//           },
//           {
//             path: '/patients',
//             label: 'Patients',
//             icon: 'fa-bed'
//           },
//           {
//             path: '/appointments',
//             label: 'All Appointments',
//             icon: 'fa-calendar-check'
//           },
//           {
//             path: '/reports',
//             label: 'Reports',
//             icon: 'fa-chart-bar'
//           },
//           {
//             path: '/settings',
//             label: 'System Settings',
//             icon: 'fa-cogs'
//           }
//         ];

//       default:
//         return commonItems;
//     }
//   };

//   const navigationItems = getNavigationItems(userRole);

//   const handleLogout = () => {
//     console.log('Logging out...');
//   };

//   const toggleMobileSidebar = () => {
//     setIsMobileOpen(!isMobileOpen);
//   };

//   const closeMobileSidebar = () => {
//     setIsMobileOpen(false);
//   };

//   // Get role display name
//   const getRoleDisplayName = (role) => {
//     switch (role) {
//       case 'patient':
//         return 'Patient Portal';
//       case 'doctor':
//         return 'Doctor Portal';
//       case 'admin':
//         return 'Admin Panel';
//       default:
//         return 'HOSPITAL';
//     }
//   };

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         className="mobile-menu-btn"
//         onClick={toggleMobileSidebar}
//         aria-label="Toggle mobile menu"
//       >
//         <i className="fas fa-bars"></i>
//       </button>

//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <div 
//           className="mobile-overlay"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
//         {/* Mobile Close Button */}
//         <button
//           className="mobile-close-btn"
//           onClick={closeMobileSidebar}
//           aria-label="Close mobile menu"
//         >
//           <i className="fas fa-times"></i>
//         </button>

//         <div className="sidebar-header">
//           <div className="logo">
//             <i className="fas fa-hospital"></i>
//             {getRoleDisplayName(userRole)}
//           </div>
//         </div>

//         {/* Role indicator */}
//         <div className="role-indicator">
//           <i className={`fas ${
//             userRole === 'patient' ? 'fa-user' : 
//             userRole === 'doctor' ? 'fa-user-md' : 
//             'fa-user-shield'
//           }`}></i>
//           <span className="role-text">
//             {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
//           </span>
//         </div>

//         <nav className="sidebar-nav">
//           <ul className="nav-list">
//             {navigationItems.map((item) => (
//               <li key={item.path} className="nav-item">
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `sidebar-link ${isActive ? 'active' : ''}`
//                   }
//                   onClick={closeMobileSidebar}
//                 >
//                   <i className={`fas ${item.icon}`}></i>
//                   <span className="link-text">{item.label}</span>
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         <div className="sidebar-footer">
//           <button
//             className="logout-btn"
//             onClick={handleLogout}
//           >
//             <i className="fas fa-sign-out-alt"></i>
//             <span className="link-text">Logout</span>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;