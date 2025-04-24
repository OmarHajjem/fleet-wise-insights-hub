
// Static data store to replace Supabase backend

// User types
export type UserRole = 'admin' | 'manager' | 'driver' | 'mechanic';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  assignedVehicle: string | null;
  lastActive: string | null;
  avatar_url?: string | null;
  phone?: string | null;
}

export interface Vehicle {
  id: string;
  license_plate: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'inactive';
  driver_id: string | null;
  fuel_level: number;
  last_maintenance: string | null;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
}

// Current user state
let currentUser: User | null = {
  id: "1",
  email: "admin@fleetwise.com",
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  status: "active",
  assignedVehicle: null,
  lastActive: new Date().toISOString(),
  phone: "+33123456789"
};

// Mock data
export const staticUsers: User[] = [
  {
    id: "1",
    email: "admin@fleetwise.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    status: "active",
    assignedVehicle: null,
    lastActive: new Date().toISOString()
  },
  {
    id: "2",
    email: "manager@fleetwise.com",
    firstName: "Manager",
    lastName: "User",
    role: "manager",
    status: "active",
    assignedVehicle: null,
    lastActive: new Date().toISOString()
  },
  {
    id: "3",
    email: "driver@fleetwise.com",
    firstName: "Driver",
    lastName: "User",
    role: "driver",
    status: "active",
    assignedVehicle: "1",
    lastActive: new Date().toISOString()
  },
  {
    id: "4",
    email: "mechanic@fleetwise.com",
    firstName: "Mechanic",
    lastName: "User",
    role: "mechanic",
    status: "active",
    assignedVehicle: null,
    lastActive: new Date().toISOString()
  }
];

export const staticVehicles: Vehicle[] = [
  {
    id: "1",
    license_plate: "AA-123-BB",
    model: "Renault Kangoo",
    year: 2021,
    status: "active",
    driver_id: "3",
    fuel_level: 75,
    last_maintenance: "2023-12-01T10:00:00Z",
    created_at: "2023-01-15T14:30:00Z",
    updated_at: "2023-12-01T10:00:00Z",
    latitude: 48.8566,
    longitude: 2.3522
  },
  {
    id: "2",
    license_plate: "BB-456-CC",
    model: "Peugeot Partner",
    year: 2020,
    status: "maintenance",
    driver_id: null,
    fuel_level: 30,
    last_maintenance: "2023-11-15T14:30:00Z",
    created_at: "2023-02-10T09:15:00Z",
    updated_at: "2023-11-15T14:30:00Z",
    latitude: 48.8756,
    longitude: 2.3522
  },
  {
    id: "3",
    license_plate: "CC-789-DD",
    model: "Citroën Berlingo",
    year: 2022,
    status: "active",
    driver_id: null,
    fuel_level: 90,
    last_maintenance: "2023-12-10T11:45:00Z",
    created_at: "2023-03-05T16:20:00Z",
    updated_at: "2023-12-10T11:45:00Z",
    latitude: 48.8656,
    longitude: 2.3722
  }
];

// Auth functions
export const authService = {
  getSession: () => {
    return Promise.resolve({ user: currentUser ? { id: currentUser.id } : null });
  },
  getUser: () => {
    return Promise.resolve({ user: currentUser });
  },
  signIn: (email: string, password: string) => {
    const user = staticUsers.find(u => u.email === email);
    if (user && password === "password") {
      currentUser = user;
      return Promise.resolve({ user });
    }
    return Promise.reject(new Error("Invalid login credentials"));
  },
  signOut: () => {
    currentUser = null;
    return Promise.resolve();
  },
  onAuthStateChange: (callback: (user: User | null) => void) => {
    // In a real app, this would set up a listener
    callback(currentUser);
    // Return a fake subscription with unsubscribe method
    return {
      unsubscribe: () => {}
    };
  }
};

// Profile functions
export const profileService = {
  getProfile: async () => {
    if (!currentUser) return null;
    return currentUser;
  },
  updateProfile: async (data: Partial<User>) => {
    if (!currentUser) return null;
    currentUser = { ...currentUser, ...data };
    // Update in static users array too
    const index = staticUsers.findIndex(u => u.id === currentUser?.id);
    if (index >= 0) {
      staticUsers[index] = { ...staticUsers[index], ...data };
    }
    return currentUser;
  },
  uploadAvatar: async (file: File) => {
    // Simulate file upload by generating a fake URL
    const fakeUrl = `https://example.com/avatar/${Date.now()}.jpg`;
    
    if (currentUser) {
      currentUser.avatar_url = fakeUrl;
    }
    
    return fakeUrl;
  }
};

// User role functions
export const roleService = {
  getUserRole: () => {
    if (!currentUser) return null;
    return currentUser.role;
  },
  
  updateUserRole: (userId: string, role: UserRole) => {
    const index = staticUsers.findIndex(u => u.id === userId);
    if (index >= 0) {
      staticUsers[index].role = role;
    }
    // Update current user if it's the same
    if (currentUser && currentUser.id === userId) {
      currentUser.role = role;
    }
    return Promise.resolve();
  },
  
  toggleUserStatus: (userId: string, active: boolean) => {
    const index = staticUsers.findIndex(u => u.id === userId);
    if (index >= 0) {
      staticUsers[index].status = active ? "active" : "inactive";
    }
    
    // Update current user if it's the same
    if (currentUser && currentUser.id === userId) {
      currentUser.status = active ? "active" : "inactive";
    }
    return Promise.resolve();
  }
};

// Vehicle functions
export const vehicleService = {
  getVehicles: async () => {
    return staticVehicles;
  },
  
  addVehicle: async (vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at" | "last_maintenance">) => {
    const newVehicle: Vehicle = {
      id: `${staticVehicles.length + 1}`,
      ...vehicle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_maintenance: null
    };
    
    staticVehicles.push(newVehicle);
    return newVehicle;
  },
  
  updateVehicleStatus: async (id: string, status: "active" | "maintenance" | "inactive") => {
    const index = staticVehicles.findIndex(v => v.id === id);
    if (index >= 0) {
      staticVehicles[index].status = status;
      staticVehicles[index].updated_at = new Date().toISOString();
    }
    return staticVehicles[index];
  }
};
