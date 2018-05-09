module.exports = {
  js: {
    entries: [
      'app.js',
    ],
    vendor: [
      '<%= sourcePath %>/js/polyfills/core-js',
      'svgxuse',
      '@e-sites/vestigo',
      'scriptjs',
      'conditioner-core',
    ],
  },
  paths: {
    tasks: '/tasks',
    source: '<%= sourcePath %>',<% if (usePatternLibrary) { %>
    patterns: '<%= patternPath %>',<% } %>
    dist: '<%= buildPath %>',
    webroot: '<%= webRootPath %>',
    public: '<%= buildFolder %>',
    folders: {
      fonts: '/fonts',
      css: '/css',
      js: '/js',
      images: '/img',
      svg: '/svg',
      mjml: '/path-to-mail',
    },
  },
  copyAssets: true,
  patternlibrary: <% if (usePatternLibrary) { %>true<% } else { %>false<% } %>,
  sync: {
    open: 'local',
    openPath: '/<%= openPath %>',
  },
  revisionFiles: true,
  mjml: {
    enabled: false,
    extension: '.twig',
  },
};
