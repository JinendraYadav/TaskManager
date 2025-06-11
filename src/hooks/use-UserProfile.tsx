
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { User } from "@/types";
import { userService } from "@/services/userService";
import { useToast } from "./use-toast";

export function useUserProfile() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser || !authUser.id) {
        setLoading(false);
        return;
      }
      
      try {
        // Try to get the full user profile if needed
        const userData = await userService.getUserById(authUser.id);
        if (userData) {
          setUser(userData);
        } else {
          // Fall back to auth user data
          setUser(authUser);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fall back to auth user data
        setUser(authUser);
        toast({
          title: "Profile Data",
          description: "Using basic profile information. Some details may not be available.",
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (authUser && !authLoading) {
      fetchUserData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authUser, authLoading, toast]);

  return { user, loading };
}
