import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project, User } from "@/types";
import { projectService } from "@/services/projectService";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


interface MembersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    users: Record<string, User>;
    onProjectUpdated: (project: Project) => void;
}

export function MembersDialog({
    open,
    onOpenChange,
    project,
    users,
    onProjectUpdated
}: MembersDialogProps) {
    if (!project) return null;

    const [email, setEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [removingUserId, setRemovingUserId] = useState<string | null>(null);
    const { toast } = useToast();

    const members = Array.isArray(project.members)
        ? project.members
        : [];

    const getUser = (id: string) =>
        users[id] || { id, name: "Unknown", avatar: "" };

    const handleRemoveMember = async (userId: string) => {
        if (!project) return;

        try {
            const projectId = project.id || project._id;
            if (!projectId) return;

            const updatedProject =
                await projectService.removeMemberFromProject(
                    projectId,
                    userId
                );
            onProjectUpdated(updatedProject);
            toast({
                title: "Member removed",
                description: "The user no longer has access to this project.",
                duration: 1200,
            });

        } catch (error) {
            console.error("Failed to remove member:", error);
        }
    };
    const handleAddMember = async () => {
        if (!project || !email.trim()) return;

        try {
            setIsAdding(true);

            const projectId = project.id || project._id;
            if (!projectId) return;

            const updatedProject =
                await projectService.addMemberToProject(projectId, email.trim());

            onProjectUpdated(updatedProject);
            setEmail("");
            toast({
                title: "Member added",
                description: "The user now has access to this project.",
                duration: 1200,
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error?.response?.data?.message ||
                    "Unable to add member. Please check the email and try again.",
                variant: "destructive",
                duration: 1500,
            });
        } finally {
            setIsAdding(false);
        }
    };



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Project members</DialogTitle>
                    <DialogDescription>
                        Manage who has access to this project
                    </DialogDescription>
                </DialogHeader>

                {/* Members list */}
                <div className="space-y-3 py-4">
                    {members.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            This project has no members yet.
                        </p>
                    )}

                    {members.map((member) => {
                        const memberId =
                            typeof member === "string" ? member : member._id;

                        const user =
                            typeof member === "string"
                                ? getUser(member)
                                : member;

                        const ownerId =
                            typeof project.ownerId === "string"
                                ? project.ownerId
                                : project.ownerId._id;

                        const isOwner = ownerId === memberId;

                        return (
                            <div
                                key={memberId}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <span className="text-sm font-medium">
                                        {user.name}
                                    </span>
                                </div>

                                {/* Placeholder for remove */}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={isOwner || removingUserId === memberId}
                                    onClick={async () => {
                                        setRemovingUserId(memberId);
                                        await handleRemoveMember(memberId);
                                        setRemovingUserId(null);
                                    }}
                                >
                                    {removingUserId === memberId ? "Removing..." : "Remove"}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="Enter member email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            onClick={handleAddMember}
                            disabled={!email.trim() || isAdding}
                        >
                            {isAdding ? "Adding..." : "Add"}
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </div>


            </DialogContent>
        </Dialog>
    );
}