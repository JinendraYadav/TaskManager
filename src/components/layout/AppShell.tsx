
import { useState } from "react";
import { SideBar } from "./SideBar";
import { Header } from "./Header";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Add the toggleSidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
