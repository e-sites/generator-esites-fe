const ManifestPlugin = require('webpack-manifest-plugin');
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
    publicPath: `/${paths.public + folder}/`,
    filename: revisionFiles ? '[name].[contenthash].js' : '[name].js',
  },

  plugins: [
    new ManifestPlugin({
      basePath: `${paths.public + folder}/`,
    }),
  ],
};
