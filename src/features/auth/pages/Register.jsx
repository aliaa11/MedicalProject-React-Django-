import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    user: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    },
    doctor: {
      specialty_id: '',
      gender: '',
      phone: '',
      bio: '',
      contact_email: '',
      years_of_experience: ''
    },
    patient: {
      gender: '',
      date_of_birth: '',
      address: '',
      phone: '',
      disease: '',
      medical_history: ''
    }
  });

  // Fetch specialties from backend
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/specialties/');
        setSpecialties(response.data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };
    
    fetchSpecialties();
  }, []);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.user.username) newErrors.username = 'Username is required';
      else if (formData.user.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
      
      if (!formData.user.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.user.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.user.password) newErrors.password = 'Password is required';
      else if (formData.user.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (formData.user.password !== formData.user.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!role) newErrors.role = 'Please select an account type';
    }
    
    if (step === 2 && role === 'doctor') {
      if (!formData.doctor.specialty_id) newErrors.specialty_id = 'Specialty is required';
      if (!formData.doctor.gender) newErrors.gender = 'Gender is required';
      if (!formData.doctor.phone) newErrors.phone = 'Phone number is required';
      else if (!/^[0-9]{10,15}$/.test(formData.doctor.phone)) newErrors.phone = 'Invalid phone number';
      if (!formData.doctor.bio) newErrors.bio = 'Bio is required';
      if (!formData.doctor.contact_email) newErrors.contact_email = 'Contact email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.doctor.contact_email)) newErrors.contact_email = 'Email is invalid';
      if (!formData.doctor.years_of_experience) newErrors.years_of_experience = 'Years of experience is required';
    }
    
    if (step === 2 && role === 'patient') {
      if (!formData.patient.gender) newErrors.gender = 'Gender is required';
      if (!formData.patient.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      if (!formData.patient.address) newErrors.address = 'Address is required';
      if (!formData.patient.phone) newErrors.phone = 'Phone number is required';
      else if (!/^[0-9]{10,15}$/.test(formData.patient.phone)) newErrors.phone = 'Invalid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(1)) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!validateStep(2)) {
      setLoading(false);
      return;
    }

    try {
      // Prepare complete registration data
      const completeData = {
        user_data: {
          ...formData.user,
          role: role
        },
        [role === 'doctor' ? 'doctor_data' : 'patient_data']: 
          role === 'doctor' ? formData.doctor : formData.patient
      };

      // Send to the new complete registration endpoint
      const response = await axios.post('http://localhost:8000/api/register/complete/', completeData);
      
      if (response.data.message) {
        navigate('/login', { state: { registrationSuccess: true } });
      }
    } catch (error) {
      console.error('Registration error:', error.response);
      setErrors({ form: error.response?.data?.error || 'An error occurred during registration. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="brand-content">
            <h1 className="brand-title">Medical Booking System</h1>
            <p className="brand-subtitle">Register your account now and get the best medical services</p>
            
            <div className="brand-features">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Easy appointment booking</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Complete appointment management</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Direct communication with doctors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <div className="progress-container">
            <div className="progress-steps">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Basic Information</div>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Personal Information</div>
              </div>
            </div>
          </div>

          <div className="form-content">
            <h2 className="form-title">
              {step === 1 ? 'Create New Account' : role === 'doctor' ? 'Doctor Information' : 'Patient Information'}
            </h2>
            <p className="form-description">
              {step === 1 ? 'Fill in basic information to create your account' : 'Complete your personal information'}
            </p>

            {errors.form && (
              <div className="error-message" style={{ marginBottom: '1rem' }}>
                {errors.form}
              </div>
            )}

            <form className="register-form" onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              {step === 1 ? (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.user.username}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className={`form-input ${errors.username ? 'error' : ''}`}
                      placeholder="Enter username"
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.user.email}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.user.password}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Enter password"
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.user.confirmPassword}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Account Type</label>
                    <div className="role-selector">
                      <div 
                        className={`role-option ${role === 'doctor' ? 'selected' : ''}`}
                        onClick={() => setRole('doctor')}
                      >
                        <div className="role-content">
                          <svg className="role-icon" viewBox="0 0 24 24">
                            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>
                          </svg>
                          <span className="role-name">Doctor</span>
                        </div>
                      </div>
                      <div 
                        className={`role-option ${role === 'patient' ? 'selected' : ''}`}
                        onClick={() => setRole('patient')}
                      >
                        <div className="role-content">
                          <svg className="role-icon" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <span className="role-name">Patient</span>
                        </div>
                      </div>
                    </div>
                    {errors.role && <span className="error-message">{errors.role}</span>}
                  </div>
                </div>
              ) : (
                <div className="form-grid">
                  {role === 'doctor' ? (
                    <>
                      <div className="form-group">
                        <label className="form-label">Specialty</label>
                        <select
                          name="specialty_id"
                          value={formData.doctor.specialty_id}
                          onChange={(e) => handleInputChange(e, 'doctor')}
                          className={`form-input ${errors.specialty_id ? 'error' : ''}`}
                        >
                          <option value="">Select specialty</option>
                          {specialties.map(specialty => (
                            <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                          ))}
                        </select>
                        {errors.specialty_id && <span className="error-message">{errors.specialty_id}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select
                          name="gender"
                          value={formData.doctor.gender}
                          onChange={(e) => handleInputChange(e, 'doctor')}
                          className={`form-input ${errors.gender ? 'error' : ''}`}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.doctor.phone}
                          onChange={(e) => handleInputChange(e, 'doctor')}
                          className={`form-input ${errors.phone ? 'error' : ''}`}
                          placeholder="Enter phone number"
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Contact Email</label>
                        <input
                          type="email"
                          name="contact_email"
                          value={formData.doctor.contact_email}
                          onChange={(e) => handleInputChange(e, 'doctor')}
                          className={`form-input ${errors.contact_email ? 'error' : ''}`}
                          placeholder="Enter contact email"
                        />
                        {errors.contact_email && <span className="error-message">{errors.contact_email}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <input
                          type="number"
                          name="years_of_experience"
                          value={formData.doctor.years_of_experience}
                          onChange={(e) => handleInputChange(e, 'doctor')}
                          className={`form-input ${errors.years_of_experience ? 'error' : ''}`}
                          placeholder="Years of experience"
                          min="0"
                        />
                        {errors.years_of_experience && <span className="error-message">{errors.years_of_experience}</span>}
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Bio</label>
                        <textarea
                          name="bio"
                          value={formData.doctor.bio}
                          onChange={(e) => handleInputChange(e, 'doctor')}
                          className={`form-input ${errors.bio ? 'error' : ''}`}
                          placeholder="Enter your bio"
                          rows="4"
                        ></textarea>
                        {errors.bio && <span className="error-message">{errors.bio}</span>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select
                          name="gender"
                          value={formData.patient.gender}
                          onChange={(e) => handleInputChange(e, 'patient')}
                          className={`form-input ${errors.gender ? 'error' : ''}`}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.patient.date_of_birth}
                          onChange={(e) => handleInputChange(e, 'patient')}
                          className={`form-input ${errors.date_of_birth ? 'error' : ''}`}
                        />
                        {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.patient.phone}
                          onChange={(e) => handleInputChange(e, 'patient')}
                          className={`form-input ${errors.phone ? 'error' : ''}`}
                          placeholder="Enter phone number"
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.patient.address}
                          onChange={(e) => handleInputChange(e, 'patient')}
                          className={`form-input ${errors.address ? 'error' : ''}`}
                          placeholder="Enter your address"
                        />
                        {errors.address && <span className="error-message">{errors.address}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Disease (Optional)</label>
                        <input
                          type="text"
                          name="disease"
                          value={formData.patient.disease}
                          onChange={(e) => handleInputChange(e, 'patient')}
                          className="form-input"
                          placeholder="Enter disease if known"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Medical History (Optional)</label>
                        <textarea
                          name="medical_history"
                          value={formData.patient.medical_history}
                          onChange={(e) => handleInputChange(e, 'patient')}
                          className="form-input"
                          placeholder="Enter medical history if known"
                          rows="3"
                        ></textarea>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="form-actions">
                {step === 2 ? (
                  <button type="button" className="back-button" onClick={prevStep} disabled={loading}>
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button type="submit" className="submit-button" disabled={loading || (step === 1 && !role)}>
                  {loading ? (
                    'Processing...'
                  ) : step === 1 ? (
                    <>
                      Next
                      <svg className="button-icon" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                Already have an account?{' '}
                <a href="/login" className="footer-link">Login now</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;