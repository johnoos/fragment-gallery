```mermaid

graph TD
    subgraph Content
        Page[page.md]
    end

    subgraph Includes ["_includes/"]
        Partial[navigation.njk]
    end

    subgraph Layouts ["_includes/layouts/"]
        Base[base.njk]
        Post[post.njk]
    end

    Page -- "layout: post.njk" --> Post
    Post -- "layout: base.njk" --> Base
    Base -- "includes" --> Partial
    
    style Page fill:#f96,stroke:#333
    style Base fill:#69f,stroke:#333