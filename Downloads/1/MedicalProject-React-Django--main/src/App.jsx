import { Routes, Route } from "react-router-dom";
import AvailabilityPage from "./features/doctors/pages/AvailabilityPage";
import AppointmentDetails from "./features/doctors/pages/AppointmentDetails";
import UsersList from "./features/doctors/pages/UsersList";

function App() {
  return (
    <Routes>
        <Route path="/doctor/users" element={<UsersList />} />

      <Route path="/doctor/availability" element={<AvailabilityPage />} />
      <Route path="/doctor/appointments/:id" element={<AppointmentDetails />} />
    </Routes>
  );
}

export default App;
