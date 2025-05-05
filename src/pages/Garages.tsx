
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Building, MoreHorizontal, MapPin, Phone, Plus, Search } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import AuthCheck from "@/components/auth/AuthCheck";
import { FilterButton } from "@/components/common/FilterButton";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Définition du schéma de validation pour l'ajout d'un garage
const garageFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
  address: z.string().min(5, { message: "L'adresse doit être complète" }),
  phone: z.string().min(8, { message: "Le numéro de téléphone n'est pas valide" }),
  specialties: z.string().min(3, { message: "Veuillez ajouter au moins une spécialité" }),
  status: z.enum(["available", "full"]).default("available"),
});

const garages = [
  {
    id: 1,
    name: "AutoMécanique Paris",
    address: "23 Rue Nationale, 75013 Paris",
    phone: "01 42 65 87 34",
    specialties: ["électrique", "mécanique générale"],
    status: "available",
    vehiclesInService: 2,
  },
  {
    id: 2,
    name: "Toyota Service Lyon",
    address: "156 Avenue Berthelot, 69007 Lyon",
    phone: "04 72 73 38 90",
    specialties: ["Toyota", "hybride"],
    status: "available",
    vehiclesInService: 1,
  },
  {
    id: 3,
    name: "Garage Central Marseille",
    address: "45 Boulevard Michelet, 13009 Marseille",
    phone: "04 91 22 10 50",
    specialties: ["Peugeot", "diagnostics"],
    status: "available",
    vehiclesInService: 0,
  },
  {
    id: 4,
    name: "Auto Confort Lille",
    address: "78 Rue de Paris, 59000 Lille",
    phone: "03 20 52 48 65",
    specialties: ["climatisation", "Citroen"],
    status: "full",
    vehiclesInService: 3,
  },
  {
    id: 5,
    name: "Ford Service Bordeaux",
    address: "230 Avenue d'Arès, 33000 Bordeaux",
    phone: "05 56 24 12 34",
    specialties: ["Ford", "utilitaires"],
    status: "available",
    vehiclesInService: 1,
  },
];

export default function Garages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewGarageId, setViewGarageId] = useState<number | null>(null);
  const { role } = useUserRole();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isMechanic = role === 'mechanic';
  
  // Définir les flags de permission
  const canManage = isAdmin || isManager;
  const canAdd = isAdmin || isManager;
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;
  const canView = true; // Tous les rôles peuvent voir les détails
  const canScheduleMaintenance = isAdmin || isManager || isMechanic;

  // Options de filtre basées sur les spécialités disponibles et le statut
  const filterOptions = [
    { id: 'available', label: 'Disponible' },
    { id: 'full', label: 'Complet' },
    { id: 'électrique', label: 'Électrique' },
    { id: 'hybride', label: 'Hybride' },
    { id: 'diesel', label: 'Diesel' },
    { id: 'toyota', label: 'Toyota' },
    { id: 'ford', label: 'Ford' },
    { id: 'peugeot', label: 'Peugeot' },
    { id: 'citroen', label: 'Citroen' },
  ];

  const form = useForm<z.infer<typeof garageFormSchema>>({
    resolver: zodResolver(garageFormSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      specialties: "",
      status: "available",
    },
  });

  const handleAddGarage = (values: z.infer<typeof garageFormSchema>) => {
    // Simulation d'ajout de garage
    toast({
      title: "Garage ajouté",
      description: `${values.name} a été ajouté avec succès.`,
    });
    setShowAddDialog(false);
    form.reset();
  };

  const handleDeleteGarage = (garageId: number) => {
    // Simulation de suppression
    toast({
      title: "Partenariat supprimé",
      description: "Le partenariat avec ce garage a été supprimé avec succès.",
    });
  };

  const handleUpdateStatus = (garageId: number, newStatus: string) => {
    // Simulation de mise à jour du statut
    toast({
      title: "Statut mis à jour",
      description: `Le statut du garage a été mis à jour avec succès.`,
    });
  };

  // Appliquer les filtres
  const handleFilter = (selectedFilters: string[]) => {
    setActiveFilters(selectedFilters);
  };

  // Calculer les garages filtrés en fonction de la recherche et des filtres
  const filteredGarages = garages.filter(
    (garage) => {
      // Appliquer le filtre de recherche
      const matchesSearch = 
        garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garage.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Si aucun filtre actif, retourner le résultat de la recherche
      if (activeFilters.length === 0) return matchesSearch;
      
      // Appliquer les filtres
      const matchesFilters = 
        (activeFilters.includes(garage.status)) || 
        garage.specialties.some(spec => 
          activeFilters.includes(spec.toLowerCase())
        );
      
      // Les deux conditions doivent être vraies
      return matchesSearch && matchesFilters;
    }
  );

  // Trouver un garage par ID pour afficher ses détails
  const viewGarage = viewGarageId ? garages.find(g => g.id === viewGarageId) : null;

  return (
    <AuthCheck requiredRoles={['admin', 'manager', 'mechanic']}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des garages</h1>
            <p className="text-muted-foreground">
              Liste des garages partenaires pour la maintenance de vos véhicules
            </p>
          </div>
          {canAdd && (
            <Button className="flex items-center gap-2" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4" />
              Ajouter un garage
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Garages partenaires</CardTitle>
            <CardDescription>
              {garages.length} garages partenaires disponibles dans notre réseau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un garage..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <FilterButton 
                options={filterOptions}
                activeFilters={activeFilters}
                onFilter={handleFilter}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Spécialités</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Véhicules en service</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGarages.length > 0 ? (
                    filteredGarages.map((garage) => (
                      <TableRow key={garage.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{garage.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {garage.address}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {garage.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {garage.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              garage.status === "available"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }
                          >
                            {garage.status === "available" ? "Disponible" : "Complet"}
                          </Badge>
                        </TableCell>
                        <TableCell>{garage.vehiclesInService}</TableCell>
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
                              {canView && (
                                <DropdownMenuItem onClick={() => setViewGarageId(garage.id)}>
                                  Voir les détails
                                </DropdownMenuItem>
                              )}
                              {canEdit && (
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {canScheduleMaintenance && (
                                <DropdownMenuItem onClick={() => {
                                  toast({
                                    title: "Maintenance planifiée",
                                    description: `Une maintenance a été planifiée au garage ${garage.name}.`
                                  });
                                }}>
                                  Planifier une maintenance
                                </DropdownMenuItem>
                              )}
                              {canDelete && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteGarage(garage.id)}
                                  >
                                    Supprimer le partenariat
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Building className="h-8 w-8 mb-2 opacity-50" />
                          <p>Aucun garage trouvé</p>
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

      {/* Dialog pour ajouter un garage */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un garage partenaire</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouveau garage partenaire.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddGarage)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du garage</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du garage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse complète" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spécialités</FormLabel>
                    <FormControl>
                      <Input placeholder="Spécialités (séparées par des virgules)" {...field} />
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

      {/* Dialog pour voir les détails d'un garage */}
      <Dialog open={!!viewGarageId} onOpenChange={() => setViewGarageId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du garage</DialogTitle>
          </DialogHeader>
          {viewGarage && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Nom</h3>
                <p>{viewGarage.name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p>{viewGarage.address}</p>
              </div>
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <p>{viewGarage.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold">Spécialités</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {viewGarage.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Statut</h3>
                <Badge
                  variant="outline"
                  className={
                    viewGarage.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {viewGarage.status === "available" ? "Disponible" : "Complet"}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Véhicules en service</h3>
                <p>{viewGarage.vehiclesInService}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthCheck>
  );
}
