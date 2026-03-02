```mermaid

graph TD
    %% Priority Flow
    subgraph Global ["1. Global Scope (Lowest Priority)"]
        G1["_data/*.js | .json"]
        G2["eleventyConfig.addGlobalData()"]
    end

    subgraph Directory ["2. Directory Scope"]
        D1["[dir]/[dir].11tydata.js"]
        D2["[dir]/[dir].json"]
    end

    subgraph Layout ["3. Layout Scope"]
        L1["_includes/layouts/*.njk (Front Matter)"]
    end

    subgraph Template ["4. Template Scope (High Priority)"]
        T1["template.11tydata.js"]
        T2["template.md (Front Matter)"]
    end

    subgraph Computed ["5. Computed Scope (Final Priority)"]
        C1["eleventyComputed: { ... }"]
    end

    %% Relationships
    Global -->|Merged into| Directory
    Directory -->|Merged into| Layout
    Layout -->|Merged into| Template
    Template -->|Merged into| Computed
    Computed --> Output((Final Page Data))

    %% Styling
    style Global fill:#f5f5f5,stroke:#333
    style Template fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Computed fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    style Output fill:#c8e6c9,stroke:#2e7d32