import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User does not have the required role
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;