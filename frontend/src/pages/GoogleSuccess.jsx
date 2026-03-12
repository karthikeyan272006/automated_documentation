import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            const fetchProfileAndRedirect = async () => {
                try {
                    // Fetch user profile using the token
                    const { data } = await axios.get('http://localhost:5000/api/users/profile', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // Prepare user info for localStorage
                    const userInfo = {
                        ...data,
                        token
                    };

                    // Store in localStorage
                    localStorage.setItem('token', token);

                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } catch (error) {
                    console.error('Google login failed:', error);
                    navigate('/');
                }
            };

            fetchProfileAndRedirect();
        } else {
            navigate('/');
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-slate-900">Completing login...</h2>
                <p className="text-slate-500 mt-2">Please wait while we set up your session.</p>
            </div>
        </div>
    );
};

export default GoogleSuccess;
