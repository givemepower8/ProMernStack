const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/App.jsx',
    vendor: ['react', 'react-dom', 'whatwg-fetch', 'babel-polyfill']
  },
  output: {
    path: '/static',
    filename: 'app.bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          filename: 'vendor.bundle.js',
          chunks: 'all'
        }
      }
    }
  },
  //   plugins: [
  //     new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  //   ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      }
    ]
  },
  devServer: {
    port: 8000,
    contentBase: '/static',
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      }
    }
  },
  devtool: 'source-map'
};
