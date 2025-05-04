
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";
import AuthCheck from "@/components/auth/AuthCheck";
import { UserTable } from "@/components/users/UserTable";
import { UserSearch } from "@/components/users/UserSearch";
import { staticUsers, roleService } from "@/utils/staticData";
import { User, UserRole } from "@/types/user";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const { role } = useUserRole();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const canManageUsers = isAdmin || isManager;
  const [isLoading, setIsLoading] = useState(false);

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await roleService.updateUserRole(userId, role as UserRole);
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été mis à jour avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle de l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = async (userId: string, active: boolean) => {
    try {
      await roleService.toggleUserStatus(userId, active);
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'utilisateur a été mis à jour avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = staticUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.assignedVehicle && user.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase()))
  ) as User[]; // Cast to User[] type since we know our data structure matches

  if (!canManageUsers) {
    return (
      <AuthCheck requiredRoles={['admin', 'manager']}>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground">
              Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
            </p>
          </div>
        </div>
      </AuthCheck>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérer les conducteurs et les administrateurs du système
          </p>
        </div>
        {isAdmin && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            {isLoading ? "Chargement..." : `${filteredUsers.length || 0} utilisateurs enregistrés dans le système`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="rounded-md border">
            <UserTable
              users={filteredUsers}
              isLoading={isLoading}
              isAdmin={isAdmin}
              onUpdateRole={(userId, role) => updateUserRole(userId, role)}
              onToggleStatus={(userId, active) => toggleUserStatus(userId, active)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
