/* eslint prefer-template: 0 */
/* eslint no-var: 0 */

var path = require('path');
var webpack = require('webpack');

var entry = path.resolve(__dirname, 'src/index.js');

var sharedConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'reactor-feature-toggle',
    libraryTarget: 'umd',
  },
  module:{
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-0'],
      },
    }],
  },
  externals: [{
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  }],
  resolve: {
    extensions: ['', '.js'],
  },
};

var devBundleConfig = Object.assign({}, sharedConfig, {
  entry: {
    'main': entry,
  },
});

var prodBundleConfig = Object.assign({}, sharedConfig, {
  entry: {
      'main.min': entry,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
      },
    }),
  ],
});

module.exports = [
  devBundleConfig,
  prodBundleConfig,
];
