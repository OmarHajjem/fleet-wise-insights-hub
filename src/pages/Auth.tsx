import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader, Lock, Mail, User } from "lucide-react";
import { authService, staticUsers } from "@/utils/staticData";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();

  // États pour le formulaire de connexion
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // États pour le formulaire d'inscription
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");

  useEffect(() => {
    console.log("Auth: Component mounted, checking existing session...");
    
    const checkSession = async () => {
      try {
        const { user } = await authService.getUser();
        if (user) {
          console.log("Auth: User already logged in, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Auth: Error checking session:", error);
      }
    };

    checkSession();

    const subscription = authService.onAuthStateChange((user) => {
      console.log("Auth: Auth state changed:", user);
      if (user) {
        console.log("Auth: User logged in, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Auth: Attempting login with:", loginEmail);
      
      const result = await authService.signIn(loginEmail, loginPassword);
      console.log("Auth: Login result:", result);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord."
      });
      
      // La redirection sera gérée par le listener onAuthStateChange
    } catch (error: any) {
      console.error("Auth: Login error:", error);
      
      let errorMessage = "Une erreur est survenue lors de la connexion.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation basique
    if (!signupEmail || !signupPassword) {
      toast({
        title: "Erreur d'inscription",
        description: "L'email et le mot de passe sont requis.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Erreur d'inscription",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simuler une inscription
      const emailExists = staticUsers.some(user => user.email === signupEmail);
      if (emailExists) {
        throw new Error("Cette adresse email est déjà utilisée.");
      }
      
      // Dans une vraie app, nous ajouterions l'utilisateur à la base de données ici
      
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."
      });
      
      setActiveTab("login");
      // Réinitialiser les champs
      setSignupEmail("");
      setSignupPassword("");
      setSignupFirstName("");
      setSignupLastName("");
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">FleetManager</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestion simplifiée de votre flotte automobile
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-2">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Connexion</CardTitle>
                  <CardDescription>
                    Accédez à votre interface de gestion de flotte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="nom@entreprise.com"
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <a href="#" className="text-xs text-primary hover:underline">
                        Mot de passe oublié ?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        className="pl-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="border-2">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle>Créer un compte</CardTitle>
                  <CardDescription>
                    Inscription à la plateforme de gestion de flotte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname">Prénom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-firstname"
                          type="text"
                          placeholder="Jean"
                          className="pl-10"
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname">Nom</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-lastname"
                          type="text"
                          placeholder="Dupont"
                          className="pl-10"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="nom@entreprise.com"
                        className="pl-10"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        className="pl-10"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum 6 caractères
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            En vous connectant, vous acceptez nos{" "}
            <a href="#" className="text-primary hover:underline">
              conditions d'utilisation
            </a>{" "}
            et{" "}
            <a href="#" className="text-primary hover:underline">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
