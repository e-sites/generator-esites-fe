const { revisionFiles, paths, js: { entries, vendor } } = require('./gulp-config.js');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const folder = paths.folders.js;

// Create entry points
const entryPoints = {};
entries.forEach((entry) => {
  entryPoints[entry.replace('.js', '')] = `${paths.source + folder}/${entry}`;
});

// Add vendor packages to vendor bundle
entryPoints.vendor = vendor;

// Export the config
module.exports = {
  mode: env,

  entry: entryPoints,

  module: {
    rules: [
      // javascript
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },

  output: {
    filename: '[name].[contenthash].js',
  },
};


// const Encore = require('@symfony/webpack-encore');

// const { revisionFiles, paths, js: { entries, vendor } } = require('./gulp-config.js');

// const folder = paths.folders.js;

// const env = process.env.NODE_ENV === 'production' ? 'production' : 'dev';

// Encore.configureRuntimeEnvironment(env);

// Encore
//   // directory where all compiled assets will be stored
//   .setOutputPath(paths.dist + folder)

//   // what's the public path to this directory (relative to your project's document root dir)
//   .setPublicPath(`/${paths.public + folder}`)

//   // empty the outputPath dir before each build
//   // .cleanupOutputBeforeBuild()

//   .enableSourceMaps(!Encore.isProduction())

//   // Split vendor assets from the entries
//   .createSharedEntry('vendor', vendor);

// // Dynamically load entry points
// entries.forEach((entry) => {
//   Encore.addEntry(entry.replace('.js', ''), `${paths.source + folder}/${entry}`);
// });

// // Check for errors and exit the process
// if (env === 'production') {
//   Encore.addPlugin(function () { // eslint-disable-line func-names, needed to expose `this`
//     this.plugin('done', (stats) => {
//       if (stats.compilation.errors && stats.compilation.errors.length) {
//         throw new Error('webpack build failed');
//       }
//     });
//   });
// }

// if (revisionFiles && env === 'production') {
//   Encore.enableVersioning();
// }

// // Expose webpack config
// const config = Encore.getWebpackConfig();

// // export the final configuration
// module.exports = config;
