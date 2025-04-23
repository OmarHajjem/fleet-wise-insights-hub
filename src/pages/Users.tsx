import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, MoreHorizontal, Plus, Search, Users as UsersIcon, Loader, AlertTriangle } from "lucide-react";
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AuthCheck from "@/components/auth/AuthCheck";

// Types
interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'admin' | 'manager' | 'driver' | 'mechanic';
  status: 'active' | 'inactive';
  assignedVehicle: string | null;
  lastActive: string | null;
}

const roleLabels = {
  driver: { label: "Conducteur", color: "bg-blue-100 text-blue-800" },
  admin: { label: "Administrateur", color: "bg-purple-100 text-purple-800" },
  manager: { label: "Gestionnaire", color: "bg-indigo-100 text-indigo-800" },
  mechanic: { label: "Mécanicien", color: "bg-amber-100 text-amber-800" },
};

const statusLabels = {
  active: { label: "Actif", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactif", color: "bg-gray-100 text-gray-800" },
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { role, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const canManageUsers = isAdmin || isManager;

  // Fetch users
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

        // Map user data
        return authUsers.users.map(user => {
          const profile = profiles?.find(p => p.id === user.id);
          const userRole = userRoles?.find(r => r.user_id === user.id);
          
          // Fix for error #1: Ensure the role is one of the allowed types or default to 'driver'
          const role: UserRole = (userRole?.role as UserRole) || 'driver';
          
          return {
            id: user.id,
            email: user.email || '',
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            role: role,
            status: user.banned ? 'inactive' : 'active',
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

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
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

  // Toggle user status mutation
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) => {
      if (active) {
        // Unban user - Fix for errors #2 and #3: Use 'ban' property instead of 'banned'
        const { data, error } = await supabase.auth.admin.updateUserById(userId, { ban: false });
        if (error) throw error;
        return data;
      } else {
        // Ban user - Fix for errors #2 and #3: Use 'ban' property instead of 'banned'
        const { data, error } = await supabase.auth.admin.updateUserById(userId, { ban: true });
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
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader className="h-8 w-8 mb-2 animate-spin" />
                        <p>Chargement des utilisateurs...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
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
                          className={`${roleLabels[user.role as keyof typeof roleLabels]?.color}`}
                        >
                          {roleLabels[user.role as keyof typeof roleLabels]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.assignedVehicle || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            statusLabels[user.status as keyof typeof statusLabels]?.color
                          }`}
                        >
                          {statusLabels[user.status as keyof typeof statusLabels]?.label}
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
                                      onClick={() => updateUserRoleMutation.mutate({ userId: user.id, role: 'admin' })}
                                      disabled={user.role === 'admin'}
                                    >
                                      Administrateur
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => updateUserRoleMutation.mutate({ userId: user.id, role: 'manager' })}
                                      disabled={user.role === 'manager'}
                                    >
                                      Gestionnaire
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => updateUserRoleMutation.mutate({ userId: user.id, role: 'mechanic' })}
                                      disabled={user.role === 'mechanic'}
                                    >
                                      Mécanicien
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => updateUserRoleMutation.mutate({ userId: user.id, role: 'driver' })}
                                      disabled={user.role === 'driver'}
                                    >
                                      Conducteur
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {isAdmin && (
                              <DropdownMenuItem 
                                className={user.status === 'active' ? "text-red-600" : "text-green-600"}
                                onClick={() => toggleUserStatusMutation.mutate({ 
                                  userId: user.id, 
                                  active: user.status !== 'active' 
                                })}
                              >
                                {user.status === 'active' ? "Désactiver le compte" : "Activer le compte"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <UsersIcon className="h-8 w-8 mb-2 opacity-50" />
                        <p>Aucun utilisateur trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
