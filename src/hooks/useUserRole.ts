
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { roleService } from "@/utils/staticData";
import { UserRole } from "@/types/user";

// Re-export the UserRole type properly
export type { UserRole };

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Check if a role is already stored in session
        const storedRole = sessionStorage.getItem('userRole');
        
        if (storedRole && ['admin', 'manager', 'mechanic', 'driver'].includes(storedRole)) {
          // Use the stored role if it exists and is valid
          setRole(storedRole as UserRole);
        } else {
          // If no role exists, get one from the service and store it
          const userRole = roleService.getUserRole();
          sessionStorage.setItem('userRole', userRole);
          setRole(userRole);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer votre rôle utilisateur.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, isLoading };
};
