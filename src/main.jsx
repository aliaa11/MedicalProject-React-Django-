// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';
import { AuthProvider } from '../src/features/auth/services/AuthContext.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* ✅ Add this wrapper */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
