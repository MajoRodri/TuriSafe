const REPORTS_STORAGE_KEY = "turisafe_reportes";
const MAX_STORED_REPORTS = 50;

const VALID_REPORT_TYPES = new Set([
  "carretera_cortada",
  "fuente_sin_agua",
  "inundacion_leve",
  "otro",
]);

let reportsInitialized = false;
let lastFocusedElement = null;

function getReportElements() {
  const modal = document.getElementById("report-modal");
  const form = document.getElementById("report-form");

  return {
    button: document.getElementById("report-button"),
    modal,
    overlay: modal?.querySelector(".modal-overlay") || null,
    closeButton: document.getElementById("report-modal-close"),
    form,
    typeField: document.getElementById("report-type"),
    descriptionField: document.getElementById("report-description"),
    submitButton: form?.querySelector('button[type="submit"]') || null,
  };
}

function getFeedbackElement(form) {
  let feedback = document.getElementById("report-feedback");
  if (feedback || !form) return feedback;

  feedback = document.createElement("p");
  feedback.id = "report-feedback";
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.hidden = true;
  feedback.style.cssText = "margin:0;font-size:.85rem;line-height:1.4";
  form.appendChild(feedback);
  return feedback;
}

function showFeedback(form, message, isError = false) {
  const feedback = getFeedbackElement(form);
  if (!feedback) return;

  feedback.textContent = message;
  feedback.style.color = isError ? "#b91c1c" : "#166534";
  feedback.hidden = false;
}

function clearFeedback(form) {
  const feedback = getFeedbackElement(form);
  if (!feedback) return;

  feedback.textContent = "";
  feedback.hidden = true;
}

function openReportModal() {
  const { button, modal, typeField, form } = getReportElements();
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  clearFeedback(form);
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  button?.setAttribute("aria-expanded", "true");
  window.setTimeout(() => typeField?.focus(), 0);
}

function closeReportModal({ reset = true } = {}) {
  const { button, modal, form } = getReportElements();
  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  button?.setAttribute("aria-expanded", "false");

  if (reset) {
    form?.reset();
    clearFeedback(form);
  }

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

/**
 * Conecta el boton flotante, el modal y el formulario ya definidos en index.html.
 * Puede invocarse mas de una vez desde main.js sin duplicar listeners.
 *
 * @returns {boolean} true si los elementos necesarios existen.
 */
export function initReports() {
  if (reportsInitialized) return true;

  const elements = getReportElements();
  if (!elements.button || !elements.modal || !elements.form || !elements.closeButton) {
    console.warn("[reports.js] Faltan elementos del modulo de reportes en el DOM.");
    return false;
  }

  elements.button.setAttribute("aria-haspopup", "dialog");
  elements.button.setAttribute("aria-expanded", "false");
  elements.modal.setAttribute("aria-hidden", "true");

  elements.button.addEventListener("click", openReportModal);
  elements.closeButton.addEventListener("click", () => closeReportModal());

  elements.overlay?.addEventListener("click", (event) => {
    if (event.target === elements.overlay) closeReportModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.modal.classList.contains("hidden")) {
      closeReportModal();
    }
  });

  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFeedback(elements.form);

    if (elements.submitButton) {
      elements.submitButton.disabled = true;
      elements.submitButton.textContent = "Guardando...";
    }

    try {
      const formData = new FormData(elements.form);
      const report = await submitReport({
        tipo: formData.get("tipo"),
        descripcion: formData.get("descripcion"),
      });

      elements.form.reset();
      showFeedback(
        elements.form,
        `Reporte ${report.id} guardado. Se enviara cuando exista un servicio de reportes.`,
      );
    } catch (error) {
      showFeedback(
        elements.form,
        error instanceof Error ? error.message : "No se pudo guardar el reporte.",
        true,
      );
      elements.typeField?.focus();
    } finally {
      if (elements.submitButton) {
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = "Enviar reporte";
      }
    }
  });

  reportsInitialized = true;
  return true;
}

/**
 * Valida y guarda localmente un reporte ciudadano. El MVP no dispone de un
 * backend de reportes, por lo que el registro queda marcado como pendiente de
 * envio sin inventar una integracion remota.
 *
 * @param {{tipo: unknown, descripcion?: unknown, ciudadId?: unknown}} data
 * @returns {Promise<object>} Reporte normalizado y persistido.
 */
export async function submitReport(data) {
  const type = typeof data?.tipo === "string" ? data.tipo.trim() : "";
  if (!VALID_REPORT_TYPES.has(type)) {
    throw new Error("Selecciona un tipo de incidencia valido.");
  }

  const description = typeof data?.descripcion === "string"
    ? data.descripcion.trim()
    : "";

  const cityId = typeof data?.ciudadId === "string" && data.ciudadId.trim()
    ? data.ciudadId.trim()
    : null;

  const report = {
    id: createReportId(),
    tipo: type,
    descripcion: description,
    ciudadId: cityId,
    creadoEn: new Date().toISOString(),
    estado: "pendiente_envio",
  };

  const reports = readStoredReports();
  reports.push(report);

  try {
    localStorage.setItem(
      REPORTS_STORAGE_KEY,
      JSON.stringify(reports.slice(-MAX_STORED_REPORTS)),
    );
  } catch (error) {
    console.error("[reports.js] No fue posible guardar el reporte.", error);
    throw new Error("No se pudo guardar el reporte en este navegador.");
  }

  document.dispatchEvent(new CustomEvent("turisafe:report-saved", {
    detail: { report },
  }));

  return report;
}

function readStoredReports() {
  try {
    const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!stored) return [];

    const reports = JSON.parse(stored);
    return Array.isArray(reports) ? reports : [];
  } catch (error) {
    console.warn("[reports.js] Se reinicio un historial local no valido.", error);
    return [];
  }
}

function createReportId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `rep-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReports, { once: true });
} else {
  initReports();
}
