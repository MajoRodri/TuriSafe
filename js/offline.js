const STORAGE_KEY = "turisafe_ciudad";

/**
 * Comprueba que el valor tiene la forma minima de una ciudad de TuriSafe.
 * Se admiten los dos contratos que conviven actualmente en el proyecto:
 * `nombre` (ciudades.json) y `name` (cities.js).
 *
 * @param {unknown} value
 * @returns {boolean}
 */
function isCity(value) {
  return Boolean(
    value
      && typeof value === "object"
      && typeof value.id === "string"
      && value.id.trim()
      && (
        (typeof value.nombre === "string" && value.nombre.trim())
        || (typeof value.name === "string" && value.name.trim())
      )
  );
}

/**
 * Obtiene LocalStorage sin provocar un fallo de la aplicacion cuando el
 * navegador lo bloquea (modo privado, politica de seguridad, etc.).
 *
 * @returns {Storage|null}
 */
function getStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    console.warn("[offline.js] LocalStorage no esta disponible.", error);
    return null;
  }
}

/**
 * Guarda una copia completa de la ultima ciudad consultada. Al conservar el
 * objeto completo, su ficha historica, kit y telefonos siguen disponibles sin
 * conexion.
 *
 * @param {object} ciudad Ciudad procedente de ciudades.json o cities.js.
 * @returns {boolean} true cuando la ciudad se ha guardado correctamente.
 */
export function saveCity(ciudad) {
  if (!isCity(ciudad)) {
    console.warn("[offline.js] No se guardo una ciudad con datos invalidos.");
    return false;
  }

  const storage = getStorage();
  if (!storage) return false;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(ciudad));
    return true;
  } catch (error) {
    console.error("[offline.js] No fue posible guardar la ficha de ciudad.", error);
    return false;
  }
}

/**
 * Recupera la ultima ficha valida guardada.
 *
 * @returns {object|null} La ciudad guardada o null si no existe/no es valida.
 */
export function getSavedCity() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const serializedCity = storage.getItem(STORAGE_KEY);
    if (!serializedCity) return null;

    const city = JSON.parse(serializedCity);
    if (!isCity(city)) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }

    return city;
  } catch (error) {
    // Una entrada corrupta no debe impedir que la aplicacion arranque.
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // El navegador puede bloquear tambien la eliminacion; no hay mas accion.
    }
    console.warn("[offline.js] Se descarto una ficha local no valida.", error);
    return null;
  }
}

/**
 * Indica si hay una ficha valida disponible para el modo sin conexion.
 *
 * @returns {boolean}
 */
export function hasSavedCity() {
  return getSavedCity() !== null;
}
