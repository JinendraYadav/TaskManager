
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { projectService } from "@/services/projectService";
import { taskService } from "@/services/taskService";
import { Project, Task } from "@/types";

export function ProjectProgress() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch projects
        const projectsData = await projectService.getAllProjects();
        console.log("Dashboard projects data:", projectsData);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        
        // Fetch tasks
        const tasksData = await taskService.getAllTasks();
        console.log("Dashboard tasks data:", tasksData);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (error) {
        console.error("Error fetching project progress data:", error);
        // Initialize with empty data on error
        setProjects([]);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate project progress
  const projectProgress = projects.map((project) => {
    const projectId = project.id || project._id;
    const projectTasks = tasks.filter((task) => {
      const taskProjectId = task.projectId;
      return taskProjectId === projectId;
    });
    
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(task => task.status === "completed").length;

    const progressPercentage = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      ...project,
      progress: progressPercentage,
      totalTasks,
      completedTasks,
    };
  }).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading project progress...</p>
        ) : projectProgress.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects available</p>
        ) : (
          projectProgress.map((project) => (
            <div key={project.id || project._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{project.name}</p>
                <p className="text-sm font-medium">{project.progress}%</p>
              </div>
              <Progress value={project.progress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {project.completedTasks} of {project.totalTasks} tasks completed
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
