
export type User = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar: string;
};

export type TaskStatus = "todo" | "in-progress" | "completed" | "blocked";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type Task = {
  id: string;
  _id?: string;  // Added _id as an optional property
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt?: string;  // Added to match MongoDB model
  assigneeId: string | User;
  projectId?: string | null;  // Updated to allow null
  tags: string[] | string;
  createdBy: string | User;
  createdByUsername?: string;
};

export type Project = {
  id: string;
  _id?: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  ownerId: string | User;
  members: (string | User)[];
};

export type Team = {
  _id: string;
  id?: string;
  name: string;
  description: string;
  ownerId: string | User;
  members: User[];
  createdAt?: string;
};

export type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: "task" | "comment" | "mention" | "system";
  userId: string;
  relatedItemId?: string;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  taskId: string;
};

export type FilterOptions = {
  status?: TaskStatus | undefined;
  priority?: TaskPriority | undefined;
  assigneeId?: string[];
  projectId?: string[];
  tags?: string[];
  dueDate?: {
    start?: string;
    end?: string;
  };
};
