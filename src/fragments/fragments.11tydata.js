export default {
  layout: null,
  eleventyComputed: {
    permalink: (data) => {
      // 1. Match the alias 'menu_item' from your .njk file
      if (data.menu_item && data.menu_item.slug) {
        return `/fragments/${data.menu_item.slug}/index.html`;
      }

      // 2. Fallback for files that aren't paginated
      return `/fragments/${data.page.fileSlug}/index.html`;
    }
  }
};