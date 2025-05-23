
import React from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { vehicleService } from "@/utils/staticData";
import { toast } from "@/hooks/use-toast";
import { useDialog } from "@/hooks/useDialog";

type VehicleTableActionsProps = {
  vehicleId: string;
  vehicleStatus: "active" | "maintenance" | "inactive";
  canEdit: boolean;
  canDelete?: boolean;
  canView?: boolean;
  canMaintain?: boolean;
};

export const VehicleTableActions = ({
  vehicleId,
  vehicleStatus,
  canEdit,
  canDelete = false,
  canView = true,
  canMaintain = false,
}: VehicleTableActionsProps) => {
  const navigate = useNavigate();
  const { openDialog } = useDialog();

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

  const handleViewDetails = () => {
    toast({
      title: "Détails du véhicule",
      description: `Affichage des détails du véhicule ${vehicleId}`,
    });
    // Dans une implémentation réelle, cela pourrait ouvrir une modal ou naviguer vers une page de détails
  };

  const handleEditVehicle = () => {
    toast({
      title: "Modification du véhicule",
      description: `Édition du véhicule ${vehicleId}`,
    });
    // Dans une implémentation réelle, cela pourrait ouvrir une modal d'édition
  };

  return (
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
          <DropdownMenuItem onClick={handleViewDetails}>
            Voir les détails
          </DropdownMenuItem>
        )}
        
        {canEdit && (
          <DropdownMenuItem onClick={handleEditVehicle}>
            Modifier
          </DropdownMenuItem>
        )}
        
        {(canEdit || canMaintain) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/maintenance?vehicle=${vehicleId}`)}>
              Planifier maintenance
            </DropdownMenuItem>
          </>
        )}
        
        {canEdit && (
          <>
            <DropdownMenuSeparator />
            {vehicleStatus === 'active' && (
              <DropdownMenuItem 
                className="text-amber-600"
                onClick={() => handleUpdateVehicleStatus(vehicleId, 'maintenance')}
              >
                Mettre en maintenance
              </DropdownMenuItem>
            )}
            {vehicleStatus === 'maintenance' && (
              <DropdownMenuItem 
                className="text-green-600"
                onClick={() => handleUpdateVehicleStatus(vehicleId, 'active')}
              >
                Remettre en service
              </DropdownMenuItem>
            )}
          </>
        )}
        
        {canDelete && (
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => handleUpdateVehicleStatus(vehicleId, 'inactive')}
          >
            {vehicleStatus === 'inactive' ? "Déjà désactivé" : "Désactiver"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
