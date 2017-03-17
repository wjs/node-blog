const webpack = require('webpack')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './static/src/app/app.js',
    vendor: [
      'vue',
      'vue-router',
      'vue-resource',
      'marked',
      'highlight.js'
    ],
    admin: [
      'normalize.css',
      './static/src/admin/admin.js'
    ]
  },
  output: {
    path: './static/dist',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  plugins: [
    new ProgressBarPlugin(),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].[chunkhash].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['vendor', 'admin'],
      minChunks: Infinity
    }),
    new ManifestPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new CleanPlugin(['static/dist'], { root: `${process.cwd()}` })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            less: 'vue-style-loader!css-loader?minimize!less-loader',
            css: 'vue-style-loader!css-loader?minimize'
          }
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `css-loader?${
            JSON.stringify({
              minimize: true,
              discardComments: {
                removeAll: true
              }
            })
          }`
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?minimize!less-loader'
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|swf|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}
