let alertTimer = null;

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
