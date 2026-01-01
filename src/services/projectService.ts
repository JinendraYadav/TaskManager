
import api from "./api";
import { Project } from "@/types";

export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get('/projects');
      console.log("Projects response:", response.data);

      // If response.data is an object with projects array inside
      if (response.data && response.data.projects && Array.isArray(response.data.projects)) {
        return response.data.projects;
      }

      // If response.data is directly the array
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Fallback to empty array if no valid data
      console.warn("Projects response format unexpected:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      return []; // Return empty array on error
    }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  },

  createProject: async (projectData: Omit<Project, "id" | "createdAt" | "members">): Promise<Project | null> => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project | null> => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },

  deleteProject: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  },

  addMemberToProject: async (
    projectId: string,
    email: string
  ): Promise<Project> => {
    const res = await api.post(`/projects/${projectId}/members`, { email });
    return res.data;
  },
  removeMemberFromProject: async (
    projectId: string,
    userId: string
  ): Promise<Project> => {
    try {
      const response = await api.delete(
        `/projects/${projectId}/members/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error removing member ${userId} from project ${projectId}:`,
        error
      );
      throw error;
    }
  },
};