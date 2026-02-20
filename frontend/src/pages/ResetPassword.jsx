import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Zap, Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const { data } = await axios.post(
                `http://localhost:5000/api/auth/reset-password/${token}`,
                { password }
            );
            setMessage(data.message);
            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a]">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-lg z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-indigo-500 rounded-2xl shadow-2xl shadow-indigo-500/40 mb-6">
                        <Zap size={32} className="text-white" fill="white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-3">
                        New <span className="text-gradient">Password</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Choose a strong password for your account.</p>
                </div>

                <div className="glass-card p-10 border-white/5 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Reset Password</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></span>
                            {error}
                        </div>
                    )}

                    {message ? (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
                            <CheckCircle size={40} className="text-green-400" />
                            <p className="font-bold text-base">{message}</p>
                            <p className="text-sm text-slate-400">Redirecting you to login in 3 seconds...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div className="group">
                                <label className="block text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3 ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full bg-slate-900/50 border border-white/5 text-white p-4 pl-12 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-pink-400 transition-colors focus:outline-none"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="group">
                                <label className="block text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        className="w-full bg-slate-900/50 border border-white/5 text-white p-4 pl-12 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((p) => !p)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none"
                                        tabIndex={-1}
                                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary group flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <span className="text-lg">{loading ? 'Resetting...' : 'Reset Password'}</span>
                                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-sm text-slate-400 hover:text-indigo-400 font-medium transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
