import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types";
import { projectService } from "@/services/projectService";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function TaskFormFields() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();

  /* 🔑 Reactive values */
  const projectId = watch("projectId");
  const dueDateValue = watch("dueDate");
  const date = dueDateValue ? new Date(dueDateValue) : undefined;

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const projectData = await projectService.getAllProjects();
        setProjects(projectData || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();

    /* 🔑 Ensure dueDate exists exactly once */
    if (!getValues("dueDate")) {
      setValue("dueDate", format(new Date(), "yyyy-MM-dd"), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, []);

  return (
    <>
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Task Title</label>
        <Input
          placeholder="Enter task title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-red-500">
            {errors.title.message as string}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          placeholder="Enter task description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">
            {errors.description.message as string}
          </p>
        )}
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={watch("status")}
            onValueChange={(value) =>
              setValue("status", value as any, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select
            value={watch("priority")}
            onValueChange={(value) =>
              setValue("priority", value as any, { shouldDirty: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project & Due Date */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project</label>
          <Select
            value={projectId ?? "none"}
            onValueChange={(value) =>
              setValue(
                "projectId",
                value === "none" ? undefined : value,
                {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                }
              )
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  isLoading ? "Loading projects..." : "Select project (optional)"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md">
              <SelectItem value="none">No project</SelectItem>
              {projects.map((project) => (
                <SelectItem
                  key={project.id || project._id}
                  value={project.id || project._id}
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.projectId && (
            <p className="text-xs text-red-500">
              {errors.projectId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : "Pick a date"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-white shadow-md"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (!selectedDate) return;
                  setValue(
                    "dueDate",
                    format(selectedDate, "yyyy-MM-dd"),
                    {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    }
                  );
                }}
                initialFocus
                className="bg-white border rounded-md"
              />
            </PopoverContent>
          </Popover>

          <input type="hidden" {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-xs text-red-500">
              {errors.dueDate.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <Input
          placeholder="Enter tags separated by commas"
          {...register("tags")}
        />
        <p className="text-xs text-muted-foreground">
          Example: design, website, marketing
        </p>
      </div>
    </>
  );
}
