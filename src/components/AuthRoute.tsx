
import { Navigate } from "react-router-dom";

interface AuthRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo: string;
}

const AuthRoute = ({ children, isAuthenticated, redirectTo }: AuthRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default AuthRoute;
