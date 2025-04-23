
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import AuthCheck from "@/components/auth/AuthCheck";
import { UserTable } from "@/components/users/UserTable";
import { UserSearch } from "@/components/users/UserSearch";
import { User, UserRole, UserStatus } from "@/types/user";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const canManageUsers = isAdmin || isManager;

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Fetch auth users
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        // Fetch profiles for additional data
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        if (profilesError) throw profilesError;

        // Fetch roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');
        if (rolesError) throw rolesError;

        // Define a type guard function to validate the role
        const isValidRole = (role: string): role is UserRole => {
          return ['admin', 'manager', 'driver', 'mechanic'].includes(role);
        };
        
        // Define a type guard function to validate the status
        const isValidStatus = (status: string): status is UserStatus => {
          return ['active', 'inactive'].includes(status);
        };
        
        // Map user data
        return authUsers.users.map(user => {
          const profile = profiles?.find(p => p.id === user.id);
          const userRole = userRoles?.find(r => r.user_id === user.id);
          
          // Ensure a valid role is always assigned
          let roleValue: UserRole = 'driver';
          
          if (userRole && typeof userRole.role === 'string' && isValidRole(userRole.role)) {
            roleValue = userRole.role;
          }
          
          // Ensure a valid status is always assigned
          let statusValue: UserStatus = user.banned ? 'inactive' : 'active';
          
          return {
            id: user.id,
            email: user.email || '',
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            role: roleValue,
            status: statusValue,
            assignedVehicle: null, // This would need to be fetched from vehicles table
            lastActive: user.last_sign_in_at
          };
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    enabled: canManageUsers
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle de l'utilisateur.",
        variant: "destructive"
      });
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) => {
      if (active) {
        const { data, error } = await supabase.auth.admin.updateUserById(userId, { 
          ban_duration: null 
        });
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.auth.admin.updateUserById(userId, { 
          ban_duration: '8760h' // Ban for 1 year (365 days)
        });
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'utilisateur a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'utilisateur.",
        variant: "destructive"
      });
    }
  });

  const filteredUsers = users?.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.assignedVehicle && user.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérer les conducteurs et les administrateurs du système
          </p>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="flex flex-col items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erreur lors du chargement des utilisateurs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Une erreur s'est produite lors du chargement des données. Veuillez réessayer.
              </p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
            {isLoading ? "Chargement..." : `${users?.length || 0} utilisateurs enregistrés dans le système`}
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
              onUpdateRole={(userId, role) => updateUserRoleMutation.mutate({ userId, role: role as UserRole })}
              onToggleStatus={(userId, active) => toggleUserStatusMutation.mutate({ userId, active })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
