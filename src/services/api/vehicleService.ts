
import { Vehicle } from '@/types/vehicle';
import { axiosInstance, handleApiError, useRealApi } from './axios-config';
import { staticVehicles } from '@/utils/staticData';

// Interface pour les paramètres de requête
interface GetVehiclesParams {
  status?: string;
  driverId?: string;
  search?: string;
}

export const vehicleService = {
  // Récupérer tous les véhicules
  getVehicles: async (params?: GetVehiclesParams): Promise<Vehicle[]> => {
    // Utiliser l'API réelle ou les données statiques selon le flag
    if (useRealApi()) {
      try {
        const response = await axiosInstance.get('/vehicles', { 
          params 
        });
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', handleApiError(error));
        // Fallback aux données statiques en cas d'erreur
        return staticVehicles;
      }
    }
    
    // Utiliser les données statiques et simuler un délai réseau
    return new Promise(resolve => {
      setTimeout(() => {
        // Filtrer les véhicules statiques si des paramètres sont fournis
        let filteredVehicles = [...staticVehicles];
        
        if (params?.status) {
          filteredVehicles = filteredVehicles.filter(v => v.status === params.status);
        }
        
        if (params?.driverId) {
          filteredVehicles = filteredVehicles.filter(v => v.driver_id === params.driverId);
        }
        
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredVehicles = filteredVehicles.filter(v => 
            v.license_plate.toLowerCase().includes(searchLower) || 
            v.model.toLowerCase().includes(searchLower)
          );
        }
        
        resolve(filteredVehicles);
      }, 300);
    });
  },
  
  // Récupérer un véhicule par ID
  getVehicleById: async (id: string): Promise<Vehicle | undefined> => {
    if (useRealApi()) {
      try {
        const response = await axiosInstance.get(`/vehicles/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Erreur lors de la récupération du véhicule ${id}:`, handleApiError(error));
        // Fallback aux données statiques en cas d'erreur
        return staticVehicles.find(v => v.id === id);
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(staticVehicles.find(v => v.id === id));
      }, 200);
    });
  },
  
  // Ajouter un véhicule
  addVehicle: async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    if (useRealApi()) {
      try {
        const response = await axiosInstance.post('/vehicles', vehicleData);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'ajout du véhicule:', handleApiError(error));
        throw error;
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Simuler l'ajout d'un véhicule
        const newVehicle = {
          id: `v${Date.now()}`,
          license_plate: vehicleData.license_plate || '',
          model: vehicleData.model || '',
          year: vehicleData.year || new Date().getFullYear(),
          status: vehicleData.status || 'active',
          driver_id: vehicleData.driver_id || null,
          fuel_level: vehicleData.fuel_level || 100,
          last_maintenance: new Date().toISOString(),
          // Autres propriétés par défaut
          location: { lat: 48.8566, lng: 2.3522 },
        } as Vehicle;
        
        resolve(newVehicle);
      }, 500);
    });
  },
  
  // Mettre à jour un véhicule
  updateVehicle: async (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    if (useRealApi()) {
      try {
        const response = await axiosInstance.put(`/vehicles/${id}`, vehicleData);
        return response.data;
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du véhicule ${id}:`, handleApiError(error));
        throw error;
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        const vehicle = staticVehicles.find(v => v.id === id);
        if (!vehicle) {
          throw new Error(`Véhicule avec l'ID ${id} introuvable`);
        }
        
        // Simuler la mise à jour
        const updatedVehicle = { ...vehicle, ...vehicleData };
        resolve(updatedVehicle as Vehicle);
      }, 300);
    });
  },
  
  // Supprimer un véhicule
  deleteVehicle: async (id: string): Promise<boolean> => {
    if (useRealApi()) {
      try {
        await axiosInstance.delete(`/vehicles/${id}`);
        return true;
      } catch (error) {
        console.error(`Erreur lors de la suppression du véhicule ${id}:`, handleApiError(error));
        throw error;
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
};
