#!/bin/bash

set -eu

rm -rf dist-docs
npm run docs
cd dist-docs

git init
git remote add origin git@github.com:ktsn/vue-form-builder.git
git checkout -b gh-pages
git add .
git commit -m "docs: update"
git push origin gh-pages --force