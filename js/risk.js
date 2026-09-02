
export function calculateRisk(weather) {
  // Apply MVP risk rules based on weather values
  // Priority: ALERTA > PRECAUCION > NORMAL
  
  if (!weather) {
    return {
      status: "NORMAL",
      reason: "Datos meteorológicos no disponibles."
    };
  }

  const wind = weather.wind || 0;
  const precipitation = weather.precipitation || 0;

  // Check ALERTA conditions
  if (wind >= 80 || precipitation >= 50) {
    const reasons = [];
    if (wind >= 80) reasons.push(`Viento muy fuerte (${wind} km/h)`);
    if (precipitation >= 50) reasons.push(`Precipitación alta (${precipitation} mm)`);
    
    return {
      status: "ALERTA",
      reason: reasons.join(" y ")
    };
  }

  // Check PRECAUCION conditions
  if (wind >= 50 || precipitation >= 20) {
    const reasons = [];
    if (wind >= 50) reasons.push(`Viento moderado (${wind} km/h)`);
    if (precipitation >= 20) reasons.push(`Precipitación moderada (${precipitation} mm)`);
    
    return {
      status: "PRECAUCION",
      reason: reasons.join(" y ")
    };
  }

  // Default to NORMAL
  return {
    status: "NORMAL",
    reason: "Condiciones meteorológicas normales."
  };
}
