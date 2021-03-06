module.exports = {
  js: {
    entries: ['app.js', 'admin.js'],
    vendor: [
      'core-js/web/dom-collections',
      'core-js/stable/object',
      'core-js/stable/array',
      'core-js/stable/promise',
      'core-js/stage/4',
      'element-closest',
      'svgxuse',
      'conditioner-core',
      'formbouncerjs',
    ],
  },
  paths: {
    tasks: '/tasks',
    source: '<%= sourcePath %>',
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
  sync: {
    open: 'local',
    openPath: '/<%= openPath %>',
  },
  revisionFiles: true,
};
