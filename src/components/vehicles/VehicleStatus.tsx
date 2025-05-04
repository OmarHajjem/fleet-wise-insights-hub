
import { Badge } from "@/components/ui/badge";

type VehicleStatusProps = {
  status: "active" | "maintenance" | "inactive";
};

export const statusLabels = {
  active: { label: "En service", color: "bg-green-100 text-green-800" },
  maintenance: { label: "En maintenance", color: "bg-amber-100 text-amber-800" },
  inactive: { label: "Hors service", color: "bg-red-100 text-red-800" },
};

export const VehicleStatus = ({ status }: VehicleStatusProps) => {
  return (
    <Badge variant="outline" className={`${statusLabels[status].color}`}>
      {statusLabels[status].label}
    </Badge>
  );
};
