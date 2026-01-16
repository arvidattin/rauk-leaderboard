import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { updateProfile, getProfile, getUserParticipations } from '../lib/api';

const Profile = ({ session, onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [participations, setParticipations] = useState([]);
    const [message, setMessage] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchData(session.user.id);
        }
    }, [session]);

    const fetchData = async (userId) => {
        setLoading(true);
        try {
            const [profileData, participationData] = await Promise.all([
                getProfile(userId),
                getUserParticipations(userId)
            ]);

            if (profileData) {
                setUsername(profileData.username || '');
            }
            if (participationData) {
                setParticipations(participationData);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await updateProfile({ username });
            setMessage({ type: 'success', text: 'Username updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error updating profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-white/60 text-center py-20 animate-pulse">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-10 md:pt-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                <div className="text-center md:text-left">
                    <h2 className="text-white text-3xl font-bold tracking-tight">Your Profile</h2>
                    <p className="text-[#9d9db9] mt-1">Manage your settings and view your race history</p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center sm:justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Settings Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="glass-card rounded-xl p-6 border border-white/10">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">manage_accounts</span>
                            Settings
                        </h3>

                        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Display Name</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded-lg h-10 px-3 text-white focus:border-primary focus:ring-0 outline-none w-full"
                                    placeholder="Enter username"
                                />
                            </div>

                            {message && (
                                <div className={`p-3 rounded text-xs ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={saving}
                                className="mt-2 bg-white/5 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-white/5 text-sm"
                            >
                                {saving ? 'Saving...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card rounded-xl p-6 border border-white/10">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-indigo-400">equalizer</span>
                            Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-black/20 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-white">{participations.length}</div>
                                <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Races</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3 text-center">
                                <div className="text-2xl font-bold text-white max-w-full truncate">
                                    {participations.length > 0 ? participations[0].year : '-'}
                                </div>
                                <div className="text-xs text-white/40 uppercase tracking-wider mt-1">Latest Year</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performances Column */}
                <div className="lg:col-span-2">
                    <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500">history</span>
                                My Performances
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-white/50 font-medium uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Race Name</th>
                                        <th className="px-6 py-3">Sport</th>
                                        <th className="px-6 py-3">Year</th>
                                        <th className="px-6 py-3 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {participations.length > 0 ? (
                                        participations.map((race) => (
                                            <tr key={race.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{race.race_name}</td>
                                                <td className="px-6 py-4 text-white/70">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                                        ${race.sport === 'Running' ? 'bg-blue-500/10 text-blue-400' :
                                                            race.sport === 'Cycling' ? 'bg-orange-500/10 text-orange-400' :
                                                                'bg-purple-500/10 text-purple-400'}`}>
                                                        {race.sport}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white/60">{race.year}</td>
                                                <td className="px-6 py-4 text-right font-mono text-white/90">{race.finish_time}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-white/40 italic">
                                                No races recorded yet. Time to hit the track!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
