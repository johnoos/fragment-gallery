export default function(eleventyConfig) {
  // Map internal folders to root-level public folders
  eleventyConfig.addPassthroughCopy( "src/assets" );
  eleventyConfig.addPassthroughCopy( "src/css" );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes" // Where layouts and private partials live
    },
    // Ensure .njk files are processed as Nunjucks
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};