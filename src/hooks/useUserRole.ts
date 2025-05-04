
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
        const userEmail = sessionStorage.getItem('userEmail');
        
        if (storedRole && ['admin', 'manager', 'mechanic', 'driver'].includes(storedRole)) {
          // Use the stored role if it exists and is valid
          setRole(storedRole as UserRole);
          
          // Pour la cohérence, s'assurer que le rôle correspond au type d'email si présent
          if (userEmail) {
            let expectedRole: UserRole | null = null;
            
            if (userEmail.includes('admin')) {
              expectedRole = 'admin';
            } else if (userEmail.includes('manager')) {
              expectedRole = 'manager';
            } else if (userEmail.includes('mechanic')) {
              expectedRole = 'mechanic';
            } else if (userEmail.includes('driver')) {
              expectedRole = 'driver';
            }
            
            // Si on détecte une incohérence, mettre à jour le rôle en fonction de l'email
            if (expectedRole && expectedRole !== storedRole) {
              sessionStorage.setItem('userRole', expectedRole);
              setRole(expectedRole);
            }
          }
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
