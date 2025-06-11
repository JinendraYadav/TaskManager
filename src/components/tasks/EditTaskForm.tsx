
import { Task } from "@/types";
import { CreateTaskForm } from "./CreateTaskForm";

interface EditTaskFormProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onCancel: () => void;
}

export function EditTaskForm({ task, onTaskUpdated, onCancel }: EditTaskFormProps) {
  // Ensure task is properly formatted for the form
  const formatTaskForForm = () => {
    // Handle tags safely - convert array to string if needed
    const tagsString = Array.isArray(task.tags)
      ? task.tags.join(", ")
      : typeof task.tags === "string"
      ? task.tags
      : "";

    // Handle different formats of assigneeId and createdBy
    const assigneeId = typeof task.assigneeId === "object" && task.assigneeId !== null
      ? task.assigneeId.id || task.assigneeId._id
      : task.assigneeId || "";

    const createdBy = typeof task.createdBy === "object" && task.createdBy !== null
      ? task.createdBy.id || task.createdBy._id
      : task.createdBy || "";

    // Ensure dueDate is in the correct format
    const formattedDueDate = task.dueDate 
      ? new Date(task.dueDate).toISOString().split("T")[0] 
      : new Date().toISOString().split("T")[0];

    // Return formatted task data
    return {
      ...task,
      dueDate: formattedDueDate,
      assigneeId,
      createdBy,
      tags: tagsString,
    };
  };

  const formattedTask = formatTaskForForm();

  return (
    <CreateTaskForm
      initialData={formattedTask}
      onTaskCreated={onTaskUpdated}
      onCancel={onCancel}
      isEditing={true}
      onClose={onCancel}
      onSave={onTaskUpdated}
    />
  );
}
