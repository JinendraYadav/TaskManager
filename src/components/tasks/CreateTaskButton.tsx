
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTaskForm } from "./CreateTaskForm";
import { Task } from "@/types";

interface CreateTaskButtonProps {
  onCreated: (task: Task) => void;
}

export function CreateTaskButton({ onCreated }: CreateTaskButtonProps) {
  const [open, setOpen] = useState(false);
  
  const handleTaskCreated = (task: Task) => {
    if (task) {
      onCreated(task);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className="gap-1" onClick={() => setOpen(true)}>
        <Plus size={16} />
        <span>Create Task</span>
      </Button>
      {open && (
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your project
            </DialogDescription>
          </DialogHeader>
          <CreateTaskForm 
            onTaskCreated={handleTaskCreated}
            onCancel={handleCancel}
            onClose={handleCancel}
            onSave={handleTaskCreated}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
