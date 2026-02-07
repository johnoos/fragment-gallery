export default function(eleventyConfig) {
  // Map internal folders to root-level public folders
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};