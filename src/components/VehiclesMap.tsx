
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";
import { CarIcon } from 'lucide-react';

// Mapbox requires a public access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZmxlZXR3aXNlIiwiYSI6ImNsd3NmZHo5YzBjcmQya3BxcDR2MXJhbXQifQ.QZo7OA4zYr8LMsG9y5w0Zg';

type Vehicle = {
  id: string;
  model: string;
  license_plate: string;
  latitude: number;
  longitude: number;
  status: string;
};

const VehiclesMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [2.3522, 48.8566], // Paris coordinates
      zoom: 6
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Fetch active vehicles with location
  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, model, license_plate, latitude, longitude, status')
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) {
        console.error('Error fetching vehicles:', error);
        return;
      }

      setVehicles(data as Vehicle[]);
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  // Update map markers when vehicles change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    vehicles.forEach(vehicle => {
      const markerElement = document.createElement('div');
      markerElement.className = 'vehicle-marker';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.backgroundColor = 'var(--primary)';
      markerElement.style.borderRadius = '50%';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.color = 'white';
      markerElement.style.fontSize = '12px';
      markerElement.innerHTML = vehicle.license_plate.slice(0, 3);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${vehicle.model}</strong><br>
        Plaque: ${vehicle.license_plate}
      `);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([vehicle.longitude, vehicle.latitude])
        .setPopup(popup)
        .addTo(map.current);

      markers.current[vehicle.id] = marker;
    });
  }, [vehicles]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default VehiclesMap;
