import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed", "blocked"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  projectId: z.string().optional().nullable(),
});

/** ✅ SINGLE source of truth */
export type TaskFormValues = z.infer<typeof taskFormSchema>;
