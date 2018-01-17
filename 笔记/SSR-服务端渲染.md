---
title: React服务端渲染-webpack环境搭建
date: 2018-01-15
tags: [服务端渲染 webpack]
categories: React
---
# SSR-服务端渲染

> 该文章代码出自：[慕课网: Webpack+React全栈工程架构项目实战精讲](https://coding.imooc.com/class/161.html) <br>
参考：[为什么现在又流行服务端渲染？ -知乎](https://www.zhihu.com/question/59578433)

服务端渲染（server side rending）其实就是多页应用的原始做法，用户访问url，后端对数据库进行增删查改填充模板返回给浏览器，这就是典型的古老版服务端渲染，内容都是由后端模板生成，而前端js更多的是做一些动态效果。

而随着前后端分离的越来越彻底以及前端发展速度越来越快，逐渐演变成了后端提供api接口，前端通过ajax获取数据进行页面渲染，随着React/Vue等框架的出现，更是将这一开发方式推向了巅峰，前端越来越重要，传统网站开始向单页面发展，然而一些问题也随之而来：

1. 单页面网站的内容渲染都是通过js完成的（客户端渲染），即浏览器最初获取的是一个空的html，这就造成了SEO问题（搜索引擎爬虫几乎抓不到ajax的内容）对于应用型toB类网站还好，但是对于门户型网站toC类网站就完蛋了。

2. 由于内容都是js生成的，这中间就存在了一个js获取数据渲染页面的过程，相较于后端模板渲染完html再发送给浏览器，存在首页白屏问题，用户体验差。

而现在强调的ssr，和之前的传统的多页面网站服务器端渲染不是同一个层次，**在现有架构不变的情况下**，即后端依旧只是提供api服务，前端人员依旧通过ajax请求数据，同时要达到传统多页应用的首屏加载速度以及seo优化。

正如人生三境界：

* 看山是山，看水是水
* 看山不是山，看水不是水
* 看山是山，看水是水

总结下，主要解决单页网站两个痛点：

1. SEO
2. 大型应用的首屏渲染

现在最常见的做法是引入一层中间层node,如下图所示（该图转自[博客园](http://www.cnblogs.com/BestMePeng/p/react_ssr.html)）。

![服务端渲染流程.png](http://upload-images.jianshu.io/upload_images/4869616-47c6964ba6154bfd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

现在这一过程通常由前端人员完成。

难点：

1. 数据同步
2. 路由跳转
3. SEO信息
4. 如何在开发时方便的进行服务端渲染的测试（热更新）

因为最近接触的是React服务端渲染，所以总结一番。也认识了自己诸多的不足，要想玩转服务端渲染，起码要有以下基础知识：

1. react基础- router redux mobx等等
2. webpack基础- publicPath webpack-dev-server 热更新
3. node基础-  基础模块（path fs...）
4. es6基础- 各种常用语法 
5. express基础- 后端路由 中间件 静态资源托管
6. 模块规范- es6模块与commonjs模块擦出的火花

![ReactSSR.png](http://upload-images.jianshu.io/upload_images/4869616-74fe294d4032c85a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 工程开发环境搭建
### 工程目录
![工程目录](http://upload-images.jianshu.io/upload_images/4869616-fa701b6252eec898.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1. build: webpack配置文件夹（客户端/服务端）

    1. webpack.config.client.js 客户端webpack配置文件
    2. webpack.config.server.js 服务端webpack配置文件

2. client: 源码文件夹

    1. App.jsx      入口组件
    2. index.js     客户端入口js文件
    3. server-entry 服务端入口js文件 
    4. template     html模板

3. node_modules:    依赖模块
4. server：         服务端文件

    1. server.js:   express启动文件
    2. util

        1. dev-static 服务端开发环境运行文件
5. babelrc： babel配置文件 
### package.json
依赖：

```json
"dependencies": {
    "axios": "^0.17.1",
    "express": "^4.16.2",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "webpack": "^3.10.0"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-es2015-loose": "^8.0.0",
    "babel-preset-react": "^6.24.1",
    "cross-env": "^5.1.3",              //  用于命令行启动webpack设置dev或者prod环境
    "html-webpack-plugin": "^2.30.1",   //  生成html文件并自动注入jswebpack插件
    "http-proxy-middleware": "^0.17.4", //  express端口转发中间件
    "memory-fs": "^0.4.1",              //  第三方fs模块 读写是在内存中进行
    "react-hot-loader": "^4.0.0-beta.13", // react热替换插件 用于维持react组件开发状态
    "rimraf": "^2.6.2",                 // 删除文件夹用的npm包
    "webpack-dev-server": "^2.11.0"     // 前端开发环境服务webpack插件
  }
```

npm scripts：
```bash
"build:client": "webpack --config build/webpack.config.client.js",
"build:server": "webpack --config build/webpack.config.server.js",
"dev:client": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js",
"dev:server": "cross-env NODE_ENV=development node server/server.js",
"clear": "rimraf dist",
"build": "npm run clear && npm run build:client && npm run build:server"
```

### 客户端相关

#### 入口js文件
此处使用了react-hot-loader，所以和平常可能有一些不一样。
```js
import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './App.jsx';

// ReactDOM.hydrate(   <App />, document.getElementById('root'));

const root = document.getElementById('root');
const render = Component => {
  ReactDOM.hydrate(
    <AppContainer>
    <Component />
  </AppContainer>, root)
}

render(App);

if (module.hot) {
  module
    .hot
    .accept('./App.jsx', () => {
      const NextApp = require('./App.jsx').default;
      // ReactDOM.hydrate(   <NextApp />, document.getElementById('root'));
      render(NextApp);
    })
}
```
#### 客户端webpack配置
客户端的webpack配置文件即我们平常**开发**单页面应用的配置，注意此处为了使结构更清晰只保留了必须的部分，并且使用了react-hot-loader保证开发环境更为舒适。

难点：
1. publicPath 
2. react-hot-loader 
3. webpack-dev-server
```js
const path = require('path');
const webpack = require('webpack');
// 生成html页面，同时可以将生成的js注入该html的插件
const HTMLWebpackPlugin = require('html-webpack-plugin');
// 判断当前环境 根据环境不同采取不同的webpack配置 在命令行中设置当前环境 要通过cross-env这个包来保证linux mac win三个平台配置一致
const isDev = process.env.NODE_ENV === 'development';
const config = {
  entry: {
    // 绝对路径 __dirname === '/Users/zhaozhiwen/Zzw/react-webpack/build'
    // 用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"。
    app: path.join(__dirname, '../client/index.js')
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    // 静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径 距离：html中引用js 由 ‘/app.js’ 变为
    // '/public/app.js'
    publicPath: '/public/'
  },
  module: {
    rules: [
      // jsx文件通过babel-loader进行处理 核心库：babel-core 插件：babel-preset-es2015
      // babel-preset-es2015-loose babel-preset-react 配置文件在根目录.babelrc中
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      // node_modules下的js代码不可以用babel编译，所以我们js和jsx分开写
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [path.join(__dirname, '../node_modules')]
      }
    ]
  },
  plugins: [new HTMLWebpackPlugin({
    // 根据模板生成html文件
      template: path.join(__dirname, '../client/template.html')
    })]
}

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
    }
  }
  config
    .plugins
    .push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
```
### 服务端相关
由之前的图可知，服务端渲染需要两部分内容：
1. html模板
2. js文件

将这两部分内容通过react服务端渲染方法结合为渲染好的html返回给浏览器，便完成了服务端渲染

#### 入口js文件
```js
import React from 'react';
import App from './App.jsx';

export default <App/>
```

#### 服务端webpack配置
这个配置是为了获得服务端渲染中所需要的js文件的webpack配置
```js
// 服务端渲染的webpack配置文件

const path = require('path');
module.exports = {
  // 打包出来的js代码执行在哪个环境
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: {
    // 服务端没有浏览器缓存 hash没必要，同时要自己手动引入js
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/public',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [path.join(__dirname, '../node_modules')]
      }
    ]
  }
}
```

####  express
有了js，再去取到硬盘上的html我们就实现了一个基础的服务端渲染demo，暂不考虑开发时的热更新等等

server/server.js
```js
const express = require('express');
const ReactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const app = express();

if (!isDev) {
  // production环境
  const serverEntry = require('../dist/server-entry').default;
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

  // 将dist目录下的所有文件都托管在public文件夹下
  app.use('/public', express.static(path.join(__dirname, '../dist')));

  app.get('*', function (req, res) {
    // 服务端渲染
    const appString = ReactSSR.renderToString(serverEntry);
    // 替换模板并返回 为啥是<!-- app --> 因为template.html根节点里面的注释，用来占位的
    res.send(template.replace('<!-- app -->', appString));
  })
} else {
  // devlopment环境
  const devStatic = require('./util/dev-static');
  devStatic(app);
}
app
  .listen(3333, function () {
    console.log('====================================');
    console.log('server is listenging on 3333');
    console.log('====================================');
  })
```

接下来，我们只需要：

1. webpack打包（服务端）
2. 启动express服务

就可以在localhost:3333端口访问到服务端渲染好的页面了，但是这里有一个问题没解决：

**每一次进行改动都需要进行打包，无法热更新**

我们之前在客户端环境折腾了许久，将webpack-dev-server,react-hot-loader啥的都配置好了，达到了一个较为满意的开发环境，但是服务端渲染都木有使用啊！！！


首先我们要知道，和生产环境不一样，开发时，webpack-dev-server是将打包文件放在内存之中的，并不是直接写文件在硬盘上，读写内存是比读写硬盘快得多的，这样我们修改源文件，反应速度就大大增加了，所以我们服务端也遵循这样的思路引入了`memory-fs`

其次，既然客户端开发的环境都搭建好了，我们就依赖客户端环境来进行热更新岂不妙哉？所以我们引入了http-proxy-middleware中间件，这样在客户端webpack-dev-server启动的条件下，我们的可以实时地获得起更新的内容。

服务端渲染需要的的js通过作为node模块的webpack的方式来进行监听打包（不能直接require进来，需要通过比较hack的方式读取为字符串转成js），那需要的html呢，并没有直接写在硬盘上，但是客户端环境是已经启动了的，我们通过axios去拿到即可。

/server/util/dev-static.js

```js
// 该文件为开发时服务端渲染的配置 可以理解为为了实现 快速 热更新 打包 的目的

const axios = require('axios');
// 在这里使用webpack，作为node的一个模块，而非命令行使用
const webpack = require('webpack');
const path = require('path');
// 第三方fs模块，api同node一致，不过是将内容写进内存 -快速
const MemoryFs = require('memory-fs');
// 静态文件代理 为了publicPath与热更新
const proxy = require('http-proxy-middleware');
const ReactDomServer = require('react-dom/server');

// 服务端wenpack配置文件
const serverConfig = require('../../build/webpack.config.server');

// 使用http请求去读取webpack-dev-server中的模板[所以依赖npm run dev:client 热更新也依赖 :p]
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

// hack 将字符串转为模块 参考：http://www.ruanyifeng.com/blog/2015/05/require.html
// 获取module的构造函数
const Module = module.constructor;
let serverBundle;

const mfs = new MemoryFs();
// 启动webpack compiler
serverCompiler = webpack(serverConfig);
// webpack提供给我们的配置项，此处将其配置为 通过mfs进行读写（内存）
serverCompiler.outputFileSystem = mfs;
// 监听entry处的文件是否有变动 若有变动重新打包
serverCompiler.watch({}, (err, stats) => {
  if (err) 
    throw err;
  stats = stats.toJson();
  // 打印错误和警告信息
  stats
    .errors
    .forEach(err => {
      console.error(err);
    });
  stats
    .warnings
    .forEach(warn => {
      console.warn(warn);
    })
  // 打包的文件所在路径
  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
  // 获取打包完成的js文件（注：文件是在内存中而非硬盘中，类比webpack-dev-server的文件）
  // 此时获得的是字符串，并非可执行的js，我们需要进行转换
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');
  // 创建一个空模块
  const m = new Module();
  // 编译字符串 要指定名字
  m._compile(bundle, 'server-entry.js');
  // 暴露出去 .default : require => es6 module
  serverBundle = m.exports.default;
})
module.exports = function (app) {
  // 将 `/public` 的请求全部代理到webpack-dev-server启动的服务 思考 express.static为啥不能用
  // 我们要借用webpack-dev=server的热更新 热更新就不是服务端渲染了 就第一次是
  app.use('/public', proxy({target: 'http://localhost:8888'}))
  app.get("*", function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle);
      res.send(template.replace('<!-- app -->', content));
    })
  })
}
```

至此，我们完成了一个最基本的环境搭建，当然，只是解决了开发环境的问题，路由啥的，数据啥的都还没弄呢。

未完待续。

