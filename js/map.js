export const MAP_CONFIG = {
  zoom: 6,
  center: [40.0, -3.5]
};

export function initMap(ciudades, onCitySelect) {
  // Guard clause: si no hay ciudades, no intentamos construir el mapa con ellas.
  if (!Array.isArray(ciudades) || ciudades.length === 0) {
    console.error("initMap: 'ciudades' must be a non-empty array.");
    return null;
  }

  // Crea el mapa de Leaflet sobre el div #map usando la config compartida.
  const map = L.map("map").setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

  // Capa base (el fondo visual). Sin esto el mapa se ve gris/vacío.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(map);

  // Un marcador por ciudad. Este bucle no contiene lógica de riesgo/clima:
  // map.js solo sabe de geografía y selección, nada más.
  ciudades.forEach((ciudad) => {
    if (typeof ciudad.lat !== "number" || typeof ciudad.lon !== "number") {
      console.error(`initMap: ciudad "${ciudad.id || "desconocida"}" no tiene lat/lon válidos.`);
      return;
    }

    const marker = L.marker([ciudad.lat, ciudad.lon]).addTo(map);
    marker.bindPopup(ciudad.nombre);

    // Al hacer click, el único trabajo de map.js es avisar QUÉ ciudad se eligió.
    marker.on("click", () => {
      if (typeof onCitySelect === "function") {
        onCitySelect(ciudad);
      }
    });
  });

  return map;
}