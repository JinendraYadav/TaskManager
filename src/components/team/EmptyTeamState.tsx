
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyTeamStateProps {
  onCreateClick: () => void;
}

export function EmptyTeamState({ onCreateClick }: EmptyTeamStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg px-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <UserPlus className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No teams yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Create your first team to start collaborating with your colleagues on projects and tasks.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onCreateClick}>Create Your First Team</Button>
        <Link to="/tasks">
          <Button variant="outline">Create Your First Task</Button>
        </Link>
      </div>
    </div>
  );
}
