// 服务端渲染的webpack配置文件
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const path = require('path')
module.exports = webpackMerge(baseConfig, {
  // 打包出来的js代码执行在哪个环境
  target: 'node',
  entry: {
    // 绝对路径 __dirname === '/Users/zhaozhiwen/Zzw/react-webpack/build'
    // 用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"。
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: {
    // 服务端没有浏览器缓存 hash没必要，同时要自己手动引入js
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  }
})
