```mermaid

sequenceDiagram
    participant Config as .eleventy.js
    participant Data as Data Cascade
    participant Coll as Collections
    participant Temp as Templates/Layouts
    participant Output as _site/ (Output)

    Note over Config: 1. Initialization
    Config->>Config: Load Plugins & Filters
    Config->>Config: addGlobalData()

    Note over Data: 2. Data Discovery
    Data->>Data: Parse Global Data (_data/)
    Data->>Data: Parse Directory & Template Data

    Note over Coll: 3. Collection Creation
    Data->>Coll: Scan all content files
    Coll->>Coll: Run addCollection() logic
    Note right of Coll: Collections are now "locked" and available

    Note over Temp: 4. Rendering Engine
    Temp->>Data: Pull final merged data
    Temp->>Coll: Access collections (e.g. collections.all)
    Temp->>Temp: Apply Layouts & Shortcodes
    Temp->>Temp: Process Includes

    Note over Output: 5. Writing Files
    Temp->>Output: Write .html files
    Config->>Output: Passthrough Copy (Images/CSS)
    
    Note over Output: Build Complete