
export type UserRole = 'admin' | 'manager' | 'driver' | 'mechanic';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  status: UserStatus;
  assignedVehicle: string | null;
  lastActive: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export const roleLabels = {
  driver: { label: "Conducteur", color: "bg-blue-100 text-blue-800" },
  admin: { label: "Administrateur", color: "bg-purple-100 text-purple-800" },
  manager: { label: "Gestionnaire", color: "bg-indigo-100 text-indigo-800" },
  mechanic: { label: "Mécanicien", color: "bg-amber-100 text-amber-800" },
} as const;

export const statusLabels = {
  active: { label: "Actif", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactif", color: "bg-gray-100 text-gray-800" },
} as const;
