
import React, { useState } from "react";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { staticUsers, vehicleService } from "@/utils/staticData";

type AddVehicleDialogProps = {
  isDriver: boolean;
  currentUserId: string;
  children: React.ReactNode;
};

export const AddVehicleDialog = ({
  isDriver,
  currentUserId,
  children,
}: AddVehicleDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    license_plate: "",
    model: "",
    year: new Date().getFullYear(),
    driver_id: "",
  });

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
        driver_id: isDriver ? currentUserId : newVehicle.driver_id || null,
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVehicle({
      ...newVehicle,
      [name]: name === "year" ? parseInt(value) || new Date().getFullYear() : value,
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
          {!isDriver && (
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
          )}
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
  );
};
