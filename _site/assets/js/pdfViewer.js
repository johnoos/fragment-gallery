export function openPdfViewer(url, title = 'Document Viewer') {
  const wrapper = document.querySelector('.outer-wrapper');
  const contentPanel = document.getElementById('content-panel-container');
  const isDesktop = window.innerWidth >= 768;

  // 1. Create the Container
  const viewerContainer = document.createElement('div');
  viewerContainer.classList.add('pdf-viewer-container');

  // 2. Toolbar Setup
  const toolbar = document.createElement('header');
  toolbar.classList.add('viewer-toolbar');

  const btnBack = document.createElement('button');
  btnBack.textContent = 'Close';

  // --- THE LOGICAL HOOKS ---
  btnBack.onclick = () => {
    // Restore the Website Sidebar if it was hidden via the .pdf-active class
    if (wrapper) wrapper.classList.remove('pdf-active');
    
    // Find the parent (either Content Panel or Body) and clean up
    const parent = viewerContainer.parentElement;
    if (parent) {
      parent.removeChild(viewerContainer);
      // Give the scrollbar back to the content panel
      parent.style.overflow = 'auto'; 
    }
    // Global scroll reset for mobile
    document.body.style.overflow = ''; 
  };

  const viewerTitle = document.createElement('span');
  viewerTitle.classList.add('viewer-title');
  viewerTitle.textContent = title;

  const btnDownload = document.createElement('a');
  btnDownload.href = url;
  btnDownload.download = '';
  btnDownload.textContent = 'Download';

  toolbar.append(btnBack, viewerTitle, btnDownload);

  // 3. Iframe Setup
  const iframe = document.createElement('iframe');
  // #navpanes=1 shows the PDF's internal sidebar (thumbnails/bookmarks)
  iframe.src = `${url}#navpanes=1&view=FitH`;
  iframe.title = 'PDF Viewer';

  // 4. Spinner logic
  const spinner = document.getElementById('spinner');
  if (spinner) spinner.classList.add('active');

  iframe.addEventListener('load', () => {
    if (spinner) spinner.classList.remove('active');
  });

  // 5. ASSEMBLE AND INJECT
  viewerContainer.append(toolbar, iframe);

  if (isDesktop && contentPanel) {
    /* 
       DESKTOP STRATEGY: 
       Inject into the 'Stage' (Middle Section). 
       Because the Stage is between the Header and Footer, 
       the PDF will not overlap them.
    */
    contentPanel.style.overflow = 'hidden'; // Lock the stage scroll
    contentPanel.appendChild(viewerContainer);
  } else {
    /* 
       MOBILE STRATEGY: 
       Full-screen overlay on the body for maximum readability.
    */
    document.body.appendChild(viewerContainer);
    document.body.style.overflow = 'hidden';
  }
}