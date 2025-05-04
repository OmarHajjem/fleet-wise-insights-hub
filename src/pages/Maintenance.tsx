
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
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Wrench,
  Car,
  CalendarDays,
  Loader,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/hooks/useUserRole";
import AuthCheck from "@/components/auth/AuthCheck";
import { staticVehicles, staticUsers } from "@/utils/staticData";
import { useSearchParams, useNavigate } from "react-router-dom";
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

const maintenanceRecords = [
  {
    id: 1,
    vehicleId: "AZ-103",
    vehicleModel: "Renault Kangoo",
    vehicleDbId: "v1",
    type: "preventive",
    description: "Changement d'huile et filtres",
    status: "scheduled",
    date: "25/04/2025",
    garage: "AutoMécanique Paris",
    estimatedCost: 120,
  },
  {
    id: 2,
    vehicleId: "TY-208",
    vehicleModel: "Toyota Corolla",
    vehicleDbId: "v2",
    type: "corrective",
    description: "Remplacement des plaquettes de frein",
    status: "in_progress",
    date: "22/04/2025",
    garage: "Toyota Service Lyon",
    estimatedCost: 250,
  },
  {
    id: 3,
    vehicleId: "KL-305",
    vehicleModel: "Peugeot Partner",
    vehicleDbId: "v3",
    type: "preventive",
    description: "Révision annuelle",
    status: "scheduled",
    date: "03/05/2025",
    garage: "Garage Central Marseille",
    estimatedCost: 180,
  },
  {
    id: 4,
    vehicleId: "PL-542",
    vehicleModel: "Citroen Berlingo",
    vehicleDbId: "v4",
    type: "corrective",
    description: "Réparation climatisation",
    status: "completed",
    date: "15/04/2025",
    garage: "Auto Confort Lille",
    estimatedCost: 320,
    actualCost: 290,
  },
  {
    id: 5,
    vehicleId: "RT-789",
    vehicleModel: "Ford Transit",
    vehicleDbId: "v5",
    type: "regular",
    description: "Vidange + contrôle technique",
    status: "completed",
    date: "10/04/2025",
    garage: "Ford Service Bordeaux",
    estimatedCost: 150,
    actualCost: 150,
  },
];

const maintenanceTypeLabels = {
  preventive: { label: "Préventive", color: "bg-blue-100 text-blue-800" },
  corrective: { label: "Corrective", color: "bg-amber-100 text-amber-800" },
  regular: { label: "Régulière", color: "bg-green-100 text-green-800" },
};

const maintenanceStatusLabels = {
  scheduled: { label: "Planifiée", color: "bg-purple-100 text-purple-800" },
  in_progress: { label: "En cours", color: "bg-amber-100 text-amber-800" },
  completed: { label: "Terminée", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-800" },
};

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  
  const vehicleParam = searchParams.get('vehicle');

  const { role } = useUserRole();
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isMechanic = role === 'mechanic';
  const isDriver = role === 'driver';
  const canManage = isAdmin || isManager;
  const canUpdateStatus = isAdmin || isManager || isMechanic;

  // Récupérer l'ID du chauffeur connecté (stocké dans sessionStorage)
  const userEmail = sessionStorage.getItem('userEmail') || '';
  const currentUserId = staticUsers.find(u => u.email === userEmail)?.id || '';
  
  // Récupérer les véhicules du chauffeur connecté
  const driverVehicles = isDriver
    ? staticVehicles.filter(v => v.driver_id === currentUserId)
    : staticVehicles;
  
  const driverVehicleIds = driverVehicles.map(v => v.id);
  
  // Filtrer les maintenances selon le rôle
  const userMaintenances = isDriver
    ? maintenanceRecords.filter(record => driverVehicleIds.includes(record.vehicleDbId))
    : maintenanceRecords;

  const [newMaintenance, setNewMaintenance] = useState({
    vehicleDbId: vehicleParam || "",
    type: "regular",
    description: "",
    garage: "",
    date: "",
    estimatedCost: 0,
  });

  const filteredMaintenance = userMaintenances.filter((record) => {
    const matchesSearch =
      record.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.garage.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "scheduled") return matchesSearch && record.status === "scheduled";
    if (activeTab === "in_progress") return matchesSearch && record.status === "in_progress";
    if (activeTab === "completed") return matchesSearch && record.status === "completed";
    
    return matchesSearch;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMaintenance({
      ...newMaintenance,
      [name]: name === "estimatedCost" ? parseFloat(value) || 0 : value,
    });
  };

  const handleAddMaintenance = async () => {
    if (!newMaintenance.vehicleDbId || !newMaintenance.description || !newMaintenance.date || !newMaintenance.garage) {
      toast({
        title: "Information manquante",
        description: "Tous les champs sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPending(true);
    try {
      // Simuler l'ajout d'une maintenance
      setTimeout(() => {
        setDialogOpen(false);
        toast({
          title: "Maintenance planifiée",
          description: "La maintenance a été planifiée avec succès.",
        });
        setIsPending(false);
        
        // Réinitialiser le formulaire
        setNewMaintenance({
          vehicleDbId: "",
          type: "regular",
          description: "",
          garage: "",
          date: "",
          estimatedCost: 0,
        });
        
        // Redirection si on vient de la page véhicules
        if (vehicleParam) {
          navigate('/maintenance');
        }
      }, 1000);
      
    } catch (error: any) {
      console.error("Erreur lors de la planification de la maintenance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de planifier la maintenance.",
        variant: "destructive",
      });
      setIsPending(false);
    }
  };

  return (
    <AuthCheck>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isDriver ? "Mes Maintenances" : "Gestion de la maintenance"}
            </h1>
            <p className="text-muted-foreground">
              {isDriver 
                ? "Gérer les opérations de maintenance de vos véhicules"
                : "Gérer les opérations de maintenance et de réparation de la flotte"
              }
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Planifier une maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Planifier une maintenance</DialogTitle>
                <DialogDescription>
                  Entrez les détails de la maintenance à planifier
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicleDbId" className="text-right">
                    Véhicule
                  </Label>
                  <select
                    id="vehicleDbId"
                    name="vehicleDbId"
                    value={newMaintenance.vehicleDbId}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sélectionner un véhicule</option>
                    {driverVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.license_plate} - {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={newMaintenance.type}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="regular">Régulière</option>
                    <option value="preventive">Préventive</option>
                    <option value="corrective">Corrective</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={newMaintenance.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Description des travaux à effectuer"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newMaintenance.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="garage" className="text-right">
                    Garage
                  </Label>
                  <Input
                    id="garage"
                    name="garage"
                    value={newMaintenance.garage}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Nom du garage"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estimatedCost" className="text-right">
                    Coût estimé (€)
                  </Label>
                  <Input
                    id="estimatedCost"
                    name="estimatedCost"
                    type="number"
                    value={newMaintenance.estimatedCost}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddMaintenance} disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Planification...
                    </>
                  ) : (
                    "Planifier"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Maintenance planifiée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userMaintenances.filter((r) => r.status === "scheduled").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Prochaine: {userMaintenances.find((r) => r.status === "scheduled")?.date || "Aucune"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userMaintenances.filter((r) => r.status === "in_progress").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Véhicules actuellement en réparation
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Coût mensuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userMaintenances
                  .filter((r) => r.status === "completed")
                  .reduce((sum, record) => sum + (record.actualCost || 0), 0)}
                €
              </div>
              <p className="text-xs text-muted-foreground">
                Total des coûts de maintenance du mois
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              {isDriver ? "Mes opérations de maintenance" : "Opérations de maintenance"}
            </CardTitle>
            <CardDescription>
              {isDriver 
                ? "Historique et planification des opérations de maintenance de vos véhicules"
                : "Historique et planification des opérations de maintenance"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="scheduled">Planifiées</TabsTrigger>
                  <TabsTrigger value="in_progress">En cours</TabsTrigger>
                  <TabsTrigger value="completed">Terminées</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative w-[250px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Véhicule</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Garage</TableHead>
                        <TableHead>Coût</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaintenance.length > 0 ? (
                        filteredMaintenance.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">{record.vehicleId}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {record.vehicleModel}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${
                                  maintenanceTypeLabels[record.type as keyof typeof maintenanceTypeLabels]
                                    .color
                                }`}
                              >
                                {
                                  maintenanceTypeLabels[record.type as keyof typeof maintenanceTypeLabels]
                                    .label
                                }
                              </Badge>
                            </TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${
                                  maintenanceStatusLabels[
                                    record.status as keyof typeof maintenanceStatusLabels
                                  ].color
                                }`}
                              >
                                {
                                  maintenanceStatusLabels[
                                    record.status as keyof typeof maintenanceStatusLabels
                                  ].label
                                }
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                {record.date}
                              </div>
                            </TableCell>
                            <TableCell>{record.garage}</TableCell>
                            <TableCell>
                              {record.status === "completed"
                                ? `${record.actualCost}€`
                                : `~${record.estimatedCost}€`}
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
                                  {canManage && <DropdownMenuItem>Modifier</DropdownMenuItem>}
                                  <DropdownMenuSeparator />
                                  {canUpdateStatus && record.status === "scheduled" && (
                                    <DropdownMenuItem>Marquer comme en cours</DropdownMenuItem>
                                  )}
                                  {canUpdateStatus && record.status === "in_progress" && (
                                    <DropdownMenuItem>Marquer comme terminée</DropdownMenuItem>
                                  )}
                                  {canManage && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">
                                        Annuler
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
                              <Wrench className="h-8 w-8 mb-2 opacity-50" />
                              <p>Aucune opération de maintenance trouvée</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  );
}
