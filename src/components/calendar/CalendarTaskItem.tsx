
import { Task } from "@/types";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarTaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function CalendarTaskItem({ task, onEdit }: CalendarTaskItemProps) {
  return (
    <div
      className="p-3 rounded-lg border flex justify-between items-center hover:border-primary transition-colors"
    >
      <div>
        <h3 className="font-medium">{task.title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">{task.description}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px]">{task.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded text-xs capitalize ${
            task.priority === "high"
              ? "bg-red-100 text-red-800"
              : task.priority === "medium"
                ? "bg-orange-100 text-orange-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {task.priority}
        </span>

        <button
          onClick={() => onEdit(task)}
          className="text-xs text-blue-600 hover:underline"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
