// src/pages/PatientDashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/AuthService';
import '../styles/Dashboard.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'patient') {
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
        <h1>Welcome, {user?.username}</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Upcoming Appointments</h3>
            <p>2</p>
          </div>
          <div className="stat-card">
            <h3>Medical Records</h3>
            <p>5</p>
          </div>
        </div>
        
        <div className="doctor-recommendations">
          <h2>Your Doctors</h2>
          {/* قائمة بالأطباء */}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;