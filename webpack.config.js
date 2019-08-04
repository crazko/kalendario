const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
require('dotenv').config();

module.exports = (env, argv) => {
  const isProductionRun = argv.mode === 'production';

  return {
    devtool: isProductionRun ? 'source-map' : 'cheap-source-map',
    entry: {
      background: './src/background.ts',
      content: './src/content.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts'],
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false, // resolve conflict with `CopyWebpackPlugin`
      }),
      new CopyWebpackPlugin([
        {
          from: 'src/assets/_locales',
          to: '_locales',
        },
        {
          from: 'src/assets/icons',
          to: 'icons',
        },
        {
          from: 'src/assets/styles.css',
        },
        {
          from: 'src/manifest.json',
          transform(content, path) {
            return processManifestFile(content, isProductionRun);
          },
        },
      ]),
      new webpack.DefinePlugin({
        __DEBUG__: isProductionRun
          ? JSON.stringify(false)
          : JSON.stringify(true),
        __CLIENT_ID__: JSON.stringify(process.env.CLIENT_ID),
        __CLIENT_SECRET__: JSON.stringify(process.env.CLIENT_SECRET),
      }),
      argv.watch ? new ChromeExtensionReloader() : null,
    ].filter(plugin => !!plugin),
  };
};

const processManifestFile = (manifest, removeUnnecessaryKey) => {
  manifest = JSON.parse(manifest);
  manifest.oauth2.client_id = process.env.CLIENT_ID;

  if (removeUnnecessaryKey) {
    delete manifest.key;
  }

  return JSON.stringify(manifest, null, 2);
};
