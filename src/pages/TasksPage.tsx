
import { useState, useEffect, useCallback } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { DraggableTaskList } from "@/components/tasks/DraggableTaskList";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";
import { taskService } from "@/services/taskService";
import { Task } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditTaskForm } from "@/components/tasks/EditTaskForm";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const { toast } = useToast();

  // Use a callback for fetchTasks to be able to call it from handlers
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const tasksData = await taskService.getAllTasks();
      console.log("Fetched tasks:", tasksData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
    
    // Setup an interval to refetch tasks periodically to ensure they're up to date
    const interval = setInterval(() => {
      fetchTasks();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const handleTaskCreate = async (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Created",
      description: "New task has been added successfully.",
      duration: 1000,
    });
    
    // Refetch to ensure we have the latest data
    await fetchTasks();
  };

  const handleTaskUpdate = (task: Task) => {
    // Open the dialog with the task to edit
    if (task) {
      setEditTask(task);
      setIsTaskDialogOpen(true);
    }
  };

  const handleTaskStatusUpdate = async (task: Task) => {
    // This is for drag-and-drop updates that don't need the dialog
    if (!task) return;
    
    try {
      const savedTask = await taskService.updateTask(task.id, task);
      if (savedTask) {
        // Refresh the tasks list to ensure consistency
        await fetchTasks();
        
        toast({
          title: "Task Updated",
          description: "Task status has been updated.",
          duration: 1000,
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleTaskSave = async (updatedTask: Task) => {
    if (!updatedTask) return;
    
    try {
      const savedTask = await taskService.updateTask(updatedTask.id, updatedTask);
      if (savedTask) {
        setIsTaskDialogOpen(false);
        setEditTask(null);
        
        // Refresh the tasks list to ensure consistency
        await fetchTasks();
        
        toast({
          title: "Task Updated",
          description: "Task has been updated successfully.",
          duration: 1000,
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleTaskDelete = async (taskId: string): Promise<void> => {
    if (!taskId) return Promise.reject(new Error("Task ID is required"));
    
    try {
      const success = await taskService.deleteTask(taskId);
      if (success) {
        // Refresh the tasks list to ensure consistency
        await fetchTasks();
        
        toast({
          title: "Task Deleted",
          description: "Task has been deleted successfully.",
          duration: 1000,
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <div className="flex items-center gap-4">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "board")}>
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="board">Board View</TabsTrigger>
            </TabsList>
          </Tabs>
          <CreateTaskButton onCreated={handleTaskCreate} />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-8">Loading tasks...</div>
      ) : viewMode === "list" ? (
        <TaskList
          items={tasks}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      ) : (
        <DraggableTaskList
          items={tasks}
          onUpdate={handleTaskStatusUpdate}
          onDelete={handleTaskDelete}
        />
      )}
      
      <Dialog 
        open={isTaskDialogOpen} 
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) setEditTask(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && (
            <EditTaskForm
              task={editTask}
              onTaskUpdated={handleTaskSave}
              onCancel={() => {
                setEditTask(null);
                setIsTaskDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
