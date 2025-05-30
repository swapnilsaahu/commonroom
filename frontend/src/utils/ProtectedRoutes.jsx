import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    return isAuthenticated ? <Outlet /> : < Navigate to='/login' state={{ from: location }} />
}

export default ProtectedRoutes;
