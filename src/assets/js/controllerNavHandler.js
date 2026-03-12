/**
 * Toggles the mobile sidebar visibility
 */
window.toggleMenu = function() {
  const sidebar = document.getElementById('navig-rail-container');
  const menuBtn = document.querySelector('.menu-toggle');
  const overlay = document.getElementById('menu-overlay');

  if (sidebar) {
    sidebar.classList.toggle('mobile-open');

    if (overlay) {
      overlay.classList.toggle('active');
    }

    if (menuBtn) {
      menuBtn.textContent =
        sidebar.classList.contains('mobile-open') ? '✕' : '☰';
    }
  }
};

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
      // A. Handle the "View PDF" button (Enhanced)
      const pdfBtn = e.target.closest('button[data-type="pdf"]');
      if (pdfBtn) {
        const { url, title } = pdfBtn.dataset;
        window.history.pushState({ isPdf: true }, '', '#viewer');

        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        mainStage.innerHTML = `
  <style>
    /* 1. Reset and lock the root container */
    .pdf-viewer-container {
      display: flex !important;
      flex-direction: column !important;
      position: fixed !important;
      top: 0; left: 0; bottom: 0; right: 0;
      width: 100vw !important;
      height: 100vh !important;
      background: #333;
      z-index: 10000;
      overflow: hidden; /* Hard boundary for the whole app */
    }

    /* 2. Create a toolbar that respects screen width */
    .viewer-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 16px;
      background: #222;
      flex-shrink: 0; /* Header cannot be squashed vertically */
      width: 100%;
      box-sizing: border-box;
    }

    /* 3. The Title Hack: Prevent it from pushing buttons off-screen */
    .viewer-title {
      flex: 1; /* Take all available space */
      min-width: 0; /* CRITICAL: Allows title to shrink below its text width */
      color: white;
      font-weight: 500;
      margin: 0 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; /* Adds '...' if title is too long */
    }

    /* 4. Fix the Download Button: Prevent stretching or shrinking */
    .btn-group {
      flex-shrink: 0; /* Locks the button group so it's NEVER cut off */
      display: flex;
    }

    .btn-download {
      display: inline-flex;
      align-items: center;
      background: #007bff;
      color: white;
      text-decoration: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 14px;
      white-space: nowrap;
      width: auto !important; /* Forces it to only be as wide as the text */
    }

    /* 5. Fix the Iframe: Force it to respect the parent width */
    .pdf-viewer-container iframe {
      flex: 1; /* Fills remaining vertical space */
      width: 100%;
      height: 100%;
      border: none;
      min-width: 0; /* Allows horizontal shrinking on resize */
      min-height: 0; /* Allows vertical shrinking on resize */
    }

    .btn-back {
      flex-shrink: 0;
      background: #444;
      color: white;
      border: none;
      padding: 6px 12px;
      cursor: pointer;
      border-radius: 4px;
    }
  </style>

  <div class="pdf-viewer-container">
    <header class="viewer-toolbar">
      <button class="btn-back" id="js-close-viewer">✕ Close</button>
      <span class="viewer-title">${title || 'Document Viewer'}</span>
      <div class="btn-group">
        <a href="${url}" download class="btn-download">Download</a>
      </div>
    </header>
    <iframe src="${url}#view=FitH" title="PDF Viewer"></iframe>
  </div>`;

        document.getElementById('js-close-viewer').onclick = () => {
          document.body.style.overflow = ''; 
          window.history.back();
        };
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

  // Global click listener to close mobile sidebar
  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('navig-rail-container');
    const overlay = document.getElementById('menu-overlay');
    const menuBtn = document.querySelector('.menu-toggle');

    if (!sidebar || !sidebar.classList.contains('mobile-open')) return;

    // If click is inside sidebar or menu button, ignore
    if (sidebar.contains(e.target) || menuBtn.contains(e.target)) return;

    // If click is inside PDF viewer (or any other overlay you want to ignore), ignore
    if (e.target.closest('.pdf-viewer-container')) return;

    // Otherwise, close the sidebar
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');

    if (menuBtn) menuBtn.textContent = '☰';
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