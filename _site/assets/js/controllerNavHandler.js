/**
 * UI CONTROLLER: Orchestrates fragment fetching and DOM injection.
 * High Cohesion: Handles only the "View Transition" logic.
 */


const UI_CONFIG = {
  containerId: 'content-panel-container',
  navSelector: '.navig-rail-container__list',
  fragmentPrefix: '/fragments'
};

console.log("Nav Element found?", document.querySelector(UI_CONFIG.navSelector));
console.log("Main Stage found?", document.getElementById(UI_CONFIG.containerId));

/**
 * CORE: Fetches HTML and injects it into the target container.
 */
async function loadFragment(path, pushToHistory = true) {
  const container = document.getElementById(UI_CONFIG.containerId);
  if (!container) return;

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Status ${response.status}: ${path}`);

    const html = await response.text();
    container.innerHTML = html;

    if (pushToHistory) {
      window.history.pushState({ path }, '', `#${path}`);
    }
  } catch (err) {
    console.error('Render Error:', err);
    container.innerHTML = `<div class="error">Content unavailable.</div>`;
  }
}

/**
 * INITIALIZATION: Orchestrates event listeners using Delegation.
 */
document.addEventListener('DOMContentLoaded', () => {
  const navRoot = document.querySelector(UI_CONFIG.navSelector);
  
  console.log('Nav Root Found:', !!navRoot); // Check if the container exists

  const mainStage = document.getElementById(UI_CONFIG.containerId); 
  console.log('Main Stage Found:', !!mainStage); // Add this to verify

  if (navRoot) {
    navRoot.addEventListener('click', (e) => {
      console.log('Raw click target:', e.target); // See exactly what element was touched
      const btn = e.target.closest('button[data-category]');
      console.log('Closest Button:', btn); // Confirm if the delegation finds the button
      if (!btn) return;

      const { category } = btn.dataset;
      loadFragment(`${UI_CONFIG.fragmentPrefix}/galleries/${category}.html`);
    });
  }

  // 2. STAGE DELEGATION (Gallery Cards -> Doc Views)
  if (mainStage) {
    mainStage.addEventListener('click', (e) => {
      const card = e.target.closest('.doc-card');
      if (!card) return;

      const { category, slug } = card.dataset;
      loadFragment(`${UI_CONFIG.fragmentPrefix}/docs/${category}/${slug}.html`);
    });
  }

  // 3. HISTORY MANAGEMENT (Browser Back/Forward)
  window.addEventListener('popstate', (e) => {
    if (e.state?.path) loadFragment(e.state.path, false);
  });

  // 4. BOOTSTRAP: Load first category if the stage is empty
  const initialBtn = document.querySelector('button[data-category]');
  if (initialBtn && mainStage && !mainStage.innerHTML.trim()) {
    const { category } = initialBtn.dataset;
    loadFragment(`${UI_CONFIG.fragmentPrefix}/galleries/${category}.html`);
  }
});