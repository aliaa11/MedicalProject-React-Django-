import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // المفتاح هو 'token' وليس 'access_token'
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage');
    // يمكنك توجيه المستخدم لصفحة تسجيل الدخول هنا إذا أردت
  }
  
  return config;
});

export default api;