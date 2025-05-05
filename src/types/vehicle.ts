
export type VehicleStatus = "active" | "maintenance" | "inactive";

export interface Vehicle {
  id: string;
  license_plate: string;
  model: string;
  year: number;
  status: VehicleStatus;
  driver_id: string | null;
  last_maintenance: string | null;
  fuel_level: number;
}
