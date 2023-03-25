var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: '/src/index.tsx',
  output: {  
    filename: 'chess.bundle.js',
    path: path.resolve(__dirname, "js/bundle")
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.scss']
    },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.png$/i,
        loader: 'file-loader',
        options:
        {
          outputPath: 'img'
        }
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          ],
        include: path.join(__dirname, 'src/sass')
      }
    ],
  },
};