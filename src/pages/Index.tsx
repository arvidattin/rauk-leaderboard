import { useState } from "react";
import RaceCard, { Race, Participant } from "@/components/RaceCard";
import AddRaceDialog from "@/components/AddRaceDialog";
import { Trophy, Users, Flag } from "lucide-react";

const Index = () => {
  const [races, setRaces] = useState<Race[]>([
    {
      id: "1",
      name: "BOSTON MARATHON",
      date: "April 15, 2024",
      participants: [
        { id: "1", name: "Alex Johnson", time: "2:45:30" },
        { id: "2", name: "Sarah Chen", time: "2:42:15" },
        { id: "3", name: "Mike Rodriguez", time: "2:58:45" },
        { id: "4", name: "Emma Davis", time: "2:39:22" },
        { id: "5", name: "Josh Kim", time: "3:15:18" },
        { id: "6", name: "Lisa Wong", time: "2:52:07" },
        { id: "7", name: "David Smith", time: "3:02:33" },
        { id: "8", name: "Maria Garcia", time: "2:48:19" },
      ]
    },
    {
      id: "2", 
      name: "5K CHARITY RUN",
      date: "March 22, 2024",
      participants: [
        { id: "9", name: "Tom Wilson", time: "18:45" },
        { id: "10", name: "Kate Brown", time: "21:30" },
        { id: "11", name: "Chris Lee", time: "19:22" },
        { id: "12", name: "Amy Taylor", time: "20:15" },
        { id: "13", name: "Ryan Mitchell", time: "22:08" },
      ]
    }
  ]);

  const addRace = (name: string, date: string) => {
    const newRace: Race = {
      id: Date.now().toString(),
      name: name.toUpperCase(),
      date,
      participants: []
    };
    setRaces(prev => [newRace, ...prev]);
  };

  const addParticipant = (raceId: string, participant: Omit<Participant, 'id'>) => {
    setRaces(prev => prev.map(race => 
      race.id === raceId 
        ? {
            ...race,
            participants: [...race.participants, { ...participant, id: Date.now().toString() }]
          }
        : race
    ));
  };

  const totalParticipants = races.reduce((total, race) => total + race.participants.length, 0);
  const totalRaces = races.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-gold" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rauk Leaderboard
            </h1>
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            The results of the previous races
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flag className="w-5 h-5" />
              <span className="font-medium">{totalRaces} Races</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span className="font-medium">{totalParticipants} Total Participants</span>
            </div>
          </div>

          <AddRaceDialog onAddRace={addRace} />
        </div>

        {/* Races Grid */}
        {races.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">No races yet!</h3>
            <p className="text-muted-foreground mb-6">Create your first race to start tracking results</p>
            <AddRaceDialog onAddRace={addRace} />
          </div>
        ) : (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {races.map((race) => (
    <RaceCard 
      key={race.id} 
      race={race} 
      onAddParticipant={addParticipant}
    />
  ))}
</div>


        )}
      </div>
    </div>
  );
};

export default Index;
