import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';

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
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Left Side: Features & Trust */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-400 rounded-full blur-[80px]"></div>
                </div>

                <div className="z-10 text-white">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-lg">H</div>
                        <span className="font-bold text-2xl tracking-tight">
                            LogicDocs
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Start tracking with <span className="text-indigo-200">confidence.</span>
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-md leading-relaxed mb-12">
                        Get access to enterprise-grade tools for time tracking, activity monitoring, and automated payroll.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <CheckCircle2 className="text-indigo-300" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold">Automated Screenshots</h4>
                                <p className="text-indigo-100/60 text-sm">Capture work evidence automatically.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Globe className="text-indigo-300" size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold">Global Payroll</h4>
                                <p className="text-indigo-100/60 text-sm">Pay your team in any currency.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="z-10 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                        ))}
                    </div>
                    <p className="text-white text-xs font-bold">Joined by 2,000+ companies this month</p>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 mb-3">Create account</h2>
                        <p className="text-slate-500">Start your 14-day free trial. No credit card required.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold border border-red-100 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 text-sm font-bold mb-2 ml-1">Set Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
                            By clicking "Create Workspace", you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
                        >
                            <span>Create Workspace</span>
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:underline font-bold">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;


