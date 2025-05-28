import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import '../styles/Login.css';
import boxdocLogo from '../../../assets/boxdoc-logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(formData.email, formData.password);
      
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
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
          <div className="form-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-description">Sign in to access your medical dashboard</p>
            
            {error && (
              <div className="error-message">
                <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
                <a href="/forgot-password" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? (
                  <>
                    <svg className="loading-spinner" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="button-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                Don't have an account?{' '}
                <a href="/register" className="footer-link">
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;