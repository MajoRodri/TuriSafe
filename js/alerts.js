export const ALERT_DELAY_MS = 10_000;

const DEFAULT_MESSAGE =
  "Simulacion TuriSafe: aviso meteorologico de demostracion. No es una alerta oficial.";

let alertTimer = null;
let boundTrigger = null;

function getBanner() {
  return document.getElementById("alert-banner");
}

/**
 * Inicia la simulacion y muestra #alert-banner exactamente 10 segundos despues.
 * Esta funcion no consulta el clima ni decide el nivel de riesgo.
 *
 * @param {string} [message]
 * @returns {boolean} false si #alert-banner no existe; true en caso contrario.
 */
export function showAlert(message = DEFAULT_MESSAGE) {
  const banner = getBanner();
  if (!banner) {
    console.warn("[alerts.js] No se encontro #alert-banner.");
    return false;
  }

  hideAlert();

  const safeMessage = typeof message === "string" && message.trim()
    ? message.trim()
    : DEFAULT_MESSAGE;

  banner.textContent = safeMessage;
  banner.setAttribute("aria-live", "assertive");
  banner.setAttribute("aria-atomic", "true");
  banner.dataset.alertType = "simulation";

  alertTimer = window.setTimeout(() => {
    alertTimer = null;
    banner.classList.remove("hidden");
    document.dispatchEvent(new CustomEvent("turisafe:alert-shown", {
      detail: { message: safeMessage, simulated: true },
    }));
  }, ALERT_DELAY_MS);

  document.dispatchEvent(new CustomEvent("turisafe:alert-scheduled", {
    detail: { delay: ALERT_DELAY_MS, simulated: true },
  }));

  return true;
}

/**
 * Cancela una simulacion pendiente y oculta el banner visible.
 */
export function hideAlert() {
  if (alertTimer !== null) {
    window.clearTimeout(alertTimer);
    alertTimer = null;
  }

  const banner = getBanner();
  if (banner) {
    banner.classList.add("hidden");
  }
}

/**
 * Conecta un boton de simulacion sin acoplar este modulo al calculo de riesgo.
 * P3 puede usar id="alert-simulation-button" o data-alert-simulation en el HTML.
 * La inicializacion es idempotente para que main.js pueda llamarla con seguridad.
 *
 * @param {HTMLElement|null} [trigger]
 * @returns {boolean}
 */
export function initAlerts(trigger = null) {
  const simulationTrigger = trigger
    || document.getElementById("alert-simulation-button")
    || document.querySelector("[data-alert-simulation]");

  if (!simulationTrigger) return false;
  if (boundTrigger === simulationTrigger) return true;

  if (boundTrigger) {
    boundTrigger.removeEventListener("click", handleSimulationClick);
  }

  simulationTrigger.addEventListener("click", handleSimulationClick);
  boundTrigger = simulationTrigger;
  return true;
}

function handleSimulationClick(event) {
  const message = event.currentTarget.dataset.alertMessage || DEFAULT_MESSAGE;
  showAlert(message);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initAlerts(), { once: true });
} else {
  initAlerts();
}
