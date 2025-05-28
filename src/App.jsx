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
import './App.css';
// import DoctorProfile from './features/doctors/components/DoctorProfile.jsx';

import './style/global.css';

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
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
{/* 
          <Route path="/doctor/profile" element={<DoctorProfile />} /> */}

          <Route path="/doctor/users" element={<UsersList />} />
        <Route path="/doctor/availability" element={<AvailabilityPage />} />
        <Route path="/doctor/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/patient/available-doctors" element={<ListDoctors />} />
          <Route path="/patient/profile" element={
            <PrivateRoute role="patient">
              <PatientProfile />
            </PrivateRoute>
          } />
          <Route path="/edit-profile/:id" element={<PatientForm />} />
          <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
          <Route path="/available-slots" element={<AvailableSlots />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/doctor-dashboard" element={
            <PrivateRoute role="doctor">


              <DoctorDashboard />
            </PrivateRoute>
          } />
        </Route>
      </Routes>
      <ToastContainer />
    </>

  );
}

export default App;
