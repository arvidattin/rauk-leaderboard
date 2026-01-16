import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '../assets/RaukRacing-cropped.svg';

const Login = ({ onLoginSuccess, onCancel }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                if (inviteCode !== 'xz89!v') {
                    throw new Error('Invalid invite code');
                }
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (onLoginSuccess) onLoginSuccess();
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center p-6 z-10 w-full">
            <div className="w-full max-w-[420px] flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center gap-4 mb-2">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="RaukRacing"
                            className="h-12 w-auto drop-shadow-[0_0_8px_rgba(0,0,0,0.2)] filter"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Rauk Racing</h1>
                        <p className="text-[#9d9db9] text-sm mt-2">
                            {isSignUp ? 'Create an account to track progress' : 'Log in to track your performance'}
                        </p>
                    </div>
                </div>

                <div className="bg-[#1c1c27] rounded-xl border border-[#282839] shadow-xl p-6 sm:p-8">
                    {message && (
                        <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-white" htmlFor="email">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">mail</span>
                                </div>
                                <input
                                    className="w-full bg-[#111118] border border-[#282839] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#505062] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm font-medium"
                                    id="email"
                                    type="email"
                                    placeholder="runner@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-white" htmlFor="password">Password</label>
                                {!isSignUp && (
                                    <a className="text-xs font-medium text-primary hover:text-blue-400 transition-colors cursor-pointer">Forgot Password?</a>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">lock</span>
                                </div>
                                <input
                                    className="w-full bg-[#111118] border border-[#282839] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#505062] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm font-medium"
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {isSignUp && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-white" htmlFor="inviteCode">Invite Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">key</span>
                                    </div>
                                    <input
                                        className="w-full bg-[#111118] border border-[#282839] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#505062] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm font-medium"
                                        id="inviteCode"
                                        type="text"
                                        placeholder="Enter code"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                            ) : (
                                <span>{isSignUp ? 'Sign Up' : 'Log In'}</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-lg transition-colors border border-white/5"
                        >
                            Return to Home
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-px bg-[#282839] flex-1"></div>
                        <span className="text-[#505062] text-xs font-medium uppercase tracking-wider">Or</span>
                        <div className="h-px bg-[#282839] flex-1"></div>
                    </div>

                    <div className="mt-6 text-center text-sm text-[#9d9db9]">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-white font-bold hover:text-primary transition-colors ml-1"
                        >
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center gap-6 text-xs text-[#505062]">
                    <a className="hover:text-[#9d9db9] transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-[#9d9db9] transition-colors" href="#">Terms of Service</a>
                    <a className="hover:text-[#9d9db9] transition-colors" href="#">Help Center</a>
                </div>
            </div >
        </div >
    );
};

export default Login;
