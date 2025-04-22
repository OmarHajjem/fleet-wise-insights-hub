
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Filter, Search, Bell, Wrench, Settings, AlertTriangle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    id: 1,
    title: "Maintenance requise",
    message: "Le véhicule AZ-103 nécessite une maintenance planifiée.",
    type: "maintenance",
    priority: "medium",
    date: "22/04/2025 10:30",
    read: false,
  },
  {
    id: 2,
    title: "Niveau de carburant critique",
    message: "Le véhicule TY-208 a un niveau de carburant inférieur à 15%.",
    type: "alert",
    priority: "high",
    date: "22/04/2025 09:15",
    read: false,
  },
  {
    id: 3,
    title: "Maintenance terminée",
    message: "La maintenance du véhicule PL-542 a été terminée avec succès.",
    type: "maintenance",
    priority: "low",
    date: "21/04/2025 16:45",
    read: true,
  },
  {
    id: 4,
    title: "Nouvel utilisateur ajouté",
    message: "L'utilisateur Martin Dupont a été ajouté au système.",
    type: "system",
    priority: "low",
    date: "21/04/2025 14:20",
    read: true,
  },
  {
    id: 5,
    title: "Comportement de conduite à risque",
    message: "Freinage brusque détecté sur le véhicule KL-305.",
    type: "alert",
    priority: "high",
    date: "21/04/2025 11:05",
    read: false,
  },
  {
    id: 6,
    title: "Révision planifiée",
    message: "Une révision est planifiée pour le véhicule RT-789 le 03/05/2025.",
    type: "maintenance",
    priority: "medium",
    date: "20/04/2025 17:30",
    read: true,
  },
  {
    id: 7,
    title: "Excès de vitesse détecté",
    message: "Plusieurs excès de vitesse détectés pour le véhicule AZ-103.",
    type: "alert",
    priority: "high",
    date: "20/04/2025 14:10",
    read: true,
  },
];

const typeIcons = {
  maintenance: <Wrench className="h-4 w-4" />,
  alert: <AlertTriangle className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
};

const typeColors = {
  maintenance: "bg-blue-100 text-blue-800",
  alert: "bg-red-100 text-red-800",
  system: "bg-purple-100 text-purple-800",
};

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-green-100 text-green-800",
};

const priorityLabels = {
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread") return matchesSearch && !notification.read;
    if (activeTab === "maintenance") return matchesSearch && notification.type === "maintenance";
    if (activeTab === "alerts") return matchesSearch && notification.type === "alert";
    if (activeTab === "system") return matchesSearch && notification.type === "system";
    
    return matchesSearch;
  });

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Gérer les alertes et notifications du système
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Marquer tout comme lu</Button>
          <Button variant="outline">Paramètres</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notifications non lues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? "Nécessitent votre attention" : "Tout est à jour!"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alertes prioritaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                notifications.filter(
                  (n) => n.priority === "high" && !n.read
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Alertes nécessitant une action immédiate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenances à planifier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                notifications.filter(
                  (n) => n.type === "maintenance" && !n.read
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Rappels de maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Centre de notifications</CardTitle>
          <CardDescription>
            Gérer et visualiser toutes vos notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">
                  Toutes
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Non lues {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="alerts">Alertes</TabsTrigger>
                <TabsTrigger value="system">Système</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative w-[250px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={
                      notification.read
                        ? "border-muted"
                        : "border-l-4 border-l-primary"
                    }
                  >
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${typeColors[notification.type as keyof typeof typeColors]}`}>
                            {typeIcons[notification.type as keyof typeof typeIcons]}
                          </div>
                          <CardTitle className="text-base font-semibold">
                            {notification.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${
                              priorityColors[
                                notification.priority as keyof typeof priorityColors
                              ]
                            }`}
                          >
                            {priorityLabels[notification.priority as keyof typeof priorityLabels]}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {notification.date}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-0">
                      <p className="text-sm">{notification.message}</p>
                    </CardContent>
                    <CardContent className="pt-3 pb-2 flex justify-end">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          {notification.read ? "Marquer comme non lu" : "Marquer comme lu"}
                        </Button>
                        <Button variant="ghost" size="sm">
                          Voir les détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p>Aucune notification trouvée</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
