import { getWeather }        from "./weather.js";
import { calculateRisk }     from "./risk.js";
import { getReportsByCity }  from "./reports.js";

const MONTHS = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

const CITY_IMAGES = {
  madrid:    "madrid.jpg",
  "new-york": "newyork.jpg",
  tokyo:     "tokyo.jpg",
  sidney:    "sydney.jpg",
};

const KIT_ICONS = [
  { keys: ["botella"],       icon: `<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0014 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 01-11.91 4.97"/>` },
  { keys: ["ventilador"],    icon: `<path d="M17.7 7.7a2.5 2.5 0 111.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1111 8H2"/><path d="M12.6 19.4A2 2 0 1114 16H2"/>` },
  { keys: ["paraguas","sombrilla","parasol"], icon: `<path d="M23 12a11.05 11.05 0 00-22 0zm-5 7a3 3 0 01-6 0v-7"/>` },
  { keys: ["chubasquero","chaqueta","abrigo","impermeable","cortavientos","capa"], icon: `<path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>` },
  { keys: ["calzado","bota","zapato"], icon: `<path d="M3 14l4-8 4 4 2-3 3 4"/><path d="M2 18h20"/><rect x="3" y="14" width="18" height="4" rx="1"/>` },
  { keys: ["batería","bateria"],  icon: `<rect x="2" y="7" width="16" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/>` },
  { keys: ["mochila","funda","bolsa"], icon: `<path d="M4 20V10a4 4 0 014-4h8a4 4 0 014 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M9 6V5a3 3 0 016 0v1"/><line x1="8" y1="21" x2="8" y2="10"/><line x1="16" y1="21" x2="16" y2="10"/>` },
  { keys: ["solar","protector"], icon: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>` },
  { keys: ["gorra","sombrero","gorro"], icon: `<path d="M2 20h20"/><path d="M4 20c0-6 3.5-10 8-10s8 4 8 10"/><path d="M9.5 10a2.5 2.5 0 005 0"/>` },
  { keys: ["guante"],            icon: `<path d="M18 11V6a2 2 0 00-4 0v1M14 7V4a2 2 0 00-4 0v3M10 7.5V6a2 2 0 00-4 0v8"/><path d="M18 9a2 2 0 014 0v5a8 8 0 01-16 0v-3a2 2 0 014 0"/>` },
  { keys: ["gafas"],             icon: `<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 00-2-2 2 2 0 00-2 2"/><path d="M2.5 13L5 10"/><path d="M21.5 13L19 10"/>` },
  { keys: ["abanico"],           icon: `<path d="M12 22c4 0 8-4 8-9H4c0 5 4 9 8 9z"/><path d="M12 13V2"/><path d="M8 6l4-4 4 4"/>` },
  { keys: ["mascarilla"],        icon: `<path d="M3 11v3a9 9 0 0018 0v-3"/><path d="M3 11a9 9 0 0118 0"/><path d="M9 11v3"/><path d="M15 11v3"/>` },
  { keys: ["calentador"],        icon: `<path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>` },
  { keys: ["termico","térmica","calcetín","calcetines"], icon: `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>` },
  { keys: ["pulverizador"],      icon: `<path d="M3 3h.01M7 5h.01M11 7h.01M3 7h.01M7 9h.01M3 11h.01"/><rect x="11" y="11" width="8" height="12" rx="2"/><path d="M20 11V9a2 2 0 00-2-2"/><path d="M16 9V6l-3-3"/>` },
  { keys: ["documentac","copia","digital"], icon: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>` },
  { keys: ["toalla"],            icon: `<rect x="3" y="3" width="5" height="18" rx="1"/><path d="M8 3h9a2 2 0 012 2v4a2 2 0 01-2 2H8"/>` },
];

const KIT_ICON_DEFAULT = `<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>`;

const TYPE_LABELS = {
  carretera_cortada: "Carretera cortada",
  fuente_sin_agua:   "Fuente sin agua",
  inundacion_leve:   "Inundación leve",
  otro:              "Otro",
};

function kitIcon(item) {
  const lower = item.toLowerCase();
  const match = KIT_ICONS.find(({ keys }) => keys.some(k => lower.includes(k)));
  const paths = match ? match.icon : KIT_ICON_DEFAULT;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

let cities = {};

try {
  const response = await fetch("../data/ciudades.json");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  cities = (data.ciudades || []).reduce((acc, ciudad) => {
    acc[ciudad.id] = ciudad;
    return acc;
  }, {});
} catch (error) {
  console.error("[city-page.js] Error al cargar las ciudades:", error);
  window.location.href = "../index.html";
}

const params = new URLSearchParams(window.location.search);
const id     = params.get("id");
const city   = cities[id];

if (!city) {
  window.location.href = "../index.html";
} else {
  renderCity(city);
  fetchWeather(city);
  renderReports(city.id);
}

function renderCity(ciudad) {
  const currentMonth = MONTHS[new Date().getMonth()];
  const monthData    = ciudad.meses?.[currentMonth] || {};

  document.title = `${ciudad.nombre} - TuriSafe`;

  const heroEl = document.getElementById("cp-hero-bg");
  if (heroEl) {
    const img = CITY_IMAGES[ciudad.id] || `${ciudad.id}.jpg`;
    heroEl.style.backgroundImage = `url('../assets/images/${img}')`;
  }

  setText("cp-name", ciudad.nombre);
  setText("cp-bio", ciudad.descripcion || `Perfil de ${ciudad.nombre}.`);

  const monthSummary = document.getElementById("cp-month-summary");
  if (monthData.recomendaciones?.length) {
    setText("cp-month-name", `Recomendaciones para ${currentMonth}`);
    setText("cp-description", monthData.recomendaciones.join(". ") + ".");
    monthSummary?.classList.remove("hidden");
  }

  const kitEl = document.getElementById("cp-kit");
  if (kitEl) {
    kitEl.innerHTML = (monthData.kit || [])
      .map(item => `<li class="city-kit-item"><span class="city-kit-icon">${kitIcon(item)}</span>${item}</li>`)
      .join("") || "<li>Sin kit específico para este mes.</li>";
  }

  setContact("cp-emergency", ciudad.telefono_emergencias);
  setContact("cp-police",    ciudad.policia);
  setContact("cp-fire",      ciudad.bomberos);
}

async function fetchWeather(ciudad) {
  const loadingEl = document.getElementById("cp-weather-loading");
  const dataEl    = document.getElementById("cp-weather-data");
  const errorEl   = document.getElementById("cp-weather-error");

  // La simulación activa desde main.js tiene prioridad sobre el clima real
  const simKey  = `turisafe-sim-${ciudad.id}`;
  const simRaw  = sessionStorage.getItem(simKey);
  const simData = simRaw ? JSON.parse(simRaw) : null;

  try {
    const weather = await getWeather(ciudad.lat, ciudad.lon);
    const realRisk = calculateRisk(weather);
    const risk = simData ?? realRisk;

    const badge = document.getElementById("cp-status-badge");
    if (badge) badge.className = `status-badge status-${risk.status.toLowerCase()}`;
    setText("cp-status-text", risk.status);

    const donateSection = document.getElementById("cp-donate-section");
    const alertSpan     = document.getElementById("cp-alert-banner");
    if (risk.status === "ALERTA") {
      if (alertSpan) alertSpan.textContent = risk.reason || (simData?.reason ?? "");
      if (donateSection) donateSection.classList.remove("hidden");
      initDonateForm(ciudad.nombre);
    } else {
      if (donateSection) donateSection.classList.add("hidden");
    }

    setText("cp-temp",        `${weather.temperature} ${weather.units?.temp ?? "°C"}`);
    setText("cp-feels",       `${weather.apparentTemperature} ${weather.units?.temp ?? "°C"}`);
    setText("cp-precip",      `${weather.precipitation} ${weather.units?.precip ?? "mm"}`);
    setText("cp-wind",        `${weather.wind} ${weather.units?.wind ?? "km/h"}`);
    setText("cp-humidity",    `${weather.humidity ?? "--"} %`);
    setText("cp-risk-inline", risk.status);

    const riskEl = document.getElementById("cp-risk-inline");
    if (riskEl) riskEl.className = `weather-stat-value status-text-${risk.status.toLowerCase()}`;

    if (loadingEl) loadingEl.classList.add("hidden");
    if (dataEl)    dataEl.classList.remove("hidden");
  } catch (err) {
    console.error("[city-page.js] Error al obtener el clima:", err);
    if (loadingEl) loadingEl.classList.add("hidden");
    if (errorEl)   errorEl.classList.remove("hidden");
  }
}

function renderReports(cityId) {
  const listEl  = document.getElementById("cp-reports-list");
  const countEl = document.getElementById("cp-report-count");
  if (!listEl) return;

  const reports = getReportsByCity(cityId);

  if (countEl) {
    if (reports.length > 0) {
      countEl.textContent = reports.length;
      countEl.classList.remove("hidden");
    } else {
      countEl.classList.add("hidden");
    }
  }

  if (!reports.length) return;

  listEl.innerHTML = reports
    .slice()
    .reverse()
    .map(r => {
      const date  = new Date(r.creadoEn).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
      const label = TYPE_LABELS[r.tipo] || r.tipo;
      return `
        <div class="city-report-item">
          <div class="city-report-meta">
            <span class="city-report-type">${label}</span>
            <span class="city-report-date">${date}</span>
          </div>
          ${r.descripcion ? `<p class="city-report-desc">${r.descripcion}</p>` : ""}
        </div>`;
    })
    .join("");
}

const FORMSPREE = "https://formspree.io/f/mjyvyvoz";
let donateFormReady = false;

function showDonateError(feedbackEl, msg) {
  if (!feedbackEl) return;
  feedbackEl.textContent = msg;
  feedbackEl.classList.remove("hidden", "donate-feedback--error");
  feedbackEl.classList.add("donate-feedback--error");
  feedbackEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function initDonateForm(cityName) {
  if (donateFormReady) return;
  donateFormReady = true;

  const btn       = document.getElementById("cp-donate-btn");
  const formWrap  = document.getElementById("cp-donate-form-wrap");
  const form      = document.getElementById("cp-donate-form");
  const cityInput = document.getElementById("don-city-id");
  const feedback  = document.getElementById("cp-donate-feedback");

  if (cityInput) cityInput.value = cityName;

  const infoBtn = document.getElementById("don-ubicacion-info-btn");
  const infoTip = document.getElementById("don-ubicacion-tip");
  infoBtn?.addEventListener("click", () => {
    const open = infoTip?.classList.toggle("hidden") === false;
    infoBtn.setAttribute("aria-expanded", String(open));
  });

  btn?.addEventListener("click", () => {
    formWrap?.classList.toggle("hidden");
    btn.textContent = formWrap?.classList.contains("hidden") ? "Donar ahora" : "Cerrar formulario";
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre        = form.nombre.value.trim();
    const telefono      = form.telefono.value.trim();
    const categorias    = [...form.querySelectorAll("input[name='categorias']:checked")].map(c => c.value);
    const ubicacion     = form.ubicacion.value.trim();
    const quiereCentros = form.quiere_centros?.checked ?? false;

    if (!nombre) {
      showDonateError(feedback, "El nombre es obligatorio."); return;
    }
    if (!telefono) {
      showDonateError(feedback, "El teléfono es obligatorio."); return;
    }
    if (!categorias.length) {
      showDonateError(feedback, "Selecciona al menos una categoría de lo que puedes ofrecer."); return;
    }
    if (!ubicacion && !quiereCentros) {
      showDonateError(feedback, "Indica tu ubicación de recogida o marca que quieres saber sobre centros de entrega."); return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando..."; }
    if (feedback) feedback.classList.add("hidden");

    const data = {
      nombre,
      telefono,
      categorias,
      ubicacion:      ubicacion || "—",
      quiere_centros: quiereCentros ? "Sí" : "No",
      ciudad:         cityName,
    };

    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      form.reset();
      if (feedback) { feedback.textContent = "¡Gracias! Tu ofrecimiento ha sido registrado."; feedback.classList.remove("hidden", "donate-feedback--error"); }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Enviar ofrecimiento"; }
    } catch {
      if (feedback) { feedback.textContent = "No se pudo enviar. Inténtalo de nuevo."; feedback.classList.remove("hidden"); feedback.classList.add("donate-feedback--error"); }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Enviar ofrecimiento"; }
    }
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "--";
}

function setContact(baseId, number) {
  if (!number) return;
  const link = document.getElementById(baseId);
  const num  = document.getElementById(`${baseId}-num`);
  if (link) link.href = `tel:${number}`;
  if (num)  num.textContent = number;
}
