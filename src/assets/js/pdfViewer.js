export function openPdfViewer(url, title = 'Document Viewer') {
  // 1. Prevent background scrolling
  document.body.style.overflow = 'hidden';

  const viewerContainer = document.createElement('div');
  viewerContainer.classList.add('pdf-viewer-container');

  // 2. Toolbar Setup
  const toolbar = document.createElement('header');
  toolbar.classList.add('viewer-toolbar');

  const btnBack = document.createElement('button');
  btnBack.textContent = 'Close';
  btnBack.onclick = () => {
    document.body.removeChild(viewerContainer);
    document.body.style.overflow = ''; // Restore scrolling
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
  iframe.src = `${url}#view=FitH`;
  iframe.title = 'PDF Viewer';

  // 4. Spinner logic (Assuming an element with id 'spinner' exists)
  const spinner = document.getElementById('spinner');
  if (spinner) spinner.classList.add('active');

  iframe.addEventListener('load', () => {
    if (spinner) spinner.classList.remove('active');
  });

  // 5. Assemble and Inject
  viewerContainer.append(toolbar, iframe);
  document.body.appendChild(viewerContainer);
}