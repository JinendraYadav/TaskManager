
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Team } from "@/types";
import { TeamMember } from "./TeamMember";
import { AddMemberDialog } from "./AddMemberDialog";

interface TeamCardProps {
  team: Team;
  onMemberAdded: (updatedTeam: Team) => void;
  onLeaveTeam: (teamId: string) => void;
}

export function TeamCard({ team, onMemberAdded, onLeaveTeam }: TeamCardProps) {
  return (
    <Card key={team._id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">{team.name}</h3>
            <p className="text-sm text-muted-foreground">{team.description}</p>
          </div>
          <div className="flex gap-2">
            <AddMemberDialog team={team} onMemberAdded={onMemberAdded} />
            <Button variant="outline" onClick={() => onLeaveTeam(team._id)}>
              <LogOut className="mr-2 h-4 w-4" />
              Leave Team
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-medium mb-2">Members</h4>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {team.members.map((member) => (
            <TeamMember key={member._id || member.id} member={member} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
