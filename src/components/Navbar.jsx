import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './navbar.css';
import { FaBell } from 'react-icons/fa';
const Navbar = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: 'fa-house'
    },
    {
      path: '/patient/profile',
      label: 'Dashboard', 
      icon: 'fa-chart-line'
    }
  ];
  useEffect(() => {
    // Function to check for appointments coming within 25 minutes
    const checkUpcomingAppointments = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const now = new Date();
      const upcoming = appointments.filter(appt => {
        const apptDate = new Date(`${appt.date}T${appt.time}`);
        const timeDiff = (apptDate - now) / (1000 * 60); // Difference in minutes
        
        // Check if appointment is within 25 minutes (changed from 30)
        return timeDiff > 0 && timeDiff <= 25;
      });

      // Only show notifications for the current user's appointments
      const userAppointments = upcoming.filter(appt => 
        (user.role === 'doctor' && appt.doctor_id === user.id) ||
        (user.role === 'patient' && appt.patient_id === user.id)
      );

      setNotifications(userAppointments);
      setHasUnread(userAppointments.length > 0);

      // Show browser notification if there are upcoming appointments
      if (userAppointments.length > 0 && Notification.permission === 'granted') {
        userAppointments.forEach(appt => {
          const notificationTitle = user.role === 'doctor' 
            ? `Appointment with ${appt.patient_name}` 
            : `Appointment with Dr. ${appt.doctor_name}`;
          
          new Notification(notificationTitle, {
            body: `Starts at ${formatTime(appt.date, appt.time)}`,
            icon: '/favicon.ico'
          });
        });
      }
    };

    // Request notification permission if not already granted
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // Check immediately
    checkUpcomingAppointments();
    
    // Then check every minute
    const interval = setInterval(checkUpcomingAppointments, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (hasUnread) setHasUnread(false);
  };

  const formatTime = (dateString, timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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
      pattern: '/home', 
      title: 'Home',
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h1 className="page-title">{getPageTitle()}</h1>
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

        <div className="navbar-right">
          <div className="notification-container">
            <button 
              className="notification-button" 
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <FaBell className="notification-icon" />
              {hasUnread && <span className="notification-badge"></span>}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Upcoming Appointments (within 25 minutes)</h4>
                </div>
                {notifications.length > 0 ? (
                  <div className="notification-list">
                    {notifications.map((appt, index) => {
                      const user = JSON.parse(localStorage.getItem('user'));
                      return (
                        <div key={index} className="notification-item">
                          <div className="notification-time">
                            {formatTime(appt.date, appt.time)}
                          </div>
                          <div className="notification-details">
                            {user.role === 'doctor' ? (
                              <>With {appt.patient_name || 'Patient'}</>
                            ) : (
                              <>With Dr. {appt.doctor_name || 'Doctor'}</>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="notification-empty">
                    No upcoming appointments
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="print-button" onClick={handlePrint} title="Print">
            <i className="fa-solid fa-print"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;