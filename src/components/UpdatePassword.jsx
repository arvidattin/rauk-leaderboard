import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import logo from '../assets/RaukRacing-cropped.svg';

const UpdatePassword = ({ onUpdateSuccess }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully!' });

            // Wait a moment so user sees the success message
            setTimeout(() => {
                if (onUpdateSuccess) onUpdateSuccess();
            }, 1500);

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center p-6 z-10 w-full min-h-[calc(100vh-200px)]">
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
                        <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Set New Password</h1>
                        <p className="text-[#9d9db9] text-sm mt-2">
                            Enter your new password below
                        </p>
                    </div>
                </div>

                <div className="bg-[#1c1c27] rounded-xl border border-[#282839] shadow-xl p-6 sm:p-8">
                    {message && (
                        <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-white" htmlFor="new-password">New Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">lock</span>
                                </div>
                                <input
                                    className="w-full bg-[#111118] border border-[#282839] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#505062] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm font-medium"
                                    id="new-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-white" htmlFor="confirm-password">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#9d9db9] text-[20px]">lock_reset</span>
                                </div>
                                <input
                                    className="w-full bg-[#111118] border border-[#282839] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#505062] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm font-medium"
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                            ) : (
                                <span>Update Password</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;
