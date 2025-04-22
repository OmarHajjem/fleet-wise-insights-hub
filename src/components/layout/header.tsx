
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import UserMenu from "@/components/auth/UserMenu";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <MenuIcon className="h-6 w-6" />
      </Button>
      <div className="flex-1">
        {/* Contenu au centre du header si nécessaire */}
      </div>
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}
