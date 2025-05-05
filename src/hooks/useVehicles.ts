
import { useState, useMemo } from "react";
import { staticVehicles, staticUsers } from "@/utils/staticData";
import { useUserRole } from "./useUserRole";
import { Vehicle } from "@/types/vehicle";

export const useVehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { role, isLoading: roleLoading } = useUserRole();
  
  // Définir les permissions basées sur les rôles
  const isDriver = role === 'driver';
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isMechanic = role === 'mechanic';
  
  // Définir les permissions d'action selon les rôles
  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;
  const canView = true; // Tous les rôles peuvent voir les détails
  const canAdd = isAdmin || isManager;
  const canMaintain = isAdmin || isManager || isMechanic;
  
  // Récupérer l'ID du chauffeur connecté
  const userEmail = sessionStorage.getItem('userEmail') || '';
  const currentUserId = useMemo(() => 
    staticUsers.find(u => u.email === userEmail)?.id || '',
    [userEmail]
  );
  
  // Filtrer les véhicules selon le rôle
  const userVehicles = useMemo(() => 
    isDriver 
      ? staticVehicles.filter(v => v.driver_id === currentUserId)
      : staticVehicles,
    [isDriver, currentUserId]
  ) as Vehicle[];
  
  // Filtrer les véhicules selon le terme de recherche et les filtres actifs
  const filteredVehicles = useMemo(() => {
    const getDriverName = (driverId: string | null) => {
      if (!driverId) return "Non assigné";
      const driver = staticUsers.find(d => d.id === driverId);
      return driver ? `${driver.firstName || ''} ${driver.lastName || ''}`.trim() : "Non assigné";
    };
    
    return userVehicles.filter(vehicle => {
      // Filtre de recherche
      const matchesSearch = 
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDriverName(vehicle.driver_id).toLowerCase().includes(searchTerm.toLowerCase());
        
      // Si aucun filtre actif, retourner le résultat de la recherche
      if (activeFilters.length === 0) return matchesSearch;
      
      // Appliquer les filtres
      const matchesFilters = 
        activeFilters.includes(vehicle.status) || 
        (activeFilters.includes('low-fuel') && vehicle.fuel_level < 30) ||
        (vehicle.model.toLowerCase().includes('électrique') && activeFilters.includes('electric')) ||
        (vehicle.model.toLowerCase().includes('diesel') && activeFilters.includes('diesel'));
      
      // Les deux conditions doivent être vraies
      return matchesSearch && matchesFilters;
    });
  }, [userVehicles, searchTerm, activeFilters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (filters: string[]) => {
    setActiveFilters(filters);
  };

  return {
    searchTerm,
    filteredVehicles,
    userVehicles,
    handleSearch,
    handleFilter,
    activeFilters,
    isDriver,
    isAdmin,
    isManager,
    isMechanic,
    canEdit,
    canDelete,
    canView,
    canAdd,
    canMaintain,
    roleLoading,
    currentUserId,
    isLoading: false,
  };
};
