
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { role, isLoading } = useUserRole();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <MenuIcon className="h-6 w-6" />
      </Button>
      <div className="flex-1">
        {role && !isLoading && (
          <div className="flex items-center">
            {role === "admin" && (
              <Badge variant="destructive" className="mr-2">Mode Administrateur</Badge>
            )}
            {role === "manager" && (
              <Badge variant="default" className="mr-2">Mode Gestionnaire</Badge>
            )}
            {role === "mechanic" && (
              <Badge variant="secondary" className="mr-2">Mode Mécanicien</Badge>
            )}
            {role === "driver" && (
              <Badge variant="outline" className="mr-2">Mode Chauffeur</Badge>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}
