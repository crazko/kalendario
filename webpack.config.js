const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = (env, argv) => {
  const isProductionRun = argv.mode === 'production';

  return {
    devtool: isProductionRun ? 'source-map' : 'cheap-eval-source-map',
    entry: {
      background: './src/background.ts',
      content: './src/content.ts',
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new CopyWebpackPlugin([
        {
          from: 'src/_locales',
          to: '_locales',
        },
        {
          from: 'src/icons',
          to: 'icons',
        },
        {
          from: 'src/manifest.json',
        },
      ]),
      argv.watch ? new ChromeExtensionReloader() : null,
    ].filter(plugin => !!plugin),
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.ts'],
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
  };
};
