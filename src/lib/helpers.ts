
import { Task, TaskPriority, TaskStatus } from "@/types";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case "todo":
      return "bg-theme-blue text-gray-700";
    case "in-progress":
      return "bg-theme-yellow text-gray-700";
    case "completed":
      return "bg-theme-green text-gray-700";
    case "blocked":
      return "bg-theme-orange text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case "low":
      return "bg-blue-100 text-blue-800";
    case "medium":
      return "bg-green-100 text-green-800";
    case "high":
      return "bg-amber-100 text-amber-800";
    case "urgent":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "todo":
      return "circle";
    case "in-progress":
      return "clock";
    case "completed":
      return "check-circle";
    case "blocked":
      return "x-circle";
    default:
      return "help-circle";
  }
};

export const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return "chevron-down";
    case "medium":
      return "minus";
    case "high":
      return "chevron-up";
    case "urgent":
      return "alert-triangle";
    default:
      return "help-circle";
  }
};

export const groupTasksByStatus = (tasks: Task[]): Record<TaskStatus, Task[]> => {
  return {
    "todo": tasks.filter(task => task.status === "todo"),
    "in-progress": tasks.filter(task => task.status === "in-progress"),
    "completed": tasks.filter(task => task.status === "completed"),
    "blocked": tasks.filter(task => task.status === "blocked"),
  };
};

export const getTasksDueToday = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate < tomorrow;
  });
};

export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== "completed";
  });
};
