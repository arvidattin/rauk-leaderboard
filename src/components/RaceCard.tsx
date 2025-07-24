import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Medal, Award, Plus, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Participant {
  id: string;
  name: string;
  time: string; // in format "2:15:30" or "1:45:22"
}

export interface Race {
  id: string;
  name: string;
  participants: Participant[];
  date: string;
}

interface RaceCardProps {
  race: Race;
  onAddParticipant: (raceId: string, participant: Omit<Participant, 'id'>) => void;
}

const RaceCard = ({ race, onAddParticipant }: RaceCardProps) => {
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantTime, setNewParticipantTime] = useState("");
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);

  // Sort participants by time (convert to seconds for proper comparison)
  const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parseInt(timeStr) || 0;
  };

  const sortedParticipants = [...race.participants].sort((a, b) => 
    timeToSeconds(a.time) - timeToSeconds(b.time)
  );

  const handleAddParticipant = () => {
    if (newParticipantName.trim() && newParticipantTime.trim()) {
      onAddParticipant(race.id, {
        name: newParticipantName.trim(),
        time: newParticipantTime.trim()
      });
      setNewParticipantName("");
      setNewParticipantTime("");
      setIsAddingParticipant(false);
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-6 h-6 text-gold" />;
      case 1:
        return <Medal className="w-6 h-6 text-silver" />;
      case 2:
        return <Award className="w-6 h-6 text-bronze" />;
      default:
        return null;
    }
  };

  const getMedalStyle = (position: number) => {
    switch (position) {
      case 0:
        return "bg-gold text-gold-foreground";
      case 1:
        return "bg-silver text-silver-foreground";
      case 2:
        return "bg-bronze text-bronze-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">{race.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {race.date} • {race.participants.length} participants
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedParticipants.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No participants yet. Add the first competitor!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Combined Results - Top 3 with medal styling, rest with standard styling */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                🏆 Race Results
              </h4>
              <div className="space-y-2">
                {sortedParticipants.map((participant, index) => {
                  const isPodium = index < 3;
                  const medalStyle = isPodium ? getMedalStyle(index) : "bg-muted/30";
                  
                  return (
                    <div key={participant.id} className={`flex items-center justify-between p-3 rounded-lg ${medalStyle}`}>
                      <div className="flex items-center gap-3">
                        {isPodium && getMedalIcon(index)}
                        <span className="text-sm font-medium w-8 opacity-75">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold">{participant.name}</p>
                          {isPodium && (
                            <p className="text-sm opacity-90">
                              {index === 0 ? '1st Place' : index === 1 ? '2nd Place' : '3rd Place'}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant={isPodium ? "outline" : "secondary"} 
                        className={isPodium ? "bg-white/20 text-current border-current" : ""}
                      >
                        {participant.time}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className = "flex justify-center">
        <Dialog open={isAddingParticipant} onOpenChange={setIsAddingParticipant}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Participant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Participant to {race.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    placeholder="Enter participant name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    value={newParticipantTime}
                    onChange={(e) => setNewParticipantTime(e.target.value)}
                    placeholder="e.g., 2:15:30 or 1:45:22"
                  />
                </div>
                <Button onClick={handleAddParticipant} className="w-full">
                  Add Participant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
          </div>
          
        )}
        
      </CardContent>
      
    </Card>
  );
};

export default RaceCard;