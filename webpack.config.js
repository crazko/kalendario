const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  const isProductionRun = (env && env.production) || false;

  return {
    // devtool: isProductionRun ? 'source-map' : 'cheap-eval-source-map',
    entry: {
      background: './src/background.ts',
      content: './src/content.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.ts'],
    },
    module: {
      loaders: [
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
