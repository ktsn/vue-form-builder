const { execSync } = require('child_process')
const chokidar = require('chokidar')
const bs = require('browser-sync').create()

bs.init({
  server: './dist-docs'
})

chokidar.watch('docs/**/*').on('all', (event, path) => {
  execSync('npm run docs')
  bs.reload(path)
})
