
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Team } from "@/types";

interface CreateTeamDialogProps {
  onTeamCreated: (team: Team) => void;
}

export function CreateTeamDialog({ onTeamCreated }: CreateTeamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const { toast } = useToast();

  const handleCreateTeam = async () => {
    try {
      const response = await api.post('/teams', {
        name: teamName,
        description: teamDescription
      });
      
      onTeamCreated(response.data);
      setIsOpen(false);
      setTeamName("");
      setTeamDescription("");
      
      toast({
        title: "Team Created",
        description: "Your team has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team and invite members to collaborate on projects.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input 
              id="team-name" 
              value={teamName} 
              onChange={(e) => setTeamName(e.target.value)} 
              placeholder="Enter team name" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea 
              id="team-description" 
              value={teamDescription} 
              onChange={(e) => setTeamDescription(e.target.value)} 
              placeholder="Enter team description" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateTeam}>Create Team</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
