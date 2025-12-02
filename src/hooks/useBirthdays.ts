import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import birthdaysData from '../birthdays.json';

interface Holiday {
    date: string;
    name: string;
}

const { holidays }: { holidays: Holiday[] } = birthdaysData;

export const useBirthdays = () => {
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    const today = format(new Date(), 'MM-dd');
    const holiday = holidays.find(h => h.date === today);

    if (holiday) {
        setBirthday(holiday.name);
    }
  }, []);

  return birthday;
};
