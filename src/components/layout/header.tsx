
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Redirects to relevant page based on search term
    if (searchTerm.toLowerCase().includes("vehicle") || searchTerm.toLowerCase().includes("véhicule")) {
      navigate("/vehicles");
    } else if (searchTerm.toLowerCase().includes("user") || searchTerm.toLowerCase().includes("utilisateur")) {
      navigate("/users");
    } else if (searchTerm.toLowerCase().includes("maintenance")) {
      navigate("/maintenance");
    } else if (searchTerm.toLowerCase().includes("garage")) {
      navigate("/garages");
    } else {
      // General search logic - default to vehicles for this demo
      navigate("/vehicles");
    }
    
    // Clear the search after navigating
    setSearchTerm("");
  };
  
  const markAllAsRead = () => {
    setNotificationCount(0);
  };
  
  return (
    <header className={`h-16 border-b flex items-center justify-between ${sidebarCollapsed ? 'px-4' : 'px-6'}`}>
      <div className="flex items-center gap-4 lg:gap-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {notificationCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Tout marquer comme lu
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Maintenance requise</span>
                <span className="text-xs text-muted-foreground">Véhicule AZ-103 nécessite une maintenance</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Alerte de carburant</span>
                <span className="text-xs text-muted-foreground">Véhicule TY-208 niveau de carburant bas</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Révision planifiée</span>
                <span className="text-xs text-muted-foreground">Véhicule KL-305 révision dans 7 jours</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center font-medium text-primary" onClick={() => navigate('/notifications')}>
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
