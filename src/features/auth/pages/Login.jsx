import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext.js';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // راقب تغير user وإذا تغير نفذ التنقل المناسب حسب الدور
  useEffect(() => {
    if (user) {
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password
      });

      // حفظ التوكن والدور في السياق
      login(response.data.access, response.data.role);

      // لا تقم بالتنقل هنا
      // التنقل يتم من useEffect عند تغير user

    } catch (err) {
      console.error('خطأ في تسجيل الدخول:', err.response);
      setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

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
