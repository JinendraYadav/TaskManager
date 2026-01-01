
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { projectService } from "@/services/projectService";
import { Project } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: Project) => void;

  // NEW
  mode?: "create" | "edit";
  project?: Project | null;
}


export function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
  mode = "create",
  project,
}: CreateProjectDialogProps) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
        duration: 1000,
      });
      return;
    }

    setIsLoading(true);

    try {
      let result: Project;

      if (mode === "create") {
        result = await projectService.createProject({
          name,
          description,
          color,
          ownerId: user?.id || "",
        });
      } else {
        const projectId = project?.id || project?._id;

        if (!projectId) {
          throw new Error("Project ID is missing");
        }

        result = await projectService.updateProject(projectId, {
          name,
          description,
          color,
        });
      }

      onProjectCreated(result);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Project save failed:", error);
      toast({
        title: "Error",
        description:
          mode === "create"
            ? "Failed to create project. Please try again."
            : "Failed to update project. Please try again.",
        variant: "destructive",
        duration: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor("#3b82f6");
  };

  useEffect(() => {
    if (mode === "edit" && project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setColor(project.color || "#3b82f6");
    }
  }, [mode, project]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Project" : "Edit Project"}
          </DialogTitle>
          <DialogDescription>
            Create a new project to organize your tasks
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">
                Project Color
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 p-1 cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">
                  {color}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Project"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
