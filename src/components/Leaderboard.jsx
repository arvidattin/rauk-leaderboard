import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/api';
import RaceCard from './RaceCard';
import FullLeaderboardModal from './FullLeaderboardModal';

const Leaderboard = ({ refreshTrigger, onAddParticipation }) => {
    const [participations, setParticipations] = useState([]);
    const [groupedRaces, setGroupedRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSport, setFilterSport] = useState('All');
    const [selectedRace, setSelectedRace] = useState(null);

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const fetchData = async () => {
        setLoading(true);
        const data = await getLeaderboard();
        setParticipations(data || []);
        setLoading(false);
    };

    // Group participations by Race + Year + Sport
    useEffect(() => {
        if (!participations.length) {
            setGroupedRaces([]);
            return;
        }

        const groups = {};

        participations.forEach(p => {
            if (filterSport !== 'All' && p.sport !== filterSport) return;

            // Create a unique key for grouping
            const key = `${p.race_name}_${p.sport}`;

            if (!groups[key]) {
                groups[key] = {
                    title: p.race_name || 'Unknown Race',
                    // year: removed, now per entrant
                    category: p.sport,
                    // date: removed, was year
                    location: 'See Details', // Placeholder
                    participations: []
                };
            }

            // Format time if needed, currently raw string from DB (interval) 
            // Postgres interval might need parsing if it comes back as object. 
            // Supabase-js usually returns string for interval? Let's assume string "HH:MM:SS" or similar.

            groups[key].participations.push({
                name: p.profiles?.username || 'Anonymous',
                year: p.year,
                finish_time: p.finish_time,
                originalTime: p.finish_time // For sorting
            });
        });

        // Convert object to array and sort participations by time
        const racesArray = Object.values(groups).map(race => {
            race.participations.sort((a, b) => a.originalTime.localeCompare(b.originalTime));
            return race;
        });

        // Sort races by name (optional)
        racesArray.sort((a, b) => a.title.localeCompare(b.title));

        setGroupedRaces(racesArray);

    }, [participations, filterSport]);

    const sports = ['All', 'Running', 'Cycling', 'Multi-sport', 'Swimming', 'Motor', 'Skiing', 'Other'];

    if (loading && participations.length === 0) {
        return <div className="text-white/60 text-center py-10">Loading leaderboard...</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Filter Bar */}
                <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {sports.map(sport => (
                        <button
                            key={sport}
                            onClick={() => setFilterSport(sport)}
                            className={`h-8 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap 
                                ${filterSport === sport ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
                        >
                            {sport}
                        </button>
                    ))}
                </div>

                {/* Races Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedRaces.length > 0 ? (
                        groupedRaces.map((race, i) => (
                            <RaceCard
                                key={i}
                                race={race}
                                onShowAll={() => setSelectedRace(race)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-white/40 py-10 glass rounded-xl">
                            No races found for this category.
                        </div>
                    )}
                </div>
            </div>

            {selectedRace && (
                <FullLeaderboardModal
                    race={selectedRace}
                    onClose={() => setSelectedRace(null)}
                    onAddParticipation={onAddParticipation}
                />
            )}
        </>
    );
};

export default Leaderboard;
