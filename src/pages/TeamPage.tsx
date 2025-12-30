
import { useState, useEffect } from "react";
import { Team } from "@/types";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { CreateTeamDialog } from "@/components/team/CreateTeamDialog";
import { TeamList } from "@/components/team/TeamList";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamCreated = (newTeam: Team) => {
    setTeams(prev => [...prev, newTeam]);

    toast({
      title: "Team Created",
      description: "Team has been created successfully.",
      duration: 1000,
    });
  };

  const handleMemberAdded = (updatedTeam: Team) => {
    setTeams(prev =>
      prev.map(team =>
        team._id === updatedTeam._id ? updatedTeam : team
      )
    );

    toast({
      title: "Member Added",
      description: "Team member has been added successfully.",
      duration: 1000,
    });
  };

  const handleLeaveTeam = async (teamId: string) => {
    try {
      await api.delete(`/teams/${teamId}/leave`);

      // Update the teams list by removing the team the user left
      setTeams(prev => prev.filter(team => team._id !== teamId));

      toast({
        title: "Team Left",
        description: "You have left the team successfully.",
        duration: 1000,
      });
    } catch (error) {
      console.error("Error leaving team:", error);
      toast({
        title: "Error",
        description: "Failed to leave the team. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Team</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          Create Team
        </Button>
        <CreateTeamDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onTeamCreated={handleTeamCreated}
        />

      </div>

      <TeamList
        teams={teams}
        isLoading={isLoading}
        onMemberAdded={handleMemberAdded}
        onLeaveTeam={handleLeaveTeam}
        onCreateClick={handleCreateClick}
      />
    </div>
  );
}
