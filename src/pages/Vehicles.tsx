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
import { Car, Plus, Search, Filter, MoreHorizontal, X, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { staticVehicles, staticUsers, vehicleService } from "@/utils/staticData";

const statusLabels = {
  active: { label: "En service", color: "bg-green-100 text-green-800" },
  maintenance: { label: "En maintenance", color: "bg-amber-100 text-amber-800" },
  inactive: { label: "Hors service", color: "bg-red-100 text-red-800" },
};

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newVehicle, setNewVehicle] = useState({
    license_plate: "",
    model: "",
    year: new Date().getFullYear(),
    driver_id: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const { role, isLoading: roleLoading } = useUserRole();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const canEdit = isAdmin || isManager;
  
  const handleAddVehicle = async () => {
    if (!newVehicle.license_plate || !newVehicle.model) {
      toast({
        title: "Information manquante",
        description: "L'immatriculation et le modèle sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPending(true);
    try {
      const vehicleData = {
        license_plate: newVehicle.license_plate,
        model: newVehicle.model,
        year: newVehicle.year,
        status: 'active' as const,
        driver_id: newVehicle.driver_id || null,
        fuel_level: 100,
      };
      
      await vehicleService.addVehicle(vehicleData);
      
      setNewVehicle({
        license_plate: "",
        model: "",
        year: new Date().getFullYear(),
        driver_id: "",
      });
      setDialogOpen(false);
      
      toast({
        title: "Véhicule ajouté",
        description: `Le véhicule a été ajouté avec succès.`,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du véhicule:", error);
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter le véhicule. ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };
  
  const handleUpdateVehicleStatus = async (id: string, status: "active" | "maintenance" | "inactive") => {
    try {
      await vehicleService.updateVehicleStatus(id, status);
      toast({
        title: "Statut mis à jour",
        description: "Le statut du véhicule a été mis à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le statut. ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVehicle({
      ...newVehicle,
      [name]: name === "year" ? parseInt(value) || new Date().getFullYear() : value,
    });
  };

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return "Non assigné";
    const driver = staticUsers.find(d => d.id === driverId);
    return driver ? `${driver.firstName || ''} ${driver.lastName || ''}`.trim() : "Non assigné";
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };
  
  const filteredVehicles = staticVehicles.filter(
    (vehicle) =>
      vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDriverName(vehicle.driver_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Gestion des erreurs
  if (false) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des véhicules</h1>
            <p className="text-muted-foreground">
              Gérer votre flotte de véhicules et leurs informations.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center text-red-500 mb-4">
              <X className="h-12 w-12 mx-auto mb-2" />
              <h2 className="text-xl font-semibold">Erreur de chargement</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Une erreur s'est produite lors du chargement des véhicules. Veuillez réessayer.
            </p>
            <Button onClick={() => {}}>
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des véhicules</h1>
          <p className="text-muted-foreground">
            Gérer votre flotte de véhicules et leurs informations.
          </p>
        </div>
        {canEdit && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un véhicule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                <DialogDescription>
                  Entrez les détails du véhicule à ajouter à la flotte
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="licensePlate" className="text-right">
                    Immatriculation
                  </Label>
                  <Input
                    id="licensePlate"
                    name="license_plate"
                    value={newVehicle.license_plate}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="AB-123-CD"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">
                    Modèle
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    value={newVehicle.model}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Renault Kangoo"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Année
                  </Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={newVehicle.year}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="driver" className="text-right">
                    Conducteur
                  </Label>
                  <select
                    id="driver"
                    name="driver_id"
                    value={newVehicle.driver_id}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Non assigné</option>
                    {staticUsers?.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {`${driver.firstName || ''} ${driver.lastName || ''}`.trim() || "Utilisateur " + driver.id.substring(0, 8)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddVehicle} disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Ajout...
                    </>
                  ) : (
                    "Ajouter"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Aperçu de la flotte</CardTitle>
          <CardDescription>
            Vue d'ensemble des {isLoading ? "..." : staticVehicles?.length || 0} véhicules de votre flotte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un véhicule..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
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
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Conducteur</TableHead>
                  <TableHead>Dernière maintenance</TableHead>
                  <TableHead>Niveau carburant</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Loader className="h-8 w-8 mb-2 animate-spin" />
                        <p>Chargement des véhicules...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="font-medium">{vehicle.license_plate}</div>
                      </TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            statusLabels[vehicle.status].color
                          }`}
                        >
                          {statusLabels[vehicle.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{getDriverName(vehicle.driver_id)}</TableCell>
                      <TableCell>{formatDate(vehicle.last_maintenance)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                vehicle.fuel_level < 20
                                  ? "bg-red-500"
                                  : vehicle.fuel_level < 50
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${vehicle.fuel_level}%` }}
                            />
                          </div>
                          <span className="text-xs">{vehicle.fuel_level}%</span>
                        </div>
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
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            {canEdit && <DropdownMenuItem>Modifier</DropdownMenuItem>}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/maintenance?vehicle=${vehicle.id}`)}>
                              Planifier maintenance
                            </DropdownMenuItem>
                            {canEdit && (
                              <>
                                <DropdownMenuSeparator />
                                {vehicle.status === 'active' && (
                                  <DropdownMenuItem 
                                    className="text-amber-600"
                                    onClick={() => handleUpdateVehicleStatus(vehicle.id, 'maintenance')}
                                  >
                                    Mettre en maintenance
                                  </DropdownMenuItem>
                                )}
                                {vehicle.status === 'maintenance' && (
                                  <DropdownMenuItem 
                                    className="text-green-600"
                                    onClick={() => handleUpdateVehicleStatus(vehicle.id, 'active')}
                                  >
                                    Remettre en service
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleUpdateVehicleStatus(vehicle.id, 'inactive')}
                                >
                                  {vehicle.status === 'inactive' ? "Déjà désactivé" : "Désactiver"}
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
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Car className="h-8 w-8 mb-2 opacity-50" />
                        <p>Aucun véhicule trouvé</p>
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
