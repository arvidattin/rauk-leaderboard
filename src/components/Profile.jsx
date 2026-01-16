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

    const sportColors = {
        'Running': 'text-pink-500',
        'Cycling': 'text-emerald-400',
        'Swimming': 'text-cyan-400',
        'Motor': 'text-orange-500',
        'Skiing': 'text-white',
        'Multi-sport': 'text-amber-700',
        'Other': 'text-slate-400'
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-10 md:pt-0">
            {/* ... (existing header code) ... */}

            {/* ... (existing settings column) ... */}

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
                                            <td className="px-6 py-4 font-bold">
                                                <span className={sportColors[race.sport] || 'text-slate-400'}>
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
    );
};

export default Profile;
