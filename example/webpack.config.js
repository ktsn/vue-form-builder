const path = require('path')

const base = path.resolve(__dirname)

module.exports = {
  context: base,
  entry: './main.js',
  output: {
    path: base,
    filename: '__build__.js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    contentBase: base
  }
}