import React, { useEffect } from 'react';
import './Windy.css';

// Declare the windyInit function and L for Leaflet to avoid TypeScript errors
declare global {
  interface Window {
    windyInit: (options: any, callback: (windyAPI: any) => void) => void;
    L: any;
  }
}

const Windy: React.FC = () => {
  useEffect(() => {
    const options = {
      // Required: API key
      key: 'UnahfwPbRhACQaDEPhztZ8JuQgfa0EUC', 

      // Put additional console output
      verbose: true,

      // Optional: Initial state of the map
      lat: 50.4,
      lon: 14.3,
      zoom: 5,
    };

    // Initialize Windy API
    window.windyInit(options, windyAPI => {
      // windyAPI is ready, and contain 'map', 'store',
      // 'picker' and other usefull stuff

      const { map } = windyAPI;
      // .map is instance of Leaflet map

      window.L.popup()
        .setLatLng([50.4, 14.3])
        .setContent('Hello World')
        .openOn(map);
    });
  }, []); // Empty dependency array to run only once

  return <div id="windy"></div>;
};

export default Windy;
