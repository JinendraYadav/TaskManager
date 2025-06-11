
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/types";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface TasksOverviewProps {
  tasks: Task[];
}

export function TasksOverview({ tasks }: TasksOverviewProps) {
  // Calculate task statistics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const blockedTasks = tasks.filter((task) => task.status === "blocked").length;

  const data = [
    { name: "To Do", value: todoTasks, fill: "#D3E4FD" },
    { name: "In Progress", value: inProgressTasks, fill: "#FEF7CD" },
    { name: "Completed", value: completedTasks, fill: "#F2FCE2" },
    { name: "Blocked", value: blockedTasks, fill: "#FDE1D3" },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Tasks Overview</CardTitle>
        <CardDescription>
          Task distribution by status
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {totalTasks > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No tasks available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
