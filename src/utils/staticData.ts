
// Types de rôles utilisateur
export type UserRole = 'admin' | 'manager' | 'mechanic' | 'driver';
export type UserStatus = 'active' | 'inactive';

// Service de gestion des rôles (simulation)
class RoleService {
  getUserRole(): UserRole {
    // Simuler la récupération du rôle depuis une API
    // En production, cela viendrait d'une API ou d'un stockage sécurisé
    const roles: UserRole[] = ['admin', 'manager', 'mechanic', 'driver'];
    const randomIndex = Math.floor(Math.random() * roles.length);
    return roles[randomIndex];
  }
  
  // Méthode pour mettre à jour le rôle d'un utilisateur
  updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    // Simulation de mise à jour de rôle
    console.log(`Mise à jour du rôle pour l'utilisateur ${userId} vers ${newRole}`);
    return Promise.resolve(true);
  }
  
  // Méthode pour activer/désactiver un utilisateur
  toggleUserStatus(userId: string): Promise<UserStatus> {
    // Simulation de changement de statut
    const newStatus: UserStatus = Math.random() > 0.5 ? 'active' : 'inactive';
    console.log(`Changement de statut pour l'utilisateur ${userId}: ${newStatus}`);
    return Promise.resolve(newStatus);
  }
}

export const roleService = new RoleService();

// Service d'authentification (simulation)
class AuthService {
  getUser() {
    // Simuler la récupération d'un utilisateur connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      return {
        user: {
          id: 'u1',
          email: 'admin@fleetwise.fr',
          firstName: 'Alexandre',
          lastName: 'Dubois',
          role: 'admin' as UserRole,
        }
      };
    }
    return { user: null };
  }
  
  signIn(email: string, password: string): Promise<{user: any}> {
    // Simuler une authentification
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      return Promise.resolve({
        user: {
          id: 'u1',
          email,
          firstName: 'Alexandre',
          lastName: 'Dubois',
          role: 'admin' as UserRole,
        }
      });
    }
    return Promise.reject(new Error('Identifiants invalides'));
  }
  
  signOut(): Promise<void> {
    localStorage.removeItem('isLoggedIn');
    return Promise.resolve();
  }
}

export const authService = new AuthService();

// Service de profil utilisateur (simulation)
class ProfileService {
  getUserProfile(userId: string) {
    // Simuler la récupération du profil
    return {
      id: userId,
      firstName: 'Alexandre',
      lastName: 'Dubois',
      email: 'admin@fleetwise.fr',
      role: 'admin' as UserRole,
      joinDate: '2023-05-12',
      department: 'Direction',
      lastActivity: '2025-04-28T14:30:00Z',
    };
  }
  
  updateUserProfile(userId: string, data: any): Promise<boolean> {
    console.log(`Mise à jour du profil pour ${userId}:`, data);
    return Promise.resolve(true);
  }
}

export const profileService = new ProfileService();

// Service de gestion des véhicules (simulation)
class VehicleService {
  assignVehicleToUser(vehicleId: string, userId: string | null): Promise<boolean> {
    console.log(`Assignation du véhicule ${vehicleId} à l'utilisateur ${userId || 'aucun'}`);
    return Promise.resolve(true);
  }
  
  changeVehicleStatus(vehicleId: string, status: string): Promise<boolean> {
    console.log(`Changement du statut du véhicule ${vehicleId} à ${status}`);
    return Promise.resolve(true);
  }
}

export const vehicleService = new VehicleService();

// Données de véhicules (simulation)
export const vehiclesData = [
  { 
    id: 'v1', 
    name: 'Renault Kangoo E-Tech', 
    type: 'Utilitaire Électrique',
    status: 'active',
    location: { lat: 48.8566, lng: 2.3522 },
    driver: 'Jean Dupont',
    lastMaintenance: '2025-03-15',
    nextMaintenance: '2025-06-15',
    emissions: 0,
    efficiency: 92
  },
  { 
    id: 'v2', 
    name: 'Peugeot e-Partner', 
    type: 'Utilitaire Électrique',
    status: 'maintenance',
    location: { lat: 48.8606, lng: 2.3376 },
    driver: 'Marie Laurent',
    lastMaintenance: '2025-01-10',
    nextMaintenance: '2025-04-10',
    emissions: 0,
    efficiency: 88
  },
  { 
    id: 'v3', 
    name: 'Citroën Berlingo', 
    type: 'Utilitaire Diesel',
    status: 'active',
    location: { lat: 48.8496, lng: 2.3395 },
    driver: 'Thomas Martin',
    lastMaintenance: '2025-02-22',
    nextMaintenance: '2025-05-22',
    emissions: 145,
    efficiency: 65
  },
  { 
    id: 'v4', 
    name: 'Fiat Ducato', 
    type: 'Fourgon Diesel',
    status: 'inactive',
    location: { lat: 48.8737, lng: 2.2950 },
    driver: 'Non assigné',
    lastMaintenance: '2025-03-05',
    nextMaintenance: '2025-06-05',
    emissions: 195,
    efficiency: 58
  },
  { 
    id: 'v5', 
    name: 'Tesla Model 3', 
    type: 'Berline Électrique',
    status: 'active',
    location: { lat: 48.8417, lng: 2.3275 },
    driver: 'Sophie Bernard',
    lastMaintenance: '2025-04-01',
    nextMaintenance: '2025-07-01',
    emissions: 0,
    efficiency: 95
  }
];

// Données des garages (simulation)
export const garagesData = [
  {
    id: 'g1',
    name: 'Garage Central',
    address: '15 Rue de Rivoli, Paris',
    capacity: 25,
    occupied: 18,
    specialties: ['Électrique', 'Hybride', 'Diesel'],
    contact: '+33 1 23 45 67 89'
  },
  {
    id: 'g2',
    name: 'Atelier Nord',
    address: '42 Avenue de Flandre, Paris',
    capacity: 15,
    occupied: 12,
    specialties: ['Diesel', 'Essence'],
    contact: '+33 1 98 76 54 32'
  },
  {
    id: 'g3',
    name: 'Tech Auto Sud',
    address: '8 Boulevard Saint-Michel, Paris',
    capacity: 30,
    occupied: 22,
    specialties: ['Électrique', 'Hydrogène', 'Hybride'],
    contact: '+33 1 45 67 89 01'
  }
];

// Données des utilisateurs (simulation)
export const usersData = [
  {
    id: 'u1',
    name: 'Alexandre Dubois',
    email: 'a.dubois@fleetwise.fr',
    role: 'admin',
    vehicleId: null,
    joinDate: '2023-05-12',
    status: 'active'
  },
  {
    id: 'u2',
    name: 'Émilie Laurent',
    email: 'e.laurent@fleetwise.fr',
    role: 'manager',
    vehicleId: null,
    joinDate: '2023-07-22',
    status: 'active'
  },
  {
    id: 'u3',
    name: 'Jean Dupont',
    email: 'j.dupont@fleetwise.fr',
    role: 'driver',
    vehicleId: 'v1',
    joinDate: '2023-09-05',
    status: 'active'
  },
  {
    id: 'u4',
    name: 'Marie Laurent',
    email: 'm.laurent@fleetwise.fr',
    role: 'driver',
    vehicleId: 'v2',
    joinDate: '2023-08-15',
    status: 'active'
  },
  {
    id: 'u5',
    name: 'Thomas Martin',
    email: 't.martin@fleetwise.fr',
    role: 'driver',
    vehicleId: 'v3',
    joinDate: '2023-10-20',
    status: 'active'
  },
  {
    id: 'u6',
    name: 'Sophie Bernard',
    email: 's.bernard@fleetwise.fr',
    role: 'driver',
    vehicleId: 'v5',
    joinDate: '2024-01-10',
    status: 'active'
  },
  {
    id: 'u7',
    name: 'Pierre Leroy',
    email: 'p.leroy@fleetwise.fr',
    role: 'mechanic',
    vehicleId: null,
    joinDate: '2023-06-18',
    status: 'active'
  },
  {
    id: 'u8',
    name: 'Lucie Moreau',
    email: 'l.moreau@fleetwise.fr',
    role: 'mechanic',
    vehicleId: null,
    joinDate: '2023-11-05',
    status: 'inactive'
  }
];

// Pour la compatibilité avec les autres fichiers
export const staticUsers = usersData;
export const staticVehicles = vehiclesData;
