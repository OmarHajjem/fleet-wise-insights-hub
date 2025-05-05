
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
import { Badge } from "@/components/ui/badge";
import { Filter, MoreHorizontal, Building, Plus, Search, MapPin, Phone } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import AuthCheck from "@/components/auth/AuthCheck";

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
  const { role } = useUserRole();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isMechanic = role === 'mechanic';
  
  // Define permission flags
  const canManage = isAdmin || isManager;
  const canAdd = isAdmin || isManager;
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;
  const canView = true; // All roles can view details
  const canScheduleMaintenance = isAdmin || isManager || isMechanic;

  const filteredGarages = garages.filter(
    (garage) =>
      garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garage.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garage.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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
            <Button className="flex items-center gap-2">
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
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
                              {canView && <DropdownMenuItem>Voir les détails</DropdownMenuItem>}
                              {canEdit && <DropdownMenuItem>Modifier</DropdownMenuItem>}
                              <DropdownMenuSeparator />
                              {canScheduleMaintenance && (
                                <DropdownMenuItem>Planifier une maintenance</DropdownMenuItem>
                              )}
                              {canDelete && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
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
    </AuthCheck>
  );
}
