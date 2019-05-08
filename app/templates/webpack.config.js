// Get dependencies/plugins
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyPlugin = require('copy-webpack-plugin');

// Get gonfig
const {
  revisionFiles,
  paths,
  js: { entries, vendor },
} = require('./esites.config.js');

const folder = paths.folders.js;

// Create entry points
const entryPoints = {};
entries.forEach(entry => {
  entryPoints[entry.replace('.js', '')] = `${paths.source + folder}/${entry}`;
});

// Add vendor packages to it's own vendor bundle
entryPoints.vendor = vendor;

// Export the config
module.exports = {
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

      // CSS
      {
        test: /\.s[c|a]ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules'],
            },
          },
        ],
      },

      // SVG
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: revisionFiles
                ? 'sprite.[contenthash].svg'
                : 'sprite.svg',
            },
          },
          'svgo-loader',
        ],
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
    path: path.resolve(__dirname, paths.dist),
    publicPath: `${paths.public}/`,
    filename: revisionFiles ? '[name].[contenthash].js' : '[name].js',
  },

  plugins: [
    // Extract CSS files
    new MiniCssExtractPlugin({
      filename: revisionFiles ? '[name].[contenthash].css' : '[name].css',
    }),

    // cleanup unused files
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),

    // Generate SVG sprite
    new SpriteLoaderPlugin(),

    // copy the rest of the unprocessed files
    new CopyPlugin([
      // Loose svg's
      {
        from: `${paths.source + paths.folders.svg}`,
        to: paths.folders.svg.replace('/', ''),
      },
      // Loose images
      {
        from: `${paths.source + paths.folders.images}`,
        to: paths.folders.images.replace('/', ''),
      },
    ]),
  ],
};

if (revisionFiles) {
  module.exports.plugins.push(
    new WebpackAssetsManifest({
      output: 'manifest.json',
      publicPath: `${paths.public}/`,

      // Strip hashes from manifest keys if they are present
      transform: assets => {
        const keys = Object.keys(assets);
        const regEx = /\.[^.]{20,}\..{2,}$/;

        keys.forEach(key => {
          if (regEx.test(key)) {
            // cache value
            const value = assets[key];

            // delete false entry
            delete assets[key];

            // Split key on the dot
            const splitKey = key.split('.');

            // flip out the hash from the key
            const cleanKey = splitKey.filter(string => string.length < 20);

            // insert new key with value
            assets[cleanKey.join('.')] = value;
          }
        });
      },
    })
  );
}
