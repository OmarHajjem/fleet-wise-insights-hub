import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Loader, Upload, User } from "lucide-react";
import AuthCheck from "@/components/auth/AuthCheck";
import { authService, profileService } from "@/utils/staticData";

export default function Profile() {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { user } = await authService.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }
        
        const profile = await profileService.getProfile();
        setUser(user);
        
        if (profile) {
          setFormData({
            first_name: profile.firstName || "",
            last_name: profile.lastName || "",
            phone: profile.phone || "",
          });
          
          if (profile.avatar_url) {
            setAvatarPreview(profile.avatar_url);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Créer une prévisualisation
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Si un nouvel avatar a été sélectionné, le télécharger d'abord
      if (avatarFile) {
        const avatarUrl = await profileService.uploadAvatar(avatarFile);
        setAvatarPreview(avatarUrl);
        setAvatarFile(null);
      }
      
      // Mettre à jour les informations du profil
      await profileService.updateProfile({
        firstName: formData.first_name,
        lastName: formData.last_name,
        phone: formData.phone
      });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthCheck>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
          <p className="text-muted-foreground">
            Gérer vos informations personnelles
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
                <CardDescription>Personnalisez votre photo</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarPreview || ""} alt="Avatar" />
                  <AvatarFallback className="text-4xl">
                    {formData.first_name && formData.last_name
                      ? `${formData.first_name[0]}${formData.last_name[0]}`.toUpperCase()
                      : <User className="h-12 w-12" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="avatar"
                    className="flex cursor-pointer items-center justify-center rounded-md border border-dashed p-3 text-center hover:border-primary"
                  >
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Cliquez pour télécharger une photo
                      </span>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name || ""}
                        onChange={handleInputChange}
                        placeholder="Prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name || ""}
                        onChange={handleInputChange}
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {(isLoading) ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer les modifications"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AuthCheck>
  );
}
