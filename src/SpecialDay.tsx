import './SpecialDay.css';
import { useBirthdays } from './hooks/useBirthdays';
import { useQuote } from './hooks/useQuote';
import { useInfo } from './hooks/useInfo';
import { format, getDay, isLastDayOfMonth } from 'date-fns';
import LunarPhaseIcon from './LunarPhaseIcon';

const SpecialDay = () => {
  const birthday = useBirthdays();
  const quote = useQuote();
  const info = useInfo();

  const specialDays = [
    { label: 'Födelsedag', value: birthday },
    { label: 'Namnsdag', value: (info.names || []).join(', ') },
    { label: 'Liturgisk dag', value: info.liturgical },
    { label: 'Temadag', value: (info.awareness_day_names || []).join(', ') },
    { label: 'Dagens citat', value: quote },
  ].filter(item => item.value);

  const today = new Date();
  const isFriday = getDay(today) === 5;
  const isLastDay = isLastDayOfMonth(today);

  return (
    <>
      {(specialDays.length > 0 || Object.keys(info).length > 0) && (
        <div className="special-day-container">
          <div className="calendar-header">
            <div className="day-number">{format(today, 'd')}</div>
            <div className="month-year">
              <div>{format(today, 'MMMM')}</div>
              <div className="week-info">vecka {info.week}</div>
            </div>
          </div>
          <ul className="special-day-list">
            {specialDays.map((day, index) => (
              <li key={index} className={`special-day-item ${day.label === 'Födelsedag' ? 'birthday' : ''}`}>
                <div className="item-label">{day.label}</div>
                <div className="item-value">{day.value}</div>
              </li>
            ))}
          </ul>
          {isFriday && (
            <div className="friday-reminder">
              Glöm inte tidredovisningen
            </div>
          )}
          {isLastDay && (
            <div className="last-day-reminder">
              Glöm ej TF tidredovisning
            </div>
          )}
          {info.lunar_phase && 
            <div className="lunar-phase">
                <LunarPhaseIcon phase={info.lunar_phase} />
            </div>
          }
        </div>
      )}
    </>
  );
};

export default SpecialDay;
