
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface UserActionsMenuProps {
  user: User;
  isAdmin: boolean;
  onUpdateRole: (userId: string, role: string) => void;
  onToggleStatus: (userId: string, active: boolean) => void;
}

export function UserActionsMenu({ user, isAdmin, onUpdateRole, onToggleStatus }: UserActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
        <DropdownMenuItem>Modifier</DropdownMenuItem>
        <DropdownMenuSeparator />
        {isAdmin && (
          <>
            <DropdownMenuItem>Changer le véhicule</DropdownMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full text-left px-2 py-1.5 text-sm">
                Changer le rôle
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onUpdateRole(user.id, 'admin')}
                  disabled={user.role === 'admin'}
                >
                  Administrateur
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateRole(user.id, 'manager')}
                  disabled={user.role === 'manager'}
                >
                  Gestionnaire
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateRole(user.id, 'mechanic')}
                  disabled={user.role === 'mechanic'}
                >
                  Mécanicien
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onUpdateRole(user.id, 'driver')}
                  disabled={user.role === 'driver'}
                >
                  Conducteur
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className={user.status === 'active' ? "text-red-600" : "text-green-600"}
              onClick={() => onToggleStatus(user.id, user.status !== 'active')}
            >
              {user.status === 'active' ? "Désactiver le compte" : "Activer le compte"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
