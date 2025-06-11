
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/helpers";
import { CheckCircle, Clock, FileText, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { Task, User } from "@/types";

export function RecentActivity() {
  const [activities, setActivities] = useState<Task[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        // In a real app, we might have a dedicated activity or audit log API
        // For now, we'll use tasks as a proxy for activities
        const tasks = await taskService.getAllTasks();
        const recentTasks = tasks
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        setActivities(recentTasks);
        
        // Get unique user IDs (both assignees and creators)
        const userIds = new Set<string>();
        
        recentTasks.forEach(task => {
          // Add assignee ID
          if (task.assigneeId) {
            const assigneeId = typeof task.assigneeId === "string" 
              ? task.assigneeId 
              : task.assigneeId.id;
            if (assigneeId) userIds.add(assigneeId);
          }
          
          // Add creator ID
          if (task.createdBy) {
            const creatorId = typeof task.createdBy === "string"
              ? task.createdBy
              : task.createdBy.id;
            if (creatorId) userIds.add(creatorId);
          }
        });
        
        const userMap: Record<string, User> = {};
        
        // For development environment - add mock user if no real users
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          userMap["currentUserId"] = {
            id: "currentUserId",
            name: "Demo User",
            email: "demo@example.com",
            avatar: ""
          };
        }
        
        // Fetch each user
        for (const id of userIds) {
          try {
            if (id === "currentUserId" && userMap["currentUserId"]) {
              continue; // Skip if we already added mock user
            }
            const user = await userService.getUserById(id);
            if (user) {
              userMap[id] = user;
            }
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            // Add fallback user if fetch failed
            if (!userMap[id]) {
              userMap[id] = {
                id: id,
                name: "User",
                email: "",
                avatar: ""
              };
            }
          }
        }
        
        setUsers(userMap);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "blocked":
        return <MessageSquare className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getUserInfo = (userId: string | { id: string, name?: string } | undefined) => {
    if (!userId) return { name: "User", avatar: "", initial: "U" };
    
    // For development mock user
    if (userId === "currentUserId" || (typeof userId === "string" && userId === "currentUserId")) {
      return {
        name: "Demo User",
        avatar: "",
        initial: "D"
      };
    }
    
    const id = typeof userId === "string" ? userId : userId.id;
    const user = users[id];
    
    if (!user) {
      // If no user found in our map, try to use embedded user info if available
      if (typeof userId !== "string" && userId.name) {
        return { 
          name: userId.name, 
          avatar: "", 
          initial: userId.name.charAt(0)
        };
      }
      return { name: "User", avatar: "", initial: "U" };
    }
    
    return {
      name: user.name || "User",
      avatar: user.avatar || "",
      initial: (user.name || "U").charAt(0)
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading activities...</p>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const userInfo = getUserInfo(activity.createdBy);
            
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="mt-1">{getActivityIcon(activity.status)}</div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={userInfo.avatar} />
                      <AvatarFallback>{userInfo.initial}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">
                      {userInfo.name} • {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
