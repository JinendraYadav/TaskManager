
import { Team } from "@/types";
import { TeamCard } from "./TeamCard";
import { EmptyTeamState } from "./EmptyTeamState";

interface TeamListProps {
  teams: Team[];
  isLoading: boolean;
  onMemberAdded: (updatedTeam: Team) => void;
  onLeaveTeam: (teamId: string) => void;
  onCreateClick: () => void;
}

export function TeamList({ teams, isLoading, onMemberAdded, onLeaveTeam, onCreateClick }: TeamListProps) {
  if (isLoading) {
    return <div className="flex justify-center py-8">Loading teams...</div>;
  }

  if (teams.length === 0) {
    return <EmptyTeamState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="space-y-6">
      {teams.map((team) => (
        <TeamCard 
          key={team._id} 
          team={team} 
          onMemberAdded={onMemberAdded} 
          onLeaveTeam={onLeaveTeam} 
        />
      ))}
    </div>
  );
}
