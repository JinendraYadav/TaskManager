import { useState } from "react";
import { Project, User } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { EmptyProjectState } from "./EmptyProjectState";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { MembersDialog } from "./MembersDialog";

interface ProjectListProps {
  projects: Project[] | null | undefined;
  users: Record<string, User>;
  isLoading: boolean;
  onCreateClick: () => void;
  onProjectUpdated: (project: Project) => void;
  onProjectDeleted: (projectId: string) => void;
}

export function ProjectList({
  projects = [],
  users,
  isLoading,
  onCreateClick,
  onProjectUpdated,
  onProjectDeleted,
}: ProjectListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);


  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleMembers = (project: Project) => {
    setSelectedProject(project);
    setMembersOpen(true);
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteOpen(true);
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary animate-spin rounded-full mx-auto mb-4" />
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  const projectsArray = Array.isArray(projects) ? projects : [];

  if (projectsArray.length === 0) {
    return <EmptyProjectState onCreateClick={onCreateClick} />;
  }

  return (
    <>
      {/* Project grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projectsArray.map((project) => (
          <ProjectCard
            key={project.id || project._id}
            project={project}
            users={users}
            onEdit={handleEdit}
            onMembers={handleMembers}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CreateProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onProjectCreated={(updatedProject) => {
          onProjectUpdated(updatedProject);
          setDialogOpen(false);
        }}
        mode="edit"
        project={selectedProject}
      />
      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        project={projectToDelete}
        onDeleted={onProjectDeleted}
      />

      <MembersDialog
        open={membersOpen}
        onOpenChange={setMembersOpen}
        project={selectedProject}
        users={users}
        onProjectUpdated={(updatedProject) => {
          // update global projects list
          onProjectUpdated(updatedProject);
          // update selected project so dialog stays in sync
          setSelectedProject(updatedProject);
        }}
      />
    </>
  );
}
