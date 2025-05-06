
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";
import AuthCheck from "@/components/auth/AuthCheck";
import { UserTable } from "@/components/users/UserTable";
import { UserFilter } from "@/components/users/UserFilter";
import { staticUsers, roleService, usersData, vehiclesData, garagesData } from "@/utils/staticData";
import { User, UserRole } from "@/types/user";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialog } from "@/hooks/useDialog";

// Schéma de validation pour l'ajout d'un utilisateur
const userFormSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  role: z.enum(['admin', 'manager', 'driver', 'mechanic'], {
    required_error: "Veuillez sélectionner un rôle",
  }),
});

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { role } = useUserRole();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const canManageUsers = isAdmin || isManager;
  const [isLoading, setIsLoading] = useState(false);
  const { dialogType, dialogData, isDialogOpen, openDialog, closeDialog } = useDialog();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "driver",
    },
  });

  const handleAddUser = (values: z.infer<typeof userFormSchema>) => {
    toast({
      title: "Utilisateur ajouté",
      description: `${values.firstName} ${values.lastName} a été ajouté en tant que ${values.role}.`,
    });
    closeDialog();
    form.reset();
  };

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

  // Filtrer les utilisateurs selon le terme de recherche et les filtres
  const filteredUsers = staticUsers.filter(user => {
    // Filtre de recherche
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.assignedVehicle && user.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Si aucun filtre actif, retourner le résultat de la recherche
    if (activeFilters.length === 0) return matchesSearch;
    
    // Appliquer les filtres
    const matchesFilters = 
      activeFilters.includes(user.status) || 
      activeFilters.includes(user.role);
    
    // Les deux conditions doivent être vraies
    return matchesSearch && matchesFilters;
  }) as User[]; 

  const handleFilter = (filters: string[]) => {
    setActiveFilters(filters);
  };

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
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button className="flex items-center gap-2" onClick={() => openDialog('add')}>
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            {isLoading ? "Chargement..." : `${filteredUsers.length || 0} utilisateurs enregistrés dans le système`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilter={handleFilter}
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

      {/* Dialogue pour ajouter un utilisateur */}
      <Dialog open={isDialogOpen && dialogType === 'add'} onOpenChange={() => dialogType === 'add' && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire pour ajouter un nouvel utilisateur au système.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemple.fr" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="driver">Conducteur</option>
                        <option value="mechanic">Mécanicien</option>
                        <option value="manager">Gestionnaire</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
