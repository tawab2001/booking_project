import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token || userType !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;