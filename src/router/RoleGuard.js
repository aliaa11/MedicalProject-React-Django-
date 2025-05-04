export default function RoleGuard(to, from, next) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
  
    if (!token) return next('/login');
  
    const allowedRoles = to.meta.roles;
    if (allowedRoles && !allowedRoles.includes(role)) {
      return next('/unauthorized'); // Or redirect to their own dashboard
    }
  
    next();
  }
  