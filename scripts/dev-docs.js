const { execSync } = require('child_process')
const chokidar = require('chokidar')
const bs = require('browser-sync').create()

execSync('npm run build')
execSync('cp dist/vue-form-builder.js dist-docs/')

bs.init({
  server: './dist-docs'
})

chokidar.watch('docs/**/*').on('all', (event, path) => {
  execSync('npm run docs')
  bs.reload(path)
})
