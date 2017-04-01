const isPro = process.env.NODE_ENV == 'production'
const webpack = require('webpack')
const path = require('path')
const plugins = []

if(isPro){
  plugins.push(new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true
      }
  }))
}

module.exports = {
  entry: {
      main: ['./src/entry.js']
  },
  output: {
      filename: '[name].js',
      chunkFilename: '[name].js?[chunkhash:10]',
      path: path.resolve(__dirname+'/dist'),
      publicPath: './dist/'
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
        options: {
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
  },
  devtool: 'source-map'
}