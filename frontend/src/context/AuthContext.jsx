import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                    setToken(token);
                    // Automatically sync tracker token
                    api.post('/sync/sync-tracker').catch(e => console.error('Auto-sync failed:', e));
                } catch (err) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password, role) => {
        const { data } = await api.post('/auth/login', { email, password, role });
        localStorage.setItem('token', data.token);
        setUser(data);
        setToken(data.token);
        // Automatically sync tracker token
        api.post('/sync/sync-tracker').catch(e => console.error('Login sync failed:', e));
        // Automatically mark attendance login for the user
        try {
            await api.post('/attendance/start');
        } catch (err) {
            console.error('Attendance login failed after login:', err.response?.data?.message || err.message);
        }
        return data;
    };

    const register = async (fullname, email, password) => {
        const { data } = await api.post('/auth/register', { fullname, email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        setToken(data.token);
        return data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Backend logout failed:', err);
        }
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };


    return (
        <AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

