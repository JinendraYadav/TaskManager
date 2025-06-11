
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyProjectStateProps {
  onCreateClick: () => void;
}

export function EmptyProjectState({ onCreateClick }: EmptyProjectStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium mb-2">No projects found</h3>
      <p className="text-muted-foreground mb-6">Create your first project to get started</p>
      <Button onClick={onCreateClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Project
      </Button>
    </div>
  );
}
