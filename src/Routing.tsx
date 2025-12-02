import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap } from 'react-leaflet';

interface RoutingProps {
  waypoints: L.LatLng[];
}

const Routing: React.FC<RoutingProps> = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length === 0) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      show: false, // Hide the default routing instructions
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: '#00bfff', opacity: 0.8, weight: 2 }],
        extendToWaypoints: true,
        missingRouteTolerance: 100,
      },
      // @ts-ignore
      createMarker: () => null, // Disable default markers
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints]);

  return null;
};

export default Routing;
