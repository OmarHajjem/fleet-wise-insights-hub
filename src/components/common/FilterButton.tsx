
import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterButtonProps {
  options: FilterOption[];
  onFilter: (selectedIds: string[]) => void;
  activeFilters?: string[];
}

export const FilterButton = ({ 
  options, 
  onFilter, 
  activeFilters = [] 
}: FilterButtonProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(activeFilters);

  const handleFilterChange = (id: string, checked: boolean) => {
    const newFilters = checked 
      ? [...selectedFilters, id]
      : selectedFilters.filter(filterId => filterId !== id);
    
    setSelectedFilters(newFilters);
  };

  const applyFilters = () => {
    onFilter(selectedFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={activeFilters.length > 0 ? "bg-primary/10" : ""}>
          <Filter className="h-4 w-4" />
          {activeFilters.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4">
        <div className="space-y-4">
          <h4 className="font-medium">Filtres</h4>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`filter-${option.id}`} 
                  checked={selectedFilters.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleFilterChange(option.id, checked === true)
                  }
                />
                <Label htmlFor={`filter-${option.id}`}>{option.label}</Label>
              </div>
            ))}
          </div>
          <Button onClick={applyFilters} className="w-full">Appliquer</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
