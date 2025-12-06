import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import L from 'leaflet';
import Modal from 'react-modal';
import Routing from './Routing';
import SpecialDay from './SpecialDay';
import './WeatherMap.css';
import type { WeatherData } from './types';
import { FaSpotify } from 'react-icons/fa';
import Clock from './Clock';
import HistoricalWeather from './HistoricalWeather';
import SpotifyPlaylists from './SpotifyPlaylists';

const API_KEY = '68d40ed6fc7e43c228f3488a57a10df9'; // Replace with your OpenWeatherMap API key
const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes

Modal.setAppElement('#root');

interface TileLayerData {
  url: string;
  attribution: string;
}

interface WeatherOverlay {
  url?: string;
  attribution?: string;
  component?: React.FC<{ map: L.Map }>;
}

const tileLayers: { [key: string]: TileLayerData } = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  geoportail: {
    url: 'https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
  },
  geoportailorto: {
    url: 'https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
  },
};

const weatherOverlays: { [key: string]: WeatherOverlay } = {
  rain: {
    url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap',
  },
  temperature: {
    url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap',
  },
  clouds: {
    url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap',
  },
};

const OverlayRenderer = ({ activeWeatherOverlays }: { activeWeatherOverlays: string[] }) => {
  const map = useMap();
  
  return (
    <>
      {activeWeatherOverlays.map(overlay => {
        const activeOverlay = weatherOverlays[overlay];
        if (!activeOverlay) return null;

        if (activeOverlay.url) {
          return <TileLayer key={overlay} url={activeOverlay.url} attribution={activeOverlay.attribution} />;
        }

        if (activeOverlay.component) {
          const OverlayComponent = activeOverlay.component;
          return <OverlayComponent key={overlay} map={map} />;
        }

        return null;
      })}
    </>
  );
};

const cities = [
  { name: 'Stockholm', lat: 59.3293, lon: 18.0686, webcamurl: 'https://webcamcollections.com/countries/sweden/stockholm/flottsbro' },
  { name: 'Gothenburg', lat: 57.7089, lon: 11.9746, webcamurl: 'https://www.vadernu.com/europe/sweden/vastra-gotaland/goteborgs-stad/goteborg/webcam' },
  { name: 'Uppsala', lat: 59.8586, lon: 17.6389, webcamurl: 'https://www.vadernu.com/europe/sweden/uppsala/webcam' },
  { name: 'Östersund', lat: 63.1767, lon: 14.6361, webcamurl: 'https://www.vadernu.com/europe/sweden/jamtland/ostersunds-kommun/ostersund/webcam' },
  { name: 'Linköping', lat: 58.4108, lon: 15.6214, webcamurl: 'https://www.vackertvader.se/webbkamera/link%C3%B6ping' },
  { name: 'Örebro', lat: 59.2753, lon: 15.2134, webcamurl: 'https://www.vadernu.com/europe/sweden/orebro/webcam' },
  { name: 'Lidköping', lat: 58.5051, lon: 13.1558, webcamurl: 'https://www.vadernu.com/europe/sweden/vastra-gotaland/lidkopings-kommun/lidkoping/webcam' },
  { name: 'Kumla', lat: 59.1275, lon: 15.1432, webcamurl: 'https://www.vackertvader.se/webbkamera/kumla' },
  { name: 'Alingsås', lat: 57.9296, lon: 12.5323, webcamurl: 'https://www.vackertvader.se/webbkamera/g%C3%B6tarondellen-2' },
  { name: 'Båstad', lat: 56.4319, lon: 12.8305, webcamurl: 'https://www.vadernu.com/europe/sweden/skane/bastads-kommun/bastad/webcam' },
  { name: 'Katrineholm', lat: 59.0031, lon: 16.2055, webcamurl: 'https://www.weatherbug.com/traffic-cam/katrineholm-sodermanlands-sw' },
  { name: 'Degerfors', lat: 59.2373, lon: 14.4307, webcamurl: 'http://www.insecam.org/en/bycity/Degerfors/' },
  { name: 'Varberg', lat: 57.1056, lon: 12.2536, webcamurl: 'https://www.vadernu.com/europe/sweden/halland/varbergs-kommun/varberg/webcam' },
  { name: 'Mariehamn', lat: 60.0972, lon: 19.9454, webcamurl: 'https://www.vadernu.com/europe/aland-islands/mariehamns-stad/mariehamn/webcam' },
];

// Sort cities from south to north to create a more logical path for the polyline
cities.sort((a, b) => a.lat - b.lat);

interface WeatherMapProps {
  refreshKey: number;
  onDataLoaded: () => void;
}

const WeatherMap = ({ refreshKey, onDataLoaded }: WeatherMapProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [bestWeatherCity, setBestWeatherCity] = useState<string | null>(null);
  const [bestWeatherCityCoordinates, setBestWeatherCityCoordinates] = useState<L.LatLng | null>(null);
  const [snowingCities, setSnowingCities] = useState<L.LatLng[]>([]);
  const [activeTileLayer, setActiveTileLayer] = useState('dark');
  const [activeWeatherOverlay, setActiveWeatherOverlay] = useState<string>('rain');
  const [showSpotify, setShowSpotify] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<{lat: number, lon: number, name: string} | null>(null);

  const handleMarkerClick = (city: {lat: number, lon: number, name: string}) => {
    setSelectedCity(city);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCity(null);
  };

  const handleWeatherOverlayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveWeatherOverlay(e.target.value);
  };

  const fetchWeatherData = useCallback(async () => {
    const cachedData = localStorage.getItem('weatherData');
    const cachedTimestamp = localStorage.getItem('weatherDataTimestamp');

    if (cachedData && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < CACHE_EXPIRATION) {
      const data = JSON.parse(cachedData);
      setWeatherData(data);
      onDataLoaded();
      processWeatherData(data);
      return;
    }

    const data = await Promise.all(
      cities.map(async (city) => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
        );
        return response.data;
      })
    );
    
    localStorage.setItem('weatherData', JSON.stringify(data));
    localStorage.setItem('weatherDataTimestamp', Date.now().toString());
    setWeatherData(data);
    onDataLoaded();
    processWeatherData(data);
  }, [onDataLoaded]);

  const processWeatherData = (data: WeatherData[]) => {
    // Determine best weather
    let bestWeather = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i].main.temp > bestWeather.main.temp) {
        bestWeather = data[i];
      }
    }
    setBestWeatherCity(bestWeather.name);
    setBestWeatherCityCoordinates(L.latLng(bestWeather.coord.lat, bestWeather.coord.lon));

    // Determine snowing cities
    const snowing: L.LatLng[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].snow && data[i].snow['1h'] > 0) {
        snowing.push(L.latLng(data[i].coord.lat, data[i].coord.lon));
      }
    }
    setSnowingCities(snowing);
  };

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData, refreshKey]);

  const cityWaypoints: L.LatLng[] = cities.map(city => L.latLng(city.lat, city.lon));

  // Calculate the bounds of the cities
  const latitudes = cities.map(c => c.lat);
  const longitudes = cities.map(c => c.lon);
  const southWest: L.LatLngTuple = [Math.min(...latitudes), Math.min(...longitudes)];
  const northEast: L.LatLngTuple = [Math.max(...latitudes), Math.max(...longitudes)];
  const cityBounds = L.latLngBounds(southWest, northEast);
  const paddedBounds = cityBounds.pad(0.5);

  return (
    <div className="map-container-wrapper">
      <div className="map-fixed-width-container">
        <MapContainer
          bounds={paddedBounds}
          style={{ height: '100%', width: '100%' }}
          minZoom={6}
          zoomControl={false}
        >
          <TileLayer
            key={activeTileLayer}
            url={tileLayers[activeTileLayer].url}
            attribution={tileLayers[activeTileLayer].attribution}
          />
          <OverlayRenderer activeWeatherOverlays={activeWeatherOverlay !== 'none' ? [activeWeatherOverlay] : []} />
          <SpecialDay />
          {weatherData.length > 0 && weatherData.map((data, index) => {
            const isBestWeather = data.name === bestWeatherCity;
            const weatherIcon = new L.Icon({
              iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
              iconSize: isBestWeather ? [80, 80] : [50, 50],
              iconAnchor: isBestWeather ? [40, 40] : [25, 25],
              popupAnchor: [0, -25],
              className: 'weather-icon-img',
            });

            return (
              <Marker 
                key={index} 
                position={[cities[index].lat, cities[index].lon]} 
                icon={weatherIcon}
                eventHandlers={{
                  click: () => handleMarkerClick({lat: cities[index].lat, lon: cities[index].lon, name: data.name}),
                }}
              >
                <Popup className="custom-popup">
                  <div>
                    <h2>{data.name}</h2>
                    <p>Temperature: {data.main.temp}°C</p>
                    <p>Humidity: {data.main.humidity}%</p>
                    <p>Weather: {data.weather[0].description}</p>
                    {cities[index].webcamurl && <a href={cities[index].webcamurl} target="_blank" rel="noopener noreferrer">View Webcam</a>}
                  </div>
                </Popup>
                <Tooltip className="transparent-tooltip" direction="top" offset={[0, 0]} opacity={1} permanent>
                  <span>{`${Math.round(data.main.temp)}°C`}</span>
                </Tooltip>
              </Marker>
            );
          })}
          {weatherData.length > 0 && <Routing waypoints={cityWaypoints} />}
          {bestWeatherCityCoordinates && (
            <Circle center={bestWeatherCityCoordinates} radius={50000} color="#ff4b00" />
          )}
          {snowingCities.map((city, index) => (
            <Circle key={index} center={city} radius={50000} color="#add8e6" />
          ))}
        </MapContainer>
        <Clock />
        <div className="layer-control">
          <select value={activeTileLayer} onChange={e => setActiveTileLayer(e.target.value)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="satellite">Satellite</option>
            <option value="geoportail">Geoportail France</option>
            <option value="geoportailorto">Geoportail France orto</option>
          </select>
          <select value={activeWeatherOverlay} onChange={handleWeatherOverlayChange}>
            <option value="none">None</option>
            {Object.keys(weatherOverlays).map(key => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button className="spotify-button" onClick={() => setShowSpotify(!showSpotify)}>
          <FaSpotify />
        </button>
        {showSpotify && <SpotifyPlaylists />}
        {selectedCity && (
          <HistoricalWeather
            lat={selectedCity.lat}
            lon={selectedCity.lon}
            cityName={selectedCity.name}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default WeatherMap;
