const ALERT_DELAY_MS = 10_000;

const DEFAULT_MESSAGE =
  "Simulación TuriSafe: aviso meteorológico de demostración. No es una alerta oficial.";

let alertTimer = null;

function getBanner() {
  return document.getElementById("alert-banner");
}

export function showAlert(message = DEFAULT_MESSAGE) {
  const banner = getBanner();
  if (!banner) {
    console.warn("[alerts.js] No se encontró #alert-banner.");
    return false;
  }

  hideAlert();

  const safeMessage =
    typeof message === "string" && message.trim() ? message.trim() : DEFAULT_MESSAGE;

  banner.textContent = safeMessage;
  banner.setAttribute("aria-live", "assertive");
  banner.setAttribute("aria-atomic", "true");
  banner.dataset.alertType = "simulation";

  alertTimer = window.setTimeout(() => {
    alertTimer = null;
    banner.classList.remove("hidden");
    document.dispatchEvent(
      new CustomEvent("turisafe:alert-shown", {
        detail: { message: safeMessage, simulated: true },
      })
    );
  }, ALERT_DELAY_MS);

  document.dispatchEvent(
    new CustomEvent("turisafe:alert-scheduled", {
      detail: { delay: ALERT_DELAY_MS, simulated: true },
    })
  );

  return true;
}

export function hideAlert() {
  const banner = getBanner();

  if (alertTimer) {
    clearTimeout(alertTimer);
    alertTimer = null;
  }

  if (banner) {
    banner.classList.add("hidden");
  }
}
