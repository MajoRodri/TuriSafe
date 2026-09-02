const STORAGE_KEY = "turisafe_ciudad";

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

// Envuelve localStorage para no romper la app si el navegador lo bloquea
function getStorage() {
  try {
    return window.localStorage;
  } catch (error) {
    console.warn("[offline.js] LocalStorage no está disponible.", error);
    return null;
  }
}

export function saveCity(ciudad) {
  if (!isCity(ciudad)) {
    console.warn("[offline.js] No se guardó una ciudad con datos inválidos.");
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
