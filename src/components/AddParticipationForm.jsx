import React, { useState } from 'react';
import { addParticipation } from '../lib/api';

const AddParticipationForm = ({ onAdded, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return {
                sport: initialData.sport || 'Running',
                year: initialData.year || new Date().getFullYear(),
                race_name: initialData.race_name || '',
                finish_time: '' // Don't pre-fill finish time
            };
        }
        return {
            sport: 'Running',
            year: new Date().getFullYear(),
            race_name: '',
            finish_time: ''
        };
    });
    const [message, setMessage] = useState(null);

    React.useEffect(() => {
        if (initialData) {
            // Scroll to form only if initialData was passed (user came from leaderboard)
            const formElement = document.getElementById('add-participation-form');
            if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Basic validation for time format HH:MM:SS
        const timeRegex = /^\d{1,2}:\d{2}:\d{2}$/;
        if (!timeRegex.test(formData.finish_time)) {
            // Try to be helpful and append :00 if missing seconds, or 00: if missing hours? 
            // For now just stricter validation or simple auto-fix could be complex.
            // Let's just assume user knows or add a small hint.
        }

        try {
            await addParticipation(formData);
            setMessage({ type: 'success', text: 'Time added successfully!' });
            setFormData({ ...formData, race_name: '', finish_time: '' }); // Reset fields
            if (onAdded) onAdded();
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Error adding time. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const sports = ['Running', 'Cycling', 'Multi-sport', 'Swimming', 'Motor', 'Skiing', 'Other'];

    return (
        <div id="add-participation-form" className="glass-card rounded-xl p-6 border border-white/10" >
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                {initialData ? 'Log Time for Race' : 'Add New Race'}
            </h3>

            {message && (
                <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Sport</label>
                        <select
                            value={formData.sport}
                            onChange={e => setFormData({ ...formData, sport: e.target.value })}
                            disabled={!!initialData}
                            className={`bg-black/20 border border-white/10 rounded-lg h-10 px-3 text-white focus:border-primary focus:ring-0 outline-none w-full ${initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {sports.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Year</label>
                        <input
                            type="number"
                            value={formData.year}
                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                            readOnly={!!initialData}
                            className={`bg-black/20 border border-white/10 rounded-lg h-10 px-3 text-white focus:border-primary focus:ring-0 outline-none w-full ${initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Race Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Stockholm Marathon"
                        value={formData.race_name}
                        onChange={e => setFormData({ ...formData, race_name: e.target.value })}
                        required
                        readOnly={!!initialData}
                        className={`bg-black/20 border border-white/10 rounded-lg h-10 px-3 text-white focus:border-primary focus:ring-0 outline-none w-full ${initialData ? 'opacity-50 cursor-not-allowed font-bold text-primary' : ''}`}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Finish Time (HH:MM:SS)</label>
                    <input
                        type="text"
                        placeholder="00:00:00"
                        pattern="^\d{1,2}:\d{2}:\d{2}$"
                        title="Format: HH:MM:SS"
                        value={formData.finish_time}
                        onChange={e => setFormData({ ...formData, finish_time: e.target.value })}
                        required
                        className="bg-black/20 border border-white/10 rounded-lg h-10 px-3 text-white focus:border-primary focus:ring-0 outline-none w-full font-mono"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? 'Adding...' : 'Submit Time'}
                </button>
            </form>
        </div >
    );
};

export default AddParticipationForm;
