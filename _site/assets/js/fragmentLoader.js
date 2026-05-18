// fragmentLoader.js

// We need to "re-trigger" this animation every time a new fragment is loaded. 
// Since the browser only runs an animation once when a class is added, 
// we remove and re-add the class.

import { showSpinner, hideSpinner } from './utils.js';

export async function loadFragment(path, pushToHistory = true) {
  showSpinner();
  const container = document.getElementById('content-panel-container');
  if (!container || !path) return;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const html = await response.text();

    // 1. Reset the animation state
    container.classList.remove('fade-in-active');

    // 2. Inject the new content
    container.innerHTML = html;

    // 2. Immediate Scroll Reset before the animation starts
  container.scrollTop = 0; // Standard way to reset scroll

    // 3. Force a browser "reflow" 
    // (This ensures the browser notices the class was removed/added)
    void container.offsetWidth; 

    // 4. Trigger the fade-in
    container.classList.add('fade-in-active');

    // 5. UX: Always scroll the content panel back to the top
    container.scrollTo(0, 0);

    if (pushToHistory) {
      window.history.pushState({ path }, '', `#${path}`);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
    container.innerHTML = `<p style="padding:2rem;">Error loading content: ${err.message}</p>`;
  } finally {
    hideSpinner();
  }
}