const STORAGE_KEY = "turisafe_ciudad";

export function saveCity(ciudad) {
  // TODO: Serialize ciudad to JSON and store under STORAGE_KEY in localStorage.
}

export function getSavedCity() {
  // TODO: Read STORAGE_KEY from localStorage, parse JSON, and return the object.
  // TODO: Return null if no entry exists.
  return null;
}

export function hasSavedCity() {
  // TODO: Return true if STORAGE_KEY exists in localStorage, false otherwise.
  return false;
}
