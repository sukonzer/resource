﻿const isPro = process.env.NODE_ENV == 'production'
const gulp = require('gulp')
const del = require('del')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')

// Clean
gulp.task('clean', cb =>{
  del(['./dist/'], cb)
})
// build
gulp.task('build', cb =>{
  webpack(webpackConfig, info, state =>{
    console.log(info)
    cb(info)
  })
})
// Default task
gulp.task('default', ['build'], cb =>{
  gulp.start('build')
})