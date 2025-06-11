
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { TaskFormFields } from "./TaskFormFields";
import { Task } from "@/types";
import { taskFormSchema, TaskFormValues } from "./TaskFormSchema";
import { taskService } from "@/services/taskService";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void;
  onCancel: () => void;
  defaultTask?: Task;
  isEditing?: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialData?: Partial<Task> & { tags?: string | string[] };
}

export function CreateTaskForm({
  onTaskCreated,
  onCancel,
  defaultTask,
  isEditing = false,
  onSave,
  initialData,
}: CreateTaskFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const taskData = initialData || defaultTask;

  // Handle tags format conversion
  const formatTags = (tags: string[] | string | undefined): string => {
    if (!tags) return "";
    if (typeof tags === "string") return tags;
    if (Array.isArray(tags)) return tags.join(", ");
    return "";
  };
  
  // Format the date properly for the form
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return new Date().toISOString().split("T")[0];
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return new Date().toISOString().split("T")[0];
      }
      return dateObj.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return new Date().toISOString().split("T")[0];
    }
  };

  const methods = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: taskData?.title || "",
      description: taskData?.description || "",
      status: taskData?.status || "todo",
      priority: taskData?.priority || "medium",
      projectId: taskData?.projectId || null,
      dueDate: formatDate(taskData?.dueDate),
      tags: formatTags(taskData?.tags),
    },
  });

  useEffect(() => {
    if (taskData) {
      methods.reset({
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || "todo",
        priority: taskData.priority || "medium",
        projectId: taskData.projectId || null,
        dueDate: formatDate(taskData.dueDate),
        tags: formatTags(taskData.tags),
      });
    }
  }, [taskData, methods]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create or update tasks.",
          variant: "destructive",
        });
        return;
      }

      // Use user ID from auth context
      const userId = user.id;

      // Ensure tags are properly formatted
      const parsedTags = values.tags
        ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

      const taskDataToSubmit = {
        title: values.title,
        description: values.description || "",
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate,
        tags: parsedTags,
        projectId: values.projectId || null,
        assigneeId: taskData?.assigneeId || userId,
        createdBy: taskData?.createdBy || userId,
      };

      console.log("Submitting task data:", taskDataToSubmit);
      
      let result: Task | null;

      if (isEditing && (defaultTask?.id || initialData?.id)) {
        const taskId = defaultTask?.id || initialData?.id || "";
        result = await taskService.updateTask(taskId, taskDataToSubmit);
        if (result) {
          toast({
            title: "Task Updated",
            description: "Your task has been updated successfully.",
            duration: 1000,
          });
          onSave ? onSave(result) : onTaskCreated(result);
        }
      } else {
        result = await taskService.createTask(taskDataToSubmit as any);
        if (result) {
          toast({
            title: "Task Created",
            description: "Your task has been created successfully.",
            duration: 1000,
          });
          onTaskCreated(result);
        }
      }

      if (result) {
        methods.reset();
        onCancel();
      }
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} task:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} task. Please try again.`,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <TaskFormFields />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
