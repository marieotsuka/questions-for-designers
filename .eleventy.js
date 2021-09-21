module.exports = eleventyConfig => {
  

  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.setBrowserSyncConfig({
      files: './docs/css/*.css'
  });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
  
};