# webpack 与 React
 > 前言：通过各种类库（诸如vue/react）编写业务逻辑现如今只是前端开发的基本要求，而很多同学却只学了业务开发，虽然现在有很多诸如vue-cli,create-react-app等命令行工具生成项目框架，但每个公司项目各不相同，如果不理解一个项目是如何运转的，一旦碰到问题或者是新的需求就很难去做修改，很少公司会要求你将React的业务代码写得如何如何，因为这执行起来并不难，但工程架构却是每个公司的重中之重，工程架构能力已经成为了前端议价的一个标准，同时项目组织与控制开发到上线流程也是高级前端工程师与初级前端工程师的区别之一。

目前我是掌握了哪些知识？

1. ES6基础
2. React全家桶基础用法
3. 基本的Node.js知识
4. 基本的Webpack知识

所以我要学习什么？

1. 工程架构的概念，为什么我们要做架构
2. 服务端渲染的难点以及如何解决
3. React + React-Router + Mobx的项目架构模式


此次笔记主要分为以下部分：

1. 工程架构

    1. webpack配置
    2. node服务
    3. 服务端渲染基础

2. 项目架构

    1. React
    2. React-Router配置
    3. Mobx配置
    4. 服务端渲染优化

3. 业务开发

    1. 页面开发
    2. 登录服务
    3. 服务端渲染优化

4. 项目部署

    1. PM2
    2. Nginx
    3. 一键部署

## webpack

### 一些疑问

1. 浏览器不能直接运行jsx，为什么使用了webpack就可以了呢？
2. 为什么能在js文件中require图片或者css这些非js内容呢？
3. 为什么能够在不刷新页面的情况下更新我们刚写好的代码呢？
4. 我们如何操作能让正式上线的代码优化到极致呢？

## React

### React服务端渲染

#### 单页应用的问题

单页应用中所有的html内容都是通过js在浏览器进行生成的，我们在浏览器中输入一个url得到的是一个没有任何内容的html，要等待该html中引用的javascript代码加载完成之后才能渲染出来页面的内容，即我们开发时编写的jsx都是通过js代码生成html插入文档的，这就存在了几个问题：

1. SEO不友好。单页应用加载过程中html是没有任何内容的，SEO无法抓取内容。
2. 首屏时间较长，用户体验差。要等所有的javascript加载完成之后再去渲染页面，比直接加载html所耗费的时间长。

服务端渲染应运而生，依旧是React作为先驱，为我们带来了前后端同构的可能

要解决的问题有：

1. 数据同步
2. 路由跳转
3. SEO信息
4. 如何在开发时方便的进行服务端渲染的测试

## 服务端渲染工程搭建

参见笔记：React服务端渲染-webpack环境搭建

## 项目基本目录结构

1. views: views目录用于存放项目功能模块的页面，需要根据路由配置情况分割子级目录
2. config: config目录存放一些配置目录，比如第三方类库引用，路由配置等
3. store: store目录用于存放项目store相关的文件，包括数据获取的封装等
4. components: components目录用于存放非业务组件，或者在多个业务间都需要用到的功能组件

## 服务端渲染路由配置

参见笔记：React服务端渲染-路由配置

1. 什么是路由？

  路由是用来区分一个网站不同功能模块的地址，浏览器通过访问同一站点下的不同路由，来访问网站不同的功能。同样路由也让开发者区分返回的内容。

2. 如何做前端路由？

  对于前端路由与后端路由可参见我原来的[前端路由总结](https://worldzhao.github.io/2017/10/21/%E5%89%8D%E7%AB%AF%E8%B7%AF%E7%94%B1%E6%80%BB%E7%BB%93/)

  HTML5 API中的history能够让我们控制url跳转之后并不刷新页面，而是交给我们的JS代码进行相应操作。在history api出现之前，我们可以使用hash跳转来实现。

3. React中的路由

  React-Router 是一个非常好用的路由控制插件，能够让我们像书写JSX组件一样控制路由的跳转。

  推荐一篇文章：[搭建属于你自己的React Router v4](https://worldzhao.github.io/2018/01/10/%E3%80%90%E8%BD%AC%E3%80%91%E6%89%93%E9%80%A0%E5%B1%9E%E4%BA%8E%E4%BD%A0%E8%87%AA%E5%B7%B1%E7%9A%84React%20Router%20v4/)

前端基础配置：/config/router.jsx

```js
import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'

import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact />,
  <Route path="/list" component={TopicList} />,
  <Route path="/detail" component={TopicDetail} />,
]
```

## 服务端渲染store配置

参见笔记：React服务端渲染-store配置
