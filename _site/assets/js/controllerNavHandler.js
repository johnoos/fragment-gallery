// controllerNavHandler.js
import { openPdfViewer } from './pdfViewer.js';
import { loadFragment } from './fragmentLoader.js';
import { showSpinner, hideSpinner } from './utils.js';
import { toggleSidebar, closeSidebarIfClickedOutside } from './sidebar.js';
import { setupHistory } from './historyManager.js';

window.toggleMenu = toggleSidebar;

document.addEventListener('DOMContentLoaded', () => {
  const mainStage = document.getElementById('content-panel-container');
  const navRoot = document.querySelector('.navig-rail-container__list');
  const allBtns = document.querySelectorAll('button[data-category]');

  closeSidebarIfClickedOutside();
  setupHistory(allBtns);

  // Sidebar click
navRoot?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-category]');
  if (!btn) return;

  // 1. UI Feedback: Update Active State
  allBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // 2. Data Load: Fetch the fragment
  loadFragment(`/fragments/galleries/${btn.dataset.category}.html`);

  // 3. UX: Close Sidebar on Mobile
  // Get the actual sidebar element (id from our new CSS)
  const sidebarContainer = document.getElementById('navig-rail-container');
  
  if (window.innerWidth < 768 && sidebarContainer) {
    // Only use ONE class name consistently across CSS and JS
    sidebarContainer.classList.remove('open'); 
    
    // Optional: If you use a 'menu-overlay' to dim the background, close it too
    document.getElementById('menu-overlay')?.classList.remove('active');
  }
});

  // Main stage click (PDF or other docs)
  mainStage?.addEventListener('click', (e) => {
    const pdfBtn = e.target.closest('button[data-type="pdf"]');
    if (pdfBtn) {
      const { url, title } = pdfBtn.dataset;
      showSpinner();
      openPdfViewer(url, title);
      return;
    }

    const viewBtn = e.target.closest('button[data-slug]');
    if (viewBtn) {
      const { category, slug } = viewBtn.dataset;
      loadFragment(`/fragments/docs/${category}/${slug}.html`);
    }
  });
});