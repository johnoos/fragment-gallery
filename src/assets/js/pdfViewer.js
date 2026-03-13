// pdfViewer.js
export function openPdfViewer(url, title = 'Document Viewer') {
  // Prevent background scrolling
  document.body.style.overflow = 'hidden';

  const viewerContainer = document.createElement('div');
  viewerContainer.classList.add('pdf-viewer-container');

  // Toolbar
  const toolbar = document.createElement('header');
  toolbar.classList.add('viewer-toolbar');
  // ... setup btnBack, viewerTitle, btnDownload as before

  const iframe = document.createElement('iframe');
  iframe.src = `${url}#view=FitH`;
  iframe.title = 'PDF Viewer';

  viewerContainer.appendChild(toolbar);
  viewerContainer.appendChild(iframe);
  document.body.appendChild(viewerContainer);

  // Wait for iframe to load, then hide spinner
  iframe.addEventListener('load', () => {
    hideSpinner();   // <-- hide the global spinner
  });
}

  const viewerTitle = document.createElement('span');
  viewerTitle.classList.add('viewer-title');
  viewerTitle.textContent = title;

  const btnGroup = document.createElement('div');
  btnGroup.classList.add('btn-group');

  const btnDownload = document.createElement('a');
  btnDownload.classList.add('btn-download');
  btnDownload.href = url;
  btnDownload.download = '';
  btnDownload.textContent = 'Download';

  btnGroup.appendChild(btnDownload);
  toolbar.appendChild(btnBack);
  toolbar.appendChild(viewerTitle);
  toolbar.appendChild(btnGroup);

  const iframe = document.createElement('iframe');
  iframe.src = `${url}#view=FitH`;
  iframe.title = 'PDF Viewer';



  viewerContainer.appendChild(toolbar);
  viewerContainer.appendChild(iframe);
  document.body.appendChild(viewerContainer);

  spinner.classList.add('active');
  iframe.addEventListener('load', () => {
    spinner.classList.remove('active');
  });
}