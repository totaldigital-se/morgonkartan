import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import quotesData from '../quotes.json';

export const useQuote = () => {
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const formattedDate = format(now, 'MM-dd');

    const foundQuote = quotesData.find(q => q.date === formattedDate);

    if (foundQuote) {
      setQuote(foundQuote.quote);
    }
  }, []);

  return quote;
};
