
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type UserRole = 'admin' | 'manager' | 'driver' | 'mechanic' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du rôle:", error);
          setRole(null);
        } else {
          // Ensure we get a valid role type
          const roleValue = data?.role as string;
          if (roleValue === 'admin' || roleValue === 'manager' || 
              roleValue === 'driver' || roleValue === 'mechanic') {
            setRole(roleValue);
          } else {
            setRole(null);
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
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

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { role, isLoading };
};
