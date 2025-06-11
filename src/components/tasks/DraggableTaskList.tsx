
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { useToast } from "@/hooks/use-toast";

interface DraggableTaskListProps {
  items: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
}

export function DraggableTaskList({ items, onUpdate, onDelete }: DraggableTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(items || []);
  const { toast } = useToast();
  
  // Update when items prop changes
  useEffect(() => {
    setTasks(items || []);
  }, [items]);
  
  const getStatusColumn = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside a valid droppable area
    if (!destination) return;
    
    // Same position, no change needed
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Get the task that was dragged
    const sourceStatus = source.droppableId as TaskStatus;
    const sourceIndex = source.index;
    const tasksInSourceColumn = tasks.filter(task => task.status === sourceStatus);
    const taskToMove = tasksInSourceColumn[sourceIndex];
    
    if (!taskToMove) return;
    
    // Update task status and make API call
    const updatedTask: Task = {
      ...taskToMove,
      status: destination.droppableId as TaskStatus
    };
    
    // Update local state first for immediate UI feedback
    setTasks(prev => 
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    
    // Call the parent's update handler for API update
    onUpdate(updatedTask);
    
    toast({
      title: "Task Updated",
      description: `Task moved to ${destination.droppableId.replace('-', ' ')}`,
      duration: 1000,
    });
  };
  
  const statuses: TaskStatus[] = ["todo", "in-progress", "blocked", "completed"];
  const statusLabels: Record<TaskStatus, string> = {
    "todo": "To Do",
    "in-progress": "In Progress",
    "blocked": "Blocked",
    "completed": "Completed"
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map(status => (
          <div key={status} className="bg-card rounded-lg p-4 border">
            <h3 className="font-medium text-lg mb-3">{statusLabels[status]}</h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 min-h-[200px]"
                >
                  {getStatusColumn(status).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
