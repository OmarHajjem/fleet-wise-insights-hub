
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Car, Users, Activity, AlertTriangle, ArrowDown, ArrowUp, Leaf, Gauge } from "lucide-react";
import VehiclesMap from '../components/VehiclesMap';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";

const data = [
  { mois: 'Jan', maintenance: 4000, utilisation: 2400, incidents: 1200 },
  { mois: 'Fév', maintenance: 3000, utilisation: 1398, incidents: 900 },
  { mois: 'Mar', maintenance: 2000, utilisation: 9800, incidents: 700 },
  { mois: 'Avr', maintenance: 2780, utilisation: 3908, incidents: 500 },
  { mois: 'Mai', maintenance: 1890, utilisation: 4800, incidents: 400 },
  { mois: 'Juin', maintenance: 2390, utilisation: 3800, incidents: 600 },
];

const ecoVehicles = [
  { id: 1, name: 'Renault Kangoo E-Tech', type: 'Électrique', efficiency: 92, status: 'En service' },
  { id: 2, name: 'Peugeot e-Expert', type: 'Électrique', efficiency: 88, status: 'En maintenance' },
  { id: 3, name: 'Tesla Model 3', type: 'Électrique', efficiency: 95, status: 'En service' },
];

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de Bord FleetWise</h1>
        <Button>Télécharger le rapport</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Véhicules Actifs</p>
              <h2 className="text-3xl font-bold">42</h2>
              <p className="text-xs flex items-center text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> 
                <span>+5% cette semaine</span>
              </p>
            </div>
            <div className="h-12 w-12 bg-fleet-100 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-fleet-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chauffeurs</p>
              <h2 className="text-3xl font-bold">38</h2>
              <p className="text-xs flex items-center text-red-600 mt-1">
                <ArrowDown className="h-3 w-3 mr-1" /> 
                <span>-2% cette semaine</span>
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Km Parcourus</p>
              <h2 className="text-3xl font-bold">12,453</h2>
              <p className="text-xs flex items-center text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" /> 
                <span>+12% ce mois</span>
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-700" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alertes</p>
              <h2 className="text-3xl font-bold">7</h2>
              <p className="text-xs flex items-center text-amber-600 mt-1">
                <span>3 prioritaires</span>
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Localisation des Véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <VehiclesMap />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Statistiques Mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="maintenance" fill="#0284c7" name="Maintenance" />
                <Bar dataKey="utilisation" fill="#16a34a" name="Utilisation" />
                <Bar dataKey="incidents" fill="#f59e0b" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Véhicules Écologiques</CardTitle>
          <Badge variant="outline" className="flex gap-1">
            <Leaf className="h-3.5 w-3.5 text-eco-600" />
            <span>Faible Émission</span>
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ecoVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium">{vehicle.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({vehicle.type})</span>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="h-4 w-4 text-eco-600 mr-1" />
                    <span className="text-sm">{vehicle.efficiency}% efficacité</span>
                  </div>
                </div>
                <Progress value={vehicle.efficiency} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{vehicle.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
