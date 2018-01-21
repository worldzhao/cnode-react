/*
 * @Author: 海秋
 * @Date: 2018-01-21 16:26:02
 * @Last Modified by: 海秋
 * @Last Modified time: 2018-01-21 17:24:34
 *
 * 接口代理
 */
const axios = require('axios')
const queryString = require('query-string')
const baseUrl = 'http://cnodejs.org/api/v1'

module.exports = function (req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  // needAccessToken 不论post请求抑或是get请求均放置在url后
  const needAccessToken = req.query.needAccessToken

  // 验证在需要token的情况下session中是否存在token
  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  // 对get/post分别进行参数处理
  // 如果是get请求，先拷贝一份query, 判断是否需要accesstoken
  const query = Object.assign({}, res.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })
  // 删除我们端口的needAccessToken参数
  if (query.needAccessToken) delete query.needAccessToken

  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    // {'accesstoken':'xxx'} => 'accesstoken=xxx'
    data: queryString.stringify(Object.assign({}, req.body, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
    })),
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (resp.status === 200) {
      res.send(resp.data)
    } else {
      res.status(resp.status).send(resp.data)
    }
  }).catch(err => {
    if (err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: 'unknown fault'
      })
    }
  })
}
