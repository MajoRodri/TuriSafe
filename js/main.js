import { initMap } from "./map.js";
import { getWeather } from "./weather.js";
import { calculateRisk } from "./risk.js";
import { setDonationState, submitDonation } from "./donations.js";
import { saveCity, getSavedCity, hasSavedCity } from "./offline.js";
import { showAlert, hideAlert } from "./alerts.js";
import { initReports, submitReport } from "./reports.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Step 1: Load ciudades from data/ciudades.json
  // TODO: fetch("data/ciudades.json") and parse the .ciudades array.

  // Step 2: Init map with loaded cities
  // TODO: call initMap(ciudades, onCitySelect).

  // Step 3: Listen for city selection
  // TODO: define onCitySelect(ciudad) handler.

  // Step 4: Show city panel when a city is selected
  // TODO: remove .hidden from #city-panel, populate #city-name and #emergency-contacts.

  // Step 5: Listen for month selector changes
  // TODO: add "change" listener on #month-selector to update traveler kit and climate context.

  // Step 6: Listen for realtime toggle
  // TODO: add "change" listener on #realtime-toggle.

  // Step 7: Fetch weather for selected city
  // TODO: call getWeather(ciudad.lat, ciudad.lon) when realtime is active.

  // Step 8: Calculate risk from weather data
  // TODO: call calculateRisk(weather) and store the result.

  // Step 9: Update UI with risk status
  // TODO: update #city-status and #city-status-reason, set status badge class.

  // Step 10: Inform donations module of current status
  // MVP: Donaciones desactivadas - no llamamos setDonationState()
  // TODO: setDonationState(risk.status);

  // Step 11: Save selected city for offline use
  // TODO: call saveCity(ciudad).

  // Step 12: Connect alerts and reports modules
  // TODO: call initReports().
  // TODO: call showAlert() with appropriate message when status is ALERTA.
  // TODO: wire up #donation-form submit to submitDonation().
});
