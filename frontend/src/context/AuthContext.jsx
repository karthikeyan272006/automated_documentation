import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, role = 'user') => {
        const endpoint = role === 'admin' ? '/admin/login' : '/users/login';
        console.log(`Attempting login for ${role} at ${endpoint}`);
        const { data } = await api.post(endpoint, { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);

        // Mark attendance on login (skip for admin if needed, but requirements say "Users are stored in MongoDB")
        if (data && data.role !== 'admin') {
            try {
                await api.post('/attendance/login');
                console.log('Attendance logged successfully');
            } catch (err) {
                console.error('Error logging attendance:', err);
            }
        }

        return data;
    };

    const register = async (fullname, email, password) => {
        console.log(`Attempting registration for user at /users/register`);
        const { data } = await api.post('/users/register', { fullname, email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);

        // Mark attendance on first login/registration
        try {
            await api.post('/attendance/login');
        } catch (err) {
            console.error('Error logging initial attendance:', err);
        }

        return data;
    };

    const logout = async () => {
        if (user && user.role !== 'admin') {
            try {
                await api.post('/attendance/logout');
                console.log('Attendance logout logged successfully');
            } catch (err) {
                console.error('Error logging attendance logout:', err);
            }
        }
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
