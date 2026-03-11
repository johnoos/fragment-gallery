const UI_CONFIG = {
  containerId: 'content-panel-container',
  navSelector: '.navig-rail-container__list',
  fragmentPrefix: '/fragments'
};

async function loadFragment(path, pushToHistory = true) {
  const container = document.getElementById(UI_CONFIG.containerId);
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
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const navRoot = document.querySelector(UI_CONFIG.navSelector);
  const mainStage = document.getElementById(UI_CONFIG.containerId);
  const allBtns = document.querySelectorAll('button[data-category]');

  // 1. SIDEBAR NAVIGATION
  if (navRoot) {
    navRoot.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-category]');
      if (!btn) return;
      allBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadFragment(`${UI_CONFIG.fragmentPrefix}/galleries/${btn.dataset.category}.html`);
    });
  }

  // 2. MAIN STAGE (Cards & PDF View)
  if (mainStage) {
    mainStage.addEventListener('click', (e) => {
      const pdfBtn = e.target.closest('button[data-type="pdf"]');
      if (pdfBtn) {
        const pdfUrl = pdfBtn.dataset.url;
        // Save where we came from so Back button works
        const currentPath = window.location.hash.replace('#', '');
        window.history.pushState({ path: currentPath }, '', '#pdf-view');
        
        mainStage.innerHTML = `
          <div class="pdf-viewer-container">
            <button class="btn-back" id="js-back-btn">← Back to Gallery</button>
            <iframe src="${pdfUrl}" width="100%" height="800px" style="border:none;"></iframe>
          </div>`;
        
        document.getElementById('js-back-btn')?.addEventListener('click', () => window.history.back());
        return;
      }

      const viewBtn = e.target.closest('button[data-slug]');
      if (viewBtn) {
        const { category, slug } = viewBtn.dataset;
        loadFragment(`${UI_CONFIG.fragmentPrefix}/docs/${category}/${slug}.html`);
      }
    });
  }

  // 3. HISTORY MANAGEMENT
  window.addEventListener('popstate', (e) => {
    if (e.state?.path) {
      loadFragment(e.state.path, false);
    }
  });

  // 4. BOOTSTRAP (Extra Guarded)
  const hashPath = window.location.hash.replace('#', '');
  
  if (hashPath && hashPath.includes('.html')) {
     loadFragment(hashPath, false);
     // Sidebar Sync
     const parts = hashPath.split('/');
     const slugIndex = parts.indexOf('galleries') !== -1 ? parts.indexOf('galleries') + 1 : parts.indexOf('docs') + 1;
     if (slugIndex > 0 && parts[slugIndex]) {
        const cat = parts[slugIndex].replace('.html', '');
        const match = document.querySelector(`button[data-category="${cat}"]`);
        if (match) {
          allBtns.forEach(b => b.classList.remove('active'));
          match.classList.add('active');
        }
     }
  } else if (allBtns.length > 0 && mainStage && !mainStage.innerHTML.trim()) {
      const firstBtn = allBtns[0];
      firstBtn.classList.add('active');
      loadFragment(`${UI_CONFIG.fragmentPrefix}/galleries/${firstBtn.dataset.category}.html`);
  }
});