import { useState, useEffect } from 'react';
import './DateDisplay.css';

interface DateDisplayProps {
  lastUpdated: Date | null;
}

const getWeekNumber = (d: Date) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
};

const DateDisplay = ({ lastUpdated }: DateDisplayProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const weekNumber = getWeekNumber(currentDate);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return (
    <div className="date-display-container">
      <div className="date-info">
        <p>{formattedDate}</p>
        <p>Vecka: {weekNumber}</p>
        {lastUpdated && <p>Senast uppdaterad: {lastUpdated.toLocaleTimeString()}</p>}
      </div>
    </div>
  );
};

export default DateDisplay;
