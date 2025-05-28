import { Routes, Route, Navigate } from "react-router-dom";
import AvailabilityPage from "./features/doctors/pages/AvailabilityPage";
import AppointmentDetails from "./features/doctors/pages/AppointmentDetails";
import UsersList from "./features/doctors/pages/UsersList";
import Register from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import Home from './features/auth/pages/Home';
import DoctorDashboard from './features/auth/pages/DoctorDashboard';
import PatientDashboard from './features/auth/pages/PatientDashboard';
import { getCurrentUser } from './features/auth/services/AuthService';
import MainLayout from './components/MainLayout';
import PatientProfile from './features/patients/pages/PatientProfile';
import PatientForm from './features/patients/pages/PatientForm';
import ListDoctors from './features/doctors/pages/ListDoctors';
import AvailableSlots from './features/patients/pages/AvailableAppointments';
import BookAppointment from './features/patients/pages/BookAppointment';
import DoctorProfile from './features/patients/pages/DoctorAvailableProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Navbar from './components/Navbar.jsx'
import AppointmentsList from './features/doctors/pages/AppointmentsList.jsx';
import DoctorProfile2 from './features/doctors/components/DoctorProfile2.jsx';
import './App.css';
import './style/global.css';

const PrivateRoute = ({ children, role }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <>
    
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctor/users" element={<UsersList />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          } />

<Route path="/doctor/appointments" element={
  <PrivateRoute role="doctor">
    <AppointmentsList />
  </PrivateRoute>
} />
          <Route path="/doctor/availability" element={
            <PrivateRoute role="doctor">
              <AvailabilityPage />
            </PrivateRoute>
          } />
          <Route path="/doctor/appointments/:id" element={
            <PrivateRoute role="doctor">
              <AppointmentDetails />
            </PrivateRoute>
          } />
          

<Route path="/doctor/profile" element={
            <PrivateRoute role="doctor">
              <DoctorProfile2 />
            </PrivateRoute>
          } />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/patient/available-doctors" element={
            <PrivateRoute role="patient">
              <ListDoctors />
            </PrivateRoute>
          } />
          <Route path="/patient/profile" element={
            <PrivateRoute role="patient">
              <PatientProfile />
            </PrivateRoute>
          } />

          {/* Shared Routes */}
          <Route path="/profile" element={<PatientProfile />} />
          <Route path="/edit-profile/:id" element={<PatientForm />} />
          <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
          <Route path="/available-slots" element={<AvailableSlots />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
