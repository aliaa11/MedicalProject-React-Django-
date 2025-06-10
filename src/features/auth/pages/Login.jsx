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

    console.log('استجابة الخادم:', response.data); // للتأكد من البيانات المستلمة
    
    // هنا نستخدم المفاتيح الصحيحة التي يعيدها الخادم (access و refresh)
    localStorage.setItem('token', response.data.access); // كان access_token والآن access
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('role', response.data.role);
    
    console.log('تم حفظ التوكن:', {
      token: response.data.access,
      role: response.data.role
    });

    // توجيه المستخدم حسب الدور
    if (response.data.role === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/patient-dashboard');
    }

  } catch (err) {
    console.error('خطأ في تسجيل الدخول:', err.response);
    setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
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