import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();


    return (
        auth?.token
            ? <Outlet />
            : <Navigate to="login"  />
    );
}

export default RequireAuth;