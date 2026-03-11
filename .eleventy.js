// Change "module.exports = function" to "export default function"
export default function(eleventyConfig) {

  // FILTER 1: For the URL (e.g., "01-Curriculum-Vitae" -> "curriculum-vitae")
eleventyConfig.addFilter("cleanSlug", (str) => {
  if (!str) return "";
  return str.toLowerCase()
            .replace(/^\d+[-_]*/, "") // Remove 01-
            .replace(/\s+/g, "-")      // Spaces to hyphens
            .replace(/[^a-z0-9-]/g, ""); // Remove special chars
});

// FILTER 2: For the UI Text (e.g., "01-Curriculum-Vitae" -> "Curriculum Vitae")
eleventyConfig.addFilter("cleanText", (str) => {
  if (!str) return "";
  return str
    .replace(/^\d+[-_]*/, "")    // Remove 01-
    .replace(/[-_]+/g, " ")      // Hyphens/Underscores to spaces
    .trim()
    // REMOVED .toLowerCase() to preserve existing caps
    .split(" ")
    .map(word => {
      // 1. If word is already mostly uppercase (ATCL, PhD, 2025), leave it alone
      if (/[A-Z]{2,}/.test(word) || /\d/.test(word) || word === "PhD") {
        return word;
      }
      // 2. Otherwise, capitalize first letter, lowercase the rest (marketing -> Marketing)
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
});
  
  // Force 11ty to physically copy files to _site during dev
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // Ensure your assets are being copied
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  // 1. Tell Eleventy to watch the previews folder for changes
  // This ensures the server "sees" new images as they are generated
  eleventyConfig.addWatchTarget("./src/assets/previews/");

  // 2. Ensure the copy behavior is set to "copy" (not "emulated")
  // This physically moves the files so the Dev Server finds them in _site
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};