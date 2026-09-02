// Load cities from ciudades.json
let cities = {};

try {
  const response = await fetch('../data/ciudades.json');
  const data = await response.json();
  cities = data.ciudades.reduce((acc, ciudad) => {
    acc[ciudad.id] = ciudad;
    return acc;
  }, {});
} catch (error) {
  console.error('Error loading cities:', error);
  window.location.href = 'index.html';
}

const params = new URLSearchParams(window.location.search);
const id     = params.get('id');
const city   = cities[id];

if (!city) {
  window.location.href = 'index.html';
} else {
  renderCity(city);
}

function renderCity(city) {
  document.title = `${city.name} — TuriSafe`;

  // La imagen usa ../ porque pages/ está un nivel por debajo del raíz
  document.getElementById('cp-hero-bg').style.backgroundImage = `url('../${city.image}')`;
  document.getElementById('cp-name').textContent        = city.name;
  document.getElementById('cp-country').textContent     = city.country;
  document.getElementById('cp-description').textContent = city.description;

  const badge  = document.getElementById('cp-status-badge');
  const status = (city.riskLevel || 'NORMAL').toLowerCase();
  badge.className = `status-badge status-${status}`;
  document.getElementById('cp-status-text').textContent = city.riskLevel || 'NORMAL';

  const kitEl = document.getElementById('cp-kit');
  kitEl.innerHTML = city.kit
    .map(item => `<li class="city-kit-item"><span class="city-kit-dot"></span>${item}</li>`)
    .join('');

  const { emergency, police, fire } = city.contacts;
  setContact('cp-emergency', emergency);
  setContact('cp-police', police);
  setContact('cp-fire', fire);
}

function setContact(baseId, number) {
  const link = document.getElementById(baseId);
  const num  = document.getElementById(`${baseId}-num`);
  if (link) link.href = `tel:${number}`;
  if (num)  num.textContent = number;
}
