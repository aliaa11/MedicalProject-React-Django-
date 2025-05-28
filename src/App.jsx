// src/App.jsx
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/auth/pages/Home'; // Make sure this import exists
import DoctorDashboard from './features/auth/pages/DoctorDashboard';
import PatientDashboard from './features/auth/pages/PatientDashboard';
import { getCurrentUser } from './features/auth/services/AuthService';
import AdminLayout from './features/admin/components/AdminLayout';
import Dashboard from './features/admin/pages/Dashboard';
import Users from './features/admin/pages/Users';
import Doctors from './features/admin/pages/Doctors';
import Appointments from './features/admin/pages/Appointments';
import Specialties from './features/admin/pages/Specialties';
import './style/global.css'; 
const PrivateRoute = ({ children, role }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
    if (role && user.role !== role) {
    return <Navigate to={
      user.role === 'admin' ? '/admin' :
      user.role === 'doctor' ? '/doctor-dashboard' :
      '/patient-dashboard'
    } replace />;
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

         {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="specialties" element={<Specialties />} />
        </Route>

      </Routes>
   
  );
}

export default App;