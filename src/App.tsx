
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Users from "./pages/Users";
import Maintenance from "./pages/Maintenance";
import Garages from "./pages/Garages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AuthCheck from "./components/auth/AuthCheck";
import { useState, useEffect } from "react";
import { authService } from "./utils/staticData";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("App: Checking authentication state...");
    
    const checkAuth = async () => {
      try {
        const { user } = await authService.getUser();
        console.log("App: User found:", user);
        setUser(user);
      } catch (error) {
        console.error("App: Error checking auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Setup auth state change listener
    const subscription = authService.onAuthStateChange((updatedUser) => {
      console.log("App: Auth state changed, user:", updatedUser);
      setUser(updatedUser);
      setLoading(false);
    });
    
    checkAuth();
    
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);
  
  console.log("App: Current state - loading:", loading, "user:", user);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
          
          {user ? (
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <AuthCheck>
                  <Dashboard />
                </AuthCheck>
              } />
              <Route path="/vehicles" element={
                <AuthCheck requiredRoles={['admin', 'manager', 'driver']}>
                  <Vehicles />
                </AuthCheck>
              } />
              <Route path="/users" element={
                <AuthCheck requiredRoles={['admin', 'manager']}>
                  <Users />
                </AuthCheck>
              } />
              <Route path="/maintenance" element={
                <AuthCheck requiredRoles={['admin', 'manager', 'mechanic', 'driver']}>
                  <Maintenance />
                </AuthCheck>
              } />
              <Route path="/garages" element={
                <AuthCheck requiredRoles={['admin', 'manager', 'mechanic']}>
                  <Garages />
                </AuthCheck>
              } />
              <Route path="/notifications" element={
                <AuthCheck>
                  <Notifications />
                </AuthCheck>
              } />
              <Route path="/settings" element={
                <AuthCheck requiredRoles={['admin']}>
                  <Settings />
                </AuthCheck>
              } />
              <Route path="/profile" element={
                <AuthCheck>
                  <Profile />
                </AuthCheck>
              } />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/auth" replace />} />
          )}
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
