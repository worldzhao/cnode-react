const express = require('express')
// 设置网站图片
const favicon = require('serve-favicon')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(favicon(path.join(__dirname, '../favicon.ico')))

if (!isDev) {
  // production环境
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')

  // 将dist目录下的所有文件都托管在public文件夹下
  app.use('/public', express.static(path.join(__dirname, '../dist')))

  app.get('*', function (req, res) {
    // 服务端渲染
    const appString = ReactSSR.renderToString(serverEntry)
    // 替换模板并返回
    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  // devlopment环境
  const devStatic = require('./util/dev-static')
  devStatic(app)
}
app
  .listen(3333, function () {
    console.log('====================================')
    console.log('server is listenging on 3333')
    console.log('====================================')
  })
