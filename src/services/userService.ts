
import { User } from "@/types";
import api from "./api";

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get(`/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getUserById: async (id: string): Promise<User | null> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }
};
