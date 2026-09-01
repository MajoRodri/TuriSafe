export function calculateRisk(weather) {
  // TODO: Apply risk rules based on weather values.
  // Rule examples:
  //   wind >= 80 km/h          → ALERTA
  //   precipitation >= 50 mm   → ALERTA
  //   wind >= 50 km/h          → PRECAUCION
  //   precipitation >= 20 mm   → PRECAUCION
  //   otherwise                → NORMAL
  return {
    status: "NORMAL",
    reason: "Sin condiciones de riesgo detectadas."
  };
}
