
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project, User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Users, Trash } from "lucide-react";


interface ProjectCardProps {
  project: Project;
  users: Record<string, User>;
  onEdit: (project: Project) => void;
  onMembers: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({
  project,
  users,
  onEdit,
  onMembers,
  onDelete,
}: ProjectCardProps) {
  // Function to get user by ID
  const getUserById = (id: string | undefined) => {
    if (!id) return { id: "", name: "Unknown User", email: "", avatar: "" };
    return users[id] || { id, name: "Unknown User", email: "", avatar: "" };
  };


  const members = Array.isArray(project.members) ? project.members : [];

  const owner =
    typeof project.ownerId === "string"
      ? getUserById(project.ownerId)
      : project.ownerId;

  const ownerName = owner?.name || "Unknown";

  return (
    <Card className="overflow-hidden relative">
      <div className="h-2" style={{ backgroundColor: project.color || "#9b87f5" }}></div>
      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          {/* Title + Description */}
          <div className="space-y-1">
            <CardTitle className="leading-tight">
              {project.name || "Unnamed Project"}
            </CardTitle>
            <CardDescription className="leading-snug">
              {project.description || "No description"}
            </CardDescription>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="mt-1 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onMembers(project)}>
                <Users className="h-4 w-4 mr-2" />
                Members
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(project)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Created on {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Unknown date"}
        </p>
        <div className="flex -space-x-2 overflow-hidden">
          {members.slice(0, 5).map((member, index) => {
            const memberId =
              typeof member === "string" ? member : member._id;

            const user =
              typeof member === "string"
                ? getUserById(memberId)
                : member;

            return (
              <Avatar
                key={memberId || index}
                className="border border-black"
              >
                <AvatarImage
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            );
          })}

          {members.length > 5 && (
            <Avatar className="border-2 border-background">
              <AvatarFallback>
                +{members.length - 5}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

      </CardContent>
      <CardFooter className="bg-muted/50 p-3">
        <div className="flex justify-between w-full text-xs">
          <span>
            {members.length} team{" "}
            {members.length === 1 ? "member" : "members"}
          </span>
          <span className="text-muted-foreground">
            Owner: {ownerName}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
