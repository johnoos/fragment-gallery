// src/_data/allDocs.js
const sidebar = require("./alldocs.json");

module.exports = function() {
  const flatList = [];

  sidebar.forEach(category => {
    category.documents.forEach(doc => {
      // We push a new object that combines the document 
      // info with its parent category info.
      flatList.push({
        ...doc,
        categoryTitle: category.title,
        categorySlug: category.slug
      });
    });
  });

  return flatList;
};
