// src/pages/ConfirmEmail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmEmail } from '../services/AuthService';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const confirm = async () => {
      try {
        await confirmEmail(token, email);
        setStatus('success');
        setMessage('تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'حدث خطأ أثناء تأكيد البريد الإلكتروني.');
      }
    };

    if (token && email) {
      confirm();
    } else {
      setStatus('error');
      setMessage('رابط التأكيد غير صالح.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === 'loading' ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">جاري تأكيد بريدك الإلكتروني...</h2>
          </>
        ) : status === 'success' ? (
          <>
            <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">تم التأكيد بنجاح!</h2>
            <p className="mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            >
              الانتقال إلى تسجيل الدخول
            </button>
          </>
        ) : (
          <>
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">خطأ في التأكيد</h2>
            <p className="mb-6">{message}</p>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            >
              العودة إلى التسجيل
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;