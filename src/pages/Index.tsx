
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Car, Users, Activity, AlertTriangle } from "lucide-react";
import VehiclesMap from '../components/VehiclesMap';

const data = [
  { mois: 'Jan', maintenance: 4000, utilisation: 2400, incidents: 1200 },
  { mois: 'Fév', maintenance: 3000, utilisation: 1398, incidents: 900 },
  { mois: 'Mar', maintenance: 2000, utilisation: 9800, incidents: 700 },
  { mois: 'Avr', maintenance: 2780, utilisation: 3908, incidents: 500 },
  { mois: 'Mai', maintenance: 1890, utilisation: 4800, incidents: 400 },
  { mois: 'Juin', maintenance: 2390, utilisation: 3800, incidents: 600 },
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
    </div>
  );
};

export default Index;
