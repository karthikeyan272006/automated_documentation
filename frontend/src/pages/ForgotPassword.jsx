import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
                        Reset <span className="text-gradient">Password</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Enter your email to receive a reset link.</p>
                </div>

                <div className="glass-card p-10 border-white/5 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Forgot Password</h2>

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
                            <p className="text-sm text-slate-400">Check your inbox and follow the link to reset your password.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3 ml-1">Email Id</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        className="w-full bg-slate-900/50 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="yourname@dev.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary group flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <span className="text-lg">{loading ? 'Sending...' : 'Send Reset Link'}</span>
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

export default ForgotPassword;
