
import React, { useState } from "react";
import { FilterButton } from "@/components/common/FilterButton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilter?: (selectedFilters: string[]) => void;
}

export function UserFilter({ searchTerm, onSearchChange, onFilter }: UserFilterProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Options de filtre pour les utilisateurs
  const filterOptions = [
    { id: 'active', label: 'Actif' },
    { id: 'inactive', label: 'Inactif' },
    { id: 'admin', label: 'Administrateur' },
    { id: 'manager', label: 'Gestionnaire' },
    { id: 'driver', label: 'Conducteur' },
    { id: 'mechanic', label: 'Mécanicien' },
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
          placeholder="Rechercher un utilisateur..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <FilterButton 
        options={filterOptions}
        activeFilters={activeFilters}
        onFilter={handleFilter}
      />
    </div>
  );
}
