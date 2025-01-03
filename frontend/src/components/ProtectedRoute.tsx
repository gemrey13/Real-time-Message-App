import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; 

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth(); 
    if (loading) {
        return <div>Loading...</div>; 
    }
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
