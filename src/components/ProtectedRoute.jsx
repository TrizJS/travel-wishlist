import { useAuth } from '../context/AuthContext';
import AuthForm from './AuthForm';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <AuthForm />;

  return children;
}

export default ProtectedRoute;
