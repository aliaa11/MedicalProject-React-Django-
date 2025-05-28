import { FiBell, FiSearch } from 'react-icons/fi';
import '../styles/topnav.css';

const TopNav = () => {
  return (
    <header className="topnav">
      <div className="flex items-center gap-4">
      </div>
      
      <div className="topnav-actions">
      
        
        <div className="user-profile">
          <div className="user-avatar">A</div>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;