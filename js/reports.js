const REPORTS_STORAGE_KEY = "turisafe_reportes";
const MAX_STORED_REPORTS = 50;

const VALID_REPORT_TYPES = new Set([
  "carretera_cortada",
  "fuente_sin_agua",
  "inundacion_leve",
  "transporte_interrumpido",
  "accidente_via",
  "incendio_humo",
  "caida_arboles",
  "aglomeracion",
  "acceso_cerrado",
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

const CHEVRON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

function buildCustomSelect(select) {
  if (select.dataset.customized) return;
  select.dataset.customized = "true";
  select.style.display = "none";

  const wrap = document.createElement("div");
  wrap.className = "csel-wrap";
  select.parentNode.insertBefore(wrap, select);
  wrap.appendChild(select);

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "csel-trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.innerHTML = `<span class="csel-value">${select.options[0]?.text || "Selecciona..."}</span>${CHEVRON_SVG}`;
  wrap.appendChild(trigger);

  const dropdown = document.createElement("ul");
  dropdown.className = "csel-dropdown";
  dropdown.setAttribute("role", "listbox");
  dropdown.hidden = true;
  Array.from(select.options).slice(1).forEach(opt => {
    const li = document.createElement("li");
    li.className = "csel-option";
    li.setAttribute("role", "option");
    li.dataset.value = opt.value;
    li.textContent = opt.text;
    dropdown.appendChild(li);
  });
  wrap.appendChild(dropdown);

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.hidden;
    closeAllCustomSelects();
    if (!isOpen) {
      dropdown.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      wrap.classList.add("csel-open");
    }
  });

  dropdown.addEventListener("click", (e) => {
    const li = e.target.closest(".csel-option");
    if (!li) return;
    select.value = li.dataset.value;
    trigger.querySelector(".csel-value").textContent = li.textContent;
    trigger.classList.add("csel-has-value");
    dropdown.querySelectorAll(".csel-option").forEach(o => o.classList.remove("csel-selected"));
    li.classList.add("csel-selected");
    dropdown.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    wrap.classList.remove("csel-open");
  });

  select.form?.addEventListener("reset", () => {
    trigger.querySelector(".csel-value").textContent = select.options[0]?.text || "Selecciona...";
    trigger.classList.remove("csel-has-value");
    dropdown.querySelectorAll(".csel-option").forEach(o => o.classList.remove("csel-selected"));
  }, { once: false });
}

function closeAllCustomSelects() {
  document.querySelectorAll(".csel-wrap.csel-open").forEach(wrap => {
    wrap.classList.remove("csel-open");
    wrap.querySelector(".csel-dropdown").hidden = true;
    wrap.querySelector(".csel-trigger")?.setAttribute("aria-expanded", "false");
  });
}

document.addEventListener("click", closeAllCustomSelects);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllCustomSelects();
});

function initCustomSelects(modal) {
  modal?.querySelectorAll("select").forEach(buildCustomSelect);
}

function openReportModal() {
  const { button, modal, typeField, form } = getReportElements();
  if (!modal) return;

  initCustomSelects(modal);
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

  closeAllCustomSelects();
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
        ciudadId: formData.get("ciudadId") || null,
      });

      elements.form.reset();
      showFeedback(
        elements.form,
        "¡Gracias! Tu reporte ha sido registrado y ya es visible en el perfil de la ciudad.",
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
    throw new Error("Selecciona un tipo de incidencia válido.");
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
    console.warn("[reports.js] Se reinició un historial local no válido.", error);
    return [];
  }
}

export function getReportsByCity(cityId) {
  if (!cityId) return [];
  return readStoredReports().filter(r => r.ciudadId === cityId);
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
