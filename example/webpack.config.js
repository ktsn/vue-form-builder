const path = require('path')

const base = path.resolve(__dirname)

module.exports = {
  context: base,
  entry: './main.ts',
  output: {
    path: base,
    filename: '__build__.js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          scss: 'style-loader!css-loader!sass-loader'
        }
      }
    ]
  },
  devServer: {
    contentBase: base
  }
}