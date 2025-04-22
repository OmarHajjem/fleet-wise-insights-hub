
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
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const maintenanceRecords = [
  {
    id: 1,
    vehicleId: "AZ-103",
    vehicleModel: "Renault Kangoo",
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

  const filteredMaintenance = maintenanceRecords.filter((record) => {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion de la maintenance</h1>
          <p className="text-muted-foreground">
            Gérer les opérations de maintenance et de réparation de la flotte
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Planifier une maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance planifiée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceRecords.filter((r) => r.status === "scheduled").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Prochaine: {maintenanceRecords.find((r) => r.status === "scheduled")?.date}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceRecords.filter((r) => r.status === "in_progress").length}
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
              {maintenanceRecords
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
          <CardTitle>Opérations de maintenance</CardTitle>
          <CardDescription>
            Historique et planification des opérations de maintenance
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
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {record.status === "scheduled" && (
                                  <DropdownMenuItem>Marquer comme en cours</DropdownMenuItem>
                                )}
                                {record.status === "in_progress" && (
                                  <DropdownMenuItem>Marquer comme terminée</DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Annuler
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
  );
}
