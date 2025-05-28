import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import '../styles/admin.css';

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main-content">
        <TopNav />
        <main className="admin-content animated">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;