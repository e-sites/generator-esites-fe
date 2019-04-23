// Get dependencies/plugins

// Get gonfig
const {
  paths,
  js: { entries, vendor },
} = require('./gulp-config.js');

const folder = paths.folders.js;
const env =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

// Create entry points
const entryPoints = {};
entries.forEach(entry => {
  entryPoints[entry.replace('.js', '')] = `${paths.source + folder}/${entry}`;
});

// Add vendor packages to it's own vendor bundle
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
    // Split vendor packages into our vendor bundle
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
    publicPath: `/${paths.public}/`,
    filename: '[name].js',
  },

  plugins: [],
};
