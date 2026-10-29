import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// Sends logged-out visitors to /login, then back to the page they wanted
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
