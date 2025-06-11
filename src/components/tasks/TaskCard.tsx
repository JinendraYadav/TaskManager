
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task } from "@/types";
import { formatDate, getPriorityColor, getStatusColor } from "@/lib/helpers";
import { AlertTriangle, Calendar, MessageSquare, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface TaskCardProps {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => Promise<void>;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const { user: currentUser } = useAuth();
  const [commentsCount, setCommentsCount] = useState(0);
  const { toast } = useToast();

  // Prepare createdBy info safely with current user info
  let creatorName = "Unknown";
  let creatorAvatar = "";
  
  if (typeof task.createdBy === "string") {
    // If it's just a string ID, check if it matches current user
    if (currentUser && task.createdBy === currentUser.id) {
      creatorName = currentUser.name;
      creatorAvatar = currentUser.avatar;
    }
  } else {
    // If it's an object, use the data directly
    creatorName = task.createdBy?.name || "Unknown";
    creatorAvatar = task.createdBy?.avatar || "";
  }

  useEffect(() => {
    const fetchComments = async () => {
      if (!task.id) return;
      
      try {
        const res = await api.get(`/comments/task/${task.id}`);
        if (res.data) {
          setCommentsCount(res.data.length);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setCommentsCount(0);
      }
    };

    fetchComments();
  }, [task.id]);

  const dueDate = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = dueDate < today && task.status !== "completed";

  // Handle tags, ensuring they are an array
  const tagsArray = Array.isArray(task.tags)
    ? task.tags
    : typeof task.tags === "string"
    ? task.tags.split(", ").map((tag: string) => tag.trim())
    : [];

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(task.status)}>
            {task.status.replace("-", " ")}
          </Badge>
          <div className="flex items-center">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>

            {(onUpdate || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-1" asChild>
                  <button className="p-1 hover:bg-accent rounded-full">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onUpdate && (
                    <DropdownMenuItem onClick={() => onUpdate(task)}>
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(task.id)}>
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <CardTitle className="text-base line-clamp-1">{task.title}</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          {task.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {tagsArray.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-6 w-6">
            <AvatarImage src={creatorAvatar} />
            <AvatarFallback>
              {creatorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground ml-2">
            {creatorName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{commentsCount}</span>
          </div>
          <div className="flex items-center gap-1">
            {isOverdue ? (
              <AlertTriangle className="h-3 w-3 text-red-500" />
            ) : (
              <Calendar className="h-3 w-3" />
            )}
            <span className={isOverdue ? "text-red-500" : ""}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
