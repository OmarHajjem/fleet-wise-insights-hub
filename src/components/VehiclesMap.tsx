
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const VehiclesMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem('mapboxToken') || '';
  });
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem('mapboxToken'));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [2.3522, 48.8566], // Paris
        zoom: 11
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
      });

      // Nettoyage lors du démontage du composant
      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
      setMapError("Impossible d'initialiser la carte. Vérifiez votre token Mapbox.");
      // Si la carte ne peut pas être chargée, on ne fait rien
      // Le fallback sera affiché
    }
  };

  useEffect(() => {
    if (mapboxToken && !showTokenInput) {
      initializeMap(mapboxToken);
    }
  }, [mapboxToken, showTokenInput]);

  const handleSaveToken = () => {
    if (mapboxToken) {
      localStorage.setItem('mapboxToken', mapboxToken);
      setShowTokenInput(false);
      toast({
        title: "Token enregistré",
        description: "Votre token Mapbox a été enregistré."
      });
      initializeMap(mapboxToken);
    } else {
      setMapError("Veuillez entrer un token valide.");
    }
  };

  const handleResetToken = () => {
    localStorage.removeItem('mapboxToken');
    setMapboxToken('');
    setShowTokenInput(true);
    setMapLoaded(false);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  // Vérifie si mapboxgl est disponible (pour le SSR)
  const isMapboxAvailable = typeof mapboxgl !== 'undefined';

  if (showTokenInput) {
    return (
      <div className="h-[300px] bg-slate-100 rounded-md border border-slate-200 p-4 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Configuration de la carte</h3>
            <p className="text-sm text-muted-foreground">
              Pour afficher la carte, vous devez fournir un token Mapbox.
              <br />
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Obtenir un token Mapbox
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Token Mapbox</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUxMjM0NTY3ODkwIn0.example"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            {mapError && (
              <div className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{mapError}</span>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleSaveToken}
            disabled={!mapboxToken}
          >
            Enregistrer et afficher la carte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px] bg-slate-100 rounded-md border border-slate-200 relative">
      {isMapboxAvailable ? (
        <>
          <div ref={mapContainer} className="h-full w-full" />
          {mapLoaded && (
            <div className="absolute top-2 right-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleResetToken}
              >
                Modifier le token
              </Button>
            </div>
          )}
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 bg-opacity-80">
              <div className="text-center p-4 rounded-lg bg-white shadow-lg">
                <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-500">{mapError}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={handleResetToken}
                >
                  Modifier le token
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Carte de localisation</p>
            <p className="text-sm">(Intégration de carte à venir)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesMap;
