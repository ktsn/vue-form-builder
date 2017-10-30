const path = require('path')
const fs = require('fs')
const pug = require('pug')

const base = path.resolve(__dirname, '../docs')
const destPath = path.resolve(__dirname, '../dist-docs/')
const mainPath = path.join(base, 'index.pug')

if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath)
}

const outputHtml = pug.renderFile(mainPath, {
  filename: mainPath,
  basedir: base,
  doctype: 'html'
})

fs.writeFileSync(path.join(destPath, 'index.html'), outputHtml)
