import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiUser, 
  FiCalendar, 
  FiSettings, 
  FiMenu,
  FiLogOut
} from 'react-icons/fi';
import { logout } from '../../auth/services/AuthService';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // استدعاء وظيفة تسجيل الخروج
    navigate('/login'); // إعادة التوجيه إلى صفحة تسجيل الدخول
  };

  return (
    <div className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-brand">
        {collapsed ? (
          <button onClick={() => setCollapsed(false)}>
            <FiMenu className="text-white text-xl" />
          </button>
        ) : (
          <h1 className="text-xl font-bold">Admin Panel</h1>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/admin" className="sidebar-item">
          <FiHome className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </Link>
        
        <Link to="/admin/users" className="sidebar-item">
          <FiUsers className="sidebar-icon" />
          <span className="sidebar-text">Users</span>
        </Link>
        
        <Link to="/admin/doctors" className="sidebar-item">
          <FiUser className="sidebar-icon" />
          <span className="sidebar-text">Doctors</span>
        </Link>
        
        <Link to="/admin/appointments" className="sidebar-item">
          <FiCalendar className="sidebar-icon" />
          <span className="sidebar-text">Appointments</span>
        </Link>
        
       
      </nav>
      
      <div className="sidebar-footer">
        <button 
          onClick={handleLogout}
          className="sidebar-item w-full"
        >
          <FiLogOut className="sidebar-icon" />
          <span className="sidebar-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;