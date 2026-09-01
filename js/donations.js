

// --- Configuración -----------------------------------------------------
// TODO: reemplazar con el endpoint real de Formspree desde tu panel.
// Lo obtienes en https://formspree.io -> "New Form" -> copia la URL del endpoint.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mjyvyvoz";

// --- Estado interno ------------------------------------------------------
let currentStatus = "PRECAUCION"; // valor seguro por defecto hasta que main.js informe otro estado
let isSubmitting = false;

// --- Referencias al DOM -------------------------------------------------------
const section = document.getElementById("donation-section");
const form = document.getElementById("donation-form");
const submitButton = form ? form.querySelector('button[type="submit"]') : null;

// No tocamos index.html. Esta caja de mensajes se crea en tiempo de ejecución
// por nuestro propio script y se añade dentro de #donation-section, así el
// archivo HTML original se mantiene intacto.
let messageBox = document.getElementById("donation-message");
if (!messageBox && section) {
  messageBox = document.createElement("p");
  messageBox.id = "donation-message";
  messageBox.setAttribute("role", "status");
  section.insertBefore(messageBox, form);
}

// --- Mensajes por estado ---------------------------------------------------
const STATE_MESSAGES = {
  NORMAL: "Zona segura. Gracias por tu intención de ayudar.",
  PRECAUCION: "El módulo de ayuda no está activo en este momento.",
  ALERTA: "Ayuda a los afectados: completa el formulario para ofrecer materiales.",
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

  if (form) {
    // Deshabilita todos los campos y el botón de envío cuando no está en ALERTA.
    Array.from(form.elements).forEach((el) => {
      el.disabled = !isActive;
    });
  }

  if (section) {
    section.classList.toggle("donation-blocked", !isActive);
    section.classList.toggle("donation-active", isActive);
  }

  showMessage(STATE_MESSAGES[safeStatus], isActive ? "info" : "blocked");
}

/**
 * Valida y envía un ofrecimiento de donación.
 *
 * @param {{nombre: string, telefono: string, categorias: string[], ubicacion: string}} data
 * @returns {Promise<void>}
 */
export function submitDonation(data) {
  if (currentStatus !== "ALERTA") {
    // Comprobación defensiva: el formulario ya debería estar deshabilitado,
    // pero nunca confiamos únicamente en la interfaz.
    showMessage("El módulo de ayuda no está activo en este momento.", "blocked");
    return Promise.reject(new Error("Las donaciones no están activas para el estado actual."));
  }

  const validationError = validateDonation(data);
  if (validationError) {
    showMessage(validationError, "error");
    return Promise.reject(new Error(validationError));
  }

  if (isSubmitting) {
    // Evita envíos duplicados mientras una solicitud ya está en curso.
    return Promise.resolve();
  }

  setSubmittingState(true);

  const payload = {
    nombre: data.nombre.trim(),
    telefono: data.telefono.trim(),
    categorias: data.categorias,
    ubicacion: data.ubicacion.trim(),
  };

  return fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`El servicio de email respondió con estado ${response.status}`);
      }
      showMessage("Gracias por tu donación. Hemos recibido tu ofrecimiento.", "success");
      if (form) form.reset();
    })
    .catch((error) => {
      console.error("[donations.js] submitDonation falló:", error);
      showMessage("No fue posible enviar tu ofrecimiento. Inténtalo nuevamente.", "error");
      throw error;
    })
    .finally(() => {
      setSubmittingState(false);
    });
}

// --- Funciones auxiliares ---------------------------------------------------------------

function validateDonation(data) {
  if (!data.nombre || !data.nombre.trim()) {
    return "Por favor completa todos los campos obligatorios.";
  }
  if (!data.ubicacion || !data.ubicacion.trim()) {
    return "Por favor completa todos los campos obligatorios.";
  }
  if (!Array.isArray(data.categorias) || data.categorias.length === 0) {
    return "Selecciona al menos una categoría de donación.";
  }
  return null;
}

function setSubmittingState(submitting) {
  isSubmitting = submitting;
  if (submitButton) {
    submitButton.disabled = submitting;
    submitButton.textContent = submitting ? "Enviando..." : "Enviar donación";
  }
}

function showMessage(text, kind) {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.dataset.kind = kind; // "info" | "blocked" | "error" | "success"
}

// --- Conexión del formulario (solo si existe en la página actual) -------------
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const categorias = formData.getAll("categorias");

    submitDonation({
      nombre: formData.get("nombre") || "",
      telefono: formData.get("telefono") || "",
      categorias,
      ubicacion: formData.get("ubicacion") || "",
    }).catch(() => {
      // El error ya se mostró mediante showMessage(); no hay nada más que hacer aquí.
    });
  });

  // Empieza bloqueado hasta que P5 llame a setDonationState() con el estado real.
  setDonationState(currentStatus);
}