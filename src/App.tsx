
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={
            <AuthCheck requiredRoles={['admin', 'manager', 'mechanic']}>
              <Vehicles />
            </AuthCheck>
          } />
          <Route path="/users" element={
            <AuthCheck requiredRoles={['admin', 'manager']}>
              <Users />
            </AuthCheck>
          } />
          <Route path="/maintenance" element={
            <AuthCheck requiredRoles={['admin', 'manager', 'mechanic']}>
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
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
