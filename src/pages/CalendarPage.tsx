
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { taskService } from "@/services/taskService";
import { Task } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DailyTasksSection } from "@/components/calendar/DailyTasksSection";
import { EditTaskForm } from "@/components/tasks/EditTaskForm";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await taskService.getAllTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks for calendar:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const tasksForDate = selectedDate
    ? tasks.filter(
      (task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      }
    )
    : [];

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditDialog(true);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    setShowEditDialog(false);
    setSelectedTask(null);
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully."
    });
  };

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? (
                  <span>Tasks for {selectedDate.toLocaleDateString()}</span>
                ) : (
                  <span>No date selected</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DailyTasksSection
                date={selectedDate}
                tasks={tasksForDate}
                isLoading={isLoading}
                onEditTask={handleEditTask}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <EditTaskForm
              task={selectedTask}
              onTaskUpdated={handleTaskUpdated}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}