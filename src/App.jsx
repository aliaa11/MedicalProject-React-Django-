// App.jsx
import { Routes, Route } from 'react-router-dom'
import PatientProfile from './features/patients/pages/PatientProfile'
import PatientForm from './features/patients/pages/PatientForm'
import Sidebar from './components/Sidebar'
import './App.css'
import Navbar from './components/Navbar'

function App() {
  return (
  <div className='flex '>
    <Sidebar />
    <Navbar/>

    <div className="bg-gray-50 content">
      <Routes>
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/edit-profile/:id" element={<PatientForm />} />
        <Route path="/create-profile" element={<PatientForm />} />
      </Routes>
    </div>
  </div>
  )
}

export default App