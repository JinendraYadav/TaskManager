import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { projectService } from "@/services/projectService";
import { Project } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DeleteProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onDeleted: (projectId: string) => void;
}

export function DeleteProjectDialog({
    open,
    onOpenChange,
    project,
    onDeleted,
}: DeleteProjectDialogProps) {
    const { toast } = useToast();

    const handleDelete = async () => {
        if (!project) return;

        try {
            const projectId = project.id || project._id;

            if (!projectId) {
                throw new Error("Project ID missing");
            }

            await projectService.deleteProject(projectId);
            onDeleted(projectId);
            onOpenChange(false);
        } catch (error) {
            console.error("Delete project failed:", error);
            toast({
                title: "Error",
                description: "Failed to delete project. Please try again.",
                variant: "destructive",
                duration: 1500,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete
                        <span className="font-medium text-foreground mx-1">
                            {project?.name}
                        </span>
                        ?
                        <br />
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
