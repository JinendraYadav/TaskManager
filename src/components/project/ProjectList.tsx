
import { Project, User } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { EmptyProjectState } from "./EmptyProjectState";

interface ProjectListProps {
  projects: Project[] | null | undefined;
  users: Record<string, User>;
  isLoading: boolean;
  onCreateClick: () => void;
}

export function ProjectList({ projects = [], users, isLoading, onCreateClick }: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary animate-spin rounded-full mx-auto mb-4"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  // Safety check to ensure projects is an array
  const projectsArray = Array.isArray(projects) ? projects : [];
  
  if (projectsArray.length === 0) {
    return <EmptyProjectState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {projectsArray.map((project) => (
        <ProjectCard 
          key={project.id || project._id || `project-${Math.random()}`} 
          project={project} 
          users={users} 
        />
      ))}
    </div>
  );
}
