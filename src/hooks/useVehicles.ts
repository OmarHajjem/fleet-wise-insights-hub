
import { useState, useMemo } from "react";
import { staticVehicles, staticUsers } from "@/utils/staticData";
import { useUserRole } from "./useUserRole";
import { Vehicle } from "@/types/vehicle";

export const useVehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { role, isLoading: roleLoading } = useUserRole();
  const isDriver = role === 'driver';
  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const canEdit = isAdmin || isManager || isDriver;
  
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
  
  // Filtrer les véhicules selon le terme de recherche
  const filteredVehicles = useMemo(() => {
    const getDriverName = (driverId: string | null) => {
      if (!driverId) return "Non assigné";
      const driver = staticUsers.find(d => d.id === driverId);
      return driver ? `${driver.firstName || ''} ${driver.lastName || ''}`.trim() : "Non assigné";
    };
    
    return userVehicles.filter(
      (vehicle) =>
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDriverName(vehicle.driver_id).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userVehicles, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    searchTerm,
    filteredVehicles,
    userVehicles,
    handleSearch,
    isDriver,
    isAdmin,
    isManager,
    canEdit,
    roleLoading,
    currentUserId,
    isLoading: false,
  };
};
