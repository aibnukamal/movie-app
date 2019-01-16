const {
  VueLoaderPlugin
} = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: './views/index.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    inline: false,
    contentBase: './dist',
  },  
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vue-loader'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  devServer: {
    port: 5000
  }
}