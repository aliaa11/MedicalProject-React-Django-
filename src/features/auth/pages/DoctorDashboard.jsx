// src/pages/DoctorDashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser,logout } from '../services/AuthService';
import '../styles/Dashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, Dr. {user?.username}</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Appointments</h3>
            <p>12</p>
          </div>
          <div className="stat-card">
            <h3>Patients</h3>
            <p>24</p>
          </div>
        </div>
        
        <div className="upcoming-appointments">
          <h2>Upcoming Appointments</h2>
          {/* قائمة بالمواعيد */}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;