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
    console.log('Button clicked:', btn?.dataset.category);
    if (!btn) return;
    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadFragment(`/fragments/galleries/${btn.dataset.category}.html`);
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