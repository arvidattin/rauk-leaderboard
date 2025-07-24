import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Flag } from "lucide-react";

interface AddRaceDialogProps {
  onAddRace: (name: string, date: string) => void;
}

const AddRaceDialog = ({ onAddRace }: AddRaceDialogProps) => {
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddRace = () => {
    if (raceName.trim() && raceDate.trim()) {
      onAddRace(raceName.trim(), raceDate.trim());
      setRaceName("");
      setRaceDate("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Race
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            Create New Race
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Race Name</label>
            <Input
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
              placeholder="e.g., Boston Marathon, 5K Fun Run"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              value={raceDate}
              onChange={(e) => setRaceDate(e.target.value)}
              placeholder="e.g., March 15, 2024"
              className="mt-1"
            />
          </div>
          <Button onClick={handleAddRace} className="w-full">
            Create Race
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRaceDialog;