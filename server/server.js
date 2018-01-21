const express = require('express')
// 设置网站图片
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// session配置 -使用session保存accesstoken在后端，而不是存储在前端【安全】
// 这里会给浏览器端返回一个cookie 用于和当前session对应 如果cookie不存在了 就取不出对应session【登录状态的维持】
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

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
