// ── Datos sintéticos de demo (se reemplazarán con ciudades.json en integración) ──

const MOCK_CITIES = [
  { id: 'madrid',    name: 'Madrid',    lat: 40.4168,  lon: -3.7038,  emergencias: '112', policia: '091', bomberos: '080' },
  { id: 'barcelona', name: 'Barcelona', lat: 41.3851,  lon: 2.1734,   emergencias: '112', policia: '091', bomberos: '080' },
  { id: 'valencia',  name: 'Valencia',  lat: 39.4699,  lon: -0.3763,  emergencias: '112', policia: '091', bomberos: '080' },
  { id: 'sevilla',   name: 'Sevilla',   lat: 37.3891,  lon: -5.9845,  emergencias: '112', policia: '091', bomberos: '080' }
];

// Imágenes sintéticas de placeholder — se sustituirán por assets/images/<id>.jpg en integración
const CITY_IMAGES = {
  madrid:    'https://picsum.photos/seed/madrid-spain/800/500',
  barcelona: 'https://picsum.photos/seed/barcelona-coast/800/500',
  valencia:  'https://picsum.photos/seed/valencia-travel/800/500',
  sevilla:   'https://picsum.photos/seed/sevilla-andalucia/800/500'
};

// Gradiente de fallback si la imagen no carga
const CITY_GRADIENTS = {
  madrid:    'linear-gradient(135deg, #0c4a6e, #0891b2)',
  barcelona: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
  valencia:  'linear-gradient(135deg, #713f12, #d97706)',
  sevilla:   'linear-gradient(135deg, #7c2d12, #ea580c)'
};

// Información climática por mes (vendrá de ciudades.json en integración)
const MONTHLY_CONTEXT = {
  enero:      'Enero trae frío intenso y posibles nevadas en zonas de montaña. Temperaturas mínimas bajo 0°C por las noches.',
  febrero:    'Febrero mantiene temperaturas bajas con riesgo de heladas matutinas y viento frío del norte.',
  marzo:      'Inicio de primavera con cambios bruscos de temperatura. Lluvias frecuentes y granizos ocasionales.',
  abril:      'Abril es lluvioso y variable. Temperaturas agradables de día pero frescas por la noche.',
  mayo:       'Mayo trae días soleados y temperaturas en ascenso. Buena época para visitar, aunque con alguna tormenta.',
  junio:      'Inicio del verano. Temperaturas altas y jornadas largas. Conviene hidratarse bien.',
  julio:      'Julio es el mes más caluroso. Posibles olas de calor con temperaturas superiores a 38°C.',
  agosto:     'Agosto registra las temperaturas más extremas (hasta 42°C). Alta probabilidad de tormentas eléctricas por las tardes.',
  septiembre: 'Septiembre comienza a refrescar. Lluvias repentinas y posibles tormentas de verano residuales.',
  octubre:    'Octubre trae lluvias frecuentes y bajada de temperaturas. Inicio del otoño con noches frescas.',
  noviembre:  'Noviembre es frío y lluvioso. Riesgo de vientos fuertes y primeras heladas en zonas elevadas.',
  diciembre:  'Diciembre es frío con posibilidad de nevadas en cotas bajas. Riesgo de carreteras heladas.'
};

// Kit recomendado por mes (vendrá de ciudades.json en integración)
const MONTHLY_KIT = {
  enero:      ['Abrigo impermeable', 'Botas de agua', 'Guantes y bufanda', 'Linterna', 'Manta de emergencia', 'Calzado antideslizante'],
  febrero:    ['Abrigo impermeable', 'Ropa térmica', 'Guantes y bufanda', 'Botas de agua', 'Calzado antideslizante'],
  marzo:      ['Chubasquero', 'Paraguas', 'Ropa de abrigo ligera', 'Calzado impermeable', 'Botiquín básico'],
  abril:      ['Chubasquero', 'Paraguas', 'Capas de ropa', 'Calzado cómodo impermeable'],
  mayo:       ['Protector solar SPF 30', 'Gorra', 'Ropa cómoda', 'Agua (1.5 L)', 'Botiquín básico'],
  junio:      ['Protector solar SPF 50+', 'Gorra o sombrero', 'Ropa ligera', 'Agua (2 L mínimo)', 'Gafas de sol'],
  julio:      ['Protector solar SPF 50+', 'Agua (mínimo 2 L)', 'Ropa ligera de colores claros', 'Gorra o sombrero', 'Gafas de sol', 'Botiquín básico'],
  agosto:     ['Protector solar SPF 50+', 'Agua (mínimo 2 L)', 'Ropa ligera de colores claros', 'Gorra o sombrero', 'Gafas de sol', 'Botiquín básico', 'Tarjeta sanitaria'],
  septiembre: ['Chubasquero ligero', 'Protector solar SPF 30', 'Capas de ropa', 'Agua (1.5 L)', 'Botiquín básico'],
  octubre:    ['Chubasquero', 'Ropa de abrigo', 'Paraguas', 'Calzado impermeable', 'Botiquín básico'],
  noviembre:  ['Abrigo impermeable', 'Paraguas', 'Ropa abrigada', 'Botas impermeables', 'Guantes'],
  diciembre:  ['Abrigo impermeable', 'Botas de agua', 'Guantes y bufanda', 'Manta de emergencia', 'Linterna']
};

// Textos de estado (status, reason) — lógica real en risk.js
const STATES = {
  NORMAL: {
    label: 'NORMAL',
    reason: 'Condiciones meteorológicas dentro de los parámetros normales para la época del año.'
  },
  PRECAUCION: {
    label: 'PRECAUCION',
    reason: 'Temperaturas superiores a 35°C previstas. Se recomienda precaución entre las 12h y las 17h y mantener hidratación constante.'
  },
  ALERTA: {
    label: 'ALERTA',
    reason: 'Ola de calor activa. Temperatura máxima de 42°C. Riesgo elevado para personas mayores, menores y enfermos crónicos.'
  }
};

let map = null;
let currentState = 'NORMAL';

// Devuelve el nombre del mes actual en minúsculas
function getCurrentMonth() {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return months[new Date().getMonth()];
}

// Carga la imagen de una ciudad con fallback al gradiente CSS
function setCityImage(cityId) {
  const el = document.getElementById('city-header-img');
  const img = new Image();
  img.src = CITY_IMAGES[cityId];
  img.onload = () => {
    el.style.backgroundImage = `url(${CITY_IMAGES[cityId]})`;
    el.style.backgroundSize   = 'cover';
    el.style.backgroundPosition = 'center';
  };
  img.onerror = () => {
    // Fallback: gradiente CSS si la imagen no carga
    el.style.backgroundImage = 'none';
    el.style.background = CITY_GRADIENTS[cityId] || CITY_GRADIENTS.madrid;
  };
  // Muestra el gradiente de inmediato mientras carga la imagen
  el.style.background = CITY_GRADIENTS[cityId] || CITY_GRADIENTS.madrid;
}

// Abre el drawer lateral con los datos de la ciudad seleccionada
function openCityPanel(city) {
  const month = document.getElementById('month-selector').value || getCurrentMonth();

  // Nombre
  document.getElementById('city-name').textContent = city.name;

  // Imagen con fallback
  setCityImage(city.id);

  // Contexto climático del mes
  document.getElementById('climate-context').textContent = MONTHLY_CONTEXT[month] || '';

  // Kit del viajero
  const kit = MONTHLY_KIT[month] || MONTHLY_KIT['agosto'];
  document.getElementById('traveler-kit').innerHTML = kit.map(item => `<li>${item}</li>`).join('');

  // Contactos de emergencia
  document.getElementById('contact-emergencias').href = `tel:${city.emergencias}`;
  document.getElementById('contact-emergencias').querySelector('.contact-number').textContent = city.emergencias;
  document.getElementById('contact-policia').href = `tel:${city.policia}`;
  document.getElementById('contact-policia').querySelector('.contact-number').textContent = city.policia;
  document.getElementById('contact-bomberos').href = `tel:${city.bomberos}`;
  document.getElementById('contact-bomberos').querySelector('.contact-number').textContent = city.bomberos;

  // Restablece el estado de donación al abrir una ciudad
  document.getElementById('donation-form').classList.add('hidden');
  document.getElementById('donation-success').classList.add('hidden');
  document.getElementById('donation-blocked-msg').classList.remove('hidden');

  // Aplica el estado activo del switcher de demo
  applyState(currentState);

  // Abre el drawer
  document.getElementById('city-panel').classList.add('open');
  document.getElementById('city-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Cierra el drawer lateral
function closeCityPanel() {
  document.getElementById('city-panel').classList.remove('open');
  document.getElementById('city-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// Aplica el estado (NORMAL / PRECAUCION / ALERTA) al badge y al módulo de donaciones
function applyState(stateName) {
  currentState = stateName;
  const state = STATES[stateName];
  if (!state) return;

  // Actualiza badge visual
  document.querySelector('.status-badge').className = `status-badge status-${stateName.toLowerCase()}`;
  document.getElementById('city-status').textContent = state.label;
  document.getElementById('city-status-reason').textContent = state.reason;

  // Donaciones: solo activas en ALERTA
  const blockedMsg = document.getElementById('donation-blocked-msg');
  const form       = document.getElementById('donation-form');

  if (stateName === 'ALERTA') {
    blockedMsg.classList.add('hidden');
    form.classList.remove('hidden');
  } else {
    blockedMsg.classList.remove('hidden');
    form.classList.add('hidden');
    blockedMsg.textContent = stateName === 'PRECAUCION'
      ? 'Zona en precaución. El módulo de ayuda no está activo todavía.'
      : 'Zona segura. Gracias por tu intención de ayudar.';
  }

  // Actualiza botones del switcher
  document.querySelectorAll('.demo-state-btn').forEach(btn => {
    btn.classList.toggle('demo-active', btn.dataset.state === stateName);
  });
}

// Inicializa el mapa Leaflet con marcadores personalizados
function initMap() {
  map = L.map('map').setView([40.2, -3.5], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
  }).addTo(map);

  // Marcador circular con color de marca
  const markerIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:16px; height:16px; border-radius:50%;
      background:#0891b2; border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  MOCK_CITIES.forEach(city => {
    L.marker([city.lat, city.lon], { icon: markerIcon })
      .addTo(map)
      .bindTooltip(`<strong>${city.name}</strong>`, { direction: 'top', offset: [0, -10] })
      .on('click', () => openCityPanel(city));
  });
}

// Inicializa la barra de búsqueda con filtro en tiempo real
function initSearch() {
  const input   = document.getElementById('city-search');
  const results = document.getElementById('search-results');
  const clearBtn = document.getElementById('search-clear');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    clearBtn.classList.toggle('hidden', query.length === 0);

    if (query.length === 0) {
      results.classList.add('hidden');
      return;
    }

    const matches = MOCK_CITIES.filter(c => c.name.toLowerCase().includes(query));

    if (matches.length === 0) {
      results.innerHTML = '<li class="search-no-results">No se encontraron destinos piloto</li>';
    } else {
      results.innerHTML = matches.map(city => `
        <li class="search-result-item" data-id="${city.id}" role="option">
          <span class="search-result-dot"></span>
          <div>
            <strong>${city.name}</strong>
            <span class="search-result-coords">${city.lat.toFixed(2)}° N, ${Math.abs(city.lon).toFixed(2)}° ${city.lon < 0 ? 'O' : 'E'}</span>
          </div>
        </li>
      `).join('');

      results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const city = MOCK_CITIES.find(c => c.id === item.dataset.id);
          if (city) {
            openCityPanel(city);
            // Centra el mapa en la ciudad seleccionada
            map.flyTo([city.lat, city.lon], 9, { duration: 1.2 });
          }
          results.classList.add('hidden');
          input.value = '';
          clearBtn.classList.add('hidden');
        });
      });
    }

    results.classList.remove('hidden');
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    results.classList.add('hidden');
    clearBtn.classList.add('hidden');
    input.focus();
  });

  // Cierra el dropdown al hacer clic fuera
  document.addEventListener('click', e => {
    if (!e.target.closest('.map-search-bar')) {
      results.classList.add('hidden');
    }
  });
}

// Inyecta el switcher de estados de demo (solo para visualización)
function injectDemoSwitcher() {
  const el = document.createElement('div');
  el.id = 'demo-switcher';
  el.innerHTML = `
    <span>Demo:</span>
    <button class="demo-state-btn demo-active" data-state="NORMAL">Normal</button>
    <button class="demo-state-btn" data-state="PRECAUCION">Precauci&oacute;n</button>
    <button class="demo-state-btn" data-state="ALERTA">Alerta</button>
  `;
  document.body.appendChild(el);

  el.querySelectorAll('.demo-state-btn').forEach(btn => {
    btn.addEventListener('click', () => applyState(btn.dataset.state));
  });

  // Estilos del switcher inyectados dinámicamente
  const style = document.createElement('style');
  style.textContent = `
    #demo-switcher {
      position:fixed; bottom:1.75rem; left:1.75rem;
      background:#0f172a; color:#fff;
      padding:.5rem .875rem; border-radius:8px;
      display:flex; align-items:center; gap:.5rem;
      font-size:.72rem; font-weight:700; z-index:9999;
      box-shadow:0 4px 16px rgba(0,0,0,.4);
    }
    .demo-state-btn {
      padding:.25rem .65rem;
      border:1px solid rgba(255,255,255,.25);
      border-radius:4px; background:transparent; color:#fff;
      font-size:.68rem; font-weight:700; cursor:pointer;
      transition:background .15s;
    }
    .demo-state-btn:not(.demo-active):hover { background:rgba(255,255,255,.12); }
    .demo-state-btn[data-state="NORMAL"].demo-active    { background:#22c55e; border-color:#22c55e; }
    .demo-state-btn[data-state="PRECAUCION"].demo-active { background:#f59e0b; border-color:#f59e0b; }
    .demo-state-btn[data-state="ALERTA"].demo-active    { background:#ef4444; border-color:#ef4444; }
  `;
  document.head.appendChild(style);
}

// ── Inicialización principal ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  injectDemoSwitcher();
  initMap();
  initSearch();

  // Cierra el drawer al hacer clic en el backdrop o en el botón de cerrar
  document.getElementById('city-backdrop').addEventListener('click', closeCityPanel);
  document.getElementById('city-panel-close').addEventListener('click', closeCityPanel);

  // Los chips de acceso rápido abren la ciudad correspondiente
  document.querySelectorAll('.city-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const city = MOCK_CITIES.find(c => c.id === chip.dataset.city);
      if (city) {
        openCityPanel(city);
        map.flyTo([city.lat, city.lon], 9, { duration: 1.2 });
      }
    });
  });

  // Cambio de mes: actualiza el contenido si el drawer está abierto
  document.getElementById('month-selector').addEventListener('change', () => {
    const panel = document.getElementById('city-panel');
    if (!panel.classList.contains('open')) return;
    const cityName = document.getElementById('city-name').textContent;
    const city = MOCK_CITIES.find(c => c.name === cityName) || MOCK_CITIES[0];
    openCityPanel(city);
  });

  // Toggle de tiempo real: simula la llamada a Open-Meteo con spinner
  document.getElementById('realtime-toggle').addEventListener('change', e => {
    const panel = document.getElementById('city-panel');
    if (!panel.classList.contains('open')) return;
    const loading = document.getElementById('weather-loading');
    const ctx     = document.getElementById('climate-context');
    const month   = document.getElementById('month-selector').value || getCurrentMonth();

    if (e.target.checked) {
      loading.classList.remove('hidden');
      ctx.textContent = '';
      // Simula latencia de la API (1.8 s)
      setTimeout(() => {
        loading.classList.add('hidden');
        ctx.textContent = 'Estado actual: 38°C · Precipitación: 0 mm · Viento: 18 km/h. ' + (MONTHLY_CONTEXT[month] || '');
      }, 1800);
    } else {
      ctx.textContent = MONTHLY_CONTEXT[month] || '';
    }
  });

  // Botón demo alerta: cuenta atrás de 10 s y muestra banner
  document.getElementById('demo-alert-btn').addEventListener('click', () => {
    const banner = document.getElementById('alert-banner');
    let seconds = 10;
    banner.textContent = `ALERTA DEMO — Se activará en ${seconds} segundos`;
    banner.classList.remove('hidden');

    const interval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(interval);
        banner.textContent = 'ALERTA ACTIVA — Ola de calor extrema en la zona. Siga las indicaciones de las autoridades.';
        setTimeout(() => banner.classList.add('hidden'), 5000);
      } else {
        banner.textContent = `ALERTA DEMO — Se activará en ${seconds} segundos`;
      }
    }, 1000);
  });

  // Formulario de donación: muestra confirmación al enviar
  document.getElementById('donation-form').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('donation-form').classList.add('hidden');
    document.getElementById('donation-success').classList.remove('hidden');
  });

  // Modal de reporte ciudadano
  document.getElementById('report-button').addEventListener('click', () => {
    document.getElementById('report-modal').classList.remove('hidden');
  });
  document.getElementById('report-modal-close').addEventListener('click', () => {
    document.getElementById('report-modal').classList.add('hidden');
  });
  document.getElementById('report-form').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('report-modal').classList.add('hidden');
  });
  // Cierra el modal al hacer clic en el overlay
  document.querySelector('#report-modal .modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) document.getElementById('report-modal').classList.add('hidden');
  });
});
