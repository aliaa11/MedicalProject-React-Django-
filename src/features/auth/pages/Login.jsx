import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../../../assets/boxdoc-logo.png'; // Make sure to adjust the path

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    form: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      password: '',
      form: ''
    };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }
    

    // if (!formData.password) {
    //   newErrors.password = 'Password is required';
    //   valid = false;
    // } else if (formData.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    //   valid = false;
    // }

    setErrors(newErrors);
     return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors(prev => ({ ...prev, form: '' }));

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username: formData.username,
        password: formData.password
      });

      const user = {
        token: response.data.access,
        refreshToken: response.data.refresh,
        role: response.data.role,
        userId: response.data.user_id,
        email: response.data.email,
        username: formData.username
      };

      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

      // Redirect based on role
      switch(user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor/profile');
          break;
        default:
          navigate('/patient/profile');
      }

    } catch (err) {
      console.error('Login error:', err.response);
      setErrors(prev => ({
        ...prev,
        form: err.response?.data?.detail || 'Invalid login credentials'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="brand-content">
            <img 
              src={logo} 
              alt="BoxDoc Logo" 
              className="logo" 
            />
            <h1 className="brand-title">Healthcare System</h1>
            <p className="brand-subtitle">Login to access your account</p>
            
            <div className="brand-features">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Easy appointment management</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span>Secure medical records</span>
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
          <div className="form-content">
            <h2 className="form-title">Login</h2>
            <p className="form-description">Enter your credentials to access your account</p>
            
            {errors.form && (
              <div className="error-message">
                <svg className="error-icon" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                <a href="/forgot-password" className="forgot-password">Forgot password?</a>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <svg className="loading-spinner" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="31.415, 31.415" strokeLinecap="round"/>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <svg className="button-icon" viewBox="0 0 24 24">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
            
            <div className="form-footer">
              <p className="footer-text">
                Don't have an account? <a href="/register" className="footer-link">Register now</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;