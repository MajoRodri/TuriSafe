/**
 * Obtiene datos meteorológicos de la API Open-Meteo.
 * @param {number} lat - Latitud de la ciudad.
 * @param {number} lon - Longitud de la ciudad.
 * @returns {Promise<Object>} Datos limpios: temperatura, precipitación, viento, etc.
 */
export async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=precipitation_probability&timezone=auto`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Extraemos los datos actuales y la probabilidad de precipitación (la primera hora del array)
        const current = data.current;
        const probPrecipitation = data.hourly?.precipitation_probability?.[0] || 0;

        return {
            temperature: current.temperature_2m,
            apparentTemperature: current.apparent_temperature,
            precipitation: current.precipitation,
            precipitationProbability: probPrecipitation,
            wind: current.wind_speed_10m,
            windGusts: current.wind_gusts_10m,
            weatherCode: current.weather_code,
            humidity: current.relative_humidity_2m,
            isDay: current.is_day,
            timestamp: current.time,
            units: {
                temp: data.current_units.temperature_2m,
                wind: data.current_units.wind_speed_10m,
                precip: data.current_units.precipitation
            }
        };

    } catch (error) {
        console.error("Error al obtener el clima:", error);
        throw error; // Re-lanzamos para que el llamador pueda manejar el error (ej. mostrar alerta)
    }
}
