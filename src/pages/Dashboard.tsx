
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Users, Wrench, Bell, Building, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import VehiclesMap from "@/components/VehiclesMap";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { staticVehicles, staticUsers, usersData } from "@/utils/staticData";

export default function Dashboard() {
  const { role } = useUserRole();
  const [assignedVehicles, setAssignedVehicles] = useState<any[]>([]);
  const [maintenanceCount, setMaintenanceCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Simuler la récupération des informations utilisateur et véhicules en fonction du rôle
    if (role === 'driver') {
      // Pour un chauffeur, on récupère les véhicules qui lui sont assignés
      const userEmail = sessionStorage.getItem('userEmail') || '';
      const user = usersData.find(u => u.email === userEmail || u.role === 'driver');
      
      if (user) {
        setCurrentUser(user);
        // Filtrer les véhicules assignés à ce chauffeur
        const vehicles = staticVehicles.filter(v => v.driver_id === user.id);
        setAssignedVehicles(vehicles);
        
        // Compter le nombre de maintenances planifiées pour ces véhicules
        const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
        setMaintenanceCount(maintenance);
      }
    } else {
      // Pour les autres rôles, on montre tous les véhicules
      setAssignedVehicles(staticVehicles);
      setMaintenanceCount(staticVehicles.filter(v => v.status === 'maintenance').length);
    }
  }, [role]);

  // Générer le contenu du tableau de bord en fonction du rôle
  const renderDashboardContent = () => {
    if (role === 'driver') {
      return (
        <DriverDashboard 
          vehicles={assignedVehicles} 
          maintenanceCount={maintenanceCount}
          user={currentUser}
        />
      );
    } else if (role === 'mechanic') {
      return <MechanicDashboard />;
    } else {
      // Admin et manager ont la même vue
      return <AdminDashboard />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre plateforme FleetWise de gestion de parc automobile.
          {role === 'driver' && " Consultez les informations de vos véhicules assignés."}
          {role === 'mechanic' && " Consultez les opérations de maintenance en cours."}
        </p>
      </div>

      {renderDashboardContent()}
    </div>
  );
}

// Tableau de bord spécifique aux chauffeurs
function DriverDashboard({ vehicles, maintenanceCount, user }: { vehicles: any[], maintenanceCount: number, user: any }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Véhicules</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              Véhicules actuellement assignés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceCount}</div>
            <p className="text-xs text-muted-foreground">
              Véhicules en maintenance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niveau carburant</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.length > 0 
                ? Math.round(vehicles.reduce((sum, v) => sum + (v.fuel_level || 0), 0) / vehicles.length) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Niveau moyen de carburant
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Nouvelles notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {vehicles.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Mes véhicules assignés</CardTitle>
              <CardDescription>Liste et statut des véhicules qui vous sont assignés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-fleet-600" />
                        <h3 className="font-medium">{vehicle.name}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vehicle.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : vehicle.status === 'maintenance'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status === 'active' ? 'En service' : 
                         vehicle.status === 'maintenance' ? 'En maintenance' : 'Inactif'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Immatriculation</p>
                        <p className="font-medium">{vehicle.license_plate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Modèle</p>
                        <p className="font-medium">{vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dernière maintenance</p>
                        <p className="font-medium">{vehicle.last_maintenance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prochaine maintenance</p>
                        <p className="font-medium">{vehicle.nextMaintenance}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Niveau de carburant</span>
                        <span className="text-sm font-medium">{vehicle.fuel_level}%</span>
                      </div>
                      <Progress value={vehicle.fuel_level} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localisation des véhicules</CardTitle>
              <CardDescription>Positions en temps réel de vos véhicules</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <VehiclesMap />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun véhicule assigné</h3>
            <p className="text-center text-muted-foreground">
              Vous n'avez actuellement aucun véhicule assigné. Veuillez contacter votre gestionnaire.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}

// Tableau de bord pour les mécaniciens
function MechanicDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance en attente</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 urgentes requises
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules en service</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">
              Du parc est opérationnel
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garages disponibles</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Garages partenaires
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance effectuée</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance en cours</CardTitle>
          <CardDescription>Véhicules actuellement en maintenance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staticVehicles
              .filter(v => v.status === 'maintenance')
              .map(vehicle => (
                <div key={vehicle.id} className="flex items-start gap-4 p-3 border rounded-md">
                  <Car className="h-8 w-8 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{vehicle.name}</h3>
                        <p className="text-sm text-muted-foreground">{vehicle.license_plate}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                        En maintenance
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Conducteur</p>
                        <p className="text-sm">{vehicle.driver || "Non assigné"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Début maintenance</p>
                        <p className="text-sm">{vehicle.last_maintenance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {staticVehicles.filter(v => v.status === 'maintenance').length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Aucun véhicule en maintenance actuellement.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Tableau de bord pour les admins et managers
function AdminDashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Véhicules</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticVehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 ce mois-ci
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              +5 depuis le dernier mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance en attente</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticVehicles.filter(v => v.status === 'maintenance').length}</div>
            <p className="text-xs text-muted-foreground">
              3 urgentes requises
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garages partenaires</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Dans 5 villes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>État des véhicules</CardTitle>
                <CardDescription>Répartition par état de fonctionnement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-fleet-500" />
                      <div>En service</div>
                    </div>
                    <div>84%</div>
                  </div>
                  <Progress value={84} className="bg-muted h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div>En maintenance</div>
                    </div>
                    <div>12%</div>
                  </div>
                  <Progress value={12} className="bg-muted h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div>Hors service</div>
                    </div>
                    <div>4%</div>
                  </div>
                  <Progress value={4} className="bg-muted h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Consommation de carburant</CardTitle>
                <CardDescription>Consommation moyenne du mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[180px] items-center justify-center">
                  <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="text-4xl font-bold">7.2</div>
                    <div className="text-sm font-medium">L/100km</div>
                    <div className="flex items-center text-xs text-eco-600">
                      <span className="mr-1">↓</span> -5% par rapport au mois dernier
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Alertes récentes</CardTitle>
                <CardDescription>Alertes des dernières 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Maintenance requise</p>
                      <p className="text-sm text-muted-foreground">Véhicule AZ-103</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Niveau carburant critique</p>
                      <p className="text-sm text-muted-foreground">Véhicule TY-208</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-fleet-100">
                      <Bell className="h-3.5 w-3.5 text-fleet-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Révision planifiée</p>
                      <p className="text-sm text-muted-foreground">Véhicule KL-305</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Positions des véhicules</CardTitle>
              <CardDescription>Suivi en temps réel des véhicules en service</CardDescription>
            </CardHeader>
            <CardContent>
              <VehiclesMap />
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Historique des dernières activités sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 border-b pb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Nouveau véhicule ajouté</p>
                    <p className="text-sm text-muted-foreground">Toyota Corolla Hybrid - Immatriculation: TY-208</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Il y a 1h
                  </div>
                </div>
                <div className="flex items-center gap-4 border-b pb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Maintenance terminée</p>
                    <p className="text-sm text-muted-foreground">Remplacement des plaquettes de frein - Véhicule: PL-542</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Il y a 3h
                  </div>
                </div>
                <div className="flex items-center gap-4 border-b pb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Nouvel utilisateur</p>
                    <p className="text-sm text-muted-foreground">Martin Dupont ajouté comme conducteur</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Il y a 5h
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des données</CardTitle>
              <CardDescription>Visualisations et analytics avancés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">Les données d'analyse seront disponibles prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
              <CardDescription>Générer et consulter les rapports du système</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">Les rapports seront disponibles prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
