
import { User, roleLabels, statusLabels } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Loader, Users as UsersIcon } from "lucide-react";
import { UserActionsMenu } from "./UserActionsMenu";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  isAdmin: boolean;
  onUpdateRole: (userId: string, role: string) => void;
  onToggleStatus: (userId: string, active: boolean) => void;
}

export function UserTable({ users, isLoading, isAdmin, onUpdateRole, onToggleStatus }: UserTableProps) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader className="h-8 w-8 mb-2 animate-spin" />
            <p>Chargement des utilisateurs...</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (!users.length) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <UsersIcon className="h-8 w-8 mb-2 opacity-50" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Véhicule assigné</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Dernière activité</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {user.firstName && user.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                      : user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : "Utilisateur"}
                  </div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`${roleLabels[user.role]?.color}`}
              >
                {roleLabels[user.role]?.label}
              </Badge>
            </TableCell>
            <TableCell>{user.assignedVehicle || "-"}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`${statusLabels[user.status]?.color}`}
              >
                {statusLabels[user.status]?.label}
              </Badge>
            </TableCell>
            <TableCell>
              {user.lastActive 
                ? new Date(user.lastActive).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : "Jamais"}
            </TableCell>
            <TableCell>
              <UserActionsMenu 
                user={user}
                isAdmin={isAdmin}
                onUpdateRole={onUpdateRole}
                onToggleStatus={onToggleStatus}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
