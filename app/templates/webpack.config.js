// Get dependencies/plugins
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

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
    publicPath: `/${paths.public}/`,
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
    new SVGSpritemapPlugin(`${paths.source + paths.folders.svg}/**/*.svg`, {
      sprite: {
        prefix: false,
        generate: {
          title: false,
        }
      },
      output: {
        filename: `${
          revisionFiles ? 'sprite.[contenthash].svg' : 'sprite.svg'
        }`,
        chunk: {
          name: 'sprite',
          keep: true,
        },
        svg4everybody: true,
      },
    }),

    // copy the rest of the unprocessed files
    new CopyPlugin(
      ['svg', 'images', 'fonts']
        .map(entry => (
          {
            from: `${paths.source + paths.folders[entry]}`,
            to: paths.folders[entry].replace('/', ''),
          }
        ))
    ),

    new WebpackNotifierPlugin({
      title: 'Webpack',
      excludeWarnings: true,
      alwaysNotify: true,
    }),
  ],
};

if (revisionFiles) {
  module.exports.plugins.push(
    new WebpackAssetsManifest({
      output: 'manifest.json',
      publicPath: `/${paths.public}/`,
      merge: true,

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

            const newKey = cleanKey.join('.');

            // insert new key with value
            if (!fs.existsSync(paths.webroot + value)) {
              assets[newKey] = value;
            }
          }
        });
      },
    })
  );
}
