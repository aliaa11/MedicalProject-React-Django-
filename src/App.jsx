import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorProfile from './features/doctors/components/DoctorProfile.jsx';
import '../src/style/global.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doctor/profile" element={<DoctorProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
