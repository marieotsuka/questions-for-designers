
module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addWatchTarget('./docs/assets/css/*', './docs/assets/js/*');
  eleventyConfig.setBrowserSyncConfig({
    files: ['./docs/assets/css/*', './docs/assets/js/*']
  });


  // Custom filters
  function sortById(values) {
    let vals = [...values]
    return vals.sort((a, b) => Math.sign(a.data.id - b.data.id))
  }

  // filtering responses by question
  function filterById(collection, id){
    if (!id) return collection;
    const filtered = collection.filter(item => item.data.id == id)
    return filtered;
  }

  // filtering responses by designer
  function filterByDesigner(collection, name) {
    if (!name) return collection;
    const filtered = collection.filter(item => item.data.name == name)
    return filtered;
  }

  // Add the filter.
  eleventyConfig.addFilter('sortById', sortById);
  eleventyConfig.addFilter('filterById', filterById);
  eleventyConfig.addFilter('filterByDesigner', filterByDesigner);
  
  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
  
};