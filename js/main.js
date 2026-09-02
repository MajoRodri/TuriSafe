import { initMap } from "./map.js";
import { getWeather } from "./weather.js";
import { calculateRisk } from "./risk.js";
import { setDonationState } from "./donations.js";
import { saveCity } from "./offline.js";
import { showAlert, hideAlert } from "./alerts.js";
import { initReports } from "./reports.js";

const MONTHS = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

const CITY_IMAGES = {
  madrid: "madrid.jpg",
  "new-york": "newyork.jpg",
  tokyo: "tokyo.jpg",
  sidney: "sydney.jpg",
};

document.addEventListener("DOMContentLoaded", async () => {
  let ciudades = [];
  try {
    const res = await fetch("data/ciudades.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    ciudades = json.ciudades || [];
  } catch (err) {
    console.error("[main.js] Error al cargar ciudades.json:", err);
    return;
  }

  const cityPanel        = document.getElementById("city-panel");
  const cityBackdrop     = document.getElementById("city-backdrop");
  const cityPanelClose   = document.getElementById("city-panel-close");
  const cityHeaderImg    = document.getElementById("city-header-img");
  const cityNameEl       = document.getElementById("city-name");
  const cityStatusEl     = document.getElementById("city-status");
  const cityStatusReason = document.getElementById("city-status-reason");
  const citySummaryEl    = document.getElementById("city-summary");
  const cityVerMasEl     = document.getElementById("city-ver-mas");
  const weatherLoadingEl = document.getElementById("weather-loading");
  const panelBody        = cityPanel?.querySelector(".panel-body");
  const monthSelector    = document.getElementById("month-selector");
  const realtimeToggle   = document.getElementById("realtime-toggle");
  const searchInput      = document.getElementById("city-search");
  const searchResults    = document.getElementById("search-results");
  const searchClear      = document.getElementById("search-clear");
  const searchBtn        = document.getElementById("search-btn");

  let selectedCity   = null;
  let currentMonth   = MONTHS[new Date().getMonth()];
  let realtimeActive = true;
  let pendingCity    = null;

  if (monthSelector) monthSelector.value = currentMonth;
  if (realtimeToggle) realtimeToggle.checked = true;

  // Poblar el selector de ciudad del modal de reportes
  const reportCitySelect = document.getElementById("report-city-select");
  if (reportCitySelect) {
    ciudades.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nombre;
      reportCitySelect.appendChild(opt);
    });
  }

  const leafletMap = initMap(ciudades, onCitySelect);

  initReports();

  const simBtn = document.getElementById("alert-simulation-button");
  if (simBtn) {
    simBtn.addEventListener("click", () => {
      if (!selectedCity) return;
      const sim = { status: "ALERTA", reason: "Terremoto activo en la región. Sigue las indicaciones de las autoridades locales y evita desplazamientos no esenciales." };
      setStatus(sim);
      setDonationState("ALERTA");
      showAlert(`Alerta en ${selectedCity.nombre}: ${sim.reason}`);
      // Persiste la simulación para que city.html la recoja al navegar
      sessionStorage.setItem(`turisafe-sim-${selectedCity.id}`, JSON.stringify(sim));
      simBtn.textContent = "✓ Alerta simulada";
      simBtn.disabled = true;
    });
  }

  document.addEventListener("tab:explorar", () => {
    if (leafletMap) leafletMap.invalidateSize();
    if (pendingCity) {
      const ciudad = pendingCity;
      pendingCity = null;
      onCitySelect(ciudad);
    }
  });

  async function onCitySelect(ciudad) {
    selectedCity = ciudad;
    openPanel();

    if (cityHeaderImg) {
      const img = CITY_IMAGES[ciudad.id] || `${ciudad.id}.jpg`;
      cityHeaderImg.style.backgroundImage = `url('assets/images/${img}')`;
    }
    if (cityNameEl) cityNameEl.textContent = ciudad.nombre;

    const monthData = ciudad.meses?.[currentMonth] || {};
    if (citySummaryEl) {
      citySummaryEl.textContent = monthData.riesgos?.length
        ? `Riesgos en ${currentMonth}: ${monthData.riesgos.join(", ")}.`
        : ciudad.nombre;
    }
    if (cityVerMasEl) cityVerMasEl.href = `pages/city.html?id=${ciudad.id}`;

    if (panelBody) panelBody.style.display = "none";

    setStatus({ status: "NORMAL", reason: "" });
    setDonationState("NORMAL");

    saveCity(ciudad);

    if (reportCitySelect) reportCitySelect.value = ciudad.id;

    if (realtimeActive) await fetchAndApplyWeather();
  }

  if (monthSelector) {
    monthSelector.addEventListener("change", () => {
      currentMonth = monthSelector.value;
      if (!selectedCity) return;
      const md = selectedCity.meses?.[currentMonth] || {};
      if (citySummaryEl) {
        citySummaryEl.textContent = md.riesgos?.length
          ? `Riesgos en ${currentMonth}: ${md.riesgos.join(", ")}.`
          : selectedCity.nombre;
      }
    });
  }

  if (realtimeToggle) {
    realtimeToggle.addEventListener("change", async () => {
      realtimeActive = realtimeToggle.checked;
      if (realtimeActive && selectedCity) {
        await fetchAndApplyWeather();
      } else {
        hideAlert();
        setStatus({ status: "NORMAL", reason: "Modo tiempo real desactivado." });
        setDonationState("NORMAL");
      }
    });
  }

  async function fetchAndApplyWeather() {
    if (!selectedCity) return;
    if (weatherLoadingEl) weatherLoadingEl.classList.remove("hidden");

    try {
      const weather = await getWeather(selectedCity.lat, selectedCity.lon);
      const risk    = calculateRisk(weather);

      setStatus(risk);
      setDonationState(risk.status);

      if (risk.status === "ALERTA") {
        showAlert(`Alerta en ${selectedCity.nombre}: ${risk.reason}`);
      } else {
        hideAlert();
      }
    } catch (err) {
      console.error("[main.js] Error al obtener el clima:", err);
      setStatus({ status: "NORMAL", reason: "No se pudo obtener el clima." });
    } finally {
      if (weatherLoadingEl) weatherLoadingEl.classList.add("hidden");
    }
  }

  function setStatus({ status, reason }) {
    if (cityStatusEl) {
      cityStatusEl.textContent = status;
      const badge = cityStatusEl.closest(".status-badge") || cityStatusEl.parentElement;
      if (badge) badge.className = `status-badge status-${status.toLowerCase()}`;
    }
    if (cityStatusReason) cityStatusReason.textContent = reason || "";
  }

  // El panel usa .open para el slide, no .hidden (que está sobreescrito por CSS)
  function openPanel() {
    cityPanel?.classList.add("open");
    cityBackdrop?.classList.add("open");
    cityBackdrop?.removeAttribute("aria-hidden");
  }

  function closePanel() {
    cityPanel?.classList.remove("open");
    cityBackdrop?.classList.remove("open");
    cityBackdrop?.setAttribute("aria-hidden", "true");
  }

  cityPanelClose?.addEventListener("click", closePanel);
  cityBackdrop?.addEventListener("click", closePanel);

  if (searchInput && searchResults) {
    const filterCities = () => {
      const query = searchInput.value.trim().toLowerCase();
      searchClear?.classList.toggle("hidden", !query);

      if (!query) {
        searchResults.classList.add("hidden");
        searchResults.innerHTML = "";
        return;
      }

      const matches = ciudades.filter(c =>
        c.nombre.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
      );

      if (!matches.length) {
        searchResults.innerHTML = `<li class="search-no-results">
          <svg class="search-no-results-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="28" r="18" stroke="currentColor" stroke-width="3" stroke-dasharray="5 3"/>
            <path d="M32 16 C32 16 24 24 24 30 C24 34.4 27.6 38 32 38 C36.4 38 40 34.4 40 30 C40 24 32 16 32 16Z" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
            <circle cx="32" cy="30" r="3" fill="currentColor"/>
            <path d="M32 41 L32 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <path d="M26 50 Q32 54 38 50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <circle cx="20" cy="14" r="2" fill="currentColor" opacity="0.4"/>
            <circle cx="46" cy="18" r="1.5" fill="currentColor" opacity="0.3"/>
            <circle cx="14" cy="32" r="1.5" fill="currentColor" opacity="0.3"/>
            <path d="M43 12 L44 10 L45 12 L47 13 L45 14 L44 16 L43 14 L41 13 Z" fill="currentColor" opacity="0.5"/>
          </svg>
          <strong>Esta localización no está disponible todavía</strong>
          Tomamos nota para una futura mejora de la aplicación.
        </li>`;
        searchResults.classList.remove("hidden");
        return;
      }

      searchResults.innerHTML = matches
        .map(c => `<li class="search-result-item" role="option" tabindex="0" data-id="${c.id}">
          <span class="search-result-dot"></span>
          <span>${c.nombre}</span>
        </li>`)
        .join("");
      searchResults.classList.remove("hidden");
    };

    searchInput.addEventListener("input", filterCities);
    searchBtn?.addEventListener("click", filterCities);

    searchResults.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-id]");
      if (!li) return;
      const ciudad = ciudades.find(c => c.id === li.dataset.id);
      if (!ciudad) return;

      searchInput.value = "";
      searchResults.classList.add("hidden");
      searchResults.innerHTML = "";
      searchClear?.classList.add("hidden");

      // Cambia a la pestaña Explorar y abre el panel cuando el mapa esté listo
      pendingCity = ciudad;
      document.querySelector('[data-tab="explorar"]')?.click();
    });

    searchClear?.addEventListener("click", () => {
      searchInput.value = "";
      searchResults.classList.add("hidden");
      searchResults.innerHTML = "";
      searchClear.classList.add("hidden");
    });
  }
});
