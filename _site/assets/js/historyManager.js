// historyManager.js
import { loadFragment } from './fragmentLoader.js';

export function setupHistory(allBtns) {
  window.addEventListener('popstate', (e) => {
    if (e.state?.path) {
      loadFragment(e.state.path, false);
    }
  });

  const hashPath = window.location.hash.replace('#', '');
  if (!allBtns || allBtns.length === 0) return;

  if (hashPath && hashPath.includes('.html')) {
    loadFragment(hashPath, false);

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
  } else {
    const firstBtn = allBtns?.[0];
    const mainStage = document.getElementById('content-panel-container');

    if (mainStage && firstBtn && !mainStage.innerHTML.trim()) {
        firstBtn.classList.add('active');
        loadFragment(`/fragments/galleries/${firstBtn.dataset.category}.html`, false);
    }
  }
}