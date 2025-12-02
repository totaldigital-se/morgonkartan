import { useState, useEffect } from 'react';
import { getDayOfYear, getYear } from 'date-fns';
import infoData from '../info.json';

interface DayInfo {
  day_in_month: number;
  day_in_year: number;
  day_in_week: number;
  week: number;
  names?: string[];
  holiday?: string;
  liturgical?: string;
  awareness_day_names?: string[];
  lunar_phase?: string;
}

export const useInfo = () => {
  const [info, setInfo] = useState<Partial<DayInfo>>({});

  useEffect(() => {
    const now = new Date();
    const dayOfYear = getDayOfYear(now);
    const year = getYear(now).toString();

    // @ts-ignore
    const yearData = infoData[year];

    if (yearData) {
        const todayInfo = yearData.find((d: any) => d.day_in_year === dayOfYear);

        if (todayInfo) {
          setInfo({
            day_in_month: todayInfo.day_in_month,
            day_in_year: todayInfo.day_in_year,
            day_in_week: todayInfo.day_in_week,
            week: todayInfo.week,
            names: todayInfo.names,
            holiday: todayInfo.holiday,
            liturgical: todayInfo.liturgical,
            awareness_day_names: todayInfo.awareness_day_names,
            lunar_phase: todayInfo.lunar_phase,
          });
        }
    }

  }, []);

  return info;
};
