import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, User, ShieldCheck, CheckCircle2, ChevronLeft, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null); // null, 'user', or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password, selectedRole);
            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        }
    };

    const renderRoleSelection = () => (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Identity Access</h2>
                <p className="text-slate-500 text-lg">Choose your portal to continue to LoginDocs.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <button
                    onClick={() => setSelectedRole('user')}
                    className="group flex items-center justify-between p-8 bg-white border-2 border-slate-100 rounded-[32px] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <User size={32} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Employee Login</h3>
                            <p className="text-slate-500 text-sm">Track time, tasks, and view personal logs.</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowRight size={24} />
                    </div>
                </button>

                <button
                    onClick={() => setSelectedRole('admin')}
                    className="group flex items-center justify-between p-8 bg-white border-2 border-slate-100 rounded-[32px] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-600/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Admin / Manager</h3>
                            <p className="text-slate-500 text-sm">Manage team, payroll, and view reports.</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowRight size={24} />
                    </div>
                </button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-400 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );

    const renderLoginForm = () => (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-sm mb-10 transition-colors group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to portal selection
            </button>

            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                        {selectedRole === 'admin' ? 'Managerial Access' : 'Employee Portal'}
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500 font-medium">Enter your credentials to access the dashboard.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold border border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-slate-700 text-sm font-bold mb-3 ml-1">Office Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="email"
                            className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 p-5 pl-14 rounded-3xl outline-none focus:bg-white focus:border-indigo-600 transition-all placeholder:text-slate-400 font-medium"
                            placeholder="yourname@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3 ml-1">
                        <label className="text-slate-700 text-sm font-bold">Password</label>
                        <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">Forgot Password?</a>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 p-5 pl-14 pr-14 rounded-3xl outline-none focus:bg-white focus:border-indigo-600 transition-all placeholder:text-slate-400 font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 transition-all hover:translate-y-[-2px] active:translate-y-1 active:shadow-indigo-600/10"
                >
                    <span className="text-lg">Login</span>
                    <ArrowRight size={22} />
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-100"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                    className="w-full py-5 bg-white border-2 border-slate-100 hover:border-indigo-600 text-slate-700 rounded-[24px] font-bold flex items-center justify-center gap-3 transition-all hover:bg-slate-50 hover:shadow-xl hover:shadow-slate-200/50"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.23.81-.6z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-lg">Continue with Google</span>
                </button>
            </form>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Left Side: Dynamic Branding */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 p-16 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[100px]"></div>
                </div>

                <div className="z-10 text-white">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl shadow-xl">L</div>
                        <span className="font-bold text-3xl tracking-tight">LogicDocs</span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-6xl font-black leading-tight mb-8">
                            Track the <span className="text-indigo-300">Pulse</span> of your team.
                        </h1>
                        <div className="space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <CheckCircle2 size={24} className="text-indigo-300" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">100% Transparency</h4>
                                    <p className="text-indigo-100/60 text-sm">Automated proof of work snapshots.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <ShieldCheck size={24} className="text-indigo-300" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">Automated Payroll</h4>
                                    <p className="text-indigo-100/60 text-sm">Seamless salary calculations.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="z-10 flex items-center gap-4 text-white p-8 bg-indigo-700/50 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <User size={32} className="text-indigo-300" />
                    <div>
                        <p className="text-sm font-bold">Currently tracking 42,000+ active sessions</p>
                        <p className="text-indigo-200 text-xs font-medium">Across 120 countries globally</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form / Entry */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white relative">
                <div className="w-full max-w-lg">
                    {selectedRole ? renderLoginForm() : renderRoleSelection()}

                    <div className="mt-20 flex justify-center gap-8">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-6 opacity-20 grayscale" alt="google" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-6 opacity-20 grayscale" alt="microsoft" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" className="h-6 opacity-20 grayscale" alt="slack" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
