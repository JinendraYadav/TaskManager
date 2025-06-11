
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, User } from "@/types";
import { formatDate, getPriorityColor } from "@/lib/helpers";
import { CalendarCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { userService } from "@/services/userService";
import { useAuth } from "@/hooks/useAuth";

interface UpcomingTasksProps {
  tasks: Task[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();

  // Get tasks due within the next 7 days, sorted by due date
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return (
          dueDate >= today &&
          dueDate <= nextWeek &&
          task.status !== "completed"
        );
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (upcomingTasks.length === 0) return;

      setIsLoading(true);
      try {
        // Collect unique assignee IDs from tasks
        const assigneeIds = new Set<string>();
        
        upcomingTasks.forEach(task => {
          // Add assignee ID
          if (task.assigneeId) {
            const assigneeId = typeof task.assigneeId === "string" 
              ? task.assigneeId 
              : task.assigneeId.id;
            if (assigneeId) assigneeIds.add(assigneeId);
          }
        });
        
        const userIds = Array.from(assigneeIds).filter(Boolean);

        // Initialize user map
        const userMap: Record<string, User> = {};

        // Add current user if available
        if (currentUser) {
          userMap[currentUser.id] = currentUser;
        }

        // Fetch users one by one to avoid issues if one request fails
        for (const id of userIds) {
          try {
            // Skip if we already added this user
            if (userMap[id]) continue;
            
            const user = await userService.getUserById(id);
            if (user) {
              userMap[id] = user;
            }
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            // Add fallback user
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
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [upcomingTasks, currentUser]);

  const getUserInfo = (userId: string | { id: string, name?: string } | undefined) => {
    if (!userId) return { name: "User", avatar: "", initial: "U" };
    
    // For current user, use auth context data
    if (currentUser && (userId === currentUser.id || 
        (typeof userId !== "string" && userId.id === currentUser.id))) {
      return {
        name: currentUser.name,
        avatar: currentUser.avatar,
        initial: currentUser.name.charAt(0)
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Upcoming Tasks</CardTitle>
        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading upcoming tasks...</p>
        ) : upcomingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming tasks</p>
        ) : (
          upcomingTasks.map((task) => {
            const userInfo = getUserInfo(task.assigneeId);
            
            return (
              <div key={task.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{task.title}</p>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={userInfo.avatar} />
                      <AvatarFallback>{userInfo.initial}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">{userInfo.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Due {formatDate(task.dueDate)}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
