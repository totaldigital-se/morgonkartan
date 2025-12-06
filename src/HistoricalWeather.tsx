import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Modal from 'react-modal';
import './HistoricalWeather.css';

const API_KEY = '68d40ed6fc7e43c228f3488a57a10df9';

interface HistoricalWeatherProps {
  lat: number;
  lon: number;
  cityName: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

const HistoricalWeather: React.FC<HistoricalWeatherProps> = ({ lat, lon, cityName, isOpen, onRequestClose }) => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!isOpen) return;
      const promises = [];
      for (let i = 1; i <= 5; i++) {
        const dt = Math.floor(Date.now() / 1000) - i * 24 * 60 * 60;
        promises.push(
          axios.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${API_KEY}&units=metric`)
        );
      }
      const responses = await Promise.all(promises);
      const data = responses.map(response => response.data.current);
      setHistoricalData(data.map(d => ({ ...d, date: new Date(d.dt * 1000).toLocaleDateString() })));
    };
    fetchHistoricalData();
  }, [lat, lon, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Historical Weather"
      className="historical-weather-modal"
      overlayClassName="historical-weather-overlay"
    >
      <h2>Historical Weather for {cityName}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" name="Temperature (°C)" />
        </LineChart>
      </ResponsiveContainer>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default HistoricalWeather;
