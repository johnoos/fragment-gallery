# Front-End Module Interaction Diagram

```mermaid
graph TD
    A[controllerNavHandler.js] --> B[pdfViewer.js]
    A --> C[fragmentLoader.js]
    A --> D[sidebar.js]
    A --> E[historyManager.js]

    B --> F[PDF Viewer DOM & iframe]
    C --> G[Content Panel DOM Updates]
    D --> H[Sidebar DOM & Overlay]
    E --> I[Browser History & Popstate]

    %% Event triggers
    click PDFButton "View PDF Click" --> B
    click DocButton "Doc / Gallery Button Click" --> C
    click MenuToggle "Hamburger Click" --> D
    popstateEvent "Browser Back/Forward" --> E

    %% Shared utilities
    B -.-> J[Spinner Overlay]
    C -.-> J