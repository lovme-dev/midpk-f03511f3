import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute = ({ children, redirectTo = '/' }: AdminRouteProps) => {
  const { isAdmin, loading } = useUserRole();
  
  if (loading) {
    return <div className="min-h-screen bg-midasbuy-darkBlue flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-midasbuy-blue"></div>
    </div>;
  }
  
  if (!isAdmin) return <Navigate to={redirectTo} />;
  return <>{children}</>;
};

export default AdminRoute;
