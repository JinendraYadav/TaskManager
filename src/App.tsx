
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, JSX } from "react";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Give the client a moment to initialize everything
    const timer = setTimeout(() => {
      setIsClientReady(true);
    }, 300); // Increased from 100ms for more initialization time
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !isClientReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary animate-spin rounded-full mx-auto mb-4"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const { isAuthenticated } = useAuth();

  // Add a small delay to ensure all scripts are loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
      console.log('App is ready to render');
    }, 500); // Increased from 300ms for more initialization time
    
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-primary animate-spin rounded-full mx-auto mb-4"></div>
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        } />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
