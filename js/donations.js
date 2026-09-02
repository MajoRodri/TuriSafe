// --- Configuración -----------------------------------------------------
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjyvyvoz";

// --- Estado interno ------------------------------------------------------
let currentStatus = "PRECAUCION"; // valor seguro por defecto hasta que main.js informe otro estado
let isSubmitting = false;

// --- Referencias al DOM --------------------------------------------------
const form         = document.getElementById("donation-form");
const blockedMsg   = document.getElementById("donation-blocked-msg");
const successMsg   = document.getElementById("donation-success");
const submitButton = form ? form.querySelector('button[type="submit"]') : null;

// Caja para errores de validación/envío creada dinámicamente (no existe en index.html)
let errorBox = document.getElementById("donation-error");
if (!errorBox && form) {
  errorBox = document.createElement("p");
  errorBox.id = "donation-error";
  errorBox.style.cssText = "color:#dc2626;font-size:.8rem;margin-top:.25rem;display:none";
  form.appendChild(errorBox);
}

// --- Mensajes por estado --------------------------------------------------
const STATE_MESSAGES = {
  NORMAL:     "Zona segura. Gracias por tu intención de ayudar.",
  PRECAUCION: "Zona en precaución. El módulo de ayuda no está activo todavía.",
};

/**
 * Activa o desactiva el formulario de donaciones según el estado recibido
 * desde el flujo de riesgo (P2 -> P5). Esta función NO decide nada sobre
 * el riesgo; solo refleja el valor que se le entrega.
 *
 * @param {"NORMAL"|"PRECAUCION"|"ALERTA"} status
 */
export function setDonationState(status) {
  const validStates = ["NORMAL", "PRECAUCION", "ALERTA"];
  const safeStatus = validStates.includes(status) ? status : "PRECAUCION";

  if (!validStates.includes(status)) {
    console.warn(`[donations.js] Estado desconocido "${status}" recibido, se usa bloqueado por defecto.`);
  }

  currentStatus = safeStatus;
  const isActive = safeStatus === "ALERTA";

  // Usa los elementos existentes de index.html (P3)
  if (blockedMsg) {
    blockedMsg.textContent = STATE_MESSAGES[safeStatus] || "";
    blockedMsg.classList.toggle("hidden", isActive);
  }
  if (form) {
    form.classList.toggle("hidden", !isActive);
  }
  if (successMsg) {
    successMsg.classList.add("hidden");
  }
  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.textContent   = "";
  }
}

/**
 * Valida y envía un ofrecimiento de donación.
 *
 * @param {{nombre: string, telefono: string, categorias: string[], ubicacion: string}} data
 * @returns {Promise<void>}
 */
async function submitDonation(data) {
  if (currentStatus !== "ALERTA") {
    // Comprobación defensiva: el formulario ya debería estar oculto,
    // pero nunca confiamos únicamente en la interfaz.
    throw new Error("Las donaciones no están activas para el estado actual.");
  }

  const validationError = validateDonation(data);
  if (validationError) {
    showError(validationError);
    throw new Error(validationError);
  }

  if (isSubmitting) return; // Evita envíos duplicados mientras una solicitud ya está en curso.

  setSubmittingState(true);
  if (errorBox) { errorBox.style.display = "none"; errorBox.textContent = ""; }

  const payload = {
    nombre:     data.nombre.trim(),
    telefono:   data.telefono.trim(),
    categorias: data.categorias,
    ubicacion:  data.ubicacion.trim(),
  };

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`El servicio de email respondió con estado ${response.status}`);
    }
    if (form)       form.classList.add("hidden");
    if (successMsg) successMsg.classList.remove("hidden");
    if (form)       form.reset();
  } catch (error) {
    console.error("[donations.js] submitDonation falló:", error);
    showError("No fue posible enviar tu ofrecimiento. Inténtalo nuevamente.");
    throw error;
  } finally {
    setSubmittingState(false);
  }
}

// --- Funciones auxiliares -------------------------------------------------

function validateDonation(data) {
  if (!data.nombre?.trim())    return "El nombre es obligatorio.";
  if (!data.telefono?.trim())  return "El teléfono es obligatorio.";
  if (!data.ubicacion?.trim()) return "La ubicación de recogida es obligatoria.";
  if (!Array.isArray(data.categorias) || data.categorias.length === 0)
    return "Selecciona al menos una categoría de donación.";
  return null;
}

function setSubmittingState(submitting) {
  isSubmitting = submitting;
  if (submitButton) {
    submitButton.disabled    = submitting;
    submitButton.textContent = submitting ? "Enviando..." : "Enviar donación";
  }
}

function showError(text) {
  if (!errorBox) return;
  errorBox.textContent   = text;
  errorBox.style.display = "block";
}

// --- Conexión del formulario (solo si existe en la página actual) ----------
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    submitDonation({
      nombre:     formData.get("nombre")    || "",
      telefono:   formData.get("telefono")  || "",
      categorias: formData.getAll("categorias"),
      ubicacion:  formData.get("ubicacion") || "",
    }).catch(() => {
      // El error ya se mostró mediante showError(); no hay nada más que hacer aquí.
    });
  });

  // Empieza bloqueado hasta que main.js llame a setDonationState() con el estado real.
  setDonationState(currentStatus);
}

