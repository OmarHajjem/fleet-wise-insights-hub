
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export default function Settings() {
  const [accountForm, setAccountForm] = useState({
    name: "Administrateur",
    email: "admin@gestionflotte.fr",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    maintenance: true,
    fuelLevel: true,
    newDriver: false,
  });

  const [appSettings, setAppSettings] = useState({
    language: "fr",
    theme: "light",
    autoSave: true,
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (id: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [id]: !notificationSettings[id as keyof typeof notificationSettings],
    });
  };
  
  const handleAppSettingChange = (id: string, value: any) => {
    setAppSettings({
      ...appSettings,
      [id]: value,
    });
  };

  const saveAccount = () => {
    toast({
      title: "Compte mis à jour",
      description: "Vos informations de compte ont été mises à jour avec succès.",
    });
  };
  
  const saveNotifications = () => {
    toast({
      title: "Préférences de notification enregistrées",
      description: "Vos préférences de notification ont été mises à jour.",
    });
  };
  
  const saveAppSettings = () => {
    toast({
      title: "Paramètres d'application enregistrés",
      description: "Vos paramètres d'application ont été mis à jour.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre compte et de l'application
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles ici
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  value={accountForm.name}
                  onChange={handleAccountChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={accountForm.email}
                  onChange={handleAccountChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveAccount}>Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.email}
                  onCheckedChange={() => handleNotificationChange("email")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications de maintenance programmée
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.maintenance}
                  onCheckedChange={() => handleNotificationChange("maintenance")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Niveau de carburant</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertes de niveau de carburant bas
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.fuelLevel}
                  onCheckedChange={() => handleNotificationChange("fuelLevel")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouveaux conducteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications lors de l'ajout d'un nouveau conducteur
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newDriver}
                  onCheckedChange={() => handleNotificationChange("newDriver")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotifications}>Enregistrer les préférences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="application">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'application</CardTitle>
              <CardDescription>
                Personnalisez votre expérience d'utilisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select 
                  value={appSettings.language}
                  onValueChange={(value) => handleAppSettingChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select
                  value={appSettings.theme}
                  onValueChange={(value) => handleAppSettingChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarder automatiquement les modifications
                  </p>
                </div>
                <Switch
                  checked={appSettings.autoSave}
                  onCheckedChange={(checked) => handleAppSettingChange("autoSave", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveAppSettings}>Appliquer les paramètres</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
