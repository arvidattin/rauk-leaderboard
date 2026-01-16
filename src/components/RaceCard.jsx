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
    'Cross-country skiing': 'text-white',
    'Multi-sport': 'text-amber-700',
    'Other': 'text-slate-400'
};

const RaceCard = ({ race, onShowAll }) => {
    const { title, location, category, date, participations } = race;
    const bgImage = sportImages[category] || otherImg;
    const computedColorClass = sportColors[category] || "text-primary";

    return (
        <div className="group flex flex-col rounded-xl glass-card overflow-hidden hover:border-primary/50 shadow-lg transition-all duration-300 hover:translate-y-[-4px] snap-center">
            <div className="flex flex-col sm:flex-row h-full">
                <div className="w-full sm:w-40 h-48 sm:h-auto shrink-0 relative flex items-center justify-center overflow-hidden bg-slate-900">
                    <img
                        src={bgImage}
                        alt={category}
                        className="absolute inset-0 w-full h-full object-cover duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-slate-900/50"></div>

                    <div className="absolute top-2 right-2 glass text-white text-[10px] font-bold px-2 py-1 rounded z-10">
                        {date}
                    </div>
                </div>
                <div className="flex flex-col flex-1 p-5 gap-3 justify-between relative">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                            <p className={`${computedColorClass} text-xs font-bold uppercase tracking-wider`}>{category}</p>
                        </div>
                        <h3 className="text-white text-lg font-normal leading-tight group-hover:font-bold transition-colors">{title}</h3>
                        <div className="flex items-center gap-1 text-[#9d9db9] text-sm mt-1">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            {location || 'Remote/Unknown'}
                        </div>
                    </div>
                    <div className="bg-black/20 rounded p-3 border border-white/5 flex flex-col gap-2">
                        {entrants && entrants.length > 0 ? entrants.slice(0, 3).map((entry, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className={`${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-amber-600'} font-bold w-3 text-center`}>{i + 1}</span>
                                    <span className="text-gray-200">{entry.name}</span>
                                </div>
                                <span className="text-white font-mono">{entry.time}</span>
                            </div>
                        )) : (
                            <div className="text-gray-500 text-xs italic">No entrants yet</div>
                        )}
                    </div>
                    <button
                        onClick={onShowAll}
                        className="flex items-center justify-between w-full mt-1 text-white text-sm font-medium hover:text-primary transition-colors"
                    >
                        <span>View Leaderboard</span>
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RaceCard;
