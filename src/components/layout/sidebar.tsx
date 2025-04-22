
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import {
  Car,
  Users,
  Wrench,
  Building,
  Bell,
  Settings,
  Home,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

export function Sidebar({
  className,
  isCollapsed = false,
  setIsCollapsed,
}: SidebarProps) {
  const location = useLocation();
  const [isCollapsedState, setIsCollapsedState] = useState(isCollapsed);
  
  const collapsed = setIsCollapsed ? isCollapsed : isCollapsedState;
  const toggleCollapsed = () => {
    if (setIsCollapsed) {
      setIsCollapsed(!collapsed);
    } else {
      setIsCollapsedState(!collapsed);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute right-0 top-4 -mr-4 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm transition-all",
          collapsed ? "-mr-3" : "-mr-4"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={toggleCollapsed}
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </Button>
      </div>

      <div
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground shadow-lg transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "h-screen"
        )}
      >
        <div className={cn(
          "flex h-16 items-center justify-center border-b border-sidebar-border",
          collapsed ? "p-2" : "px-6"
        )}>
          <div className="flex items-center gap-2">
            {!collapsed && <span className="text-lg font-semibold">FleetWise</span>}
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded bg-sidebar-accent",
              collapsed ? "w-8" : "w-8"
            )}>
              <Car className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-2 py-4">
            <nav className="grid gap-1">
              <SidebarItem 
                icon={Home} 
                label="Tableau de bord" 
                to="/" 
                isActive={location.pathname === "/"}
                collapsed={collapsed}
              />
              <SidebarItem 
                icon={Car} 
                label="Véhicules" 
                to="/vehicles" 
                isActive={location.pathname.startsWith("/vehicles")}
                collapsed={collapsed}
              />
              <SidebarItem 
                icon={Users} 
                label="Utilisateurs" 
                to="/users" 
                isActive={location.pathname.startsWith("/users")}
                collapsed={collapsed}
              />
              <SidebarItem 
                icon={Wrench} 
                label="Maintenance" 
                to="/maintenance" 
                isActive={location.pathname.startsWith("/maintenance")}
                collapsed={collapsed}
              />
              <SidebarItem 
                icon={Building} 
                label="Garages" 
                to="/garages" 
                isActive={location.pathname.startsWith("/garages")}
                collapsed={collapsed}
              />
              <SidebarItem 
                icon={Bell} 
                label="Notifications" 
                to="/notifications" 
                isActive={location.pathname.startsWith("/notifications")}
                collapsed={collapsed}
              />
              
              <Separator className="my-3 bg-sidebar-border" />
              
              <SidebarItem 
                icon={Settings} 
                label="Paramètres" 
                to="/settings" 
                isActive={location.pathname.startsWith("/settings")}
                collapsed={collapsed}
              />
            </nav>
          </div>
        </ScrollArea>
        
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
            <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-accent-foreground">AD</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin</span>
                <span className="text-xs text-sidebar-foreground/70">admin@fleetwise.io</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  collapsed?: boolean;
}

function SidebarItem({
  icon: Icon,
  label,
  to,
  isActive,
  collapsed,
}: SidebarItemProps) {
  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="border-sidebar-border">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      to={to}
      className={cn(
        "flex h-9 items-center rounded-md px-3",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="mr-2 h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
