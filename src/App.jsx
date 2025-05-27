// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/auth/pages/Home'; // Make sure this import exists
import DoctorDashboard from './features/auth/pages/DoctorDashboard';
import PatientDashboard from './features/auth/pages/PatientDashboard';
import { getCurrentUser } from './features/auth/services/AuthService';

import './style/global.css'; 
const PrivateRoute = ({ children, role }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} replace />;
  }
  
  return children;
};
function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-dashboard" element={
          <PrivateRoute role="doctor">
            <DoctorDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/patient-dashboard" element={
          <PrivateRoute role="patient">
            <PatientDashboard />
          </PrivateRoute>
        } />

      </Routes>
   
  );
}

export default App;