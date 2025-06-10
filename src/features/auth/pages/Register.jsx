import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Common fields for all users
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  // Doctor specific fields
  const [doctorData, setDoctorData] = useState({
    specialty_id: 1,
    gender: '',
    phone: '',
    bio: '',
    contact_email: '',
    years_of_experience: 0,
  });

  // Patient specific fields
  const [patientData, setPatientData] = useState({
    gender: '',
    date_of_birth: '',
    address: '',
    phone: '',
    disease: '',
    medical_history: '',
  });

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setUserData(prev => ({ ...prev, role: selectedRole }));
    setStep(2);
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // Log the data being sent
    console.log('Sending user data:', userData);
    
    // Step 1: Register the base user
    const userResponse = await axios.post('http://localhost:8000/api/register/', userData, {
      headers: {
        'Content-Type': 'application/json',
        // Add this if you're using CSRF protection
        'X-CSRFToken': getCookie('csrftoken'),
      },
    });
    
    console.log('User registration response:', userResponse.data);
    const userId = userResponse.data.user_id;

    // Step 2: Register role-specific details
    if (role === 'doctor') {
      console.log('Sending doctor data:', doctorData);
      await axios.post('http://localhost:8000/api/register/doctor/', {
        user_id: userId,
        ...doctorData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
    } else if (role === 'patient') {
      console.log('Sending patient data:', patientData);
      await axios.post('http://localhost:8000/api/register/patient/', {
        user_id: userId,
        ...patientData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
    }

    navigate('/login');
  } catch (err) {
    console.error('Full error:', err);
    console.error('Error response:', err.response);
    setError(err.response?.data?.error || 
             err.response?.data?.message || 
             'Registration failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      {step === 1 && (
        <div className="step-1">
          <h3 className="text-lg font-semibold mb-4">Select Your Role</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleRoleSelection('doctor')}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              I'm a Doctor
            </button>
            <button
              onClick={() => handleRoleSelection('patient')}
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              I'm a Patient
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="step-2">
            <h3 className="text-lg font-semibold mb-4">
              {role === 'doctor' ? 'Doctor Registration' : 'Patient Registration'}
            </h3>

            {/* Common fields for all users */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleUserInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleUserInputChange}
                className="w-full p-2 border rounded"
                required
                minLength="8"
              />
            </div>

            {/* Role-specific fields */}
            {role === 'doctor' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Specialty ID</label>
                  <input
                    type="number"
                    name="specialty_id"
                    value={doctorData.specialty_id}
                    onChange={handleDoctorInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    name="gender"
                    value={doctorData.gender}
                    onChange={handleDoctorInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={doctorData.phone}
                    onChange={handleDoctorInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={doctorData.bio}
                    onChange={handleDoctorInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={doctorData.contact_email}
                    onChange={handleDoctorInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Years of Experience</label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={doctorData.years_of_experience}
                    onChange={handleDoctorInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select
                    name="gender"
                    value={patientData.gender}
                    onChange={handlePatientInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={patientData.date_of_birth}
                    onChange={handlePatientInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={patientData.address}
                    onChange={handlePatientInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={patientData.phone}
                    onChange={handlePatientInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Disease (Optional)</label>
                  <input
                    type="text"
                    name="disease"
                    value={patientData.disease}
                    onChange={handlePatientInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Medical History (Optional)</label>
                  <textarea
                    name="medical_history"
                    value={patientData.medical_history}
                    onChange={handlePatientInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-blue-300"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;