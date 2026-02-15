import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a]">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-lg z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-indigo-500 rounded-2xl shadow-2xl shadow-indigo-500/40 mb-6 font-bold text-white">
                        <Zap size={32} fill="white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-3">
                        Join <span className="text-gradient">AutoDocs</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Start automating your professional logs today.</p>
                </div>

                <div className="glass-card p-10 border-white/5 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-widest text-xs opacity-50">Create Workspace Identity</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    className="w-full bg-slate-900/50 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3 ml-1">Email Terminal</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="w-full bg-slate-900/50 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                                    placeholder="yourname@dev.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3 ml-1">Secure Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    className="w-full bg-slate-900/50 border border-white/5 text-white p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary group flex items-center justify-center space-x-3"
                        >
                            <span className="text-lg">Initialize Account</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an identity?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                                Authenticate Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

