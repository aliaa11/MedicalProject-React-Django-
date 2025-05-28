// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/auth/pages/Home'; // Make sure this import exists
import DoctorDashboard from './features/auth/pages/DoctorDashboard';
import PatientDashboard from './features/auth/pages/PatientDashboard';
import { getCurrentUser } from './features/auth/services/AuthService';
import MainLayout from './components/MainLayout';
import PatientProfile from './features/patients/pages/PatientProfile'
import PatientForm from './features/patients/pages/PatientForm'
import Sidebar from './components/Sidebar'
import './App.css'
import Navbar from './components/Navbar'

import './style/global.css'; 
import ListDoctors from './features/doctors/pages/ListDoctors';
import AvailableSlots from './features/patients/pages/AvailableAppointments';
import BookAppointment from './features/patients/pages/BookAppointment';
import DoctorProfile from './features/patients/pages/DoctorAvailableProfile';
const PrivateRoute = ({ children, role }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient/profile'} replace />;
  }
  
  return children;
};
function App() {
  return (

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
        
          <Route path="/" element={<Home />} />
          <Route path="/patient/available-doctors" element={<ListDoctors />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/edit-profile/:id" element={<PatientForm />} />
          <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
          <Route path="/available-slots" element={<AvailableSlots />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/doctor-dashboard" element={<PrivateRoute role="doctor"> <DoctorDashboard /></PrivateRoute>}/>
          <Route path="/patient/profile" element={<PrivateRoute role="patient"> <PatientProfile /> </PrivateRoute>} />
        </Route>
      </Routes>
   
  );
}
export default App;
