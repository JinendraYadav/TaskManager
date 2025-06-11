
import { AppShell } from "@/components/layout/AppShell";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import TasksPage from "./TasksPage";
import ProjectsPage from "./ProjectsPage";
import CalendarPage from "./CalendarPage";
import TeamPage from "./TeamPage";
import ReportsPage from "./ReportsPage";
import ProfilePage from "./ProfilePage";
import NotFound from "./NotFound";

const Index = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

export default Index;
