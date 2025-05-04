
import React from "react";

type VehicleFuelLevelProps = {
  fuelLevel: number;
};

export const VehicleFuelLevel = ({ fuelLevel }: VehicleFuelLevelProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${
            fuelLevel < 20
              ? "bg-red-500"
              : fuelLevel < 50
              ? "bg-amber-500"
              : "bg-green-500"
          }`}
          style={{ width: `${fuelLevel}%` }}
        />
      </div>
      <span className="text-xs">{fuelLevel}%</span>
    </div>
  );
};
