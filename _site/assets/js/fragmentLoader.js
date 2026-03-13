// fragmentLoader.js

export function showSpinner() {
  const spinner = document.getElementById('page-spinner');
  spinner?.classList.add('active');
}

export function hideSpinner() {
  const spinner = document.getElementById('page-spinner');
  spinner?.classList.remove('active');
}

export async function loadFragment(path, pushToHistory = true) {
  showSpinner();
  const container = document.getElementById('content-panel-container');
  if (!container || !path) return;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const html = await response.text();
    container.innerHTML = html;

    if (pushToHistory) {
      window.history.pushState({ path }, '', `#${path}`);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
  } finally {
    hideSpinner();
  }
}
