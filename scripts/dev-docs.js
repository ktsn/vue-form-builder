const { execSync } = require('child_process')
const chokidar = require('chokidar')
const bs = require('browser-sync').create()

execSync('npm run docs')

bs.init({
  server: './dist-docs'
})

chokidar.watch('docs/**/*', { ignoreInitial: true })
  .on('add', updated)
  .on('change', updated)

function updated(path) {
  execSync('node ./scripts/build-docs.js')
  bs.reload(path)
}