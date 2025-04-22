
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background">
      <TooltipProvider delayDuration={0}>
        <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      </TooltipProvider>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
