const path = require('path')
const WriteFilePlugin = require('write-file-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/js/index.js', './src/scss/modalmadness.scss'],
  output: {
    filename: 'modalmadness.js',
    path: path.join(__dirname, './dist')
  },
  plugins: [
    new WriteFilePlugin(),
  ],
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components|dist)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }],
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'file-loader',
            options: {
              name: 'css/[name].css'
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader?-url'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  stats: {
    colors: true
  },
  devServer: {
    "stats": "errors-only",
    host: process.env.HOST,
    port: process.env.PORT,
    open: true,
  }
}
