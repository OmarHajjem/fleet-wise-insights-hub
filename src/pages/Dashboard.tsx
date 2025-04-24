
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Users, Wrench, Bell, Building } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import VehiclesMap from "@/components/VehiclesMap";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre plateforme FleetWise de gestion de parc automobile.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Véhicules</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
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
            <div className="text-2xl font-bold">45</div>
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
            <div className="text-2xl font-bold">12</div>
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
    </div>
  );
}
