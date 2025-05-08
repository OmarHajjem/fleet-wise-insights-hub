// Import UserRole from types/user.ts instead of redeclaring it
import { UserRole, UserStatus, User } from "@/types/user";
import { Vehicle, VehicleStatus } from "@/types/vehicle";

// Re-export the UserRole type
export type { UserRole, UserStatus };

// Service de gestion des rôles (simulation)
class RoleService {
  getUserRole(): UserRole {
    // Check if a role is already stored
    const storedRole = sessionStorage.getItem('userRole');
    
    if (storedRole && ['admin', 'manager', 'mechanic', 'driver'].includes(storedRole)) {
      return storedRole as UserRole;
    }
    
    // Simuler la récupération du rôle depuis une API
    // En production, cela viendrait d'une API ou d'un stockage sécurisé
    const roles: UserRole[] = ['admin', 'manager', 'mechanic', 'driver'];
    const randomIndex = Math.floor(Math.random() * roles.length);
    const role = roles[randomIndex];
    
    // Store the role in sessionStorage
    sessionStorage.setItem('userRole', role);
    
    return role;
  }
  
  // Méthode pour mettre à jour le rôle d'un utilisateur
  updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    // Simulation de mise à jour de rôle
    console.log(`Mise à jour du rôle pour l'utilisateur ${userId} vers ${newRole}`);
    return Promise.resolve(true);
  }
  
  // Méthode pour activer/désactiver un utilisateur
  toggleUserStatus(userId: string, active: boolean): Promise<boolean> {
    // Simulation de changement de statut
    const newStatus: UserStatus = active ? 'active' : 'inactive';
    console.log(`Changement de statut pour l'utilisateur ${userId}: ${newStatus}`);
    return Promise.resolve(true);
  }
}

export const roleService = new RoleService();

// Service d'authentification (simulation)
class AuthService {
  private listeners: Function[] = [];

  getUser() {
    // Simuler la récupération d'un utilisateur connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      // Get the role from sessionStorage if it exists
      const storedRole = sessionStorage.getItem('userRole');
      const userEmail = sessionStorage.getItem('userEmail') || 'admin@fleetwise.fr';
      const role = storedRole && ['admin', 'manager', 'mechanic', 'driver'].includes(storedRole) 
        ? storedRole as UserRole 
        : 'driver';
        
      return {
        user: {
          id: 'u1',
          email: userEmail,
          firstName: userEmail.split('@')[0],
          lastName: 'Utilisateur',
          role: role,
          avatar_url: null
        }
      };
    }
    return { user: null };
  }
  
  signIn(email: string, password: string): Promise<{user: any}> {
    // Simuler une authentification
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userEmail', email);
      
      // For this simulation, assign a role based on email for consistent experience
      let role: UserRole = 'driver';
      
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('manager')) {
        role = 'manager';
      } else if (email.includes('mechanic')) {
        role = 'mechanic';
      } else {
        role = 'driver';
      }
      
      // Store the role
      sessionStorage.setItem('userRole', role);
      
      const user = {
        id: 'u1',
        email,
        firstName: email.split('@')[0],
        lastName: 'Utilisateur',
        role: role,
        avatar_url: null
      };
      
      // Notifier les écouteurs
      this.listeners.forEach(listener => listener(user));
      
      return Promise.resolve({ user });
    }
    return Promise.reject(new Error('Identifiants invalides'));
  }
  
  signOut(): Promise<void> {
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userEmail');
    
    // Notifier les écouteurs
    this.listeners.forEach(listener => listener(null));
    
    return Promise.resolve();
  }
  
  onAuthStateChange(callback: (user: any) => void) {
    this.listeners.push(callback);
    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter(listener => listener !== callback);
      }
    };
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
      avatar_url: null,
      phone: '06 12 34 56 78' // Added phone property
    };
  }
  
  updateUserProfile(userId: string, data: any): Promise<boolean> {
    console.log(`Mise à jour du profil pour ${userId}:`, data);
    return Promise.resolve(true);
  }
  
  getProfile(): Promise<any> {
    // Using a default user ID since we're simulating
    return Promise.resolve(this.getUserProfile('u1'));
  }
  
  updateProfile(data: any): Promise<boolean> {
    // Using a default user ID since we're simulating
    return this.updateUserProfile('u1', data);
  }
  
  uploadAvatar(file: File): Promise<string> {
    console.log(`Téléchargement de l'avatar`);
    // Simuler un URL pour l'avatar
    return Promise.resolve(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(file.name)}`);
  }
}

export const profileService = new ProfileService();

// Service de gestion des véhicules (simulation)
class VehicleService {
  assignVehicleToUser(vehicleId: string, userId: string | null): Promise<boolean> {
    console.log(`Assignation du véhicule ${vehicleId} à l'utilisateur ${userId || 'aucun'}`);
    return Promise.resolve(true);
  }
  
  changeVehicleStatus(vehicleId: string, status: VehicleStatus): Promise<boolean> {
    console.log(`Changement du statut du véhicule ${vehicleId} à ${status}`);
    return Promise.resolve(true);
  }
  
  addVehicle(data: any): Promise<{id: string}> {
    console.log(`Ajout d'un nouveau véhicule:`, data);
    return Promise.resolve({id: 'v' + Math.floor(Math.random() * 1000)});
  }
  
  updateVehicleStatus(vehicleId: string, status: VehicleStatus): Promise<boolean> {
    return this.changeVehicleStatus(vehicleId, status);
  }
}

export const vehicleService = new VehicleService();

// Données de véhicules (simulation)
const rawVehiclesData = [
  { 
    id: 'v1', 
    name: 'Renault Kangoo E-Tech', 
    type: 'Utilitaire Électrique',
    status: 'active',
    location: { lat: 48.8566, lng: 2.3522 },
    driver: 'Jean Dupont',
    driver_id: 'u3',
    lastMaintenance: '2025-03-15',
    last_maintenance: '2025-03-15',
    nextMaintenance: '2025-06-15',
    emissions: 0,
    efficiency: 92,
    model: 'Kangoo E-Tech',
    license_plate: 'AB-123-CD',
    year: 2023,
    fuel_level: 80
  },
  { 
    id: 'v2', 
    name: 'Peugeot e-Partner', 
    type: 'Utilitaire Électrique',
    status: 'maintenance',
    location: { lat: 48.8606, lng: 2.3376 },
    driver: 'Marie Laurent',
    driver_id: 'u4',
    lastMaintenance: '2025-01-10',
    last_maintenance: '2025-01-10',
    nextMaintenance: '2025-04-10',
    emissions: 0,
    efficiency: 88,
    model: 'e-Partner',
    license_plate: 'BC-456-DE',
    year: 2024,
    fuel_level: 65
  },
  { 
    id: 'v3', 
    name: 'Citroën Berlingo', 
    type: 'Utilitaire Diesel',
    status: 'active',
    location: { lat: 48.8496, lng: 2.3395 },
    driver: 'Thomas Martin',
    driver_id: 'u5',
    lastMaintenance: '2025-02-22',
    last_maintenance: '2025-02-22',
    nextMaintenance: '2025-05-22',
    emissions: 145,
    efficiency: 65,
    model: 'Berlingo',
    license_plate: 'CD-789-EF',
    year: 2022,
    fuel_level: 30
  },
  { 
    id: 'v4', 
    name: 'Fiat Ducato', 
    type: 'Fourgon Diesel',
    status: 'inactive',
    location: { lat: 48.8737, lng: 2.2950 },
    driver: 'Non assigné',
    driver_id: null,
    lastMaintenance: '2025-03-05',
    last_maintenance: '2025-03-05',
    nextMaintenance: '2025-06-05',
    emissions: 195,
    efficiency: 58,
    model: 'Ducato',
    license_plate: 'DE-012-FG',
    year: 2021,
    fuel_level: 45
  },
  { 
    id: 'v5', 
    name: 'Tesla Model 3', 
    type: 'Berline Électrique',
    status: 'active',
    location: { lat: 48.8417, lng: 2.3275 },
    driver: 'Sophie Bernard',
    driver_id: 'u6',
    lastMaintenance: '2025-04-01',
    last_maintenance: '2025-04-01',
    nextMaintenance: '2025-07-01',
    emissions: 0,
    efficiency: 95,
    model: 'Model 3',
    license_plate: 'EF-345-GH',
    year: 2024,
    fuel_level: 90
  }
];

// Convert raw vehicles data to conform to Vehicle type
export const vehiclesData: Vehicle[] = rawVehiclesData.map(vehicle => ({
  id: vehicle.id,
  license_plate: vehicle.license_plate,
  model: vehicle.model,
  year: vehicle.year,
  status: vehicle.status as VehicleStatus, // Type assertion here
  driver_id: vehicle.driver_id,
  last_maintenance: vehicle.last_maintenance,
  fuel_level: vehicle.fuel_level
}));

// Pour la compatibilité avec les autres fichiers
export const staticUsers = usersData;
export const staticVehicles = vehiclesData;

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
    role: 'admin' as UserRole,
    vehicleId: null,
    joinDate: '2023-05-12',
    status: 'active' as UserStatus,
    firstName: 'Alexandre',
    lastName: 'Dubois',
    assignedVehicle: null,
    lastActive: '2025-04-28T14:30:00Z',
    avatar_url: null
  },
  {
    id: 'u2',
    name: 'Émilie Laurent',
    email: 'e.laurent@fleetwise.fr',
    role: 'manager' as UserRole,
    vehicleId: null,
    joinDate: '2023-07-22',
    status: 'active' as UserStatus,
    firstName: 'Émilie',
    lastName: 'Laurent',
    assignedVehicle: null,
    lastActive: '2025-04-27T10:15:00Z',
    avatar_url: null
  },
  {
    id: 'u3',
    name: 'Jean Dupont',
    email: 'j.dupont@fleetwise.fr',
    role: 'driver' as UserRole,
    vehicleId: 'v1',
    joinDate: '2023-09-05',
    status: 'active' as UserStatus,
    firstName: 'Jean',
    lastName: 'Dupont',
    assignedVehicle: 'Renault Kangoo E-Tech',
    lastActive: '2025-04-28T08:45:00Z',
    avatar_url: null
  },
  {
    id: 'u4',
    name: 'Marie Laurent',
    email: 'm.laurent@fleetwise.fr',
    role: 'driver' as UserRole,
    vehicleId: 'v2',
    joinDate: '2023-08-15',
    status: 'active' as UserStatus,
    firstName: 'Marie',
    lastName: 'Laurent',
    assignedVehicle: 'Peugeot e-Partner',
    lastActive: '2025-04-26T16:20:00Z',
    avatar_url: null
  },
  {
    id: 'u5',
    name: 'Thomas Martin',
    email: 't.martin@fleetwise.fr',
    role: 'driver' as UserRole,
    vehicleId: 'v3',
    joinDate: '2023-10-20',
    status: 'active' as UserStatus,
    firstName: 'Thomas',
    lastName: 'Martin',
    assignedVehicle: 'Citroën Berlingo',
    lastActive: '2025-04-27T12:10:00Z',
    avatar_url: null
  },
  {
    id: 'u6',
    name: 'Sophie Bernard',
    email: 's.bernard@fleetwise.fr',
    role: 'driver' as UserRole,
    vehicleId: 'v5',
    joinDate: '2024-01-10',
    status: 'active' as UserStatus,
    firstName: 'Sophie',
    lastName: 'Bernard',
    assignedVehicle: 'Tesla Model 3',
    lastActive: '2025-04-28T09:30:00Z',
    avatar_url: null
  },
  {
    id: 'u7',
    name: 'Pierre Leroy',
    email: 'p.leroy@fleetwise.fr',
    role: 'mechanic' as UserRole,
    vehicleId: null,
    joinDate: '2023-06-18',
    status: 'active' as UserStatus,
    firstName: 'Pierre',
    lastName: 'Leroy',
    assignedVehicle: null,
    lastActive: '2025-04-25T14:40:00Z',
    avatar_url: null
  },
  {
    id: 'u8',
    name: 'Lucie Moreau',
    email: 'l.moreau@fleetwise.fr',
    role: 'mechanic' as UserRole,
    vehicleId: null,
    joinDate: '2023-11-05',
    status: 'inactive' as UserStatus,
    firstName: 'Lucie',
    lastName: 'Moreau',
    assignedVehicle: null,
    lastActive: '2025-03-15T11:25:00Z',
    avatar_url: null
  }
];
