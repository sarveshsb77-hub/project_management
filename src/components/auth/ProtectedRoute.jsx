 import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const auth = useAuth();
  
  // If auth is still loading, or not authenticated, redirect to login
  if (!auth || !auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}