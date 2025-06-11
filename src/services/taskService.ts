
import { Task } from "@/types";
import api from "./api";

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.get('/tasks');
      console.log("Tasks response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      throw error;
    }
  },
  
  getTaskById: async (id: string): Promise<Task | null> => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  createTask: async (task: Omit<Task, "id" | "createdAt">): Promise<Task | null> => {
    try {
      // Ensure tags is formatted correctly
      const preparedTask = {
        ...task,
        tags: Array.isArray(task.tags) ? task.tags : 
              typeof task.tags === 'string' ? 
                task.tags.split(',').map(tag => tag.trim()).filter(Boolean) : 
                [],
        projectId: task.projectId || null
      };
      
      console.log("Sending task data:", preparedTask);
      const response = await api.post('/tasks', preparedTask);
      console.log("Task created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  updateTask: async (id: string, task: Partial<Task>): Promise<Task | null> => {
    try {
      // Format task data
      const preparedTask = {
        ...task,
        tags: Array.isArray(task.tags) ? task.tags : 
              typeof task.tags === 'string' ? 
                task.tags.split(',').map(tag => tag.trim()).filter(Boolean) : 
                task.tags || [],
        projectId: task.projectId || null
      };
      
      const response = await api.put(`/tasks/${id}`, preparedTask);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  deleteTask: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/tasks/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }
};
