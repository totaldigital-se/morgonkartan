export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  coord: {
    lat: number;
    lon: number;
  };
  snow: {
    '1h': number;
  };
}
