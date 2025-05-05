
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
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
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { VehicleSearch } from "@/components/vehicles/VehicleSearch";
import { AddVehicleDialog } from "@/components/vehicles/AddVehicleDialog";
import { VehicleError } from "@/components/vehicles/VehicleError";
import { useVehicles } from "@/hooks/useVehicles";

export default function Vehicles() {
  const [isError, setIsError] = useState(false);
  const {
    searchTerm,
    filteredVehicles,
    userVehicles,
    handleSearch,
    handleFilter,
    isDriver,
    canEdit,
    canDelete,
    canView,
    canAdd,
    canMaintain,
    isLoading,
    currentUserId,
  } = useVehicles();

  if (isError) {
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
        <VehicleError onRetry={() => setIsError(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isDriver ? "Mes Véhicules" : "Gestion des véhicules"}
          </h1>
          <p className="text-muted-foreground">
            {isDriver 
              ? "Gérer vos véhicules assignés et leurs informations."
              : "Gérer votre flotte de véhicules et leurs informations."
            }
          </p>
        </div>
        {canAdd && (
          <AddVehicleDialog isDriver={isDriver} currentUserId={currentUserId}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {isDriver ? "Ajouter un véhicule" : "Ajouter un véhicule"}
            </Button>
          </AddVehicleDialog>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{isDriver ? "Mes véhicules" : "Aperçu de la flotte"}</CardTitle>
          <CardDescription>
            {isDriver 
              ? `Vue d'ensemble de vos ${isLoading ? "..." : filteredVehicles?.length || 0} véhicule(s) assigné(s)`
              : `Vue d'ensemble des ${isLoading ? "..." : userVehicles?.length || 0} véhicules de votre flotte`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleSearch 
            searchTerm={searchTerm} 
            onSearchChange={handleSearch} 
            onFilter={handleFilter}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Statut</TableHead>
                  {!isDriver && <TableHead>Conducteur</TableHead>}
                  <TableHead>Dernière maintenance</TableHead>
                  <TableHead>Niveau carburant</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <VehicleTable 
                  vehicles={filteredVehicles}
                  isLoading={isLoading}
                  isDriver={isDriver}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  canView={canView}
                  canMaintain={canMaintain}
                />
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
