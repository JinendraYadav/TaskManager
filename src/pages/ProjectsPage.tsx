
import { useState, useEffect } from "react";
import { projectService } from "@/services/projectService";
import { Project, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { CreateProjectDialog } from "@/components/project/CreateProjectDialog";
import { ProjectList } from "@/components/project/ProjectList";
import { EmptyProjectState } from "@/components/project/EmptyProjectState";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);

    try {
      // Fetch projects
      const projectsData = await projectService.getAllProjects();
      setProjects(Array.isArray(projectsData) ? projectsData : []);

      // Fetch users
      try {
        const response = await api.get("/users");
        const userData = response.data || [];

        const userMap: Record<string, User> = {};
        if (Array.isArray(userData)) {
          userData.forEach((user: User) => {
            const userId = user.id || user._id;
            if (userId) {
              userMap[userId] = user;
            }
          });
        }

        setUsers(userMap);
      } catch (userError) {
        console.error("Error fetching users:", userError);
        setUsers({});
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
        duration: 1000,
      });
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleProjectUpdated = (updated: Project) => {
    setProjects((prev) =>
      prev.map((p) =>
        (p.id || p._id) === (updated.id || updated._id)
          ? updated
          : p
      )
    );
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects((prev) =>
      prev.filter(
        (p) => (p.id || p._id) !== projectId
      )
    );
  };

  const handleCreateProject = (newProject: Project) => {
    if (newProject) {
      setProjects((prev) => [...prev, newProject]);
      toast({
        title: "Project Created",
        description: "Project has been created successfully.",
        duration: 1000,
      });
    }
    setCreateDialogOpen(false);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Button onClick={handleCreateClick}>Create Project</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading projects...</div>
      ) : (
        projects.length === 0 ? (
          <EmptyProjectState onCreateClick={handleCreateClick} />
        ) : (
          <ProjectList
            projects={projects}
            users={users}
            isLoading={isLoading}
            onCreateClick={handleCreateClick}
            onProjectUpdated={handleProjectUpdated}
            onProjectDeleted={handleProjectDeleted}
          />
        )
      )}

      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onProjectCreated={handleCreateProject}
      />
    </div>
  );
}
