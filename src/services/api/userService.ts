
import { User, UserRole, UserStatus } from '@/types/user';
import { axiosInstance, handleApiError, useRealApi } from './axios-config';
import { staticUsers } from '@/utils/staticData';

// Interface pour les paramètres de requête
interface GetUsersParams {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (params?: GetUsersParams): Promise<User[]> => {
    if (useRealApi()) {
      try {
        const response = await axiosInstance.get('/users', { params });
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', handleApiError(error));
        return staticUsers;
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Filtrer les utilisateurs statiques si des paramètres sont fournis
        let filteredUsers = [...staticUsers];
        
        if (params?.role) {
          filteredUsers = filteredUsers.filter(u => u.role === params.role);
        }
        
        if (params?.status) {
          filteredUsers = filteredUsers.filter(u => u.status === params.status);
        }
        
        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredUsers = filteredUsers.filter(u => 
            (u.firstName && u.firstName.toLowerCase().includes(searchLower)) || 
            (u.lastName && u.lastName.toLowerCase().includes(searchLower)) || 
            u.email.toLowerCase().includes(searchLower)
          );
        }
        
        resolve(filteredUsers);
      }, 300);
    });
  },
  
  // Récupérer un utilisateur par ID
  getUserById: async (id: string): Promise<User | undefined> => {
    if (useRealApi()) {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, handleApiError(error));
        return staticUsers.find(u => u.id === id);
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(staticUsers.find(u => u.id === id));
      }, 200);
    });
  },
  
  // Ajouter un utilisateur
  addUser: async (userData: Partial<User>): Promise<User> => {
    if (useRealApi()) {
      try {
        const response = await axiosInstance.post('/users', userData);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', handleApiError(error));
        throw error;
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Simuler l'ajout d'un utilisateur
        const newUser = {
          id: `u${Date.now()}`,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          role: userData.role || 'driver',
          status: userData.status || 'active',
          joinDate: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString(),
          // Autres propriétés par défaut
          avatar_url: null,
          vehicleId: null,
          assignedVehicle: null
        } as User;
        
        resolve(newUser);
      }, 500);
    });
  },
  
  // Mettre à jour le rôle d'un utilisateur
  updateUserRole: async (userId: string, role: UserRole): Promise<boolean> => {
    if (useRealApi()) {
      try {
        await axiosInstance.patch(`/users/${userId}/role`, { role });
        return true;
      } catch (error) {
        console.error(`Erreur lors de la mise à jour du rôle de l'utilisateur ${userId}:`, handleApiError(error));
        throw error;
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  },
  
  // Activer ou désactiver un utilisateur
  toggleUserStatus: async (userId: string, active: boolean): Promise<boolean> => {
    if (useRealApi()) {
      try {
        await axiosInstance.patch(`/users/${userId}/status`, { 
          status: active ? 'active' : 'inactive' 
        });
        return true;
      } catch (error) {
        console.error(`Erreur lors du changement de statut de l'utilisateur ${userId}:`, handleApiError(error));
        throw error;
      }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  },
  
  // Supprimer un utilisateur
  deleteUser: async (userId: string): Promise<boolean> => {
    if (useRealApi()) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        return true;
      } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, handleApiError(error));
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
