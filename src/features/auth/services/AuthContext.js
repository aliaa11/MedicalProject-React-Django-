import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  const login = (token, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  // تأكد من تعيين user فقط إذا اختلف
  setUser(prevUser => {
    if (prevUser?.token === token && prevUser?.role === role) {
      return prevUser; // نفس القيمة، ما تغيرش الحالة
    }
    return { token, role };
  });
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout } },
    props.children
  );
}
