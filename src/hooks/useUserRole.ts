
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
        const userRole = roleService.getUserRole();
        setRole(userRole);
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
