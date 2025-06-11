
import { useState, useEffect } from "react";
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
  const [date, setDate] = useState<Date | undefined>();
  
  const { register, setValue, getValues, formState: { errors } } = useFormContext();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const projectData = await projectService.getAllProjects();
        console.log("Loaded projects for dropdown:", projectData);
        setProjects(projectData || []);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
    
    // Set initial date if available
    const initialDate = getValues("dueDate");
    if (initialDate) {
      setDate(new Date(initialDate));
    } else {
      setDate(new Date());
      setValue("dueDate", format(new Date(), "yyyy-MM-dd"));
    }
  }, [getValues, setValue]);

  // Update the form whenever date changes
  useEffect(() => {
    if (date) {
      setValue("dueDate", format(date, "yyyy-MM-dd"));
    }
  }, [date, setValue]);

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Task Title
        </label>
        <Input 
          id="title" 
          placeholder="Enter task title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea 
          id="description" 
          placeholder="Enter task description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message as string}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <Select 
            defaultValue={getValues("status")}
            onValueChange={(value) => setValue("status", value as any)}
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
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <Select 
            defaultValue={getValues("priority")}
            onValueChange={(value) => setValue("priority", value as any)}
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
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="project" className="text-sm font-medium">
            Project
          </label>
          <Select 
            onValueChange={(value) => setValue("projectId", value)}
            defaultValue={getValues("projectId") || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading projects..." : "Select project"} />
            </SelectTrigger>
            <SelectContent className="bg-popover shadow-md">
              {projects.length === 0 && (
                <SelectItem value="none" disabled>No projects available</SelectItem>
              )}
              {projects.map((project) => (
                <SelectItem key={project.id || project._id} value={project.id || project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectId && (
            <p className="text-xs text-red-500">{errors.projectId.message as string}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover shadow-md" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="bg-popover border rounded-md"
              />
            </PopoverContent>
          </Popover>
          <input type="hidden" {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-xs text-red-500">{errors.dueDate.message as string}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags
        </label>
        <Input 
          id="tags" 
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
