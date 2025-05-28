import { FiBell, FiSearch } from 'react-icons/fi';
import '../styles/topnav.css';

const TopNav = () => {
  return (
    <header className="topnav">
      <div className="flex items-center gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="topnav-actions">
        <button className="notification-btn">
          <FiBell className="text-xl" />
          <span className="notification-badge"></span>
        </button>
        
        <div className="user-profile">
          <div className="user-avatar">A</div>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;