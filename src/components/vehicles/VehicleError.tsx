
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const VehicleError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="text-center text-red-500 mb-4">
          <X className="h-12 w-12 mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Erreur de chargement</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Une erreur s'est produite lors du chargement des véhicules. Veuillez réessayer.
        </p>
        <Button onClick={onRetry}>
          Réessayer
        </Button>
      </CardContent>
    </Card>
  );
};
