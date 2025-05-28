import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import boxdocLogo from '../../../assets/boxdoc-logo.png';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialty_id: '',
    gender: '',
    bio: '',
    years_of_experience: '',
    date_of_birth: '',
    address: '',
    disease: '',
    medical_history:''
    
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!role) newErrors.role = 'Please select a role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    if (role === 'doctor') {
      if (!formData.specialty_id) newErrors.specialty_id = 'Specialty is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else {
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else {
      if (validateStep2()) {
        try {
          // Submit user data
          const userResponse = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: formData.username,
              email: formData.email,
              password: formData.password,
              role: role,
              is_approved: role === 'patient'
            }),
          });

          const user = await userResponse.json();

          // Submit role-specific data
          if (role === 'doctor') {
            await fetch('http://localhost:3001/doctors', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user.id,
                specialty_id: formData.specialty_id,
                gender: formData.gender,
                bio: formData.bio,
                years_of_experience: formData.years_of_experience,
                phone: formData.phone
              }),
            });
          } else {
            await fetch('http://localhost:3001/patients', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: user.id,
                gender: formData.gender,
                date_of_birth: formData.date_of_birth,
                address: formData.address,
                phone: formData.phone,
                disease: formData.disease,
                medical_history: formData.medical_history
              }),
            });
          }

          navigate('/login');
        } catch (error) {
          console.error('Registration failed:', error);
        }
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Left Side - Branding */}
        <div className="brand-section">
          <div className="brand-content">
            <img src={boxdocLogo} alt="BoxDoc Logo" className="logo" />
            <h1 className="brand-title">BoxDoc</h1>
            <p className="brand-subtitle">Your Trusted Healthcare Partner</p>
            <div className="brand-features">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secure Medical Records</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>24/7 Doctor Access</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span>Cloud-Based Solutions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-section">
          {/* Progress Indicator */}
          <div className="progress-container">
            <div className="progress-steps">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Account</div>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Profile</div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="form-content">
            <h2 className="form-title">
              {step === 1 ? 'Create Your Account' : `Complete Your ${role === 'doctor' ? 'Doctor' : 'Patient'} Profile`}
            </h2>
            <p className="form-description">
              {step === 1 ? 'Join our medical community today' : 'Help us know you better'}
            </p>

            <form onSubmit={handleSubmit} className="register-form">
              {step === 1 ? (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Username*</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`form-input ${errors.username ? 'error' : ''}`}
                        placeholder="Enter your username"
                      />
                      {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Password*</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        placeholder="At least 6 characters"
                      />
                      {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password*</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && (
                        <span className="error-message">{errors.confirmPassword}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">I am registering as*</label>
                    <div className="role-selector">
                      <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`role-option ${role === 'doctor' ? 'selected' : ''}`}
                      >
                        <div className="role-content">
                          <svg className="role-icon" viewBox="0 0 24 24">
                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="role-name">Doctor</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`role-option ${role === 'patient' ? 'selected' : ''}`}
                      >
                        <div className="role-content">
                          <svg className="role-icon" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="role-name">Patient</span>
                        </div>
                      </button>
                    </div>
                    {errors.role && <span className="error-message">{errors.role}</span>}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Phone Number*</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="Enter phone number"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Disease*</label>
                      <input
                        type="text"
                        name="disease"
                        value={formData.disease}
                        onChange={handleChange}
                        className={`form-input ${errors.disease ? 'error' : ''}`}
                        placeholder="Enter your disease"
                      />
                      {errors.disease && <span className="error-message">{errors.disease}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Medical History*</label>
                      <input
                        type="text"
                        name="medical_history"
                        value={formData.medical_history}
                        onChange={handleChange}
                        className={`form-input ${errors.medical_history ? 'error' : ''}`}
                        placeholder="Enter your Medical History"
                      />
                      {errors.medical_history && <span className="error-message">{errors.medical_history}</span>}
                    </div>

                    {role === 'doctor' ? (
                      <div className="form-group">
                        <label className="form-label">Specialty*</label>
                        <select
                          name="specialty_id"
                          value={formData.specialty_id}
                          onChange={handleChange}
                          className={`form-input ${errors.specialty_id ? 'error' : ''}`}
                        >
                          <option value="">Select Specialty</option>
                          <option value="1">Internal Medicine</option>
                          <option value="2">Pediatrics</option>
                        </select>
                        {errors.specialty_id && (
                          <span className="error-message">{errors.specialty_id}</span>
                        )}
                      </div>
                    ) : (
                      <div className="form-group">
                        <label className="form-label">Date of Birth*</label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          className={`form-input ${errors.date_of_birth ? 'error' : ''}`}
                        />
                        {errors.date_of_birth && (
                          <span className="error-message">{errors.date_of_birth}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Gender*</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`form-input ${errors.gender ? 'error' : ''}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>

                    {role === 'doctor' ? (
                      <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <input
                          type="number"
                          name="years_of_experience"
                          value={formData.years_of_experience}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Enter years"
                          min="0"
                        />
                      </div>
                    ) : (
                      <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Enter your address"
                        />
                      </div>
                    )}
                  </div>

                  {role === 'doctor' && (
                    <div className="form-group">
                      <label className="form-label">Professional Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        className="form-input"
                        placeholder="Tell us about your professional background"
                      ></textarea>
                    </div>
                  )}
                </>
              )}

              <div className="form-actions">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="back-button"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className={`submit-button ${step === 1 ? 'w-full' : 'ml-auto'}`}
                >
                  {step === 1 ? 'Continue' : 'Complete Registration'}
                  <svg className="button-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                {step === 1 ? 'Already have an account?' : 'Want to change account type?'}{' '}
                <a
                  href={step === 1 ? '/login' : '#'}
                  onClick={step === 2 ? (e) => { e.preventDefault(); setStep(1); } : null}
                  className="footer-link"
                >
                  {step === 1 ? 'Sign in' : 'Go back'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;