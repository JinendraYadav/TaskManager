
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project, User } from "@/types";

interface ProjectCardProps {
  project: Project;
  users: Record<string, User>;
}

export function ProjectCard({ project, users }: ProjectCardProps) {
  // Function to get user by ID
  const getUserById = (id: string | undefined) => {
    if (!id) return { id: "", name: "Unknown User", email: "", avatar: "" };
    return users[id] || { id, name: "Unknown User", email: "", avatar: "" };
  };

  // Ensure project has an ID
  const projectId = project.id || project._id || "";

  // Ensure members is always an array
  const members = Array.isArray(project.members) ? project.members : [];

  // Ensure ownerId exists
  const ownerId = project.ownerId || "";

  // Get owner name
  const ownerName = getUserById(ownerId).name;

  return (
    <Card className="overflow-hidden">
      <div className="h-2" style={{ backgroundColor: project.color || "#9b87f5" }}></div>
      <CardHeader>
        <CardTitle>{project.name || "Unnamed Project"}</CardTitle>
        <CardDescription>{project.description || "No description"}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Created on {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Unknown date"}
        </p>
        <div className="flex -space-x-2 overflow-hidden">
          {members.slice(0, 5).map((memberId, index) => {
            const user = getUserById(memberId);
            return (
              <Avatar key={`${memberId || index}`} className="border-2 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            );
          })}
          {members.length > 5 && (
            <Avatar className="border-2 border-background">
              <AvatarFallback>+{members.length - 5}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-3">
        <div className="flex justify-between w-full text-xs">
          <span>{members.length} team {members.length === 1 ? "member" : "members"}</span>
          <span className="text-muted-foreground">Owner: {ownerName}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
