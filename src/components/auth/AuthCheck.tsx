import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRoles?: Array<'admin' | 'manager' | 'driver' | 'mechanic'>;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children, requiredRoles }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Configurer l'écouteur d'événements d'authentification d'abord
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session) {
          checkAccess(session.user.id);
        } else {
          setLoading(false);
          setHasAccess(false);
        }
      }
    );

    // Ensuite vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session) {
        checkAccess(session.user.id);
      } else {
        setLoading(false);
        setHasAccess(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [requiredRoles]);

  const checkAccess = async (userId: string) => {
    // Si aucun rôle n'est requis, l'accès est accordé simplement avec une session valide
    if (!requiredRoles || requiredRoles.length === 0) {
      setHasAccess(true);
      setLoading(false);
      return;
    }

    try {
      // Récupération du rôle de l'utilisateur
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
        setHasAccess(false);
      } else if (data && requiredRoles.includes(data.role)) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des droits:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    // Rediriger vers la page de connexion
    navigate("/auth");
    return null;
  }

  if (!hasAccess && requiredRoles && requiredRoles.length > 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md p-8">
          <h1 className="text-2xl font-bold text-destructive">Accès refusé</h1>
          <p className="text-muted-foreground">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
            Cette fonctionnalité est réservée aux rôles : 
            {requiredRoles.map((role, i) => (
              <span key={role} className="font-semibold"> {role}{i < requiredRoles.length - 1 ? "," : ""}</span>
            ))}
          </p>
          <Button onClick={() => navigate("/")}>
            Retourner à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // L'utilisateur est authentifié et a les droits nécessaires
  return <>{children}</>;
};

export default AuthCheck;
