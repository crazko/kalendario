const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = (env, argv) => {
  console.log(env);
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
          loader: 'tslint-loader',
          options: {
            configFile: 'tslint.json',
          },
        },
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
      new CleanWebpackPlugin(['dist']),
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
        },
      ]),
      new webpack.DefinePlugin({
        DEBUG: isProductionRun ? JSON.stringify(false) : JSON.stringify(true),
      }),
      argv.watch ? new ChromeExtensionReloader() : null,
    ].filter(plugin => !!plugin),
  };
};
