
import { Task } from "@/types";
import { CalendarTaskItem } from "./CalendarTaskItem";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Info } from "lucide-react";

interface DailyTasksSectionProps {
  date: Date | undefined;
  tasks: Task[];
  isLoading: boolean;
  onEditTask: (task: Task) => void;
}

export function DailyTasksSection({ date, tasks, isLoading, onEditTask }: DailyTasksSectionProps) {
  const formattedDate = date ? date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }) : '';

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{formattedDate}</h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="h-8 w-8 border-4 border-t-transparent border-primary animate-spin rounded-full"></div>
            <p className="ml-3 text-muted-foreground">Loading tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <CalendarTaskItem
                key={task.id}
                task={task}
                onEdit={onEditTask}
              />
            ))}
          </div>
        ) : (
          <Alert variant="default" className="bg-muted/50">
            <Info className="h-4 w-4" />
            <AlertDescription className="ml-2">
              No tasks scheduled for this date.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
