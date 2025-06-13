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

  // Fetch patient appointments from API
  const fetchPatientAppointments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'patient') return;

      const response = await fetch(`/api/patient/appointments?patientId=${user.id}`);
      const data = await response.json();
      localStorage.setItem('patientAppointments', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = (appointmentId) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === appointmentId ? { ...notif, notificationRead: true } : notif
    );
    
    setNotifications(updatedNotifications);
    setHasUnread(updatedNotifications.some(notif => !notif.notificationRead));

    // Update in localStorage
    const patientAppointments = JSON.parse(localStorage.getItem('patientAppointments')) || [];
    const updatedAppointments = patientAppointments.map(appt => 
      appt.id === appointmentId ? { ...appt, notificationRead: true } : appt
    );
    localStorage.setItem('patientAppointments', JSON.stringify(updatedAppointments));
  };

  // Check for upcoming appointments
  const checkUpcomingAppointments = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'patient') return;

    const patientAppointments = JSON.parse(localStorage.getItem('patientAppointments')) || [];
    const now = new Date();

    const upcoming = patientAppointments.filter(appt => {
      if (appt.status !== 'confirmed') return false;
      
      const apptDate = new Date(`${appt.date}T${appt.time}`);
      const timeDiff = (apptDate - now) / (1000 * 60); // Difference in minutes
      
      return timeDiff > 0 && timeDiff <= 25 && !appt.notificationRead;
    });

    setNotifications(upcoming);
    setHasUnread(upcoming.length > 0);

    // Show browser notifications
    if (upcoming.length > 0 && Notification.permission === 'granted') {
      upcoming.forEach(appt => {
        new Notification(`Appointment with Dr. ${appt.doctor_name}`, {
          body: `Starts at ${formatTime(appt.date, appt.time)} - ${appt.clinic || 'Main Clinic'}`,
          icon: '/favicon.ico',
          tag: `appt-${appt.id}` // Prevent duplicate notifications
        });
        markNotificationAsRead(appt.id);
      });
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPatientAppointments();
    
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          checkUpcomingAppointments();
        }
      });
    }

    // Set up interval checks
    checkUpcomingAppointments();
    const interval = setInterval(() => {
      fetchPatientAppointments();
      checkUpcomingAppointments();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const toggleNotifications = () => {
    if (showNotifications) {
      // Mark all as read when closing
      const updatedNotifications = notifications.map(notif => ({
        ...notif,
        notificationRead: true
      }));
      setNotifications(updatedNotifications);
      setHasUnread(false);
      
      // Update in localStorage
      const updatedAppointments = JSON.parse(localStorage.getItem('patientAppointments')).map(
        appt => ({ ...appt, notificationRead: true })
      );
      localStorage.setItem('patientAppointments', JSON.stringify(updatedAppointments));
    }
    setShowNotifications(!showNotifications);
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
                  <h4>Upcoming Appointments</h4>
                  <small>Within 25 minutes</small>
                </div>
                {notifications.length > 0 ? (
                  <div className="notification-list">
                    {notifications.map((appt) => (
                      <div 
                        key={appt.id} 
                        className={`notification-item ${appt.notificationRead ? 'read' : 'unread'}`}
                      >
                        <div className="notification-time">
                          {formatTime(appt.date, appt.time)}
                        </div>
                        <div className="notification-details">
                          <strong>Dr. {appt.doctor_name}</strong>
                          <div>{appt.clinic || 'Main Clinic'}</div>
                        </div>
                        {!appt.notificationRead && (
                          <button 
                            className="mark-read-btn"
                            onClick={() => markNotificationAsRead(appt.id)}
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    ))}
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