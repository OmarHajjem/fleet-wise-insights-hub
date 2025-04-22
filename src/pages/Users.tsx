
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, MoreHorizontal, Plus, Search, Users as UsersIcon } from "lucide-react";
import { useState } from "react";

const users = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "driver",
    assignedVehicle: "AZ-103",
    status: "active",
    lastActive: "Aujourd'hui à 10:25",
  },
  {
    id: 2,
    name: "Marie Lambert",
    email: "marie.lambert@example.com",
    role: "driver",
    assignedVehicle: "TY-208",
    status: "active",
    lastActive: "Aujourd'hui à 09:15",
  },
  {
    id: 3,
    name: "Lucas Martin",
    email: "lucas.martin@example.com",
    role: "driver",
    assignedVehicle: "KL-305",
    status: "inactive",
    lastActive: "Hier à 16:30",
  },
  {
    id: 4,
    name: "Sophie Dubois",
    email: "sophie.dubois@example.com",
    role: "driver",
    assignedVehicle: "PL-542",
    status: "active",
    lastActive: "Aujourd'hui à 11:42",
  },
  {
    id: 5,
    name: "Philippe Rousseau",
    email: "philippe.rousseau@example.com",
    role: "admin",
    assignedVehicle: "-",
    status: "active",
    lastActive: "Aujourd'hui à 08:50",
  },
];

const roleLabels = {
  driver: { label: "Conducteur", color: "bg-blue-100 text-blue-800" },
  admin: { label: "Administrateur", color: "bg-purple-100 text-purple-800" },
  manager: { label: "Gestionnaire", color: "bg-indigo-100 text-indigo-800" },
};

const statusLabels = {
  active: { label: "Actif", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactif", color: "bg-gray-100 text-gray-800" },
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérer les conducteurs et les administrateurs du système
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateurs enregistrés dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Véhicule assigné</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${roleLabels[user.role as keyof typeof roleLabels].color}`}
                        >
                          {roleLabels[user.role as keyof typeof roleLabels].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.assignedVehicle}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            statusLabels[user.status as keyof typeof statusLabels].color
                          }`}
                        >
                          {statusLabels[user.status as keyof typeof statusLabels].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Changer le véhicule</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Désactiver le compte
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <UsersIcon className="h-8 w-8 mb-2 opacity-50" />
                        <p>Aucun utilisateur trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
