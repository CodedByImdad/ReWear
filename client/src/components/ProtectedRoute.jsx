import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

// Works both as <ProtectedRoute>children</ProtectedRoute> and as a
// nested layout route rendering an <Outlet />.
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children ?? <Outlet />;
};

export default ProtectedRoute;
