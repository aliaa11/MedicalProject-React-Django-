import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // 1. نجهز المتغيرات
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post('http://localhost:8000/api/login/', {
      username,
      password
    });

    // Store all user data in a single object
    const user = {
      token: response.data.access,
      refreshToken: response.data.refresh,
      role: response.data.role,
      userId: response.data.user_id,
      email: response.data.email,
      username: username
    };

    // Store in localStorage as a single item
    localStorage.setItem('user', JSON.stringify(user));

    // Set the authorization header for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

    console.log('Stored user data:', JSON.parse(localStorage.getItem('userData')));

    if (user.role === 'doctor') {
      navigate('/doctor/appointments');
    } else {
      navigate('/patient/profile');
    }

  } catch (err) {
    console.error('Login error:', err.response);
    setError(err.response?.data?.message || 'Invalid login credentials');
  } finally {
    setLoading(false);
  }
};
  // 8. نرسم واجهة المستخدم
  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>تسجيل الدخول</h2>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>اسم المستخدم:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>كلمة المرور:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 15px', 
            background: loading ? 'gray' : 'blue', 
            color: 'white' 
          }}
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;