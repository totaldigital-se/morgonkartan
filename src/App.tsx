
import { useState, useCallback } from 'react';
import WeatherMap from './WeatherMap';
import Header from './Header';
import Footer from './Footer';
import InfoModal from './InfoModal'; // Import the InfoModal component

import './App.css';

function App() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false); // State to manage modal visibility

  const handleRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const handleDataLoaded = useCallback(() => {
    setLastUpdated(new Date());
  }, []);

  const handleOpenInfoModal = () => {
    setInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalOpen(false);
  };

  return (
    <div className="App">
      <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
      <main className="main-content">
        <WeatherMap refreshKey={refreshKey} onDataLoaded={handleDataLoaded} />
      </main>
      <Footer onInfoClick={handleOpenInfoModal} />
      {isInfoModalOpen && <InfoModal onClose={handleCloseInfoModal} />}
    </div>
  );
}

export default App;
