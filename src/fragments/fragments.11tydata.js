// see the following doc for the roles of .eleventy.js, prePreviews.js, and fragments.11tydata.js
// https://docs.google.com/document/d/1Dq5u_j11XlhlM0QjSIrfAKSdZVLAOnnqdbqtUgfgFU0/edit?tab=t.0 

export default {
  layout: null,
  eleventyComputed: {
    permalink: (data) => {
      // 1. ADD A PREFIX HERE ('/docs/') TO AVOID COLLISION
      if (data.cat && data.cat.slug) {
        return `/fragments/docs/${data.cat.slug}/index.html`; 
      }

      // 2. Keep the original 'menu_item' logic
      if (data.menu_item && data.menu_item.slug) {
        return `/fragments/${data.menu_item.slug}/index.html`;
      }

      return `/fragments/${data.page.fileSlug}/index.html`;
    }
  }
};