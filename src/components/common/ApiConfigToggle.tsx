
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export const ApiConfigToggle = () => {
  const [useReal, setUseReal] = useState(
    localStorage.getItem("useRealApi") === "true"
  );
  const [apiUrl, setApiUrl] = useState<string>(
    localStorage.getItem("apiBaseUrl") || "http://localhost:8080/api"
  );
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Initialiser avec la valeur par défaut si non définie
    if (localStorage.getItem("useRealApi") === null) {
      localStorage.setItem("useRealApi", "false");
    }
    
    if (localStorage.getItem("apiBaseUrl") === null) {
      localStorage.setItem("apiBaseUrl", "http://localhost:8080/api");
    }
  }, []);
  
  const handleToggle = () => {
    const newValue = !useReal;
    setUseReal(newValue);
    localStorage.setItem("useRealApi", newValue ? "true" : "false");
    
    toast({
      title: newValue ? "API réelle activée" : "Données fictives activées",
      description: newValue 
        ? "L'application utilise maintenant l'API réelle." 
        : "L'application utilise maintenant des données fictives.",
    });
    
    // Recharger la page pour appliquer le changement si nécessaire
    // window.location.reload();
  };
  
  const saveApiUrl = () => {
    localStorage.setItem("apiBaseUrl", apiUrl);
    setIsEditing(false);
    
    toast({
      title: "URL de l'API mise à jour",
      description: `L'URL de l'API est maintenant: ${apiUrl}`,
    });
  };
  
  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <h3 className="text-lg font-medium">Configuration de l'API</h3>
      
      <div className="flex items-center justify-between">
        <span>Utiliser l'API réelle:</span>
        <Switch
          checked={useReal}
          onCheckedChange={handleToggle}
        />
      </div>
      
      <div className="text-sm">
        <span className={useReal ? "text-green-600 dark:text-green-400 font-medium" : "text-amber-600 dark:text-amber-400 font-medium"}>
          {useReal ? "Activé - Utilisation de l'API réelle" : "Désactivé - Utilisation des données fictives"}
        </span>
      </div>
      
      <div className="flex flex-col space-y-2">
        <span className="text-sm">URL de l'API:</span>
        {isEditing ? (
          <div className="flex space-x-2">
            <input
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 h-10 px-3 py-2 text-sm border rounded-md"
              placeholder="http://localhost:8080/api"
            />
            <Button size="sm" onClick={saveApiUrl}>Enregistrer</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{apiUrl}</span>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Modifier</Button>
          </div>
        )}
      </div>
    </div>
  );
};
