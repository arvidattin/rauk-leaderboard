import React from 'react';
import runningImg from '../assets/running.png';
import cyclingImg from '../assets/cycling.png';
import multisportImg from '../assets/multi-sport.png';
import swimmingImg from '../assets/swimming.png';
import motorImg from '../assets/motorsport.png';
import crossCountryImg from '../assets/cross-country.png';
import otherImg from '../assets/other.png';

const sportImages = {
    'Running': runningImg,
    'Cycling': cyclingImg,
    'Multi-sport': multisportImg,
    'Swimming': swimmingImg,
    'Motor': motorImg,
    'Skiing': crossCountryImg,
    'Other': otherImg
};
const sportColors = {
    'Running': 'text-pink-500',
    'Cycling': 'text-emerald-400',
    'Swimming': 'text-cyan-400',
    'Motor': 'text-orange-500',
    'Motor': 'text-orange-500',
    'Skiing': 'text-white',
    'Multi-sport': 'text-amber-700',
    'Other': 'text-slate-400'
};

const FullLeaderboardModal = ({ race, onClose, onAddParticipation }) => {
    if (!race) return null;

    const { title, category, year, participations } = race;
    const bgImage = sportImages[category] || otherImg;
    const computedColorClass = sportColors[category] || "text-primary";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col glass rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="relative p-6 border-b border-white/10 flex items-start justify-between bg-black/40 overflow-hidden">
                    {/* Background Image */}
                    <img
                        src={bgImage}
                        alt={race.category}
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>

                    <div className="relative z-10 flex flex-col gap-1">
                        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${sportColors}`}>
                            <span>{race.category}</span>
                            <span className="w-1 h-1 rounded-full bg-white/30"></span>
                            <span>{race.year}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white leading-none">{race.title}</h2>
                        {race.location && (
                            <div className="flex items-center gap-1 text-white/50 text-sm mt-1">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                {race.location}
                            </div>
                        )}
                    </div>

                    <div className="relative z-20 flex items-center gap-2">
                        <button
                            onClick={() => {
                                onClose();
                                if (onAddParticipation) onAddParticipation({
                                    race_name: race.title,
                                    year: race.year,
                                    sport: race.category
                                });
                            }}
                            className="hidden sm:flex items-center gap-1 bg-primary hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors mr-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">add_circle</span>
                            Add My Time
                        </button>

                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-black/20 text-xs font-bold uppercase tracking-wider text-white/50 border-b border-white/5">
                    <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
                    <div className="col-span-6 sm:col-span-8">Athlete</div>
                    <div className="col-span-4 sm:col-span-3 text-right">Time</div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {race.participations.length > 0 ? (
                        race.participations.map((entry, i) => (
                            <div
                                key={i}
                                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 items-center transition-colors
                                    ${i < 3 ? 'bg-white/[0.02]' : 'hover:bg-white/5'}
                                `}
                            >
                                <div className="col-span-2 sm:col-span-1 flex justify-center">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                        ${i === 0 ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50' :
                                            i === 1 ? 'bg-gray-400/20 text-gray-300 ring-1 ring-gray-400/50' :
                                                i === 2 ? 'bg-amber-700/20 text-amber-500 ring-1 ring-amber-700/50' :
                                                    'text-white/40'}
                                    `}>
                                        {i + 1}
                                    </div>
                                </div>
                                <div className="col-span-6 sm:col-span-8 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xs font-bold text-white/70">
                                        {entry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`font-medium ${i < 3 ? 'text-white' : 'text-white/80'}`}>
                                        {entry.name}
                                    </span>
                                </div>
                                <div className="col-span-4 sm:col-span-3 text-right font-mono text-white/90">
                                    {entry.finish_time}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-white/30 italic">
                            No participants recorded yet.
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                <div className="p-4 bg-white/5 border-t border-white/10 text-xs text-white/40 flex justify-between items-center">
                    <span>Total Participants: {race.participations.length}</span>
                    <span>Sorted by Finish Time</span>
                </div>
            </div>
        </div>
    );
};

export default FullLeaderboardModal;
