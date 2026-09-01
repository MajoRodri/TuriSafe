export async function getWeather(lat, lon) {
  // TODO: Fetch current weather from Open-Meteo API.
  // Endpoint: https://api.open-meteo.com/v1/forecast
  // Params: latitude, longitude, current_weather=true, hourly=precipitation,windspeed_10m
  // TODO: Parse response and return normalized object below.
  return {
    temperature: null,
    precipitation: null,
    wind: null,
    timestamp: null
  };
}
