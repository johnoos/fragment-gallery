# Content Management Guide

This guide ensures all academic entries follow a consistent format for the [Eleventy Data Cascade](https://www.11ty.dev).

## 📄 Publications & Papers
Place new publications in `src/content/publications/` as Markdown files.

### Front Matter Schema
Every publication file MUST include these fields:


| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Full title of the paper. |
| `date` | YYYY-MM-DD | Publication date (used for chronological sorting). |
| `venue` | String | Journal or conference name (e.g., "Nature", "CVPR"). |
| `doi` | String | (Optional) DOI link for verification. |
| `pdf` | String | Path to file (e.g., `/assets/pdf/filename.pdf`). |
| `tags` | Array | Research areas (e.g., `["AI", "Ethics"]`). |

---

## 🛠 Projects & Research
Place these in `src/content/projects/`.

### Requirements
- **Thumbnails:** Every project must have a corresponding image in `src/assets/img/projects/`.
- **Status:** Use a `status` field in the front matter (`"Ongoing"`, `"Completed"`, or `"Archived"`).

---

## 🖼 Media Guidelines
- **Accessibility:** Always include an `alt` attribute: `![Description of image](/path/to/image.jpg)`.
- **Optimization:** Use [Squoosh](https://squoosh.app) to compress images before committing to GitHub.
- **Large Files:** For posters or high-res PDFs, ensure they are tracked via [Git LFS](https://git-lfs.github.com).