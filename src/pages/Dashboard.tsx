
import { useEffect, useState } from "react";
import { CheckCircle, Clock, ListTodo, XCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectProgress } from "@/components/dashboard/ProjectProgress";
import { TasksOverview } from "@/components/dashboard/TasksOverview";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";
import { Task } from "@/types";
import { taskService } from "@/services/taskService";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const tasksData = await taskService.getAllTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks for dashboard:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [toast]);

  // Calculate task counts
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
  const todoTasks = tasks.filter(t => t.status === "todo").length;

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get tasks due today
  const tasksDueToday = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && task.status !== "completed";
  }).length;

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Created",
      description: "New task has been added successfully.",
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <CreateTaskButton onCreated={handleTaskCreated} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={ListTodo}
          className="border-l-4 border-blue-400"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks}
          icon={Clock}
          className="border-l-4 border-yellow-400"
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle}
          className="border-l-4 border-green-400"
        />
        <StatsCard
          title="Due Today"
          value={tasksDueToday}
          icon={XCircle}
          className="border-l-4 border-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TasksOverview tasks={tasks} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RecentActivity />
        <ProjectProgress />
        <UpcomingTasks tasks={tasks} />
      </div>
    </div>
  );
}
