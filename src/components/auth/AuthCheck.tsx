
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/utils/staticData";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRoles?: Array<'admin' | 'manager' | 'driver' | 'mechanic'>;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children, requiredRoles }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const { user } = await authService.getUser();
        setUser(user);
        
        if (user) {
          // If no specific roles are required, any authenticated user has access
          if (!requiredRoles || requiredRoles.length === 0) {
            setHasAccess(true);
          } else {
            // Check if user has the required role
            const userRole = user.role;
            setHasAccess(requiredRoles.includes(userRole));
          }
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

    checkAuth();
    
    // Add listener for auth state changes
    const subscription = authService.onAuthStateChange((updatedUser) => {
      setUser(updatedUser);
      
      if (updatedUser) {
        if (!requiredRoles || requiredRoles.length === 0) {
          setHasAccess(true);
        } else {
          const userRole = updatedUser.role;
          setHasAccess(requiredRoles.includes(userRole));
        }
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    });
    
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [requiredRoles]);

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

  if (!user) {
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
