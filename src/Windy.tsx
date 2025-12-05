
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-velocity/dist/leaflet-velocity.css';
import 'leaflet-velocity/dist/leaflet-velocity.js';
import windyData from './windy.json';

const Windy = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let velocityLayer: any = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    map.whenReady(() => {
      timer = setTimeout(() => {
        const mapSize = map.getSize();
        if (mapSize.x > 0 && mapSize.y > 0) {
          velocityLayer = (L as any).velocityLayer({
            displayValues: true,
            displayOptions: {
              velocityType: 'Wind',
              position: 'bottomleft',
              emptyString: 'No wind data',
              angleConvention: 'bearing',
              speedUnit: 'm/s',
            },
            data: windyData,
            minVelocity: 0,
            maxVelocity: 10,
            velocityScale: 0.05,
            colorScale: [
              'rgb(36,104, 181)', 'rgb(60,157, 194)', 'rgb(128,205,193)',
              'rgb(151,218,168)', 'rgb(198,231,181)', 'rgb(238,247,217)',
              'rgb(255,238,159)', 'rgb(252,217,125)', 'rgb(255,182,100)',
              'rgb(252,150,75)', 'rgb(250,112,52)', 'rgb(245,64,32)',
              'rgb(237,45,28)', 'rgb(220,24,32)', 'rgb(180,0,35)',
            ],
          });
          velocityLayer.addTo(map);
        }
      }, 0);
    });

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (velocityLayer) {
        velocityLayer.removeFrom(map);
      }
    };
  }, [map]);

  return null;
};

export default Windy;
