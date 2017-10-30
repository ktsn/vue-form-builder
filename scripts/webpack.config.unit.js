const path = require('path')
const glob = require('glob')

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = {
  entry: [resolve('test/unit/setup.ts')]
    .concat(glob.sync(resolve('test/unit/**/*.spec.ts'))),
  output: {
    path: resolve('.tmp'),
    filename: 'test.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.ts', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        enforce: 'post',
        test: /\.spec\.ts$/,
        loader: 'webpack-espower-loader'
      }
    ]
  },
  devtool: 'source-map'
}
