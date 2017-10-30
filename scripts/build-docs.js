const path = require('path')
const fs = require('fs')
const pug = require('pug')
const sass = require('node-sass')

const base = path.resolve(__dirname, '../docs')
const destPath = path.resolve(__dirname, '../dist-docs/')
const mainPug = path.join(base, 'index.pug')
const mainScss = path.join(base, 'style.scss')

if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath)
}

let outputHtml
try {
  outputHtml = pug.renderFile(mainPug, {
    filename: mainPug,
    basedir: base,
    doctype: 'html'
  })
} catch (err) {
  console.error(err.stack)
}

if (outputHtml) {
  fs.writeFile(path.join(destPath, 'index.html'), outputHtml, err => {
    if (err) {
      console.error(err.stack)
    }
  })
}

sass.render({
  file: mainScss,
  outputStyle: 'expanded'
}, (err, output) => {
  if (err) {
    return console.error(err.stack)
  }
  fs.writeFile(path.join(destPath, 'style.css'), output.css, err => {
    if (err) {
      console.error(err.stack)
    }
  })
})
