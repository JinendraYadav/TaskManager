
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  BarChart2,
  Settings,
  ChevronLeft,
  FolderKanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  // Use auth directly
  const { user, isLoading } = useAuth();
  
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Tasks", icon: CheckSquare, path: "/tasks" },
    { name: "Projects", icon: FolderKanban, path: "/projects" },
    { name: "Calendar", icon: Calendar, path: "/calendar" },
    { name: "Team", icon: Users, path: "/team" },
    { name: "Reports", icon: BarChart2, path: "/reports" },
  ];

  return (
    <aside
      className={`bg-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ${isOpen ? "w-64" : "w-20"
        } lg:relative`}
    >
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-theme-purple">
            <span className="text-xl font-bold text-white"><img className="rounded-full" src="https://static.vecteezy.com/system/resources/previews/028/105/764/non_2x/task-manager-icon-free-vector.jpg" alt="Task-Manager-Logo" /></span>
          </div>
          {isOpen && <span className="text-xl font-bold text-theme-purple-dark">Task Manager</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <ChevronLeft size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${isOpen ? "" : "justify-center"
                }`}
            >
              <item.icon size={20} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="grid gap-0.5 text-sm">
              <div className="font-medium">{isLoading ? "Loading..." : user?.name || "Not logged in"}</div>
              <div className="text-xs text-muted-foreground">{isLoading ? "" : user?.email || ""}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
