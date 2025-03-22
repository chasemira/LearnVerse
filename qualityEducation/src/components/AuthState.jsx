import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthState = ({ children, required }) => {
    const user = useAuth();
    const location = useLocation();

    let condition;
    if (required) {
        condition = user;
    } {
        condition = !user;
    }

    if (!condition) {
        return <Navigate to="/" state={{ from: location.pathname }} />;
    }

    return children;
};

export default AuthState;