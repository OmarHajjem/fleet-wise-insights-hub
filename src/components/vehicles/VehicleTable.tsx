
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Car, Loader } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { VehicleStatus } from "./VehicleStatus";
import { VehicleFuelLevel } from "./VehicleFuelLevel";
import { VehicleTableActions } from "./VehicleTableActions";
import { staticUsers } from "@/utils/staticData";

type Vehicle = {
  id: string;
  license_plate: string;
  model: string;
  year: number;
  status: "active" | "maintenance" | "inactive";
  driver_id: string | null;
  last_maintenance: string | null;
  fuel_level: number;
};

type VehicleTableProps = {
  vehicles: Vehicle[];
  isLoading: boolean;
  isDriver: boolean;
  canEdit: boolean;
  canDelete?: boolean;
  canView?: boolean;
  canMaintain?: boolean;
};

export const VehicleTable = ({
  vehicles,
  isLoading,
  isDriver,
  canEdit,
  canDelete = false,
  canView = true,
  canMaintain = false,
}: VehicleTableProps) => {
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

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={isDriver ? 7 : 8} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader className="h-8 w-8 mb-2 animate-spin" />
            <p>Chargement des véhicules...</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (vehicles.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={isDriver ? 7 : 8} className="h-24 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Car className="h-8 w-8 mb-2 opacity-50" />
            <p>Aucun véhicule trouvé</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {vehicles.map((vehicle) => (
        <TableRow key={vehicle.id}>
          <TableCell>
            <div className="font-medium">{vehicle.license_plate}</div>
          </TableCell>
          <TableCell>{vehicle.model}</TableCell>
          <TableCell>{vehicle.year}</TableCell>
          <TableCell>
            <VehicleStatus status={vehicle.status} />
          </TableCell>
          {!isDriver && <TableCell>{getDriverName(vehicle.driver_id)}</TableCell>}
          <TableCell>{formatDate(vehicle.last_maintenance)}</TableCell>
          <TableCell>
            <VehicleFuelLevel fuelLevel={vehicle.fuel_level} />
          </TableCell>
          <TableCell>
            <VehicleTableActions 
              vehicleId={vehicle.id} 
              vehicleStatus={vehicle.status} 
              canEdit={canEdit} 
              canDelete={canDelete}
              canView={canView}
              canMaintain={canMaintain}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
