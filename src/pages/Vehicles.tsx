
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
import { Car, Plus, Search, Filter, MoreHorizontal, X } from "lucide-react";
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

const vehicles = [
  {
    id: 1,
    licensePlate: "AZ-103",
    model: "Renault Kangoo",
    year: 2020,
    status: "active",
    driver: "Jean Dupont",
    lastMaintenance: "15/03/2025",
    fuelLevel: 78,
  },
  {
    id: 2,
    licensePlate: "TY-208",
    model: "Toyota Corolla",
    year: 2022,
    status: "maintenance",
    driver: "Marie Lambert",
    lastMaintenance: "02/04/2025",
    fuelLevel: 15,
  },
  {
    id: 3,
    licensePlate: "KL-305",
    model: "Peugeot Partner",
    year: 2019,
    status: "active",
    driver: "Lucas Martin",
    lastMaintenance: "10/02/2025",
    fuelLevel: 65,
  },
  {
    id: 4,
    licensePlate: "PL-542",
    model: "Citroen Berlingo",
    year: 2021,
    status: "active",
    driver: "Sophie Dubois",
    lastMaintenance: "22/03/2025",
    fuelLevel: 45,
  },
  {
    id: 5,
    licensePlate: "RT-789",
    model: "Ford Transit",
    year: 2018,
    status: "inactive",
    driver: "Non assigné",
    lastMaintenance: "05/01/2025",
    fuelLevel: 0,
  },
];

const statusLabels = {
  active: { label: "En service", color: "bg-green-100 text-green-800" },
  maintenance: { label: "En maintenance", color: "bg-amber-100 text-amber-800" },
  inactive: { label: "Hors service", color: "bg-red-100 text-red-800" },
};

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehiclesList, setVehiclesList] = useState(vehicles);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    model: "",
    year: new Date().getFullYear(),
    driver: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleAddVehicle = () => {
    if (!newVehicle.licensePlate || !newVehicle.model) {
      toast({
        title: "Information manquante",
        description: "L'immatriculation et le modèle sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    const vehicle = {
      id: vehiclesList.length + 1,
      licensePlate: newVehicle.licensePlate,
      model: newVehicle.model,
      year: newVehicle.year,
      status: "active",
      driver: newVehicle.driver || "Non assigné",
      lastMaintenance: new Date().toLocaleDateString("fr-FR"),
      fuelLevel: 100,
    };
    
    setVehiclesList([...vehiclesList, vehicle]);
    setNewVehicle({
      licensePlate: "",
      model: "",
      year: new Date().getFullYear(),
      driver: "",
    });
    setDialogOpen(false);
    
    toast({
      title: "Véhicule ajouté",
      description: `${vehicle.model} (${vehicle.licensePlate}) a été ajouté avec succès.`,
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle({
      ...newVehicle,
      [name]: name === "year" ? parseInt(value) || new Date().getFullYear() : value,
    });
  };
  
  const filteredVehicles = vehiclesList.filter(
    (vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des véhicules</h1>
          <p className="text-muted-foreground">
            Gérer votre flotte de véhicules et leurs informations.
          </p>
        </div>
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
                  name="licensePlate"
                  value={newVehicle.licensePlate}
                  onChange={handleInputChange}
                  className="col-span-3"
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
                <Input
                  id="driver"
                  name="driver"
                  value={newVehicle.driver}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddVehicle}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Aperçu de la flotte</CardTitle>
          <CardDescription>
            Vue d'ensemble des {vehiclesList.length} véhicules de votre flotte
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
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div className="font-medium">{vehicle.licensePlate}</div>
                      </TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            statusLabels[vehicle.status as keyof typeof statusLabels].color
                          }`}
                        >
                          {statusLabels[vehicle.status as keyof typeof statusLabels].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.driver}</TableCell>
                      <TableCell>{vehicle.lastMaintenance}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                vehicle.fuelLevel < 20
                                  ? "bg-red-500"
                                  : vehicle.fuelLevel < 50
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${vehicle.fuelLevel}%` }}
                            />
                          </div>
                          <span className="text-xs">{vehicle.fuelLevel}%</span>
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
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Planifier maintenance</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Désactiver
                            </DropdownMenuItem>
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
