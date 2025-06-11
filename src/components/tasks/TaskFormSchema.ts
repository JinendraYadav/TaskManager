
import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""), 
  status: z.enum(["todo", "in-progress", "completed", "blocked"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  projectId: z.string().nullable().optional(), // Allow null value
  dueDate: z.string().optional().default(() => new Date().toISOString().split("T")[0]),
  tags: z.string().optional().default(""), 
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
