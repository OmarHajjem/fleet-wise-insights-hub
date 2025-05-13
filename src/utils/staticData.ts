import { User, UserRole } from "@/types/user";
import { Vehicle, VehicleStatus } from "@/types/vehicle";

// Static mock data for vehicles with extended information
const rawVehiclesData = [
  {
    id: "v001",
    name: "Toyota Camry",
    type: "sedan",
    model: "Toyota Camry",
    license_plate: "AB-123-CD",
    year: 2020,
    status: "active" as VehicleStatus,
    location: { lat: 48.8566, lng: 2.3522 },
    driver: "Jean Dupont",
    driver_id: "u001",
    lastMaintenance: "2023-10-15",
    last_maintenance: "2023-10-15",
    nextMaintenance: "2024-04-15",
    maintenance_history: [
      { date: "2023-10-15", type: "regular", description: "Oil change, filters" },
      { date: "2023-05-20", type: "repair", description: "Brake pads replacement" }
    ],
    fuel_type: "gasoline",
    fuel_level: 75,
  },
  {
    id: "v002",
    name: "Renault Kangoo",
    type: "van",
    model: "Renault Kangoo",
    license_plate: "EF-456-GH",
    year: 2021,
    status: "maintenance" as VehicleStatus,
    location: { lat: 48.8496, lng: 2.3522 },
    driver: "Marie Martin",
    driver_id: "u002",
    lastMaintenance: "2023-11-10",
    last_maintenance: "2023-11-10",
    nextMaintenance: "2024-05-10",
    maintenance_history: [
      { date: "2023-11-10", type: "regular", description: "Full service" },
      { date: "2023-06-25", type: "regular", description: "Oil change" }
    ],
    fuel_type: "diesel",
    fuel_level: 40,
  },
  {
    id: "v003",
    name: "Peugeot e-208",
    type: "compact",
    model: "Peugeot e-208 Électrique",
    license_plate: "IJ-789-KL",
    year: 2022,
    status: "active" as VehicleStatus,
    location: { lat: 48.8606, lng: 2.3376 },
    driver: "Lucas Bernard",
    driver_id: "u003",
    lastMaintenance: "2023-09-05",
    last_maintenance: "2023-09-05",
    nextMaintenance: "2024-03-05",
    maintenance_history: [
      { date: "2023-09-05", type: "regular", description: "Battery check, tire rotation" }
    ],
    fuel_type: "electric",
    fuel_level: 80,
  },
  {
    id: "v004",
    name: "Citroën Berlingo",
    type: "van",
    model: "Citroën Berlingo",
    license_plate: "MN-012-OP",
    year: 2020,
    status: "inactive" as VehicleStatus,
    location: { lat: 48.8656, lng: 2.3542 },
    driver: "Sophie Petit",
    driver_id: "u004",
    lastMaintenance: "2023-12-20",
    last_maintenance: "2023-12-20",
    nextMaintenance: "2024-06-20",
    maintenance_history: [
      { date: "2023-12-20", type: "repair", description: "Transmission repair" },
      { date: "2023-08-15", type: "regular", description: "Oil change, air filters" }
    ],
    fuel_type: "diesel",
    fuel_level: 25,
  },
  {
    id: "v005",
    name: "Tesla Model 3",
    type: "sedan",
    model: "Tesla Model 3",
    license_plate: "QR-345-ST",
    year: 2022,
    status: "active" as VehicleStatus,
    location: { lat: 48.8716, lng: 2.3477 },
    driver: "Thomas Dubois",
    driver_id: "u005",
    lastMaintenance: "2023-10-30",
    last_maintenance: "2023-10-30",
    nextMaintenance: "2024-04-30",
    maintenance_history: [
      { date: "2023-10-30", type: "regular", description: "Software update, tire inspection" }
    ],
    fuel_type: "electric",
    fuel_level: 90,
  },
];

// Convert rawVehiclesData to comply with the Vehicle type
const staticVehicles: Vehicle[] = rawVehiclesData.map(vehicle => ({
  id: vehicle.id,
  model: vehicle.model,
  license_plate: vehicle.license_plate,
  year: vehicle.year,
  status: vehicle.status as VehicleStatus,
  driver_id: vehicle.driver_id,
  last_maintenance: vehicle.last_maintenance,
  fuel_level: vehicle.fuel_level
}));

// Define static users data
const staticUsers: User[] = [
  {
    id: "u001",
    email: "jean.dupont@fleetwise.fr",
    firstName: "Jean",
    lastName: "Dupont",
    role: "driver",
    status: "active",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-01-15"
  },
  {
    id: "u002",
    email: "marie.martin@fleetwise.fr",
    firstName: "Marie",
    lastName: "Martin",
    role: "driver",
    status: "active",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-02-20"
  },
  {
    id: "u003",
    email: "lucas.bernard@fleetwise.fr",
    firstName: "Lucas",
    lastName: "Bernard",
    role: "driver",
    status: "active",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-03-10"
  },
  {
    id: "u004",
    email: "sophie.petit@fleetwise.fr",
    firstName: "Sophie",
    lastName: "Petit",
    role: "driver",
    status: "inactive",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-01-25"
  },
  {
    id: "u005",
    email: "thomas.dubois@fleetwise.fr",
    firstName: "Thomas",
    lastName: "Dubois",
    role: "driver",
    status: "active",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-04-05"
  },
  {
    id: "m001",
    email: "admin@fleetwise.fr",
    firstName: "Admin",
    lastName: "Système",
    role: "admin",
    status: "active",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-01-01"
  },
  {
    id: "m002",
    email: "manager@fleetwise.fr",
    firstName: "Paul",
    lastName: "Gestion",
    role: "manager",
    status: "active",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-01-02"
  },
  {
    id: "m003",
    email: "mechanic@fleetwise.fr",
    firstName: "Michel",
    lastName: "Technic",
    role: "mechanic",
    status: "active",
    assignedVehicle: null,
    lastActive: null,
    created_at: "2023-01-03"
  }
];

// Additional user data with more details
const usersData = [
  {
    id: "u001",
    email: "jean.dupont@fleetwise.fr",
    firstName: "Jean",
    lastName: "Dupont",
    role: "driver",
    phone: "+33612345678",
    licenseNumber: "123456789",
    licenseExpiry: "2025-04-15",
    address: "123 Rue de Paris, 75001 Paris",
    status: "active"
  },
  // ... other users with the same structure
];

// Mock garage data
const garagesData = [
  {
    id: "g001",
    name: "Garage Central Paris",
    address: "123 Rue de Rivoli, 75001 Paris",
    phone: "+33123456789",
    specialties: ["mechanical", "electrical", "body work"],
    status: "available"
  },
  {
    id: "g002",
    name: "Auto Service Lyon",
    address: "45 Avenue Berthelot, 69007 Lyon",
    phone: "+33987654321",
    specialties: ["mechanical", "tire service"],
    status: "available"
  },
  {
    id: "g003",
    name: "Mécanique Rapide Marseille",
    address: "78 Boulevard Michelet, 13008 Marseille",
    phone: "+33678912345",
    specialties: ["emergency repair", "mechanical"],
    status: "available"
  }
];

// Mock authentication service
const authService = {
  getUser: () => {
    const userEmail = sessionStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('userRole');
    
    // If user is logged in
    if (userEmail) {
      const user = staticUsers.find(u => u.email === userEmail) || null;
      return { user };
    }
    
    return { user: null };
  },
  
  signIn: async (email: string, password: string) => {
    // Simplified sign in, in a real app you'd validate credentials
    const user = staticUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      sessionStorage.setItem('userEmail', user.email);
      sessionStorage.setItem('userRole', user.role);
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  },
  
  signOut: async () => {
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    return { success: true };
  },
  
  onAuthStateChange: (callback: (user: any) => void) => {
    // In a real app, would set up events to track auth state
    const userEmail = sessionStorage.getItem('userEmail');
    const user = userEmail ? staticUsers.find(u => u.email === userEmail) || null : null;
    callback(user);
    
    // Return dummy unsubscribe function
    return {
      unsubscribe: () => {}
    };
  }
};

// Mock role service
const roleService = {
  getUserRole: (): UserRole => {
    const storedRole = sessionStorage.getItem('userRole');
    if (storedRole === 'admin' || storedRole === 'manager' || 
        storedRole === 'mechanic' || storedRole === 'driver') {
      return storedRole as UserRole;
    }
    
    // Default role if none is set
    return 'driver';
  },
  
  updateUserRole: async (userId: string, role: UserRole) => {
    // This would update a user's role in a real database
    console.log(`Updated user ${userId} role to ${role}`);
    return { success: true };
  },
  
  toggleUserStatus: async (userId: string, active: boolean) => {
    // This would update a user's active status in a real database
    console.log(`Set user ${userId} active status to ${active}`);
    return { success: true };
  }
};

// Vehicle service mock functions
const vehicleService = {
  getAllVehicles: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return staticVehicles;
  },
  
  getVehicleById: async (id: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const vehicle = rawVehiclesData.find(v => v.id === id);
    if (!vehicle) throw new Error("Vehicle not found");
    return vehicle;
  },
  
  getUserVehicles: async (userId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return staticVehicles.filter(v => v.driver_id === userId);
  },
  
  updateVehicleStatus: async (id: string, status: "active" | "maintenance" | "inactive") => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const vehicleIndex = staticVehicles.findIndex(v => v.id === id);
    if (vehicleIndex === -1) throw new Error("Vehicle not found");
    
    staticVehicles[vehicleIndex].status = status as VehicleStatus;
    return staticVehicles[vehicleIndex];
  },
  
  addVehicle: async (vehicleData: Partial<Vehicle>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newVehicle: Vehicle = {
      id: `v${staticVehicles.length + 1}`.padStart(4, '0'),
      model: vehicleData.model || "",
      license_plate: vehicleData.license_plate || "",
      year: vehicleData.year || new Date().getFullYear(),
      status: vehicleData.status || "active",
      driver_id: vehicleData.driver_id || null,
      last_maintenance: null,
      fuel_level: vehicleData.fuel_level || 100
    };
    
    staticVehicles.push(newVehicle);
    return newVehicle;
  }
};

// Simplified profile service
const profileService = {
  getProfile: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    const userEmail = sessionStorage.getItem('userEmail');
    const user = staticUsers.find(u => u.email === userEmail);
    
    if (!user) return null;
    
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: "+33612345678", // Mock data
      avatar_url: null
    };
  },
  
  updateProfile: async (profileData: { firstName?: string, lastName?: string, phone?: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    const userEmail = sessionStorage.getItem('userEmail');
    const userIndex = staticUsers.findIndex(u => u.email === userEmail);
    
    if (userIndex === -1) throw new Error("User not found");
    
    if (profileData.firstName) staticUsers[userIndex].firstName = profileData.firstName;
    if (profileData.lastName) staticUsers[userIndex].lastName = profileData.lastName;
    
    return { success: true };
  },
  
  uploadAvatar: async (file: File) => {
    // Simulate API delay and file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would upload to storage and return the URL
    const avatarUrl = URL.createObjectURL(file);
    
    // Update user avatar in mock data
    const userEmail = sessionStorage.getItem('userEmail');
    const userIndex = staticUsers.findIndex(u => u.email === userEmail);
    
    if (userIndex !== -1) {
      staticUsers[userIndex].avatar_url = avatarUrl;
    }
    
    return avatarUrl;
  }
};

// Finally, export all data and services
export { 
  rawVehiclesData,
  staticVehicles,
  staticUsers,
  usersData,
  garagesData,
  authService,
  roleService,
  vehicleService,
  profileService
};
