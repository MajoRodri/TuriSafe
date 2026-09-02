const MAP_CONFIG = {
  zoom: 6,
  center: [40.0, -3.5],
};

const CITY_IMAGES = {
  madrid:    "madrid.jpg",
  "new-york": "newyork.jpg",
  tokyo:     "tokyo.jpg",
  sidney:    "sydney.jpg",
};

function buildPopup(ciudad) {
  const img = CITY_IMAGES[ciudad.id] || `${ciudad.id}.jpg`;

  return `
    <div class="map-popup">
      <div class="map-popup-img" style="background-image:url('assets/images/${img}')"></div>
      <div class="map-popup-body">
        <h3 class="map-popup-name">${ciudad.nombre}</h3>
        <a class="map-popup-link" href="pages/city.html?id=${ciudad.id}">Ver perfil completo →</a>
      </div>
    </div>`;
}

export function initMap(ciudades, onCitySelect) {
  if (!Array.isArray(ciudades) || ciudades.length === 0) {
    console.error("[map.js] 'ciudades' debe ser un array no vacío.");
    return null;
  }

  const map = L.map("map").setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  ciudades.forEach((ciudad) => {
    if (typeof ciudad.lat !== "number" || typeof ciudad.lon !== "number") {
      console.error(`[map.js] La ciudad "${ciudad.id || "desconocida"}" no tiene lat/lon válidos.`);
      return;
    }

    const marker = L.marker([ciudad.lat, ciudad.lon]).addTo(map);

    marker.bindPopup(buildPopup(ciudad), {
      maxWidth: 260,
      className: "turisafe-popup",
    });

    marker.on("mouseover", () => marker.openPopup());
    marker.on("click", () => {
      if (typeof onCitySelect === "function") onCitySelect(ciudad);
    });
  });

  return map;
}
