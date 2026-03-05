/**
 * Core function to fetch and inject fragments
 */
async function loadContent(fragmentPath) {
  const container = document.getElementById('content-panel-container');
  if (!container) return;

  try {
    const response = await fetch(fragmentPath);
    
    // Fallback: If the fragment is missing or empty
    if (!response.ok) throw new Error(`Fragment not found: ${fragmentPath}`);

    const html = await response.text();
    container.innerHTML = html;
    
    // Update browser history for the Back button
    window.history.pushState({ path: fragmentPath }, '', `#${fragmentPath}`);

  } catch (err) {
    console.error('Navigation Error:', err);
    container.innerHTML = `
      <div class="error-state">
        <p>This content is currently unavailable.</p>
        <button onclick="location.reload()">Return Home</button>
      </div>`;
  }
}

/**
 * INITIALIZATION: Runs when the page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. LINKING THE NAVIGATION RAIL
  // Listen for clicks on sidebar items
  document.querySelectorAll('.nav-rail-container-style__item').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      loadContent(`/fragments/galleries/${category}.html`);
    });
  });

  // 2. LINKING THE GALLERY CARDS (Event Delegation)
  // Since gallery cards are loaded dynamically, we listen on the parent container
  const mainContainer = document.getElementById('content-panel-container');
  if (mainContainer) {
    mainContainer.addEventListener('click', (e) => {
      const docCard = e.target.closest('.doc-card');
      if (docCard) {
        const { category, slug } = docCard.dataset;
        loadContent(`/fragments/docs/${category}/${slug}.html`);
      }
    });
  }

  // 3. HANDLE BROWSER BACK BUTTON
  window.onpopstate = (event) => {
    if (event.state && event.state.path) {
      loadContent(event.state.path);
    }
  };

  // 4. AUTOMATIC FIRST LOAD (alternative to the current index.html 'extendes base.njk')
  // Load the first available category so the screen isn't blank
  // const firstButton = document.querySelector('.nav-rail-container_style__item');
  // if (firstButton) {
  //  loadContent(`/fragments/galleries/${firstButton.dataset.category}.html`);
  // }
});