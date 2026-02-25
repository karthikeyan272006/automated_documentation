import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ adminOnly = false }) => {
    const { user, loading } = useAuth();

    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - Loading:', loading);
    console.log('ProtectedRoute - adminOnly:', adminOnly);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!user) {
        console.log('No user, redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        console.log('Admin only route, user is not admin. Redirecting to /dashboard');
        return <Navigate to="/dashboard" replace />;
    }

    console.log('Rendering Protected Contents via Outlet');
    return <Outlet />;
};

export default ProtectedRoute;
