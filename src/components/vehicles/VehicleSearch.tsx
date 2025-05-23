
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterButton } from "@/components/common/FilterButton";

type VehicleSearchProps = {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilter?: (selectedFilters: string[]) => void;
};

export const VehicleSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onFilter 
}: VehicleSearchProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Options de filtre pour les véhicules
  const filterOptions = [
    { id: 'active', label: 'Actif' },
    { id: 'maintenance', label: 'En maintenance' },
    { id: 'inactive', label: 'Inactif' },
    { id: 'low-fuel', label: 'Carburant bas' },
    { id: 'electric', label: 'Électrique' },
    { id: 'diesel', label: 'Diesel' },
  ];

  const handleFilter = (selectedFilters: string[]) => {
    setActiveFilters(selectedFilters);
    if (onFilter) {
      onFilter(selectedFilters);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un véhicule..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <FilterButton 
        options={filterOptions}
        activeFilters={activeFilters}
        onFilter={handleFilter}
      />
    </div>
  );
};
