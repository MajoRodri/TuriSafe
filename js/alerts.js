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

export function showAlert(message) {
  const banner = document.getElementById('alert-banner');
  if (!banner) return;
  
  // Set message text
  banner.textContent = message;
  
  // Remove hidden class to show banner
  banner.classList.remove('hidden');
  
  // Clear any pending timer
  if (alertTimer) clearTimeout(alertTimer);
  
  // Auto-hide after 10 seconds
  alertTimer = setTimeout(() => {
    banner.classList.add('hidden');
    alertTimer = null;
  }, 10000);
}

/**
 * Cancela una simulacion pendiente y oculta el banner visible.
 */
export function hideAlert() {
  const banner = document.getElementById('alert-banner');
  
  // Clear pending timer
  if (alertTimer) {
    clearTimeout(alertTimer);
    alertTimer = null;
  }
  
  // Hide banner
  if (banner) {
    banner.classList.add('hidden');
  }
}
