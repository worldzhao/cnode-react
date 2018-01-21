const path = require('path')
const webpack = require('webpack')
// webpack官方提供的用于合并webpack配置文件的包
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
// 生成html页面，同时可以将生成的js注入该html的插件
const HTMLWebpackPlugin = require('html-webpack-plugin')
// 判断当前环境 根据环境不同采取不同的webpack配置 在命令行中设置当前环境 要通过cross-env这个包来保证linux mac
// win三个平台配置一致
const isDev = process.env.NODE_ENV === 'development'
const config = webpackMerge(baseConfig, {
  entry: {
    // 绝对路径 __dirname === '/Users/zhaozhiwen/Zzw/react-webpack/build'
    // 用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"。
    app: path.join(__dirname, '../client/index.js')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [new HTMLWebpackPlugin({
    template: path.join(__dirname, '../client/template.html')
  })]
})

if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch', path.join(__dirname, '../client/index.js')
    ]
  }
  config.devServer = {
    // '0,0,0,0'表示我们可以用任何方式进行访问 如localhost 127.0.0.1 以及外网ip 若配置为'localhost'
    // 或'127.0.0.1'别人无法从外网进行调试
    host: '0.0.0.0',
    // 起服务的端口
    port: '8888',
    // 起服务的目录，此处与output一致，此处有坑(要考虑publicPath，还要知晓webpack-dev-server生成的文件在内存中，若项目中已经有
    // 了dist则以项目中的dist为准，所以删掉dist吧)
    contentBase: path.join(__dirname, '../dist'),
    // 热更新 如果不配置webpack-dev-server会在文件修改后全局刷新而非局部替换
    hot: true,
    overlay: {
      // 如果打包过程中出现错误在浏览器中渲染一层overlay进行展示
      errors: true
    },
    // 在此处设置与output相同的publicPath,把静态资源文件放在public文件夹下
    // 使得output.publicPath得以正常运行，其实这里的publicPath更像是output.path
    publicPath: '/public/',
    // 解决刷新404问题（服务端没有前端路由指向的文件） 全都返回index.html
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }
  config
    .plugins
    .push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config

/*
  为什么需要publicPath

  处理静态资源引用地址用的 比如在 CSS 中引用了图片
  打包后默认情况是 url(文件名) 这样必须确保资源文件和 CSS 处于同一目录
  但我们显然不希望这样 希望**修改打包引用地址** 修改为 img 目录下的资源 就需要这个参数了
  再比如默认打包的js也是和html在统一目录下，我们引用时并不希望这样，所以需要这个参数

  一句话总结：静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
*/

/**
 * webpack-dev-server起服务后的运行信息
  Project is running at http://0.0.0.0:8888/
  webpack output is served from /public
  Content not from webpack is served from /Users/zhaozhiwen/Zzw/react-webpack/dist
  404s will fallback to /public/index.html
 */
