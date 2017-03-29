const webpack = require('webpack')
const path = require('path')
const IS_PRO = process.env.NODE_ENV == 'production'
const plugins = [];

if(IS_PRO){
  plugins.push(new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true,
      }
  }))
}

module.exports = {
  entry: {
      main: ['./src/entry.js']
  },
  output: {
      filename: '[name].js?[hash]',
      path: path.resolve(__dirname+'/dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ["transform-object-assign"]
        },
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  plugins,
  resolve: {
    extensions: ['.js', '.vue', '.jsx'],
    modules: [path.resolve(__dirname, 'node_modules')]
  }
};