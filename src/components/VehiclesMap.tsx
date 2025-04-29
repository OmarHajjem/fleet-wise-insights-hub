
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const VehiclesMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Vous devrez obtenir votre propre clé API Mapbox pour une utilisation en production
      mapboxgl.accessToken = 'pk.eyJ1IjoiZmxlZXR3aXNlIiwiYSI6ImNsd3NmZHo5YzBjcmQya3BxcDR2MXJhbXQifQ.QZo7OA4zYr8LMsG9y5w0Zg';
      
      // Cette clé est pour démonstration uniquement et ne fonctionnera pas en production
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [2.3522, 48.8566], // Paris
        zoom: 11
      });

      // Nettoyage lors du démontage du composant
      return () => {
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
      // Si la carte ne peut pas être chargée, on ne fait rien
      // Le fallback sera affiché
    }
  }, []);

  // Vérifie si mapboxgl est disponible (pour le SSR)
  const isMapboxAvailable = typeof mapboxgl !== 'undefined';

  return (
    <div className="h-[300px] bg-slate-100 rounded-md border border-slate-200">
      {isMapboxAvailable ? (
        <div ref={mapContainer} className="h-full w-full" />
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
