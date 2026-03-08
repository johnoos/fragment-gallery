// Change "module.exports = function" to "export default function"
export default function(eleventyConfig) {
  
  // Force 11ty to physically copy files to _site during dev
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // Ensure your assets are being copied
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/css");

  // ... rest of your config ...

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};