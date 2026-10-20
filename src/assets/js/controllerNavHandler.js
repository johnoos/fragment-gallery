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
    const sidebarContainer = document.getElementById('navig-rail-container');
    
    if (window.innerWidth < 768 && sidebarContainer) {
      sidebarContainer.classList.remove('open'); 
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

  // ==========================================================================
  // INCOMING SUBDOMAIN DEEP-LINK INTERCEPTOR ROUTE
  // ==========================================================================
  const incomingRoute = window.location.hash.replace('#', '');
  if (incomingRoute) {
    // Attempt to locate a menu button matching the incoming subdomain hash parameters
    const targetButton = document.querySelector(`button[data-category="${incomingRoute}"]`);
    if (targetButton) {
      // 150ms buffer to ensure your fragment loader components have mounted
      setTimeout(() => {
        console.log(`[THE LOGIC PIPELINE] Subdomain route matched: ${incomingRoute}. Auto-triggering UI pipeline.`);
        targetButton.click(); // Automates the internal fragment fetching pipeline natively
      }, 150);
    }
  }
});