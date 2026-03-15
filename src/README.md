# Academic Portfolio (Eleventy + Nunjucks)

My personal academic portfolio and research repository. Built with [Eleventy](https://www.11ty.dev/) and [Nunjucks](https://mozilla.github.io), hosted on [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-eleventy-site/).

## 💻 Local Development
### Prerequisites
- **OS:** macOS (Optimized for Apple Silicon)
- **Node.js:** v18+ (Recommended)
- **Package Manager:** npm

### Setup & Run
1. Clone the repository: `git clone <your-repo-url>`.
2. Install dependencies:
   ```bash
   npm install


my-academic-portfolio/ (or johnoosthuizen/Documents/code/fragment-gallery - backed up to google drive app)
├── .eleventy.js
├── package.json
├── README.md          <-- Root
├── CONTENT_GUIDE.md   <-- Root
├── src/
│   ├── _data/
│   ├── _includes/
│   └── content/
└── _site/ (ignored by git)

style.css strategy and benefits
Benefits of this Refactor
Single Source of Truth: You no longer have to update height or overflow in three different files.
Avoids Clipping: By using flex: 1 on the .middle-wrapper, the browser automatically calculates the exact height available for your content, regardless of browser address bars or header sizes.
Semantic Consistency: Your <footer> remains a structural constant, while .main-footer acts as the inner layout container for your dynamic SPA content. 
DEV Community
DEV Community
3. Allocation of Responsibilities
Element	Responsibility
<footer> Tag	Structural anchor. Handled in base.css with flex-shrink: 0 to stay visible.
.main-footer Class	Stylistic layout. Handled in the media query to adjust padding or text size for desktop.
#content-panel-container	The "Stage." This is the only element that should ever have a scrollbar.
By aligning your code with these standards, your SPA will feel like a native app where the Header and Footer are locked in place and only the Content moves.